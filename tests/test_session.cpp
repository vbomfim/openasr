#include <gtest/gtest.h>
#include "session/session.hpp"
#include <cstring>
#include <string>
#include <vector>

using wss::session::Session;

static Session::Config make_config() {
    return {.session_id = "test-123", .language = "en", .sample_rate = 16000,
            .encoding = "pcm_s16le", .window_duration_ms = 5000,
            .overlap_duration_ms = 500, .backend_model_id = "test",
            .ring_buffer_seconds = 5.0f};
}

// Generate silent PCM int16 LE bytes (zero-valued samples)
static std::vector<uint8_t> make_silence_pcm(size_t num_samples) {
    return std::vector<uint8_t>(num_samples * 2, 0);
}

// T11-1
TEST(Session, Construct_InitializesComponents) {
    Session s(make_config());
    EXPECT_EQ(s.session_id(), "test-123");
    EXPECT_EQ(s.config().language, "en");
    EXPECT_EQ(s.config().sample_rate, 16000);
}

// T11-2
TEST(Session, IngestAudio_Pcm_AccumulatesInRingBuffer) {
    Session s(make_config());
    auto pcm = make_silence_pcm(1600); // 100ms of silence
    s.ingest_audio(pcm.data(), pcm.size());
    EXPECT_GT(s.ring_buffer_total_written(), 0u);
}

// T11-3
TEST(Session, WindowReady_NotEnoughAudio_False) {
    Session s(make_config());
    auto pcm = make_silence_pcm(800); // 50ms — far short of 5000ms window
    s.ingest_audio(pcm.data(), pcm.size());
    EXPECT_FALSE(s.window_ready());
}

// T11-4
TEST(Session, WindowReady_EnoughAudio_True) {
    Session s(make_config());
    // 5 seconds at 16kHz = 80000 samples
    auto pcm = make_silence_pcm(80000);
    s.ingest_audio(pcm.data(), pcm.size());
    EXPECT_TRUE(s.window_ready());
}

// T11-5
TEST(Session, ExtractWindow_ReturnsNonZero) {
    Session s(make_config());
    auto pcm = make_silence_pcm(80000); // 5s
    s.ingest_audio(pcm.data(), pcm.size());
    ASSERT_TRUE(s.window_ready());
    auto result = s.extract_window();
    EXPECT_GT(result.count, 0u);
    EXPECT_NE(result.samples, nullptr);
}

// T11-6
TEST(Session, AppendTranscript_Grows) {
    Session s(make_config());
    EXPECT_TRUE(s.transcript().empty());
    s.append_transcript("hello");
    EXPECT_EQ(s.transcript(), "hello");
    s.append_transcript("world");
    EXPECT_EQ(s.transcript(), "hello world");
}

// T11-7
TEST(Session, AppendTranscript_MaxLength_Stops) {
    Session s(make_config());
    // Fill transcript to near the limit
    std::string big(Session::kMaxTranscriptLength + 1, 'x');
    s.append_transcript(big);
    size_t size_after_big = s.transcript().size();
    // Try appending more — should be ignored
    s.append_transcript("more");
    EXPECT_EQ(s.transcript().size(), size_after_big);
}

// T11-8
TEST(Session, MakeCheckpoint_HasAllFields) {
    Session s(make_config());
    s.append_transcript("hello");
    s.set_last_audio_ms(1000);
    auto cp = s.make_checkpoint();
    EXPECT_EQ(cp.session_id, "test-123");
    EXPECT_EQ(cp.last_audio_ms, 1000);
    EXPECT_FALSE(cp.full_transcript.empty());
    EXPECT_EQ(cp.backend_model_id, "test");
}

// T11-9
TEST(Session, RestoreFromCheckpoint_RestoresState) {
    Session s(make_config());
    s.append_transcript("hello");
    s.set_last_audio_ms(5000);
    auto cp = s.make_checkpoint();

    // Create a new session and restore
    Session s2(make_config());
    s2.restore_from_checkpoint(cp);
    EXPECT_EQ(s2.transcript(), "hello");
    EXPECT_EQ(s2.last_audio_ms(), 5000);
}

// T11-10
TEST(Session, SetEncoding_Changes) {
    Session s(make_config());
    EXPECT_EQ(s.config().encoding, "pcm_s16le");
    s.set_encoding("opus");
    EXPECT_EQ(s.config().encoding, "opus");
}

// T11-11
TEST(Session, RingBufferFillRatio_Works) {
    Session s(make_config());
    EXPECT_FLOAT_EQ(s.ring_buffer_fill_ratio(), 0.0f);
    auto pcm = make_silence_pcm(1600);
    s.ingest_audio(pcm.data(), pcm.size());
    float ratio = s.ring_buffer_fill_ratio();
    EXPECT_GT(ratio, 0.0f);
    EXPECT_LE(ratio, 1.0f);
}

// T11-12: VAD enabled session constructs successfully
TEST(Session, VadEnabled_Construct) {
    auto cfg = make_config();
    cfg.vad_enabled = true;
    Session s(cfg);
    EXPECT_EQ(s.session_id(), "test-123");
    EXPECT_TRUE(s.config().vad_enabled);
}

// T11-13: VAD disabled session (default)
TEST(Session, VadDisabled_Default) {
    Session s(make_config());
    EXPECT_FALSE(s.config().vad_enabled);
}

// T11-14: Concurrent ingest_audio and window_ready (TSAN regression)
TEST(Session, ConcurrentIngestAndWindowReady) {
    Session s(make_config());
    constexpr int kIterations = 5000;
    auto pcm = make_silence_pcm(160); // 10ms chunk

    std::atomic<bool> stop{false};

    // Writer thread: continuously ingest audio
    std::thread writer([&] {
        for (int i = 0; i < kIterations && !stop.load(); ++i) {
            s.ingest_audio(pcm.data(), pcm.size());
        }
        stop.store(true);
    });

    // Reader thread: continuously poll window_ready
    std::thread reader([&] {
        while (!stop.load()) {
            [[maybe_unused]] bool ready = s.window_ready();
        }
    });

    writer.join();
    reader.join();
    // If we reach here without TSAN errors or crashes, the test passes.
}
