#include <spdlog/spdlog.h>
#include <csignal>
#include <atomic>

static std::atomic<bool> g_running{true};

static void signal_handler(int signum) {
    spdlog::info("Received signal {}, initiating graceful shutdown...", signum);
    g_running.store(false, std::memory_order_release);
}

int main(int /*argc*/, char* /*argv*/[]) {
    // Install signal handlers for graceful shutdown
    struct sigaction sa{};
    sa.sa_handler = signal_handler;
    sigemptyset(&sa.sa_mask);
    sa.sa_flags = 0;
    sigaction(SIGTERM, &sa, nullptr);
    sigaction(SIGINT, &sa, nullptr);

    spdlog::set_level(spdlog::level::info);
    spdlog::info("whisperx-streaming-server v0.1.0 starting...");

    // TODO: Load config, init model, start WebSocket server

    spdlog::info("Server stopped.");
    return 0;
}
