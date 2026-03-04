#pragma once

#include "audio/audio_ring_buffer.hpp"
#include "audio/vad.hpp"
#include "common.hpp"
#include <algorithm>
#include <vector>

namespace wss::audio {

/// Windowing engine over an AudioRingBuffer.
/// Tracks the sliding window position and detects when a new window is ready.
/// Supports two modes:
///   - Fixed windowing (default): sliding window with configurable overlap
///   - VAD-aware windowing: adaptive windows aligned to speech boundaries
class BufferEngine {
public:
    /// Configure windowing parameters.
    /// All durations in milliseconds, internally tracked as sample counts at 16kHz.
    BufferEngine(int32_t window_duration_ms, int32_t overlap_duration_ms,
                 bool vad_enabled = false,
                 VadConfig vad_config = {})
        : window_samples_(ms_to_samples(window_duration_ms))
        , overlap_samples_(ms_to_samples(overlap_duration_ms))
        , stride_samples_(window_samples_ - overlap_samples_)
        , next_window_end_(window_samples_)
        , vad_enabled_(vad_enabled) {
        // Pre-allocate the window extraction buffer once
        window_buffer_.resize(window_samples_);

        if (vad_enabled_) {
            vad_ = VoiceActivityDetector(vad_config);
            // Pre-allocate VAD scratch buffer for processing incoming audio
            vad_scratch_.resize(window_samples_);
        }
    }

    /// Check if a new window is ready based on ring buffer state.
    [[nodiscard]] bool window_ready(const AudioRingBuffer& ring) const {
        if (vad_enabled_) {
            return vad_window_ready_;
        }
        size_t total = ring.total_written();
        return total >= next_window_end_;
    }

    /// Feed audio to the VAD for speech/silence detection.
    /// Must be called when vad_enabled is true, after writing to the ring buffer.
    /// Returns the VAD result for the processed chunk.
    VoiceActivityDetector::Result process_vad(const SampleFloat* samples, size_t count) {
        auto result = vad_.process(samples, count);
        vad_total_samples_ += count;

        if (result.end_of_speech && vad_total_samples_ > vad_window_start_) {
            vad_window_ready_ = true;
            vad_window_end_ = vad_total_samples_;
        }

        // Force window if max duration exceeded
        size_t pending = vad_total_samples_ - vad_window_start_;
        if (!vad_window_ready_ && pending >= window_samples_) {
            vad_window_ready_ = true;
            vad_window_end_ = vad_total_samples_;
        }

        return result;
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
        if (vad_enabled_) {
            return extract_vad_window(ring);
        }
        return extract_fixed_window(ring);
    }

    /// Reset window tracking (e.g., for resume from checkpoint).
    void reset() {
        next_window_start_ = 0;
        next_window_end_ = window_samples_;
        if (vad_enabled_) {
            vad_.reset();
            vad_window_ready_ = false;
            vad_window_start_ = 0;
            vad_window_end_ = 0;
            vad_total_samples_ = 0;
        }
    }

    /// Reset to a specific audio position (for checkpoint resume).
    void reset_to(int64_t audio_ms) {
        next_window_start_ = ms_to_samples(audio_ms);
        next_window_end_ = next_window_start_ + window_samples_;
        if (vad_enabled_) {
            vad_.reset();
            vad_window_ready_ = false;
            vad_window_start_ = ms_to_samples(audio_ms);
            vad_window_end_ = 0;
            vad_total_samples_ = ms_to_samples(audio_ms);
        }
    }

    [[nodiscard]] size_t window_samples() const { return window_samples_; }
    [[nodiscard]] size_t stride_samples() const { return stride_samples_; }
    [[nodiscard]] bool vad_enabled() const { return vad_enabled_; }

private:
    /// Fixed windowing: extract using sliding window with overlap.
    WindowResult extract_fixed_window(const AudioRingBuffer& ring) {
        if (!window_ready(ring)) {
            return {nullptr, 0, 0, 0};
        }

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

    /// VAD-aware windowing: extract variable-length window aligned to speech boundaries.
    WindowResult extract_vad_window(const AudioRingBuffer& ring) {
        if (!vad_window_ready_) {
            return {nullptr, 0, 0, 0};
        }

        size_t window_len = vad_window_end_ - vad_window_start_;

        // Ensure extraction buffer is large enough
        if (window_buffer_.size() < window_len) {
            window_buffer_.resize(window_len);
        }

        // Extract from ring buffer
        size_t total = ring.total_written();
        size_t offset_from_end = total - vad_window_end_;

        size_t extracted = ring.extract_window(
            window_buffer_.data(), window_len, offset_from_end);

        int64_t start_ms = samples_to_ms(vad_window_start_);
        int64_t end_ms = samples_to_ms(vad_window_end_);

        // Advance for next VAD window
        vad_window_start_ = vad_window_end_;
        vad_window_ready_ = false;
        vad_window_end_ = 0;

        return {window_buffer_.data(), extracted, start_ms, end_ms};
    }

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

    // VAD state
    bool vad_enabled_ = false;
    VoiceActivityDetector vad_;
    bool vad_window_ready_ = false;
    size_t vad_window_start_ = 0;
    size_t vad_window_end_ = 0;
    size_t vad_total_samples_ = 0;
    std::vector<SampleFloat> vad_scratch_;
};

} // namespace wss::audio
