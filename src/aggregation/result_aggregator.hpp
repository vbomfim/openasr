#pragma once

#include "transcription/backend_interface.hpp"
#include <algorithm>
#include <string>
#include <vector>

namespace wss::aggregation {

/// Merges overlapping transcription window results.
/// Deduplicates segments in overlap regions by timestamp comparison.
class ResultAggregator {
public:
    /// Add segments from a new window. Deduplicates against previous window's overlap.
    void add_window(const std::vector<transcription::Segment>& segments,
                    int64_t window_start_ms, int64_t window_end_ms) {
        if (segments.empty()) return;

        if (all_segments_.empty()) {
            all_segments_.insert(all_segments_.end(), segments.begin(), segments.end());
        } else {
            // Find segments that start after the previous window's effective boundary
            // (i.e., skip segments in the overlap region that we already have)
            for (const auto& seg : segments) {
                if (seg.start_ms >= last_non_overlap_end_ms_) {
                    all_segments_.push_back(seg);
                }
            }
        }

        // Track the non-overlap boundary for next window
        // If overlap exists, the stable boundary is window_end minus any overlap
        last_non_overlap_end_ms_ = window_end_ms;
        transcript_dirty_ = true;
        (void)window_start_ms;
    }

    /// Get all accumulated segments.
    [[nodiscard]] const std::vector<transcription::Segment>& segments() const {
        return all_segments_;
    }

    /// Build the full transcript string from accumulated segments (cached).
    [[nodiscard]] const std::string& full_transcript() const {
        if (transcript_dirty_) {
            cached_transcript_.clear();
            for (const auto& seg : all_segments_) {
                if (!cached_transcript_.empty() && !seg.text.empty()) {
                    cached_transcript_ += ' ';
                }
                cached_transcript_ += seg.text;
            }
            transcript_dirty_ = false;
        }
        return cached_transcript_;
    }

    /// Get segments from the latest window only (for PARTIAL_TRANSCRIPT).
    [[nodiscard]] std::vector<transcription::Segment> latest_segments(
        int64_t window_start_ms) const {
        std::vector<transcription::Segment> result;
        for (const auto& seg : all_segments_) {
            if (seg.start_ms >= window_start_ms) {
                result.push_back(seg);
            }
        }
        return result;
    }

    void reset() {
        all_segments_.clear();
        last_non_overlap_end_ms_ = 0;
        transcript_dirty_ = true;
    }

private:
    std::vector<transcription::Segment> all_segments_;
    int64_t last_non_overlap_end_ms_ = 0;
    mutable std::string cached_transcript_;
    mutable bool transcript_dirty_ = true;
};

} // namespace wss::aggregation
