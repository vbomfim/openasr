#include <gtest/gtest.h>
#include "protocol/messages.hpp"

using namespace wss::protocol;
using json = nlohmann::json;

// ---------- Construction / Defaults ----------

TEST(MessagesTest, SpeechConfigPayload_DefaultValues) {
    SpeechConfigPayload p;
    EXPECT_EQ(p.language, "en");
    EXPECT_EQ(p.sample_rate, 16000);
    EXPECT_EQ(p.encoding, "pcm_s16le");
    EXPECT_EQ(p.window_duration_ms, 5000);
    EXPECT_EQ(p.overlap_duration_ms, 500);
    EXPECT_EQ(p.model_id, "whisper-tiny.en");
    EXPECT_FALSE(p.resume_checkpoint.has_value());
}

TEST(MessagesTest, BufferConfig_DefaultValues) {
    BufferConfig bc;
    EXPECT_EQ(bc.window_duration_ms, 20000);
    EXPECT_EQ(bc.overlap_duration_ms, 2000);
}

// ---------- JSON Roundtrips ----------

TEST(MessagesTest, SpeechConfigPayload_JsonRoundtrip) {
    SpeechConfigPayload orig;
    orig.language = "pt";
    orig.sample_rate = 48000;
    orig.encoding = "opus";
    orig.window_duration_ms = 10000;
    orig.overlap_duration_ms = 1000;
    orig.model_id = "whisper-large-v3";

    json j = orig;
    auto rt = j.get<SpeechConfigPayload>();

    EXPECT_EQ(rt.language, orig.language);
    EXPECT_EQ(rt.sample_rate, orig.sample_rate);
    EXPECT_EQ(rt.encoding, orig.encoding);
    EXPECT_EQ(rt.window_duration_ms, orig.window_duration_ms);
    EXPECT_EQ(rt.overlap_duration_ms, orig.overlap_duration_ms);
    EXPECT_EQ(rt.model_id, orig.model_id);
    EXPECT_FALSE(rt.resume_checkpoint.has_value());
}

TEST(MessagesTest, SpeechConfigPayload_WithCheckpoint_Roundtrip) {
    SpeechConfigPayload orig;
    CheckpointData cp;
    cp.session_id = "sess-42";
    cp.last_audio_ms = 5000;
    cp.last_text_offset = 120;
    cp.full_transcript = "hello world";
    cp.buffer_config = {8000, 800};
    cp.backend_model_id = "whisper-tiny.en";
    orig.resume_checkpoint = cp;

    json j = orig;
    auto rt = j.get<SpeechConfigPayload>();

    ASSERT_TRUE(rt.resume_checkpoint.has_value());
    EXPECT_EQ(rt.resume_checkpoint->session_id, "sess-42");
    EXPECT_EQ(rt.resume_checkpoint->last_audio_ms, 5000);
    EXPECT_EQ(rt.resume_checkpoint->last_text_offset, 120);
    EXPECT_EQ(rt.resume_checkpoint->full_transcript, "hello world");
    EXPECT_EQ(rt.resume_checkpoint->buffer_config.window_duration_ms, 8000);
    EXPECT_EQ(rt.resume_checkpoint->buffer_config.overlap_duration_ms, 800);
    EXPECT_EQ(rt.resume_checkpoint->backend_model_id, "whisper-tiny.en");
}

TEST(MessagesTest, SpeechConfigPayload_NullCheckpoint_Roundtrip) {
    SpeechConfigPayload orig;
    // resume_checkpoint is nullopt by default

    json j = orig;
    // Serialisation writes null for nullopt
    EXPECT_TRUE(j["resume_checkpoint"].is_null());

    auto rt = j.get<SpeechConfigPayload>();
    EXPECT_FALSE(rt.resume_checkpoint.has_value());
}

TEST(MessagesTest, HypothesisPayload_JsonRoundtrip) {
    HypothesisPayload orig{1500, 300, "testing one two"};
    json j = orig;
    auto rt = j.get<HypothesisPayload>();

    EXPECT_EQ(rt.offset, 1500);
    EXPECT_EQ(rt.duration, 300);
    EXPECT_EQ(rt.text, "testing one two");
}

TEST(MessagesTest, PhrasePayload_JsonRoundtrip) {
    PhrasePayload orig{2000, 500, "final text", 0.95f, "Success"};
    json j = orig;
    auto rt = j.get<PhrasePayload>();

    EXPECT_EQ(rt.offset, 2000);
    EXPECT_EQ(rt.duration, 500);
    EXPECT_EQ(rt.text, "final text");
    EXPECT_FLOAT_EQ(rt.confidence, 0.95f);
    EXPECT_EQ(rt.status, "Success");
}

TEST(MessagesTest, CheckpointData_JsonRoundtrip) {
    CheckpointData orig;
    orig.session_id = "abc-123";
    orig.last_audio_ms = 9999;
    orig.last_text_offset = 42;
    orig.full_transcript = "all the words";
    orig.buffer_config = {15000, 1500};
    orig.backend_model_id = "whisper-medium";

    json j = orig;
    auto rt = j.get<CheckpointData>();

    EXPECT_EQ(rt.session_id, orig.session_id);
    EXPECT_EQ(rt.last_audio_ms, orig.last_audio_ms);
    EXPECT_EQ(rt.last_text_offset, orig.last_text_offset);
    EXPECT_EQ(rt.full_transcript, orig.full_transcript);
    EXPECT_EQ(rt.buffer_config.window_duration_ms, 15000);
    EXPECT_EQ(rt.buffer_config.overlap_duration_ms, 1500);
    EXPECT_EQ(rt.backend_model_id, orig.backend_model_id);
}

TEST(MessagesTest, ErrorPayload_JsonRoundtrip) {
    ErrorPayload orig{"ERR_42", "something broke"};
    json j = orig;
    auto rt = j.get<ErrorPayload>();

    EXPECT_EQ(rt.code, "ERR_42");
    EXPECT_EQ(rt.message, "something broke");
}

TEST(MessagesTest, BackpressurePayload_JsonRoundtrip) {
    BackpressurePayload orig{"slow_down"};
    json j = orig;
    auto rt = j.get<BackpressurePayload>();

    EXPECT_EQ(rt.action, "slow_down");
}

// ---------- Enum / Parsing ----------

TEST(MessagesTest, MessageType_ToString_AllTypes) {
    EXPECT_EQ(to_string(MessageType::SPEECH_CONFIG),       "speech.config");
    EXPECT_EQ(to_string(MessageType::SPEECH_CONFIG_ACK),   "speech.config.ack");
    EXPECT_EQ(to_string(MessageType::SPEECH_HYPOTHESIS),   "speech.hypothesis");
    EXPECT_EQ(to_string(MessageType::SPEECH_PHRASE),       "speech.phrase");
    EXPECT_EQ(to_string(MessageType::SPEECH_CHECKPOINT),   "speech.checkpoint");
    EXPECT_EQ(to_string(MessageType::SPEECH_BACKPRESSURE), "speech.backpressure");
    EXPECT_EQ(to_string(MessageType::SPEECH_END),          "speech.end");
    EXPECT_EQ(to_string(MessageType::SPEECH_ERROR),        "speech.error");
}

TEST(MessagesTest, ParseMessageType_SpeechConfig) {
    auto result = parse_message_type("speech.config");
    ASSERT_TRUE(result.has_value());
    EXPECT_EQ(*result, MessageType::SPEECH_CONFIG);
}

TEST(MessagesTest, ParseMessageType_SpeechEnd) {
    auto result = parse_message_type("speech.end");
    ASSERT_TRUE(result.has_value());
    EXPECT_EQ(*result, MessageType::SPEECH_END);
}

TEST(MessagesTest, ParseMessageType_ServerTypes_ReturnNullopt) {
    EXPECT_FALSE(parse_message_type("speech.hypothesis").has_value());
    EXPECT_FALSE(parse_message_type("speech.phrase").has_value());
    EXPECT_FALSE(parse_message_type("speech.config.ack").has_value());
    EXPECT_FALSE(parse_message_type("speech.error").has_value());
    EXPECT_FALSE(parse_message_type("speech.backpressure").has_value());
    EXPECT_FALSE(parse_message_type("speech.checkpoint").has_value());
}

TEST(MessagesTest, ParseMessageType_Unknown_ReturnNullopt) {
    EXPECT_FALSE(parse_message_type("HELLO").has_value());
    EXPECT_FALSE(parse_message_type("garbage").has_value());
    EXPECT_FALSE(parse_message_type("").has_value());
}

// ---------- Helper functions ----------

TEST(MessagesTest, MakeMessage_CorrectEnvelope) {
    auto raw = make_message("speech.test", "sid-1", json{{"key", "val"}});
    auto parsed = json::parse(raw);

    EXPECT_EQ(parsed["type"], "speech.test");
    EXPECT_EQ(parsed["session_id"], "sid-1");
    EXPECT_EQ(parsed["payload"]["key"], "val");
}

TEST(MessagesTest, MakeSpeechError_CorrectFormat) {
    auto raw = make_speech_error("sid-2", "BAD_REQ", "invalid input");
    auto parsed = json::parse(raw);

    EXPECT_EQ(parsed["type"], "speech.error");
    EXPECT_EQ(parsed["session_id"], "sid-2");
    EXPECT_EQ(parsed["payload"]["code"], "BAD_REQ");
    EXPECT_EQ(parsed["payload"]["message"], "invalid input");
}

TEST(MessagesTest, MakeSpeechHypothesis_CorrectFormat) {
    HypothesisPayload hp{100, 200, "partial"};
    auto raw = make_speech_hypothesis("sid-3", hp);
    auto parsed = json::parse(raw);

    EXPECT_EQ(parsed["type"], "speech.hypothesis");
    EXPECT_EQ(parsed["session_id"], "sid-3");
    EXPECT_EQ(parsed["payload"]["offset"], 100);
    EXPECT_EQ(parsed["payload"]["duration"], 200);
    EXPECT_EQ(parsed["payload"]["text"], "partial");
}

TEST(MessagesTest, MakeSpeechPhrase_CorrectFormat) {
    PhrasePayload pp{300, 400, "final", 0.99f, "Success"};
    auto raw = make_speech_phrase("sid-4", pp);
    auto parsed = json::parse(raw);

    EXPECT_EQ(parsed["type"], "speech.phrase");
    EXPECT_EQ(parsed["session_id"], "sid-4");
    EXPECT_EQ(parsed["payload"]["offset"], 300);
    EXPECT_EQ(parsed["payload"]["duration"], 400);
    EXPECT_EQ(parsed["payload"]["text"], "final");
    EXPECT_FLOAT_EQ(parsed["payload"]["confidence"].get<float>(), 0.99f);
    EXPECT_EQ(parsed["payload"]["status"], "Success");
}

TEST(MessagesTest, MakeSpeechBackpressure_CorrectFormat) {
    auto msg = make_speech_backpressure("sid", "slow_down");
    auto j = json::parse(msg);
    EXPECT_EQ(j["type"], "speech.backpressure");
    EXPECT_EQ(j["payload"]["action"], "slow_down");
}

TEST(MessagesTest, MakeSpeechCheckpoint_CorrectFormat) {
    CheckpointData cp;
    cp.session_id = "s1";
    cp.last_audio_ms = 5000;
    cp.full_transcript = "hello";
    auto msg = make_speech_checkpoint("s1", cp);
    auto j = json::parse(msg);
    EXPECT_EQ(j["type"], "speech.checkpoint");
    EXPECT_EQ(j["payload"]["last_audio_ms"], 5000);
}

TEST(MessagesTest, MakeSpeechConfigAck_CorrectFormat) {
    SpeechConfigAckPayload ack;
    ack.session_id = "sid-5";
    ack.effective_config.language = "pt";
    auto msg = make_speech_config_ack("sid-5", ack);
    auto j = json::parse(msg);
    EXPECT_EQ(j["type"], "speech.config.ack");
    EXPECT_EQ(j["session_id"], "sid-5");
}
