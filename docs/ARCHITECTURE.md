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
  - Based on an async networking library (e.g., Boost.Asio + Beast or uWebSockets)
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
  - Uses contiguous buffers (e.g., `std::vector<int16_t>`) to minimize allocations

- **Transcription Backend Interface**
  - Abstracts the model runtime:
    - WhisperX, Faster‑Whisper, or others
  - Implementations may:
    - Call an external microservice (HTTP/gRPC)
    - Or embed Python via PyBind11 (optional, but heavier)

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

    struct Config {
        std::string language;
        int sampleRate;
        std::string modelId;
    };

    struct Segment {
        int64_t startMs;
        int64_t endMs;
        std::string text;
        std::string speaker; // optional
    };

    struct Result {
        std::vector<Segment> segments;
        bool isFinal;
    };

    virtual void initialize(const Config& config) = 0;

    virtual Result transcribeWindow(
        const int16_t* samples,
        size_t sampleCount,
        int64_t windowStartMs
    ) = 0;
};
```

- **Design goals:**
  - Pointer + length instead of `std::vector` to allow zero‑copy and custom allocators
  - Backend implementations can be swapped at link time or via factory + env vars

### 5.2 Backend implementations

- `WhisperXBackend`
  - Calls an external Python/WhisperX service (HTTP/gRPC)
  - Keeps C++ server lean and close to machine code
- `FasterWhisperBackend`
  - Calls a C++/CTranslate2 service or library
- `MockBackend`
  - For tests and benchmarks

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
    - 16 kHz, 16‑bit mono ≈ 32 KB per second
    - For 30 s window + overlap, per session buffer ≈ ~1–2 MB
    - 20 sessions → ~20–40 MB for raw audio
  - Transcripts + metadata: small compared to audio
  - Recommended: **16 GB RAM** to accommodate backend + overhead
- **GPU:**
  - Offloaded to backend service (not in this process) to keep this server lean

---

## 7. Dependencies & build

### 7.1 Core dependencies

- **C++ standard:** C++20
- **Networking / WebSocket:**
  - Option A: Boost.Asio + Boost.Beast
  - Option B: uWebSockets (very lean, high‑performance)
- **JSON:**
  - `nlohmann/json` (header‑only)
- **Logging:**
  - `spdlog` (header‑only)
- **Config:**
  - `toml++` or `yaml-cpp` (optional)

### 7.2 Build system

- **CMake** (3.20+)
- Targets:
  - `transcription_server` (main binary)
  - `backend_mock` (test)
  - `backend_whisperx_client` (optional)

### 7.3 Project layout

```text
/whisperx-streaming-server
  /src
    main.cpp
    websocket_server.cpp
    session_manager.cpp
    buffer_engine.cpp
    result_aggregator.cpp
    checkpoint_manager.cpp
    backend_interface.hpp
    backend_whisperx_client.cpp
    backend_mock.cpp
  /include
    config.hpp
    protocol.hpp
  /docker
    Dockerfile.base
    Dockerfile.whisperx-client
  /config
    server.toml
  /docs
    ARCHITECTURE.md
    PROTOCOL.md
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

# WhisperX Streaming Transcription Server – WebSocket Protocol

## 1. Transport

- **Protocol:** WebSocket over TCP
- **Encoding:**
  - Control messages: JSON (UTF‑8)
  - Audio: binary frames (raw PCM or encoded), referenced by JSON metadata
- **Connection:**
  - URL example: `wss://host/transcribe`

---

## 2. Common envelope

All JSON messages share this structure:

```json
{
  "type": "STRING",
  "session_id": "STRING",
  "payload": { }
}
```

- `type`: message type (see below)
- `session_id`: unique session identifier (string)
- `payload`: type‑specific content

---

## 3. Message types

### 3.1 `HELLO` (client → server)

Initialize or resume a session.

```json
{
  "type": "HELLO",
  "session_id": null,
  "payload": {
    "language": "en",
    "sample_rate": 16000,
    "buffer_config": {
      "window_duration_ms": 20000,
      "overlap_duration_ms": 2000
    },
    "resume_from_checkpoint": false,
    "checkpoint": null,
    "backend_model_id": "whisper-large-v3"
  }
}
```

For resume:

```json
{
  "type": "HELLO",
  "session_id": "previous-session-id-or-new",
  "payload": {
    "language": "en",
    "sample_rate": 16000,
    "buffer_config": {
      "window_duration_ms": 20000,
      "overlap_duration_ms": 2000
    },
    "resume_from_checkpoint": true,
    "checkpoint": {
      "session_id": "abc123",
      "last_audio_ms": 620000,
      "last_text_offset": 45678,
      "full_transcript": "Hello everyone ...",
      "buffer_config": {
        "window_duration_ms": 20000,
        "overlap_duration_ms": 2000
      },
      "backend_model_id": "whisper-large-v3"
    },
    "backend_model_id": "whisper-large-v3"
  }
}
```

---

### 3.2 `HELLO_ACK` (server → client)

```json
{
  "type": "HELLO_ACK",
  "session_id": "abc123",
  "payload": {
    "effective_buffer_config": {
      "window_duration_ms": 20000,
      "overlap_duration_ms": 2000
    },
    "checkpoint": {
      "session_id": "abc123",
      "last_audio_ms": 620000,
      "last_text_offset": 45678,
      "full_transcript": "Hello everyone ...",
      "buffer_config": {
        "window_duration_ms": 20000,
        "overlap_duration_ms": 2000
      },
      "backend_model_id": "whisper-large-v3"
    }
  }
}
```

---

### 3.3 `AUDIO_CHUNK` (client → server)

JSON metadata + binary frame.

JSON:

```json
{
  "type": "AUDIO_CHUNK",
  "session_id": "abc123",
  "payload": {
    "chunk_id": 42,
    "timestamp_ms": 605000,
    "encoding": "pcm_s16le",
    "duration_ms": 200
  }
}
```

Binary frame:

- Raw PCM 16‑bit little‑endian, mono, at `sample_rate`
- Or another agreed encoding (e.g., Opus) if negotiated out‑of‑band

---

### 3.4 `PARTIAL_TRANSCRIPT` (server → client)

```json
{
  "type": "PARTIAL_TRANSCRIPT",
  "session_id": "abc123",
  "payload": {
    "window_start_ms": 600000,
    "window_end_ms": 620000,
    "segments": [
      {
        "start_ms": 601200,
        "end_ms": 608900,
        "text": "Hello everyone, thanks for joining...",
        "speaker": "SPEAKER_1"
      }
    ],
    "is_stable": false
  }
}
```

- `is_stable`:
  - `false`: may change as more context arrives
  - `true`: considered stable (e.g., after alignment)

---

### 3.5 `FINAL_TRANSCRIPT` (server → client)

```json
{
  "type": "FINAL_TRANSCRIPT",
  "session_id": "abc123",
  "payload": {
    "segments": [
      {
        "start_ms": 0,
        "end_ms": 7200000,
        "text": "Full aligned transcript...",
        "speaker": "SPEAKER_1"
      }
    ]
  }
}
```

---

### 3.6 `CHECKPOINT` (server → client)

```json
{
  "type": "CHECKPOINT",
  "session_id": "abc123",
  "payload": {
    "session_id": "abc123",
    "last_audio_ms": 620000,
    "last_text_offset": 45678,
    "full_transcript": "Hello everyone ...",
    "buffer_config": {
      "window_duration_ms": 20000,
      "overlap_duration_ms": 2000
    },
    "backend_model_id": "whisper-large-v3"
  }
}
```

- Client is expected to **store this checkpoint** if it wants to resume later, possibly on a different server instance.

---

### 3.7 `END` (client → server)

```json
{
  "type": "END",
  "session_id": "abc123",
  "payload": {}
}
```

- Signals that no more audio will be sent for this session.

---

### 3.8 `ERROR` (server → client)

```json
{
  "type": "ERROR",
  "session_id": "abc123",
  "payload": {
    "code": "BUFFER_OVERFLOW",
    "message": "Session exceeded maximum buffered duration"
  }
}
```

---

## 4. Configuration knobs (for tuning)

- `window_duration_ms`  
- `overlap_duration_ms`  
- `max_buffered_duration_ms` (per session)  
- `max_sessions`  
- `backend_model_id`  

These can be:

- Provided in `HELLO`
- Overridden by server policy
- Exposed via config file (`server.toml`)

---
