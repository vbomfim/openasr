/// @file bench_audio_pipeline.cpp
/// @brief Micro-benchmarks for PCM conversion, resampling, and AudioPipeline ingest.
///
/// Measures pcm_bytes_to_float, pcm_s16le_to_float, Resampler::process, and
/// AudioPipeline::ingest_pcm at production-relevant chunk sizes.

#include <benchmark/benchmark.h>
#include "audio/audio_pipeline.hpp"
#include "audio/audio_utils.hpp"
#include "audio/resampler.hpp"
#include "helpers/synthetic_audio.hpp"

#include <cstddef>
#include <cstdint>
#include <cstring>
#include <vector>

namespace {

// ---------------------------------------------------------------------------
// Helper: generate PCM int16 little-endian byte data from a float sine wave.
// Pre-generated outside the timed loop — never allocate in the hot path.
// ---------------------------------------------------------------------------
[[nodiscard]] std::vector<uint8_t> generate_pcm_bytes(
    size_t num_samples,
    int sample_rate = wss::kWhisperSampleRate,
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
// BM_PCMBytesToFloat — measure raw byte → float conversion throughput.
// Parameters: {1600, 8000, 16000} samples (100ms, 500ms, 1s at 16kHz).
// ---------------------------------------------------------------------------
void BM_PCMBytesToFloat(benchmark::State& state) {
    const auto num_samples = static_cast<size_t>(state.range(0));
    const auto pcm_bytes = generate_pcm_bytes(num_samples);
    std::vector<wss::SampleFloat> output(num_samples);

    for (auto _ : state) {
        wss::audio::pcm_bytes_to_float(pcm_bytes.data(), output.data(), pcm_bytes.size());
        benchmark::DoNotOptimize(output.data());
        benchmark::ClobberMemory();
    }

    state.SetBytesProcessed(
        static_cast<int64_t>(state.iterations())
        * static_cast<int64_t>(pcm_bytes.size()));
}

BENCHMARK(BM_PCMBytesToFloat)
    ->Arg(1600)
    ->Arg(8000)
    ->Arg(16000);

// ---------------------------------------------------------------------------
// BM_PCM_S16LE_ToFloat — measure int16 → float conversion hot loop.
// Parameters: {1600, 8000, 16000} samples.
// ---------------------------------------------------------------------------
void BM_PCM_S16LE_ToFloat(benchmark::State& state) {
    const auto num_samples = static_cast<size_t>(state.range(0));

    // Pre-generate int16 samples
    auto floats = wss::bench::generate_sine(num_samples);
    std::vector<int16_t> int16_samples(num_samples);
    for (size_t i = 0; i < num_samples; ++i) {
        int16_samples[i] = static_cast<int16_t>(floats[i] * 32767.0f);
    }
    std::vector<wss::SampleFloat> output(num_samples);

    for (auto _ : state) {
        wss::audio::pcm_s16le_to_float(
            int16_samples.data(), output.data(), int16_samples.size());
        benchmark::DoNotOptimize(output.data());
        benchmark::ClobberMemory();
    }

    state.SetBytesProcessed(
        static_cast<int64_t>(state.iterations())
        * static_cast<int64_t>(num_samples)
        * static_cast<int64_t>(sizeof(int16_t)));
}

BENCHMARK(BM_PCM_S16LE_ToFloat)
    ->Arg(1600)
    ->Arg(8000)
    ->Arg(16000);

// ---------------------------------------------------------------------------
// BM_Resampler_48kTo16k — measure libsamplerate resampling throughput.
// Parameters: {4800, 16000, 48000} samples at 48 kHz input.
// ---------------------------------------------------------------------------
void BM_Resampler_48kTo16k(benchmark::State& state) {
    const auto num_samples = static_cast<size_t>(state.range(0));
    constexpr int kSrcRate = 48000;
    constexpr int kDstRate = wss::kWhisperSampleRate;

    wss::audio::Resampler resampler(kSrcRate, kDstRate);
    const auto audio = wss::bench::generate_sine(
        num_samples, 440.0f, static_cast<float>(kSrcRate));

    for (auto _ : state) {
        resampler.reset();
        auto result = resampler.process(audio.data(), audio.size());
        benchmark::DoNotOptimize(result.samples);
        benchmark::DoNotOptimize(result.count);
        benchmark::ClobberMemory();
    }

    state.SetBytesProcessed(
        static_cast<int64_t>(state.iterations())
        * static_cast<int64_t>(num_samples)
        * static_cast<int64_t>(sizeof(wss::SampleFloat)));
}

BENCHMARK(BM_Resampler_48kTo16k)
    ->Arg(4800)
    ->Arg(16000)
    ->Arg(48000);

// ---------------------------------------------------------------------------
// BM_AudioPipeline_IngestPCM_16kHz — full ingest path, no resample.
// Parameters: {3200, 8000, 16000} samples (200ms, 500ms, 1s at 16kHz).
// ---------------------------------------------------------------------------
void BM_AudioPipeline_IngestPCM_16kHz(benchmark::State& state) {
    const auto num_samples = static_cast<size_t>(state.range(0));
    constexpr int kInputRate = wss::kWhisperSampleRate;

    wss::audio::AudioPipeline pipeline(kInputRate);
    const auto pcm_bytes = generate_pcm_bytes(num_samples, kInputRate);

    for (auto _ : state) {
        pipeline.reset();
        auto written = pipeline.ingest_pcm(pcm_bytes.data(), pcm_bytes.size());
        benchmark::DoNotOptimize(written);
        benchmark::ClobberMemory();
    }

    state.SetBytesProcessed(
        static_cast<int64_t>(state.iterations())
        * static_cast<int64_t>(pcm_bytes.size()));
}

BENCHMARK(BM_AudioPipeline_IngestPCM_16kHz)
    ->Arg(3200)
    ->Arg(8000)
    ->Arg(16000);

// ---------------------------------------------------------------------------
// BM_AudioPipeline_IngestPCM_48kHz — full ingest path, with resample.
// Parameters: {9600, 24000, 48000} samples (200ms, 500ms, 1s at 48kHz).
// ---------------------------------------------------------------------------
void BM_AudioPipeline_IngestPCM_48kHz(benchmark::State& state) {
    const auto num_samples = static_cast<size_t>(state.range(0));
    constexpr int kInputRate = 48000;

    wss::audio::AudioPipeline pipeline(kInputRate);
    const auto pcm_bytes = generate_pcm_bytes(num_samples, kInputRate);

    for (auto _ : state) {
        pipeline.reset();
        auto written = pipeline.ingest_pcm(pcm_bytes.data(), pcm_bytes.size());
        benchmark::DoNotOptimize(written);
        benchmark::ClobberMemory();
    }

    state.SetBytesProcessed(
        static_cast<int64_t>(state.iterations())
        * static_cast<int64_t>(pcm_bytes.size()));
}

BENCHMARK(BM_AudioPipeline_IngestPCM_48kHz)
    ->Arg(9600)
    ->Arg(24000)
    ->Arg(48000);

} // anonymous namespace
