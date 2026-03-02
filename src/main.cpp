#include "server/websocket_server.hpp"
#include "session/session_manager.hpp"
#include "transcription/whisper_backend.hpp"
#include "transcription/inference_pool.hpp"
#include "config/config.hpp"
#include <spdlog/spdlog.h>
#include <csignal>
#include <atomic>
#include <memory>

static std::atomic<bool> g_running{true};

static void signal_handler(int signum) {
    spdlog::info("Received signal {}, initiating graceful shutdown...", signum);
    g_running.store(false, std::memory_order_release);
}

static spdlog::level::level_enum parse_log_level(const std::string& level) {
    if (level == "trace")    return spdlog::level::trace;
    if (level == "debug")    return spdlog::level::debug;
    if (level == "info")     return spdlog::level::info;
    if (level == "warn")     return spdlog::level::warn;
    if (level == "error")    return spdlog::level::err;
    if (level == "critical") return spdlog::level::critical;
    return spdlog::level::info;
}

int main(int /*argc*/, char* /*argv*/[]) {
    // Load config from TOML file + environment variables
    const char* config_path = std::getenv("WSS_CONFIG_PATH");
    auto cfg = wss::config::ServerConfig::from_file_and_env(
        config_path ? config_path : "config/server.toml");

    // Set up logging
    spdlog::set_level(parse_log_level(cfg.log_level));
    spdlog::info("whisperx-streaming-server v0.1.0 starting...");
    spdlog::debug("Debug logging enabled (log_level={})", cfg.log_level);

    // Validate config
    auto validation_error = cfg.validate();
    if (!validation_error.empty()) {
        spdlog::error("Configuration error: {}", validation_error);
        return 1;
    }

    if (cfg.require_auth && cfg.api_key.empty()) {
        spdlog::error("WSS_REQUIRE_AUTH=true but WSS_API_KEY is empty — aborting");
        return 1;
    }

    spdlog::info("Config: port={} max_sessions={} window={}ms overlap={}ms inference_threads={}",
        cfg.port, cfg.max_sessions, cfg.window_duration_ms,
        cfg.overlap_duration_ms, cfg.inference_threads);

    // Install signal handlers
    struct sigaction sa{};
    sa.sa_handler = signal_handler;
    sigemptyset(&sa.sa_mask);
    sa.sa_flags = 0;
    sigaction(SIGTERM, &sa, nullptr);
    sigaction(SIGINT, &sa, nullptr);

    // Initialize whisper.cpp backend (required)
    if (cfg.model_path.empty()) {
        spdlog::error("WHISPER_MODEL_PATH is required. Set it via environment variable or model.path in server.toml.");
        return 1;
    }

    auto backend = std::make_unique<wss::transcription::WhisperBackend>();
    wss::transcription::BackendConfig bcfg;
    bcfg.model_path = cfg.model_path;
    bcfg.language = cfg.language;
    bcfg.beam_size = cfg.beam_size;
    bcfg.n_threads = cfg.inference_threads;

    if (!backend->initialize(bcfg)) {
        spdlog::error("Failed to load whisper model at '{}' — aborting", cfg.model_path);
        return 1;
    }

    // Start services
    wss::transcription::InferencePool inference_pool(
        *backend, static_cast<size_t>(cfg.inference_threads));
    wss::session::SessionManager session_mgr(cfg.max_sessions);
    wss::server::WebSocketServer server(cfg.port, session_mgr, inference_pool, cfg.api_key);

    if (cfg.api_key.empty()) {
        spdlog::warn("WSS_API_KEY not set — authentication disabled (dev mode)");
    } else {
        spdlog::info("API key authentication enabled");
    }

    spdlog::info("Starting server...");
    server.run();

    // Graceful shutdown
    spdlog::info("Shutting down inference pool...");
    inference_pool.shutdown();
    spdlog::info("Server stopped.");
    return 0;
}
