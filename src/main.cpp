#include <spdlog/spdlog.h>
#include <App.h>
#include <csignal>
#include <atomic>

static std::atomic<bool> g_running{true};

static void signal_handler(int signum) {
    spdlog::info("Received signal {}, initiating graceful shutdown...", signum);
    g_running.store(false, std::memory_order_release);
}

struct PerSocketData {
    // Will hold session state later
};

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

    auto app = uWS::App()
        .ws<PerSocketData>("/transcribe", {
            .compression = uWS::DISABLED,
            .maxPayloadLength = 16 * 1024 * 1024,
            .idleTimeout = 120,
            .maxBackpressure = 1 * 1024 * 1024,

            .open = [](auto* ws) {
                spdlog::info("Client connected");
                (void)ws;
            },

            .message = [](auto* ws, std::string_view message, uWS::OpCode opCode) {
                // Echo for now — will be replaced by protocol dispatch
                ws->send(message, opCode);
            },

            .close = [](auto* ws, int code, std::string_view message) {
                spdlog::info("Client disconnected: code={} reason={}", code, message);
                (void)ws;
            }
        })
        .listen(kPort, [kPort](auto* listen_socket) {
            if (listen_socket) {
                spdlog::info("Listening on port {}", kPort);
            } else {
                spdlog::error("Failed to listen on port {}", kPort);
            }
        });

    app.run();

    spdlog::info("Server stopped.");
    return 0;
}
