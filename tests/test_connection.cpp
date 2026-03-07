#include <gtest/gtest.h>
#include "server/connection.hpp"

using wss::server::ConnectionState;
using wss::server::ConnectionData;
using wss::server::to_string;

// T13-1
TEST(Connection, DefaultState_IsConnected) {
    ConnectionData data;
    EXPECT_EQ(data.state, ConnectionState::CONNECTED);
}

// T13-2
TEST(Connection, ToString_AllStates) {
    EXPECT_FALSE(to_string(ConnectionState::CONNECTED).empty());
    EXPECT_FALSE(to_string(ConnectionState::HELLO_RECEIVED).empty());
    EXPECT_FALSE(to_string(ConnectionState::STREAMING).empty());
    EXPECT_FALSE(to_string(ConnectionState::ENDING).empty());
    EXPECT_FALSE(to_string(ConnectionState::CLOSED).empty());
}

// Rate-limiting field tests

TEST(Connection, RateFields_DefaultValues) {
    ConnectionData data;
    EXPECT_EQ(data.messages_this_window, 0u);
    EXPECT_EQ(data.bytes_this_window, 0u);
    EXPECT_FALSE(data.rate_limited);
}

TEST(Connection, RateFields_Increment) {
    ConnectionData data;
    data.messages_this_window += 5;
    data.bytes_this_window += 1024;
    EXPECT_EQ(data.messages_this_window, 5u);
    EXPECT_EQ(data.bytes_this_window, 1024u);
}

TEST(Connection, RateFields_Reset) {
    ConnectionData data;
    data.messages_this_window = 42;
    data.bytes_this_window = 8192;
    data.rate_limited = true;

    data.messages_this_window = 0;
    data.bytes_this_window = 0;
    data.rate_limited = false;

    EXPECT_EQ(data.messages_this_window, 0u);
    EXPECT_EQ(data.bytes_this_window, 0u);
    EXPECT_FALSE(data.rate_limited);
}

TEST(Connection, RateLimited_FlagToggle) {
    ConnectionData data;
    EXPECT_FALSE(data.rate_limited);

    data.rate_limited = true;
    EXPECT_TRUE(data.rate_limited);

    data.rate_limited = false;
    EXPECT_FALSE(data.rate_limited);
}

TEST(Connection, WindowStart_InitializesToNow) {
    auto before = std::chrono::steady_clock::now();
    ConnectionData data;
    auto after = std::chrono::steady_clock::now();

    EXPECT_GE(data.rate_window_start, before);
    EXPECT_LE(data.rate_window_start, after);
}
