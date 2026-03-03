#include <gtest/gtest.h>
#include "aggregation/result_aggregator.hpp"

TEST(ResultAggregatorTest, Placeholder) {
    wss::aggregation::ResultAggregator agg;
    EXPECT_TRUE(agg.segments().empty());
}
