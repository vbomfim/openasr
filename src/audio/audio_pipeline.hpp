#pragma once

#include "audio/audio_ring_buffer.hpp"
#include "audio/audio_utils.hpp"
#include "audio/opus_decoder.hpp"
#include "audio/resampler.hpp"
#include "common.hpp"
#include <memory>
#include <string>
#include <vector>

namespace wss::audio {

/// Audio ingestion pipeline: decode → normalize → resample → ring buffer.
/// All buffers are pre-allocated. No heap allocations on the hot path.
class AudioPipeline {
public:
    /// Configure the pipeline for a specific session.
    /// `input_sample_rate`: sample rate of incoming audio (from HELLO)
    /// `ring_buffer_seconds`: how many seconds of audio to buffer
    AudioPipeline(int32_t input_sample_rate, float ring_buffer_seconds = 30.0f)
        : input_sample_rate_(input_sample_rate)
        , ring_buffer_(static_cast<size_t>(
            static_cast<float>(kWhisperSampleRate) * ring_buffer_seconds))
    {
        // Pre-allocate conversion scratch buffer (max expected chunk: 1s of audio)
        size_t max_chunk_samples = static_cast<size_t>(input_sample_rate);
        float_scratch_.resize(max_chunk_samples);

        // Set up resampler if input rate differs from whisper's 16kHz
        if (input_sample_rate != kWhisperSampleRate) {
            resampler_ = std::make_unique<Resampler>(
                input_sample_rate, kWhisperSampleRate);
        }
    }

    /// Initialize Opus decoder for this session (call only if encoding is "opus").
    void init_opus(int32_t opus_sample_rate) {
        opus_decoder_ = std::make_unique<OpusDecoder>(opus_sample_rate);
    }

    /// Ingest PCM int16 little-endian audio bytes.
    /// Converts to float32 and resamples to 16kHz, writes to ring buffer.
    /// Zero intermediate allocations.
    size_t ingest_pcm(const uint8_t* data, size_t byte_count) {
        size_t sample_count = byte_count / 2;

        // Ensure scratch buffer is large enough
        if (float_scratch_.size() < sample_count) {
            float_scratch_.resize(sample_count);
        }

        // Convert PCM bytes → float32
        pcm_bytes_to_float(data, float_scratch_.data(), byte_count);

        // Resample if needed, then write to ring buffer
        return resample_and_write(float_scratch_.data(), sample_count);
    }

    /// Ingest Opus-encoded audio bytes.
    /// Decodes → converts → resamples → writes to ring buffer.
    size_t ingest_opus(const uint8_t* data, size_t byte_count) {
        if (!opus_decoder_) {
            return 0;
        }

        // Decode Opus → PCM int16 (into decoder's internal buffer)
        auto result = opus_decoder_->decode(data, byte_count);

        // Ensure scratch buffer is large enough
        if (float_scratch_.size() < result.count) {
            float_scratch_.resize(result.count);
        }

        // Convert PCM int16 → float32
        pcm_s16le_to_float(result.samples, float_scratch_.data(), result.count);

        // Resample if needed, then write to ring buffer
        return resample_and_write(float_scratch_.data(), result.count);
    }

    /// Access the underlying ring buffer (for window extraction).
    [[nodiscard]] const AudioRingBuffer& ring_buffer() const { return ring_buffer_; }
    [[nodiscard]] AudioRingBuffer& ring_buffer() { return ring_buffer_; }

    [[nodiscard]] int32_t input_sample_rate() const { return input_sample_rate_; }

    /// Reset pipeline state (for session resume).
    void reset() {
        ring_buffer_.reset();
        if (resampler_) resampler_->reset();
    }

private:
    /// Resample (if needed) and write to ring buffer.
    size_t resample_and_write(const SampleFloat* samples, size_t count) {
        if (resampler_ && resampler_->needs_resampling()) {
            auto result = resampler_->process(samples, count);
            return ring_buffer_.write(result.samples, result.count);
        }
        return ring_buffer_.write(samples, count);
    }

    int32_t input_sample_rate_;
    AudioRingBuffer ring_buffer_;
    std::unique_ptr<Resampler> resampler_;
    std::unique_ptr<OpusDecoder> opus_decoder_;
    std::vector<SampleFloat> float_scratch_; // pre-allocated conversion buffer
};

} // namespace wss::audio
