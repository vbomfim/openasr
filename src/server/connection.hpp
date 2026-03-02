#pragma once

#include <string>
#include <string_view>
#include <cstdint>

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
};

} // namespace wss::server
