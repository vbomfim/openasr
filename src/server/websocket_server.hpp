#pragma once

#include "server/connection.hpp"
#include "session/session_manager.hpp"
#include "transcription/inference_pool.hpp"
#include "aggregation/result_aggregator.hpp"
#include "protocol/messages.hpp"
#include "protocol/validator.hpp"
#include <App.h>
#include <spdlog/spdlog.h>
#include <string>
#include <random>
#include <sstream>
#include <iomanip>
#include <atomic>

// Forward declaration — main.cpp should define a non-static g_running
// and remove the static qualifier so this extern resolves at link time.
// Until then, WebSocketServer::stop() provides an alternative shutdown path.

namespace wss::server {

/// Generate a cryptographically-influenced session ID
inline std::string generate_session_id() {
    std::random_device rd;
    std::mt19937_64 gen(rd());
    std::uniform_int_distribution<uint64_t> dist;
    std::ostringstream oss;
    oss << std::hex << std::setfill('0')
        << std::setw(16) << dist(gen) << "-"
        << std::setw(16) << dist(gen);
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
                             TlsConfig tls = TlsConfig())
        : port_(port)
        , session_mgr_(session_mgr)
        , inference_pool_(inference_pool)
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
        
        app.ws<ConnectionData>("/transcribe", {
            .compression = uWS::DISABLED,
            .maxPayloadLength = 16 * 1024 * 1024,
            .idleTimeout = 120,
            .maxBackpressure = 1 * 1024 * 1024,

            .open = [](auto* ws) {
                spdlog::info("Client connected");
                auto* data = ws->getUserData();
                data->state = ConnectionState::CONNECTED;
            },

            .message = [this](auto* ws, std::string_view message, uWS::OpCode opCode) {
                handle_message(ws, message, opCode);
            },

            .close = [this](auto* ws, int code, std::string_view message) {
                auto* data = ws->getUserData();
                spdlog::info("Client disconnected: session={} code={} reason={}",
                    data->session_id, code, message);
                if (!data->session_id.empty()) {
                    ws->unsubscribe(data->session_id);
                    session_mgr_.destroy_session(data->session_id);
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
            case protocol::MessageType::HELLO:
                handle_hello(ws, conn, msg["payload"]);
                break;
            case protocol::MessageType::AUDIO_CHUNK:
                handle_audio_chunk_meta(ws, conn, msg["payload"]);
                break;
            case protocol::MessageType::END:
                handle_end(ws, conn);
                break;
            default:
                send_error(ws, conn->session_id, "INVALID_MESSAGE",
                    "Unexpected message type from client: " + type_str);
                break;
        }
    }

    void handle_hello(WebSocket* ws, ConnectionData* conn, const nlohmann::json& payload) {
        if (conn->state != ConnectionState::CONNECTED) {
            send_error(ws, conn->session_id, "INVALID_STATE",
                "HELLO only allowed in CONNECTED state");
            return;
        }

        auto vr = protocol::validate_hello(payload);
        if (!vr.valid) {
            send_error(ws, conn->session_id, vr.error_code, vr.error_message);
            return;
        }

        auto hello = payload.get<protocol::HelloPayload>();

        // Assign or resume session
        if (hello.resume_from_checkpoint && hello.checkpoint) {
            conn->session_id = hello.checkpoint->session_id;
            spdlog::info("Resuming session: {}", conn->session_id);
        } else {
            conn->session_id = generate_session_id();
            spdlog::info("New session: {}", conn->session_id);
        }

        conn->state = ConnectionState::HELLO_RECEIVED;

        // Create session in SessionManager
        session::Session::Config sess_cfg{
            .session_id = conn->session_id,
            .language = hello.language,
            .sample_rate = hello.sample_rate,
            .encoding = "pcm_s16le", // default; may be overridden per chunk
            .window_duration_ms = hello.buffer_config.window_duration_ms,
            .overlap_duration_ms = hello.buffer_config.overlap_duration_ms,
            .backend_model_id = hello.backend_model_id,
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

        // Restore from checkpoint if resuming
        if (hello.resume_from_checkpoint && hello.checkpoint) {
            session->restore_from_checkpoint(*hello.checkpoint);
        }

        // Send HELLO_ACK
        protocol::HelloAckPayload ack;
        ack.effective_buffer_config = hello.buffer_config;
        if (hello.checkpoint) {
            ack.checkpoint = *hello.checkpoint;
        }

        auto response = protocol::make_hello_ack(conn->session_id, ack);
        ws->send(response, uWS::OpCode::TEXT);

        // Subscribe to session topic for async result delivery
        ws->subscribe(conn->session_id);

        conn->state = ConnectionState::STREAMING;
    }

    void handle_audio_chunk_meta(WebSocket* ws, ConnectionData* conn,
                                 const nlohmann::json& payload) {
        if (conn->state != ConnectionState::STREAMING &&
            conn->state != ConnectionState::HELLO_RECEIVED) {
            send_error(ws, conn->session_id, "INVALID_STATE",
                "AUDIO_CHUNK only allowed after HELLO");
            return;
        }

        auto vr = protocol::validate_audio_chunk(payload);
        if (!vr.valid) {
            send_error(ws, conn->session_id, vr.error_code, vr.error_message);
            return;
        }

        conn->state = ConnectionState::STREAMING;

        // Store metadata; the next binary frame carries the actual audio data
        auto meta = payload.get<protocol::AudioChunkMetadata>();
        conn->pending_audio.valid = true;
        conn->pending_audio.chunk_id = meta.chunk_id;
        conn->pending_audio.timestamp_ms = meta.timestamp_ms;
        conn->pending_audio.encoding = meta.encoding;
        conn->pending_audio.duration_ms = meta.duration_ms;

        spdlog::debug("Audio chunk metadata: session={} ts={}ms encoding={}",
            conn->session_id, meta.timestamp_ms, meta.encoding);
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

        // Resolve encoding: prefer per-chunk metadata, fall back to session default
        std::string encoding = conn->pending_audio.valid ?
            conn->pending_audio.encoding : session->config().encoding;
        conn->pending_audio.valid = false;

        // Pass raw audio bytes directly to session pipeline
        session->ingest_audio(
            reinterpret_cast<const uint8_t*>(data.data()), data.size(), encoding);

        // Check ring buffer fill level and send BACKPRESSURE if needed
        float fill = session->ring_buffer_fill_ratio();
        if (fill > 0.8f && !conn->backpressure_sent) {
            send_to_session(conn->session_id,
                protocol::make_backpressure(conn->session_id, "slow_down"));
            conn->backpressure_sent = true;
        } else if (fill < 0.5f && conn->backpressure_sent) {
            send_to_session(conn->session_id,
                protocol::make_backpressure(conn->session_id, "ok"));
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
            spdlog::debug("Inference job submitted: session={} window=[{}ms, {}ms]",
                conn->session_id, window.start_ms, window.end_ms);
        }
    }

    void on_inference_complete(const std::string& session_id,
                               transcription::TranscriptionResult result,
                               int64_t window_start_ms, int64_t window_end_ms) {
        auto* session = session_mgr_.get_session(session_id);
        if (!session) return;

        // Use ResultAggregator for overlap deduplication
        session->add_transcription_result(result.segments, window_start_ms, window_end_ms);
        session->set_last_audio_ms(window_end_ms);

        spdlog::info("Transcription complete: session={} window=[{}ms, {}ms] segments={}",
            session_id, window_start_ms, window_end_ms, result.segments.size());

        // Build PARTIAL_TRANSCRIPT
        protocol::PartialTranscriptPayload partial;
        partial.window_start_ms = window_start_ms;
        partial.window_end_ms = window_end_ms;
        partial.is_stable = true;
        for (const auto& seg : result.segments) {
            partial.segments.push_back({
                .start_ms = seg.start_ms,
                .end_ms = seg.end_ms,
                .text = seg.text,
                .speaker = seg.speaker
            });
        }
        send_to_session(session_id,
            protocol::make_partial_transcript(session_id, partial));

        // Build and send CHECKPOINT
        auto checkpoint = session->make_checkpoint();
        send_to_session(session_id,
            protocol::make_checkpoint(session_id, checkpoint));
    }

    void handle_end(WebSocket* ws, ConnectionData* conn) {
        if (conn->state != ConnectionState::STREAMING &&
            conn->state != ConnectionState::HELLO_RECEIVED) {
            send_error(ws, conn->session_id, "INVALID_STATE",
                "END only allowed after HELLO");
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

            // Build FINAL_TRANSCRIPT from accumulated session transcript
            protocol::FinalTranscriptPayload final_payload;
            final_payload.segments.push_back({
                .start_ms = 0,
                .end_ms = session->last_audio_ms(),
                .text = session->transcript(),
                .speaker = ""
            });
            ws->send(protocol::make_final_transcript(conn->session_id, final_payload),
                     uWS::OpCode::TEXT);

            // Final checkpoint
            auto checkpoint = session->make_checkpoint();
            ws->send(protocol::make_checkpoint(conn->session_id, checkpoint),
                     uWS::OpCode::TEXT);
        }

        ws->unsubscribe(conn->session_id);
        session_mgr_.destroy_session(conn->session_id);
        conn->state = ConnectionState::CLOSED;
    }

    void send_error(WebSocket* ws, const std::string& session_id,
                    const std::string& code, const std::string& message) {
        spdlog::warn("Error: session={} code={} msg={}", session_id, code, message);
        auto response = protocol::make_error(session_id, code, message);
        ws->send(response, uWS::OpCode::TEXT);
    }

    uWS::App* app_ = nullptr; // non-owning, lifetime managed by run()
    uWS::Loop* loop_ = nullptr;
    us_listen_socket_t* listen_socket_ = nullptr;
    std::atomic<bool> shutdown_requested_{false};
    int port_;
    session::SessionManager& session_mgr_;
    transcription::InferencePool& inference_pool_;
    TlsConfig tls_config_;
};

} // namespace wss::server
