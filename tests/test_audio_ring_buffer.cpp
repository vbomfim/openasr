#include <gtest/gtest.h>
#include "audio/audio_ring_buffer.hpp"
#include <vector>
#include <numeric>

using wss::audio::AudioRingBuffer;

// 1. Construct_ZeroCapacity_ClampsToOne
TEST(AudioRingBufferTest, Construct_ZeroCapacity_ClampsToOne) {
    AudioRingBuffer rb(0);
    EXPECT_EQ(rb.capacity(), 1u);
}

// 2. Construct_Capacity_PreAllocates
TEST(AudioRingBufferTest, Construct_Capacity_PreAllocates) {
    AudioRingBuffer rb(256);
    EXPECT_EQ(rb.capacity(), 256u);
    EXPECT_EQ(rb.available(), 0u);
    EXPECT_EQ(rb.total_written(), 0u);
}

// 3. Write_Empty_ReturnsZero
TEST(AudioRingBufferTest, Write_Empty_ReturnsZero) {
    AudioRingBuffer rb(100);
    float dummy = 1.0f;
    EXPECT_EQ(rb.write(&dummy, 0), 0u);
    EXPECT_EQ(rb.available(), 0u);
    EXPECT_EQ(rb.total_written(), 0u);
}

// 4. Write_UnderCapacity_StoresAll
TEST(AudioRingBufferTest, Write_UnderCapacity_StoresAll) {
    AudioRingBuffer rb(100);
    std::vector<float> data(50, 1.0f);
    EXPECT_EQ(rb.write(data.data(), data.size()), 50u);
    EXPECT_EQ(rb.available(), 50u);
}

// 5. Write_ExactCapacity_FillsBuffer
TEST(AudioRingBufferTest, Write_ExactCapacity_FillsBuffer) {
    constexpr size_t cap = 200;
    AudioRingBuffer rb(cap);
    std::vector<float> data(cap);
    std::iota(data.begin(), data.end(), 0.0f);
    rb.write(data.data(), data.size());
    EXPECT_EQ(rb.available(), cap);
    EXPECT_FLOAT_EQ(rb.fill_ratio(), 1.0f);
}

// 6. Write_OverCapacity_OverwritesOldest
TEST(AudioRingBufferTest, Write_OverCapacity_OverwritesOldest) {
    constexpr size_t cap = 100;
    AudioRingBuffer rb(cap);
    // Write 1.5× capacity
    std::vector<float> data(150);
    std::iota(data.begin(), data.end(), 0.0f);
    rb.write(data.data(), data.size());
    EXPECT_EQ(rb.available(), cap);

    // Extract all — should be the last 100 values [50..149]
    std::vector<float> out(cap);
    size_t got = rb.extract_window(out.data(), cap);
    EXPECT_EQ(got, cap);
    for (size_t i = 0; i < cap; ++i) {
        EXPECT_FLOAT_EQ(out[i], static_cast<float>(50 + i));
    }
}

// 7. Write_MultipleSmall_Accumulates
TEST(AudioRingBufferTest, Write_MultipleSmall_Accumulates) {
    AudioRingBuffer rb(200);
    std::vector<float> chunk(10, 0.5f);
    for (int i = 0; i < 10; ++i) {
        rb.write(chunk.data(), chunk.size());
    }
    EXPECT_EQ(rb.available(), 100u);
    EXPECT_EQ(rb.total_written(), 100u);
}

// 8. Write_WrapAround_DataIntegrity
TEST(AudioRingBufferTest, Write_WrapAround_DataIntegrity) {
    constexpr size_t cap = 64;
    AudioRingBuffer rb(cap);

    // First write fills most of the buffer
    std::vector<float> first(50);
    std::iota(first.begin(), first.end(), 0.0f);
    rb.write(first.data(), first.size());

    // Second write causes wrap-around
    std::vector<float> second(30);
    std::iota(second.begin(), second.end(), 50.0f);
    rb.write(second.data(), second.size());

    // available should be capped at capacity
    EXPECT_EQ(rb.available(), cap);

    // Extract all — should be last 64 of [0..79], i.e. [16..79]
    std::vector<float> out(cap);
    size_t got = rb.extract_window(out.data(), cap);
    EXPECT_EQ(got, cap);
    for (size_t i = 0; i < cap; ++i) {
        EXPECT_FLOAT_EQ(out[i], static_cast<float>(16 + i));
    }
}

// 9. ExtractWindow_Empty_ReturnsZero
TEST(AudioRingBufferTest, ExtractWindow_Empty_ReturnsZero) {
    AudioRingBuffer rb(100);
    std::vector<float> out(10);
    EXPECT_EQ(rb.extract_window(out.data(), 10), 0u);
}

// 10. ExtractWindow_Exact_ReturnsAll
TEST(AudioRingBufferTest, ExtractWindow_Exact_ReturnsAll) {
    AudioRingBuffer rb(100);
    std::vector<float> data(100);
    std::iota(data.begin(), data.end(), 0.0f);
    rb.write(data.data(), data.size());

    std::vector<float> out(100);
    EXPECT_EQ(rb.extract_window(out.data(), 100), 100u);
    for (size_t i = 0; i < 100; ++i) {
        EXPECT_FLOAT_EQ(out[i], static_cast<float>(i));
    }
}

// 11. ExtractWindow_WithOffset_CorrectSlice
TEST(AudioRingBufferTest, ExtractWindow_WithOffset_CorrectSlice) {
    AudioRingBuffer rb(100);
    std::vector<float> data(100);
    std::iota(data.begin(), data.end(), 0.0f);
    rb.write(data.data(), data.size());

    // Extract 10 samples, offset 20 from end → samples [70..79]
    std::vector<float> out(10);
    size_t got = rb.extract_window(out.data(), 10, 20);
    EXPECT_EQ(got, 10u);
    for (size_t i = 0; i < 10; ++i) {
        EXPECT_FLOAT_EQ(out[i], static_cast<float>(70 + i));
    }
}

// 12. ExtractWindow_OffsetBeyondAvailable_ReturnsZero
TEST(AudioRingBufferTest, ExtractWindow_OffsetBeyondAvailable_ReturnsZero) {
    AudioRingBuffer rb(100);
    std::vector<float> data(50, 1.0f);
    rb.write(data.data(), data.size());

    std::vector<float> out(10);
    EXPECT_EQ(rb.extract_window(out.data(), 10, 50), 0u);
    EXPECT_EQ(rb.extract_window(out.data(), 10, 100), 0u);
}

// 13. ExtractWindow_AcrossWrap_DataCorrect
TEST(AudioRingBufferTest, ExtractWindow_AcrossWrap_DataCorrect) {
    constexpr size_t cap = 32;
    AudioRingBuffer rb(cap);

    // Write 48 samples to force wrap (write_pos will be at 48%32=16)
    std::vector<float> data(48);
    std::iota(data.begin(), data.end(), 0.0f);
    rb.write(data.data(), data.size());

    // Extract all 32 available — should be [16..47]
    std::vector<float> out(cap);
    size_t got = rb.extract_window(out.data(), cap);
    EXPECT_EQ(got, cap);
    for (size_t i = 0; i < cap; ++i) {
        EXPECT_FLOAT_EQ(out[i], static_cast<float>(16 + i));
    }
}

// 14. ExtractWindow_LargerThanAvailable_Clamps
TEST(AudioRingBufferTest, ExtractWindow_LargerThanAvailable_Clamps) {
    AudioRingBuffer rb(100);
    std::vector<float> data(30);
    std::iota(data.begin(), data.end(), 0.0f);
    rb.write(data.data(), data.size());

    std::vector<float> out(50, -1.0f);
    size_t got = rb.extract_window(out.data(), 50);
    EXPECT_EQ(got, 30u);
    for (size_t i = 0; i < 30; ++i) {
        EXPECT_FLOAT_EQ(out[i], static_cast<float>(i));
    }
}

// 15. FillRatio_Empty_ReturnsZero
TEST(AudioRingBufferTest, FillRatio_Empty_ReturnsZero) {
    AudioRingBuffer rb(100);
    EXPECT_FLOAT_EQ(rb.fill_ratio(), 0.0f);
}

// 16. FillRatio_Half_ReturnsPointFive
TEST(AudioRingBufferTest, FillRatio_Half_ReturnsPointFive) {
    AudioRingBuffer rb(100);
    std::vector<float> data(50, 0.0f);
    rb.write(data.data(), data.size());
    EXPECT_FLOAT_EQ(rb.fill_ratio(), 0.5f);
}

// 17. FillRatio_Full_ReturnsOne
TEST(AudioRingBufferTest, FillRatio_Full_ReturnsOne) {
    AudioRingBuffer rb(100);
    std::vector<float> data(100, 0.0f);
    rb.write(data.data(), data.size());
    EXPECT_FLOAT_EQ(rb.fill_ratio(), 1.0f);
}

// 18. Reset_ClearsState
TEST(AudioRingBufferTest, Reset_ClearsState) {
    AudioRingBuffer rb(100);
    std::vector<float> data(80, 1.0f);
    rb.write(data.data(), data.size());
    EXPECT_GT(rb.available(), 0u);

    rb.reset();
    EXPECT_EQ(rb.available(), 0u);
    EXPECT_EQ(rb.total_written(), 0u);
    EXPECT_FLOAT_EQ(rb.fill_ratio(), 0.0f);
}

// 19. TotalWritten_Monotonic
TEST(AudioRingBufferTest, TotalWritten_Monotonic) {
    AudioRingBuffer rb(50);
    std::vector<float> chunk(20, 0.0f);
    size_t prev = 0;
    for (int i = 0; i < 5; ++i) {
        rb.write(chunk.data(), chunk.size());
        EXPECT_GE(rb.total_written(), prev);
        prev = rb.total_written();
    }
    EXPECT_EQ(rb.total_written(), 100u);
}

// 20. Write_OneSample_CorrectValue
TEST(AudioRingBufferTest, Write_OneSample_CorrectValue) {
    AudioRingBuffer rb(10);
    float val = 0.42f;
    rb.write(&val, 1);
    EXPECT_EQ(rb.available(), 1u);

    float out = 0.0f;
    size_t got = rb.extract_window(&out, 1);
    EXPECT_EQ(got, 1u);
    EXPECT_FLOAT_EQ(out, 0.42f);
}
