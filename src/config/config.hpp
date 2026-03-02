#pragma once

#include <cstddef>
#include <cstdint>
#include <cstdlib>
#include <string>

namespace wss::config {

/// Server configuration loaded from environment variables.
/// Environment variables take precedence (container-friendly).
/// No file I/O required — all config via env vars with sensible defaults.
struct ServerConfig {
    // Server
    std::string host = "0.0.0.0";
    int port = 9090;
    size_t max_sessions = 20;

    // Audio buffering
    int32_t window_duration_ms = 20000;
    int32_t overlap_duration_ms = 2000;
    int32_t max_buffered_duration_ms = 60000;

    // Model
    std::string model_path;
    std::string language = "en";
    int beam_size = 5;

    // Threading
    int io_threads = 4;
    int inference_threads = 4;

    // Logging
    std::string log_level = "info";

    /// Load configuration from environment variables.
    static ServerConfig from_env() {
        ServerConfig cfg;

        if (auto* v = std::getenv("WSS_HOST"))              cfg.host = v;
        if (auto* v = std::getenv("WSS_PORT"))               cfg.port = std::atoi(v);
        if (auto* v = std::getenv("WSS_MAX_SESSIONS"))       cfg.max_sessions = static_cast<size_t>(std::atoi(v));
        if (auto* v = std::getenv("WSS_WINDOW_DURATION_MS")) cfg.window_duration_ms = static_cast<int32_t>(std::atoi(v));
        if (auto* v = std::getenv("WSS_OVERLAP_DURATION_MS"))cfg.overlap_duration_ms = static_cast<int32_t>(std::atoi(v));
        if (auto* v = std::getenv("WSS_MAX_BUFFERED_MS"))    cfg.max_buffered_duration_ms = static_cast<int32_t>(std::atoi(v));
        if (auto* v = std::getenv("WHISPER_MODEL_PATH"))     cfg.model_path = v;
        if (auto* v = std::getenv("WSS_LANGUAGE"))           cfg.language = v;
        if (auto* v = std::getenv("WSS_BEAM_SIZE"))          cfg.beam_size = std::atoi(v);
        if (auto* v = std::getenv("WSS_IO_THREADS"))         cfg.io_threads = std::atoi(v);
        if (auto* v = std::getenv("WSS_INFERENCE_THREADS"))  cfg.inference_threads = std::atoi(v);
        if (auto* v = std::getenv("WSS_LOG_LEVEL"))          cfg.log_level = v;

        return cfg;
    }

    /// Validate configuration. Returns error message or empty string.
    [[nodiscard]] std::string validate() const {
        if (port < 1 || port > 65535)
            return "Invalid port: must be 1-65535";
        if (max_sessions == 0)
            return "max_sessions must be > 0";
        if (window_duration_ms < 1000 || window_duration_ms > 60000)
            return "window_duration_ms must be 1000-60000";
        if (overlap_duration_ms < 0 || overlap_duration_ms >= window_duration_ms)
            return "overlap_duration_ms must be >= 0 and < window_duration_ms";
        if (inference_threads < 1)
            return "inference_threads must be >= 1";
        return "";
    }
};

} // namespace wss::config
