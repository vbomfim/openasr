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

// --- Message types (Azure Speech-aligned) ---

enum class MessageType {
    SPEECH_CONFIG,        // client → server
    SPEECH_CONFIG_ACK,    // server → client
    SPEECH_HYPOTHESIS,    // server → client
    SPEECH_PHRASE,        // server → client
    SPEECH_CHECKPOINT,    // server → client
    SPEECH_BACKPRESSURE,  // server → client
    SPEECH_END,           // client → server
    SPEECH_ERROR          // server → client
};

inline std::string_view to_string(MessageType type) {
    switch (type) {
        case MessageType::SPEECH_CONFIG:       return "speech.config";
        case MessageType::SPEECH_CONFIG_ACK:   return "speech.config.ack";
        case MessageType::SPEECH_HYPOTHESIS:   return "speech.hypothesis";
        case MessageType::SPEECH_PHRASE:       return "speech.phrase";
        case MessageType::SPEECH_CHECKPOINT:   return "speech.checkpoint";
        case MessageType::SPEECH_BACKPRESSURE: return "speech.backpressure";
        case MessageType::SPEECH_END:          return "speech.end";
        case MessageType::SPEECH_ERROR:        return "speech.error";
    }
    return "unknown";
}

/// Parse only client-sent message types
inline std::optional<MessageType> parse_message_type(std::string_view s) {
    if (s == "speech.config") return MessageType::SPEECH_CONFIG;
    if (s == "speech.end")    return MessageType::SPEECH_END;
    return std::nullopt;
}

// --- Client → Server messages ---

struct SpeechConfigPayload {
    std::string language = "en";
    int32_t sample_rate = 16000;
    std::string encoding = "pcm_s16le"; // "pcm_s16le" or "opus"
    int32_t window_duration_ms = 5000;
    int32_t overlap_duration_ms = 500;
    std::string model_id = "whisper-tiny.en";
    std::optional<CheckpointData> resume_checkpoint;
};

inline void to_json(nlohmann::json& j, const SpeechConfigPayload& p) {
    j = nlohmann::json{
        {"language", p.language},
        {"sample_rate", p.sample_rate},
        {"encoding", p.encoding},
        {"window_duration_ms", p.window_duration_ms},
        {"overlap_duration_ms", p.overlap_duration_ms},
        {"model_id", p.model_id}
    };
    if (p.resume_checkpoint) {
        j["resume_checkpoint"] = *p.resume_checkpoint;
    } else {
        j["resume_checkpoint"] = nullptr;
    }
}

inline void from_json(const nlohmann::json& j, SpeechConfigPayload& p) {
    j.at("language").get_to(p.language);
    j.at("sample_rate").get_to(p.sample_rate);
    j.at("encoding").get_to(p.encoding);
    j.at("window_duration_ms").get_to(p.window_duration_ms);
    j.at("overlap_duration_ms").get_to(p.overlap_duration_ms);
    // Optional fields
    if (j.contains("model_id")) j.at("model_id").get_to(p.model_id);
    if (j.contains("resume_checkpoint") && !j["resume_checkpoint"].is_null()) {
        p.resume_checkpoint = j["resume_checkpoint"].get<CheckpointData>();
    }
}

// --- Server → Client messages ---

struct SpeechConfigAckPayload {
    std::string session_id;
    SpeechConfigPayload effective_config;
    std::optional<CheckpointData> checkpoint;
};

inline void to_json(nlohmann::json& j, const SpeechConfigAckPayload& p) {
    j = nlohmann::json{
        {"session_id", p.session_id},
        {"effective_config", p.effective_config}
    };
    if (p.checkpoint) {
        j["checkpoint"] = *p.checkpoint;
    } else {
        j["checkpoint"] = nullptr;
    }
}

inline void from_json(const nlohmann::json& j, SpeechConfigAckPayload& p) {
    j.at("session_id").get_to(p.session_id);
    j.at("effective_config").get_to(p.effective_config);
    if (j.contains("checkpoint") && !j["checkpoint"].is_null()) {
        p.checkpoint = j["checkpoint"].get<CheckpointData>();
    }
}

struct HypothesisPayload {
    int64_t offset = 0;   // ms from start
    int64_t duration = 0;  // ms
    std::string text;
};

NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(HypothesisPayload, offset, duration, text)

struct PhrasePayload {
    int64_t offset = 0;
    int64_t duration = 0;
    std::string text;
    float confidence = 0.0f;
    std::string status = "Success"; // Azure convention
};

NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(PhrasePayload, offset, duration, text, confidence, status)

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

inline std::string make_speech_error(const std::string& session_id,
                                     const std::string& code,
                                     const std::string& message) {
    return make_message("speech.error", session_id,
        nlohmann::json{{"code", code}, {"message", message}});
}

inline std::string make_speech_config_ack(const std::string& session_id,
                                          const SpeechConfigAckPayload& payload) {
    return make_message("speech.config.ack", session_id, payload);
}

inline std::string make_speech_hypothesis(const std::string& session_id,
                                          const HypothesisPayload& payload) {
    return make_message("speech.hypothesis", session_id, payload);
}

inline std::string make_speech_phrase(const std::string& session_id,
                                      const PhrasePayload& payload) {
    return make_message("speech.phrase", session_id, payload);
}

inline std::string make_speech_checkpoint(const std::string& session_id,
                                          const CheckpointData& payload) {
    return make_message("speech.checkpoint", session_id, payload);
}

inline std::string make_speech_backpressure(const std::string& session_id,
                                            const std::string& action) {
    return make_message("speech.backpressure", session_id,
        nlohmann::json{{"action", action}});
}

} // namespace wss::protocol
