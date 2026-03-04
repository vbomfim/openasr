#include <gtest/gtest.h>
#include "common.hpp"
#include "transcription/inference_pool.hpp"
#include "session/session_manager.hpp"
#include <atomic>
#include <chrono>
#include <thread>

using wss::transcription::InferencePool;
using wss::transcription::InferenceJob;
using wss::transcription::ITranscriptionBackend;
using wss::transcription::TranscriptionResult;
using wss::transcription::BackendConfig;
using wss::transcription::Segment;
using wss::session::SessionManager;
using wss::session::Session;

// --- Mock Backend ---

class MockBackend : public ITranscriptionBackend {
public:
    bool initialize(const BackendConfig& /*config*/) override {
        ready_ = true;
        return true;
    }

    TranscriptionResult transcribe(const wss::SampleFloat* /*samples*/,
                                   size_t /*sample_count*/,
                                   int64_t window_start_ms) override {
        // Simulate inference latency
        std::this_thread::sleep_for(std::chrono::milliseconds(delay_ms_));
        transcribe_calls_.fetch_add(1, std::memory_order_relaxed);
        TranscriptionResult result;
        Segment seg;
        seg.start_ms = window_start_ms;
        seg.end_ms = window_start_ms + 5000;
        seg.text = "test transcription";
        result.segments.push_back(std::move(seg));
        result.is_final = true;
        return result;
    }

    [[nodiscard]] bool is_ready() const override { return ready_; }

    void set_delay(int ms) { delay_ms_ = ms; }
    int transcribe_count() const { return transcribe_calls_.load(); }

private:
    bool ready_ = false;
    int delay_ms_ = 50;
    std::atomic<int> transcribe_calls_{0};
};

static Session::Config make_session_config(const std::string& id) {
    return {.session_id = id, .language = "en", .sample_rate = 16000,
            .encoding = "pcm_s16le", .window_duration_ms = 5000,
            .overlap_duration_ms = 500, .backend_model_id = "test",
            .ring_buffer_seconds = 1.0f};
}

// --- InferencePool in_flight tracking ---

TEST(InferencePoolDrain, InFlight_InitiallyZero) {
    MockBackend backend;
    backend.initialize({});
    InferencePool pool(backend, 2);

    EXPECT_EQ(pool.in_flight(), 0u);

    pool.shutdown();
}

TEST(InferencePoolDrain, InFlight_TracksActiveJobs) {
    MockBackend backend;
    backend.initialize({});
    backend.set_delay(200);
    InferencePool pool(backend, 1);

    std::atomic<bool> completed{false};
    InferenceJob job;
    job.session_id = "test-session";
    job.audio.resize(16000, 0.0f);
    job.window_start_ms = 0;
    job.window_end_ms = 1000;
    job.on_complete = [&completed](const std::string&, TranscriptionResult, int64_t, int64_t) {
        completed.store(true, std::memory_order_release);
    };
    pool.submit(std::move(job));

    // Give the worker thread time to pick up the job
    std::this_thread::sleep_for(std::chrono::milliseconds(50));
    EXPECT_EQ(pool.in_flight(), 1u);

    // Wait for completion
    while (!completed.load(std::memory_order_acquire)) {
        std::this_thread::sleep_for(std::chrono::milliseconds(10));
    }
    // Small delay for in_flight decrement
    std::this_thread::sleep_for(std::chrono::milliseconds(10));
    EXPECT_EQ(pool.in_flight(), 0u);

    pool.shutdown();
}

TEST(InferencePoolDrain, DrainComplete_WhenEmpty) {
    MockBackend backend;
    backend.initialize({});
    InferencePool pool(backend, 2);

    EXPECT_TRUE(pool.drain_complete());

    pool.shutdown();
}

TEST(InferencePoolDrain, DrainComplete_FalseWhileJobsPending) {
    MockBackend backend;
    backend.initialize({});
    backend.set_delay(200);
    InferencePool pool(backend, 1);

    std::atomic<bool> completed{false};
    InferenceJob job;
    job.session_id = "test-drain";
    job.audio.resize(16000, 0.0f);
    job.on_complete = [&completed](const std::string&, TranscriptionResult, int64_t, int64_t) {
        completed.store(true, std::memory_order_release);
    };
    pool.submit(std::move(job));

    // Should not be drained while job is running
    std::this_thread::sleep_for(std::chrono::milliseconds(50));
    EXPECT_FALSE(pool.drain_complete());

    // Wait for completion
    while (!completed.load(std::memory_order_acquire)) {
        std::this_thread::sleep_for(std::chrono::milliseconds(10));
    }
    std::this_thread::sleep_for(std::chrono::milliseconds(10));
    EXPECT_TRUE(pool.drain_complete());

    pool.shutdown();
}

TEST(InferencePoolDrain, DrainComplete_WaitsForAllJobs) {
    MockBackend backend;
    backend.initialize({});
    backend.set_delay(100);
    InferencePool pool(backend, 2);

    std::atomic<int> completed_count{0};
    for (int i = 0; i < 4; ++i) {
        InferenceJob job;
        job.session_id = "drain-" + std::to_string(i);
        job.audio.resize(16000, 0.0f);
        job.on_complete = [&completed_count](const std::string&, TranscriptionResult, int64_t, int64_t) {
            completed_count.fetch_add(1, std::memory_order_relaxed);
        };
        pool.submit(std::move(job));
    }

    // Wait until all are done
    while (completed_count.load() < 4) {
        std::this_thread::sleep_for(std::chrono::milliseconds(10));
    }
    std::this_thread::sleep_for(std::chrono::milliseconds(10));
    EXPECT_TRUE(pool.drain_complete());
    EXPECT_EQ(backend.transcribe_count(), 4);

    pool.shutdown();
}

// --- SessionManager active_session_ids ---

TEST(SessionManagerDrain, ActiveSessionIds_Empty) {
    SessionManager mgr(10);
    auto ids = mgr.active_session_ids();
    EXPECT_TRUE(ids.empty());
}

TEST(SessionManagerDrain, ActiveSessionIds_ReturnsSessions) {
    SessionManager mgr(10);
    mgr.create_session(make_session_config("s1"));
    mgr.create_session(make_session_config("s2"));
    mgr.create_session(make_session_config("s3"));

    auto ids = mgr.active_session_ids();
    EXPECT_EQ(ids.size(), 3u);

    // Check all expected IDs are present
    std::sort(ids.begin(), ids.end());
    EXPECT_NE(std::find(ids.begin(), ids.end(), "s1"), ids.end());
    EXPECT_NE(std::find(ids.begin(), ids.end(), "s2"), ids.end());
    EXPECT_NE(std::find(ids.begin(), ids.end(), "s3"), ids.end());
}

TEST(SessionManagerDrain, ActiveSessionIds_ExcludesDestroyed) {
    SessionManager mgr(10);
    mgr.create_session(make_session_config("s1"));
    mgr.create_session(make_session_config("s2"));
    mgr.destroy_session("s1");

    auto ids = mgr.active_session_ids();
    EXPECT_EQ(ids.size(), 1u);
    EXPECT_EQ(ids[0], "s2");
}

// --- InferencePool callback delivery after drain ---

TEST(InferencePoolDrain, CallbacksDeliveredDuringDrain) {
    MockBackend backend;
    backend.initialize({});
    backend.set_delay(50);
    InferencePool pool(backend, 2);

    std::atomic<int> delivered{0};
    std::vector<std::string> results;
    std::mutex results_mutex;

    for (int i = 0; i < 3; ++i) {
        InferenceJob job;
        job.session_id = "cb-" + std::to_string(i);
        job.audio.resize(16000, 0.0f);
        job.window_start_ms = static_cast<int64_t>(i) * 5000;
        job.window_end_ms = static_cast<int64_t>(i + 1) * 5000;
        job.on_complete = [&delivered, &results, &results_mutex](
                const std::string& sid, TranscriptionResult result,
                int64_t /*start_ms*/, int64_t /*end_ms*/) {
            {
                std::lock_guard lock(results_mutex);
                if (!result.segments.empty()) {
                    results.push_back(sid + ":" + result.segments[0].text);
                }
            }
            delivered.fetch_add(1, std::memory_order_relaxed);
        };
        pool.submit(std::move(job));
    }

    // Wait for all to complete
    while (delivered.load() < 3) {
        std::this_thread::sleep_for(std::chrono::milliseconds(10));
    }

    EXPECT_EQ(delivered.load(), 3);
    {
        std::lock_guard lock(results_mutex);
        EXPECT_EQ(results.size(), 3u);
        for (const auto& r : results) {
            EXPECT_NE(r.find("test transcription"), std::string::npos);
        }
    }

    pool.shutdown();
}
