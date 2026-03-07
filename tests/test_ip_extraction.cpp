#include <gtest/gtest.h>
#include "server/ip_extraction.hpp"

using wss::server::extract_client_ip;

// ---------------------------------------------------------------------------
// 1. trust_proxy=false: always uses remote address, ignoring XFF.
// ---------------------------------------------------------------------------
TEST(ExtractClientIpTest, NoTrust_UsesRemoteAddr) {
    EXPECT_EQ(extract_client_ip("10.0.0.1, 10.0.0.2", "192.168.1.1", false),
              "192.168.1.1");
}

// ---------------------------------------------------------------------------
// 2. trust_proxy=true, single IP in XFF: returns that IP.
// ---------------------------------------------------------------------------
TEST(ExtractClientIpTest, Trust_SingleIp) {
    EXPECT_EQ(extract_client_ip("10.0.0.77", "192.168.1.1", true),
              "10.0.0.77");
}

// ---------------------------------------------------------------------------
// 3. trust_proxy=true, chain: returns rightmost (proxy-appended) IP.
// ---------------------------------------------------------------------------
TEST(ExtractClientIpTest, Trust_Chain_ReturnsRightmost) {
    EXPECT_EQ(extract_client_ip("attacker-fake, 10.0.0.77", "192.168.1.1", true),
              "10.0.0.77");
}

// ---------------------------------------------------------------------------
// 4. Whitespace handling around IPs.
// ---------------------------------------------------------------------------
TEST(ExtractClientIpTest, Trust_WhitespaceHandling) {
    EXPECT_EQ(extract_client_ip("10.0.0.1 ,  10.0.0.77  ", "192.168.1.1", true),
              "10.0.0.77");
}

// ---------------------------------------------------------------------------
// 5. Empty XFF with trust_proxy=true falls back to remote address.
// ---------------------------------------------------------------------------
TEST(ExtractClientIpTest, Trust_EmptyXFF_FallsBack) {
    EXPECT_EQ(extract_client_ip("", "192.168.1.1", true),
              "192.168.1.1");
}

// ---------------------------------------------------------------------------
// 6. XFF with only whitespace/commas falls back to remote address.
// ---------------------------------------------------------------------------
TEST(ExtractClientIpTest, Trust_GarbageXFF_FallsBack) {
    EXPECT_EQ(extract_client_ip(", ,  ", "192.168.1.1", true),
              "192.168.1.1");
}

// ---------------------------------------------------------------------------
// 7. IPv6 addresses are handled correctly.
// ---------------------------------------------------------------------------
TEST(ExtractClientIpTest, Trust_IPv6) {
    EXPECT_EQ(extract_client_ip("::1, 2001:db8::1", "::ffff:127.0.0.1", true),
              "2001:db8::1");
}

// ---------------------------------------------------------------------------
// 8. Spoofed XFF ignored when trust_proxy=false (key security test).
// ---------------------------------------------------------------------------
TEST(ExtractClientIpTest, SpoofingBlocked_WhenNoTrust) {
    // Attacker sets XFF header directly — server must ignore it
    EXPECT_EQ(extract_client_ip("evil-spoofed-ip", "real-socket-ip", false),
              "real-socket-ip");
}
