#include <gtest/gtest.h>
#include "transcription/inference_pool.hpp"

#include <atomic>
#include <chrono>
#include <condition_variable>
#include <mutex>

using namespace wss::transcription;
using namespace std::chrono_literals;

namespace {

/// Minimal mock backend for InferencePool tests.
class MockBackend : public ITranscriptionBackend {
public:
    bool initialize(const BackendConfig& /*config*/) override { return true; }

    TranscriptionResult transcribe(
        const wss::SampleFloat* /*samples*/,
        size_t /*sample_count*/,
        int64_t window_start_ms
    ) override {
        calls.fetch_add(1, std::memory_order_relaxed);
        TranscriptionResult result;
        result.is_final = true;
        result.segments.push_back(Segment{window_start_ms, window_start_ms + 1000, "hello", ""});
        return result;
    }

    [[nodiscard]] bool is_ready() const override { return true; }

    std::atomic<int> calls{0};
};

} // namespace

// ---------------------------------------------------------------------------
// 1. Construction and destruction do not crash.
// ---------------------------------------------------------------------------
TEST(InferencePoolTest, ConstructAndDestroy) {
    MockBackend backend;
    { InferencePool pool(backend, /*num_threads=*/2); }
    SUCCEED();
}

// ---------------------------------------------------------------------------
// 2. backend_ready() reflects mock state.
// ---------------------------------------------------------------------------
TEST(InferencePoolTest, BackendReady) {
    MockBackend backend;
    InferencePool pool(backend, /*num_threads=*/1);
    EXPECT_TRUE(pool.backend_ready());
}

// ---------------------------------------------------------------------------
// 3. Submit a job and verify the callback fires with the correct result.
// ---------------------------------------------------------------------------
TEST(InferencePoolTest, SubmitJobCallsBack) {
    MockBackend backend;
    InferencePool pool(backend, /*num_threads=*/2);

    std::mutex mu;
    std::condition_variable cv;
    bool done = false;
    std::string received_session;
    TranscriptionResult received_result;

    InferenceJob job;
    job.session_id = "test-session-1";
    job.audio = std::vector<wss::SampleFloat>(16000, 0.0f); // 1s of silence
    job.window_start_ms = 0;
    job.window_end_ms = 1000;
    job.on_complete = [&](const std::string& sid, TranscriptionResult result,
                          int64_t /*ws*/, int64_t /*we*/) {
        std::lock_guard lk(mu);
        received_session = sid;
        received_result = std::move(result);
        done = true;
        cv.notify_one();
    };

    pool.submit(std::move(job));

    {
        std::unique_lock lk(mu);
        ASSERT_TRUE(cv.wait_for(lk, 5s, [&] { return done; }))
            << "Callback was not invoked within 5 seconds";
    }

    EXPECT_EQ(received_session, "test-session-1");
    ASSERT_EQ(received_result.segments.size(), 1u);
    EXPECT_EQ(received_result.segments[0].text, "hello");
    EXPECT_TRUE(received_result.is_final);
    EXPECT_EQ(backend.calls.load(), 1);
}

// ---------------------------------------------------------------------------
// 4. pending() and drain_complete() report correct state.
// ---------------------------------------------------------------------------
TEST(InferencePoolTest, PendingAndDrainComplete) {
    MockBackend backend;
    InferencePool pool(backend, /*num_threads=*/1);

    // Initially the queue is empty and no jobs are active.
    EXPECT_EQ(pool.pending(), 0u);

    // After submitting and draining, drain_complete should eventually be true.
    std::mutex mu;
    std::condition_variable cv;
    bool done = false;

    InferenceJob job;
    job.session_id = "drain-test";
    job.audio = std::vector<wss::SampleFloat>(160, 0.0f);
    job.on_complete = [&](const std::string&, TranscriptionResult, int64_t, int64_t) {
        std::lock_guard lk(mu);
        done = true;
        cv.notify_one();
    };

    pool.submit(std::move(job));

    {
        std::unique_lock lk(mu);
        cv.wait_for(lk, 5s, [&] { return done; });
    }

    // Give the pool a moment to decrement active_jobs_
    std::this_thread::sleep_for(50ms);
    EXPECT_TRUE(pool.drain_complete());
}
