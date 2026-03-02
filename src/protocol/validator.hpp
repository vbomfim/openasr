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

/// Validate a speech.config payload.
inline ValidationResult validate_speech_config(const nlohmann::json& payload) {
    if (!payload.contains("language") || !payload["language"].is_string()) {
        return ValidationResult::fail("INVALID_MESSAGE", "speech.config: missing or invalid 'language'");
    }
    if (!payload.contains("sample_rate") || !payload["sample_rate"].is_number_integer()) {
        return ValidationResult::fail("INVALID_MESSAGE", "speech.config: missing or invalid 'sample_rate'");
    }
    auto sr = payload["sample_rate"].get<int32_t>();
    if (sr < 8000 || sr > 96000) {
        return ValidationResult::fail("INVALID_MESSAGE",
            "speech.config: sample_rate must be between 8000 and 96000");
    }
    if (!payload.contains("encoding") || !payload["encoding"].is_string()) {
        return ValidationResult::fail("INVALID_MESSAGE", "speech.config: missing or invalid 'encoding'");
    }
    auto enc = payload["encoding"].get<std::string>();
    if (enc != "pcm_s16le" && enc != "opus") {
        return ValidationResult::fail("INVALID_MESSAGE",
            "speech.config: encoding must be 'pcm_s16le' or 'opus'");
    }
    if (!payload.contains("window_duration_ms") || !payload["window_duration_ms"].is_number_integer()) {
        return ValidationResult::fail("INVALID_MESSAGE", "speech.config: missing 'window_duration_ms'");
    }
    auto wd = payload["window_duration_ms"].get<int32_t>();
    if (wd < 1000 || wd > 60000) {
        return ValidationResult::fail("INVALID_MESSAGE",
            "speech.config: window_duration_ms must be between 1000 and 60000");
    }
    if (!payload.contains("overlap_duration_ms") || !payload["overlap_duration_ms"].is_number_integer()) {
        return ValidationResult::fail("INVALID_MESSAGE", "speech.config: missing 'overlap_duration_ms'");
    }
    auto od = payload["overlap_duration_ms"].get<int32_t>();
    if (od < 0 || od >= wd) {
        return ValidationResult::fail("INVALID_MESSAGE",
            "speech.config: overlap_duration_ms must be >= 0 and < window_duration_ms");
    }
    // Validate string field lengths
    if (payload["language"].get<std::string>().length() > 16) {
        return ValidationResult::fail("INVALID_MESSAGE", "language too long (max 16 chars)");
    }
    if (payload.contains("model_id") && payload["model_id"].get<std::string>().length() > 128) {
        return ValidationResult::fail("INVALID_MESSAGE", "model_id too long (max 128 chars)");
    }
    if (payload["encoding"].get<std::string>().length() > 32) {
        return ValidationResult::fail("INVALID_MESSAGE", "encoding too long (max 32 chars)");
    }
    if (payload.contains("resume_checkpoint") && !payload["resume_checkpoint"].is_null()) {
        if (!payload["resume_checkpoint"].is_object()) {
            return ValidationResult::fail("INVALID_MESSAGE",
                "speech.config: resume_checkpoint must be an object");
        }
    }
    return ValidationResult::ok();
}

} // namespace wss::protocol
