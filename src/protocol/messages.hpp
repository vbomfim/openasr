#pragma once

#include "common.hpp"
#include <nlohmann/json.hpp>
#include <optional>
#include <string>
#include <vector>
#include <cstdint>

namespace wss::protocol {

// --- Nested types ---

struct BufferConfig {
    int32_t window_duration_ms = 20000;
    int32_t overlap_duration_ms = 2000;
};

NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(BufferConfig, window_duration_ms, overlap_duration_ms)

struct Segment {
    int64_t start_ms = 0;
    int64_t end_ms = 0;
    std::string text;
    std::string speaker;
};

NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(Segment, start_ms, end_ms, text, speaker)

struct CheckpointData {
    std::string session_id;
    int64_t last_audio_ms = 0;
    int64_t last_text_offset = 0;
    std::string full_transcript;
    BufferConfig buffer_config;
    std::string backend_model_id;
};

NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(CheckpointData,
    session_id, last_audio_ms, last_text_offset,
    full_transcript, buffer_config, backend_model_id)

// --- Message types ---

enum class MessageType {
    HELLO,
    HELLO_ACK,
    AUDIO_CHUNK,
    PARTIAL_TRANSCRIPT,
    FINAL_TRANSCRIPT,
    CHECKPOINT,
    BACKPRESSURE,
    END,
    ERROR_MSG
};

inline std::string_view to_string(MessageType type) {
    switch (type) {
        case MessageType::HELLO:              return "HELLO";
        case MessageType::HELLO_ACK:          return "HELLO_ACK";
        case MessageType::AUDIO_CHUNK:        return "AUDIO_CHUNK";
        case MessageType::PARTIAL_TRANSCRIPT: return "PARTIAL_TRANSCRIPT";
        case MessageType::FINAL_TRANSCRIPT:   return "FINAL_TRANSCRIPT";
        case MessageType::CHECKPOINT:         return "CHECKPOINT";
        case MessageType::BACKPRESSURE:       return "BACKPRESSURE";
        case MessageType::END:                return "END";
        case MessageType::ERROR_MSG:          return "ERROR";
    }
    return "UNKNOWN";
}

inline std::optional<MessageType> parse_message_type(std::string_view s) {
    if (s == "HELLO")              return MessageType::HELLO;
    if (s == "AUDIO_CHUNK")        return MessageType::AUDIO_CHUNK;
    if (s == "END")                return MessageType::END;
    return std::nullopt;
}

// --- Client → Server messages ---

struct HelloPayload {
    std::string language = "en";
    int32_t sample_rate = 16000;
    BufferConfig buffer_config;
    bool resume_from_checkpoint = false;
    std::optional<CheckpointData> checkpoint;
    std::string backend_model_id = "whisper-large-v3";
};

inline void to_json(nlohmann::json& j, const HelloPayload& p) {
    j = nlohmann::json{
        {"language", p.language},
        {"sample_rate", p.sample_rate},
        {"buffer_config", p.buffer_config},
        {"resume_from_checkpoint", p.resume_from_checkpoint},
        {"backend_model_id", p.backend_model_id}
    };
    if (p.checkpoint) {
        j["checkpoint"] = *p.checkpoint;
    } else {
        j["checkpoint"] = nullptr;
    }
}

inline void from_json(const nlohmann::json& j, HelloPayload& p) {
    j.at("language").get_to(p.language);
    j.at("sample_rate").get_to(p.sample_rate);
    j.at("buffer_config").get_to(p.buffer_config);
    j.at("resume_from_checkpoint").get_to(p.resume_from_checkpoint);
    j.at("backend_model_id").get_to(p.backend_model_id);
    if (j.contains("checkpoint") && !j["checkpoint"].is_null()) {
        p.checkpoint = j["checkpoint"].get<CheckpointData>();
    }
}

struct AudioChunkMetadata {
    int64_t chunk_id = 0;
    int64_t timestamp_ms = 0;
    std::string encoding = "pcm_s16le";
    int32_t duration_ms = 0;
};

NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(AudioChunkMetadata,
    chunk_id, timestamp_ms, encoding, duration_ms)

// --- Server → Client messages ---

struct HelloAckPayload {
    BufferConfig effective_buffer_config;
    std::optional<CheckpointData> checkpoint;
};

inline void to_json(nlohmann::json& j, const HelloAckPayload& p) {
    j = nlohmann::json{
        {"effective_buffer_config", p.effective_buffer_config}
    };
    if (p.checkpoint) {
        j["checkpoint"] = *p.checkpoint;
    } else {
        j["checkpoint"] = nullptr;
    }
}

inline void from_json(const nlohmann::json& j, HelloAckPayload& p) {
    j.at("effective_buffer_config").get_to(p.effective_buffer_config);
    if (j.contains("checkpoint") && !j["checkpoint"].is_null()) {
        p.checkpoint = j["checkpoint"].get<CheckpointData>();
    }
}

struct PartialTranscriptPayload {
    int64_t window_start_ms = 0;
    int64_t window_end_ms = 0;
    std::vector<Segment> segments;
    bool is_stable = false;
};

NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(PartialTranscriptPayload,
    window_start_ms, window_end_ms, segments, is_stable)

struct FinalTranscriptPayload {
    std::vector<Segment> segments;
};

NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(FinalTranscriptPayload, segments)

struct ErrorPayload {
    std::string code;
    std::string message;
};

NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(ErrorPayload, code, message)

struct BackpressurePayload {
    std::string action; // "slow_down" or "ok"
};

NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(BackpressurePayload, action)

// --- Envelope ---

struct Envelope {
    std::string type;
    std::string session_id;
    nlohmann::json payload;
};

NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(Envelope, type, session_id, payload)

// --- Helpers to build outbound messages ---

inline std::string make_message(std::string_view type, const std::string& session_id,
                                const nlohmann::json& payload) {
    nlohmann::json msg;
    msg["type"] = type;
    msg["session_id"] = session_id;
    msg["payload"] = payload;
    return msg.dump();
}

inline std::string make_error(const std::string& session_id,
                              const std::string& code,
                              const std::string& message) {
    return make_message("ERROR", session_id,
        nlohmann::json{{"code", code}, {"message", message}});
}

inline std::string make_hello_ack(const std::string& session_id,
                                  const HelloAckPayload& payload) {
    return make_message("HELLO_ACK", session_id, payload);
}

inline std::string make_partial_transcript(const std::string& session_id,
                                           const PartialTranscriptPayload& payload) {
    return make_message("PARTIAL_TRANSCRIPT", session_id, payload);
}

inline std::string make_final_transcript(const std::string& session_id,
                                         const FinalTranscriptPayload& payload) {
    return make_message("FINAL_TRANSCRIPT", session_id, payload);
}

inline std::string make_checkpoint(const std::string& session_id,
                                   const CheckpointData& payload) {
    return make_message("CHECKPOINT", session_id, payload);
}

inline std::string make_backpressure(const std::string& session_id,
                                     const std::string& action) {
    return make_message("BACKPRESSURE", session_id,
        nlohmann::json{{"action", action}});
}

} // namespace wss::protocol
