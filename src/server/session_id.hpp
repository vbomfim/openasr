#pragma once

#include <string>
#include <random>
#include <array>
#include <cstdint>
#include <cstring>

namespace wss::server {

/// Generate a session ID with 128 bits of entropy from the OS CSPRNG.
/// Uses 4 std::random_device calls extracting 4 bytes each (backed by
/// getrandom() on Linux, arc4random on macOS) — no PRNG intermediary.
inline std::string generate_session_id() {
    std::random_device rd;
    std::array<uint8_t, 16> bytes{};
    for (int i = 0; i < 4; ++i) {
        auto v = rd();
        std::memcpy(bytes.data() + i * 4, &v, sizeof(uint32_t));
    }

    static constexpr char hex[] = "0123456789abcdef";
    std::string id;
    id.reserve(32);
    for (auto b : bytes) {
        id.push_back(hex[b >> 4]);
        id.push_back(hex[b & 0x0F]);
    }
    return id;
}

}  // namespace wss::server
