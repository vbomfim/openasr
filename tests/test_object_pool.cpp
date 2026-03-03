#include <gtest/gtest.h>
#include "object_pool.hpp"
#include <thread>
#include <vector>
#include <atomic>

using wss::ObjectPool;

TEST(ObjectPoolTest, Construct_CorrectSize) {
    ObjectPool<int> pool(5, [n = 0]() mutable { return n++; });
    EXPECT_EQ(pool.available(), 5U);
}

TEST(ObjectPoolTest, Checkout_ReturnsObject) {
    ObjectPool<int> pool(3, [n = 0]() mutable { return n++; });
    auto obj = pool.try_checkout();
    ASSERT_TRUE(obj.has_value());
}

TEST(ObjectPoolTest, Checkout_DecreasesAvailable) {
    ObjectPool<int> pool(3, [n = 0]() mutable { return n++; });
    EXPECT_EQ(pool.available(), 3U);
    auto obj = pool.try_checkout();
    EXPECT_EQ(pool.available(), 2U);
}

TEST(ObjectPoolTest, Checkout_AllObjects_EmptiesPool) {
    constexpr size_t N = 4;
    ObjectPool<int> pool(N, [n = 0]() mutable { return n++; });
    std::vector<int> checked_out;
    for (size_t i = 0; i < N; ++i) {
        auto obj = pool.try_checkout();
        ASSERT_TRUE(obj.has_value());
        checked_out.push_back(*obj);
    }
    EXPECT_EQ(pool.available(), 0U);
}

TEST(ObjectPoolTest, Checkout_EmptyPool_ReturnsNullopt) {
    ObjectPool<int> pool(1, [n = 0]() mutable { return n++; });
    auto obj1 = pool.try_checkout();
    ASSERT_TRUE(obj1.has_value());
    auto obj2 = pool.try_checkout();
    EXPECT_FALSE(obj2.has_value());
}

TEST(ObjectPoolTest, Checkin_IncreasesAvailable) {
    ObjectPool<int> pool(2, [n = 0]() mutable { return n++; });
    auto obj = pool.try_checkout();
    ASSERT_TRUE(obj.has_value());
    EXPECT_EQ(pool.available(), 1U);
    pool.checkin(*obj);
    EXPECT_EQ(pool.available(), 2U);
}

TEST(ObjectPoolTest, Checkout_Checkin_Roundtrip) {
    constexpr size_t N = 3;
    ObjectPool<int> pool(N, [n = 0]() mutable { return n++; });
    auto obj = pool.try_checkout();
    ASSERT_TRUE(obj.has_value());
    pool.checkin(*obj);
    EXPECT_EQ(pool.available(), N);
}

TEST(ObjectPoolTest, Destructor_CallsDeleter) {
    constexpr size_t N = 4;
    std::vector<int> deleted;
    {
        ObjectPool<int> pool(N, [n = 0]() mutable { return n++; },
                             [&](int& v) { deleted.push_back(v); });
    }
    EXPECT_EQ(deleted.size(), N);
}

TEST(ObjectPoolTest, ThreadSafety_ConcurrentCheckoutCheckin) {
    constexpr size_t pool_size = 10;
    constexpr int iterations = 100;
    constexpr int num_threads = 10;

    ObjectPool<int> pool(pool_size, [n = 0]() mutable { return n++; });

    std::vector<std::thread> threads;
    threads.reserve(num_threads);
    for (int t = 0; t < num_threads; ++t) {
        threads.emplace_back([&pool, iterations]() {
            for (int i = 0; i < iterations; ++i) {
                auto obj = pool.try_checkout();
                if (obj.has_value()) {
                    std::this_thread::sleep_for(std::chrono::microseconds(1));
                    pool.checkin(*obj);
                }
            }
        });
    }
    for (auto& th : threads) {
        th.join();
    }
    EXPECT_EQ(pool.available(), pool_size);
}
