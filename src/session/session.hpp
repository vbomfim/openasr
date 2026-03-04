#pragma once

#include "audio/audio_pipeline.hpp"
#include "audio/buffer_engine.hpp"
#include "aggregation/result_aggregator.hpp"
#include "protocol/messages.hpp"
#include "common.hpp"
#include <spdlog/spdlog.h>
#include <memory>
#include <string>
#include <mutex>

namespace wss::session {

/// Per-session state. Owns all audio buffers and pipeline components.
/// All memory is pre-allocated at construction — no allocations during streaming.
class Session {
public:
    static constexpr size_t kMaxTranscriptLength = 1024 * 1024; // 1MB
    static constexpr int64_t kMaxSessionDurationMs = 7200000;   // 2 hours

    struct Config {
        std::string session_id;
        std::string language = "en";
        int32_t sample_rate = 16000;
        std::string encoding = "pcm_s16le";
        int32_t window_duration_ms = 20000;
        int32_t overlap_duration_ms = 2000;
        std::string backend_model_id = "whisper-large-v3";
        float ring_buffer_seconds = 30.0f;
        bool vad_enabled = false;
    };

    explicit Session(Config config)
        : config_(std::move(config))
        , pipeline_(config_.sample_rate, config_.ring_buffer_seconds)
        , buffer_engine_(config_.window_duration_ms, config_.overlap_duration_ms,
                         config_.vad_enabled) {
        // Initialize Opus decoder if encoding is "opus"
        if (config_.encoding == "opus") {
            pipeline_.init_opus(config_.sample_rate);
        }

        // Pre-allocate transcript storage
        transcript_.reserve(4096);
    }

    Session(const Session&) = delete;
    Session& operator=(const Session&) = delete;

    /// Ingest raw audio bytes from a WebSocket binary frame.
    /// Thread-safe: may be called from I/O thread.
    /// When VAD is enabled, also processes audio through the VAD detector.
    size_t ingest_audio(const uint8_t* data, size_t byte_count) {
        std::lock_guard lock(mutex_);
        size_t total_before = pipeline_.ring_buffer().total_written();
        size_t written;
        if (config_.encoding == "opus") {
            written = pipeline_.ingest_opus(data, byte_count);
        } else {
            written = pipeline_.ingest_pcm(data, byte_count);
        }

        // Process new samples through VAD if enabled
        if (config_.vad_enabled && written > 0) {
            size_t total_after = pipeline_.ring_buffer().total_written();
            size_t new_samples = total_after - total_before;
            if (vad_scratch_.size() < new_samples) {
                vad_scratch_.resize(new_samples);
            }
            // Extract only the newly written samples (offset 0 = most recent)
            size_t extracted = pipeline_.ring_buffer().extract_window(
                vad_scratch_.data(), new_samples, 0);
            if (extracted > 0) {
                buffer_engine_.process_vad(vad_scratch_.data(), extracted);
            }
        }

        return written;
    }

    /// Set encoding (called once from speech.config handler).
    void set_encoding(const std::string& encoding) {
        std::lock_guard lock(mutex_);
        config_.encoding = encoding;
        if (encoding == "opus" && !pipeline_.has_opus()) {
            pipeline_.init_opus(config_.sample_rate);
        }
    }

    /// Check if a window is ready for transcription.
    [[nodiscard]] bool window_ready() const {
        return buffer_engine_.window_ready(pipeline_.ring_buffer());
    }

    /// Extract the next audio window for transcription.
    audio::BufferEngine::WindowResult extract_window() {
        std::lock_guard lock(mutex_);
        return buffer_engine_.extract_window(pipeline_.ring_buffer());
    }

    /// Append transcribed text to the growing transcript (legacy path).
    void append_transcript(std::string_view text) {
        std::lock_guard lock(mutex_);
        if (transcript_.size() > kMaxTranscriptLength) {
            spdlog::warn("Transcript limit reached for session {}", config_.session_id);
            return;
        }
        if (!transcript_.empty() && !text.empty()) {
            transcript_ += ' ';
        }
        transcript_ += text;
        last_text_offset_ = static_cast<int64_t>(transcript_.size());
    }

    /// Add transcription segments via the ResultAggregator (handles overlap dedup).
    void add_transcription_result(const std::vector<transcription::Segment>& segments,
                                  int64_t window_start_ms, int64_t window_end_ms) {
        std::lock_guard lock(mutex_);
        if (transcript_.size() > kMaxTranscriptLength) {
            spdlog::warn("Transcript limit reached for session {}", config_.session_id);
            return;
        }
        aggregator_.add_window(segments, window_start_ms, window_end_ms);
        transcript_ = aggregator_.full_transcript();
        last_text_offset_ = static_cast<int64_t>(transcript_.size());
    }

    /// Update last processed audio position.
    void set_last_audio_ms(int64_t ms) {
        last_audio_ms_ = ms;
    }

    /// Build a checkpoint from current state.
    [[nodiscard]] protocol::CheckpointData make_checkpoint() const {
        std::lock_guard lock(mutex_);
        return {
            .session_id = config_.session_id,
            .last_audio_ms = last_audio_ms_,
            .last_text_offset = last_text_offset_,
            .full_transcript = transcript_,
            .buffer_config = {
                .window_duration_ms = config_.window_duration_ms,
                .overlap_duration_ms = config_.overlap_duration_ms
            },
            .backend_model_id = config_.backend_model_id
        };
    }

    /// Restore from checkpoint (for session resume).
    void restore_from_checkpoint(const protocol::CheckpointData& cp) {
        std::lock_guard lock(mutex_);
        last_audio_ms_ = cp.last_audio_ms;
        last_text_offset_ = cp.last_text_offset;
        transcript_ = cp.full_transcript;
        pipeline_.reset();
        buffer_engine_.reset_to(cp.last_audio_ms);
    }

    [[nodiscard]] const Config& config() const { return config_; }
    [[nodiscard]] const std::string& session_id() const { return config_.session_id; }
    [[nodiscard]] const std::string& transcript() const { return transcript_; }
    [[nodiscard]] int64_t last_audio_ms() const { return last_audio_ms_; }
    [[nodiscard]] float ring_buffer_fill_ratio() const {
        return pipeline_.ring_buffer().fill_ratio();
    }
    [[nodiscard]] size_t ring_buffer_total_written() const {
        return pipeline_.ring_buffer().total_written();
    }
    [[nodiscard]] size_t window_samples() const {
        return buffer_engine_.window_samples();
    }

private:
    Config config_;
    audio::AudioPipeline pipeline_;
    audio::BufferEngine buffer_engine_;
    aggregation::ResultAggregator aggregator_;

    std::string transcript_;
    int64_t last_audio_ms_ = 0;
    int64_t last_text_offset_ = 0;
    std::vector<SampleFloat> vad_scratch_; // scratch buffer for VAD processing

    mutable std::mutex mutex_;
};

} // namespace wss::session
