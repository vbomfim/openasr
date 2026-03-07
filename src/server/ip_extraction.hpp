#pragma once

#include <string>
#include <string_view>
#include <algorithm>

namespace wss::server {

/// Extract the real client IP from request context.
/// When trust_proxy is false (default), always uses the socket address.
/// When trust_proxy is true, reads X-Forwarded-For and takes the
/// rightmost (last) IP — the one appended by the trusted reverse proxy.
inline std::string extract_client_ip(std::string_view forwarded_for,
                                     std::string_view remote_addr,
                                     bool trust_proxy) {
    if (!trust_proxy || forwarded_for.empty()) {
        return std::string(remote_addr);
    }

    // Take the rightmost entry (added by the trusted proxy)
    auto pos = forwarded_for.rfind(',');
    std::string_view ip = (pos != std::string_view::npos)
        ? forwarded_for.substr(pos + 1)
        : forwarded_for;

    // Trim whitespace
    while (!ip.empty() && ip.front() == ' ') ip.remove_prefix(1);
    while (!ip.empty() && ip.back() == ' ') ip.remove_suffix(1);

    return ip.empty() ? std::string(remote_addr) : std::string(ip);
}

}  // namespace wss::server
