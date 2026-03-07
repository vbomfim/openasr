#pragma once

#include <cstdint>
#include <string_view>

namespace wss::server {

/// Constant-time string comparison to prevent timing side-channel attacks.
/// Returns true if both strings are equal. Never short-circuits.
inline bool constant_time_equals(std::string_view a, std::string_view b) {
    if (a.size() != b.size()) return false;
    volatile uint8_t result = 0;
    for (size_t i = 0; i < a.size(); ++i) {
        result |= static_cast<uint8_t>(a[i] ^ b[i]);
    }
    return result == 0;
}

}  // namespace wss::server
