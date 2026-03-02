#pragma once

#include "common.hpp"
#include <opus.h>
#include <memory>
#include <stdexcept>
#include <vector>

namespace wss::audio {

/// RAII wrapper around libopus decoder.
/// Per-session: each session gets its own decoder to maintain state.
class OpusDecoder {
public:
    /// Create decoder for given sample rate and channels.
    /// Throws on failure.
    explicit OpusDecoder(int32_t sample_rate, int channels = 1)
        : sample_rate_(sample_rate), channels_(channels) {
        int error = 0;
        decoder_ = opus_decoder_create(sample_rate, channels, &error);
        if (error != OPUS_OK || !decoder_) {
            throw std::runtime_error(
                std::string("Failed to create Opus decoder: ") + opus_strerror(error));
        }
        // Pre-allocate decode buffer for max frame size (120ms @ sample_rate)
        max_frame_samples_ = static_cast<size_t>(sample_rate) * 120 / 1000;
        decode_buffer_.resize(max_frame_samples_ * static_cast<size_t>(channels));
    }

    ~OpusDecoder() {
        if (decoder_) {
            opus_decoder_destroy(decoder_);
        }
    }

    OpusDecoder(const OpusDecoder&) = delete;
    OpusDecoder& operator=(const OpusDecoder&) = delete;

    OpusDecoder(OpusDecoder&& other) noexcept
        : decoder_(other.decoder_)
        , sample_rate_(other.sample_rate_)
        , channels_(other.channels_)
        , max_frame_samples_(other.max_frame_samples_)
        , decode_buffer_(std::move(other.decode_buffer_)) {
        other.decoder_ = nullptr;
    }

    OpusDecoder& operator=(OpusDecoder&& other) noexcept {
        if (this != &other) {
            if (decoder_) opus_decoder_destroy(decoder_);
            decoder_ = other.decoder_;
            sample_rate_ = other.sample_rate_;
            channels_ = other.channels_;
            max_frame_samples_ = other.max_frame_samples_;
            decode_buffer_ = std::move(other.decode_buffer_);
            other.decoder_ = nullptr;
        }
        return *this;
    }

    /// Decode an Opus packet into PCM int16 samples.
    /// Returns a span into the internal decode buffer (valid until next decode call).
    /// This is zero-copy from the caller's perspective.
    struct DecodeResult {
        const int16_t* samples;
        size_t count; // per channel
    };

    DecodeResult decode(const uint8_t* opus_data, size_t opus_len) {
        int frame_size = opus_decode(
            decoder_,
            opus_data,
            static_cast<opus_int32>(opus_len),
            decode_buffer_.data(),
            static_cast<int>(max_frame_samples_),
            0 // no FEC
        );

        if (frame_size < 0) {
            throw std::runtime_error(
                std::string("Opus decode error: ") + opus_strerror(frame_size));
        }

        return {decode_buffer_.data(), static_cast<size_t>(frame_size)};
    }

    [[nodiscard]] int32_t sample_rate() const { return sample_rate_; }

private:
    ::OpusDecoder* decoder_ = nullptr;
    int32_t sample_rate_;
    int channels_;
    size_t max_frame_samples_;
    std::vector<int16_t> decode_buffer_; // pre-allocated
};

} // namespace wss::audio
