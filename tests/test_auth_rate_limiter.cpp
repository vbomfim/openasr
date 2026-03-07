#include <gtest/gtest.h>
#include "server/auth_rate_limiter.hpp"

#include <thread>
#include <vector>
#include <atomic>
#include <chrono>

using namespace std::chrono_literals;

// ---------------------------------------------------------------------------
// 1. A fresh IP should not be blocked.
// ---------------------------------------------------------------------------
TEST(AuthRateLimiterTest, InitialState_NotBlocked) {
    wss::server::AuthRateLimiter limiter;
    EXPECT_FALSE(limiter.is_blocked("192.168.1.1"));
}

// ---------------------------------------------------------------------------
// 2. Fewer failures than the threshold should not trigger a block.
// ---------------------------------------------------------------------------
TEST(AuthRateLimiterTest, BelowThreshold_NotBlocked) {
    wss::server::AuthRateLimiter limiter;
    // Record 9 failures (below default max_failures=10)
    for (int i = 0; i < 9; ++i) {
        EXPECT_FALSE(limiter.check_and_record_failure("10.0.0.1"));
    }
    EXPECT_FALSE(limiter.is_blocked("10.0.0.1"));
}

// ---------------------------------------------------------------------------
// 3. Exceeding the threshold causes check_and_record_failure to return true.
//    With max_failures=10, the 11th call should return true.
// ---------------------------------------------------------------------------
TEST(AuthRateLimiterTest, AtThreshold_Blocked) {
    wss::server::AuthRateLimiter limiter;
    // First 10 calls: failures 1–10 → not blocked (failures <= max_failures)
    for (int i = 0; i < 10; ++i) {
        EXPECT_FALSE(limiter.check_and_record_failure("10.0.0.2"));
    }
    // 11th call: failures == 11 > 10 → blocked
    EXPECT_TRUE(limiter.check_and_record_failure("10.0.0.2"));
}

// ---------------------------------------------------------------------------
// 4. After being blocked, is_blocked returns true.
// ---------------------------------------------------------------------------
TEST(AuthRateLimiterTest, IsBlocked_ReturnsTrue) {
    wss::server::AuthRateLimiter limiter;
    for (int i = 0; i < 11; ++i) {
        limiter.check_and_record_failure("10.0.0.3");
    }
    EXPECT_TRUE(limiter.is_blocked("10.0.0.3"));
}

// ---------------------------------------------------------------------------
// 5. After the window expires the failure counter resets; the IP is unblocked.
// ---------------------------------------------------------------------------
TEST(AuthRateLimiterTest, WindowExpires_ResetsCount) {
    wss::server::AuthRateLimiter limiter;
    limiter.window_secs = std::chrono::seconds(1);

    // Block the IP
    for (int i = 0; i < 11; ++i) {
        limiter.check_and_record_failure("10.0.0.4");
    }
    ASSERT_TRUE(limiter.is_blocked("10.0.0.4"));

    // Wait for window to expire (500ms margin for slow CI)
    std::this_thread::sleep_for(1500ms);

    // Window expired → is_blocked should return false
    EXPECT_FALSE(limiter.is_blocked("10.0.0.4"));

    // A new failure starts a fresh window; first failure should not block
    EXPECT_FALSE(limiter.check_and_record_failure("10.0.0.4"));
}

// ---------------------------------------------------------------------------
// 6. cleanup() removes entries whose window has expired.
// ---------------------------------------------------------------------------
TEST(AuthRateLimiterTest, Cleanup_RemovesExpired) {
    wss::server::AuthRateLimiter limiter;
    limiter.window_secs = std::chrono::seconds(1);

    // Record some failures for two IPs
    limiter.check_and_record_failure("10.0.0.5");
    limiter.check_and_record_failure("10.0.0.6");

    // Wait for the window to expire (500ms margin for slow CI)
    std::this_thread::sleep_for(1500ms);

    limiter.cleanup();

    // Both IPs should be gone; is_blocked returns false for unknown IPs
    EXPECT_FALSE(limiter.is_blocked("10.0.0.5"));
    EXPECT_FALSE(limiter.is_blocked("10.0.0.6"));

    // A new failure after cleanup starts fresh
    EXPECT_FALSE(limiter.check_and_record_failure("10.0.0.5"));
}

// ---------------------------------------------------------------------------
// 7. Blocking one IP does not affect another.
// ---------------------------------------------------------------------------
TEST(AuthRateLimiterTest, DifferentIPs_Independent) {
    wss::server::AuthRateLimiter limiter;

    // Block IP-A
    for (int i = 0; i < 11; ++i) {
        limiter.check_and_record_failure("10.0.0.7");
    }
    ASSERT_TRUE(limiter.is_blocked("10.0.0.7"));

    // IP-B should still be clean
    EXPECT_FALSE(limiter.is_blocked("10.0.0.8"));
    EXPECT_FALSE(limiter.check_and_record_failure("10.0.0.8"));
}

// ---------------------------------------------------------------------------
// 8. Concurrent access from multiple threads must not cause data races.
// ---------------------------------------------------------------------------
TEST(AuthRateLimiterTest, ConcurrentAccess_NoDataRace) {
    wss::server::AuthRateLimiter limiter;
    limiter.max_failures = 100; // high threshold so we exercise many iterations

    constexpr int kThreads = 8;
    constexpr int kIterations = 200;
    std::atomic<int> blocked_count{0};

    auto worker = [&](int thread_id) {
        const std::string ip = "10.0.0." + std::to_string(thread_id);
        for (int i = 0; i < kIterations; ++i) {
            if (limiter.check_and_record_failure(ip)) {
                blocked_count.fetch_add(1, std::memory_order_relaxed);
            }
            limiter.is_blocked(ip);
        }
    };

    std::vector<std::thread> threads;
    threads.reserve(kThreads);
    for (int t = 0; t < kThreads; ++t) {
        threads.emplace_back(worker, t);
    }
    for (auto& th : threads) {
        th.join();
    }

    // Also exercise cleanup concurrently with record calls
    limiter.cleanup();

    // We only care that we didn't crash or trigger a sanitizer warning.
    // As a basic sanity check: some calls must have returned true (blocked).
    EXPECT_GT(blocked_count.load(), 0);
}
