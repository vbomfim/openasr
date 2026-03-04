#include <gtest/gtest.h>
#include "audio/vad.hpp"
#include <cmath>
#include <vector>

using wss::audio::VoiceActivityDetector;
using wss::audio::VadConfig;

static constexpr int kSR = 16000;

// Generate silence (zero-valued samples)
static std::vector<float> make_silence(size_t num_samples) {
    return std::vector<float>(num_samples, 0.0f);
}

// Generate a sine wave at a given amplitude (simulates speech)
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

// --- Construction ---

TEST(VadTest, Construct_DefaultConfig) {
    VoiceActivityDetector vad;
    EXPECT_FALSE(vad.in_speech());
    EXPECT_EQ(vad.speech_samples(), 0u);
    EXPECT_FLOAT_EQ(vad.config().energy_threshold, 0.005f);
    EXPECT_EQ(vad.config().silence_timeout_ms, 500);
    EXPECT_EQ(vad.config().frame_duration_ms, 30);
    EXPECT_EQ(vad.config().max_speech_duration_ms, 30000);
}

TEST(VadTest, Construct_CustomConfig) {
    VadConfig cfg;
    cfg.energy_threshold = 0.01f;
    cfg.silence_timeout_ms = 1000;
    VoiceActivityDetector vad(cfg);
    EXPECT_FLOAT_EQ(vad.config().energy_threshold, 0.01f);
    EXPECT_EQ(vad.config().silence_timeout_ms, 1000);
}

// --- Silence detection ---

TEST(VadTest, Process_Silence_NoSpeech) {
    VoiceActivityDetector vad;
    auto silence = make_silence(480); // 30ms at 16kHz
    auto result = vad.process(silence.data(), silence.size());
    EXPECT_FALSE(result.is_speech);
    EXPECT_FALSE(result.end_of_speech);
    EXPECT_FALSE(vad.in_speech());
}

TEST(VadTest, Process_LongSilence_NeverSpeech) {
    VoiceActivityDetector vad;
    auto silence = make_silence(16000); // 1 second
    auto result = vad.process(silence.data(), silence.size());
    EXPECT_FALSE(result.is_speech);
    EXPECT_FALSE(result.end_of_speech);
    EXPECT_EQ(vad.speech_samples(), 0u);
}

// --- Speech detection ---

TEST(VadTest, Process_Tone_DetectsSpeech) {
    VoiceActivityDetector vad;
    auto tone = make_tone(480); // 30ms of 440Hz tone
    auto result = vad.process(tone.data(), tone.size());
    EXPECT_TRUE(result.is_speech);
    EXPECT_FALSE(result.end_of_speech);
    EXPECT_TRUE(vad.in_speech());
}

TEST(VadTest, Process_LoudTone_DetectsSpeech) {
    VoiceActivityDetector vad;
    auto tone = make_tone(16000, 0.5f); // 1s of loud tone
    auto result = vad.process(tone.data(), tone.size());
    EXPECT_TRUE(result.is_speech);
    EXPECT_TRUE(vad.in_speech());
    EXPECT_GT(vad.speech_samples(), 0u);
}

// --- End-of-speech detection ---

TEST(VadTest, Process_SpeechThenSilence_DetectsEndOfSpeech) {
    VadConfig cfg;
    cfg.silence_timeout_ms = 500;
    VoiceActivityDetector vad(cfg);

    // Feed speech
    auto tone = make_tone(8000); // 500ms of speech
    vad.process(tone.data(), tone.size());
    EXPECT_TRUE(vad.in_speech());

    // Feed enough silence to trigger end-of-speech (500ms)
    auto silence = make_silence(8000); // 500ms of silence
    auto result = vad.process(silence.data(), silence.size());
    EXPECT_TRUE(result.end_of_speech);
    EXPECT_FALSE(vad.in_speech());
}

TEST(VadTest, Process_SpeechThenShortSilence_NoEndOfSpeech) {
    VadConfig cfg;
    cfg.silence_timeout_ms = 500;
    VoiceActivityDetector vad(cfg);

    // Feed speech
    auto tone = make_tone(8000);
    vad.process(tone.data(), tone.size());

    // Feed short silence (200ms < 500ms timeout)
    auto silence = make_silence(3200);
    auto result = vad.process(silence.data(), silence.size());
    EXPECT_FALSE(result.end_of_speech);
    EXPECT_TRUE(vad.in_speech()); // still in speech
}

TEST(VadTest, Process_SpeechPauseSpeech_NoEndOfSpeech) {
    VadConfig cfg;
    cfg.silence_timeout_ms = 500;
    VoiceActivityDetector vad(cfg);

    // Speech
    auto tone = make_tone(8000);
    vad.process(tone.data(), tone.size());

    // Short pause (200ms)
    auto silence = make_silence(3200);
    vad.process(silence.data(), silence.size());

    // Speech resumes
    auto result = vad.process(tone.data(), tone.size());
    EXPECT_TRUE(result.is_speech);
    EXPECT_FALSE(result.end_of_speech);
    EXPECT_TRUE(vad.in_speech());
}

// --- Max speech duration ---

TEST(VadTest, Process_ContinuousSpeech_ForcesEndAtMaxDuration) {
    VadConfig cfg;
    cfg.max_speech_duration_ms = 1000; // 1 second max
    VoiceActivityDetector vad(cfg);

    // Feed 1.5 seconds of continuous speech
    auto tone = make_tone(24000, 0.1f); // 1.5s
    auto result = vad.process(tone.data(), tone.size());
    EXPECT_TRUE(result.end_of_speech);
}

// --- Reset ---

TEST(VadTest, Reset_ClearsState) {
    VoiceActivityDetector vad;
    auto tone = make_tone(8000);
    vad.process(tone.data(), tone.size());
    EXPECT_TRUE(vad.in_speech());
    EXPECT_GT(vad.speech_samples(), 0u);

    vad.reset();
    EXPECT_FALSE(vad.in_speech());
    EXPECT_EQ(vad.speech_samples(), 0u);
}

// --- Edge cases ---

TEST(VadTest, Process_EmptyInput_NoEffect) {
    VoiceActivityDetector vad;
    auto result = vad.process(nullptr, 0);
    EXPECT_FALSE(result.is_speech);
    EXPECT_FALSE(result.end_of_speech);
    EXPECT_EQ(result.speech_samples, 0u);
}

TEST(VadTest, Process_VeryQuietTone_NoSpeech) {
    VoiceActivityDetector vad;
    // Amplitude below default threshold (0.005)
    auto tone = make_tone(480, 0.001f);
    auto result = vad.process(tone.data(), tone.size());
    EXPECT_FALSE(result.is_speech);
}

TEST(VadTest, Process_AtThreshold_DetectsSpeech) {
    VadConfig cfg;
    cfg.energy_threshold = 0.005f;
    VoiceActivityDetector vad(cfg);
    // Amplitude well above threshold
    auto tone = make_tone(480, 0.05f);
    auto result = vad.process(tone.data(), tone.size());
    EXPECT_TRUE(result.is_speech);
}

TEST(VadTest, Process_MultipleChunks_AccumulatesSpeechSamples) {
    VoiceActivityDetector vad;
    auto tone = make_tone(480);

    vad.process(tone.data(), tone.size());
    size_t first = vad.speech_samples();

    vad.process(tone.data(), tone.size());
    EXPECT_GT(vad.speech_samples(), first);
}

TEST(VadTest, Process_SilenceWithNoSpeechBefore_NoEndOfSpeech) {
    VoiceActivityDetector vad;
    // Silence without prior speech should NOT trigger end-of-speech
    auto silence = make_silence(16000); // 1s of silence
    auto result = vad.process(silence.data(), silence.size());
    EXPECT_FALSE(result.end_of_speech);
    EXPECT_FALSE(result.is_speech);
}
