#pragma once

#include "protocol/messages.hpp"
#include <string>
#include <optional>

namespace wss::protocol {

struct ValidationResult {
    bool valid = true;
    std::string error_code;
    std::string error_message;

    static ValidationResult ok() { return {}; }

    static ValidationResult fail(std::string code, std::string msg) {
        return {false, std::move(code), std::move(msg)};
    }
};

/// Validate an incoming JSON message envelope.
/// Returns error details if invalid.
inline ValidationResult validate_envelope(const nlohmann::json& msg) {
    if (!msg.is_object()) {
        return ValidationResult::fail("INVALID_MESSAGE", "Message must be a JSON object");
    }
    if (!msg.contains("type") || !msg["type"].is_string()) {
        return ValidationResult::fail("INVALID_MESSAGE", "Missing or invalid 'type' field");
    }
    if (!msg.contains("payload") || !msg["payload"].is_object()) {
        return ValidationResult::fail("INVALID_MESSAGE", "Missing or invalid 'payload' field");
    }
    return ValidationResult::ok();
}

/// Validate a HELLO payload.
inline ValidationResult validate_hello(const nlohmann::json& payload) {
    if (!payload.contains("language") || !payload["language"].is_string()) {
        return ValidationResult::fail("INVALID_MESSAGE", "HELLO: missing or invalid 'language'");
    }
    if (!payload.contains("sample_rate") || !payload["sample_rate"].is_number_integer()) {
        return ValidationResult::fail("INVALID_MESSAGE", "HELLO: missing or invalid 'sample_rate'");
    }
    auto sr = payload["sample_rate"].get<int32_t>();
    if (sr < 8000 || sr > 96000) {
        return ValidationResult::fail("INVALID_MESSAGE",
            "HELLO: sample_rate must be between 8000 and 96000");
    }
    if (!payload.contains("buffer_config") || !payload["buffer_config"].is_object()) {
        return ValidationResult::fail("INVALID_MESSAGE", "HELLO: missing 'buffer_config'");
    }
    const auto& bc = payload["buffer_config"];
    if (!bc.contains("window_duration_ms") || !bc["window_duration_ms"].is_number_integer()) {
        return ValidationResult::fail("INVALID_MESSAGE", "HELLO: missing 'window_duration_ms'");
    }
    auto wd = bc["window_duration_ms"].get<int32_t>();
    if (wd < 1000 || wd > 60000) {
        return ValidationResult::fail("INVALID_MESSAGE",
            "HELLO: window_duration_ms must be between 1000 and 60000");
    }
    if (!bc.contains("overlap_duration_ms") || !bc["overlap_duration_ms"].is_number_integer()) {
        return ValidationResult::fail("INVALID_MESSAGE", "HELLO: missing 'overlap_duration_ms'");
    }
    auto od = bc["overlap_duration_ms"].get<int32_t>();
    if (od < 0 || od >= wd) {
        return ValidationResult::fail("INVALID_MESSAGE",
            "HELLO: overlap_duration_ms must be >= 0 and < window_duration_ms");
    }
    if (payload.contains("resume_from_checkpoint") &&
        payload["resume_from_checkpoint"].get<bool>()) {
        if (!payload.contains("checkpoint") || !payload["checkpoint"].is_object()) {
            return ValidationResult::fail("INVALID_MESSAGE",
                "HELLO: resume_from_checkpoint=true but no checkpoint provided");
        }
    }
    return ValidationResult::ok();
}

/// Validate AUDIO_CHUNK metadata.
inline ValidationResult validate_audio_chunk(const nlohmann::json& payload) {
    if (!payload.contains("encoding") || !payload["encoding"].is_string()) {
        return ValidationResult::fail("INVALID_MESSAGE",
            "AUDIO_CHUNK: missing or invalid 'encoding'");
    }
    auto enc = payload["encoding"].get<std::string>();
    if (enc != "pcm_s16le" && enc != "opus") {
        return ValidationResult::fail("INVALID_MESSAGE",
            "AUDIO_CHUNK: encoding must be 'pcm_s16le' or 'opus'");
    }
    if (!payload.contains("timestamp_ms") || !payload["timestamp_ms"].is_number()) {
        return ValidationResult::fail("INVALID_MESSAGE",
            "AUDIO_CHUNK: missing or invalid 'timestamp_ms'");
    }
    if (!payload.contains("duration_ms") || !payload["duration_ms"].is_number_integer()) {
        return ValidationResult::fail("INVALID_MESSAGE",
            "AUDIO_CHUNK: missing or invalid 'duration_ms'");
    }
    auto dur = payload["duration_ms"].get<int32_t>();
    if (dur <= 0 || dur > 10000) {
        return ValidationResult::fail("INVALID_MESSAGE",
            "AUDIO_CHUNK: duration_ms must be between 1 and 10000");
    }
    return ValidationResult::ok();
}

} // namespace wss::protocol
