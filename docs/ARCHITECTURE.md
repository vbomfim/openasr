### `ARCHITECTURE.md`

# WhisperX Streaming Transcription Server – Architecture

## 1. Overview

**Goal:**  
A lean, low‑overhead C++20 WebSocket server that ingests real‑time audio, buffers it into configurable windows, calls a WhisperX‑based backend, and streams transcripts back.  

**Design priorities:**

- Non‑blocking, event‑driven I/O (no per‑connection blocking threads)
- Memory‑efficient chunk handling (zero‑copy where possible)
- Checkpoints include **transcription state** so another instance can resume
- No mandatory local persistence (stateless from the node’s perspective)
- Pluggable model backends via minimal C++ interfaces
- Docker‑friendly for building images with different models

---

## 2. High-level architecture

### 2.1 Components

- **WebSocket Gateway**
  - Based on uWebSockets (async, event‑driven, high‑performance)
  - Handles:
    - Connection lifecycle
    - JSON control messages
    - Binary audio frames
  - Uses a small, fixed thread pool (e.g., N I/O threads)

- **Session Manager**
  - Maintains per‑session state in memory:
    - Audio buffer metadata
    - Buffering configuration
    - Transcription progress
    - Checkpoint data (including transcript)
  - Uses lock‑free or fine‑grained structures to avoid contention
  - Stateless across nodes: session state can be serialized and sent elsewhere if needed

- **Buffering & Windowing Engine**
  - Aggregates small audio chunks into windows:
    - `window_duration_ms` (configurable)
    - `overlap_duration_ms` (configurable)
  - Emits windows to the backend via a work queue
  - Uses contiguous buffers (`AudioRingBuffer` with `float[]`) to minimize allocations

- **Transcription Backend Interface**
  - Abstracts the model runtime via `ITranscriptionBackend`
  - Single implementation: **WhisperCppBackend**
    - Embeds whisper.cpp directly (pure C++, no Python)
    - Model loaded once, `whisper_state` pooled for concurrent inference
    - Supports CPU and GPU (CUDA/Vulkan on Linux)

- **Result Aggregator**
  - Merges overlapping window results
  - Deduplicates segments
  - Maintains a **growing transcript** per session
  - Produces:
    - Partial segments
    - Final transcript

- **Checkpoint Manager**
  - Produces **in‑memory checkpoint objects**:
    - Audio position
    - Full transcript so far
    - Buffer configuration
    - Backend model ID
  - Checkpoints are:
    - Sent to the client (so the client can store them)
    - Optionally forwarded to an external store (Redis, etc.) by another service
  - No disk I/O required in this server

---

## 3. Concurrency model

- **I/O layer:**
  - Event‑driven, async WebSocket
  - A small number of threads (e.g., equal to hardware concurrency)
  - Each thread runs an event loop (Asio or equivalent)

- **Per‑session processing:**
  - Audio chunks appended to per‑session buffers using lock‑free queues or per‑session mutexes
  - Window creation and backend calls dispatched to a worker pool:
    - Worker threads handle CPU‑side preprocessing and backend RPC
  - No blocking operations on I/O threads

- **Backpressure:**
  - Per‑session queue size limits
  - If a session exceeds limits, server can:
    - Drop oldest chunks
    - Or signal overload to client

---

## 4. Buffering, windowing, and checkpoints

### 4.1 Buffering & windowing

- **Configurable parameters:**
  - `window_duration_ms` (e.g., 5000–30000)
  - `overlap_duration_ms` (e.g., 500–5000)
- **Algorithm:**
  - Maintain a timeline of audio samples per session
  - When enough samples accumulate:
    - Build a window `[window_start_ms, window_end_ms]`
    - Schedule it for transcription
    - Advance `window_start_ms` by `window_duration_ms - overlap_duration_ms`

### 4.2 Checkpoints

- **Checkpoint contents:**

```cpp
struct Checkpoint {
    std::string sessionId;
    int64_t lastAudioMs;
    int64_t lastTextOffset;
    std::string fullTranscript;   // concatenated or structured
    BufferConfig bufferConfig;
    std::string backendModelId;
};
```

- **Behavior:**
  - After each processed window:
    - Update `fullTranscript` with new segments
    - Update `lastAudioMs` and `lastTextOffset`
    - Emit a `CHECKPOINT` message to the client
  - On resume:
    - Client sends `HELLO` with `resume_from_checkpoint` and a checkpoint payload
    - Server reconstructs session state from that checkpoint (no local storage needed)

---

## 5. Model backend abstraction

### 5.1 Interface

```cpp
class ITranscriptionBackend {
public:
    virtual ~ITranscriptionBackend() = default;

    struct BackendConfig {
        std::string language;
        int sample_rate;
        std::string model_id;
        std::string model_path;
        int beam_size;
        int n_threads;
    };

    struct Segment {
        int64_t start_ms;
        int64_t end_ms;
        std::string text;
        std::string speaker; // empty if no diarization
    };

    struct TranscriptionResult {
        std::vector<Segment> segments;
        bool is_final;
    };

    virtual bool initialize(const BackendConfig& config) = 0;

    // Pointer + length API for zero‑copy
    virtual TranscriptionResult transcribe(
        const float* samples,
        size_t sample_count,
        int64_t window_start_ms
    ) = 0;

    virtual bool is_ready() const = 0;
};
```

- **Design goals:**
  - `const float*` + `size_t` instead of `std::vector` to allow zero‑copy from ring buffer
  - RAII pooling of `whisper_state` ensures no resource leaks on exceptions

### 5.2 Backend implementation

- `WhisperCppBackend`
  - Embeds [whisper.cpp](https://github.com/ggerganov/whisper.cpp) (GGML‑based, pure C/C++)
  - Model (`whisper_context`) loaded once at startup and shared across sessions
  - `whisper_state` objects pooled (one per inference thread) with RAII checkout/checkin
  - Supports all GGML model formats: tiny, base, small, medium, large‑v3
  - GPU acceleration via CUDA or Vulkan (Linux), Metal (macOS) — compile‑time flags
  - No external services, no Python, no network calls

---

## 6. Scaling & resource requirements

### 6.1 Target

- At least **20 concurrent sessions**
- Each session: up to 2‑hour audio

### 6.2 Resource assumptions (per node)

- **CPU:**
  - 8–16 cores
  - I/O threads: 2–4
  - Worker threads: remaining cores
- **RAM:**
  - Audio buffers:
    - 16 kHz, float32 mono ≈ 64 KB per second
    - For 30 s ring buffer per session ≈ ~1.9 MB
    - 20 sessions → ~38 MB for raw audio
  - Transcripts: up to 1 MB per session (capped)
  - Model: 200 MB (tiny) to 5 GB (large‑v3)
  - Recommended: **8–16 GB RAM** depending on model
- **GPU:**
  - Optional: whisper.cpp supports CUDA, Vulkan (Linux) and Metal (macOS)
  - Enable via CMake flags: `WHISPER_CUDA=ON` or `WHISPER_VULKAN=ON`
  - GPU inference is 10–50× faster than CPU for large models

---

## 7. Dependencies & build

### 7.1 Core dependencies

- **C++ standard:** C++20
- **Networking / WebSocket:**
  - uWebSockets (lean, high‑performance, header‑only C++ with uSockets C library)
- **Inference:**
  - whisper.cpp (git submodule, GGML‑based)
- **Audio:**
  - libopus (Opus decoding)
  - libsamplerate (resampling to 16 kHz)
- **JSON:**
  - `nlohmann/json` (header‑only, FetchContent)
- **Logging:**
  - `spdlog` (header‑only, FetchContent)
- **Config:**
  - `toml++` (header‑only, FetchContent)

### 7.2 Build system

- **CMake** (3.20+)
- Single target: `transcription_server`
- Security‑hardened compiler flags (scoped to project code only):
  - `-Wall -Wextra -Wpedantic -Werror`
  - `-fstack-protector-strong -D_FORTIFY_SOURCE=2`
  - `-Wl,-z,relro -Wl,-z,now` (Linux)

### 7.3 Project layout

```text
/whisperx-streaming-server
  CMakeLists.txt
  /src
    main.cpp
    /server
      websocket_server.hpp      # WebSocket gateway, auth, routing
      connection.hpp            # Per-connection state machine
    /session
      session_manager.hpp       # Session lifecycle
      session.hpp               # Per-session state (owns pipeline + buffer)
    /audio
      audio_ring_buffer.hpp     # Fixed-capacity ring buffer (zero-copy)
      buffer_engine.hpp         # Windowing logic
      audio_pipeline.hpp        # Decode → normalize → resample → buffer
      opus_decoder.hpp          # libopus RAII wrapper
      resampler.hpp             # libsamplerate RAII wrapper
      audio_utils.hpp           # PCM int16 → float32 conversion
    /transcription
      backend_interface.hpp     # ITranscriptionBackend ABC
      whisper_backend.hpp       # whisper.cpp integration + state pool
      inference_pool.hpp        # Dedicated inference thread pool
    /aggregation
      result_aggregator.hpp     # Overlap deduplication
    /protocol
      messages.hpp              # Message types + JSON serialization
      validator.hpp             # Input validation
    /config
      config.hpp                # TOML + env var configuration
  /include
    common.hpp                  # Type aliases, constants
    object_pool.hpp             # Generic thread-safe object pool
  /third_party
    /whisper.cpp                # Git submodule
    /uWebSockets                # Git submodule
  /docker
    Dockerfile                  # Multi-stage build (Ubuntu 24.04)
  /k8s
    /local                      # Local K8s testing manifests
  /config
    server.toml                 # Default configuration
  /tools
    test_client.py              # Python WebSocket test client
  /docs
    ARCHITECTURE.md
```

---

## 8. Sequence diagrams

### 8.1 Session start & streaming

```mermaid
sequenceDiagram
    participant C as Client
    participant WS as WebSocket Gateway
    participant SM as Session Manager
    participant BF as Buffer/Window Engine
    participant BE as Backend
    participant CP as Checkpoint Manager

    C->>WS: HELLO (new or resume + optional checkpoint)
    WS->>SM: createOrResumeSession()
    SM->>CP: restoreFromCheckpoint()
    CP-->>SM: sessionState
    SM-->>WS: HELLO_ACK

    loop Streaming audio
        C->>WS: AUDIO_CHUNK (binary)
        WS->>SM: onChunk()
        SM->>BF: appendChunk()
        BF-->>SM: windowReady? (if enough audio)
        alt window ready
            SM->>BE: transcribeWindow(window)
            BE-->>SM: Result (segments)
            SM->>CP: updateCheckpoint(segments)
            CP-->>SM: checkpoint
            SM-->>WS: PARTIAL_TRANSCRIPT
            SM-->>WS: CHECKPOINT
        end
    end

    C->>WS: END
    WS->>SM: endSession()
    SM->>BE: finalize()
    BE-->>SM: final Result
    SM->>CP: finalizeCheckpoint()
    CP-->>SM: finalCheckpoint
    SM-->>WS: FINAL_TRANSCRIPT
    SM-->>WS: CHECKPOINT
```

### 8.2 Resume on a different instance

```mermaid
sequenceDiagram
    participant C as Client
    participant WS2 as WebSocket Gateway (new instance)
    participant SM2 as Session Manager
    participant CP2 as Checkpoint Manager

    C->>WS2: HELLO (resume_from_checkpoint=true, checkpoint payload)
    WS2->>SM2: resumeSession(checkpoint)
    SM2->>CP2: loadFromClientCheckpoint()
    CP2-->>SM2: reconstructedState
    SM2-->>C: HELLO_ACK (with effective config)
    Note over C,SM2: Client resumes sending AUDIO_CHUNK from last_audio_ms
```

---

---

### `PROTOCOL.md`

# WhisperX Streaming Transcription Server – Azure-Aligned WebSocket Protocol

## 1. Transport

- **Protocol:** WebSocket over TCP
- **Encoding:**
  - Control messages: JSON text frames (UTF‑8)
  - Audio: binary frames (raw PCM — no per-chunk JSON metadata)
- **Connection:**
  - URL: `wss://host/transcribe`

---

## 2. Common envelope

All JSON messages share this structure:

```json
{
  "type": "speech.<event>",
  "payload": { }
}
```

- `type`: dot-namespaced event type (see below)
- `payload`: event‑specific content

---

## 3. Session flow

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Server

    C->>S: speech.config (JSON text frame)
    S->>C: speech.config.ack (JSON text frame)

    loop Continuous audio streaming
        C->>S: binary frame (raw PCM)
        S-->>C: speech.hypothesis (interim)
        S-->>C: speech.phrase (final)
        S-->>C: speech.checkpoint (periodic)
        S-->>C: speech.backpressure (if needed)
    end

    C->>S: speech.end (JSON text frame)
    S->>C: speech.phrase (final)
    S->>C: speech.checkpoint (final)
```

---

## 4. Message types

### 4.1 `speech.config` (client → server)

Initialize a session. Sent once after connecting.

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

To resume from a previous checkpoint, pass the checkpoint object received from the server:

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
    "resume_checkpoint": {
      "session_id": "abc123",
      "last_audio_ms": 620000,
      "last_text_offset": 45678,
      "transcript": "Hello everyone ..."
    }
  }
}
```

---

### 4.2 `speech.config.ack` (server → client)

Confirms session is ready. The client must wait for this before sending audio.

```json
{
  "type": "speech.config.ack",
  "payload": {
    "session_id": "abc123",
    "effective_config": {
      "sample_rate": 16000,
      "encoding": "pcm_s16le",
      "window_duration_ms": 5000,
      "overlap_duration_ms": 500,
      "model_id": "whisper-large-v3"
    }
  }
}
```

---

### 4.3 Binary frames (client → server)

After receiving `speech.config.ack`, the client streams audio as **continuous binary WebSocket frames** containing raw PCM data.

- Format: 16‑bit little‑endian, mono, at the configured `sample_rate`
- No per-chunk JSON metadata — the server tracks timing from the byte stream
- Recommended chunk size: 200ms of audio (e.g., 6400 bytes at 16kHz)

---

### 4.4 `speech.hypothesis` (server → client)

Interim (partial) transcription result. May be revised as more audio arrives.

```json
{
  "type": "speech.hypothesis",
  "payload": {
    "offset_ms": 1200,
    "duration_ms": 3400,
    "text": "Hello everyone, thanks for"
  }
}
```

---

### 4.5 `speech.phrase` (server → client)

Final transcription result for a segment. Will not change.

```json
{
  "type": "speech.phrase",
  "payload": {
    "offset_ms": 1200,
    "duration_ms": 7700,
    "text": "Hello everyone, thanks for joining today.",
    "confidence": 0.94
  }
}
```

---

### 4.6 `speech.checkpoint` (server → client)

Periodic session state snapshot. Store this to resume the session later.

```json
{
  "type": "speech.checkpoint",
  "payload": {
    "session_id": "abc123",
    "last_audio_ms": 620000,
    "last_text_offset": 45678,
    "transcript": "Hello everyone ..."
  }
}
```

---

### 4.7 `speech.backpressure` (server → client)

Flow control signal. The client should slow down or pause sending audio.

```json
{
  "type": "speech.backpressure",
  "payload": {
    "buffered_ms": 15000,
    "max_buffered_ms": 20000,
    "action": "pause"
  }
}
```

- `action`: `"pause"` (stop sending) or `"resume"` (continue sending)

---

### 4.8 `speech.end` (client → server)

Signals that no more audio will be sent.

```json
{
  "type": "speech.end",
  "payload": {}
}
```

---

### 4.9 `speech.error` (server → client)

```json
{
  "type": "speech.error",
  "payload": {
    "code": "BUFFER_OVERFLOW",
    "message": "Session exceeded maximum buffered duration"
  }
}
```

---

## 5. Configuration knobs (for tuning)

- `sample_rate` — audio sample rate in Hz
- `encoding` — audio encoding (e.g., `pcm_s16le`)
- `window_duration_ms` — transcription window size
- `overlap_duration_ms` — overlap between windows
- `model_id` — backend model identifier

These can be:

- Provided in `speech.config`
- Overridden by server policy
- Exposed via config file (`server.toml`)

---
