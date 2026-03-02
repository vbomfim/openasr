#pragma once

#include "common.hpp"
#include <cstddef>
#include <cstdint>
#include <cstring>

namespace wss::audio {

/// Convert PCM int16 samples to float32 normalized [-1, 1].
/// SIMD-friendly: simple loop over contiguous memory.
/// `src` and `dest` must not overlap.
inline void pcm_s16le_to_float(const int16_t* src, SampleFloat* dest, size_t count) {
    for (size_t i = 0; i < count; ++i) {
        dest[i] = static_cast<SampleFloat>(src[i]) * kInt16ToFloat;
    }
}

/// Convert PCM int16 from raw bytes (little-endian) to float32.
/// Handles alignment — reads byte-by-byte if needed.
/// Note: odd byte counts are safely truncated (last byte ignored).
inline void pcm_bytes_to_float(const uint8_t* src, SampleFloat* dest, size_t byte_count) {
    size_t sample_count = byte_count / 2; // truncates odd byte safely
    for (size_t i = 0; i < sample_count; ++i) {
        // Little-endian: low byte first
        auto lo = static_cast<uint16_t>(src[i * 2]);
        auto hi = static_cast<uint16_t>(src[i * 2 + 1]);
        auto val = static_cast<int16_t>(lo | static_cast<uint16_t>(hi << 8));
        dest[i] = static_cast<SampleFloat>(val) * kInt16ToFloat;
    }
}

} // namespace wss::audio
