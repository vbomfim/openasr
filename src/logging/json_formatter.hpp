#pragma once

#include <spdlog/formatter.h>
#include <spdlog/pattern_formatter.h>
#include <nlohmann/json.hpp>
#include <chrono>
#include <string>

namespace wss::logging {

/// Portable gmtime wrapper (gmtime_r on POSIX, gmtime_s on Windows).
inline std::tm safe_gmtime(const std::time_t* time) {
    std::tm result{};
#ifdef _WIN32
    gmtime_s(&result, time);
#else
    gmtime_r(time, &result);
#endif
    return result;
}

/// Custom spdlog formatter that outputs one JSON object per log line.
/// Compatible with Datadog, Loki, CloudWatch, and ELK log parsers.
///
/// Output format:
///   {"timestamp":"2026-03-03T23:33:54.283Z","level":"debug","message":"Binary ingested"}
class JsonFormatter final : public spdlog::formatter {
public:
    void format(const spdlog::details::log_msg& msg,
                spdlog::memory_buf_t& dest) override {
        nlohmann::json j;

        // ISO 8601 timestamp with millisecond precision
        j["timestamp"] = format_timestamp(msg.time);

        // Log level as lowercase string
        j["level"] = spdlog::level::to_string_view(msg.level).data();

        // Message body
        j["message"] = std::string(msg.payload.data(), msg.payload.size());

        auto str = j.dump() + "\n";
        dest.append(str.data(), str.data() + str.size());
    }

    [[nodiscard]] std::unique_ptr<spdlog::formatter> clone() const override {
        return std::make_unique<JsonFormatter>();
    }

private:
    static std::string format_timestamp(spdlog::log_clock::time_point tp) {
        auto epoch = tp.time_since_epoch();
        auto millis = std::chrono::duration_cast<std::chrono::milliseconds>(epoch);
        auto secs = std::chrono::duration_cast<std::chrono::seconds>(millis);
        auto ms = millis - std::chrono::duration_cast<std::chrono::milliseconds>(secs);

        std::time_t tt = std::chrono::system_clock::to_time_t(
            std::chrono::system_clock::time_point(secs));
        std::tm gmt = safe_gmtime(&tt);

        // "2026-03-03T23:33:54.283Z"
        char buf[64];
        std::snprintf(buf, sizeof(buf),
                      "%04d-%02d-%02dT%02d:%02d:%02d.%03dZ",
                      gmt.tm_year + 1900, gmt.tm_mon + 1, gmt.tm_mday,
                      gmt.tm_hour, gmt.tm_min, gmt.tm_sec,
                      static_cast<int>(ms.count()));
        return buf;
    }
};

} // namespace wss::logging
