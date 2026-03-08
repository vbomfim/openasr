/// @file bench_inference_pool.cpp
/// @brief Micro-benchmarks for InferencePool: submit queue push, submit-and-drain
///        round-trip, and multi-threaded queue contention.
///
/// Uses a zero-cost MockBackend to isolate pool/queue overhead from actual
/// inference work.

#include <benchmark/benchmark.h>
#include "transcription/inference_pool.hpp"
#include "helpers/synthetic_audio.hpp"

#include <atomic>
#include <chrono>
#include <cstddef>
#include <cstdint>
#include <latch>
#include <string>
#include <vector>

namespace {

using namespace std::chrono_literals;

/// Zero-cost mock backend for pool benchmarks.
/// Returns immediately with a fixed result to isolate queue overhead.
class MockBackend : public wss::transcription::ITranscriptionBackend {
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
        result.segments.push_back(
            wss::transcription::Segment{window_start_ms, window_start_ms + 1000, "ok", ""});
        return result;
    }

    [[nodiscard]] bool is_ready() const override { return true; }
};

/// Number of audio samples per job (100ms at 16kHz).
constexpr size_t kSamplesPerJob = wss::kWhisperSampleRate / 10;

/// Build an InferenceJob with pre-allocated audio.
/// @param id       Session ID string.
/// @param audio    Pre-generated audio samples (shared, copied into job).
/// @param latch    Optional latch to count down on completion.
[[nodiscard]] wss::transcription::InferenceJob make_job(
    const std::string& id,
    const std::vector<wss::SampleFloat>& audio,
    std::latch* latch = nullptr) {
    wss::transcription::InferenceJob job;
    job.session_id = id;
    job.audio = audio;
    job.window_start_ms = 0;
    job.window_end_ms = 100;
    if (latch != nullptr) {
        job.on_complete = [latch](const std::string& /*sid*/,
                                  wss::transcription::TranscriptionResult /*result*/,
                                  int64_t /*ws*/, int64_t /*we*/) {
            latch->count_down();
        };
    }
    return job;
}

// ---------------------------------------------------------------------------
// BM_InferencePool_Submit — measure submit() queue push + lock overhead.
// Parameters: {1, 10, 100} jobs submitted per iteration.
// Pool is stopped and recreated each iteration so the queue stays bounded.
// ---------------------------------------------------------------------------
void BM_InferencePool_Submit(benchmark::State& state) {
    const auto num_jobs = static_cast<size_t>(state.range(0));

    MockBackend backend;
    const auto audio = wss::bench::generate_silence(kSamplesPerJob);

    for (auto _ : state) {
        // Create pool with enough capacity; 1 worker thread
        wss::transcription::InferencePool pool(backend, /*num_threads=*/1,
                                                /*max_queue_size=*/num_jobs + 10);

        for (size_t i = 0; i < num_jobs; ++i) {
            auto job = make_job("bench-" + std::to_string(i), audio);
            pool.submit(std::move(job));
        }
        benchmark::DoNotOptimize(pool.pending());
        benchmark::ClobberMemory();

        // Shutdown drains remaining jobs
        pool.shutdown();
    }

    state.SetItemsProcessed(
        static_cast<int64_t>(state.iterations())
        * static_cast<int64_t>(num_jobs));
}

BENCHMARK(BM_InferencePool_Submit)
    ->Arg(1)
    ->Arg(10)
    ->Arg(100);

// ---------------------------------------------------------------------------
// BM_InferencePool_SubmitAndDrain — submit N jobs and wait for all to complete.
// Parameters: {1, 10} jobs.
// Measures the full round-trip: queue push, worker wake, transcribe, callback.
// ---------------------------------------------------------------------------
void BM_InferencePool_SubmitAndDrain(benchmark::State& state) {
    const auto num_jobs = static_cast<size_t>(state.range(0));

    MockBackend backend;
    const auto audio = wss::bench::generate_silence(kSamplesPerJob);

    for (auto _ : state) {
        wss::transcription::InferencePool pool(backend, /*num_threads=*/2,
                                                /*max_queue_size=*/num_jobs + 10);

        std::latch done(static_cast<std::ptrdiff_t>(num_jobs));

        for (size_t i = 0; i < num_jobs; ++i) {
            auto job = make_job("drain-" + std::to_string(i), audio, &done);
            pool.submit(std::move(job));
        }

        // Wait for all callbacks to fire
        done.wait();

        benchmark::DoNotOptimize(pool.drain_complete());
        benchmark::ClobberMemory();

        pool.shutdown();
    }

    state.SetItemsProcessed(
        static_cast<int64_t>(state.iterations())
        * static_cast<int64_t>(num_jobs));
}

BENCHMARK(BM_InferencePool_SubmitAndDrain)
    ->Arg(1)
    ->Arg(10);

// ---------------------------------------------------------------------------
// BM_InferencePool_QueueContention — concurrent submit() from multiple threads.
// Threads: {2, 4, 8}.
// Each thread submits one job per iteration; measures lock contention scaling.
// ---------------------------------------------------------------------------
void BM_InferencePool_QueueContention(benchmark::State& state) {
    static MockBackend backend;
    static const auto audio = wss::bench::generate_silence(kSamplesPerJob);

    // Shared pool across threads — large queue, many workers
    static auto* pool = new wss::transcription::InferencePool(
        backend, /*num_threads=*/4, /*max_queue_size=*/10000);

    const auto thread_id = std::to_string(state.thread_index());

    for (auto _ : state) {
        auto job = make_job("contention-" + thread_id, audio);
        pool->submit(std::move(job));
        benchmark::ClobberMemory();
    }

    state.SetItemsProcessed(static_cast<int64_t>(state.iterations()));
}

BENCHMARK(BM_InferencePool_QueueContention)
    ->Threads(2)
    ->Threads(4)
    ->Threads(8)
    ->MeasureProcessCPUTime()
    ->UseRealTime();

} // anonymous namespace
