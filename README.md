# OpenASR — Streaming Speech-to-Text Server

[![CI](https://github.com/vbomfim/openasr/actions/workflows/ci.yml/badge.svg)](https://github.com/vbomfim/openasr/actions/workflows/ci.yml)
[![Build & Push](https://github.com/vbomfim/openasr/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/vbomfim/openasr/actions/workflows/docker-publish.yml)
[![CodeQL](https://github.com/vbomfim/openasr/actions/workflows/codeql.yml/badge.svg)](https://github.com/vbomfim/openasr/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Coverage: 95.5%](https://img.shields.io/badge/coverage-95.5%25-brightgreen)](SECURITY.md#testing--verification)
[![Tests: 214](https://img.shields.io/badge/tests-214%20passing-brightgreen)](SECURITY.md#testing--verification)

A production-grade, memory-efficient C++20 WebSocket server for real-time audio transcription, powered by [whisper.cpp](https://github.com/ggerganov/whisper.cpp). The protocol is aligned with Azure Cognitive Services Speech-to-Text conventions.

## Inference Runtime

**[whisper.cpp](https://github.com/ggerganov/whisper.cpp)** — a high-performance C/C++ implementation of OpenAI's Whisper speech recognition model, using the [GGML](https://github.com/ggerganov/ggml) tensor library.

- Pure C/C++ — no Python, no PyTorch, no ONNX
- CPU optimized (AVX, AVX2, NEON) with optional GPU acceleration (CUDA, Vulkan, Metal)
- Uses GGML quantized model format for reduced memory and faster inference
- Model loaded once at startup, shared across all concurrent sessions

## Features

- **Embedded Whisper inference** — pure C++, no Python dependencies
- **WebSocket streaming** — Azure-style protocol with continuous binary audio
- **PCM and Opus audio** at any sample rate (8–96 kHz, resampled internally to 16 kHz)
- **Stateless checkpointing** — resume sessions on any server node
- **API key authentication** — Bearer token in header
- **Kubernetes-ready** — multi-stage Docker image, health checks, Helm-friendly

---

## Quick Start

### Pre-built Docker Images (recommended)

Pre-built images are available with popular models embedded — no downloads or volume mounts needed:

```bash
# Just run — model is included in the image
docker run -p 9090:9090 -e WSS_API_KEY=your-secret-key \
  ghcr.io/vbomfim/openasr:base.en
```

| Image tag | Model | Image size | Best for |
|-----------|-------|-----------|----------|
| `ghcr.io/vbomfim/openasr:tiny.en` | Whisper tiny (English) | ~140 MB | Development, testing |
| `ghcr.io/vbomfim/openasr:base.en` | Whisper base (English) | ~210 MB | Low-latency production |
| `ghcr.io/vbomfim/openasr:large-v3-turbo` | Whisper large v3 turbo | ~1.7 GB | Best speed/quality balance |
| `ghcr.io/vbomfim/openasr:large-v3` | Whisper large v3 | ~3.1 GB | Maximum accuracy |
| `ghcr.io/vbomfim/openasr:latest` | No model (bring your own) | ~63 MB | Production K8s with external model storage |

### Docker with Your Own Model

Use the slim `latest` image and mount your model as a volume:

```bash
# Download a model
curl -L -o models/ggml-base.en.bin \
  https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin

# Run with volume mount
docker run -p 9090:9090 \
  -v $(pwd)/models:/models \
  -e WHISPER_MODEL_PATH=/models/ggml-base.en.bin \
  -e WSS_API_KEY=your-secret-key \
  ghcr.io/vbomfim/openasr:latest
```

### Docker Compose

```yaml
services:
  openasr:
    image: ghcr.io/vbomfim/openasr:base.en
    ports:
      - "9090:9090"
    environment:
      - WSS_API_KEY=your-secret-key
      - WSS_INFERENCE_THREADS=4
      - WSS_MAX_SESSIONS=10
```

### From Source

```bash
# Build
mkdir build && cd build
cmake .. -DCMAKE_BUILD_TYPE=Release
cmake --build . -j$(nproc)

# Download a model
curl -L -o models/ggml-base.en.bin \
  https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin

# Run
WHISPER_MODEL_PATH=models/ggml-base.en.bin ./transcription_server
```

---

## WebSocket Protocol

### Endpoint

```
ws://host:9090/transcribe
```

### Authentication

Every WebSocket connection must be authenticated (unless `WSS_API_KEY` is unset for dev mode).

#### Generating an API key

The API key is any string you choose — there is no specific format or token service. Use a cryptographically random string of at least 32 characters:

```bash
# Generate a secure random key
openssl rand -hex 32
# Example output: a3f1b9c7e8d2f4a6b0c5e7d9f1a3b5c7e9d1f3a5b7c9e1d3f5a7b9c1e3d5f7

# Or using Python
python3 -c "import secrets; print(secrets.token_hex(32))"
```

#### Configuring the server

Set the key as an environment variable when starting the server:

```bash
# Docker
docker run -e WSS_API_KEY=a3f1b9c7e8d2f4a6b0c5e7d9f1a3b5c7... ghcr.io/vbomfim/openasr:base.en

# Kubernetes (use a Secret, not a ConfigMap)
kubectl create secret generic openasr-api-key \
  --from-literal=WSS_API_KEY=a3f1b9c7e8d2f4a6b0c5e7d9f1a3b5c7... \
  -n whisperx
```

In production, set `WSS_REQUIRE_AUTH=true` to prevent accidental startup without a key.

#### Connecting with the key

Pass the key in the `Authorization` header when opening the WebSocket connection:

```
Authorization: Bearer a3f1b9c7e8d2f4a6b0c5e7d9f1a3b5c7...
```

```python
# Python
headers = {"Authorization": f"Bearer {api_key}"}
async with websockets.connect("ws://host:9090/transcribe",
                               additional_headers=headers) as ws:
    ...
```

```javascript
// JavaScript
const ws = new WebSocket("ws://host:9090/transcribe", {
  headers: { "Authorization": `Bearer ${apiKey}` }
});
```

```bash
# curl (for testing WebSocket upgrade)
curl -H "Authorization: Bearer $API_KEY" \
  -H "Upgrade: websocket" -H "Connection: Upgrade" \
  -H "Sec-WebSocket-Key: $(openssl rand -base64 16)" \
  -H "Sec-WebSocket-Version: 13" \
  http://localhost:9090/transcribe
```

Query string authentication is **not supported** — API keys in URLs are logged by proxies and intermediaries.

Unauthenticated or invalid connections receive `HTTP 401 Unauthorized` before the WebSocket handshake completes.

#### Enterprise authentication (OIDC / Azure Entra ID)

For multi-tenant deployments with per-user tokens, token revocation, and SSO, use an **ingress-level identity provider** instead of a shared API key. The server stays lean — authentication is handled by your infrastructure:

```
Client (JWT) → [ Ingress / API Gateway ] → OpenASR server
                validates token here        receives pre-authenticated request
```

**Example with nginx-ingress + OAuth2 Proxy (Azure Entra ID):**

```yaml
# Ingress annotation for OAuth2 Proxy
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    nginx.ingress.kubernetes.io/auth-url: "https://oauth2-proxy.example.com/oauth2/auth"
    nginx.ingress.kubernetes.io/auth-signin: "https://oauth2-proxy.example.com/oauth2/start"
spec:
  rules:
    - host: openasr.example.com
      http:
        paths:
          - path: /
            backend:
              service:
                name: whisperx-server
                port:
                  number: 9090
```

Compatible identity providers:
- **Azure Entra ID** (formerly Azure AD) — via [OAuth2 Proxy](https://oauth2-proxy.github.io/oauth2-proxy/)
- **Okta / Auth0** — via OAuth2 Proxy or Kong OIDC plugin
- **Google Identity** — via IAP or OAuth2 Proxy
- **Keycloak** — self-hosted, via OAuth2 Proxy
- **Istio** — native JWT validation in the service mesh

When using ingress-level auth, set `WSS_API_KEY` to empty (disable the built-in check) and rely on the gateway to reject unauthenticated requests before they reach the server.

### Connection Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Server

    C->>S: WebSocket upgrade (Authorization: Bearer <key>)
    S-->>C: 101 Switching Protocols

    C->>S: speech.config (JSON)
    S-->>C: speech.config.ack (JSON)

    Note over C,S: Client streams continuous binary audio frames

    loop Every audio window (e.g. 5s)
        C->>S: binary audio frames...
        Note right of S: Window full → inference runs

        S-->>C: speech.hypothesis (interim, per segment)
        S-->>C: speech.phrase (finalized turn, status=Success)
        S-->>C: speech.checkpoint (full transcript so far)
    end

    C->>S: speech.end (JSON)
    S-->>C: speech.phrase (status=EndOfStream, full transcript)
    S-->>C: speech.checkpoint (final)
```

#### Event ordering per window

Each completed inference window produces three events in this order:

| # | Event | Purpose | Content |
|---|-------|---------|---------|
| 1 | `speech.hypothesis` | Interim result per segment | Individual segment text, offset, duration |
| 2 | `speech.phrase` | **Finalized turn** (stable, won't change) | Combined text for this window, `status: "Success"` |
| 3 | `speech.checkpoint` | Full accumulated transcript | Everything transcribed so far (for session resume) |

On `speech.end`, the server sends:

| # | Event | Purpose | Content |
|---|-------|---------|---------|
| 1 | `speech.phrase` | End of stream marker | Full transcript, `status: "EndOfStream"` |
| 2 | `speech.checkpoint` | Final session state | Complete transcript + resume data |

#### Example: 12-second audio with 5-second windows

```
Time  Direction  Event
────  ─────────  ──────────────────────────────────────────────
0.0s  C→S        speech.config (window=5000ms, overlap=500ms)
0.0s  S→C        speech.config.ack
0.0s  C→S        binary audio frames (streaming continuously)
...
5.0s  ─────      Window 1 ready [0ms–5000ms] → inference starts
6.2s  S→C        speech.hypothesis: "Hello, this is a test"
6.2s  S→C        speech.phrase:     "Hello, this is a test." (status=Success)
6.2s  S→C        speech.checkpoint: "Hello, this is a test."
...
9.5s  ─────      Window 2 ready [4500ms–9500ms] → inference starts
11.0s S→C        speech.hypothesis: "of the streaming server."
11.0s S→C        speech.phrase:     "of the streaming server." (status=Success)
11.0s S→C        speech.checkpoint: "Hello, this is a test. of the streaming server."
...
12.0s C→S        speech.end
12.0s S→C        speech.phrase:     "Hello, this is a test. of the ..." (status=EndOfStream)
12.0s S→C        speech.checkpoint: (final state, usable for resume)
```

---

## Messages

### Client → Server

#### `speech.config` — Initialize session

Sent once after WebSocket connect. Configures language, audio format, and windowing.

```json
{
  "type": "speech.config",
  "payload": {
    "language": "en",
    "sample_rate": 16000,
    "encoding": "pcm_s16le",
    "window_duration_ms": 5000,
    "overlap_duration_ms": 500,
    "model_id": "whisper-large-v3",
    "resume_checkpoint": null
  }
}
```

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `language` | string | yes | `"en"` | Language code (max 16 chars) |
| `sample_rate` | int | yes | `16000` | Audio sample rate in Hz (8000–96000) |
| `encoding` | string | yes | `"pcm_s16le"` | `"pcm_s16le"` or `"opus"` |
| `window_duration_ms` | int | yes | `5000` | Transcription window size (1000–60000) |
| `overlap_duration_ms` | int | yes | `500` | Window overlap (0 to window_duration_ms-1) |
| `model_id` | string | no | `"whisper-tiny.en"` | Model identifier (max 128 chars) |
| `resume_checkpoint` | object\|null | no | `null` | Checkpoint from a previous session to resume |

#### Binary frames — Audio data

After receiving `speech.config.ack`, send audio as **continuous binary WebSocket frames**. No JSON metadata per chunk — just raw audio bytes.

| Encoding | Format |
|----------|--------|
| `pcm_s16le` | Raw PCM, 16-bit signed little-endian, mono |
| `opus` | Opus-encoded frames, mono |

Audio at any sample rate is internally resampled to 16 kHz for Whisper inference.

**Recommended chunk size:** 200ms of audio (e.g., 6400 bytes at 16 kHz PCM).  
**Maximum frame size:** 16 MB.

#### `speech.end` — End session

Signals no more audio will be sent. Server sends final transcript and checkpoint.

```json
{
  "type": "speech.end",
  "payload": {}
}
```

---

### Server → Client

#### `speech.config.ack` — Session created

Confirms session creation with effective configuration.

```json
{
  "type": "speech.config.ack",
  "session_id": "d785d7fad5ecd9ee3eed4ddeb2953e59",
  "payload": {
    "session_id": "d785d7fad5ecd9ee3eed4ddeb2953e59",
    "effective_config": {
      "language": "en",
      "sample_rate": 16000,
      "encoding": "pcm_s16le",
      "window_duration_ms": 5000,
      "overlap_duration_ms": 500,
      "model_id": "whisper-large-v3"
    }
  }
}
```

#### `speech.hypothesis` — Partial transcription

Emitted after each inference window completes. May change as more context arrives.

```json
{
  "type": "speech.hypothesis",
  "session_id": "d785d7fad5ecd9ee3eed4ddeb2953e59",
  "payload": {
    "offset": 0,
    "duration": 5000,
    "text": "Hello, this is a test of the Whisper streaming transcription server."
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `offset` | int | Start time in milliseconds from session start |
| `duration` | int | Duration of the transcribed segment in milliseconds |
| `text` | string | Transcribed text |

#### `speech.phrase` — Finalized turn/segment

Emitted after each inference window completes. This is the **confirmed, stable** transcription for that segment — it will not change. Use `speech.checkpoint` for the full accumulated transcript.

```json
{
  "type": "speech.phrase",
  "session_id": "d785d7fad5ecd9ee3eed4ddeb2953e59",
  "payload": {
    "offset": 0,
    "duration": 5000,
    "text": "Hello, this is a test of the Whisper streaming transcription server.",
    "confidence": 1.0,
    "status": "Success"
  }
}
```

On `speech.end`, a final `speech.phrase` with `"status": "EndOfStream"` is sent containing the full accumulated transcript.

#### `speech.checkpoint` — Session state

Emitted after each inference window. Store this to resume the session on any server node.

```json
{
  "type": "speech.checkpoint",
  "session_id": "d785d7fad5ecd9ee3eed4ddeb2953e59",
  "payload": {
    "session_id": "d785d7fad5ecd9ee3eed4ddeb2953e59",
    "last_audio_ms": 5000,
    "last_text_offset": 69,
    "full_transcript": "Hello, this is a test of the Whisper streaming transcription server.",
    "buffer_config": {
      "window_duration_ms": 5000,
      "overlap_duration_ms": 500
    },
    "backend_model_id": "whisper-large-v3"
  }
}
```

To resume, pass the checkpoint as `resume_checkpoint` in the next `speech.config`.

#### `speech.backpressure` — Flow control

Sent when the server's audio buffer is filling up. Slow down or resume sending.

```json
{
  "type": "speech.backpressure",
  "session_id": "d785d7fad5ecd9ee3eed4ddeb2953e59",
  "payload": {
    "action": "slow_down"
  }
}
```

| Action | Meaning |
|--------|---------|
| `"slow_down"` | Buffer >80% full — reduce audio send rate |
| `"ok"` | Buffer <50% — safe to resume normal rate |

#### `speech.error` — Error

```json
{
  "type": "speech.error",
  "session_id": "d785d7fad5ecd9ee3eed4ddeb2953e59",
  "payload": {
    "code": "INVALID_MESSAGE",
    "message": "Missing or invalid 'language'"
  }
}
```

---

## Error Codes

| Code | Reason | Recovery |
|------|--------|----------|
| `INVALID_MESSAGE` | Malformed JSON, missing required fields, invalid field types, values out of range, or unknown message type | Fix the message and resend |
| `INVALID_STATE` | Message received in wrong connection state (e.g., binary audio before `speech.config`) | Follow the correct protocol flow |
| `SESSION_LIMIT` | Maximum concurrent sessions reached (default: 20) | Wait for a session to end, or increase `WSS_MAX_SESSIONS` |
| `SESSION_NOT_FOUND` | Session ID not found (session expired or destroyed) | Create a new session |
| `AUDIO_ERROR` | Audio decoding or resampling failed (corrupt Opus frame, invalid PCM data) | Check audio encoding and format |

HTTP-level errors (before WebSocket upgrade):

| HTTP Status | Reason |
|-------------|--------|
| `401 Unauthorized` | Missing or invalid API key |
| `404 Not Found` | Invalid endpoint (use `/transcribe`) |

---

## Audio Format Support

| Encoding | Description | Notes |
|----------|-------------|-------|
| `pcm_s16le` | Raw PCM, 16-bit signed, little-endian, mono | Most common, zero overhead |
| `opus` | Opus-encoded frames, mono | Lower bandwidth, decoder initialized per-session |

**Sample rates:** Any rate from 8,000 to 96,000 Hz. Audio is internally resampled to 16,000 Hz (Whisper's native rate) using libsamplerate with `SRC_SINC_MEDIUM_QUALITY`.

**Channel layout:** Mono only. Multi-channel audio must be downmixed before sending.

---

## Capacity & Limits

| Parameter | Default | Configurable via |
|-----------|---------|-----------------|
| Max concurrent sessions | 20 | `WSS_MAX_SESSIONS` |
| Max WebSocket connections | 100 | Compile-time (`kMaxConnections`) |
| Max audio frame size | 16 MB | Compile-time (`maxPayloadLength`) |
| Idle connection timeout | 120s | Compile-time (`idleTimeout`) |
| Send buffer backpressure | 1 MB | Compile-time (`maxBackpressure`) |
| Audio ring buffer | 30s per session | Code default |
| Inference queue depth | 100 jobs | Compile-time |
| Max transcript length | 1 MB per session | Compile-time (`kMaxTranscriptLength`) |
| Max session duration | 2 hours | Compile-time (`kMaxSessionDurationMs`) |
| Inference threads | 4 | `WSS_INFERENCE_THREADS` |

**Memory estimate per session:**
- Audio ring buffer: ~1.9 MB (30s at 16 kHz, float32)
- Inference scratch: ~1.9 MB (shared pool)
- Transcript: up to 1 MB
- Total: ~4 MB per session, ~80 MB for 20 concurrent sessions (excluding model)

**Model memory:** whisper.cpp models are loaded once and shared across all sessions.

### Compatible Models

All models are downloaded from **[ggerganov/whisper.cpp on Hugging Face](https://huggingface.co/ggerganov/whisper.cpp/tree/main)** in GGML format.

#### Standard models

| Model | File | Size | RAM | CPU Latency¹ | Languages | Download |
|-------|------|------|-----|-------------|-----------|----------|
| Tiny (EN) | `ggml-tiny.en.bin` | 75 MB | ~200 MB | ~1s | English | [⬇](https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-tiny.en.bin) |
| Tiny | `ggml-tiny.bin` | 75 MB | ~200 MB | ~1s | 99 languages | [⬇](https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-tiny.bin) |
| Base (EN) | `ggml-base.en.bin` | 142 MB | ~350 MB | ~3s | English | [⬇](https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin) |
| Base | `ggml-base.bin` | 142 MB | ~350 MB | ~3s | 99 languages | [⬇](https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.bin) |
| Small (EN) | `ggml-small.en.bin` | 466 MB | ~1 GB | ~8s | English | [⬇](https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.en.bin) |
| Small | `ggml-small.bin` | 466 MB | ~1 GB | ~8s | 99 languages | [⬇](https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin) |
| Medium (EN) | `ggml-medium.en.bin` | 1.5 GB | ~2.5 GB | ~20s | English | [⬇](https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-medium.en.bin) |
| Medium | `ggml-medium.bin` | 1.5 GB | ~2.5 GB | ~20s | 99 languages | [⬇](https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-medium.bin) |
| Large v3 | `ggml-large-v3.bin` | 3 GB | ~5 GB | ~50s | 99 languages | [⬇](https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large-v3.bin) |
| Large v3 Turbo | `ggml-large-v3-turbo.bin` | 1.6 GB | ~3 GB | ~15s | 99 languages | [⬇](https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large-v3-turbo.bin) |

¹ *Approximate CPU latency for a 5-second audio window on a 12-core ARM CPU. GPU (CUDA) is 10–50× faster.*

#### Quantized models (smaller, faster, slightly lower accuracy)

Quantized variants use less RAM and run faster with minimal quality loss:

| Quantization | Size reduction | Example |
|-------------|---------------|---------|
| Q8_0 | ~50% smaller | `ggml-large-v3-turbo-q8_0.bin` [⬇](https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large-v3-turbo-q8_0.bin) |
| Q5_0 | ~65% smaller | `ggml-large-v3-q5_0.bin` [⬇](https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large-v3-q5_0.bin) |

Browse all available models: **[huggingface.co/ggerganov/whisper.cpp](https://huggingface.co/ggerganov/whisper.cpp/tree/main)**

#### Special models

| Model | Description | Download |
|-------|-------------|----------|
| `ggml-small.en-tdrz.bin` | Small English + speaker diarization (tinydiarize) | [⬇](https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.en-tdrz.bin) |

### Changing Models

**1. Download a model:**

```bash
# English-only (faster, recommended for English)
curl -L -o models/ggml-base.en.bin \
  https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin

# Multilingual (supports 99 languages)
curl -L -o models/ggml-large-v3-turbo.bin \
  https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large-v3-turbo.bin

# Quantized (smaller + faster, good for production)
curl -L -o models/ggml-large-v3-turbo-q8_0.bin \
  https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large-v3-turbo-q8_0.bin
```

**2. Set the model path** and restart:

```bash
# Docker
docker run -e WHISPER_MODEL_PATH=/models/ggml-base.en.bin ...

# Kubernetes
kubectl -n whisperx set env deployment/whisperx-server \
  WHISPER_MODEL_PATH=/models/ggml-base.en.bin
kubectl -n whisperx rollout restart deployment whisperx-server

# server.toml
[model]
path = "/models/ggml-base.en.bin"
```

The server loads one model at startup. Switching models requires a restart. `.en` models are English-only and faster.

---

## Configuration

All settings via environment variables (or `server.toml` with `WSS_CONFIG_PATH`). Environment variables take precedence over the config file.

| Variable | Default | Description |
|----------|---------|-------------|
| `WHISPER_MODEL_PATH` | *(required)* | Path to GGML model file |
| `WSS_API_KEY` | *(empty = dev mode)* | API key for authentication |
| `WSS_PORT` | `9090` | Server listen port |
| `WSS_HOST` | `0.0.0.0` | Server bind address |
| `WSS_MAX_SESSIONS` | `20` | Maximum concurrent sessions |
| `WSS_LANGUAGE` | `en` | Default language |
| `WSS_BEAM_SIZE` | `5` | Whisper beam search size |
| `WSS_INFERENCE_THREADS` | `4` | Threads per inference call |
| `WSS_WINDOW_DURATION_MS` | `20000` | Default window duration |
| `WSS_OVERLAP_DURATION_MS` | `2000` | Default window overlap |
| `WSS_LOG_LEVEL` | `info` | Log level (trace/debug/info/warn/error) |
| `WSS_CONFIG_PATH` | `config/server.toml` | Path to TOML config file |

---

## Health Check

```
GET /health     # liveness probe
GET /ready      # readiness probe (checks model loaded + queue capacity)
```

Returns JSON (no authentication required):

```json
// /health
{"status": "ok", "active_sessions": 3, "max_sessions": 20, "inference_pending": 1}

// /ready
{"status": "ready", "model_ready": true, "queue_ok": true, "sessions_available": true}
```

---

## Prometheus Metrics

```
GET /metrics
```

Returns metrics in [Prometheus text format](https://prometheus.io/docs/instrumenting/exposition_formats/) (no authentication required). Scrape interval recommendation: 15s.

### Gauges (current state)

| Metric | Description |
|--------|-------------|
| `openasr_active_sessions` | Current number of transcription sessions |
| `openasr_active_connections` | Current WebSocket connections |
| `openasr_inference_queue_depth` | Inference jobs waiting in queue |

### Counters (monotonically increasing)

| Metric | Description |
|--------|-------------|
| `openasr_connections_total` | Total WebSocket connections |
| `openasr_connections_rejected_auth_total` | Connections rejected (401 Unauthorized) |
| `openasr_connections_rejected_limit_total` | Connections rejected (limit reached) |
| `openasr_sessions_created_total` | Sessions created |
| `openasr_sessions_destroyed_total` | Sessions destroyed |
| `openasr_audio_bytes_received_total` | Audio data received (bytes) |
| `openasr_audio_chunks_received_total` | Binary WebSocket frames received |
| `openasr_inference_jobs_submitted_total` | Inference jobs submitted to thread pool |
| `openasr_inference_jobs_completed_total` | Inference jobs completed successfully |
| `openasr_inference_jobs_dropped_total` | Inference jobs dropped (queue full) |
| `openasr_transcription_segments_total` | Transcription segments produced |
| `openasr_errors_total` | Errors sent to clients |
| `openasr_backpressure_events_total` | Backpressure signals sent |

### Histograms (latency distribution)

| Metric | Buckets | Description |
|--------|---------|-------------|
| `openasr_inference_duration_seconds` | 0.1, 0.25, 0.5, 1, 2.5, 5, 10, 30, 60, 120s | Per-window inference time |
| `openasr_audio_window_duration_seconds` | 1, 2, 5, 10, 20, 30, 60s | Audio window size |

### Prometheus scrape config

```yaml
# prometheus.yml
scrape_configs:
  - job_name: openasr
    scrape_interval: 15s
    static_configs:
      - targets: ["openasr-server:9090"]
```

### Example Grafana queries

```promql
# Request rate (connections/sec)
rate(openasr_connections_total[5m])

# Inference latency p95
histogram_quantile(0.95, rate(openasr_inference_duration_seconds_bucket[5m]))

# Error rate (%)
rate(openasr_errors_total[5m]) / rate(openasr_connections_total[5m]) * 100

# Audio throughput (MB/sec)
rate(openasr_audio_bytes_received_total[5m]) / 1024 / 1024

# Queue saturation
openasr_inference_queue_depth / 100  # queue limit is 100
```

---

## Kubernetes Deployment

```bash
# Local development
kubectl apply -f k8s/local/all-in-one.yaml

# Production (customize first)
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/pvc.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

Health probes are configured for `/health` on port 9090.

---

## Python Client Example

```python
import asyncio, json, wave, websockets

async def transcribe(wav_path, api_key):
    headers = {"Authorization": f"Bearer {api_key}"}
    async with websockets.connect("ws://localhost:9090/transcribe",
                                   additional_headers=headers) as ws:
        # Configure session
        with wave.open(wav_path) as wf:
            sample_rate = wf.getframerate()
            pcm = wf.readframes(wf.getnframes())

        await ws.send(json.dumps({
            "type": "speech.config",
            "payload": {
                "language": "en",
                "sample_rate": sample_rate,
                "encoding": "pcm_s16le",
                "window_duration_ms": 5000,
                "overlap_duration_ms": 500
            }
        }))
        ack = json.loads(await ws.recv())
        print(f"Session: {ack['payload']['session_id']}")

        # Stream audio as binary frames
        chunk_size = sample_rate * 2 // 5  # 200ms chunks
        for i in range(0, len(pcm), chunk_size):
            await ws.send(pcm[i:i+chunk_size])

        # Collect results
        while True:
            msg = json.loads(await asyncio.wait_for(ws.recv(), timeout=120))
            if msg["type"] == "speech.hypothesis":
                print(f"  Partial: {msg['payload']['text']}")
            elif msg["type"] == "speech.checkpoint":
                print(f"  Transcript: {msg['payload']['full_transcript']}")

asyncio.run(transcribe("audio.wav", "your-api-key"))
```

A full-featured test client is included at `tools/test_client.py`.

---

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full system design, threading model, memory management strategy, and protocol specification.

## License

MIT
