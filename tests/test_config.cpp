#include <gtest/gtest.h>
#include "config/config.hpp"

using wss::config::ServerConfig;
using wss::config::safe_atoi;

// Helper: create a valid config (model_path set)
static ServerConfig make_valid_config() {
    ServerConfig cfg;
    cfg.model_path = "/tmp/model.bin";
    return cfg;
}

// T12-1
TEST(ServerConfig, DefaultValues_Correct) {
    ServerConfig cfg;
    EXPECT_EQ(cfg.port, 9090);
    EXPECT_EQ(cfg.max_sessions, 20u);
    EXPECT_EQ(cfg.host, "0.0.0.0");
    EXPECT_EQ(cfg.window_duration_ms, 20000);
    EXPECT_EQ(cfg.overlap_duration_ms, 2000);
    EXPECT_EQ(cfg.inference_threads, 4);
}

// T12-2
TEST(ServerConfig, Validate_ValidConfig_ReturnsEmpty) {
    auto cfg = make_valid_config();
    EXPECT_TRUE(cfg.validate().empty());
}

// T12-3
TEST(ServerConfig, Validate_EmptyModelPath_Fails) {
    ServerConfig cfg;
    cfg.model_path = "";
    EXPECT_FALSE(cfg.validate().empty());
}

// T12-4
TEST(ServerConfig, Validate_InvalidPort_Zero_Fails) {
    auto cfg = make_valid_config();
    cfg.port = 0;
    EXPECT_FALSE(cfg.validate().empty());
}

// T12-5
TEST(ServerConfig, Validate_InvalidPort_TooHigh_Fails) {
    auto cfg = make_valid_config();
    cfg.port = 99999;
    EXPECT_FALSE(cfg.validate().empty());
}

// T12-6
TEST(ServerConfig, Validate_ZeroSessions_Fails) {
    auto cfg = make_valid_config();
    cfg.max_sessions = 0;
    EXPECT_FALSE(cfg.validate().empty());
}

// T12-7
TEST(ServerConfig, Validate_OverlapExceedsWindow_Fails) {
    auto cfg = make_valid_config();
    cfg.overlap_duration_ms = cfg.window_duration_ms; // overlap must be < window
    EXPECT_FALSE(cfg.validate().empty());
}

// T12-8
TEST(ServerConfig, Validate_ZeroInferenceThreads_Fails) {
    auto cfg = make_valid_config();
    cfg.inference_threads = 0;
    EXPECT_FALSE(cfg.validate().empty());
}

// T12-9
TEST(ServerConfig, Validate_ValidEdgeCase_Passes) {
    ServerConfig cfg;
    cfg.model_path = "/m";
    cfg.port = 1;
    cfg.max_sessions = 1;
    cfg.window_duration_ms = 1000;
    cfg.overlap_duration_ms = 0;
    cfg.inference_threads = 1;
    EXPECT_TRUE(cfg.validate().empty());
}

// T12-10
TEST(ServerConfig, SafeAtoi_Tests) {
    EXPECT_EQ(safe_atoi("42"), 42);
    EXPECT_EQ(safe_atoi("abc", 7), 7);
    EXPECT_EQ(safe_atoi("", 99), 99);
}
