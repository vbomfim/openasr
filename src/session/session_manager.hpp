#pragma once

#include "session/session.hpp"
#include <memory>
#include <mutex>
#include <optional>
#include <string>
#include <unordered_map>
#include <vector>

namespace wss::session {

/// Manages the lifecycle of all active sessions.
/// Thread-safe: may be accessed from I/O and worker threads.
class SessionManager {
public:
    explicit SessionManager(size_t max_sessions = 20)
        : max_sessions_(max_sessions) {}

    /// Create a new session. Returns nullptr if at capacity.
    Session* create_session(Session::Config config) {
        std::lock_guard lock(mutex_);
        if (sessions_.size() >= max_sessions_) {
            return nullptr;
        }
        auto id = config.session_id;
        auto [it, inserted] = sessions_.emplace(
            id, std::make_unique<Session>(std::move(config)));
        if (!inserted) {
            return nullptr; // session ID collision
        }
        return it->second.get();
    }

    /// Look up a session by ID.
    Session* get_session(const std::string& session_id) {
        std::lock_guard lock(mutex_);
        auto it = sessions_.find(session_id);
        return it != sessions_.end() ? it->second.get() : nullptr;
    }

    /// Destroy a session and release all its resources.
    bool destroy_session(const std::string& session_id) {
        std::lock_guard lock(mutex_);
        return sessions_.erase(session_id) > 0;
    }

    /// Current number of active sessions.
    [[nodiscard]] size_t active_count() const {
        std::lock_guard lock(mutex_);
        return sessions_.size();
    }

    /// Maximum allowed sessions.
    [[nodiscard]] size_t max_sessions() const { return max_sessions_; }

    /// Get all active session IDs (for shutdown draining).
    [[nodiscard]] std::vector<std::string> active_session_ids() const {
        std::lock_guard lock(mutex_);
        std::vector<std::string> ids;
        ids.reserve(sessions_.size());
        for (const auto& [id, _] : sessions_) {
            ids.push_back(id);
        }
        return ids;
    }

private:
    size_t max_sessions_;
    std::unordered_map<std::string, std::unique_ptr<Session>> sessions_;
    mutable std::mutex mutex_;
};

} // namespace wss::session
