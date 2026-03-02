#pragma once

#include <string>
#include <string_view>
#include <cstdint>

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

/// Metadata from the most recent AUDIO_CHUNK JSON, paired with next binary frame
struct PendingAudioMeta {
    bool valid = false;
    int64_t chunk_id = 0;
    int64_t timestamp_ms = 0;
    std::string encoding = "pcm_s16le";
    int32_t duration_ms = 0;
};

/// Per-connection data stored in the WebSocket user data
struct ConnectionData {
    ConnectionState state = ConnectionState::CONNECTED;
    std::string session_id;
    // Encoding from last AUDIO_CHUNK metadata (for pipeline selection)
    std::string encoding = "pcm_s16le";
    PendingAudioMeta pending_audio;
    bool backpressure_sent = false;
};

} // namespace wss::server
