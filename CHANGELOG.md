# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
