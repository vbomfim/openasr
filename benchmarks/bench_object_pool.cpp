/// @file bench_object_pool.cpp
/// @brief Micro-benchmarks for ObjectPool: single-thread checkout/checkin cycles
///        and multi-threaded contention throughput.
///
/// Uses a simple int pool to isolate pool synchronisation overhead from object
/// construction cost.

#include <benchmark/benchmark.h>
#include "object_pool.hpp"

#include <cstddef>
#include <cstdint>
#include <optional>

namespace {

// ---------------------------------------------------------------------------
// BM_ObjectPool_CheckoutCheckin — single-thread checkout + checkin cycle.
// Parameters: {10, 50, 100} pool size.
// Measures the per-cycle mutex overhead when the pool is uncontended.
// Each iteration checks out one object and immediately checks it back in.
// ---------------------------------------------------------------------------
void BM_ObjectPool_CheckoutCheckin(benchmark::State& state) {
    const auto pool_size = static_cast<size_t>(state.range(0));

    int counter = 0;
    wss::ObjectPool<int> pool(pool_size, [&counter] { return counter++; });

    for (auto _ : state) {
        auto obj = pool.try_checkout();
        benchmark::DoNotOptimize(obj);
        if (obj.has_value()) {
            pool.checkin(std::move(*obj));
        }
        benchmark::ClobberMemory();
    }

    state.SetItemsProcessed(static_cast<int64_t>(state.iterations()));
}

BENCHMARK(BM_ObjectPool_CheckoutCheckin)
    ->Arg(10)
    ->Arg(50)
    ->Arg(100);

// ---------------------------------------------------------------------------
// BM_ObjectPool_Contention — concurrent checkout/checkin from multiple threads.
// Threads: {2, 4, 8}.
// Pool is sized large enough so threads rarely see std::nullopt.
// Measures mutex contention scaling under realistic load.
// ---------------------------------------------------------------------------
void BM_ObjectPool_Contention(benchmark::State& state) {
    // Pool size = 256, enough for all threads to find available objects.
    // Shared across threads via static to match google-benchmark threading model.
    static int counter = 0;
    static auto* pool = new wss::ObjectPool<int>(
        256, [&] { return counter++; });

    for (auto _ : state) {
        auto obj = pool->try_checkout();
        benchmark::DoNotOptimize(obj);
        if (obj.has_value()) {
            pool->checkin(std::move(*obj));
        }
        benchmark::ClobberMemory();
    }

    state.SetItemsProcessed(static_cast<int64_t>(state.iterations()));
}

BENCHMARK(BM_ObjectPool_Contention)
    ->Threads(2)
    ->Threads(4)
    ->Threads(8)
    ->MeasureProcessCPUTime()
    ->UseRealTime();

} // anonymous namespace
