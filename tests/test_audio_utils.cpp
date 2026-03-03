#include <gtest/gtest.h>
#include "audio/audio_utils.hpp"
#include <vector>

TEST(AudioUtilsTest, Placeholder) {
    std::vector<int16_t> pcm = {0, 32767, -32768};
    std::vector<wss::SampleFloat> out(pcm.size());
    wss::audio::pcm_s16le_to_float(pcm.data(), out.data(), pcm.size());
    EXPECT_FLOAT_EQ(out[0], 0.0f);
}
