#pragma once

#include "common.hpp"
#include <algorithm>
#include <cmath>
#include <cstddef>
#include <cstdint>
#include <vector>

namespace wss::audio {

/// Configuration for the Voice Activity Detector.
struct VadConfig {
    float energy_threshold = 0.005f;     // RMS threshold for speech detection
    int32_t silence_timeout_ms = 500;    // Silence duration to trigger end-of-speech
    int32_t frame_duration_ms = 30;      // Frame size for VAD analysis
    int32_t max_speech_duration_ms = 30000; // Max continuous speech before forced emit
};

/// Energy-based Voice Activity Detector.
/// Classifies audio frames as speech or silence based on RMS energy.
/// Tracks speech/silence state transitions and silence duration for
/// adaptive windowing (emit window on end-of-speech).
class VoiceActivityDetector {
public:
    /// Result of processing a chunk of audio through the VAD.
    struct Result {
        bool is_speech;          // Whether the frame contains speech
        bool end_of_speech;      // Whether end-of-speech was detected (silence > timeout)
        size_t speech_samples;   // Total speech samples accumulated since last end-of-speech
    };

    explicit VoiceActivityDetector(VadConfig config = {})
        : config_(config)
        , frame_samples_(ms_to_samples(config.frame_duration_ms))
        , silence_timeout_samples_(ms_to_samples(config.silence_timeout_ms))
        , max_speech_samples_(ms_to_samples(config.max_speech_duration_ms)) {}

    /// Process a chunk of audio samples. Returns VAD result for this chunk.
    /// Internally processes frame-by-frame and returns aggregate result.
    Result process(const SampleFloat* samples, size_t count) {
        bool any_speech = false;
        bool eos = false;

        size_t offset = 0;
        while (offset < count) {
            size_t frame_len = std::min(frame_samples_, count - offset);
            bool frame_speech = is_speech_frame(samples + offset, frame_len);

            if (frame_speech) {
                any_speech = true;
                if (!in_speech_) {
                    in_speech_ = true;
                }
                silence_counter_ = 0;
                speech_counter_ += frame_len;

                // Force end-of-speech if max duration exceeded
                if (speech_counter_ >= max_speech_samples_) {
                    eos = true;
                    speech_counter_ = 0;
                    in_speech_ = false;
                    silence_counter_ = 0;
                }
            } else {
                if (in_speech_) {
                    silence_counter_ += frame_len;
                    if (silence_counter_ >= silence_timeout_samples_) {
                        eos = true;
                        in_speech_ = false;
                        silence_counter_ = 0;
                    }
                }
            }

            offset += frame_len;
        }

        return {any_speech || in_speech_, eos, speech_counter_};
    }

    /// Reset VAD state.
    void reset() {
        in_speech_ = false;
        silence_counter_ = 0;
        speech_counter_ = 0;
    }

    /// Whether the VAD currently considers speech to be active.
    [[nodiscard]] bool in_speech() const { return in_speech_; }

    /// Total speech samples accumulated since last end-of-speech/reset.
    [[nodiscard]] size_t speech_samples() const { return speech_counter_; }

    [[nodiscard]] const VadConfig& config() const { return config_; }

private:
    /// Compute RMS energy of a frame and compare to threshold.
    [[nodiscard]] bool is_speech_frame(const SampleFloat* samples, size_t count) const {
        if (count == 0) return false;

        float sum_sq = 0.0f;
        for (size_t i = 0; i < count; ++i) {
            sum_sq += samples[i] * samples[i];
        }
        float rms = std::sqrt(sum_sq / static_cast<float>(count));
        return rms >= config_.energy_threshold;
    }

    static size_t ms_to_samples(int32_t ms) {
        return static_cast<size_t>(static_cast<int64_t>(ms) * kWhisperSampleRate / 1000);
    }

    VadConfig config_;
    size_t frame_samples_;
    size_t silence_timeout_samples_;
    size_t max_speech_samples_;

    bool in_speech_ = false;
    size_t silence_counter_ = 0;   // consecutive silence samples
    size_t speech_counter_ = 0;    // speech samples since last end-of-speech
};

} // namespace wss::audio
