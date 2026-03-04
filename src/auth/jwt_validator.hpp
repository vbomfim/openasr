#pragma once

#include <string>
#include <vector>
#include <mutex>
#include <atomic>
#include <chrono>
#include <thread>
#include <functional>
#include <optional>

#include <jwt-cpp/traits/nlohmann-json/defaults.h>
#include <curl/curl.h>
#include <spdlog/spdlog.h>
#include <nlohmann/json.hpp>

#include <openssl/evp.h>
#include <openssl/pem.h>
#include <openssl/bn.h>
#include <openssl/param_build.h>
#include <openssl/core_names.h>

namespace wss::auth {

/// Result of JWT validation — contains identity claims on success.
struct JwtValidationResult {
    bool valid = false;
    std::string error;
    std::string subject;             // "sub" claim
    std::string preferred_username;  // "preferred_username" claim (if present)
};

/// Configuration for the JWT validator.
struct JwtConfig {
    std::string jwks_url;   // JWKS endpoint URL
    std::string issuer;     // Expected "iss" claim
    std::string audience;   // Expected "aud" claim
    int refresh_interval_seconds = 3600; // JWKS refresh interval (default 1h)

    [[nodiscard]] bool enabled() const { return !jwks_url.empty(); }
};

/// Validates JWTs using JWKS-based signature verification.
/// Thread-safe: keys are protected by a mutex and refreshed periodically.
class JwtValidator {
public:
    explicit JwtValidator(JwtConfig config)
        : config_(std::move(config)) {}

    ~JwtValidator() {
        stop_refresh();
    }

    // Non-copyable, non-movable (owns a thread)
    JwtValidator(const JwtValidator&) = delete;
    JwtValidator& operator=(const JwtValidator&) = delete;

    /// Initialize: fetch JWKS keys and start background refresh.
    /// Returns false if initial key fetch fails.
    bool initialize() {
        if (!config_.enabled()) {
            spdlog::warn("JwtValidator: no JWKS URL configured, JWT validation disabled");
            return false;
        }

        if (!fetch_jwks()) {
            spdlog::error("JwtValidator: failed to fetch initial JWKS from {}", config_.jwks_url);
            return false;
        }

        spdlog::info("JwtValidator: loaded {} signing keys from JWKS", key_count());
        start_refresh();
        return true;
    }

    /// Validate a JWT token string. Returns result with identity claims.
    [[nodiscard]] JwtValidationResult validate(const std::string& token) const {
        JwtValidationResult result;

        // Decode token (no verification yet)
        jwt::decoded_jwt<jwt::traits::nlohmann_json> decoded_token{""};
        try {
            decoded_token = jwt::decode(token);
        } catch (const std::exception& e) {
            result.error = std::string("Failed to decode JWT: ") + e.what();
            return result;
        }

        // Find the matching key by "kid" header
        std::string kid;
        if (decoded_token.has_key_id()) {
            kid = decoded_token.get_key_id();
        }

        auto algorithm = decoded_token.get_algorithm();

        // Try to verify with matching key
        std::lock_guard<std::mutex> lock(keys_mutex_);

        if (jwks_keys_.empty()) {
            result.error = "No JWKS keys available";
            return result;
        }

        bool key_found = false;
        for (const auto& key : jwks_keys_) {
            // Match by kid if available
            if (!kid.empty() && key.kid != kid) {
                continue;
            }

            // Match by algorithm
            if (key.algorithm != algorithm) {
                continue;
            }

            key_found = true;

            try {
                auto key_verifier = jwt::verify()
                    .leeway(60U);

                if (!config_.issuer.empty()) {
                    key_verifier.with_issuer(config_.issuer);
                }
                if (!config_.audience.empty()) {
                    key_verifier.with_audience(std::set<std::string>{config_.audience});
                }

                if (key.algorithm == "RS256") {
                    key_verifier.allow_algorithm(jwt::algorithm::rs256(key.pem));
                } else if (key.algorithm == "ES256") {
                    key_verifier.allow_algorithm(jwt::algorithm::es256(key.pem));
                } else {
                    continue;
                }

                key_verifier.verify(decoded_token);

                // Verification succeeded — extract identity claims
                result.valid = true;
                if (decoded_token.has_payload_claim("sub")) {
                    result.subject = decoded_token.get_payload_claim("sub").as_string();
                }
                if (decoded_token.has_payload_claim("preferred_username")) {
                    result.preferred_username =
                        decoded_token.get_payload_claim("preferred_username").as_string();
                }

                spdlog::debug("JWT validated: sub={} username={}",
                    result.subject, result.preferred_username);
                return result;

            } catch (const std::exception& e) {
                result.error = std::string("JWT verification failed: ") + e.what();
                // Try next key if kid wasn't specified
                if (!kid.empty()) {
                    return result;
                }
            }
        }

        if (!key_found) {
            result.error = "No matching signing key found for kid='" + kid +
                           "' algorithm='" + algorithm + "'";
        }
        return result;
    }

    /// Number of loaded signing keys.
    [[nodiscard]] size_t key_count() const {
        std::lock_guard<std::mutex> lock(keys_mutex_);
        return jwks_keys_.size();
    }

private:
    struct JwkKey {
        std::string kid;
        std::string algorithm;
        std::string pem;  // PEM-encoded public key
    };

    JwtConfig config_;
    mutable std::mutex keys_mutex_;
    std::vector<JwkKey> jwks_keys_;
    std::atomic<bool> refresh_running_{false};
    std::thread refresh_thread_;

    /// Fetch JWKS from the configured URL and update keys.
    bool fetch_jwks() {
        auto jwks_json = http_get(config_.jwks_url);
        if (!jwks_json) {
            return false;
        }

        try {
            auto parsed = jwt::parse_jwks(*jwks_json);
            std::vector<JwkKey> new_keys;

            for (const auto& jwk : parsed) {
                try {
                    if (!jwk.has_key_type()) continue;
                    std::string kty = jwk.get_key_type();

                    std::string kid;
                    if (jwk.has_key_id()) kid = jwk.get_key_id();

                    std::string alg;
                    if (jwk.has_algorithm()) {
                        alg = jwk.get_algorithm();
                    } else {
                        // Infer algorithm from key type
                        if (kty == "RSA") alg = "RS256";
                        else if (kty == "EC") alg = "ES256";
                        else continue;
                    }

                    // Only process signing keys
                    if (jwk.has_use() && jwk.get_use() != "sig") continue;

                    std::string pem;
                    if (jwk.has_x5c()) {
                        // Use x5c certificate chain — extract public key from cert
                        auto cert_der_b64 = jwk.get_x5c_key_value();
                        pem = jwt::helper::convert_base64_der_to_pem(cert_der_b64);
                    } else if (kty == "RSA") {
                        auto n = jwk.get_jwk_claim("n").as_string();
                        auto e = jwk.get_jwk_claim("e").as_string();
                        pem = rsa_components_to_pem(n, e);
                        if (pem.empty()) continue;
                    } else if (kty == "EC") {
                        auto x = jwk.get_jwk_claim("x").as_string();
                        auto y = jwk.get_jwk_claim("y").as_string();
                        pem = ec_components_to_pem(x, y);
                        if (pem.empty()) continue;
                    } else {
                        continue;
                    }

                    new_keys.push_back({kid, alg, pem});
                    spdlog::debug("JwtValidator: loaded key kid={} alg={}", kid, alg);

                } catch (const std::exception& e) {
                    spdlog::warn("JwtValidator: failed to parse JWK: {}", e.what());
                }
            }

            if (new_keys.empty()) {
                spdlog::warn("JwtValidator: no usable signing keys found in JWKS");
                return false;
            }

            std::lock_guard<std::mutex> lock(keys_mutex_);
            jwks_keys_ = std::move(new_keys);
            return true;

        } catch (const std::exception& e) {
            spdlog::error("JwtValidator: failed to parse JWKS: {}", e.what());
            return false;
        }
    }

    /// Start background thread to refresh JWKS keys periodically.
    void start_refresh() {
        refresh_running_.store(true, std::memory_order_release);
        refresh_thread_ = std::thread([this]() {
            while (refresh_running_.load(std::memory_order_acquire)) {
                for (int i = 0; i < config_.refresh_interval_seconds && 
                     refresh_running_.load(std::memory_order_acquire); ++i) {
                    std::this_thread::sleep_for(std::chrono::seconds(1));
                }
                if (!refresh_running_.load(std::memory_order_acquire)) break;

                spdlog::debug("JwtValidator: refreshing JWKS keys");
                if (!fetch_jwks()) {
                    spdlog::warn("JwtValidator: JWKS refresh failed, keeping existing keys");
                } else {
                    spdlog::info("JwtValidator: refreshed {} signing keys", key_count());
                }
            }
        });
    }

    /// Stop the background refresh thread.
    void stop_refresh() {
        refresh_running_.store(false, std::memory_order_release);
        if (refresh_thread_.joinable()) {
            refresh_thread_.join();
        }
    }

    /// Base64url decode (RFC 4648 §5) — used for JWK n, e, x, y components.
    static std::string base64url_decode(const std::string& input) {
        // Convert base64url to standard base64
        std::string b64 = input;
        for (auto& c : b64) {
            if (c == '-') c = '+';
            else if (c == '_') c = '/';
        }
        // Add padding
        while (b64.size() % 4 != 0) b64 += '=';

        BIO* bio = BIO_new_mem_buf(b64.data(), static_cast<int>(b64.size()));
        BIO* b64_bio = BIO_new(BIO_f_base64());
        BIO_set_flags(b64_bio, BIO_FLAGS_BASE64_NO_NL);
        bio = BIO_push(b64_bio, bio);

        std::string result(b64.size(), '\0');
        int len = BIO_read(bio, result.data(), static_cast<int>(result.size()));
        BIO_free_all(bio);

        if (len < 0) return "";
        result.resize(static_cast<size_t>(len));
        return result;
    }

    /// Convert RSA public key components (base64url-encoded n, e) to PEM.
    static std::string rsa_components_to_pem(const std::string& n_b64, const std::string& e_b64) {
        auto n_bytes = base64url_decode(n_b64);
        auto e_bytes = base64url_decode(e_b64);
        if (n_bytes.empty() || e_bytes.empty()) return "";

        BIGNUM* n = BN_bin2bn(reinterpret_cast<const unsigned char*>(n_bytes.data()),
                              static_cast<int>(n_bytes.size()), nullptr);
        BIGNUM* e = BN_bin2bn(reinterpret_cast<const unsigned char*>(e_bytes.data()),
                              static_cast<int>(e_bytes.size()), nullptr);
        if (!n || !e) {
            BN_free(n);
            BN_free(e);
            return "";
        }

        OSSL_PARAM_BLD* bld = OSSL_PARAM_BLD_new();
        OSSL_PARAM_BLD_push_BN(bld, OSSL_PKEY_PARAM_RSA_N, n);
        OSSL_PARAM_BLD_push_BN(bld, OSSL_PKEY_PARAM_RSA_E, e);
        OSSL_PARAM* params = OSSL_PARAM_BLD_to_param(bld);

        EVP_PKEY_CTX* ctx = EVP_PKEY_CTX_new_from_name(nullptr, "RSA", nullptr);
        EVP_PKEY* pkey = nullptr;
        std::string pem;

        if (ctx && EVP_PKEY_fromdata_init(ctx) > 0 &&
            EVP_PKEY_fromdata(ctx, &pkey, EVP_PKEY_PUBLIC_KEY, params) > 0) {
            BIO* bio = BIO_new(BIO_s_mem());
            PEM_write_bio_PUBKEY(bio, pkey);
            char* pem_data = nullptr;
            long pem_len = BIO_get_mem_data(bio, &pem_data);
            pem.assign(pem_data, static_cast<size_t>(pem_len));
            BIO_free(bio);
        }

        EVP_PKEY_free(pkey);
        EVP_PKEY_CTX_free(ctx);
        OSSL_PARAM_free(params);
        OSSL_PARAM_BLD_free(bld);
        BN_free(n);
        BN_free(e);
        return pem;
    }

    /// Convert EC public key components (base64url-encoded x, y for P-256) to PEM.
    static std::string ec_components_to_pem(const std::string& x_b64, const std::string& y_b64) {
        auto x_bytes = base64url_decode(x_b64);
        auto y_bytes = base64url_decode(y_b64);
        if (x_bytes.empty() || y_bytes.empty()) return "";

        // Build uncompressed point: 0x04 || x || y
        std::vector<unsigned char> pub_point;
        pub_point.reserve(1 + x_bytes.size() + y_bytes.size());
        pub_point.push_back(0x04);
        pub_point.insert(pub_point.end(), x_bytes.begin(), x_bytes.end());
        pub_point.insert(pub_point.end(), y_bytes.begin(), y_bytes.end());

        OSSL_PARAM_BLD* bld = OSSL_PARAM_BLD_new();
        OSSL_PARAM_BLD_push_utf8_string(bld, OSSL_PKEY_PARAM_GROUP_NAME, "P-256", 0);
        OSSL_PARAM_BLD_push_octet_string(bld, OSSL_PKEY_PARAM_PUB_KEY,
                                         pub_point.data(), pub_point.size());
        OSSL_PARAM* params = OSSL_PARAM_BLD_to_param(bld);

        EVP_PKEY_CTX* ctx = EVP_PKEY_CTX_new_from_name(nullptr, "EC", nullptr);
        EVP_PKEY* pkey = nullptr;
        std::string pem;

        if (ctx && EVP_PKEY_fromdata_init(ctx) > 0 &&
            EVP_PKEY_fromdata(ctx, &pkey, EVP_PKEY_PUBLIC_KEY, params) > 0) {
            BIO* bio = BIO_new(BIO_s_mem());
            PEM_write_bio_PUBKEY(bio, pkey);
            char* pem_data = nullptr;
            long pem_len = BIO_get_mem_data(bio, &pem_data);
            pem.assign(pem_data, static_cast<size_t>(pem_len));
            BIO_free(bio);
        }

        EVP_PKEY_free(pkey);
        EVP_PKEY_CTX_free(ctx);
        OSSL_PARAM_free(params);
        OSSL_PARAM_BLD_free(bld);
        return pem;
    }

    /// Simple HTTP GET using libcurl. Returns response body or nullopt on error.
    static std::optional<std::string> http_get(const std::string& url) {
        CURL* curl = curl_easy_init();
        if (!curl) {
            spdlog::error("JwtValidator: failed to initialize curl");
            return std::nullopt;
        }

        std::string response;
        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);
        curl_easy_setopt(curl, CURLOPT_TIMEOUT, 10L);
        curl_easy_setopt(curl, CURLOPT_CONNECTTIMEOUT, 5L);
        curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L);
        curl_easy_setopt(curl, CURLOPT_MAXREDIRS, 3L);
        // TLS best practices
        curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, 1L);
        curl_easy_setopt(curl, CURLOPT_SSL_VERIFYHOST, 2L);

        CURLcode res = curl_easy_perform(curl);
        long http_code = 0;
        curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &http_code);
        curl_easy_cleanup(curl);

        if (res != CURLE_OK) {
            spdlog::error("JwtValidator: HTTP GET {} failed: {}",
                url, curl_easy_strerror(res));
            return std::nullopt;
        }

        if (http_code != 200) {
            spdlog::error("JwtValidator: HTTP GET {} returned status {}",
                url, http_code);
            return std::nullopt;
        }

        return response;
    }

    static size_t write_callback(char* ptr, size_t size, size_t nmemb, void* userdata) {
        auto* response = static_cast<std::string*>(userdata);
        response->append(ptr, size * nmemb);
        return size * nmemb;
    }
};

} // namespace wss::auth
