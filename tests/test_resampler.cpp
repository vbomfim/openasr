#include <gtest/gtest.h>
#include "audio/resampler.hpp"
#include <cmath>
#include <vector>

using wss::audio::Resampler;

// Helper: generate a sine wave at the given frequency and sample rate
static std::vector<float> make_sine(int sample_rate, float freq_hz, size_t num_samples) {
    std::vector<float> buf(num_samples);
    for (size_t i = 0; i < num_samples; ++i) {
        buf[i] = std::sin(2.0f * static_cast<float>(M_PI) * freq_hz *
                          static_cast<float>(i) / static_cast<float>(sample_rate));
    }
    return buf;
}

// T8-1
TEST(Resampler, Construct_SameRate_NoResampling) {
    Resampler r(16000, 16000);
    EXPECT_FALSE(r.needs_resampling());
}

// T8-2
TEST(Resampler, Construct_DifferentRate_NeedsResampling) {
    Resampler r(48000, 16000);
    EXPECT_TRUE(r.needs_resampling());
}

// T8-3
TEST(Resampler, Construct_ZeroSrcRate_Throws) {
    EXPECT_THROW(Resampler(0, 16000), std::invalid_argument);
}

// T8-4
TEST(Resampler, Construct_ZeroDstRate_Throws) {
    EXPECT_THROW(Resampler(16000, 0), std::invalid_argument);
}

// T8-5
TEST(Resampler, Construct_NegativeRate_Throws) {
    EXPECT_THROW(Resampler(-1, 16000), std::invalid_argument);
    EXPECT_THROW(Resampler(16000, -1), std::invalid_argument);
}

// T8-6
TEST(Resampler, Process_SameRate_Passthrough) {
    Resampler r(16000, 16000);
    auto input = make_sine(16000, 440.0f, 1600);
    auto result = r.process(input.data(), input.size(), true);
    // Same rate: output count should equal input count
    EXPECT_EQ(result.count, input.size());
}

// T8-7
TEST(Resampler, Process_48kTo16k_Downsamples) {
    Resampler r(48000, 16000);
    auto input = make_sine(48000, 440.0f, 4800);
    auto result = r.process(input.data(), input.size(), true);
    size_t expected = 1600; // 4800 / 3
    double lo = static_cast<double>(expected) * 0.95;
    double hi = static_cast<double>(expected) * 1.05;
    EXPECT_GE(result.count, static_cast<size_t>(lo));
    EXPECT_LE(result.count, static_cast<size_t>(hi));
}

// T8-8
TEST(Resampler, Process_8kTo16k_Upsamples) {
    Resampler r(8000, 16000);
    auto input = make_sine(8000, 440.0f, 800);
    auto result = r.process(input.data(), input.size(), true);
    size_t expected = 1600; // 800 * 2
    double lo = static_cast<double>(expected) * 0.95;
    double hi = static_cast<double>(expected) * 1.05;
    EXPECT_GE(result.count, static_cast<size_t>(lo));
    EXPECT_LE(result.count, static_cast<size_t>(hi));
}

// T8-9
TEST(Resampler, Process_EmptyInput_NoOutput) {
    Resampler r(48000, 16000);
    auto result = r.process(nullptr, 0, true);
    EXPECT_EQ(result.count, 0u);
}

// T8-10
TEST(Resampler, Process_SingleSample) {
    Resampler r(16000, 16000);
    float sample = 0.5f;
    auto result = r.process(&sample, 1, true);
    EXPECT_GE(result.count, 1u);
}

// T8-11
TEST(Resampler, Reset_Works) {
    Resampler r(48000, 16000);
    auto input = make_sine(48000, 440.0f, 480);
    r.process(input.data(), input.size());
    EXPECT_NO_THROW(r.reset());
    // Process again after reset — should not crash
    auto result = r.process(input.data(), input.size(), true);
    EXPECT_GT(result.count, 0u);
}

// T8-12
TEST(Resampler, Ratio_Correct) {
    Resampler r(48000, 16000);
    double expected = 16000.0 / 48000.0;
    EXPECT_DOUBLE_EQ(r.ratio(), expected);
}
