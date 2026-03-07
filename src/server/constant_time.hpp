#pragma once

#include <cstddef>
#include <cstdint>
#include <string_view>

namespace wss::server {

/// Constant-time string comparison to prevent timing side-channel attacks.
/// Returns true if both strings are equal. Never short-circuits.
/// Uses volatile to prevent compiler from eliding the loop — same pattern
/// as mbedTLS mbedtls_ct_memcmp() and libsodium sodium_memcmp().
inline bool constant_time_equals(std::string_view a, std::string_view b) {
    volatile uint8_t result = static_cast<uint8_t>(a.size() ^ b.size());
    const std::size_t len = std::min(a.size(), b.size());
    for (std::size_t i = 0; i < len; ++i) {
        result |= static_cast<uint8_t>(a[i] ^ b[i]);
    }
    return result == 0;
}

}  // namespace wss::server
