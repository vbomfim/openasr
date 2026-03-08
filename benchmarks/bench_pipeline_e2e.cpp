/// @file bench_pipeline_e2e.cpp
/// @brief End-to-end pipeline macro-benchmarks.
///
/// Exercises the FULL pipeline path: ingest PCM → window_ready → extract_window
/// → mock transcribe → ResultAggregator::add_window → full_transcript.
/// Also measures multi-session scaling with concurrent pipeline instances.

#include <benchmark/benchmark.h>
#include "audio/audio_pipeline.hpp"
#include "audio/buffer_engine.hpp"
#include "aggregation/result_aggregator.hpp"
#include "transcription/backend_interface.hpp"
#include "helpers/synthetic_audio.hpp"

#include <cstddef>
#include <cstdint>
#include <memory>
#include <string>
#include <vector>

namespace {

constexpr int kSampleRate = wss::kWhisperSampleRate;  // 16 000 Hz

/// Convert milliseconds to sample count at 16 kHz.
constexpr size_t ms_to_samples(int64_t ms) {
    return static_cast<size_t>(ms * kSampleRate / 1000);
}

// ---------------------------------------------------------------------------
// Helper: generate PCM int16 little-endian byte data from a float sine wave.
// Pre-generated outside the timed loop — never allocate in the hot path.
// ---------------------------------------------------------------------------
[[nodiscard]] std::vector<uint8_t> generate_pcm_bytes(
    size_t num_samples,
    int sample_rate = kSampleRate,
    float frequency_hz = 440.0f,
    float amplitude = 0.5f) {
    auto floats = wss::bench::generate_sine(
        num_samples, frequency_hz, static_cast<float>(sample_rate), amplitude);
    std::vector<uint8_t> bytes(num_samples * 2);
    for (size_t i = 0; i < num_samples; ++i) {
        auto s = static_cast<int16_t>(floats[i] * 32767.0f);
        auto us = static_cast<uint16_t>(s);
        bytes[i * 2]     = static_cast<uint8_t>(us & 0xFF);
        bytes[i * 2 + 1] = static_cast<uint8_t>((us >> 8) & 0xFF);
    }
    return bytes;
}

// ---------------------------------------------------------------------------
// MockBackend: returns a fixed TranscriptionResult with realistic segments.
// Zero-cost transcription to isolate pipeline overhead from model inference.
// ---------------------------------------------------------------------------
class MockBackend final : public wss::transcription::ITranscriptionBackend {
public:
    bool initialize(const wss::transcription::BackendConfig& /*config*/) override {
        return true;
    }

    wss::transcription::TranscriptionResult transcribe(
        const wss::SampleFloat* /*samples*/,
        size_t /*sample_count*/,
        int64_t window_start_ms) override {
        wss::transcription::TranscriptionResult result;
        result.is_final = true;
        result.segments.push_back({
            window_start_ms,
            window_start_ms + 2000,
            "The quick brown fox jumps over the lazy dog.",
            ""
        });
        result.segments.push_back({
            window_start_ms + 2000,
            window_start_ms + 4000,
            "Pack my box with five dozen liquor jugs.",
            ""
        });
        return result;
    }

    [[nodiscard]] bool is_ready() const override { return true; }
};

// ---------------------------------------------------------------------------
// PipelineContext: owns all components for one pipeline instance.
// Encapsulates the AudioPipeline → BufferEngine → ResultAggregator chain.
// ---------------------------------------------------------------------------
struct PipelineContext {
    wss::audio::AudioPipeline   pipeline;
    wss::audio::BufferEngine    buffer_engine;
    wss::aggregation::ResultAggregator aggregator;

    PipelineContext(int32_t window_ms, int32_t overlap_ms)
        : pipeline(kSampleRate, 30.0f)
        , buffer_engine(window_ms, overlap_ms) {}

    void reset() {
        pipeline.reset();
        buffer_engine.reset();
        aggregator.reset();
    }
};

// ---------------------------------------------------------------------------
// BM_Pipeline_E2E_WindowCycle — full pipeline macro-benchmark.
// Parameters: {5000, 10000, 20000} ms window durations.
// Path: ingest PCM → window_ready → extract → mock transcribe → aggregate →
//       full_transcript.
// ---------------------------------------------------------------------------
void BM_Pipeline_E2E_WindowCycle(benchmark::State& state) {
    const auto window_ms = static_cast<int32_t>(state.range(0));
    constexpr int32_t kOverlapMs = 500;
    const size_t window_samples = ms_to_samples(window_ms);

    // Pre-generate PCM bytes for one full window
    const auto pcm_bytes = generate_pcm_bytes(window_samples);

    MockBackend mock_backend;
    PipelineContext ctx(window_ms, kOverlapMs);

    for (auto _ : state) {
        ctx.reset();

        // 1. Ingest PCM audio into the pipeline
        auto written = ctx.pipeline.ingest_pcm(
            pcm_bytes.data(), pcm_bytes.size());
        benchmark::DoNotOptimize(written);

        // 2. Check window ready + extract
        if (ctx.buffer_engine.window_ready(ctx.pipeline.ring_buffer())) {
            auto window = ctx.buffer_engine.extract_window(
                ctx.pipeline.ring_buffer());

            // 3. Mock transcription
            auto result = mock_backend.transcribe(
                window.samples, window.count, window.start_ms);

            // 4. Aggregate results
            ctx.aggregator.add_window(result.segments, window.end_ms);

            // 5. Build full transcript
            const auto& transcript = ctx.aggregator.full_transcript();
            benchmark::DoNotOptimize(transcript.data());
        }
        benchmark::ClobberMemory();
    }

    state.SetBytesProcessed(
        static_cast<int64_t>(state.iterations())
        * static_cast<int64_t>(pcm_bytes.size()));
}

BENCHMARK(BM_Pipeline_E2E_WindowCycle)
    ->Arg(5000)
    ->Arg(10000)
    ->Arg(20000);

// ---------------------------------------------------------------------------
// BM_Pipeline_E2E_MultiSession — scaling with concurrent session count.
// Parameters: {1, 5, 10} sessions.
// Each session has its own AudioPipeline + BufferEngine + ResultAggregator.
// All sessions share the same pre-generated PCM data and MockBackend.
// ---------------------------------------------------------------------------
void BM_Pipeline_E2E_MultiSession(benchmark::State& state) {
    const auto num_sessions = static_cast<size_t>(state.range(0));
    constexpr int32_t kWindowMs  = 5000;
    constexpr int32_t kOverlapMs = 500;
    const size_t window_samples  = ms_to_samples(kWindowMs);

    // Pre-generate PCM bytes (shared across sessions — same audio data)
    const auto pcm_bytes = generate_pcm_bytes(window_samples);

    MockBackend mock_backend;

    // Pre-create N pipeline contexts
    std::vector<std::unique_ptr<PipelineContext>> contexts;
    contexts.reserve(num_sessions);
    for (size_t i = 0; i < num_sessions; ++i) {
        contexts.push_back(
            std::make_unique<PipelineContext>(kWindowMs, kOverlapMs));
    }

    for (auto _ : state) {
        // Reset all pipeline contexts
        for (auto& ctx : contexts) {
            ctx->reset();
        }

        // Process all sessions through the full pipeline
        for (auto& ctx : contexts) {
            // 1. Ingest
            ctx->pipeline.ingest_pcm(pcm_bytes.data(), pcm_bytes.size());

            // 2–5. Extract → transcribe → aggregate → transcript
            if (ctx->buffer_engine.window_ready(ctx->pipeline.ring_buffer())) {
                auto window = ctx->buffer_engine.extract_window(
                    ctx->pipeline.ring_buffer());
                auto result = mock_backend.transcribe(
                    window.samples, window.count, window.start_ms);
                ctx->aggregator.add_window(result.segments, window.end_ms);
                const auto& transcript = ctx->aggregator.full_transcript();
                benchmark::DoNotOptimize(transcript.data());
            }
        }
        benchmark::ClobberMemory();
    }

    state.SetBytesProcessed(
        static_cast<int64_t>(state.iterations())
        * static_cast<int64_t>(num_sessions)
        * static_cast<int64_t>(pcm_bytes.size()));
}

BENCHMARK(BM_Pipeline_E2E_MultiSession)
    ->Arg(1)
    ->Arg(5)
    ->Arg(10);

} // anonymous namespace
