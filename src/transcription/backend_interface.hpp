#pragma once

#include "common.hpp"
#include <cstdint>
#include <string>
#include <vector>

namespace wss::transcription {

/// Transcription result segment.
struct Segment {
    int64_t start_ms = 0;
    int64_t end_ms = 0;
    std::string text;
    std::string speaker; // empty if no diarization
};

/// Result from a single window transcription.
struct TranscriptionResult {
    std::vector<Segment> segments;
    bool is_final = false;
};

/// Configuration for backend initialization.
struct BackendConfig {
    std::string language = "en";
    int sample_rate = kWhisperSampleRate;
    std::string model_id;
    std::string model_path;
    int beam_size = 5;
    int n_threads = 4;
};

/// Abstract transcription backend interface.
/// All implementations use pointer + length for zero-copy.
class ITranscriptionBackend {
public:
    virtual ~ITranscriptionBackend() = default;

    /// Initialize the backend (load model, allocate resources).
    virtual bool initialize(const BackendConfig& config) = 0;

    /// Transcribe a window of float32 audio at 16kHz.
    /// `samples` points to contiguous float32 data, `sample_count` is the number of samples.
    /// `window_start_ms` is the absolute position for timestamp offsetting.
    virtual TranscriptionResult transcribe(
        const SampleFloat* samples,
        size_t sample_count,
        int64_t window_start_ms
    ) = 0;

    /// Check if the backend is ready for inference.
    [[nodiscard]] virtual bool is_ready() const = 0;
};

} // namespace wss::transcription
