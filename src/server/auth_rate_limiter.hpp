#pragma once

#include <chrono>
#include <mutex>
#include <string>
#include <unordered_map>

namespace wss::server {

/// Per-IP auth failure tracking for brute-force protection (#20)
struct AuthRateLimiter {
    struct IpState {
        size_t failures = 0;
        std::chrono::steady_clock::time_point window_start =
            std::chrono::steady_clock::now();
    };

    size_t max_failures = 10;  // max failures per window
    std::chrono::seconds window_secs{60};  // sliding window
    size_t max_tracked_ips = 0;  // 0 = unlimited; set >0 to cap memory

    /// Returns true if the IP is rate-limited (too many failures).
    bool check_and_record_failure(const std::string& ip) {
        std::lock_guard lock(mutex_);
        auto now = std::chrono::steady_clock::now();
        auto& state = ip_states_[ip];

        // Reset window if expired
        if (now - state.window_start > window_secs) {
            state.failures = 0;
            state.window_start = now;
        }

        state.failures++;

        // Enforce capacity cap — evict expired entries, then oldest if needed
        if (max_tracked_ips > 0 && ip_states_.size() > max_tracked_ips) {
            evict_to_cap(now);
        }

        return state.failures > max_failures;
    }

    /// Check if an IP is currently blocked without recording a failure.
    bool is_blocked(const std::string& ip) {
        std::lock_guard lock(mutex_);
        auto it = ip_states_.find(ip);
        if (it == ip_states_.end()) return false;

        auto now = std::chrono::steady_clock::now();
        if (now - it->second.window_start > window_secs) {
            ip_states_.erase(it);
            return false;
        }
        return it->second.failures > max_failures;
    }

    /// Periodic cleanup of expired entries (call from a timer).
    void cleanup() {
        std::lock_guard lock(mutex_);
        auto now = std::chrono::steady_clock::now();
        for (auto it = ip_states_.begin(); it != ip_states_.end();) {
            if (now - it->second.window_start > window_secs) {
                it = ip_states_.erase(it);
            } else {
                ++it;
            }
        }
    }

    /// Current number of tracked IPs.
    size_t size() const {
        std::lock_guard lock(mutex_);
        return ip_states_.size();
    }

private:
    mutable std::mutex mutex_;
    std::unordered_map<std::string, IpState> ip_states_;

    /// Evict entries to stay within max_tracked_ips. Remove expired first,
    /// then entries with fewest failures (prefer keeping blocked IPs).
    void evict_to_cap(std::chrono::steady_clock::time_point now) {
        // First pass: remove expired
        for (auto it = ip_states_.begin(); it != ip_states_.end();) {
            if (now - it->second.window_start > window_secs) {
                it = ip_states_.erase(it);
            } else {
                ++it;
            }
        }
        // Second pass: if still over cap, evict entries with fewest failures
        while (ip_states_.size() > max_tracked_ips) {
            auto victim = ip_states_.begin();
            for (auto it = ip_states_.begin(); it != ip_states_.end(); ++it) {
                if (it->second.failures < victim->second.failures) {
                    victim = it;
                }
            }
            ip_states_.erase(victim);
        }
    }
};

}  // namespace wss::server
