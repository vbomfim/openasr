/// @file bench_result_aggregator.cpp
/// @brief Micro-benchmarks for ResultAggregator: add_window deduplication,
///        full_transcript build cost, and latest_segments filtering.
///
/// Measures the hot-path cost of segment accumulation and transcript generation
/// across varying window sizes and segment counts.

#include <benchmark/benchmark.h>
#include "aggregation/result_aggregator.hpp"

#include <cstddef>
#include <cstdint>
#include <string>
#include <vector>

namespace {

/// Duration of each synthetic segment in milliseconds.
constexpr int64_t kSegmentDurationMs = 500;

/// Gap between consecutive segments in milliseconds.
constexpr int64_t kSegmentGapMs = 50;

/// Generate a vector of realistic transcription segments.
/// Segments are contiguous with small gaps, mimicking real whisper output.
/// @param count       Number of segments to generate.
/// @param start_ms    Starting timestamp for the first segment.
/// @return Vector of Segment with sequential timestamps and realistic text.
[[nodiscard]] std::vector<wss::transcription::Segment> make_segments(
    size_t count, int64_t start_ms = 0) {
    std::vector<wss::transcription::Segment> segments;
    segments.reserve(count);
    int64_t cursor = start_ms;
    for (size_t i = 0; i < count; ++i) {
        wss::transcription::Segment seg;
        seg.start_ms = cursor;
        seg.end_ms = cursor + kSegmentDurationMs;
        seg.text = "word_" + std::to_string(i);
        segments.push_back(std::move(seg));
        cursor = seg.end_ms + kSegmentGapMs;
    }
    return segments;
}

// ---------------------------------------------------------------------------
// BM_ResultAggregator_AddWindow — measure add_window() with deduplication.
// Parameters: {1, 5, 10, 50} segments per window.
// Each iteration adds a new window that partially overlaps the previous one,
// exercising the dedup comparison path.
// ---------------------------------------------------------------------------
void BM_ResultAggregator_AddWindow(benchmark::State& state) {
    const auto segments_per_window = static_cast<size_t>(state.range(0));

    // Pre-generate a large set of windows with overlapping regions.
    // Each window shares ~20% overlap with the previous window's time range.
    constexpr size_t kNumWindows = 100;
    struct Window {
        std::vector<wss::transcription::Segment> segments;
        int64_t end_ms;
    };
    std::vector<Window> windows;
    windows.reserve(kNumWindows);

    int64_t cursor = 0;
    for (size_t w = 0; w < kNumWindows; ++w) {
        auto segs = make_segments(segments_per_window, cursor);
        int64_t end_ms = segs.back().end_ms;
        windows.push_back({std::move(segs), end_ms});
        // Advance cursor with ~20% overlap into the previous window
        const int64_t window_span =
            static_cast<int64_t>(segments_per_window)
            * (kSegmentDurationMs + kSegmentGapMs);
        cursor += window_span * 4 / 5; // 80% advance, 20% overlap
    }

    for (auto _ : state) {
        wss::aggregation::ResultAggregator aggregator;
        for (const auto& w : windows) {
            aggregator.add_window(w.segments, w.end_ms);
        }
        benchmark::DoNotOptimize(aggregator.segments().data());
        benchmark::ClobberMemory();
    }

    state.SetItemsProcessed(
        static_cast<int64_t>(state.iterations())
        * static_cast<int64_t>(kNumWindows));
}

BENCHMARK(BM_ResultAggregator_AddWindow)
    ->Arg(1)
    ->Arg(5)
    ->Arg(10)
    ->Arg(50);

// ---------------------------------------------------------------------------
// BM_ResultAggregator_FullTranscript — measure full_transcript() build cost.
// Parameters: {10, 100, 500} accumulated segments.
// Pre-populates the aggregator, then measures transcript string construction.
// ---------------------------------------------------------------------------
void BM_ResultAggregator_FullTranscript(benchmark::State& state) {
    const auto total_segments = static_cast<size_t>(state.range(0));

    // Pre-populate aggregator with the target number of segments.
    // Use a single large window so no dedup overhead during setup.
    wss::aggregation::ResultAggregator aggregator;
    auto segments = make_segments(total_segments);
    int64_t window_end = segments.back().end_ms;
    aggregator.add_window(segments, window_end);

    for (auto _ : state) {
        // Force transcript rebuild by adding a trivial segment
        wss::transcription::Segment extra;
        extra.start_ms = window_end + 100;
        extra.end_ms = extra.start_ms + kSegmentDurationMs;
        extra.text = "extra";
        aggregator.add_window({extra}, extra.end_ms);

        const auto& transcript = aggregator.full_transcript();
        benchmark::DoNotOptimize(transcript.data());
        benchmark::DoNotOptimize(transcript.size());
        benchmark::ClobberMemory();

        window_end = extra.end_ms + kSegmentGapMs;
    }

    state.SetBytesProcessed(
        static_cast<int64_t>(state.iterations())
        * static_cast<int64_t>(aggregator.full_transcript().size()));
}

BENCHMARK(BM_ResultAggregator_FullTranscript)
    ->Arg(10)
    ->Arg(100)
    ->Arg(500);

// ---------------------------------------------------------------------------
// BM_ResultAggregator_LatestSegments — measure latest_segments() filtering.
// Parameters: {10, 100} total accumulated segments.
// Queries the last ~20% of segments by timestamp, measuring the scan cost.
// ---------------------------------------------------------------------------
void BM_ResultAggregator_LatestSegments(benchmark::State& state) {
    const auto total_segments = static_cast<size_t>(state.range(0));

    // Pre-populate aggregator
    wss::aggregation::ResultAggregator aggregator;
    auto segments = make_segments(total_segments);
    int64_t window_end = segments.back().end_ms;
    aggregator.add_window(segments, window_end);

    // Filter start: 80% into the timeline (returns ~last 20% of segments)
    const int64_t filter_start =
        segments[total_segments * 4 / 5].start_ms;

    for (auto _ : state) {
        auto latest = aggregator.latest_segments(filter_start);
        benchmark::DoNotOptimize(latest.data());
        benchmark::DoNotOptimize(latest.size());
        benchmark::ClobberMemory();
    }

    state.SetItemsProcessed(
        static_cast<int64_t>(state.iterations())
        * static_cast<int64_t>(total_segments));
}

BENCHMARK(BM_ResultAggregator_LatestSegments)
    ->Arg(10)
    ->Arg(100);

} // anonymous namespace
