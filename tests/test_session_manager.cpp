#include <gtest/gtest.h>
#include "session/session_manager.hpp"

using wss::session::SessionManager;
using wss::session::Session;

static Session::Config make_config(const std::string& id) {
    return {.session_id = id, .language = "en", .sample_rate = 16000,
            .encoding = "pcm_s16le", .window_duration_ms = 5000,
            .overlap_duration_ms = 500, .backend_model_id = "test",
            .ring_buffer_seconds = 1.0f};
}

// T10-1
TEST(SessionManager, CreateSession_ReturnsPointer) {
    SessionManager mgr(10);
    auto* s = mgr.create_session(make_config("s1"));
    EXPECT_NE(s, nullptr);
}

// T10-2
TEST(SessionManager, CreateSession_GetById) {
    SessionManager mgr(10);
    auto* created = mgr.create_session(make_config("s1"));
    auto* found = mgr.get_session("s1");
    EXPECT_EQ(created, found);
}

// T10-3
TEST(SessionManager, CreateSession_AtCapacity_ReturnsNull) {
    SessionManager mgr(2);
    mgr.create_session(make_config("s1"));
    mgr.create_session(make_config("s2"));
    auto* s3 = mgr.create_session(make_config("s3"));
    EXPECT_EQ(s3, nullptr);
}

// T10-4
TEST(SessionManager, CreateSession_DuplicateId_ReturnsNull) {
    SessionManager mgr(10);
    mgr.create_session(make_config("dup"));
    auto* s2 = mgr.create_session(make_config("dup"));
    EXPECT_EQ(s2, nullptr);
}

// T10-5
TEST(SessionManager, GetSession_NotFound_ReturnsNull) {
    SessionManager mgr(10);
    EXPECT_EQ(mgr.get_session("nonexistent"), nullptr);
}

// T10-6
TEST(SessionManager, DestroySession_RemovesSession) {
    SessionManager mgr(10);
    mgr.create_session(make_config("s1"));
    EXPECT_TRUE(mgr.destroy_session("s1"));
    EXPECT_EQ(mgr.get_session("s1"), nullptr);
}

// T10-7
TEST(SessionManager, DestroySession_NotFound_ReturnsFalse) {
    SessionManager mgr(10);
    EXPECT_FALSE(mgr.destroy_session("nonexistent"));
}

// T10-8
TEST(SessionManager, ActiveCount_Tracks) {
    SessionManager mgr(10);
    EXPECT_EQ(mgr.active_count(), 0u);
    mgr.create_session(make_config("s1"));
    EXPECT_EQ(mgr.active_count(), 1u);
    mgr.create_session(make_config("s2"));
    EXPECT_EQ(mgr.active_count(), 2u);
    mgr.destroy_session("s1");
    EXPECT_EQ(mgr.active_count(), 1u);
}

// T10-9
TEST(SessionManager, MaxSessions_Correct) {
    SessionManager mgr(42);
    EXPECT_EQ(mgr.max_sessions(), 42u);
}
