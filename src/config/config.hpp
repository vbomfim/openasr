#pragma once

#include <cstddef>
#include <cstdint>
#include <cstdlib>
#include <filesystem>
#include <stdexcept>
#include <string>

#include <toml++/toml.hpp>
#include <spdlog/spdlog.h>

namespace wss::config {

/// Safe integer parsing with fallback (replaces std::atoi)
inline int safe_atoi(const char* s, int default_val = 0) {
    try {
        return std::stoi(s);
    } catch (const std::exception&) {
        spdlog::warn("Invalid integer value '{}', using default {}", s, default_val);
        return default_val;
    }
}

/// Server configuration loaded from TOML file and/or environment variables.
/// Environment variables take precedence (container-friendly).
struct ServerConfig {
    // Server
    std::string host = "0.0.0.0";
    int port = 9090;
    size_t max_sessions = 20;

    // Audio buffering
    int32_t window_duration_ms = 20000;
    int32_t overlap_duration_ms = 2000;
    int32_t max_buffered_duration_ms = 60000;

    // Voice Activity Detection
    bool vad_enabled = false;

    // Model
    std::string model_path;
    std::string language = "en";
    int beam_size = 5;

    // Threading
    int io_threads = 4;
    int inference_threads = 4;

    // Logging
    std::string log_level = "info";
    std::string log_format = "text"; // "text" (default) or "json"

    // Authentication
    std::string api_key; // if empty, auth is disabled (dev mode)
    bool require_auth = false; // set via WSS_REQUIRE_AUTH=true

    // Rate limiting (#20, #21)
    int auth_rate_limit_max_failures = 10;  // per IP, per window
    int auth_rate_limit_window_secs = 60;   // sliding window in seconds
    int msg_rate_limit_max_per_sec = 100;   // max messages/sec per session
    int msg_rate_limit_max_bytes_per_sec = 640000; // max bytes/sec per session

    // Proxy trust (#28)
    bool trust_proxy = false;       // set WSS_TRUST_PROXY=true behind a reverse proxy
    int trusted_proxy_hops = 1;     // number of trusted proxy hops for XFF parsing
    size_t max_tracked_ips = 10000; // max IPs tracked by auth rate limiter

    // Connection limits (#63)
    size_t max_connections = 100;   // max concurrent WebSocket connections

    /// Load configuration from environment variables.
    static ServerConfig from_env() {
        ServerConfig cfg;
        apply_env_overrides(cfg);
        return cfg;
    }

    /// Load configuration from TOML file, then override with environment variables.
    static ServerConfig from_file_and_env(const std::string& path) {
        ServerConfig cfg;

        // Parse TOML file if it exists
        if (std::filesystem::exists(path)) {
            try {
                auto tbl = toml::parse_file(path);
                spdlog::info("Loaded config from {}", path);

                // [server]
                if (auto v = tbl["server"]["host"].value<std::string>())
                    cfg.host = *v;
                if (auto v = tbl["server"]["port"].value<int64_t>())
                    cfg.port = static_cast<int>(*v);
                if (auto v = tbl["server"]["max_sessions"].value<int64_t>())
                    cfg.max_sessions = static_cast<size_t>(*v);

                // [buffer]
                if (auto v = tbl["buffer"]["window_duration_ms"].value<int64_t>())
                    cfg.window_duration_ms = static_cast<int32_t>(*v);
                if (auto v = tbl["buffer"]["overlap_duration_ms"].value<int64_t>())
                    cfg.overlap_duration_ms = static_cast<int32_t>(*v);
                if (auto v = tbl["buffer"]["max_buffered_duration_ms"].value<int64_t>())
                    cfg.max_buffered_duration_ms = static_cast<int32_t>(*v);

                // [vad]
                if (auto v = tbl["vad"]["enabled"].value<bool>())
                    cfg.vad_enabled = *v;

                // [model]
                if (auto v = tbl["model"]["path"].value<std::string>())
                    cfg.model_path = *v;
                if (auto v = tbl["model"]["language"].value<std::string>())
                    cfg.language = *v;
                if (auto v = tbl["model"]["beam_size"].value<int64_t>())
                    cfg.beam_size = static_cast<int>(*v);

                // [threads]
                if (auto v = tbl["threads"]["io_threads"].value<int64_t>())
                    cfg.io_threads = static_cast<int>(*v);
                if (auto v = tbl["threads"]["inference_threads"].value<int64_t>())
                    cfg.inference_threads = static_cast<int>(*v);

                // [logging]
                if (auto v = tbl["logging"]["level"].value<std::string>())
                    cfg.log_level = *v;
                if (auto v = tbl["logging"]["format"].value<std::string>())
                    cfg.log_format = *v;

            } catch (const toml::parse_error& err) {
                spdlog::error("Failed to parse {}: {}", path, err.description());
                spdlog::warn("Falling back to defaults + env vars");
            }
        } else {
            spdlog::warn("Config file {} not found, using defaults + env vars", path);
        }

        // Environment variables override TOML values
        apply_env_overrides(cfg);

        return cfg;
    }

private:
    static void apply_env_overrides(ServerConfig& cfg) {
        if (auto* v = std::getenv("WSS_HOST"))              cfg.host = v;
        if (auto* v = std::getenv("WSS_PORT"))               cfg.port = safe_atoi(v, cfg.port);
        if (auto* v = std::getenv("WSS_MAX_SESSIONS")) {
            int val = safe_atoi(v, static_cast<int>(cfg.max_sessions));
            if (val > 0) cfg.max_sessions = static_cast<size_t>(val);
        }
        if (auto* v = std::getenv("WSS_WINDOW_DURATION_MS")) cfg.window_duration_ms = static_cast<int32_t>(safe_atoi(v, cfg.window_duration_ms));
        if (auto* v = std::getenv("WSS_OVERLAP_DURATION_MS"))cfg.overlap_duration_ms = static_cast<int32_t>(safe_atoi(v, cfg.overlap_duration_ms));
        if (auto* v = std::getenv("WSS_MAX_BUFFERED_MS"))    cfg.max_buffered_duration_ms = static_cast<int32_t>(safe_atoi(v, cfg.max_buffered_duration_ms));
        if (auto* v = std::getenv("WSS_VAD_ENABLED")) {
            cfg.vad_enabled = (std::string(v) == "true" || std::string(v) == "1");
        }
        if (auto* v = std::getenv("WHISPER_MODEL_PATH"))     cfg.model_path = v;
        if (auto* v = std::getenv("WSS_LANGUAGE"))           cfg.language = v;
        if (auto* v = std::getenv("WSS_BEAM_SIZE"))          cfg.beam_size = safe_atoi(v, cfg.beam_size);
        if (auto* v = std::getenv("WSS_IO_THREADS"))         cfg.io_threads = safe_atoi(v, cfg.io_threads);
        if (auto* v = std::getenv("WSS_INFERENCE_THREADS"))  cfg.inference_threads = safe_atoi(v, cfg.inference_threads);
        if (auto* v = std::getenv("WSS_LOG_LEVEL"))          cfg.log_level = v;
        if (auto* v = std::getenv("WSS_LOG_FORMAT"))         cfg.log_format = v;
        if (auto* v = std::getenv("WSS_API_KEY"))            cfg.api_key = v;
        if (auto* v = std::getenv("WSS_REQUIRE_AUTH")) {
            cfg.require_auth = (std::string(v) == "true" || std::string(v) == "1");
        }
        if (auto* v = std::getenv("WSS_AUTH_RATE_LIMIT_MAX"))
            cfg.auth_rate_limit_max_failures = safe_atoi(v, cfg.auth_rate_limit_max_failures);
        if (auto* v = std::getenv("WSS_AUTH_RATE_LIMIT_WINDOW"))
            cfg.auth_rate_limit_window_secs = safe_atoi(v, cfg.auth_rate_limit_window_secs);
        if (auto* v = std::getenv("WSS_MSG_RATE_LIMIT_MAX"))
            cfg.msg_rate_limit_max_per_sec = safe_atoi(v, cfg.msg_rate_limit_max_per_sec);
        if (auto* v = std::getenv("WSS_MSG_RATE_LIMIT_BYTES"))
            cfg.msg_rate_limit_max_bytes_per_sec = safe_atoi(v, cfg.msg_rate_limit_max_bytes_per_sec);
        if (auto* v = std::getenv("WSS_TRUST_PROXY")) {
            cfg.trust_proxy = (std::string(v) == "true" || std::string(v) == "1");
        }
        if (auto* v = std::getenv("WSS_TRUSTED_PROXY_HOPS"))
            cfg.trusted_proxy_hops = safe_atoi(v, cfg.trusted_proxy_hops);
        if (auto* v = std::getenv("WSS_MAX_TRACKED_IPS")) {
            int val = safe_atoi(v, static_cast<int>(cfg.max_tracked_ips));
            if (val > 0) cfg.max_tracked_ips = static_cast<size_t>(val);
        }
        if (auto* v = std::getenv("WSS_MAX_CONNECTIONS")) {
            int val = safe_atoi(v, static_cast<int>(cfg.max_connections));
            if (val > 0) cfg.max_connections = static_cast<size_t>(val);
        }
    }

public:
    /// Validate configuration. Returns error message or empty string.
    [[nodiscard]] std::string validate() const {
        if (model_path.empty())
            return "WHISPER_MODEL_PATH is required (set via env var or model.path in server.toml)";
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
