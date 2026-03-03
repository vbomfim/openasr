#include <gtest/gtest.h>
#include "audio/buffer_engine.hpp"

TEST(BufferEngineTest, Placeholder) {
    wss::audio::BufferEngine engine(1000, 200);
    EXPECT_GT(engine.window_samples(), 0U);
}
