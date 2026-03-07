#include <gtest/gtest.h>
#include "aggregation/result_aggregator.hpp"

using namespace wss::aggregation;
using wss::transcription::Segment;

static Segment make_seg(int64_t start, int64_t end, const std::string& text) {
    return {start, end, text, ""};
}

TEST(ResultAggregatorTest, Empty_NoSegments) {
    ResultAggregator agg;
    EXPECT_TRUE(agg.segments().empty());
}

TEST(ResultAggregatorTest, AddWindow_SingleSegment) {
    ResultAggregator agg;
    agg.add_window({make_seg(0, 2000, "hello")}, 5000);
    EXPECT_EQ(agg.segments().size(), 1U);
    EXPECT_EQ(agg.segments()[0].text, "hello");
}

TEST(ResultAggregatorTest, AddWindow_MultipleSegments) {
    ResultAggregator agg;
    std::vector<Segment> segs = {
        make_seg(0, 1000, "one"),
        make_seg(1000, 2000, "two"),
        make_seg(2000, 3000, "three"),
    };
    agg.add_window(segs, 5000);
    EXPECT_EQ(agg.segments().size(), 3U);
}

TEST(ResultAggregatorTest, AddWindow_Overlapping_Deduplicates) {
    ResultAggregator agg;
    // Window 1: [0, 5000]
    agg.add_window({make_seg(0, 2000, "A"), make_seg(3000, 4500, "B")}, 5000);
    // Window 2: [4000, 9000] — seg at 3000 would be a dup (< last_non_overlap_end of 5000)
    agg.add_window({make_seg(3000, 4500, "B"), make_seg(6000, 8000, "C")}, 9000);
    // "B" at 3000 should be deduplicated; only "C" at 6000 added
    EXPECT_EQ(agg.segments().size(), 3U);
    EXPECT_EQ(agg.segments()[2].text, "C");
}

TEST(ResultAggregatorTest, AddWindow_NonOverlapping_KeepsAll) {
    ResultAggregator agg;
    agg.add_window({make_seg(0, 2000, "first")}, 5000);
    agg.add_window({make_seg(5000, 7000, "second")}, 10000);
    EXPECT_EQ(agg.segments().size(), 2U);
    EXPECT_EQ(agg.segments()[0].text, "first");
    EXPECT_EQ(agg.segments()[1].text, "second");
}

TEST(ResultAggregatorTest, FullTranscript_ConcatenatesAll) {
    ResultAggregator agg;
    agg.add_window({make_seg(0, 1000, "hello"), make_seg(1000, 2000, "world")}, 5000);
    EXPECT_EQ(agg.full_transcript(), "hello world");
}

TEST(ResultAggregatorTest, FullTranscript_Empty_ReturnsEmpty) {
    ResultAggregator agg;
    EXPECT_EQ(agg.full_transcript(), "");
}

TEST(ResultAggregatorTest, LatestSegments_FiltersCorrectly) {
    ResultAggregator agg;
    agg.add_window({make_seg(0, 1000, "old"), make_seg(2000, 3000, "mid")}, 5000);
    agg.add_window({make_seg(5000, 6000, "new"), make_seg(7000, 8000, "newest")}, 10000);
    auto latest = agg.latest_segments(5000);
    EXPECT_EQ(latest.size(), 2U);
    EXPECT_EQ(latest[0].text, "new");
    EXPECT_EQ(latest[1].text, "newest");
}

TEST(ResultAggregatorTest, Reset_ClearsAll) {
    ResultAggregator agg;
    agg.add_window({make_seg(0, 1000, "data")}, 5000);
    EXPECT_FALSE(agg.segments().empty());
    agg.reset();
    EXPECT_TRUE(agg.segments().empty());
    EXPECT_EQ(agg.full_transcript(), "");
}

TEST(ResultAggregatorTest, AddEmptyWindow_NoChange) {
    ResultAggregator agg;
    agg.add_window({}, 5000);
    EXPECT_TRUE(agg.segments().empty());
}
