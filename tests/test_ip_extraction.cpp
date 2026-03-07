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

// ---------------------------------------------------------------------------
// 9. Multi-proxy: trusted_hops=2, skip 1 from right, take client IP.
// ---------------------------------------------------------------------------
TEST(ExtractClientIpTest, Trust_MultiProxy_2Hops) {
    // client → Proxy1 → Proxy2 → server
    // Proxy2 adds proxy1-internal, XFF = "client-ip, proxy1-internal"
    EXPECT_EQ(extract_client_ip("client-ip, proxy1-internal",
                                "socket-ip", true, 2),
              "client-ip");
}

// ---------------------------------------------------------------------------
// 10. trusted_hops=3 but only 1 entry falls back to remote address.
// ---------------------------------------------------------------------------
TEST(ExtractClientIpTest, Trust_TooFewEntries_FallsBack) {
    EXPECT_EQ(extract_client_ip("only-one-ip", "socket-ip", true, 3),
              "socket-ip");
}

// ---------------------------------------------------------------------------
// 11. HTAB whitespace is trimmed per RFC 7239 OWS.
// ---------------------------------------------------------------------------
TEST(ExtractClientIpTest, Trust_TabWhitespaceHandling) {
    EXPECT_EQ(extract_client_ip("10.0.0.1,\t10.0.0.77\t", "192.168.1.1", true),
              "10.0.0.77");
}
