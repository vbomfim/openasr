#include "server/websocket_server.hpp"
#include "session/session_manager.hpp"
#include "transcription/mock_backend.hpp"
#include "transcription/whisper_backend.hpp"
#include "transcription/inference_pool.hpp"
#include <spdlog/spdlog.h>
#include <csignal>
#include <atomic>
#include <cstdlib>
#include <memory>

static std::atomic<bool> g_running{true};

static void signal_handler(int signum) {
    spdlog::info("Received signal {}, initiating graceful shutdown...", signum);
    g_running.store(false, std::memory_order_release);
}

int main(int /*argc*/, char* /*argv*/[]) {
    struct sigaction sa{};
    sa.sa_handler = signal_handler;
    sigemptyset(&sa.sa_mask);
    sa.sa_flags = 0;
    sigaction(SIGTERM, &sa, nullptr);
    sigaction(SIGINT, &sa, nullptr);

    spdlog::set_level(spdlog::level::info);
    spdlog::info("whisperx-streaming-server v0.1.0 starting...");

    constexpr int kPort = 9090;
    constexpr size_t kMaxSessions = 20;
    constexpr size_t kInferenceThreads = 4;

    // Initialize transcription backend
    std::unique_ptr<wss::transcription::ITranscriptionBackend> backend;

    const char* model_path = std::getenv("WHISPER_MODEL_PATH");
    if (model_path && model_path[0] != '\0') {
        auto whisper = std::make_unique<wss::transcription::WhisperBackend>();
        wss::transcription::BackendConfig cfg;
        cfg.model_path = model_path;
        cfg.language = "en";
        cfg.n_threads = static_cast<int>(kInferenceThreads);

        if (!whisper->initialize(cfg)) {
            spdlog::error("Failed to initialize whisper backend — aborting");
            return 1;
        }
        backend = std::move(whisper);
    } else {
        spdlog::warn("WHISPER_MODEL_PATH not set — using mock backend");
        auto mock = std::make_unique<wss::transcription::MockBackend>();
        wss::transcription::BackendConfig cfg;
        cfg.language = "en";
        mock->initialize(cfg);
        backend = std::move(mock);
    }

    wss::transcription::InferencePool inference_pool(*backend, kInferenceThreads);
    wss::session::SessionManager session_mgr(kMaxSessions);
    wss::server::WebSocketServer server(kPort, session_mgr, inference_pool);
    server.run();

    spdlog::info("Shutting down inference pool...");
    inference_pool.shutdown();
    spdlog::info("Server stopped.");
    return 0;
}
