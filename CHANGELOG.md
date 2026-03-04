# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.1] - 2026-03-04

### Added
- Voice Activity Detection (VAD) for speech-aligned windowing (`vad_enabled` config)
- Structured JSON logging (`WSS_LOG_FORMAT=json`) for Datadog/Loki/ELK
- GPU (CUDA) Dockerfile (`docker/Dockerfile.cuda`) for 10-50× faster inference
- Integration tests in CI pipeline (48 tests + E2E transcription)
- E2E test script (`tools/e2e_test.py`)
- Prometheus inference_duration histogram with proper active_jobs tracking

### Fixed
- Graceful shutdown now drains in-flight inference before exit (two-phase shutdown)
- VAD window buffer bounded to prevent OOM on corrupted state

### Changed
- Shutdown timer polls every 200ms (was 1000ms) for faster drain detection

## [0.2.0] - 2026-03-03

### Added
- Separate `/ready` endpoint (checks model loaded + queue capacity) for K8s readiness probes
- `WSS_REQUIRE_AUTH=true` — fail startup if API key is empty (production safeguard)
- `terminationGracePeriodSeconds: 120` in K8s deployments
- PodDisruptionBudget (`minAvailable: 1`) for zero-downtime updates
- Drain buffered audio windows on unexpected client disconnect
- Connection limit (100 max concurrent WebSocket connections)
- Inference queue depth limit (100 jobs max)
- Session transcript limit (1 MB) and duration limit (2 hours)
- Division-by-zero guards on sample rate and buffer capacity
- RAII guard for whisper_state pool checkout (no leak on exception)
- Safe integer parsing (`safe_atoi` with fallback defaults)
- Cryptographically seeded session IDs (`std::random_device`)
- String field length validation (language ≤16, model_id ≤128, encoding ≤32)
- 178 unit tests across 13 components (95.5% line coverage)
- 36 adversarial integration tests (auth bypass, malformed input, DoS patterns)
- Load testing benchmark tool (`tools/benchmark.py`)
- CI workflow: unit tests on every push and PR
- Pre-built Docker images with embedded models on ghcr.io
- LICENSE (MIT), CONTRIBUTING.md, CODE_OF_CONDUCT.md, CHANGELOG.md
- GitHub issue templates and PR template
- SECURITY.md with full security measures documentation

### Changed
- Protocol aligned with Azure Speech conventions (speech.config, speech.hypothesis, speech.phrase)
- `speech.phrase` emitted per-window as finalized turn (not full transcript)
- `model_id` field in speech.config is now optional
- Runtime image switched to distroless (~63MB, no shell)
- Authentication is header-only (removed query string `api_key` parameter)
- whisper_state pool capped at 4 (prevents OOM with large models)
- Default `server.toml` no longer hardcodes model path

### Fixed
- `BufferEngine::next_window_end_` uninitialized (caused window_ready to never return true)
- Uncaught exceptions in audio pipeline (Opus decode, resampler, JSON parsing)
- Docker image `WHISPER_MODEL_PATH` empty in model-embedded images
- Health endpoint routing on Linux (app construction order fix)

### Security
- Removed query string API key authentication (credential leakage risk)
- CodeQL static analysis on every push (C++ and Python)
- Secret scanning and push protection enabled
- Exception handling on all audio processing paths (no crash on malformed input)

## [0.1.0] - 2026-03-03

### Added
- WebSocket streaming transcription server (C++20, whisper.cpp)
- Azure-aligned protocol: speech.config, speech.hypothesis, speech.phrase, speech.checkpoint
- PCM int16 and Opus audio support at any sample rate (8–96 kHz)
- Stateless checkpointing for session resume on any node
- API key authentication (Bearer token, header-only)
- Configurable windowing with overlap for continuous transcription
- Inference thread pool with whisper_state object pooling
- Result aggregation with overlap deduplication
- Backpressure signaling at ring buffer capacity limits
- Health (/health) and readiness (/ready) HTTP endpoints
- Distroless container image (~63MB, non-root)
- Kubernetes manifests with PodDisruptionBudget
- 178 unit tests (95.5% line coverage)
- 36 adversarial integration tests
- Load testing benchmark tool
- GitHub Actions CI: build + test, CodeQL, Docker multi-arch publish
- Dependabot for automated dependency updates
