#include <gtest/gtest.h>
#include "audio/audio_pipeline.hpp"
#include <cmath>
#include <cstring>
#include <vector>

using wss::audio::AudioPipeline;

// Helper: generate PCM int16 LE bytes from a sine wave
static std::vector<uint8_t> make_pcm_bytes(int sample_rate, float freq_hz, size_t num_samples) {
    std::vector<uint8_t> buf(num_samples * 2);
    for (size_t i = 0; i < num_samples; ++i) {
        float val = std::sin(2.0f * static_cast<float>(M_PI) * freq_hz *
                             static_cast<float>(i) / static_cast<float>(sample_rate));
        auto s = static_cast<int16_t>(val * 16000.0f);
        buf[i * 2]     = static_cast<uint8_t>(s & 0xFF);
        buf[i * 2 + 1] = static_cast<uint8_t>((s >> 8) & 0xFF);
    }
    return buf;
}

// T9-1
TEST(AudioPipeline, Construct_16k_NoResampler) {
    AudioPipeline p(16000);
    EXPECT_EQ(p.input_sample_rate(), 16000);
}

// T9-2
TEST(AudioPipeline, Construct_48k_HasResampler) {
    AudioPipeline p(48000);
    EXPECT_EQ(p.input_sample_rate(), 48000);
    // Resampler is internal; verify by ingesting audio and checking ring buffer
    auto pcm = make_pcm_bytes(48000, 440.0f, 4800);
    p.ingest_pcm(pcm.data(), pcm.size());
    // Ring buffer should have ~1600 samples (48k→16k downsampling of 4800 samples)
    EXPECT_GT(p.ring_buffer().total_written(), 0u);
}

// T9-3
TEST(AudioPipeline, IngestPcm_16k_WritesToRingBuffer) {
    AudioPipeline p(16000);
    auto pcm = make_pcm_bytes(16000, 440.0f, 1600);
    p.ingest_pcm(pcm.data(), pcm.size());
    EXPECT_GT(p.ring_buffer().total_written(), 0u);
}

// T9-4
TEST(AudioPipeline, IngestPcm_48k_Resamples) {
    AudioPipeline p(48000);
    auto pcm = make_pcm_bytes(48000, 440.0f, 4800);
    p.ingest_pcm(pcm.data(), pcm.size());
    size_t written = p.ring_buffer().total_written();
    // Should be approximately 4800 / 3 = 1600 samples (±5%)
    EXPECT_GE(written, static_cast<size_t>(1600 * 0.95));
    EXPECT_LE(written, static_cast<size_t>(1600 * 1.05));
}

// T9-5
TEST(AudioPipeline, IngestPcm_EmptyData_NoEffect) {
    AudioPipeline p(16000);
    size_t before = p.ring_buffer().total_written();
    p.ingest_pcm(nullptr, 0);
    EXPECT_EQ(p.ring_buffer().total_written(), before);
}

// T9-6
TEST(AudioPipeline, HasOpus_BeforeInit_ReturnsFalse) {
    AudioPipeline p(16000);
    EXPECT_FALSE(p.has_opus());
}

// T9-7
TEST(AudioPipeline, HasOpus_AfterInit_ReturnsTrue) {
    AudioPipeline p(48000);
    p.init_opus(48000);
    EXPECT_TRUE(p.has_opus());
}

// T9-8
TEST(AudioPipeline, Reset_ClearsRingBuffer) {
    AudioPipeline p(16000);
    auto pcm = make_pcm_bytes(16000, 440.0f, 1600);
    p.ingest_pcm(pcm.data(), pcm.size());
    EXPECT_GT(p.ring_buffer().total_written(), 0u);
    p.reset();
    EXPECT_EQ(p.ring_buffer().total_written(), 0u);
}

// T9-9
TEST(AudioPipeline, RingBuffer_Accessor_ReturnsRef) {
    AudioPipeline p(16000);
    const auto& rb = p.ring_buffer();
    EXPECT_EQ(rb.capacity(), static_cast<size_t>(16000 * 30)); // default 30s
}
