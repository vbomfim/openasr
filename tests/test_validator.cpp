#include <gtest/gtest.h>
#include "protocol/validator.hpp"
#include <nlohmann/json.hpp>

using namespace wss::protocol;
using json = nlohmann::json;

// Helper: a valid speech.config payload
static json valid_config() {
    return {
        {"language", "en"},
        {"sample_rate", 16000},
        {"encoding", "pcm_s16le"},
        {"window_duration_ms", 5000},
        {"overlap_duration_ms", 500}
    };
}

static json valid_envelope() {
    return {{"type", "speech.config"}, {"payload", valid_config()}};
}

// ========== Envelope validation (6 tests) ==========

TEST(ValidatorTest, Envelope_Valid_ReturnsOk) {
    auto r = validate_envelope(valid_envelope());
    EXPECT_TRUE(r.valid);
}

TEST(ValidatorTest, Envelope_NotObject_Fails) {
    for (const auto& bad : {json::array(), json("string"), json(42), json(nullptr)}) {
        auto r = validate_envelope(bad);
        EXPECT_FALSE(r.valid) << "Should fail for: " << bad.dump();
    }
}

TEST(ValidatorTest, Envelope_MissingType_Fails) {
    auto env = valid_envelope();
    env.erase("type");
    EXPECT_FALSE(validate_envelope(env).valid);
}

TEST(ValidatorTest, Envelope_TypeNotString_Fails) {
    auto env = valid_envelope();
    env["type"] = 42;
    EXPECT_FALSE(validate_envelope(env).valid);
}

TEST(ValidatorTest, Envelope_MissingPayload_Fails) {
    auto env = valid_envelope();
    env.erase("payload");
    EXPECT_FALSE(validate_envelope(env).valid);
}

TEST(ValidatorTest, Envelope_PayloadNotObject_Fails) {
    auto env = valid_envelope();
    env["payload"] = "string";
    EXPECT_FALSE(validate_envelope(env).valid);
}

// ========== SpeechConfig validation (20 tests) ==========

TEST(ValidatorTest, SpeechConfig_Valid_ReturnsOk) {
    auto r = validate_speech_config(valid_config());
    EXPECT_TRUE(r.valid);
}

TEST(ValidatorTest, SpeechConfig_MissingLanguage_Fails) {
    auto cfg = valid_config();
    cfg.erase("language");
    EXPECT_FALSE(validate_speech_config(cfg).valid);
}

TEST(ValidatorTest, SpeechConfig_LanguageTooLong_Fails) {
    auto cfg = valid_config();
    cfg["language"] = std::string(17, 'a'); // 17 chars > 16 max
    EXPECT_FALSE(validate_speech_config(cfg).valid);
}

TEST(ValidatorTest, SpeechConfig_SampleRate_8000_Passes) {
    auto cfg = valid_config();
    cfg["sample_rate"] = 8000;
    EXPECT_TRUE(validate_speech_config(cfg).valid);
}

TEST(ValidatorTest, SpeechConfig_SampleRate_96000_Passes) {
    auto cfg = valid_config();
    cfg["sample_rate"] = 96000;
    EXPECT_TRUE(validate_speech_config(cfg).valid);
}

TEST(ValidatorTest, SpeechConfig_SampleRate_7999_Fails) {
    auto cfg = valid_config();
    cfg["sample_rate"] = 7999;
    EXPECT_FALSE(validate_speech_config(cfg).valid);
}

TEST(ValidatorTest, SpeechConfig_SampleRate_96001_Fails) {
    auto cfg = valid_config();
    cfg["sample_rate"] = 96001;
    EXPECT_FALSE(validate_speech_config(cfg).valid);
}

TEST(ValidatorTest, SpeechConfig_SampleRate_Zero_Fails) {
    auto cfg = valid_config();
    cfg["sample_rate"] = 0;
    EXPECT_FALSE(validate_speech_config(cfg).valid);
}

TEST(ValidatorTest, SpeechConfig_SampleRate_Negative_Fails) {
    auto cfg = valid_config();
    cfg["sample_rate"] = -1;
    EXPECT_FALSE(validate_speech_config(cfg).valid);
}

TEST(ValidatorTest, SpeechConfig_Encoding_PcmS16le_Passes) {
    auto cfg = valid_config();
    cfg["encoding"] = "pcm_s16le";
    EXPECT_TRUE(validate_speech_config(cfg).valid);
}

TEST(ValidatorTest, SpeechConfig_Encoding_Opus_Passes) {
    auto cfg = valid_config();
    cfg["encoding"] = "opus";
    EXPECT_TRUE(validate_speech_config(cfg).valid);
}

TEST(ValidatorTest, SpeechConfig_Encoding_Mp3_Fails) {
    auto cfg = valid_config();
    cfg["encoding"] = "mp3";
    EXPECT_FALSE(validate_speech_config(cfg).valid);
}

TEST(ValidatorTest, SpeechConfig_Encoding_TooLong_Fails) {
    auto cfg = valid_config();
    cfg["encoding"] = std::string(33, 'x'); // 33 chars > 32 max
    EXPECT_FALSE(validate_speech_config(cfg).valid);
}

TEST(ValidatorTest, SpeechConfig_WindowDuration_1000_Passes) {
    auto cfg = valid_config();
    cfg["window_duration_ms"] = 1000;
    // overlap must be < window
    cfg["overlap_duration_ms"] = 0;
    EXPECT_TRUE(validate_speech_config(cfg).valid);
}

TEST(ValidatorTest, SpeechConfig_WindowDuration_60000_Passes) {
    auto cfg = valid_config();
    cfg["window_duration_ms"] = 60000;
    EXPECT_TRUE(validate_speech_config(cfg).valid);
}

TEST(ValidatorTest, SpeechConfig_WindowDuration_999_Fails) {
    auto cfg = valid_config();
    cfg["window_duration_ms"] = 999;
    EXPECT_FALSE(validate_speech_config(cfg).valid);
}

TEST(ValidatorTest, SpeechConfig_Overlap_Zero_Passes) {
    auto cfg = valid_config();
    cfg["overlap_duration_ms"] = 0;
    EXPECT_TRUE(validate_speech_config(cfg).valid);
}

TEST(ValidatorTest, SpeechConfig_Overlap_EqualsWindow_Fails) {
    auto cfg = valid_config();
    cfg["window_duration_ms"] = 5000;
    cfg["overlap_duration_ms"] = 5000; // overlap == window → fail (must be <)
    EXPECT_FALSE(validate_speech_config(cfg).valid);
}

TEST(ValidatorTest, SpeechConfig_Overlap_ExceedsWindow_Fails) {
    auto cfg = valid_config();
    cfg["window_duration_ms"] = 5000;
    cfg["overlap_duration_ms"] = 6000;
    EXPECT_FALSE(validate_speech_config(cfg).valid);
}

TEST(ValidatorTest, SpeechConfig_ModelId_TooLong_Fails) {
    auto cfg = valid_config();
    cfg["model_id"] = std::string(129, 'm'); // 129 chars > 128 max
    EXPECT_FALSE(validate_speech_config(cfg).valid);
}

// ========== Missing-field and wrong-type checks ==========

TEST(ValidatorTest, SpeechConfig_MissingSampleRate_Fails) {
    auto p = valid_config();
    p.erase("sample_rate");
    auto r = validate_speech_config(p);
    EXPECT_FALSE(r.valid);
}

TEST(ValidatorTest, SpeechConfig_SampleRateNotInt_Fails) {
    auto p = valid_config();
    p["sample_rate"] = "not_a_number";
    auto r = validate_speech_config(p);
    EXPECT_FALSE(r.valid);
}

TEST(ValidatorTest, SpeechConfig_MissingEncoding_Fails) {
    auto p = valid_config();
    p.erase("encoding");
    auto r = validate_speech_config(p);
    EXPECT_FALSE(r.valid);
}

TEST(ValidatorTest, SpeechConfig_EncodingNotString_Fails) {
    auto p = valid_config();
    p["encoding"] = 42;
    auto r = validate_speech_config(p);
    EXPECT_FALSE(r.valid);
}

TEST(ValidatorTest, SpeechConfig_MissingWindowDuration_Fails) {
    auto p = valid_config();
    p.erase("window_duration_ms");
    auto r = validate_speech_config(p);
    EXPECT_FALSE(r.valid);
}

TEST(ValidatorTest, SpeechConfig_MissingOverlap_Fails) {
    auto p = valid_config();
    p.erase("overlap_duration_ms");
    auto r = validate_speech_config(p);
    EXPECT_FALSE(r.valid);
}

TEST(ValidatorTest, SpeechConfig_ResumeCheckpointInvalid_Fails) {
    auto p = valid_config();
    p["resume_checkpoint"] = "not_an_object";
    auto r = validate_speech_config(p);
    EXPECT_FALSE(r.valid);
}

TEST(ValidatorTest, SpeechConfig_ResumeCheckpointNull_Passes) {
    auto p = valid_config();
    p["resume_checkpoint"] = nullptr;
    auto r = validate_speech_config(p);
    EXPECT_TRUE(r.valid);
}

TEST(ValidatorTest, SpeechConfig_EncodingTooLong_Fails) {
    auto p = valid_config();
    p["encoding"] = std::string(33, 'x');
    auto r = validate_speech_config(p);
    EXPECT_FALSE(r.valid);
}
