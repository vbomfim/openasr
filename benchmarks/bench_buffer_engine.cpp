/// @file bench_buffer_engine.cpp
/// @brief Micro-benchmarks for BufferEngine windowing and VoiceActivityDetector.
///
/// Measures window_ready(), extract_fixed_window(), extract_vad_window(),
/// VAD::process(), and is_speech_frame() at production-relevant audio sizes.

#include <benchmark/benchmark.h>
#include "audio/buffer_engine.hpp"
#include "audio/audio_ring_buffer.hpp"
#include "audio/vad.hpp"
#include "helpers/synthetic_audio.hpp"

#include <cstddef>
#include <vector>

namespace {

constexpr int kSampleRate = wss::kWhisperSampleRate;  // 16 000 Hz

// Production ring buffer: 30 s at 16 kHz
constexpr size_t kRingCapacity = static_cast<size_t>(kSampleRate) * 30;

/// Convert milliseconds to sample count at 16 kHz.
constexpr size_t ms_to_samples(int64_t ms) {
    return static_cast<size_t>(ms * kSampleRate / 1000);
}

// ---------------------------------------------------------------------------
// BM_BufferEngine_WindowReady — trivial comparison baseline.
// Measures the cost of window_ready() on a pre-filled ring buffer.
// ---------------------------------------------------------------------------
void BM_BufferEngine_WindowReady(benchmark::State& state) {
    constexpr int32_t kWindowMs = 5000;
    constexpr int32_t kOverlapMs = 500;
    wss::audio::BufferEngine engine(kWindowMs, kOverlapMs);

    wss::audio::AudioRingBuffer ring(kRingCapacity);
    const auto fill = wss::bench::generate_sine(ms_to_samples(kWindowMs));
    ring.write(fill.data(), fill.size());

    for (auto _ : state) {
        auto ready = engine.window_ready(ring);
        benchmark::DoNotOptimize(ready);
    }
}

BENCHMARK(BM_BufferEngine_WindowReady);

// ---------------------------------------------------------------------------
// BM_BufferEngine_ExtractFixedWindow — fixed window extraction full cycle.
// Parameters: {5000, 10000, 20000} ms window durations.
// Pre-fills the ring buffer and extracts one window per iteration.
// ---------------------------------------------------------------------------
void BM_BufferEngine_ExtractFixedWindow(benchmark::State& state) {
    const auto window_ms = static_cast<int32_t>(state.range(0));
    constexpr int32_t kOverlapMs = 500;
    const size_t window_samples = ms_to_samples(window_ms);
    const size_t stride_samples = window_samples - ms_to_samples(kOverlapMs);

    wss::audio::BufferEngine engine(window_ms, kOverlapMs);
    wss::audio::AudioRingBuffer ring(kRingCapacity);

    // Pre-fill enough data for multiple windows
    const auto fill = wss::bench::generate_sine(kRingCapacity);
    ring.write(fill.data(), fill.size());

    // Pre-allocate stride data for re-filling between window extractions
    // (simulates realistic streaming: new audio arrives between each window)
    const auto stride_data = wss::bench::generate_sine(stride_samples);

    for (auto _ : state) {
        if (!engine.window_ready(ring)) {
            // Exhausted ring — reset and refill (excluded from measurement)
            state.PauseTiming();
            ring.reset();
            ring.write(fill.data(), fill.size());
            engine.reset();
            state.ResumeTiming();
        }
        auto result = engine.extract_window(ring);
        benchmark::DoNotOptimize(result.samples);
        benchmark::DoNotOptimize(result.count);
        benchmark::ClobberMemory();

        // Simulate streaming: write one stride of new audio between extractions
        ring.write(stride_data.data(), stride_data.size());
    }

    state.SetBytesProcessed(
        static_cast<int64_t>(state.iterations())
        * static_cast<int64_t>(window_samples)
        * static_cast<int64_t>(sizeof(wss::SampleFloat)));
}

BENCHMARK(BM_BufferEngine_ExtractFixedWindow)
    ->Arg(5000)
    ->Arg(10000)
    ->Arg(20000);

// ---------------------------------------------------------------------------
// BM_BufferEngine_ExtractVADWindow — VAD-adaptive window extraction.
// Simulates speech → silence → extract cycle.
// ---------------------------------------------------------------------------
void BM_BufferEngine_ExtractVADWindow(benchmark::State& state) {
    constexpr int32_t kWindowMs = 20000;
    constexpr int32_t kOverlapMs = 2000;

    wss::audio::VadConfig vad_cfg;
    vad_cfg.silence_timeout_ms = 500;
    wss::audio::BufferEngine engine(kWindowMs, kOverlapMs, true, vad_cfg);
    wss::audio::AudioRingBuffer ring(kRingCapacity);

    // Pre-generate speech (1 s) and silence (500 ms = timeout)
    const auto speech = wss::bench::generate_sine(
        ms_to_samples(1000), 440.0f, static_cast<float>(kSampleRate), 0.1f);
    const auto silence = wss::bench::generate_silence(ms_to_samples(500));

    for (auto _ : state) {
        // Reset state for each iteration
        engine.reset();
        ring.reset();

        // Write speech then silence to trigger end-of-speech
        ring.write(speech.data(), speech.size());
        engine.process_vad(speech.data(), speech.size());
        ring.write(silence.data(), silence.size());
        engine.process_vad(silence.data(), silence.size());

        auto result = engine.extract_window(ring);
        benchmark::DoNotOptimize(result.samples);
        benchmark::DoNotOptimize(result.count);
        benchmark::ClobberMemory();
    }

    state.SetBytesProcessed(
        static_cast<int64_t>(state.iterations())
        * static_cast<int64_t>(speech.size() + silence.size())
        * static_cast<int64_t>(sizeof(wss::SampleFloat)));
}

BENCHMARK(BM_BufferEngine_ExtractVADWindow);

// ---------------------------------------------------------------------------
// BM_VAD_Process — measure VAD::process() on audio chunks of varying size.
// Parameters: {480, 1600, 16000} samples (30ms, 100ms, 1s at 16kHz).
// ---------------------------------------------------------------------------
void BM_VAD_Process(benchmark::State& state) {
    const auto num_samples = static_cast<size_t>(state.range(0));
    wss::audio::VoiceActivityDetector vad;

    // Mix of speech-like audio to exercise both speech and silence paths
    const auto audio = wss::bench::generate_sine(
        num_samples, 440.0f, static_cast<float>(kSampleRate), 0.1f);

    for (auto _ : state) {
        vad.reset();
        auto result = vad.process(audio.data(), audio.size());
        benchmark::DoNotOptimize(result.is_speech);
        benchmark::DoNotOptimize(result.end_of_speech);
        benchmark::DoNotOptimize(result.speech_samples);
    }

    state.SetBytesProcessed(
        static_cast<int64_t>(state.iterations())
        * static_cast<int64_t>(num_samples)
        * static_cast<int64_t>(sizeof(wss::SampleFloat)));
}

BENCHMARK(BM_VAD_Process)
    ->Arg(480)
    ->Arg(1600)
    ->Arg(16000);

// ---------------------------------------------------------------------------
// BM_VAD_IsSpeechFrame — measure is_speech_frame() RMS + threshold check.
// Parameter: {480} samples (single 30ms frame — typical VAD frame size).
// Uses the public process() API with a single frame to isolate frame cost.
// ---------------------------------------------------------------------------
void BM_VAD_IsSpeechFrame(benchmark::State& state) {
    const auto num_samples = static_cast<size_t>(state.range(0));

    wss::audio::VadConfig cfg;
    cfg.frame_duration_ms = static_cast<int32_t>(num_samples * 1000 / kSampleRate);
    wss::audio::VoiceActivityDetector vad(cfg);

    // Single frame of speech-like audio
    const auto frame = wss::bench::generate_sine(
        num_samples, 440.0f, static_cast<float>(kSampleRate), 0.1f);

    for (auto _ : state) {
        vad.reset();
        auto result = vad.process(frame.data(), frame.size());
        benchmark::DoNotOptimize(result.is_speech);
    }

    state.SetBytesProcessed(
        static_cast<int64_t>(state.iterations())
        * static_cast<int64_t>(num_samples)
        * static_cast<int64_t>(sizeof(wss::SampleFloat)));
}

BENCHMARK(BM_VAD_IsSpeechFrame)
    ->Arg(480);

} // anonymous namespace
