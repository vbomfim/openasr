/// @file bench_ring_buffer.cpp
/// @brief Micro-benchmarks for wss::audio::AudioRingBuffer.
///
/// Measures write, extract_window, wrap-around, and fill_ratio performance
/// at production-relevant buffer sizes (16 kHz × 30 s = 480 000 samples).

#include <benchmark/benchmark.h>
#include "audio/audio_ring_buffer.hpp"
#include "helpers/synthetic_audio.hpp"

#include <cstddef>
#include <vector>

namespace {

// Production ring buffer capacity: 16 kHz × 30 s
constexpr size_t kProductionCapacity = 16000 * 30;  // 480 000 samples

// ---------------------------------------------------------------------------
// BM_RingBuffer_Write — measure raw write throughput at various chunk sizes.
// ---------------------------------------------------------------------------
void BM_RingBuffer_Write(benchmark::State& state) {
    const auto chunk_size = static_cast<size_t>(state.range(0));
    wss::audio::AudioRingBuffer rb(kProductionCapacity);
    const auto audio = wss::bench::generate_sine(chunk_size);

    for (auto _ : state) {
        auto written = rb.write(audio.data(), audio.size());
        benchmark::DoNotOptimize(written);
        benchmark::ClobberMemory();
    }

    state.SetBytesProcessed(
        static_cast<int64_t>(state.iterations())
        * static_cast<int64_t>(chunk_size)
        * static_cast<int64_t>(sizeof(wss::SampleFloat)));
}

BENCHMARK(BM_RingBuffer_Write)
    ->Arg(64)
    ->Arg(256)
    ->Arg(1024)
    ->Arg(4096)
    ->Arg(16000)
    ->Arg(48000);

// ---------------------------------------------------------------------------
// BM_RingBuffer_ExtractWindow — measure read/extraction throughput.
// Pre-fills the buffer, then repeatedly extracts windows of varying size.
// ---------------------------------------------------------------------------
void BM_RingBuffer_ExtractWindow(benchmark::State& state) {
    const auto window_size = static_cast<size_t>(state.range(0));
    wss::audio::AudioRingBuffer rb(kProductionCapacity);

    // Pre-fill buffer to capacity so extract_window always succeeds
    const auto fill_data = wss::bench::generate_sine(kProductionCapacity);
    rb.write(fill_data.data(), fill_data.size());

    std::vector<wss::SampleFloat> dest(window_size);

    for (auto _ : state) {
        auto extracted = rb.extract_window(dest.data(), dest.size());
        benchmark::DoNotOptimize(extracted);
        benchmark::DoNotOptimize(dest.data());
    }

    state.SetBytesProcessed(
        static_cast<int64_t>(state.iterations())
        * static_cast<int64_t>(window_size)
        * static_cast<int64_t>(sizeof(wss::SampleFloat)));
}

BENCHMARK(BM_RingBuffer_ExtractWindow)
    ->Arg(256)
    ->Arg(1024)
    ->Arg(4096)
    ->Arg(16000);

// ---------------------------------------------------------------------------
// BM_RingBuffer_WriteWrapAround — write chunks that force wrap-around on
// every iteration by using a capacity smaller than the chunk size.
// ---------------------------------------------------------------------------
void BM_RingBuffer_WriteWrapAround(benchmark::State& state) {
    const auto chunk_size = static_cast<size_t>(state.range(0));
    // Use kWhisperSampleRate (16 000) as capacity to force frequent wraps
    constexpr size_t kWrapCapacity = 16000;
    wss::audio::AudioRingBuffer rb(kWrapCapacity);
    const auto audio = wss::bench::generate_sine(chunk_size);

    // Pre-fill to force the write head past the midpoint
    const auto prefill = wss::bench::generate_silence(kWrapCapacity / 2);
    rb.write(prefill.data(), prefill.size());

    for (auto _ : state) {
        auto written = rb.write(audio.data(), audio.size());
        benchmark::DoNotOptimize(written);
        benchmark::ClobberMemory();
    }

    state.SetBytesProcessed(
        static_cast<int64_t>(state.iterations())
        * static_cast<int64_t>(chunk_size)
        * static_cast<int64_t>(sizeof(wss::SampleFloat)));
}

BENCHMARK(BM_RingBuffer_WriteWrapAround)
    ->Arg(16000)
    ->Arg(48000);

// ---------------------------------------------------------------------------
// BM_RingBuffer_FillRatio — trivial operation baseline.
// Measures the cost of querying fill_ratio() on a half-full buffer.
// ---------------------------------------------------------------------------
void BM_RingBuffer_FillRatio(benchmark::State& state) {
    wss::audio::AudioRingBuffer rb(kProductionCapacity);

    // Fill to 50 % so the ratio is non-trivial
    const auto half_fill = wss::bench::generate_silence(kProductionCapacity / 2);
    rb.write(half_fill.data(), half_fill.size());

    for (auto _ : state) {
        auto ratio = rb.fill_ratio();
        benchmark::DoNotOptimize(ratio);
    }
}

BENCHMARK(BM_RingBuffer_FillRatio);

} // anonymous namespace
