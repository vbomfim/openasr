#pragma once

#include <string>
#include <string_view>

namespace wss::server {

/// Connection lifecycle states
enum class ConnectionState {
    CONNECTED,       // WebSocket open, awaiting HELLO
    HELLO_RECEIVED,  // HELLO processed, session active
    STREAMING,       // Receiving audio chunks
    ENDING,          // END received, finalizing
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
};

} // namespace wss::server
