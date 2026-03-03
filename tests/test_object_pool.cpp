#include <gtest/gtest.h>
#include "object_pool.hpp"
#include <vector>

TEST(ObjectPoolTest, Placeholder) {
    wss::ObjectPool<std::vector<float>> pool(
        2,
        []() { return std::vector<float>(16, 0.0f); }
    );
    EXPECT_EQ(pool.available(), 2U);
}
