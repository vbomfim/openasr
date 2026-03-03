#include <gtest/gtest.h>
#include "audio/audio_utils.hpp"
#include "common.hpp"
#include <vector>
#include <cmath>
#include <cstring>

using namespace wss::audio;
using wss::SampleFloat;

TEST(AudioUtilsTest, PcmS16leToFloat_Zero) {
    int16_t src = 0;
    SampleFloat dest = -999.0f;
    pcm_s16le_to_float(&src, &dest, 1);
    EXPECT_FLOAT_EQ(dest, 0.0f);
}

TEST(AudioUtilsTest, PcmS16leToFloat_MaxPositive) {
    int16_t src = 32767;
    SampleFloat dest = 0.0f;
    pcm_s16le_to_float(&src, &dest, 1);
    EXPECT_NEAR(dest, 0.99997f, 1e-4f);
    EXPECT_LT(dest, 1.0f);
}

TEST(AudioUtilsTest, PcmS16leToFloat_MaxNegative) {
    int16_t src = -32768;
    SampleFloat dest = 0.0f;
    pcm_s16le_to_float(&src, &dest, 1);
    EXPECT_FLOAT_EQ(dest, -1.0f);
}

TEST(AudioUtilsTest, PcmS16leToFloat_Range) {
    std::vector<int16_t> pcm = {-32768, -16384, -1, 0, 1, 16384, 32767};
    std::vector<SampleFloat> out(pcm.size());
    pcm_s16le_to_float(pcm.data(), out.data(), pcm.size());
    for (size_t i = 0; i < out.size(); ++i) {
        EXPECT_GE(out[i], -1.0f);
        EXPECT_LE(out[i], 1.0f);
    }
}

TEST(AudioUtilsTest, PcmBytesToFloat_LittleEndian) {
    // 0x0100 in little-endian = 256 as int16 → 256/32768 ≈ 0.0078125
    uint8_t bytes[] = {0x00, 0x01};
    SampleFloat dest = 0.0f;
    pcm_bytes_to_float(bytes, &dest, 2);
    EXPECT_NEAR(dest, 256.0f / 32768.0f, 1e-6f);
}

TEST(AudioUtilsTest, PcmBytesToFloat_OddByteCount_Truncates) {
    uint8_t bytes[] = {0x00, 0x00, 0x00, 0x00, 0xFF};
    SampleFloat out[3] = {-999.0f, -999.0f, -999.0f};
    pcm_bytes_to_float(bytes, out, 5);
    // 5 bytes → 2 samples
    EXPECT_FLOAT_EQ(out[0], 0.0f);
    EXPECT_FLOAT_EQ(out[1], 0.0f);
    // Third element should be untouched
    EXPECT_FLOAT_EQ(out[2], -999.0f);
}

TEST(AudioUtilsTest, PcmBytesToFloat_EmptyInput) {
    SampleFloat out = -999.0f;
    pcm_bytes_to_float(nullptr, &out, 0);
    EXPECT_FLOAT_EQ(out, -999.0f);
}

TEST(AudioUtilsTest, PcmBytesToFloat_SingleSample) {
    // 0x7F00 LE → int16 = 0x007F = 127 → 127/32768
    uint8_t bytes[] = {0x7F, 0x00};
    SampleFloat dest = 0.0f;
    pcm_bytes_to_float(bytes, &dest, 2);
    EXPECT_NEAR(dest, 127.0f / 32768.0f, 1e-6f);
}

TEST(AudioUtilsTest, PcmBytesToFloat_KnownSequence) {
    // 0x4000 LE = int16 16384 → 16384/32768 = 0.5
    // 0xC000 LE = int16 -16384 → -16384/32768 = -0.5
    uint8_t bytes[] = {0x00, 0x40, 0x00, 0xC0};
    SampleFloat out[2] = {};
    pcm_bytes_to_float(bytes, out, 4);
    EXPECT_NEAR(out[0], 0.5f, 1e-4f);
    EXPECT_NEAR(out[1], -0.5f, 1e-4f);
}
