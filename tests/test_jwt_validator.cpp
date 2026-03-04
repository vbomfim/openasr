#include <gtest/gtest.h>
#include "auth/jwt_validator.hpp"
#include "config/config.hpp"

#include <jwt-cpp/traits/nlohmann-json/defaults.h>
#include <openssl/evp.h>
#include <openssl/pem.h>
#include <openssl/rsa.h>
#include <openssl/ec.h>
#include <openssl/bn.h>
#include <chrono>
#include <memory>

using wss::auth::JwtConfig;
using wss::auth::JwtValidator;
using wss::auth::JwtValidationResult;
using wss::config::ServerConfig;

// --- Helpers: generate RSA key pair for testing ---

struct RsaKeyPair {
    std::string private_key_pem;
    std::string public_key_pem;
};

static RsaKeyPair generate_rsa_key_pair() {
    RsaKeyPair result;

    EVP_PKEY_CTX* ctx = EVP_PKEY_CTX_new_id(EVP_PKEY_RSA, nullptr);
    EVP_PKEY_keygen_init(ctx);
    EVP_PKEY_CTX_set_rsa_keygen_bits(ctx, 2048);

    EVP_PKEY* pkey = nullptr;
    EVP_PKEY_keygen(ctx, &pkey);
    EVP_PKEY_CTX_free(ctx);

    // Extract private key PEM
    BIO* bio_priv = BIO_new(BIO_s_mem());
    PEM_write_bio_PrivateKey(bio_priv, pkey, nullptr, nullptr, 0, nullptr, nullptr);
    char* priv_data = nullptr;
    long priv_len = BIO_get_mem_data(bio_priv, &priv_data);
    result.private_key_pem = std::string(priv_data, static_cast<size_t>(priv_len));
    BIO_free(bio_priv);

    // Extract public key PEM
    BIO* bio_pub = BIO_new(BIO_s_mem());
    PEM_write_bio_PUBKEY(bio_pub, pkey);
    char* pub_data = nullptr;
    long pub_len = BIO_get_mem_data(bio_pub, &pub_data);
    result.public_key_pem = std::string(pub_data, static_cast<size_t>(pub_len));
    BIO_free(bio_pub);

    EVP_PKEY_free(pkey);
    return result;
}

// --- Tests for JwtConfig ---

TEST(JwtConfig, EnabledWhenUrlSet) {
    JwtConfig cfg;
    EXPECT_FALSE(cfg.enabled());

    cfg.jwks_url = "https://example.com/.well-known/keys";
    EXPECT_TRUE(cfg.enabled());
}

TEST(JwtConfig, DefaultRefreshInterval) {
    JwtConfig cfg;
    EXPECT_EQ(cfg.refresh_interval_seconds, 3600);
}

// --- Tests for ServerConfig JWT fields ---

TEST(ServerConfig, JwtFieldsDefaultEmpty) {
    ServerConfig cfg;
    EXPECT_TRUE(cfg.jwt_jwks_url.empty());
    EXPECT_TRUE(cfg.jwt_issuer.empty());
    EXPECT_TRUE(cfg.jwt_audience.empty());
}

// --- Tests for JWT token creation and validation logic ---

TEST(JwtValidation, ValidRS256Token) {
    auto keys = generate_rsa_key_pair();

    // Create a JWT signed with our private key
    auto now = std::chrono::system_clock::now();
    auto token = jwt::create()
        .set_issuer("https://test-issuer.example.com")
        .set_audience("api://test-app")
        .set_subject("user123")
        .set_payload_claim("preferred_username", jwt::claim(std::string("testuser@example.com")))
        .set_issued_at(now)
        .set_expires_at(now + std::chrono::hours(1))
        .set_key_id("test-key-1")
        .sign(jwt::algorithm::rs256("", keys.private_key_pem));

    // Verify directly with jwt-cpp to confirm our token is valid
    auto decoded = jwt::decode(token);
    auto verifier = jwt::verify()
        .allow_algorithm(jwt::algorithm::rs256(keys.public_key_pem))
        .with_issuer("https://test-issuer.example.com")
        .with_audience(std::set<std::string>{"api://test-app"});

    EXPECT_NO_THROW(verifier.verify(decoded));
    EXPECT_EQ(decoded.get_subject(), "user123");
    EXPECT_EQ(decoded.get_key_id(), "test-key-1");
}

TEST(JwtValidation, ExpiredTokenFails) {
    auto keys = generate_rsa_key_pair();

    auto now = std::chrono::system_clock::now();
    auto token = jwt::create()
        .set_issuer("https://test-issuer.example.com")
        .set_audience("api://test-app")
        .set_subject("user123")
        .set_issued_at(now - std::chrono::hours(2))
        .set_expires_at(now - std::chrono::hours(1))  // expired 1 hour ago
        .sign(jwt::algorithm::rs256("", keys.private_key_pem));

    auto decoded = jwt::decode(token);
    auto verifier = jwt::verify()
        .allow_algorithm(jwt::algorithm::rs256(keys.public_key_pem))
        .with_issuer("https://test-issuer.example.com")
        .with_audience(std::set<std::string>{"api://test-app"});

    EXPECT_THROW(verifier.verify(decoded), jwt::error::token_verification_exception);
}

TEST(JwtValidation, WrongIssuerFails) {
    auto keys = generate_rsa_key_pair();

    auto now = std::chrono::system_clock::now();
    auto token = jwt::create()
        .set_issuer("https://wrong-issuer.example.com")
        .set_audience("api://test-app")
        .set_subject("user123")
        .set_issued_at(now)
        .set_expires_at(now + std::chrono::hours(1))
        .sign(jwt::algorithm::rs256("", keys.private_key_pem));

    auto decoded = jwt::decode(token);
    auto verifier = jwt::verify()
        .allow_algorithm(jwt::algorithm::rs256(keys.public_key_pem))
        .with_issuer("https://test-issuer.example.com")
        .with_audience(std::set<std::string>{"api://test-app"});

    EXPECT_THROW(verifier.verify(decoded), jwt::error::token_verification_exception);
}

TEST(JwtValidation, WrongAudienceFails) {
    auto keys = generate_rsa_key_pair();

    auto now = std::chrono::system_clock::now();
    auto token = jwt::create()
        .set_issuer("https://test-issuer.example.com")
        .set_audience("api://wrong-app")
        .set_subject("user123")
        .set_issued_at(now)
        .set_expires_at(now + std::chrono::hours(1))
        .sign(jwt::algorithm::rs256("", keys.private_key_pem));

    auto decoded = jwt::decode(token);
    auto verifier = jwt::verify()
        .allow_algorithm(jwt::algorithm::rs256(keys.public_key_pem))
        .with_issuer("https://test-issuer.example.com")
        .with_audience(std::set<std::string>{"api://test-app"});

    EXPECT_THROW(verifier.verify(decoded), jwt::error::token_verification_exception);
}

TEST(JwtValidation, WrongSigningKeyFails) {
    auto keys = generate_rsa_key_pair();
    auto wrong_keys = generate_rsa_key_pair();

    auto now = std::chrono::system_clock::now();
    auto token = jwt::create()
        .set_issuer("https://test-issuer.example.com")
        .set_audience("api://test-app")
        .set_subject("user123")
        .set_issued_at(now)
        .set_expires_at(now + std::chrono::hours(1))
        .sign(jwt::algorithm::rs256("", keys.private_key_pem));

    auto decoded = jwt::decode(token);

    // Verify with wrong public key — throws signature_verification_exception
    auto verifier = jwt::verify()
        .allow_algorithm(jwt::algorithm::rs256(wrong_keys.public_key_pem))
        .with_issuer("https://test-issuer.example.com")
        .with_audience(std::set<std::string>{"api://test-app"});

    EXPECT_THROW(verifier.verify(decoded), std::exception);
}

TEST(JwtValidation, ClaimsExtraction) {
    auto keys = generate_rsa_key_pair();

    auto now = std::chrono::system_clock::now();
    auto token = jwt::create()
        .set_issuer("https://test-issuer.example.com")
        .set_audience("api://test-app")
        .set_subject("user-abc-123")
        .set_payload_claim("preferred_username", jwt::claim(std::string("alice@contoso.com")))
        .set_issued_at(now)
        .set_expires_at(now + std::chrono::hours(1))
        .sign(jwt::algorithm::rs256("", keys.private_key_pem));

    auto decoded = jwt::decode(token);

    EXPECT_EQ(decoded.get_subject(), "user-abc-123");
    EXPECT_TRUE(decoded.has_payload_claim("preferred_username"));
    EXPECT_EQ(decoded.get_payload_claim("preferred_username").as_string(), "alice@contoso.com");
}

// --- Tests for JwtValidator initialization ---

TEST(JwtValidator, InitializeFailsWithoutUrl) {
    JwtConfig cfg;  // empty URL
    JwtValidator validator(std::move(cfg));
    EXPECT_FALSE(validator.initialize());
}

TEST(JwtValidator, InitializeFailsWithInvalidUrl) {
    JwtConfig cfg;
    cfg.jwks_url = "http://localhost:1/nonexistent-jwks-endpoint";
    JwtValidator validator(std::move(cfg));
    EXPECT_FALSE(validator.initialize());
}

// --- Tests for JwtValidationResult ---

TEST(JwtValidationResult, DefaultInvalid) {
    JwtValidationResult result;
    EXPECT_FALSE(result.valid);
    EXPECT_TRUE(result.error.empty());
    EXPECT_TRUE(result.subject.empty());
    EXPECT_TRUE(result.preferred_username.empty());
}
