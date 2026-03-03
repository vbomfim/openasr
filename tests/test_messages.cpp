#include <gtest/gtest.h>
#include "protocol/messages.hpp"

TEST(MessagesTest, Placeholder) {
    auto mt = wss::protocol::MessageType::SPEECH_CONFIG;
    EXPECT_EQ(mt, wss::protocol::MessageType::SPEECH_CONFIG);
}
