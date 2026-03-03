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
