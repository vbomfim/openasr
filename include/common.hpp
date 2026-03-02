#pragma once

#include <cstddef>
#include <cstdint>
#include <span>
#include <string>
#include <string_view>
#include <vector>

namespace wss {

// Audio type aliases
using SampleInt16 = int16_t;
using SampleFloat = float;

// Non-owning view over contiguous audio samples
using AudioSpan = std::span<const SampleFloat>;
using MutableAudioSpan = std::span<SampleFloat>;

// Constants
inline constexpr int kWhisperSampleRate = 16000;
inline constexpr float kInt16ToFloat = 1.0f / 32768.0f;

} // namespace wss
