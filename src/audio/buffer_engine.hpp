#pragma once

#include "audio/audio_ring_buffer.hpp"
#include "common.hpp"
#include <vector>

namespace wss::audio {

/// Windowing engine over an AudioRingBuffer.
/// Tracks the sliding window position and detects when a new window is ready.
class BufferEngine {
public:
    /// Configure windowing parameters.
    /// All durations in milliseconds, internally tracked as sample counts at 16kHz.
    BufferEngine(int32_t window_duration_ms, int32_t overlap_duration_ms)
        : window_samples_(ms_to_samples(window_duration_ms))
        , overlap_samples_(ms_to_samples(overlap_duration_ms))
        , stride_samples_(window_samples_ - overlap_samples_)
        , next_window_end_(window_samples_) {
        // Pre-allocate the window extraction buffer once
        window_buffer_.resize(window_samples_);
    }

    /// Check if a new window is ready based on ring buffer state.
    [[nodiscard]] bool window_ready(const AudioRingBuffer& ring) const {
        size_t total = ring.total_written();
        return total >= next_window_end_;
    }

    /// Extract the next window into the pre-allocated buffer.
    /// Returns a span over the extracted samples, or empty if not ready.
    /// Advances the window position.
    struct WindowResult {
        const SampleFloat* samples;
        size_t count;
        int64_t start_ms;
        int64_t end_ms;
    };

    WindowResult extract_window(const AudioRingBuffer& ring) {
        if (!window_ready(ring)) {
            return {nullptr, 0, 0, 0};
        }

        // How far back from write head is the start of this window
        size_t total = ring.total_written();
        size_t offset_from_end = total - next_window_end_;

        size_t extracted = ring.extract_window(
            window_buffer_.data(), window_samples_, offset_from_end);

        int64_t start_ms = samples_to_ms(next_window_start_);
        int64_t end_ms = samples_to_ms(next_window_end_);

        // Advance for next window
        next_window_start_ += stride_samples_;
        next_window_end_ = next_window_start_ + window_samples_;

        return {window_buffer_.data(), extracted, start_ms, end_ms};
    }

    /// Reset window tracking (e.g., for resume from checkpoint).
    void reset() {
        next_window_start_ = 0;
        next_window_end_ = window_samples_;
    }

    /// Reset to a specific audio position (for checkpoint resume).
    void reset_to(int64_t audio_ms) {
        next_window_start_ = ms_to_samples(audio_ms);
        next_window_end_ = next_window_start_ + window_samples_;
    }

    [[nodiscard]] size_t window_samples() const { return window_samples_; }
    [[nodiscard]] size_t stride_samples() const { return stride_samples_; }

private:
    static size_t ms_to_samples(int64_t ms) {
        return static_cast<size_t>(ms * kWhisperSampleRate / 1000);
    }

    static int64_t samples_to_ms(size_t samples) {
        return static_cast<int64_t>(samples) * 1000 / kWhisperSampleRate;
    }

    size_t window_samples_;
    size_t overlap_samples_;
    size_t stride_samples_;
    size_t next_window_start_ = 0;
    size_t next_window_end_ = 0; // initialized in constructor body
    std::vector<SampleFloat> window_buffer_; // pre-allocated
};

} // namespace wss::audio
