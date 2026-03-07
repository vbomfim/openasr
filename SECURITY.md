# Security Policy

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| latest  | ✅ Yes             |
| < 0.1.0 | ❌ No              |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do NOT open a public GitHub issue.**
2. Email: [security@openasr.dev](mailto:security@openasr.dev) or use [GitHub Security Advisories](https://github.com/vbomfim/openasr/security/advisories/new).
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will acknowledge receipt within 48 hours and provide a fix timeline within 7 days.

## Security Measures

### Authentication & Authorization
- API key authentication via `Authorization: Bearer <key>` header
- No query string auth (keys in URLs are logged by proxies)
- 401 Unauthorized returned **before** WebSocket upgrade completes
- `WSS_REQUIRE_AUTH=true` fails startup if API key is empty (production safeguard)

### Input Validation
- All JSON message fields validated: types, ranges, string lengths
- Encoding restricted to `pcm_s16le` or `opus` (no arbitrary codecs)
- Sample rate: 8,000–96,000 Hz
- Window duration: 1,000–60,000 ms
- Overlap must be less than window duration
- String fields length-capped: language ≤16, model_id ≤128, encoding ≤32
- Optional fields handled safely (no crash on missing `model_id`, null `resume_checkpoint`)

### Denial of Service Protection
- Max concurrent connections: 100
- Max concurrent sessions: configurable (default: 20)
- Inference queue depth: 100 jobs max (prevents OOM from audio flood)
- Per-session transcript limit: 1 MB
- Max session duration: 2 hours
- Backpressure signaling at 80% ring buffer fill
- WebSocket idle timeout: 120 seconds
- Max frame size: 16 MB
- Per-IP auth failure rate limiting: 10 failures per 60s window → `429 Too Many Requests` (configurable via `WSS_AUTH_RATE_LIMIT_MAX`, `WSS_AUTH_RATE_LIMIT_WINDOW`)
- Per-session message rate limiting: 100 msgs/s, 640 KB/s → frames dropped with `speech.backpressure` (configurable via `WSS_MSG_RATE_LIMIT_MAX`, `WSS_MSG_RATE_LIMIT_BYTES`)
- Kubernetes Ingress rate limiting: 20 max connections, 50 rps per client IP (via nginx annotations)

### Memory Safety
- Exception handling wraps all audio processing (Opus decode, resampling, JSON parsing)
- RAII guard on `whisper_state` pool checkout (no leak on exception)
- Ring buffer fixed-capacity, pre-allocated (no unbounded growth)
- Division-by-zero guards on sample rate and buffer capacity
- Odd-byte PCM frames handled safely (truncation, no buffer over-read)
- Safe integer parsing (`safe_atoi` with fallback, not raw `atoi`)
- Cryptographically seeded session IDs (`std::random_device`)

### Container Security
- Distroless runtime image (`gcr.io/distroless/cc-debian12:nonroot`)
- No shell, no package manager — minimal attack surface
- Non-root execution (UID 65534)
- Read-only root filesystem compatible
- Security-hardened compiler flags:
  - `-fstack-protector-strong` (stack buffer overflow protection)
  - `-D_FORTIFY_SOURCE=2` (runtime buffer overflow detection)
  - `-Wl,-z,relro -Wl,-z,now` (full RELRO, immediate binding on Linux)
  - `-Wall -Wextra -Wpedantic -Werror` (all warnings are errors)

### CI/CD Security
- CodeQL static analysis on every push and PR (C++ and Python)
- Dependabot automated dependency updates (weekly)
- Secret scanning and push protection enabled
- GitHub Container Registry with `GITHUB_TOKEN` (no external registry credentials)

## Testing & Verification

### Unit Tests (232 tests)
- 15 test suites covering all core components
- Boundary analysis on every numeric input (min, max, zero, negative, off-by-one)
- JSON serialization roundtrip tests for all message types
- Thread safety tests with concurrent checkout/checkin
- Exception path verification (corrupt Opus, resampler errors)
- Auth rate limiter: threshold, window expiry, cleanup, IP independence, concurrent access
- Per-session rate tracking: defaults, increment, reset, flag toggle

### Adversarial Integration Tests (39 tests)
Automated attack patterns run against a live server instance:

| Category | Tests | What's tested |
|----------|-------|---------------|
| **Auth bypass** | 3 | No header, wrong key, empty bearer → 401 |
| **Malformed JSON** | 8 | Garbage, empty, array, string, number, missing fields |
| **Protocol violations** | 3 | Binary before config, end before config, double config |
| **Invalid values** | 13 | Wrong types, out-of-range, null, oversized strings |
| **Payload abuse** | 4 | 1 MB JSON, empty/odd/single-byte binary frames |
| **Stress** | 3 | 50 rapid connects, 20 config+close cycles, audio without end |
| **Security rate limiting** | 3 | Auth brute-force → 429, correct key after rate limit, message flood → backpressure |
| **Survival** | 2 | Health + readiness OK after all attacks |

All 39 tests pass — server survives every attack pattern without crash or resource leak.

### Load Testing
- Azure Load Testing suite with JMeter (see [`load-testing/`](load-testing/README.md))
- 7 scenarios: smoke, load, stress, spike, endurance, API benchmark, **security**
- Security load test validates auth brute-force (401 → 429), legitimate session resilience, and message flood handling
- Tested with up to 20 concurrent sessions; memory stable, zero errors

## Deployment Security Model

> **This service is designed to run behind infrastructure safeguards.** It does not implement all security controls at the application layer — it relies on the deployment environment to provide network isolation, TLS encryption, and access control for internal endpoints.

### Assumptions

The following safeguards are expected in any production deployment:

| Layer | Responsibility | How |
|---|---|---|
| **TLS termination** | Kubernetes Ingress or reverse proxy (nginx, Envoy) | The server listens on plaintext; TLS is terminated at the edge. Bearer tokens and audio data are protected in transit by the proxy, not the application. |
| **Network segmentation** | Kubernetes NetworkPolicy | Internal endpoints (`/health`, `/ready`, `/metrics`) are intentionally unauthenticated for K8s liveness/readiness probes and Prometheus scraping. A NetworkPolicy must restrict port 9090 access to only the ingress controller and monitoring namespace. |
| **Ingress path restriction** | Ingress route configuration | Only `/transcribe` should be exposed externally. Internal endpoints must not be routed through the public ingress. |
| **Secret management** | Kubernetes Secrets or external vault | `WSS_API_KEY` should be stored in a Kubernetes Secret (not a ConfigMap) and rotated periodically. |

### What the application provides

- Bearer token authentication on `/transcribe` (checked **before** WebSocket upgrade)
- Input validation on all JSON fields (types, ranges, string lengths, encoding whitelist)
- Per-session resource limits (max connections, max sessions, inference queue depth, transcript cap, session timeout)
- Backpressure signaling at 80% buffer fill
- Memory-safe buffer handling (fixed-capacity ring buffer, RAII guards, bounds checks)
- Security-hardened compilation (stack protector, FORTIFY_SOURCE, full RELRO)
- Distroless container image running as non-root with no capabilities

### What the application does NOT provide

- TLS encryption (by design — delegated to ingress/proxy)
- Authentication on `/health`, `/ready`, `/metrics` (by design — these are internal probe/scrape endpoints, isolated via NetworkPolicy)
