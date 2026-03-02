#pragma once

#include "server/connection.hpp"
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
    explicit WebSocketServer(int port) : port_(port) {}

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

            .close = [](auto* ws, int code, std::string_view message) {
                auto* data = ws->getUserData();
                spdlog::info("Client disconnected: session={} code={} reason={}",
                    data->session_id, code, message);
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

        // TODO: Create session in SessionManager

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

        // TODO: Pass raw audio bytes to audio pipeline
        // data.data() = pointer, data.size() = length — zero-copy access
        spdlog::debug("Binary audio: session={} bytes={}",
            conn->session_id, data.size());
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
};

} // namespace wss::server
