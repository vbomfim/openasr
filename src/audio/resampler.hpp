#pragma once

#include "common.hpp"
#include <samplerate.h>
#include <stdexcept>
#include <string>
#include <vector>

namespace wss::audio {

/// RAII wrapper around libsamplerate.
/// Per-session: maintains internal state for streaming resampling.
class Resampler {
public:
    /// Create resampler for converting from `src_rate` to `dst_rate`.
    /// Uses SRC_SINC_MEDIUM_QUALITY for good quality/speed tradeoff.
    Resampler(int32_t src_rate, int32_t dst_rate, int channels = 1)
        : src_rate_(src_rate)
        , dst_rate_(dst_rate)
        , ratio_(src_rate > 0 ? static_cast<double>(dst_rate) / static_cast<double>(src_rate) : 1.0)
        , channels_(channels) {
        if (src_rate <= 0 || dst_rate <= 0) {
            throw std::invalid_argument("Sample rates must be positive");
        }
        int error = 0;
        state_ = src_new(SRC_SINC_MEDIUM_QUALITY, channels, &error);
        if (!state_ || error != 0) {
            throw std::runtime_error(
                std::string("Failed to create resampler: ") + src_strerror(error));
        }
        // Pre-allocate output buffer for typical chunk sizes
        output_buffer_.resize(4096);
    }

    ~Resampler() {
        if (state_) {
            src_delete(state_);
        }
    }

    Resampler(const Resampler&) = delete;
    Resampler& operator=(const Resampler&) = delete;

    Resampler(Resampler&& other) noexcept
        : state_(other.state_)
        , src_rate_(other.src_rate_)
        , dst_rate_(other.dst_rate_)
        , ratio_(other.ratio_)
        , channels_(other.channels_)
        , output_buffer_(std::move(other.output_buffer_)) {
        other.state_ = nullptr;
    }

    Resampler& operator=(Resampler&& other) noexcept {
        if (this != &other) {
            if (state_) src_delete(state_);
            state_ = other.state_;
            src_rate_ = other.src_rate_;
            dst_rate_ = other.dst_rate_;
            ratio_ = other.ratio_;
            channels_ = other.channels_;
            output_buffer_ = std::move(other.output_buffer_);
            other.state_ = nullptr;
        }
        return *this;
    }

    /// Resample float32 audio in streaming mode.
    /// Returns a view into the internal output buffer (valid until next call).
    struct ResampleResult {
        const SampleFloat* samples;
        size_t count;
        size_t input_consumed;
    };

    ResampleResult process(const SampleFloat* input, size_t input_count, bool end_of_input = false) {
        // Ensure output buffer is large enough
        size_t max_output = static_cast<size_t>(
            static_cast<double>(input_count) * ratio_ + 32.0);
        if (output_buffer_.size() < max_output) {
            output_buffer_.resize(max_output);
        }

        SRC_DATA data{};
        data.data_in = input;
        data.input_frames = static_cast<long>(input_count);
        data.data_out = output_buffer_.data();
        data.output_frames = static_cast<long>(output_buffer_.size());
        data.src_ratio = ratio_;
        data.end_of_input = end_of_input ? 1 : 0;

        int error = src_process(state_, &data);
        if (error != 0) {
            throw std::runtime_error(
                std::string("Resample error: ") + src_strerror(error));
        }

        return {
            output_buffer_.data(),
            static_cast<size_t>(data.output_frames_gen),
            static_cast<size_t>(data.input_frames_used)
        };
    }

    /// Reset internal state (e.g., on session resume).
    void reset() {
        if (state_) {
            src_reset(state_);
        }
    }

    [[nodiscard]] bool needs_resampling() const { return src_rate_ != dst_rate_; }
    [[nodiscard]] double ratio() const { return ratio_; }

private:
    SRC_STATE* state_ = nullptr;
    int32_t src_rate_;
    int32_t dst_rate_;
    double ratio_;
    int channels_;
    std::vector<SampleFloat> output_buffer_; // pre-allocated
};

} // namespace wss::audio
