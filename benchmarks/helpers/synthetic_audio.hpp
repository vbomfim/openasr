#pragma once

/// @file synthetic_audio.hpp
/// @brief Synthetic audio generators for benchmarks.
///
/// Pre-generate audio data in fixture SetUp() or before benchmark loops —
/// never allocate inside timed regions.

#include "common.hpp"
#include <cmath>
#include <cstddef>
#include <numbers>
#include <random>
#include <vector>

namespace wss::bench {

/// Generate a sine wave at the given frequency and sample rate.
/// @param num_samples  Number of samples to generate.
/// @param frequency_hz Tone frequency in Hz (default 440 = A4).
/// @param sample_rate  Sample rate in Hz (default 16000).
/// @param amplitude    Peak amplitude in [-1, 1] range (default 0.5).
/// @return Vector of float samples.
[[nodiscard]] inline std::vector<SampleFloat> generate_sine(
    size_t num_samples,
    float frequency_hz = 440.0f,
    float sample_rate = 16000.0f,
    float amplitude = 0.5f) {
    std::vector<SampleFloat> samples(num_samples);
    const auto angular_freq =
        2.0f * static_cast<float>(std::numbers::pi) * frequency_hz / sample_rate;
    for (size_t i = 0; i < num_samples; ++i) {
        samples[i] = amplitude * std::sin(angular_freq * static_cast<float>(i));
    }
    return samples;
}

/// Generate silence (zero-valued samples).
/// @param num_samples Number of samples to generate.
/// @return Vector of zero-valued float samples.
[[nodiscard]] inline std::vector<SampleFloat> generate_silence(size_t num_samples) {
    return std::vector<SampleFloat>(num_samples, 0.0f);
}

/// Generate white noise uniformly distributed in [-amplitude, +amplitude].
/// @param num_samples Number of samples to generate.
/// @param amplitude   Peak amplitude (default 0.5).
/// @param seed        RNG seed for reproducibility (default 42).
/// @return Vector of float samples.
[[nodiscard]] inline std::vector<SampleFloat> generate_noise(
    size_t num_samples,
    float amplitude = 0.5f,
    unsigned int seed = 42) {
    std::mt19937 rng(seed);
    std::uniform_real_distribution<float> dist(-amplitude, amplitude);
    std::vector<SampleFloat> samples(num_samples);
    for (auto& s : samples) {
        s = dist(rng);
    }
    return samples;
}

} // namespace wss::bench
