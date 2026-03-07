#include <gtest/gtest.h>
#include "server/auth_rate_limiter.hpp"

// ---------------------------------------------------------------------------
// 1. Limiter should expose its current entry count.
// ---------------------------------------------------------------------------
TEST(AuthRateLimiterCapacityTest, Size_TracksEntries) {
    wss::server::AuthRateLimiter limiter;
    EXPECT_EQ(limiter.size(), 0u);

    limiter.check_and_record_failure("10.0.0.1");
    EXPECT_EQ(limiter.size(), 1u);

    limiter.check_and_record_failure("10.0.0.2");
    EXPECT_EQ(limiter.size(), 2u);

    // Same IP doesn't create a new entry
    limiter.check_and_record_failure("10.0.0.1");
    EXPECT_EQ(limiter.size(), 2u);
}

// ---------------------------------------------------------------------------
// 2. When max_tracked_ips is set, the map must not grow beyond it.
// ---------------------------------------------------------------------------
TEST(AuthRateLimiterCapacityTest, MaxSize_CapsEntries) {
    wss::server::AuthRateLimiter limiter;
    limiter.max_tracked_ips = 100;

    // Insert 200 distinct IPs
    for (int i = 0; i < 200; ++i) {
        limiter.check_and_record_failure("10.0." +
            std::to_string(i / 256) + "." + std::to_string(i % 256));
    }

    EXPECT_LE(limiter.size(), 100u)
        << "Rate limiter map exceeded max_tracked_ips cap";
}

// ---------------------------------------------------------------------------
// 3. Existing tracked IPs still work after cap is hit.
// ---------------------------------------------------------------------------
TEST(AuthRateLimiterCapacityTest, CappedLimiter_ExistingIpsStillTracked) {
    wss::server::AuthRateLimiter limiter;
    limiter.max_tracked_ips = 10;

    // Fill with 10 IPs
    for (int i = 0; i < 10; ++i) {
        limiter.check_and_record_failure("10.0.0." + std::to_string(i));
    }
    EXPECT_EQ(limiter.size(), 10u);

    // Block one IP fully
    for (int i = 0; i < 11; ++i) {
        limiter.check_and_record_failure("10.0.0.0");
    }
    EXPECT_TRUE(limiter.is_blocked("10.0.0.0"));

    // Add more IPs beyond cap
    for (int i = 10; i < 20; ++i) {
        limiter.check_and_record_failure("10.0.0." + std::to_string(i));
    }

    // Original blocked IP must still be tracked
    EXPECT_TRUE(limiter.is_blocked("10.0.0.0"));
}

// ---------------------------------------------------------------------------
// 4. Default max_tracked_ips = 0 means unlimited (backward compat).
// ---------------------------------------------------------------------------
TEST(AuthRateLimiterCapacityTest, DefaultMaxSize_Unlimited) {
    wss::server::AuthRateLimiter limiter;
    EXPECT_EQ(limiter.max_tracked_ips, 0u);

    // Insert many IPs — all should be tracked
    for (int i = 0; i < 500; ++i) {
        limiter.check_and_record_failure("10.0." +
            std::to_string(i / 256) + "." + std::to_string(i % 256));
    }
    EXPECT_EQ(limiter.size(), 500u);
}
