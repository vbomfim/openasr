#pragma once

#include "server/connection.hpp"
#include "session/session_manager.hpp"
#include "transcription/inference_pool.hpp"
#include "aggregation/result_aggregator.hpp"
#include "protocol/messages.hpp"
#include "protocol/validator.hpp"
#include "metrics/metrics.hpp"
#include <prometheus/text_serializer.h>
#include <App.h>
#include <spdlog/spdlog.h>
#include <string>
#include <random>
#include <sstream>
#include <iomanip>
#include <atomic>
#include <array>
#include <cstring>

// Forward declaration — main.cpp should define a non-static g_running
// and remove the static qualifier so this extern resolves at link time.
// Until then, WebSocketServer::stop() provides an alternative shutdown path.

namespace wss::server {

/// Generate a cryptographically secure session ID using std::random_device
/// (uses getrandom() syscall on modern Linux — no /dev/urandom file I/O)
inline std::string generate_session_id() {
    std::random_device rd;
    std::uniform_int_distribution<uint64_t> dist;
    std::mt19937_64 gen(rd());

    std::array<uint8_t, 16> bytes{};
    uint64_t a = dist(gen), b = dist(gen);
    std::memcpy(bytes.data(), &a, 8);
    std::memcpy(bytes.data() + 8, &b, 8);

    std::ostringstream oss;
    oss << std::hex << std::setfill('0');
    for (auto byte : bytes) oss << std::setw(2) << static_cast<int>(byte);
    return oss.str();
}

class WebSocketServer {
public:
    /// TLS configuration. In production, TLS termination via K8s ingress or
    /// a sidecar proxy (e.g., envoy) is recommended. Native TLS requires
    /// rebuilding with uWS::SSLApp (a different template instantiation).
    struct TlsConfig {
        std::string cert_path;
        std::string key_path;
        bool enabled;

        TlsConfig() : enabled(false) {}
        TlsConfig(std::string cert, std::string key, bool en)
            : cert_path(std::move(cert)), key_path(std::move(key)), enabled(en) {}
    };

    explicit WebSocketServer(int port,
                             session::SessionManager& session_mgr,
                             transcription::InferencePool& inference_pool,
                             const std::string& api_key = "",
                             TlsConfig tls = TlsConfig())
        : port_(port)
        , session_mgr_(session_mgr)
        , inference_pool_(inference_pool)
        , api_key_(api_key)
        , tls_config_(std::move(tls)) {
        if (tls_config_.enabled) {
            spdlog::warn("TLS enabled in config but native TLS requires uWS::SSLApp. "
                         "Use a reverse proxy (K8s ingress, envoy) for TLS termination.");
        }
    }

    /// Stop the server from any thread (closes the listen socket via event loop).
    void stop() {
        shutdown_requested_.store(true, std::memory_order_release);
        if (loop_) {
            loop_->defer([this]() {
                if (listen_socket_) {
                    us_listen_socket_close(0, listen_socket_);
                    listen_socket_ = nullptr;
                    spdlog::info("Listen socket closed, event loop will exit");
                }
            });
        }
    }

    void run() {
        uWS::App app;

        app.get("/health", [this](auto* res, auto* /*req*/) {
            nlohmann::json health;
            health["status"] = "ok";
            health["active_sessions"] = session_mgr_.active_count();
            health["max_sessions"] = session_mgr_.max_sessions();
            health["inference_pending"] = inference_pool_.pending();
            res->writeHeader("Content-Type", "application/json");
            res->end(health.dump());
        });
        
        app.get("/ready", [this](auto* res, auto* /*req*/) {
            bool model_ready = inference_pool_.backend_ready();
            bool queue_ok = inference_pool_.pending() < 50; // not overloaded
            bool sessions_ok = session_mgr_.active_count() < session_mgr_.max_sessions();

            if (model_ready && queue_ok) {
                nlohmann::json j;
                j["status"] = "ready";
                j["model_ready"] = model_ready;
                j["queue_ok"] = queue_ok;
                j["sessions_available"] = sessions_ok;
                res->writeHeader("Content-Type", "application/json");
                res->end(j.dump());
            } else {
                res->writeStatus("503 Service Unavailable");
                nlohmann::json j;
                j["status"] = "not_ready";
                j["model_ready"] = model_ready;
                j["queue_ok"] = queue_ok;
                res->writeHeader("Content-Type", "application/json");
                res->end(j.dump());
            }
        });

        app.get("/metrics", [this](uWS::HttpResponse<false>* res, uWS::HttpRequest* /*req*/) {
            (void)this;
            auto registry = metrics::Metrics::instance().registry();
            prometheus::TextSerializer serializer;
            auto collected = registry->Collect();
            auto output = serializer.Serialize(collected);
            res->writeHeader("Content-Type", "text/plain; version=0.0.4; charset=utf-8");
            res->end(output);
        });

        app.ws<ConnectionData>("/transcribe", {
            .compression = uWS::DISABLED,
            .maxPayloadLength = 16 * 1024 * 1024,
            .idleTimeout = 120,
            .maxBackpressure = 1 * 1024 * 1024,

            .upgrade = [this](auto* res, auto* req, auto* context) {
                bool authenticated = api_key_.empty(); // dev mode if no key configured

                if (!authenticated) {
                    std::string_view auth = req->getHeader("authorization");
                    if (auth.size() > 7 && auth.substr(0, 7) == "Bearer " && auth.substr(7) == api_key_) {
                        authenticated = true;
                    }
                }

                if (!authenticated) {
                    metrics::Metrics::instance().connections_rejected_auth.Increment();
                    res->writeStatus("401 Unauthorized");
                    res->end("Invalid or missing API key. Use Authorization: Bearer <key> header.");
                    return;
                }

                res->template upgrade<ConnectionData>(
                    {},
                    req->getHeader("sec-websocket-key"),
                    req->getHeader("sec-websocket-protocol"),
                    req->getHeader("sec-websocket-extensions"),
                    context
                );
            },

            .open = [this](auto* ws) {
                metrics::Metrics::instance().connections_total.Increment();
                if (active_connections_.fetch_add(1) >= kMaxConnections) {
                    active_connections_.fetch_sub(1);
                    metrics::Metrics::instance().connections_rejected_limit.Increment();
                    ws->close();
                    spdlog::warn("Connection rejected: max connections ({}) reached", kMaxConnections);
                    return;
                }
                metrics::Metrics::instance().active_connections.Increment();
                spdlog::info("Client connected ({} active)", active_connections_.load());
                auto* data = ws->getUserData();
                data->state = ConnectionState::CONNECTED;
            },

            .message = [this](auto* ws, std::string_view message, uWS::OpCode opCode) {
                handle_message(ws, message, opCode);
            },

            .close = [this](auto* ws, int code, std::string_view message) {
                active_connections_.fetch_sub(1);
                metrics::Metrics::instance().active_connections.Decrement();
                auto* data = ws->getUserData();
                spdlog::info("Client disconnected: session={} code={} reason={}",
                    data->session_id, code, message);
                if (!data->session_id.empty()) {
                    // Drain buffered windows before destroying session
                    auto* session = session_mgr_.get_session(data->session_id);
                    if (session) {
                        while (session->window_ready()) {
                            auto window = session->extract_window();
                            if (window.count == 0) break;
                            transcription::InferenceJob job;
                            job.session_id = data->session_id;
                            job.audio.assign(window.samples, window.samples + window.count);
                            job.window_start_ms = window.start_ms;
                            job.window_end_ms = window.end_ms;
                            job.on_complete = [this](const std::string& sid,
                                                     transcription::TranscriptionResult result,
                                                     int64_t start_ms, int64_t end_ms) {
                                on_inference_complete(sid, std::move(result), start_ms, end_ms);
                            };
                            inference_pool_.submit(std::move(job));
                        }
                    }
                    ws->unsubscribe(data->session_id);
                    session_mgr_.destroy_session(data->session_id);
                    metrics::Metrics::instance().sessions_destroyed_total.Increment();
                    metrics::Metrics::instance().active_sessions.Decrement();
                }
                data->state = ConnectionState::CLOSED;
            }
        });

        app.listen(port_, [this](auto* listen_socket) {
            if (listen_socket) {
                listen_socket_ = listen_socket;
                spdlog::info("Listening on port {}", port_);
            } else {
                spdlog::error("Failed to listen on port {}", port_);
            }
        });

        // Store pointer for use by send_to_session
        app_ = &app;
        loop_ = uWS::Loop::get();

        // Periodically check for shutdown signal (every 1s)
        auto* timer_loop = reinterpret_cast<struct us_loop_t*>(loop_);
        struct us_timer_t* shutdown_timer = us_create_timer(timer_loop, 0, sizeof(WebSocketServer*));
        *static_cast<WebSocketServer**>(us_timer_ext(shutdown_timer)) = this;
        us_timer_set(shutdown_timer, [](struct us_timer_t* t) {
            auto* self = *static_cast<WebSocketServer**>(us_timer_ext(t));
            if (self->shutdown_requested_.load(std::memory_order_acquire)) {
                if (self->listen_socket_) {
                    us_listen_socket_close(0, self->listen_socket_);
                    self->listen_socket_ = nullptr;
                    spdlog::info("Shutdown: listen socket closed");
                }
                us_timer_close(t);
            }
        }, 1000, 1000);

        app.run();
    }

    /// Post a message to a session's client from any thread (thread-safe).
    void send_to_session(const std::string& session_id, std::string message) {
        if (!loop_ || !app_) return;
        loop_->defer([this, session_id, msg = std::move(message)]() {
            app_->publish(session_id, msg, uWS::OpCode::TEXT);
        });
    }

private:
    using WebSocket = uWS::WebSocket<false, true, ConnectionData>;

    void handle_message(WebSocket* ws, std::string_view message, uWS::OpCode opCode) {
        auto* conn = ws->getUserData();

        spdlog::debug("Message received: opCode={} size={} session={}",
            static_cast<int>(opCode), message.size(), conn->session_id);

        if (opCode == uWS::OpCode::BINARY) {
            handle_binary(ws, conn, message);
            return;
        }

        // Parse JSON
        nlohmann::json msg;
        try {
            msg = nlohmann::json::parse(message);
        } catch (const nlohmann::json::parse_error& e) {
            send_error(ws, conn->session_id, "INVALID_MESSAGE",
                "Failed to parse JSON");
            return;
        }

        // Validate envelope
        auto vr = protocol::validate_envelope(msg);
        if (!vr.valid) {
            send_error(ws, conn->session_id, vr.error_code, vr.error_message);
            return;
        }

        auto type_str = msg["type"].get<std::string>();
        auto type = protocol::parse_message_type(type_str);

        if (!type) {
            send_error(ws, conn->session_id, "INVALID_MESSAGE",
                "Unknown message type: " + type_str);
            return;
        }

        switch (*type) {
            case protocol::MessageType::SPEECH_CONFIG:
                handle_speech_config(ws, conn, msg["payload"]);
                break;
            case protocol::MessageType::SPEECH_END:
                handle_speech_end(ws, conn);
                break;
            default:
                send_error(ws, conn->session_id, "INVALID_MESSAGE",
                    "Unexpected message type from client: " + type_str);
                break;
        }
    }

    void handle_speech_config(WebSocket* ws, ConnectionData* conn, const nlohmann::json& payload) {
        if (conn->state != ConnectionState::CONNECTED) {
            send_error(ws, conn->session_id, "INVALID_STATE",
                "speech.config only allowed in CONNECTED state");
            return;
        }

        auto vr = protocol::validate_speech_config(payload);
        if (!vr.valid) {
            send_error(ws, conn->session_id, vr.error_code, vr.error_message);
            return;
        }

        protocol::SpeechConfigPayload config;
        try {
            config = payload.get<protocol::SpeechConfigPayload>();
        } catch (const nlohmann::json::exception& e) {
            send_error(ws, conn->session_id, "INVALID_MESSAGE",
                std::string("Invalid speech.config payload: ") + e.what());
            return;
        }

        // Assign or resume session
        if (config.resume_checkpoint) {
            conn->session_id = config.resume_checkpoint->session_id;
            spdlog::info("Resuming session: {}", conn->session_id);
        } else {
            conn->session_id = generate_session_id();
            spdlog::info("New session: {}", conn->session_id);
        }

        // Store encoding in connection data (used for all binary frames)
        conn->encoding = config.encoding;

        // Create session in SessionManager
        session::Session::Config sess_cfg{
            .session_id = conn->session_id,
            .language = config.language,
            .sample_rate = config.sample_rate,
            .encoding = config.encoding,
            .window_duration_ms = config.window_duration_ms,
            .overlap_duration_ms = config.overlap_duration_ms,
            .backend_model_id = config.model_id,
            .ring_buffer_seconds = 30.0f
        };
        auto* session = session_mgr_.create_session(std::move(sess_cfg));
        if (!session) {
            send_error(ws, conn->session_id, "SESSION_LIMIT",
                "Maximum concurrent sessions reached");
            conn->state = ConnectionState::CLOSED;
            ws->close();
            return;
        }

        metrics::Metrics::instance().sessions_created_total.Increment();
        metrics::Metrics::instance().active_sessions.Increment();

        // Restore from checkpoint if resuming
        if (config.resume_checkpoint) {
            session->restore_from_checkpoint(*config.resume_checkpoint);
        }

        // Send speech.config.ack
        protocol::SpeechConfigAckPayload ack;
        ack.session_id = conn->session_id;
        ack.effective_config = config;
        if (config.resume_checkpoint) {
            ack.checkpoint = *config.resume_checkpoint;
        }

        auto response = protocol::make_speech_config_ack(conn->session_id, ack);
        ws->send(response, uWS::OpCode::TEXT);

        // Subscribe to session topic for async result delivery
        ws->subscribe(conn->session_id);

        conn->state = ConnectionState::STREAMING;
    }

    void handle_binary(WebSocket* ws, ConnectionData* conn, std::string_view data) {
        if (conn->state != ConnectionState::STREAMING) {
            send_error(ws, conn->session_id, "INVALID_STATE",
                "Binary data only allowed during STREAMING");
            return;
        }

        auto* session = session_mgr_.get_session(conn->session_id);
        if (!session) {
            send_error(ws, conn->session_id, "SESSION_NOT_FOUND",
                "Session not found");
            return;
        }

        // Pass raw audio bytes directly to session pipeline
        size_t written;
        try {
            written = session->ingest_audio(
                reinterpret_cast<const uint8_t*>(data.data()), data.size());
        } catch (const std::exception& e) {
            spdlog::error("Audio ingestion error: session={} error={}", conn->session_id, e.what());
            send_error(ws, conn->session_id, "AUDIO_ERROR", e.what());
            return;
        }

        metrics::Metrics::instance().audio_bytes_received_total.Increment(static_cast<double>(data.size()));
        metrics::Metrics::instance().audio_chunks_received_total.Increment();

        spdlog::debug("Binary ingested: session={} bytes={} written={} ring_total={} window_sz={} window_ready={}",
            conn->session_id, data.size(), written,
            session->ring_buffer_total_written(),
            session->window_samples(),
            session->window_ready());

        // Check ring buffer fill level and send BACKPRESSURE if needed
        float fill = session->ring_buffer_fill_ratio();
        if (fill > 0.8f && !conn->backpressure_sent) {
            metrics::Metrics::instance().backpressure_events_total.Increment();
            send_to_session(conn->session_id,
                protocol::make_speech_backpressure(conn->session_id, "slow_down"));
            conn->backpressure_sent = true;
        } else if (fill < 0.5f && conn->backpressure_sent) {
            send_to_session(conn->session_id,
                protocol::make_speech_backpressure(conn->session_id, "ok"));
            conn->backpressure_sent = false;
        }

        // Check if a window is ready and dispatch inference
        while (session->window_ready()) {
            auto window = session->extract_window();
            if (window.count == 0) break;

            // Copy window data into the job (ring buffer may be overwritten)
            transcription::InferenceJob job;
            job.session_id = conn->session_id;
            job.audio.assign(window.samples, window.samples + window.count);
            job.window_start_ms = window.start_ms;
            job.window_end_ms = window.end_ms;

            // Capture ws for callback — NOTE: uWS callbacks must be called from the event loop
            // For now, log results. Full async delivery requires uWS loop integration.
            job.on_complete = [this](const std::string& sid,
                                     transcription::TranscriptionResult result,
                                     int64_t start_ms, int64_t end_ms) {
                on_inference_complete(sid, std::move(result), start_ms, end_ms);
            };

            inference_pool_.submit(std::move(job));
            metrics::Metrics::instance().inference_jobs_submitted_total.Increment();
            spdlog::debug("Inference job submitted: session={} window=[{}ms, {}ms]",
                conn->session_id, window.start_ms, window.end_ms);
        }
    }

    void on_inference_complete(const std::string& session_id,
                               transcription::TranscriptionResult result,
                               int64_t window_start_ms, int64_t window_end_ms) {
        metrics::Metrics::instance().inference_jobs_completed_total.Increment();
        metrics::Metrics::instance().inference_queue_depth.Decrement();
        metrics::Metrics::instance().transcription_segments_total.Increment(
            static_cast<double>(result.segments.size()));

        auto* session = session_mgr_.get_session(session_id);
        if (!session) return;

        // Use ResultAggregator for overlap deduplication
        session->add_transcription_result(result.segments, window_start_ms, window_end_ms);
        session->set_last_audio_ms(window_end_ms);

        spdlog::info("Transcription complete: session={} window=[{}ms, {}ms] segments={}",
            session_id, window_start_ms, window_end_ms, result.segments.size());

        // Send speech.hypothesis for each segment (interim/partial)
        for (const auto& seg : result.segments) {
            protocol::HypothesisPayload hyp;
            hyp.offset = seg.start_ms;
            hyp.duration = seg.end_ms - seg.start_ms;
            hyp.text = seg.text;
            send_to_session(session_id,
                protocol::make_speech_hypothesis(session_id, hyp));
        }

        // Send speech.phrase for the completed window (finalized turn)
        std::string window_text;
        for (const auto& seg : result.segments) {
            if (!window_text.empty() && !seg.text.empty()) window_text += ' ';
            window_text += seg.text;
        }
        protocol::PhrasePayload phrase;
        phrase.offset = window_start_ms;
        phrase.duration = window_end_ms - window_start_ms;
        phrase.text = window_text;
        phrase.confidence = 1.0f;
        phrase.status = "Success";
        send_to_session(session_id,
            protocol::make_speech_phrase(session_id, phrase));

        // Send speech.checkpoint with full accumulated transcript
        auto checkpoint = session->make_checkpoint();
        send_to_session(session_id,
            protocol::make_speech_checkpoint(session_id, checkpoint));
    }

    void handle_speech_end(WebSocket* ws, ConnectionData* conn) {
        if (conn->state != ConnectionState::STREAMING &&
            conn->state != ConnectionState::HELLO_RECEIVED) {
            send_error(ws, conn->session_id, "INVALID_STATE",
                "speech.end only allowed after speech.config");
            return;
        }

        conn->state = ConnectionState::ENDING;
        spdlog::info("Session ending: {}", conn->session_id);

        auto* session = session_mgr_.get_session(conn->session_id);
        if (session) {
            // Process any remaining buffered audio windows
            while (session->window_ready()) {
                auto window = session->extract_window();
                if (window.count == 0) break;

                transcription::InferenceJob job;
                job.session_id = conn->session_id;
                job.audio.assign(window.samples, window.samples + window.count);
                job.window_start_ms = window.start_ms;
                job.window_end_ms = window.end_ms;
                job.on_complete = [this](const std::string& sid,
                                         transcription::TranscriptionResult result,
                                         int64_t start_ms, int64_t end_ms) {
                    on_inference_complete(sid, std::move(result), start_ms, end_ms);
                };
                inference_pool_.submit(std::move(job));
            }

            // Build speech.phrase from accumulated session transcript
            protocol::PhrasePayload phrase;
            phrase.offset = 0;
            phrase.duration = session->last_audio_ms();
            phrase.text = session->transcript();
            phrase.confidence = 1.0f;
            phrase.status = "EndOfStream";
            ws->send(protocol::make_speech_phrase(conn->session_id, phrase),
                     uWS::OpCode::TEXT);

            // Final checkpoint
            auto checkpoint = session->make_checkpoint();
            ws->send(protocol::make_speech_checkpoint(conn->session_id, checkpoint),
                     uWS::OpCode::TEXT);
        }

        ws->unsubscribe(conn->session_id);
        session_mgr_.destroy_session(conn->session_id);
        metrics::Metrics::instance().sessions_destroyed_total.Increment();
        metrics::Metrics::instance().active_sessions.Decrement();
        conn->state = ConnectionState::CLOSED;
    }

    void send_error(WebSocket* ws, const std::string& session_id,
                    const std::string& code, const std::string& message) {
        metrics::Metrics::instance().errors_total.Increment();
        spdlog::warn("Error: session={} code={} msg={}", session_id, code, message);
        auto response = protocol::make_speech_error(session_id, code, message);
        ws->send(response, uWS::OpCode::TEXT);
    }

    uWS::App* app_ = nullptr; // non-owning, lifetime managed by run()
    uWS::Loop* loop_ = nullptr;
    us_listen_socket_t* listen_socket_ = nullptr;
    std::atomic<bool> shutdown_requested_{false};
    int port_;
    session::SessionManager& session_mgr_;
    transcription::InferencePool& inference_pool_;
    std::string api_key_;
    TlsConfig tls_config_;
    std::atomic<size_t> active_connections_{0};
    static constexpr size_t kMaxConnections = 100;
};

} // namespace wss::server
