#include <gtest/gtest.h>
#include "audio/audio_ring_buffer.hpp"

TEST(AudioRingBufferTest, Placeholder) {
    wss::audio::AudioRingBuffer rb(100);
    EXPECT_EQ(rb.capacity(), 100);
}
