# OpenASR — Streaming Speech-to-Text Server

A production-grade, memory-efficient C++20 WebSocket server for real-time audio transcription, powered by [whisper.cpp](https://github.com/ggerganov/whisper.cpp). The protocol is aligned with Azure Cognitive Services Speech-to-Text conventions.

## Features

- **Embedded Whisper inference** — pure C++, no Python dependencies
- **WebSocket streaming** — Azure-style protocol with continuous binary audio
- **PCM and Opus audio** at any sample rate (8–96 kHz, resampled internally to 16 kHz)
- **Stateless checkpointing** — resume sessions on any server node
- **API key authentication** — Bearer token in header
- **Kubernetes-ready** — multi-stage Docker image, health checks, Helm-friendly

---

## Quick Start

### Docker

```bash
# Build the image
docker build -t openasr -f docker/Dockerfile .

# Run with a model (download from https://huggingface.co/ggerganov/whisper.cpp)
docker run -p 9090:9090 \
  -v /path/to/models:/models \
  -e WHISPER_MODEL_PATH=/models/ggml-large-v3.bin \
  -e WSS_API_KEY=your-secret-key \
  openasr
```

### From Source

```bash
mkdir build && cd build
cmake .. -DCMAKE_BUILD_TYPE=Release
cmake --build . -j$(nproc)

WHISPER_MODEL_PATH=/path/to/ggml-large-v3.bin ./transcription_server
```

---

## WebSocket Protocol

### Endpoint

```
ws://host:9090/transcribe
```

### Authentication

Every WebSocket connection must be authenticated (unless `WSS_API_KEY` is unset for dev mode).

| Method | Example |
|--------|---------|
| **Bearer token** | `Authorization: Bearer your-api-key` header on WebSocket upgrade |

Query string authentication is **not supported** — API keys in URLs are logged by proxies and intermediaries.

Unauthenticated connections receive `HTTP 401 Unauthorized` before the WebSocket handshake completes.

### Connection Flow

```
Client                              Server
  │                                    │
  │──── WebSocket upgrade ────────────►│  (auth checked here)
  │◄─── 101 Switching Protocols ──────│
  │                                    │
  │──── speech.config (JSON) ─────────►│  session created
  │◄─── speech.config.ack (JSON) ─────│
  │                                    │
  │──── binary audio frame ───────────►│
  │──── binary audio frame ───────────►│  ┐
  │──── binary audio frame ───────────►│  │ continuous streaming
  │──── ...                           │  │
  │◄─── speech.hypothesis (JSON) ─────│  │ partial results
  │◄─── speech.checkpoint (JSON) ─────│  ┘ session state
  │                                    │
  │──── speech.end (JSON) ────────────►│  finalize
  │◄─── speech.phrase (JSON) ─────────│  final transcript
  │◄─── speech.checkpoint (JSON) ─────│  final checkpoint
  │                                    │
  │──── close ────────────────────────►│
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

#### `speech.phrase` — Final transcription

Sent after `speech.end`, containing the full session transcript.

```json
{
  "type": "speech.phrase",
  "session_id": "d785d7fad5ecd9ee3eed4ddeb2953e59",
  "payload": {
    "offset": 0,
    "duration": 6842,
    "text": "Hello, this is a test of the Whisper streaming transcription server. The quick brown fox jumps over the lazy dog.",
    "confidence": 1.0,
    "status": "Success"
  }
}
```

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

| Model | Size | RAM (approx) |
|-------|------|-------------|
| tiny.en | 75 MB | ~200 MB |
| base.en | 142 MB | ~350 MB |
| small.en | 466 MB | ~1 GB |
| medium.en | 1.5 GB | ~2.5 GB |
| large-v3 | 3 GB | ~5 GB |

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
GET /health
```

Returns JSON with server status (no authentication required):

```json
{
  "status": "ok",
  "active_sessions": 3,
  "max_sessions": 20,
  "inference_pending": 1
}
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
