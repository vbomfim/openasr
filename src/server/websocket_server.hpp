#pragma once

#include "server/connection.hpp"
#include "server/auth_rate_limiter.hpp"
#include "server/ip_extraction.hpp"
#include "server/constant_time.hpp"
#include "server/session_id.hpp"
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
#include <chrono>
#include <mutex>
#include <unordered_map>

// Forward declaration — main.cpp should define a non-static g_running
// and remove the static qualifier so this extern resolves at link time.
// Until then, WebSocketServer::stop() provides an alternative shutdown path.

namespace wss::server {

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
                             int io_threads = 1,
                             TlsConfig tls = TlsConfig(),
                             int auth_rate_max = 10,
                             int auth_rate_window = 60,
                             int msg_rate_max = 100,
                             int msg_rate_bytes_max = 640000,
                             bool trust_proxy = false,
                             size_t max_tracked_ips = 10000)
        : port_(port)
        , io_thread_count_(std::max(1, io_threads))
        , session_mgr_(session_mgr)
        , inference_pool_(inference_pool)
        , api_key_(api_key)
        , tls_config_(std::move(tls))
        , trust_proxy_(trust_proxy)
        , msg_rate_limit_max_per_sec_(msg_rate_max)
        , msg_rate_limit_max_bytes_per_sec_(msg_rate_bytes_max) {
        auth_limiter_.max_failures = static_cast<size_t>(auth_rate_max);
        auth_limiter_.window_secs = std::chrono::seconds(auth_rate_window);
        auth_limiter_.max_tracked_ips = max_tracked_ips;
        if (tls_config_.enabled) {
            spdlog::warn("TLS enabled in config but native TLS requires uWS::SSLApp. "
                         "Use a reverse proxy (K8s ingress, envoy) for TLS termination.");
        }
    }

    /// Stop the server from any thread.
    void stop() {
        shutdown_requested_.store(true, std::memory_order_release);
        // Defer close on all event loops
        std::lock_guard lock(apps_mutex_);
        for (auto* loop : all_loops_) {
            if (loop) {
                loop->defer([this]() {
                    std::lock_guard lock2(apps_mutex_);
                    for (auto* ls : listen_sockets_) {
                        if (ls) us_listen_socket_close(0, ls);
                    }
                    listen_sockets_.clear();
                });
                break; // one defer is enough — shutdown timer handles the rest
            }
        }
    }

    void run() {
        if (io_thread_count_ <= 1) {
            // Single-threaded mode (original behavior)
            run_single_threaded();
        } else {
            // Multi-threaded: N threads, each with own App + event loop
            spdlog::info("Starting {} I/O threads", io_thread_count_);
            run_multi_threaded();
        }
    }

    /// Post a message to a session's client from any thread (thread-safe).
    /// Publishes to all I/O thread apps so the correct one delivers it.
    void send_to_session(const std::string& session_id, std::string message) {
        std::lock_guard lock(apps_mutex_);
        for (size_t i = 0; i < all_loops_.size(); ++i) {
            auto* loop = all_loops_[i];
            auto* app = all_apps_[i];
            if (loop && app) {
                loop->defer([app, session_id, msg = message]() {
                    app->publish(session_id, msg, uWS::OpCode::TEXT);
                });
            }
        }
    }

private:
    using WebSocket = uWS::WebSocket<false, true, ConnectionData>;

    void configure_app(uWS::App& app) {
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
                // Extract client IP — only trust X-Forwarded-For behind a known proxy
                std::string client_ip = extract_client_ip(
                    req->getHeader("x-forwarded-for"),
                    res->getRemoteAddressAsText(),
                    trust_proxy_);

                // Check if IP is already rate-limited (#20)
                if (!api_key_.empty() && auth_limiter_.is_blocked(client_ip)) {
                    metrics::Metrics::instance().connections_rejected_auth.Increment();
                    spdlog::warn("Auth rate limited: ip={} (too many failures)", client_ip);
                    res->writeStatus("429 Too Many Requests");
                    res->end("Too many authentication failures. Try again later.");
                    return;
                }

                bool authenticated = api_key_.empty(); // dev mode if no key configured

                if (!authenticated) {
                    std::string_view auth = req->getHeader("authorization");
                    if (auth.size() > 7 && auth.substr(0, 7) == "Bearer " &&
                        constant_time_equals(auth.substr(7), api_key_)) {
                        authenticated = true;
                    }
                }

                if (!authenticated) {
                    bool now_blocked = auth_limiter_.check_and_record_failure(client_ip);
                    metrics::Metrics::instance().connections_rejected_auth.Increment();
                    spdlog::warn("Auth failed: ip={}{}", client_ip,
                        now_blocked ? " (now rate-limited)" : "");
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
    }

    void run_single_threaded() {
        uWS::App app;
        configure_app(app);

        app.listen(port_, [this](auto* listen_socket) {
            if (listen_socket) {
                std::lock_guard lock(apps_mutex_);
                listen_sockets_.push_back(listen_socket);
                spdlog::info("Listening on port {}", port_);
            } else {
                spdlog::error("Failed to listen on port {}", port_);
            }
        });

        app_ = &app;
        loop_ = uWS::Loop::get();
        {
            std::lock_guard lock(apps_mutex_);
            all_apps_.push_back(&app);
            all_loops_.push_back(loop_);
        }

        setup_shutdown_timer(loop_);
        app.run();
    }

    void run_multi_threaded() {
        // Thread 0 runs on the main thread, threads 1..N-1 are spawned
        for (int i = 1; i < io_thread_count_; ++i) {
            io_threads_.emplace_back([this, i]() {
                uWS::App app;
                configure_app(app);

                us_listen_socket_t* ls = nullptr;
                app.listen(port_, [&ls, this, i](auto* listen_socket) {
                    if (listen_socket) {
                        ls = listen_socket;
                        std::lock_guard lock(apps_mutex_);
                        listen_sockets_.push_back(listen_socket);
                        spdlog::info("I/O thread {} listening on port {}", i, port_);
                    }
                });

                auto* loop = uWS::Loop::get();
                {
                    std::lock_guard lock(apps_mutex_);
                    all_apps_.push_back(&app);
                    all_loops_.push_back(loop);
                }

                setup_shutdown_timer(loop);
                app.run();

                spdlog::info("I/O thread {} exited", i);
            });
        }

        // Thread 0 (main thread)
        uWS::App app;
        configure_app(app);

        app.listen(port_, [this](auto* listen_socket) {
            if (listen_socket) {
                std::lock_guard lock(apps_mutex_);
                listen_sockets_.push_back(listen_socket);
                spdlog::info("I/O thread 0 listening on port {}", port_);
            } else {
                spdlog::error("Failed to listen on port {}", port_);
            }
        });

        app_ = &app;
        loop_ = uWS::Loop::get();
        {
            std::lock_guard lock(apps_mutex_);
            all_apps_.push_back(&app);
            all_loops_.push_back(loop_);
        }

        setup_shutdown_timer(loop_);
        app.run();

        // Wait for worker I/O threads
        for (auto& t : io_threads_) {
            if (t.joinable()) t.join();
        }
        spdlog::info("All I/O threads exited");
    }

    void setup_shutdown_timer(uWS::Loop* loop) {
        auto* timer_loop = reinterpret_cast<struct us_loop_t*>(loop);
        struct us_timer_t* shutdown_timer = us_create_timer(timer_loop, 0, sizeof(WebSocketServer*));
        *static_cast<WebSocketServer**>(us_timer_ext(shutdown_timer)) = this;
        us_timer_set(shutdown_timer, [](struct us_timer_t* t) {
            auto* self = *static_cast<WebSocketServer**>(us_timer_ext(t));
            if (!self->shutdown_requested_.load(std::memory_order_acquire)) return;

            // Phase 1: Close listen sockets (only once)
            if (!self->draining_.load()) {
                {
                    std::lock_guard lock(self->apps_mutex_);
                    for (auto* ls : self->listen_sockets_) {
                        if (ls) us_listen_socket_close(0, ls);
                    }
                    self->listen_sockets_.clear();
                }
                spdlog::info("Shutdown phase 1: listen sockets closed, draining inference...");

                // Drain all active sessions' buffered windows
                auto session_ids = self->session_mgr_.active_session_ids();
                for (const auto& sid : session_ids) {
                    auto* session = self->session_mgr_.get_session(sid);
                    if (!session) continue;
                    while (session->window_ready()) {
                        auto window = session->extract_window();
                        if (window.count == 0) break;
                        transcription::InferenceJob job;
                        job.session_id = sid;
                        job.audio.assign(window.samples, window.samples + window.count);
                        job.window_start_ms = window.start_ms;
                        job.window_end_ms = window.end_ms;
                        job.on_complete = [self](const std::string& s,
                                                  transcription::TranscriptionResult r,
                                                  int64_t a, int64_t b) {
                            self->on_inference_complete(s, std::move(r), a, b);
                        };
                        self->inference_pool_.submit(std::move(job));
                    }
                }
                self->draining_.store(true);
                self->drain_start_ = std::chrono::steady_clock::now();
                return; // check again on next timer tick
            }

            // Phase 2: Wait for drain or timeout
            auto elapsed = std::chrono::steady_clock::now() - self->drain_start_;
            bool drained = self->inference_pool_.drain_complete();
            bool timed_out = elapsed > std::chrono::seconds(30);

            if (drained || timed_out) {
                if (timed_out) {
                    spdlog::warn("Shutdown drain timed out after 30s, forcing exit");
                } else {
                    spdlog::info("Shutdown phase 2: inference drain complete");
                }
                us_timer_close(t);
                // Event loop will exit when all sockets are closed
            }
        }, 200, 200);
    }

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
            // Validate that the session exists before allowing resume (#38)
            auto* existing = session_mgr_.get_session(
                config.resume_checkpoint->session_id);
            if (!existing) {
                send_error(ws, conn->session_id, "SESSION_NOT_FOUND",
                    "Cannot resume: session does not exist");
                return;
            }
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
            .ring_buffer_seconds = 30.0f,
            .vad_enabled = config.vad_enabled
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

        // Per-session message rate limiting (#21)
        auto now = std::chrono::steady_clock::now();
        auto elapsed = std::chrono::duration_cast<std::chrono::seconds>(
            now - conn->rate_window_start);
        if (elapsed >= std::chrono::seconds(1)) {
            // Reset window
            conn->messages_this_window = 0;
            conn->bytes_this_window = 0;
            conn->rate_window_start = now;
            if (conn->rate_limited) {
                conn->rate_limited = false;
                spdlog::info("Rate limit lifted: session={}", conn->session_id);
            }
        }

        conn->messages_this_window++;
        conn->bytes_this_window += data.size();

        if (static_cast<int>(conn->messages_this_window) > msg_rate_limit_max_per_sec_ ||
            static_cast<int>(conn->bytes_this_window) > msg_rate_limit_max_bytes_per_sec_) {
            if (!conn->rate_limited) {
                conn->rate_limited = true;
                metrics::Metrics::instance().backpressure_events_total.Increment();
                spdlog::warn("Rate limited: session={} msgs={}/s bytes={}/s",
                    conn->session_id, conn->messages_this_window, conn->bytes_this_window);
                send_to_session(conn->session_id,
                    protocol::make_speech_backpressure(conn->session_id, "slow_down"));
            }
            return; // drop the frame
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

    uWS::App* app_ = nullptr; // primary app (thread 0), non-owning
    uWS::Loop* loop_ = nullptr; // primary loop (thread 0)
    std::vector<uWS::Loop*> all_loops_; // all I/O thread loops for cross-thread publish
    std::vector<uWS::App*> all_apps_; // all apps for cross-thread publish
    std::mutex apps_mutex_;
    std::vector<us_listen_socket_t*> listen_sockets_;
    std::vector<std::thread> io_threads_;
    std::atomic<bool> shutdown_requested_{false};
    std::atomic<bool> draining_{false};
    std::chrono::steady_clock::time_point drain_start_;
    int port_;
    int io_thread_count_ = 1;
    session::SessionManager& session_mgr_;
    transcription::InferencePool& inference_pool_;
    std::string api_key_;
    TlsConfig tls_config_;
    bool trust_proxy_ = false;
    std::atomic<size_t> active_connections_{0};
    static constexpr size_t kMaxConnections = 100;
    AuthRateLimiter auth_limiter_;
    int msg_rate_limit_max_per_sec_ = 100;
    int msg_rate_limit_max_bytes_per_sec_ = 640000;
};

} // namespace wss::server
