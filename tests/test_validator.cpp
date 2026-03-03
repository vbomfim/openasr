#include <gtest/gtest.h>
#include "protocol/validator.hpp"

TEST(ValidatorTest, Placeholder) {
    auto result = wss::protocol::ValidationResult::ok();
    EXPECT_TRUE(result.valid);
}
