#include <gtest/gtest.h>
#include "server/session_id.hpp"

#include <set>
#include <thread>
#include <vector>
#include <mutex>
#include <algorithm>

// ---------------------------------------------------------------------------
// 1. Session ID must be 32 hex characters (128-bit / 16 bytes).
// ---------------------------------------------------------------------------
TEST(GenerateSessionIdTest, Format_32HexChars) {
    auto id = wss::server::generate_session_id();
    EXPECT_EQ(id.length(), 32u);
    for (char c : id) {
        EXPECT_TRUE(std::isxdigit(static_cast<unsigned char>(c)))
            << "Character '" << c << "' is not a hex digit";
    }
}

// ---------------------------------------------------------------------------
// 2. Two generated IDs must never collide (statistical uniqueness).
// ---------------------------------------------------------------------------
TEST(GenerateSessionIdTest, Uniqueness_1000Ids) {
    std::set<std::string> ids;
    for (int i = 0; i < 1000; ++i) {
        ids.insert(wss::server::generate_session_id());
    }
    EXPECT_EQ(ids.size(), 1000u) << "Collisions detected among 1000 session IDs";
}

// ---------------------------------------------------------------------------
// 3. Entropy: each byte position should show variation across many IDs.
//    This catches seeding bugs where output is deterministic.
// ---------------------------------------------------------------------------
TEST(GenerateSessionIdTest, Entropy_ByteVariation) {
    constexpr int N = 200;
    std::vector<std::string> ids;
    ids.reserve(N);
    for (int i = 0; i < N; ++i) {
        ids.push_back(wss::server::generate_session_id());
    }

    // For each hex-pair position (0..15), collect distinct values
    for (int pos = 0; pos < 16; ++pos) {
        std::set<std::string> values;
        for (const auto& id : ids) {
            values.insert(id.substr(pos * 2, 2));
        }
        // With 200 samples of a uniform byte, we expect >100 distinct values.
        // Use a conservative lower bound of 50 to avoid flakiness.
        EXPECT_GT(values.size(), 50u)
            << "Byte position " << pos << " lacks variation (only "
            << values.size() << " distinct values in " << N << " samples)";
    }
}

// ---------------------------------------------------------------------------
// 4. Thread-safety: concurrent generation must not crash or collide.
// ---------------------------------------------------------------------------
TEST(GenerateSessionIdTest, ConcurrentGeneration) {
    constexpr int kThreads = 8;
    constexpr int kPerThread = 100;
    std::mutex mtx;
    std::set<std::string> all_ids;

    auto worker = [&]() {
        std::vector<std::string> local;
        local.reserve(kPerThread);
        for (int i = 0; i < kPerThread; ++i) {
            local.push_back(wss::server::generate_session_id());
        }
        std::lock_guard lock(mtx);
        for (auto& id : local) {
            all_ids.insert(std::move(id));
        }
    };

    std::vector<std::thread> threads;
    threads.reserve(kThreads);
    for (int i = 0; i < kThreads; ++i) {
        threads.emplace_back(worker);
    }
    for (auto& t : threads) {
        t.join();
    }

    EXPECT_EQ(all_ids.size(), static_cast<size_t>(kThreads * kPerThread))
        << "Collisions detected in concurrent generation";
}
