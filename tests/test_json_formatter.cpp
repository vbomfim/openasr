#include <gtest/gtest.h>
#include "logging/json_formatter.hpp"
#include <spdlog/spdlog.h>
#include <spdlog/sinks/ostream_sink.h>
#include <nlohmann/json.hpp>
#include <sstream>

using wss::logging::JsonFormatter;

// Helper: create a logger that writes to the given stream with JSON formatter.
static std::shared_ptr<spdlog::logger> make_json_logger(std::ostringstream& oss) {
    auto sink = std::make_shared<spdlog::sinks::ostream_sink_mt>(oss);
    auto logger = std::make_shared<spdlog::logger>("test_json", sink);
    logger->set_formatter(std::make_unique<JsonFormatter>());
    logger->set_level(spdlog::level::trace);
    return logger;
}

// T-JSON-1: JSON log line is valid JSON
TEST(JsonFormatter, OutputIsValidJson) {
    std::ostringstream oss;
    auto logger = make_json_logger(oss);

    logger->info("Hello world");
    logger->flush();

    auto j = nlohmann::json::parse(oss.str());
    EXPECT_TRUE(j.is_object());
}

// T-JSON-2: Required fields present
TEST(JsonFormatter, ContainsRequiredFields) {
    std::ostringstream oss;
    auto logger = make_json_logger(oss);

    logger->info("Test message");
    logger->flush();

    auto j = nlohmann::json::parse(oss.str());
    EXPECT_TRUE(j.contains("timestamp"));
    EXPECT_TRUE(j.contains("level"));
    EXPECT_TRUE(j.contains("message"));
}

// T-JSON-3: Level field matches log level
TEST(JsonFormatter, LevelFieldMatchesLogLevel) {
    std::ostringstream oss;
    auto logger = make_json_logger(oss);

    logger->debug("debug msg");
    logger->flush();

    auto j = nlohmann::json::parse(oss.str());
    EXPECT_EQ(j["level"], "debug");
}

// T-JSON-4: Message field matches log message
TEST(JsonFormatter, MessageFieldMatchesInput) {
    std::ostringstream oss;
    auto logger = make_json_logger(oss);

    logger->warn("something went wrong");
    logger->flush();

    auto j = nlohmann::json::parse(oss.str());
    EXPECT_EQ(j["message"], "something went wrong");
}

// T-JSON-5: Timestamp is ISO 8601 format
TEST(JsonFormatter, TimestampIsISO8601) {
    std::ostringstream oss;
    auto logger = make_json_logger(oss);

    logger->info("timestamp test");
    logger->flush();

    auto j = nlohmann::json::parse(oss.str());
    std::string ts = j["timestamp"];
    // Should match pattern: YYYY-MM-DDTHH:MM:SS.mmmZ
    EXPECT_EQ(ts.size(), 24u);
    EXPECT_EQ(ts[4], '-');
    EXPECT_EQ(ts[7], '-');
    EXPECT_EQ(ts[10], 'T');
    EXPECT_EQ(ts[13], ':');
    EXPECT_EQ(ts[16], ':');
    EXPECT_EQ(ts[19], '.');
    EXPECT_EQ(ts[23], 'Z');
}

// T-JSON-6: Each log call produces exactly one JSON line
TEST(JsonFormatter, OneJsonPerLine) {
    std::ostringstream oss;
    auto logger = make_json_logger(oss);

    logger->info("line one");
    logger->warn("line two");
    logger->error("line three");
    logger->flush();

    std::string output = oss.str();
    std::istringstream iss(output);
    std::string line;
    int count = 0;
    while (std::getline(iss, line)) {
        if (line.empty()) continue;
        auto j = nlohmann::json::parse(line);
        EXPECT_TRUE(j.is_object());
        count++;
    }
    EXPECT_EQ(count, 3);
}

// T-JSON-7: All log levels produce valid JSON
TEST(JsonFormatter, AllLogLevels) {
    std::ostringstream oss;
    auto logger = make_json_logger(oss);

    logger->trace("trace");
    logger->debug("debug");
    logger->info("info");
    logger->warn("warn");
    logger->error("error");
    logger->critical("critical");
    logger->flush();

    std::istringstream iss(oss.str());
    std::string line;
    std::vector<std::string> levels;
    while (std::getline(iss, line)) {
        if (line.empty()) continue;
        auto j = nlohmann::json::parse(line);
        levels.push_back(j["level"]);
    }
    ASSERT_EQ(levels.size(), 6u);
    EXPECT_EQ(levels[0], "trace");
    EXPECT_EQ(levels[1], "debug");
    EXPECT_EQ(levels[2], "info");
    EXPECT_EQ(levels[3], "warning");
    EXPECT_EQ(levels[4], "error");
    EXPECT_EQ(levels[5], "critical");
}

// T-JSON-8: Clone produces equivalent formatter
TEST(JsonFormatter, CloneProducesValidJson) {
    JsonFormatter original;
    auto cloned = original.clone();

    spdlog::details::log_msg msg(spdlog::source_loc{}, "test", spdlog::level::info, "clone test");
    spdlog::memory_buf_t buf;
    cloned->format(msg, buf);

    std::string output(buf.data(), buf.size());
    auto j = nlohmann::json::parse(output);
    EXPECT_EQ(j["message"], "clone test");
    EXPECT_EQ(j["level"], "info");
}

// T-JSON-9: Special characters in message are properly escaped
TEST(JsonFormatter, SpecialCharactersEscaped) {
    std::ostringstream oss;
    auto logger = make_json_logger(oss);

    logger->info("quote: \" backslash: \\ newline: \n tab: \t");
    logger->flush();

    // Should parse without error — nlohmann::json handles escaping
    auto j = nlohmann::json::parse(oss.str());
    EXPECT_TRUE(j["message"].get<std::string>().find('"') != std::string::npos);
}

// T-JSON-10: Formatted messages with spdlog placeholders produce valid JSON
TEST(JsonFormatter, FormattedMessageProducesValidJson) {
    std::ostringstream oss;
    auto logger = make_json_logger(oss);

    logger->info("Binary ingested: session={} bytes={} written={}", "94a0d5", 6400, 3200);
    logger->flush();

    auto j = nlohmann::json::parse(oss.str());
    std::string msg = j["message"];
    EXPECT_TRUE(msg.find("94a0d5") != std::string::npos);
    EXPECT_TRUE(msg.find("6400") != std::string::npos);
    EXPECT_TRUE(msg.find("3200") != std::string::npos);
}
