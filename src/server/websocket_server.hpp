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
    explicit WebSocketServer(int port,
                             session::SessionManager& session_mgr,
                             transcription::InferencePool& inference_pool)
        : port_(port)
        , session_mgr_(session_mgr)
        , inference_pool_(inference_pool) {}

    void run() {
        app_.ws<ConnectionData>("/transcribe", {
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
                    session_mgr_.destroy_session(data->session_id);
                }
                data->state = ConnectionState::CLOSED;
            }
        })
        .listen(port_, [this](auto* listen_socket) {
            if (listen_socket) {
                spdlog::info("Listening on port {}", port_);
            } else {
                spdlog::error("Failed to listen on port {}", port_);
            }
        });

        app_.run();
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

        // TODO: Store metadata, expect next binary frame as audio data
        spdlog::debug("Audio chunk metadata: session={} ts={}ms",
            conn->session_id, payload["timestamp_ms"].get<int64_t>());
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
        session->ingest_audio(
            reinterpret_cast<const uint8_t*>(data.data()), data.size());

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

        // Append transcript
        for (const auto& seg : result.segments) {
            session->append_transcript(seg.text);
        }
        session->set_last_audio_ms(window_end_ms);

        spdlog::info("Transcription complete: session={} window=[{}ms, {}ms] segments={}",
            session_id, window_start_ms, window_end_ms, result.segments.size());

        // TODO: Send PARTIAL_TRANSCRIPT and CHECKPOINT back to client
        // This requires posting to the uWS event loop (app_.getLoop()->defer())
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

        // TODO: Finalize transcription, send FINAL_TRANSCRIPT + CHECKPOINT

        session_mgr_.destroy_session(conn->session_id);
        conn->state = ConnectionState::CLOSED;
    }

    void send_error(WebSocket* ws, const std::string& session_id,
                    const std::string& code, const std::string& message) {
        spdlog::warn("Error: session={} code={} msg={}", session_id, code, message);
        auto response = protocol::make_error(session_id, code, message);
        ws->send(response, uWS::OpCode::TEXT);
    }

    uWS::App app_;
    int port_;
    session::SessionManager& session_mgr_;
    transcription::InferencePool& inference_pool_;
};

} // namespace wss::server
