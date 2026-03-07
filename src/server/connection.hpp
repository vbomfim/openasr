#pragma once

#include <string>
#include <string_view>
#include <chrono>
#include <cstdint>
#include <cstddef>

namespace wss::server {

/// Connection lifecycle states
enum class ConnectionState {
    CONNECTED,       // WebSocket open, awaiting speech.config
    HELLO_RECEIVED,  // speech.config processed, session active
    STREAMING,       // Receiving audio binary frames
    ENDING,          // speech.end received, finalizing
    CLOSED           // Connection closed
};

inline std::string_view to_string(ConnectionState state) {
    switch (state) {
        case ConnectionState::CONNECTED:      return "CONNECTED";
        case ConnectionState::HELLO_RECEIVED: return "HELLO_RECEIVED";
        case ConnectionState::STREAMING:      return "STREAMING";
        case ConnectionState::ENDING:         return "ENDING";
        case ConnectionState::CLOSED:         return "CLOSED";
    }
    return "UNKNOWN";
}

/// Per-connection data stored in the WebSocket user data
struct ConnectionData {
    ConnectionState state = ConnectionState::CONNECTED;
    std::string session_id;
    std::string encoding = "pcm_s16le"; // from speech.config
    bool backpressure_sent = false;

    // Per-session message rate limiting (#21)
    size_t messages_this_window = 0;
    size_t bytes_this_window = 0;
    std::chrono::steady_clock::time_point rate_window_start =
        std::chrono::steady_clock::now();
    bool rate_limited = false;
};

} // namespace wss::server
