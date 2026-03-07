#include <gtest/gtest.h>
#include "server/constant_time.hpp"

using wss::server::constant_time_equals;

TEST(ConstantTimeEqualsTest, EqualStrings) {
    EXPECT_TRUE(constant_time_equals("secret-key-123", "secret-key-123"));
}

TEST(ConstantTimeEqualsTest, DifferentStrings) {
    EXPECT_FALSE(constant_time_equals("secret-key-123", "secret-key-456"));
}

TEST(ConstantTimeEqualsTest, DifferentLengths) {
    EXPECT_FALSE(constant_time_equals("short", "longer-string"));
}

TEST(ConstantTimeEqualsTest, EmptyStrings) {
    EXPECT_TRUE(constant_time_equals("", ""));
}

TEST(ConstantTimeEqualsTest, OneEmpty) {
    EXPECT_FALSE(constant_time_equals("", "notempty"));
    EXPECT_FALSE(constant_time_equals("notempty", ""));
}

TEST(ConstantTimeEqualsTest, SingleCharDifference) {
    EXPECT_FALSE(constant_time_equals("abcX", "abcY"));
}

TEST(ConstantTimeEqualsTest, FirstCharDifference) {
    EXPECT_FALSE(constant_time_equals("Xbcd", "Ybcd"));
}
