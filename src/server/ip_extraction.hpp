#pragma once

#include <string>
#include <string_view>

namespace wss::server {

/// Extract the real client IP from request context.
/// When trust_proxy is false (default), always uses the socket address.
/// When trust_proxy is true, reads X-Forwarded-For and skips trusted_hops-1
/// entries from the right. With 1 trusted proxy (default), the rightmost
/// entry is the client IP as seen by that proxy.
/// @note For multi-proxy deployments (CDN → LB → sidecar → server),
///       set trusted_hops to the number of trusted proxies.
inline std::string extract_client_ip(std::string_view forwarded_for,
                                     std::string_view remote_addr,
                                     bool trust_proxy,
                                     int trusted_hops = 1) {
    if (!trust_proxy || forwarded_for.empty()) {
        return std::string(remote_addr);
    }

    // Skip (trusted_hops - 1) entries from the right.
    // With 1 proxy: take the rightmost entry directly.
    // With 2 proxies: skip rightmost 1, take the next one.
    auto remaining = forwarded_for;
    for (int hop = 0; hop < trusted_hops - 1; ++hop) {
        auto pos = remaining.rfind(',');
        if (pos == std::string_view::npos) {
            return std::string(remote_addr);
        }
        remaining = remaining.substr(0, pos);
    }

    // Take the rightmost remaining entry (the client IP)
    auto pos = remaining.rfind(',');
    std::string_view ip = (pos != std::string_view::npos)
        ? remaining.substr(pos + 1)
        : remaining;

    // Trim OWS (RFC 7239: SP / HTAB)
    auto is_ows = [](char c) { return c == ' ' || c == '\t'; };
    while (!ip.empty() && is_ows(ip.front())) ip.remove_prefix(1);
    while (!ip.empty() && is_ows(ip.back())) ip.remove_suffix(1);

    return ip.empty() ? std::string(remote_addr) : std::string(ip);
}

}  // namespace wss::server
