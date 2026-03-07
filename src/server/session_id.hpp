#pragma once

#include <string>
#include <random>
#include <sstream>
#include <iomanip>
#include <array>
#include <cstdint>

namespace wss::server {

/// Generate a session ID with 128 bits of entropy from the OS CSPRNG.
/// Each byte is read independently from std::random_device (backed by
/// getrandom() on Linux, arc4random on macOS) — no PRNG intermediary.
inline std::string generate_session_id() {
    std::random_device rd;
    std::array<uint8_t, 16> bytes{};
    for (auto& b : bytes) {
        b = static_cast<uint8_t>(rd() & 0xFF);
    }

    std::ostringstream oss;
    oss << std::hex << std::setfill('0');
    for (auto byte : bytes) oss << std::setw(2) << static_cast<int>(byte);
    return oss.str();
}

}  // namespace wss::server
