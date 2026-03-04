#include <gtest/gtest.h>
#include "audio/buffer_engine.hpp"
#include "audio/audio_ring_buffer.hpp"
#include <cmath>
#include <vector>
#include <numeric>

using wss::audio::BufferEngine;
using wss::audio::AudioRingBuffer;

static constexpr int kSR = 16000; // wss::kWhisperSampleRate

// 1. Construct_InitializesWindowEnd
TEST(BufferEngineTest, Construct_InitializesWindowEnd) {
    BufferEngine engine(1000, 200); // 1s window, 200ms overlap
    size_t window_samples = static_cast<size_t>(1000 * kSR / 1000); // 16000
    AudioRingBuffer ring(window_samples * 2);
    std::vector<float> data(window_samples, 0.1f);
    ring.write(data.data(), data.size());
    EXPECT_TRUE(engine.window_ready(ring));
}

// 2. Construct_ValidParams
TEST(BufferEngineTest, Construct_ValidParams) {
    BufferEngine engine(5000, 200);
    EXPECT_EQ(engine.window_samples(), static_cast<size_t>(5000 * kSR / 1000));
}

// 3. Construct_OverlapLessThanWindow
TEST(BufferEngineTest, Construct_OverlapLessThanWindow) {
    BufferEngine engine(1000, 200);
    EXPECT_GT(engine.stride_samples(), 0u);
    EXPECT_EQ(engine.stride_samples(), engine.window_samples() - static_cast<size_t>(200 * kSR / 1000));
}

// 4. WindowReady_NotEnoughData_ReturnsFalse
TEST(BufferEngineTest, WindowReady_NotEnoughData_ReturnsFalse) {
    BufferEngine engine(1000, 200);
    AudioRingBuffer ring(32000);
    std::vector<float> data(100, 0.0f); // way less than 16000
    ring.write(data.data(), data.size());
    EXPECT_FALSE(engine.window_ready(ring));
}

// 5. WindowReady_ExactlyEnough_ReturnsTrue
TEST(BufferEngineTest, WindowReady_ExactlyEnough_ReturnsTrue) {
    BufferEngine engine(1000, 200);
    size_t ws = engine.window_samples();
    AudioRingBuffer ring(ws * 2);
    std::vector<float> data(ws, 0.0f);
    ring.write(data.data(), data.size());
    EXPECT_TRUE(engine.window_ready(ring));
}

// 6. WindowReady_MoreThanEnough_ReturnsTrue
TEST(BufferEngineTest, WindowReady_MoreThanEnough_ReturnsTrue) {
    BufferEngine engine(1000, 200);
    size_t ws = engine.window_samples();
    AudioRingBuffer ring(ws * 3);
    std::vector<float> data(ws + 1000, 0.0f);
    ring.write(data.data(), data.size());
    EXPECT_TRUE(engine.window_ready(ring));
}

// 7. ExtractWindow_ReturnsCorrectTimestamps
TEST(BufferEngineTest, ExtractWindow_ReturnsCorrectTimestamps) {
    BufferEngine engine(1000, 200); // 1s window
    size_t ws = engine.window_samples();
    AudioRingBuffer ring(ws * 2);
    std::vector<float> data(ws, 0.0f);
    ring.write(data.data(), data.size());

    auto result = engine.extract_window(ring);
    EXPECT_EQ(result.count, ws);
    EXPECT_EQ(result.start_ms, 0);
    EXPECT_EQ(result.end_ms, 1000);
}

// 8. ExtractWindow_AdvancesPosition
TEST(BufferEngineTest, ExtractWindow_AdvancesPosition) {
    BufferEngine engine(1000, 200);
    size_t ws = engine.window_samples();
    size_t stride = engine.stride_samples();
    AudioRingBuffer ring(ws * 4);

    // Write exactly one window
    std::vector<float> data(ws, 0.0f);
    ring.write(data.data(), data.size());
    engine.extract_window(ring);

    // Now need stride more samples for next window
    EXPECT_FALSE(engine.window_ready(ring));
    std::vector<float> more(stride, 0.0f);
    ring.write(more.data(), more.size());
    EXPECT_TRUE(engine.window_ready(ring));
}

// 9. ExtractWindow_SecondWindow_CorrectOverlap
TEST(BufferEngineTest, ExtractWindow_SecondWindow_CorrectOverlap) {
    int32_t win_ms = 1000;
    int32_t overlap_ms = 200;
    BufferEngine engine(win_ms, overlap_ms);
    size_t ws = engine.window_samples();
    size_t stride = engine.stride_samples();
    AudioRingBuffer ring(ws * 4);

    // Write enough for 2 windows
    std::vector<float> data(ws + stride, 0.0f);
    ring.write(data.data(), data.size());

    auto r1 = engine.extract_window(ring);
    EXPECT_EQ(r1.start_ms, 0);
    EXPECT_EQ(r1.end_ms, 1000);

    auto r2 = engine.extract_window(ring);
    int64_t expected_start = static_cast<int64_t>(win_ms - overlap_ms);
    EXPECT_EQ(r2.start_ms, expected_start);
    EXPECT_EQ(r2.end_ms, expected_start + win_ms);
}

// 10. ExtractWindow_NotReady_ReturnsEmpty
TEST(BufferEngineTest, ExtractWindow_NotReady_ReturnsEmpty) {
    BufferEngine engine(1000, 200);
    AudioRingBuffer ring(32000);
    auto result = engine.extract_window(ring);
    EXPECT_EQ(result.count, 0u);
    EXPECT_EQ(result.samples, nullptr);
}

// 11. MsToSamples
TEST(BufferEngineTest, MsToSamples) {
    BufferEngine engine(5000, 0);
    EXPECT_EQ(engine.window_samples(), 80000u);
}

// 12. MsToSamples_Zero
TEST(BufferEngineTest, MsToSamples_Zero) {
    BufferEngine engine(0, 0);
    EXPECT_EQ(engine.window_samples(), 0u);
}

// 13. SamplesToMs_Roundtrip
TEST(BufferEngineTest, SamplesToMs_Roundtrip) {
    int32_t ms = 3000;
    BufferEngine engine(ms, 0);
    size_t ws = engine.window_samples(); // 48000
    AudioRingBuffer ring(ws * 2);
    std::vector<float> data(ws, 0.0f);
    ring.write(data.data(), data.size());

    auto result = engine.extract_window(ring);
    EXPECT_EQ(result.end_ms, ms);
    EXPECT_EQ(result.end_ms - result.start_ms, ms);
}

// 14. Reset_ResetsPosition
TEST(BufferEngineTest, Reset_ResetsPosition) {
    BufferEngine engine(1000, 200);
    size_t ws = engine.window_samples();
    AudioRingBuffer ring(ws * 4);
    std::vector<float> data(ws, 0.0f);
    ring.write(data.data(), data.size());

    engine.extract_window(ring);
    engine.reset();

    // After reset, next window should start at 0 again
    auto result = engine.extract_window(ring);
    EXPECT_EQ(result.start_ms, 0);
    EXPECT_EQ(result.end_ms, 1000);
    EXPECT_EQ(result.count, ws);
}

// 15. ResetTo_SpecificPosition
TEST(BufferEngineTest, ResetTo_SpecificPosition) {
    BufferEngine engine(1000, 200);
    size_t ws = engine.window_samples();

    // Write enough data so that a window starting at 5000ms is available
    size_t samples_needed = static_cast<size_t>(5000 * kSR / 1000) + ws;
    AudioRingBuffer ring(samples_needed);
    std::vector<float> data(samples_needed, 0.0f);
    ring.write(data.data(), data.size());

    engine.reset_to(5000);
    auto result = engine.extract_window(ring);
    EXPECT_EQ(result.start_ms, 5000);
    EXPECT_EQ(result.end_ms, 6000);
}

// 16. MultipleWindows_CoverTimeline
TEST(BufferEngineTest, MultipleWindows_CoverTimeline) {
    int32_t win_ms = 500;
    int32_t overlap_ms = 100;
    BufferEngine engine(win_ms, overlap_ms);
    size_t ws = engine.window_samples();
    size_t stride = engine.stride_samples();

    int num_windows = 5;
    size_t total_samples = ws + stride * (num_windows - 1);
    AudioRingBuffer ring(total_samples * 2);

    std::vector<float> data(total_samples);
    std::iota(data.begin(), data.end(), 0.0f);
    ring.write(data.data(), data.size());

    int64_t expected_start = 0;
    for (int i = 0; i < num_windows; ++i) {
        ASSERT_TRUE(engine.window_ready(ring)) << "Window " << i << " not ready";
        auto result = engine.extract_window(ring);
        EXPECT_EQ(result.count, ws);
        EXPECT_EQ(result.start_ms, expected_start) << "Window " << i;
        EXPECT_EQ(result.end_ms, expected_start + win_ms) << "Window " << i;
        expected_start += (win_ms - overlap_ms);
    }
    // After extracting all, next should not be ready
    EXPECT_FALSE(engine.window_ready(ring));
}

// --- VAD-aware windowing tests ---

// Helper: generate a sine wave tone (speech-like)
static std::vector<float> make_tone(size_t num_samples, float amplitude = 0.1f,
                                     float freq = 440.0f) {
    std::vector<float> data(num_samples);
    for (size_t i = 0; i < num_samples; ++i) {
        data[i] = amplitude * std::sin(
            2.0f * static_cast<float>(M_PI) * freq *
            static_cast<float>(i) / static_cast<float>(kSR));
    }
    return data;
}

// Helper: generate silence
static std::vector<float> make_silence(size_t num_samples) {
    return std::vector<float>(num_samples, 0.0f);
}

// 17. VAD disabled by default
TEST(BufferEngineTest, VadDisabled_ByDefault) {
    BufferEngine engine(1000, 200);
    EXPECT_FALSE(engine.vad_enabled());
}

// 18. VAD can be enabled
TEST(BufferEngineTest, VadEnabled_Constructor) {
    BufferEngine engine(1000, 200, true);
    EXPECT_TRUE(engine.vad_enabled());
}

// 19. VAD mode: window not ready without processing
TEST(BufferEngineTest, VadMode_NoData_NotReady) {
    BufferEngine engine(5000, 500, true);
    AudioRingBuffer ring(80000);
    EXPECT_FALSE(engine.window_ready(ring));
}

// 20. VAD mode: speech then silence triggers window
TEST(BufferEngineTest, VadMode_SpeechThenSilence_WindowReady) {
    wss::audio::VadConfig vad_cfg;
    vad_cfg.silence_timeout_ms = 500;
    BufferEngine engine(20000, 2000, true, vad_cfg);

    size_t ring_capacity = static_cast<size_t>(30 * kSR);
    AudioRingBuffer ring(ring_capacity);

    // Write speech (1 second)
    auto tone = make_tone(16000);
    ring.write(tone.data(), tone.size());
    engine.process_vad(tone.data(), tone.size());
    EXPECT_FALSE(engine.window_ready(ring));

    // Write silence (500ms = timeout)
    auto silence = make_silence(8000);
    ring.write(silence.data(), silence.size());
    engine.process_vad(silence.data(), silence.size());

    EXPECT_TRUE(engine.window_ready(ring));

    auto result = engine.extract_window(ring);
    EXPECT_GT(result.count, 0u);
    EXPECT_EQ(result.start_ms, 0);
}

// 21. VAD mode: continuous speech triggers window at max duration
TEST(BufferEngineTest, VadMode_ContinuousSpeech_FallbackToMaxWindow) {
    wss::audio::VadConfig vad_cfg;
    vad_cfg.silence_timeout_ms = 500;
    int32_t window_ms = 1000; // 1s max window
    BufferEngine engine(window_ms, 200, true, vad_cfg);

    size_t ring_capacity = static_cast<size_t>(30 * kSR);
    AudioRingBuffer ring(ring_capacity);

    // Write more than max window of continuous speech
    auto tone = make_tone(static_cast<size_t>(window_ms * kSR / 1000) + 1600);
    ring.write(tone.data(), tone.size());
    engine.process_vad(tone.data(), tone.size());

    EXPECT_TRUE(engine.window_ready(ring));
}

// 22. VAD mode: only silence, no window ready
TEST(BufferEngineTest, VadMode_OnlySilence_NotReady) {
    BufferEngine engine(5000, 500, true);
    AudioRingBuffer ring(80000);

    auto silence = make_silence(16000); // 1s of silence
    ring.write(silence.data(), silence.size());
    engine.process_vad(silence.data(), silence.size());

    EXPECT_FALSE(engine.window_ready(ring));
}

// 23. VAD mode: extract window resets VAD ready state
TEST(BufferEngineTest, VadMode_ExtractResetsReady) {
    wss::audio::VadConfig vad_cfg;
    vad_cfg.silence_timeout_ms = 500;
    BufferEngine engine(20000, 2000, true, vad_cfg);

    size_t ring_capacity = static_cast<size_t>(30 * kSR);
    AudioRingBuffer ring(ring_capacity);

    // Speech + silence to trigger window
    auto tone = make_tone(16000);
    ring.write(tone.data(), tone.size());
    engine.process_vad(tone.data(), tone.size());

    auto silence = make_silence(8000);
    ring.write(silence.data(), silence.size());
    engine.process_vad(silence.data(), silence.size());

    EXPECT_TRUE(engine.window_ready(ring));

    auto result = engine.extract_window(ring);
    EXPECT_GT(result.count, 0u);

    // After extraction, should not be ready anymore
    EXPECT_FALSE(engine.window_ready(ring));
}

// 24. VAD mode: multiple utterances produce multiple windows
TEST(BufferEngineTest, VadMode_MultipleUtterances) {
    wss::audio::VadConfig vad_cfg;
    vad_cfg.silence_timeout_ms = 500;
    BufferEngine engine(20000, 2000, true, vad_cfg);

    size_t ring_capacity = static_cast<size_t>(30 * kSR);
    AudioRingBuffer ring(ring_capacity);

    // First utterance
    auto tone1 = make_tone(8000); // 500ms
    ring.write(tone1.data(), tone1.size());
    engine.process_vad(tone1.data(), tone1.size());

    auto silence1 = make_silence(8000); // 500ms silence
    ring.write(silence1.data(), silence1.size());
    engine.process_vad(silence1.data(), silence1.size());

    EXPECT_TRUE(engine.window_ready(ring));
    auto r1 = engine.extract_window(ring);
    EXPECT_GT(r1.count, 0u);
    EXPECT_EQ(r1.start_ms, 0);

    // Second utterance
    auto tone2 = make_tone(8000);
    ring.write(tone2.data(), tone2.size());
    engine.process_vad(tone2.data(), tone2.size());

    auto silence2 = make_silence(8000);
    ring.write(silence2.data(), silence2.size());
    engine.process_vad(silence2.data(), silence2.size());

    EXPECT_TRUE(engine.window_ready(ring));
    auto r2 = engine.extract_window(ring);
    EXPECT_GT(r2.count, 0u);
    EXPECT_GT(r2.start_ms, r1.start_ms); // second window starts after first
}

// 25. VAD mode: reset clears state
TEST(BufferEngineTest, VadMode_Reset_ClearsState) {
    wss::audio::VadConfig vad_cfg;
    vad_cfg.silence_timeout_ms = 500;
    BufferEngine engine(20000, 2000, true, vad_cfg);

    size_t ring_capacity = static_cast<size_t>(30 * kSR);
    AudioRingBuffer ring(ring_capacity);

    auto tone = make_tone(16000);
    ring.write(tone.data(), tone.size());
    engine.process_vad(tone.data(), tone.size());

    auto silence = make_silence(8000);
    ring.write(silence.data(), silence.size());
    engine.process_vad(silence.data(), silence.size());

    EXPECT_TRUE(engine.window_ready(ring));

    engine.reset();
    EXPECT_FALSE(engine.window_ready(ring));
}
