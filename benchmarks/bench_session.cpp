/// @file bench_session.cpp
/// @brief Benchmarks for session lifecycle: creation, destruction, and audio
///        ingest → window extraction.
///
/// Measures Session() constructor allocation cost, SessionManager create/destroy
/// cycles, multi-session scaling, and the full ingest_audio → window_ready →
/// extract_window path through a Session object.

#include <benchmark/benchmark.h>
#include "session/session.hpp"
#include "session/session_manager.hpp"
#include "helpers/synthetic_audio.hpp"

#include <cstddef>
#include <cstdint>
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

/// Build a Session::Config with sensible benchmark defaults.
[[nodiscard]] wss::session::Session::Config make_bench_config(
    const std::string& session_id = "bench-session",
    int32_t window_duration_ms = 5000) {
    return {
        .session_id = session_id,
        .language = "en",
        .sample_rate = kSampleRate,
        .encoding = "pcm_s16le",
        .window_duration_ms = window_duration_ms,
        .overlap_duration_ms = 500,
        .backend_model_id = "bench",
        .ring_buffer_seconds = 30.0f,
        .vad_enabled = false
    };
}

// ---------------------------------------------------------------------------
// BM_Session_Create — measure Session() constructor cost (allocation).
// The Session constructor pre-allocates AudioPipeline, BufferEngine, ring
// buffer, and scratch buffers — this benchmark captures that allocation cost.
// ---------------------------------------------------------------------------
void BM_Session_Create(benchmark::State& state) {
    for (auto _ : state) {
        auto config = make_bench_config();
        wss::session::Session session(std::move(config));
        benchmark::DoNotOptimize(&session);
        benchmark::ClobberMemory();
    }
}

BENCHMARK(BM_Session_Create);

// ---------------------------------------------------------------------------
// BM_SessionManager_CreateDestroy — full create + destroy cycle.
// Measures the overhead of SessionManager's map operations plus the Session
// constructor/destructor pair.
// ---------------------------------------------------------------------------
void BM_SessionManager_CreateDestroy(benchmark::State& state) {
    wss::session::SessionManager mgr(100);
    int64_t iteration = 0;

    for (auto _ : state) {
        auto id = "bench-" + std::to_string(iteration++);
        auto config = make_bench_config(id);
        auto* session = mgr.create_session(std::move(config));
        benchmark::DoNotOptimize(session);
        mgr.destroy_session(id);
        benchmark::ClobberMemory();
    }
}

BENCHMARK(BM_SessionManager_CreateDestroy);

// ---------------------------------------------------------------------------
// BM_SessionManager_CreateMany — scaling with session count.
// Parameters: {1, 5, 10, 20} sessions.
// Measures how creation + lookup + destruction cost scales with N sessions.
// ---------------------------------------------------------------------------
void BM_SessionManager_CreateMany(benchmark::State& state) {
    const auto num_sessions = static_cast<size_t>(state.range(0));

    for (auto _ : state) {
        wss::session::SessionManager mgr(num_sessions + 1);

        // Create N sessions
        for (size_t i = 0; i < num_sessions; ++i) {
            auto config = make_bench_config("s-" + std::to_string(i));
            auto* session = mgr.create_session(std::move(config));
            benchmark::DoNotOptimize(session);
        }

        benchmark::DoNotOptimize(mgr.active_count());

        // Destroy all sessions
        for (size_t i = 0; i < num_sessions; ++i) {
            mgr.destroy_session("s-" + std::to_string(i));
        }
        benchmark::ClobberMemory();
    }
}

BENCHMARK(BM_SessionManager_CreateMany)
    ->Arg(1)
    ->Arg(5)
    ->Arg(10)
    ->Arg(20);

// ---------------------------------------------------------------------------
// BM_Session_IngestAndWindow — ingest_audio() until window_ready() + extract.
// Uses a 20 s window (320 000 samples = 640 000 bytes of S16LE at 16 kHz).
// Session construction is excluded from timing via PauseTiming.
// ---------------------------------------------------------------------------
void BM_Session_IngestAndWindow(benchmark::State& state) {
    constexpr int32_t kWindowMs   = 20000;
    constexpr int32_t kOverlapMs  = 2000;
    constexpr size_t  kWindowSamples = ms_to_samples(kWindowMs);

    // Pre-generate PCM bytes for one full window
    const auto pcm_bytes = generate_pcm_bytes(kWindowSamples);

    auto make_config = [&] {
        return wss::session::Session::Config{
            .session_id = "bench-ingest",
            .language = "en",
            .sample_rate = kSampleRate,
            .encoding = "pcm_s16le",
            .window_duration_ms = kWindowMs,
            .overlap_duration_ms = kOverlapMs,
            .backend_model_id = "bench",
            .ring_buffer_seconds = 30.0f,
            .vad_enabled = false
        };
    };

    for (auto _ : state) {
        // Exclude session construction from the measurement
        state.PauseTiming();
        wss::session::Session session(make_config());
        state.ResumeTiming();

        // Ingest all audio
        auto written = session.ingest_audio(pcm_bytes.data(), pcm_bytes.size());
        benchmark::DoNotOptimize(written);

        // Extract the window
        if (session.window_ready()) {
            auto result = session.extract_window();
            benchmark::DoNotOptimize(result.samples);
            benchmark::DoNotOptimize(result.count);
        }
        benchmark::ClobberMemory();
    }

    state.SetBytesProcessed(
        static_cast<int64_t>(state.iterations())
        * static_cast<int64_t>(pcm_bytes.size()));
}

BENCHMARK(BM_Session_IngestAndWindow);

} // anonymous namespace
