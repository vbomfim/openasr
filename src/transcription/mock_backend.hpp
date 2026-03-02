#pragma once

#include "transcription/backend_interface.hpp"
#include <spdlog/spdlog.h>

namespace wss::transcription {

/// Mock backend for development and testing.
/// Returns deterministic canned segments.
class MockBackend : public ITranscriptionBackend {
public:
    bool initialize(const BackendConfig& config) override {
        config_ = config;
        ready_ = true;
        spdlog::info("MockBackend initialized: language={} model={}",
            config.language, config.model_id);
        return true;
    }

    TranscriptionResult transcribe(
        const SampleFloat* /*samples*/,
        size_t sample_count,
        int64_t window_start_ms
    ) override {
        int64_t duration_ms = static_cast<int64_t>(sample_count) * 1000 / kWhisperSampleRate;
        TranscriptionResult result;
        result.segments.push_back({
            .start_ms = window_start_ms,
            .end_ms = window_start_ms + duration_ms,
            .text = "[mock transcription at " + std::to_string(window_start_ms) + "ms]",
            .speaker = ""
        });
        result.is_final = false;
        return result;
    }

    [[nodiscard]] bool is_ready() const override { return ready_; }

private:
    BackendConfig config_;
    bool ready_ = false;
};

} // namespace wss::transcription
