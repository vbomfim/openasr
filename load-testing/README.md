# Azure Load Testing — OpenASR WhisperX Streaming Server

Performance and load testing suite for the [OpenASR WhisperX Streaming Server](../README.md), powered by [Azure Load Testing (ALT)](https://learn.microsoft.com/en-us/azure/app-testing/load-testing/) and [Apache JMeter](https://jmeter.apache.org/).

---

## Table of Contents

- [Goals](#goals)
- [Target Application](#target-application)
- [How It Works](#how-it-works)
- [Test Scenarios](#test-scenarios)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Running Tests](#running-tests)
- [Configuration Reference](#configuration-reference)
- [Azure DevOps Pipeline](#azure-devops-pipeline)
- [Azure Load Testing (ALT) Integration](#azure-load-testing-alt-integration)
- [Troubleshooting](#troubleshooting)
- [References](#references)

---

## Goals

1. **Validate capacity** — Confirm the server handles its designed load (20 concurrent WebSocket transcription sessions per node) without degradation.
2. **Find breaking points** — Identify the session count, audio throughput, or duration at which the server fails gracefully (not crashes).
3. **Detect regressions** — Run automated load tests in CI/CD to catch performance regressions before they reach production.
4. **Monitor stability** — Endurance tests reveal memory leaks, ring buffer exhaustion, connection pool issues, and latency drift over hours.
5. **Baseline metrics** — Establish P50/P95/P99 latency, throughput, and error rate baselines for HTTP health endpoints and WebSocket transcription.

---

## Target Application

| Attribute | Value |
|---|---|
| **Server** | C++20, uWebSockets, whisper.cpp |
| **WebSocket endpoint** | `ws://host:9090/transcribe` |
| **HTTP endpoints** | `GET /health` · `GET /ready` · `GET /metrics` (Prometheus) |
| **Protocol** | JSON control messages + binary audio frames (PCM int16 LE or Opus) |
| **Max concurrent sessions** | 20 per node (configurable via `WSS_MAX_SESSIONS`) |
| **Authentication** | Bearer token (`WSS_API_KEY`); empty = dev mode (no auth) |
| **Audio config** | 8–96 kHz sample rate, configurable inference window (default 20s) |
| **K8s deployment** | 2 replicas, 2–8 CPU cores, 4–16 GiB RAM per pod |
| **Docker images** | `ghcr.io/vbomfim/openasr:{tiny.en, base.en, large-v3-turbo, large-v3}` |

### Server Protocol

The server uses a custom WebSocket protocol. All control messages are JSON text frames; audio is sent as binary WebSocket frames.

**Message types (client → server):**

| Type | Format | Purpose |
|---|---|---|
| `speech.config` | JSON text | Session initialization — language, sample rate, encoding, window config |
| Binary frames | Raw bytes | PCM int16 LE audio chunks (or Opus) |
| `speech.end` | JSON text | Signal end of audio stream |

**Message types (server → client):**

| Type | Format | Purpose |
|---|---|---|
| `speech.config.ack` | JSON text | Session accepted — returns `session_id` and effective config |
| `speech.hypothesis` | JSON text | Partial transcription (may change) |
| `speech.phrase` | JSON text | Final transcription segment with `{text, confidence, status, duration, offset}` |
| `speech.checkpoint` | JSON text | Resumable session state — `{last_audio_ms, full_transcript, ...}` |
| `speech.backpressure` | JSON text | Flow control — `{action: "slow_down"}` or `{action: "ok"}` |
| `speech.error` | JSON text | Error — `{code: "SESSION_LIMIT" \| "INVALID_MESSAGE" \| ...}` |

**Example `speech.config` payload:**

```json
{
  "type": "speech.config",
  "session_id": null,
  "payload": {
    "language": "en",
    "sample_rate": 16000,
    "encoding": "pcm_s16le",
    "window_duration_ms": 5000,
    "overlap_duration_ms": 500
  }
}
```

> **Note:** `window_duration_ms` and `overlap_duration_ms` go at the top level of `payload`, not nested inside a `buffer_config` object. This differs from the specification in `project.md`.

---

## How It Works

### Session Workflow

Each JMeter thread simulates one complete transcription session through 7 steps:

```
 JMeter Thread (virtual user)                       OpenASR Server
 ────────────────────────────                       ──────────────
  │                                                       │
  │  ① WS Connect ws://host:port/transcribe               │
  │  ──────────────────────────────────────────────────►   │
  │  (Authorization: Bearer <token>)                      │
  │                                             101 ◄──   │
  │                                                       │
  │  ② Send speech.config (JSON text frame)               │
  │  ──────────────────────────────────────────────────►   │
  │                                                       │
  │  ③ Receive speech.config.ack                          │
  │  ◄──────────────────────────────────────────────────   │
  │  (extract session_id for later use)                   │
  │                                                       │
  │  ④ Audio Streaming Loop (N chunks)                    │
  │  ┌─────────────────────────────────────────────────┐  │
  │  │  Load audio file → split into 200ms chunks      │  │
  │  │  For each chunk:                                │  │
  │  │    Send binary frame (6400 bytes)     ────────► │  │
  │  │    Wait 200ms (real-time pacing)                │  │
  │  │                       ◄──── speech.hypothesis   │  │
  │  │                       ◄──── speech.phrase        │  │
  │  │                       ◄──── speech.checkpoint    │  │
  │  └─────────────────────────────────────────────────┘  │
  │                                                       │
  │  ⑤ Send speech.end (JSON text frame)                  │
  │  ──────────────────────────────────────────────────►   │
  │                                                       │
  │  ⑥ Read remaining results                             │
  │  ◄─── speech.phrase (status: EndOfStream)             │
  │  ◄─── speech.checkpoint (final)                       │
  │                                                       │
  │  ⑦ WS Close (status 1000)                             │
  │  ──────────────────────────────────────────────────►   │
  │                                                       │
```

### Technical Implementation

The test plans use two JMeter mechanisms to interact with WebSockets:

1. **WebSocket Samplers Plugin** (`eu.luminis.jmeter.wssampler`) — handles connection open, JSON text frame send/receive, and connection close.
2. **Groovy JSR223 Samplers** — access the plugin's internal `threadLocalCachedConnection` to send binary audio frames via `WebSocketClient.sendBinaryFrame(byte[])` and to read server responses in a loop.

This hybrid approach is necessary because the WebSocket plugin's `SingleWriteWebSocketSampler` doesn't support dynamically setting binary payloads per iteration — it reads from a static property or file. The Groovy scripts slice the audio file into chunks at runtime and send each chunk through the existing connection.

### Audio Chunking

```
Audio File (e.g., sample-short-5s.raw)
┌──────────────────────────────────────────────────────────────────┐
│  160,000 bytes  (5s × 16,000 Hz × 2 bytes/sample × 1 channel)  │
└──────────────────────────────────────────────────────────────────┘
         │
         ▼  Split into chunks of audio.chunk_size_bytes (default 6400)
┌────────┬────────┬────────┬────────┬─── ··· ───┬────────┐
│ 6400 B │ 6400 B │ 6400 B │ 6400 B │           │ 6400 B │  = 25 chunks
└────────┴────────┴────────┴────────┴─── ··· ───┴────────┘
   200ms    200ms    200ms    200ms                 200ms
         │
         ▼  Sent at real-time rate (one chunk every audio.chunk_interval_ms)
```

Each chunk represents 200ms of audio: `16000 Hz × 2 bytes × 0.2s = 6400 bytes`.

### Inference Window

The server buffers audio and runs whisper inference when a full window is ready:

```
window_duration_ms = 5000  →  window_sz = 80,000 samples
Audio chunks fill the ring buffer until window_ready = true:

  ring_total:  3200 → 6400 → ... → 76800 → 80000 ✓
                                              │
                                              ▼
                                     Inference submitted
                                     whisper_full_with_state()
                                     ~2s processing time
                                              │
                                              ▼
                                     speech.phrase sent to client
```

> **Important:** The audio file duration must be ≥ `window_duration_ms` for inference to trigger. The smoke test uses a 5s window with 5s audio. Load/stress tests use 20s windows with 30s+ audio.

---

## Test Scenarios

### Overview

| Scenario | Sessions | Ramp-up | Duration | Audio | Window | Purpose |
|---|---|---|---|---|---|---|
| [Smoke](#1-smoke-test) | 3 | 10s | 1 min | 5s | 5s | Quick roundtrip verification |
| [Load](#2-load-test) | 15–20 | 3 min | 15 min | 30s | 20s | Steady-state at capacity |
| [Stress](#3-stress-test) | 30–50 | 5 min | 15 min | 30s | 20s | Beyond capacity, graceful errors |
| [Spike](#4-spike-test) | 2→25→2 | Instant | 5 min | 5s | 5s | Burst and recovery |
| [Endurance](#5-endurance-test) | 15 | 3 min | 2 hrs | 120s | 20s | Memory leaks, drift |
| [API Benchmark](#6-api-benchmark) | 100 HTTP | 1 min | 10 min | — | — | HTTP endpoint throughput |
| [Security](#7-security-test) | 15+1+3 | 10s | 1 min | 5s | 5s | Rate limiting validation |

---

### 1. Smoke Test

**File:** `test-plans/smoke/smoke-test.jmx`

**Goal:** Quick sanity check — does the server accept connections, process audio, and return transcripts?

| Parameter | Value |
|---|---|
| Concurrent sessions | 3 |
| Ramp-up | 10s |
| Duration | 1 min |
| Audio file | `sample-short-5s.raw` (5s) |
| Window | 5000ms (fits in one window) |
| Loops per thread | 1 |

**What it does:**
- Opens 3 WebSocket connections with Bearer auth
- Each sends `speech.config`, receives `speech.config.ack`
- Streams 25 audio chunks (6400 bytes each, 200ms pacing)
- Sends `speech.end`, reads final `speech.phrase` + `speech.checkpoint`
- Closes WebSocket cleanly (status 1000)
- **In parallel:** polls `GET /health` every 5 seconds

**Pass criteria:**
- All 3 sessions complete without errors
- `speech.config.ack` received with valid `session_id`
- At least 1 `speech.phrase` received per session
- `/health` returns 200 throughout

**When to run:** Every deployment, every PR, every code change.

---

### 2. Load Test

**File:** `test-plans/load/load-test.jmx`

**Goal:** Validate performance at the server's designed capacity.

| Parameter | Value |
|---|---|
| Concurrent sessions | 20 (= `WSS_MAX_SESSIONS`) |
| Ramp-up | 3 min |
| Duration | 15 min |
| Audio file | `sample-medium-30s.raw` (30s) |
| Window | 20000ms |
| Loops per thread | Continuous (∞) |

**What it does:**
- Ramps up to 20 concurrent transcription sessions over 3 minutes
- Each session runs the full protocol: connect → config → audio → results → close
- Sessions cycle continuously (with 2–5s think time between sessions)
- Uses CSV DataSet to vary `language`, `sample_rate`, `encoding` across threads
- Monitors `/health` every 10 seconds (2 dedicated threads)

**Pass criteria:**
- Average transcription latency < 2s
- Error rate < 5%
- All sessions receive `speech.phrase` with non-empty text
- `/health` stays 200, `active_sessions` ≤ `max_sessions`

**When to run:** After smoke passes. Before production deployments.

---

### 3. Stress Test

**File:** `test-plans/stress/stress-test.jmx`

**Goal:** Find the breaking point and verify the server degrades gracefully.

| Parameter | Value |
|---|---|
| Concurrent sessions | 50 (2.5× capacity) |
| Ramp-up | 5 min |
| Duration | 15 min |
| Audio file | `sample-medium-30s.raw` (30s) |
| Window | 20000ms |

**What it does:**
- Ramps to 50 sessions, exceeding `WSS_MAX_SESSIONS=20`
- Sessions beyond capacity should receive `speech.error` with code `SESSION_LIMIT`
- A dedicated health monitor thread asserts `/health` returns 200 (server must not crash)
- Tracks `SESSION_LIMIT` error count via JMeter properties

**Pass criteria:**
- Server returns structured `SESSION_LIMIT` errors (not crashes or hangs)
- `/health` stays responsive throughout
- Sessions within capacity continue to function normally
- Error rate < 50% (sessions within capacity should succeed)

**When to run:** Manual trigger (`RUN_STRESS=true`). After load test passes.

---

### 4. Spike Test

**File:** `test-plans/spike/spike-test.jmx`

**Goal:** Test sudden traffic bursts and verify recovery.

| Phase | Sessions | Duration | Start |
|---|---|---|---|
| Baseline | 2 | 5 min (total) | t=0 |
| Spike | +23 (= 25 total) | 2 min | t=60s |
| Recovery | 2 (spike threads end) | Remaining | t=180s |

**What it does:**
- Starts with 2 baseline sessions (warm-up)
- At t=60s, 23 additional sessions burst in over 5 seconds
- Spike sessions run for 2 minutes, then stop
- Baseline sessions continue — verifies server recovers to normal
- Health monitor extracts `active_sessions` from `/health` every 3 seconds to graph the spike

**Pass criteria:**
- Baseline sessions remain healthy during and after spike
- `active_sessions` returns to baseline after spike threads end
- No lingering errors or resource exhaustion

**When to run:** After load test. Useful before autoscaling configuration.

---

### 5. Endurance Test

**File:** `test-plans/endurance/endurance-test.jmx`

**Goal:** Detect slow-burn issues over extended operation.

| Parameter | Value |
|---|---|
| Concurrent sessions | 15 |
| Ramp-up | 3 min |
| Duration | **2 hours** |
| Audio file | `sample-long-120s.raw` (120s) |
| Window | 20000ms |
| Think time | 5–15s between sessions |

**What it does:**
- Maintains 15 concurrent transcription sessions for 2 hours
- Sessions cycle continuously with varied speech configs
- A metrics monitor thread scrapes `/metrics` and `/health` every 30 seconds

**What to watch for:**
| Metric | Source | Alert Threshold |
|---|---|---|
| RSS memory growth | `/metrics` (Prometheus) | > 10% growth/hour |
| Active sessions | `/health` → `active_sessions` | Should return to 0 after sessions end |
| Inference queue depth | `/ready` | Should not grow unbounded |
| P95 response latency | JMeter aggregate | Should not degrade > 20% over time |
| WebSocket errors | JMeter error rate | Should stay < 1% |

**When to run:** Manual trigger (`RUN_ENDURANCE=true`). Before major releases.

---

### 6. API Benchmark

**File:** `test-plans/api-benchmark/api-benchmark.jmx`

**Goal:** Baseline throughput and latency for HTTP health/observability endpoints.

| Endpoint | Threads | Think Time | Duration |
|---|---|---|---|
| `GET /health` | 100 | 100ms | 10 min |
| `GET /ready` | 100 | 100ms | 10 min |
| `GET /metrics` | 50 | 500ms | 10 min |

**What it does:**
- Pure HTTP test — no WebSocket, no audio
- Three parallel thread groups hammer the health endpoints
- Asserts 200 OK on every response
- Validates `/health` returns JSON with `active_sessions`
- Validates `/metrics` returns Prometheus text format

**Pass criteria:**
- All requests return 200
- P99 latency < 50ms
- No errors under sustained HTTP load

**When to run:** Useful for K8s probe tuning and Prometheus scrape interval planning.

---

### 7. Security Test

**File:** `test-plans/security/security-test.jmx`

**Goal:** Validate that rate limiting protections work under load.

Three parallel thread groups run simultaneously:

| Thread Group | Threads | Purpose |
|---|---|---|
| **Auth Brute-Force** | 15 | Rapid connections with wrong Bearer tokens |
| **Legitimate Session** | 1 | Full transcription flow with correct auth |
| **Message Flood** | 3 | 500 binary frames per thread, no pacing |

**What it validates:**
- First ~10 auth failures return `401`, subsequent return `429 Too Many Requests`
- Legitimate session completes successfully **during** the brute-force attack
- Message flood triggers `speech.backpressure` or graceful frame dropping
- Server remains healthy throughout (no crash, no resource leak)

**Pass criteria:**
- Auth brute-force threads see 429 after initial 401s
- Legitimate session: 0 failures
- Server `/health` returns 200 after test completes

**When to run:** After deploying rate limiting changes. Part of security regression testing.

---

## Project Structure

```
load-testing/
├── README.md                              ← You are here
├── azure-pipelines.yml                    # Azure DevOps CI/CD pipeline
├── .gitignore                             # Ignores results/, *.jtl, *.log
│
├── test-plans/                            # One .jmx file per scenario
│   ├── smoke/smoke-test.jmx              # 3 sessions, 1 min
│   ├── load/load-test.jmx               # 20 sessions, 15 min
│   ├── stress/stress-test.jmx           # 50 sessions, 15 min
│   ├── spike/spike-test.jmx             # 2→25→2, 5 min
│   ├── endurance/endurance-test.jmx     # 15 sessions, 2 hrs
│   ├── api-benchmark/api-benchmark.jmx  # HTTP-only, 10 min
│   └── security/security-test.jmx      # Rate limiting validation
│
├── fragments/                             # Reusable JMeter test fragments (for ALT)
│   ├── ws-connect-and-config.jmx         # WS open + speech.config + assert ack
│   ├── ws-send-audio.jmx                # Binary audio chunk loop
│   ├── ws-receive-results.jmx           # Result listener (hypothesis/phrase/checkpoint)
│   └── ws-teardown.jmx                  # speech.end + WS close
│
├── data/                                  # Test data
│   ├── audio/                            # Generated PCM audio samples
│   │   ├── sample-short-5s.raw          # 160 KB — smoke/spike tests
│   │   ├── sample-medium-30s.raw        # 960 KB — load/stress tests
│   │   └── sample-long-120s.raw         # 3.8 MB — endurance tests
│   ├── speech-configs.csv               # Varied configs for load/endurance
│   └── auth-tokens.csv                  # Bearer tokens (placeholder)
│
├── plugins/                               # JMeter plugin JARs
│   └── jmeter-websocket-samplers-1.3.1.jar
│
├── properties/                            # Environment-specific configs
│   ├── local.properties                  # localhost:30090 (K8s NodePort)
│   ├── dev.properties                    # Dev cluster
│   ├── staging.properties                # Staging (wss + auth)
│   └── prod.properties                  # Production (smoke only!)
│
├── config/                                # Azure Load Testing YAML configs
│   ├── smoke-test.yaml                  # 1 engine instance
│   ├── load-test.yaml                   # 3 engine instances
│   ├── stress-test.yaml                 # 5 engine instances
│   └── endurance-test.yaml              # 3 engine instances
│
├── results/                               # Local test results (gitignored)
│   └── .gitkeep
│
└── scripts/                               # Helper scripts
    ├── generate-audio-samples.sh         # Generate PCM test audio (requires sox)
    ├── download-plugin.sh               # Download WebSocket Samplers plugin
    └── run-local.sh                     # Run any test locally
```

---

## Prerequisites

| Tool | Required For | Install |
|---|---|---|
| **Apache JMeter 5.6+** | Running tests locally | `brew install jmeter` |
| **sox** | Generating test audio samples | `brew install sox` |
| **JMeter WebSocket Samplers 1.3.1** | WebSocket protocol support | `./scripts/download-plugin.sh` |
| **Azure CLI + ALT extension** | Running tests on Azure | [Install guide](https://learn.microsoft.com/en-us/cli/azure/) |
| **A running OpenASR server** | Test target | Docker or K8s (see main README) |

---

## Quick Start

```bash
# 1. Generate test audio samples (requires sox)
./scripts/generate-audio-samples.sh

# 2. Download the WebSocket Samplers plugin + install into JMeter
./scripts/download-plugin.sh
cp plugins/jmeter-websocket-samplers-1.3.1.jar $(brew --prefix jmeter)/libexec/lib/ext/

# 3. Start the server (if not already running)
docker run -d -p 9090:9090 ghcr.io/vbomfim/openasr:tiny.en

# 4. Run the smoke test
./scripts/run-local.sh smoke local

# 5. View results
open results/smoke-*/report/index.html   # HTML dashboard
cat results/smoke-*/results.jtl          # Raw JTL data
```

---

## Running Tests

### Local Execution

```bash
./scripts/run-local.sh <scenario> [environment] [extra-jmeter-args...]
```

| Argument | Options | Default |
|---|---|---|
| `scenario` | `smoke`, `load`, `stress`, `spike`, `endurance`, `api-benchmark` | (required) |
| `environment` | `local`, `dev`, `staging`, `prod` | `local` |

**Examples:**

```bash
# Smoke test against local K8s
./scripts/run-local.sh smoke local

# Load test against staging
./scripts/run-local.sh load staging

# Stress test with custom session count
./scripts/run-local.sh stress local -Jconcurrent.sessions=30

# API benchmark against dev
./scripts/run-local.sh api-benchmark dev
```

**What `run-local.sh` does:**

1. Resolves the `.jmx` test plan and `.properties` file from the arguments
2. Creates a timestamped results directory under `results/`
3. Changes to the `load-testing/` directory (so fragment paths resolve correctly)
4. Runs JMeter in non-GUI (CLI) mode with the WebSocket plugin
5. Generates a JTL results file and an HTML report

### Output

Each run produces:

```
results/<scenario>-<timestamp>/
├── results.jtl      # JMeter results (CSV format)
├── jmeter.log       # Full JMeter log (including Groovy script output)
└── report/
    └── index.html   # HTML dashboard with charts and statistics
```

### Overriding Parameters

Any property can be overridden on the command line with `-J`:

```bash
# Override concurrent sessions and duration
./scripts/run-local.sh load local \
    -Jconcurrent.sessions=10 \
    -Jtest.duration.seconds=300

# Override audio file
./scripts/run-local.sh smoke local \
    -Jaudio.file=data/audio/my-real-speech.raw

# Override target host
./scripts/run-local.sh smoke local \
    -Jtarget.host=whisperx.example.com \
    -Jtarget.port=443
```

---

## Configuration Reference

### Properties Files

All test parameters are externalized into `.properties` files in `properties/`. Each scenario's `.jmx` reads these via `${__P(property.name, default)}`.

#### Connection Properties

| Property | Description | Default | Example |
|---|---|---|---|
| `target.host` | Server hostname | `localhost` | `whisperx.staging.com` |
| `target.port` | Server port | `9090` | `443` |
| `target.protocol` | Protocol (`ws` or `wss`) | `ws` | `wss` |
| `auth.enabled` | Enable Bearer auth | `false` | `true` |
| `auth.token` | Bearer token value | (empty) | `my-secret-key` |

#### Speech Configuration

These map directly to the `speech.config` payload sent to the server:

| Property | Description | Default | Valid Range |
|---|---|---|---|
| `language` | Transcription language | `en` | Any ISO 639-1 code |
| `sample_rate` | Audio sample rate (Hz) | `16000` | 8000–96000 |
| `encoding` | Audio encoding | `pcm_s16le` | `pcm_s16le`, `opus` |
| `window_duration_ms` | Inference window size | `20000` | 1000–60000 |
| `overlap_duration_ms` | Window overlap | `2000` | 0 to window_duration_ms |

#### Audio Streaming

| Property | Description | Default | Notes |
|---|---|---|---|
| `audio.file` | Path to raw PCM audio file | `data/audio/sample-short-5s.raw` | Relative to `load-testing/` |
| `audio.chunk_size_bytes` | Bytes per binary frame | `6400` | 200ms at 16kHz 16-bit mono |
| `audio.chunk_interval_ms` | Delay between chunks | `200` | Set to chunk duration for real-time |

> **Chunk size formula:** `sample_rate × bytes_per_sample × channels × (interval_ms / 1000)`
>
> Example: `16000 × 2 × 1 × 0.2 = 6400 bytes`

#### Test Execution

| Property | Description | Default | Per-Scenario Override |
|---|---|---|---|
| `concurrent.sessions` | Number of WS threads | `3` | Smoke=3, Load=20, Stress=50 |
| `ramp.up.seconds` | Time to start all threads | `10` | Smoke=10, Load=180, Stress=300 |
| `test.duration.seconds` | Total test duration | `60` | Smoke=60, Load=900, Stress=900, Endurance=7200 |

### Environment Files

| File | `target.host` | `target.port` | Auth | `audio.file` | Purpose |
|---|---|---|---|---|---|
| `local.properties` | `localhost` | `30090` | K8s dev key | `sample-short-5s.raw` | Local K8s (NodePort) |
| `dev.properties` | `whisperx-dev.internal` | `9090` | None | `sample-medium-30s.raw` | Dev cluster |
| `staging.properties` | `whisperx-staging.mycompany.com` | `443` | Bearer token | `sample-long-120s.raw` | Pre-production |
| `prod.properties` | `whisperx.mycompany.com` | `443` | Bearer token | `sample-short-5s.raw` | **Smoke only!** |

### Audio Sample Files

Generated by `./scripts/generate-audio-samples.sh`:

| File | Duration | Size | Format | Used By |
|---|---|---|---|---|
| `sample-short-5s.raw` | 5s | 160 KB | PCM 16-bit 16kHz mono | Smoke, spike |
| `sample-medium-30s.raw` | 30s | 960 KB | PCM 16-bit 16kHz mono | Load, stress |
| `sample-long-120s.raw` | 120s | 3.8 MB | PCM 16-bit 16kHz mono | Endurance |

> **Tip:** For realistic transcription results, replace synthetic audio with actual speech recordings:
> ```bash
> ffmpeg -i real-speech.wav -f s16le -acodec pcm_s16le -ar 16000 -ac 1 data/audio/sample-short-5s.raw
> ```

### CSV Data Files

| File | Columns | Purpose |
|---|---|---|
| `speech-configs.csv` | `language, sample_rate, encoding, window_duration_ms, overlap_duration_ms` | Varied configs across threads (load/endurance) |
| `auth-tokens.csv` | `token` | Bearer tokens (placeholder — populate for multi-user tests) |

---

## Azure DevOps Pipeline

### Workflow

```
                            ┌─────────────────────────────────────────────┐
                            │             azure-pipelines.yml             │
                            └─────────────────────────────────────────────┘
                                                 │
            trigger: main, release/*             │
            paths: load-testing/**               │
                                                 ▼
                    ┌──────────────────────────────────────────────┐
                    │          Stage 1: Smoke Test                 │
                    │          3 sessions · 1 min · 1 ALT engine  │
                    │          Auto-trigger on push                │
                    └──────────────────┬───────────────────────────┘
                                       │ ✅ Pass
                                       ▼
                    ┌──────────────────────────────────────────────┐
                    │          Stage 2: Load Test                  │
                    │          20 sessions · 15 min · 3 ALT engines│
                    │          Auto-trigger if smoke passes        │
                    └──────────────────┬───────────────────────────┘
                                       │ ✅ Pass
                          ┌────────────┴────────────┐
                          ▼                         ▼
  ┌────────────────────────────────────┐  ┌─────────────────────────────────┐
  │     Stage 3: Stress Test           │  │   Stage 4: Endurance Test       │
  │     50 sessions · 15 min · 5 eng   │  │   15 sessions · 2 hrs · 3 eng  │
  │     Manual: RUN_STRESS=true        │  │   Manual: RUN_ENDURANCE=true    │
  └────────────────────────────────────┘  └─────────────────────────────────┘
```

### Variables

The pipeline uses an Azure DevOps variable group `openasr-load-test-vars`:

| Variable | Description |
|---|---|
| `AZURE_SUBSCRIPTION` | Azure service connection name |
| `ALT_RESOURCE_NAME` | Azure Load Testing resource name |
| `ALT_RESOURCE_GROUP` | Resource group containing ALT resource |
| `TARGET_HOST` | Server hostname for tests |
| `TARGET_PORT` | Server port |
| `AUTH_TOKEN` | Bearer token (use Key Vault reference) |

---

## Azure Load Testing (ALT) Integration

### Config Files

Each scenario has an ALT YAML config in `config/`:

```yaml
# config/load-test.yaml
version: v0.1
testId: openasr-load-test
testPlan: test-plans/load/load-test.jmx
engineInstances: 3                    # Distributed across 3 ALT engines
configurationFiles:
  - data/audio/sample-medium-30s.raw  # Audio data → available to JMeter
  - data/speech-configs.csv
  - properties/staging.properties
zipArtifacts:
  - plugins/jmeter-websocket-samplers-1.3.1.jar   # Plugin → JMeter lib/ext/
  - fragments/ws-connect-and-config.jmx            # Fragments (if using IncludeController)
  - fragments/ws-send-audio.jmx
  - fragments/ws-receive-results.jmx
  - fragments/ws-teardown.jmx
failureCriteria:
  - avg(response_time_ms) > 2000      # Fail if avg latency > 2s
  - percentage(error) > 5             # Fail if error rate > 5%
```

### Engine Scaling

| Scenario | ALT Engines | Threads/Engine | Total Sessions |
|---|---|---|---|
| Smoke | 1 | 3 | 3 |
| Load | 3 | 7 | ~20 |
| Stress | 5 | 10 | ~50 |
| Endurance | 3 | 5 | ~15 |

> **ALT limit:** Up to 250 threads per engine. For >250 concurrent sessions, increase `engineInstances`.

---

## Troubleshooting

### Common Issues

| Symptom | Cause | Fix |
|---|---|---|
| `401 Unauthorized` on WS Open | Server has `WSS_API_KEY` set | Set `auth.token` in properties file |
| `speech.error: INVALID_MESSAGE` | Wrong payload format | Ensure `window_duration_ms` is at payload root (not nested) |
| Empty transcript (`text: ""`) | Audio too short for window | Use `window_duration_ms` ≤ audio duration |
| `window_ready=false` in server logs | Audio didn't fill inference window | Increase audio duration or decrease `window_duration_ms` |
| `SESSION_LIMIT` errors | Too many concurrent sessions | Expected in stress tests; reduce `concurrent.sessions` for others |
| `WebSocket not connected` in chunk loop | Connection dropped mid-session | Check server logs for OOM or crash |
| Report generation error (`apdex_satisfied_threshold`) | JMeter 5.6.3 report bug | Cosmetic only — results.jtl is still valid |
| Plugin not found | JAR not in JMeter `lib/ext/` | `cp plugins/*.jar $(brew --prefix jmeter)/libexec/lib/ext/` |

### Reading Results

```bash
# Quick pass/fail summary
grep "Transcription Session" results/smoke-*/results.jtl | awk -F',' '{print $8}'

# Check audio chunk sizes (should be 6400, not 6)
grep "Send Audio Chunk" results/smoke-*/results.jtl | awk -F',' '{print $11}' | sort | uniq -c

# View server-side logs
kubectl logs -n whisperx deployment/whisperx-server --tail=50 | grep -E "infer|window|error"

# Check Groovy script output
grep -E "Phrase|Hypothesis|Checkpoint|Transcription" results/smoke-*/jmeter.log
```

---

## References

- [Azure Load Testing Documentation](https://learn.microsoft.com/en-us/azure/app-testing/load-testing/)
- [Supported JMeter Features in ALT](https://learn.microsoft.com/en-us/azure/app-testing/load-testing/resource-jmeter-support)
- [Multiple JMeter Files & Fragments in ALT](https://techcommunity.microsoft.com/blog/appsonazureblog/introducing-support-for-multiple-jmeter-files-and-fragments-in-azure-load-testin/4374349)
- [JMeter WebSocket Samplers Plugin](https://github.com/Luminis-Arnhem/jmeter-websocket-samplers) (v1.3.1)
- [AzureLoadTest@1 Pipeline Task](https://learn.microsoft.com/en-us/azure/devops/pipelines/tasks/reference/azure-load-test-v1)
- [OpenASR Protocol Specification](../docs/PROTOCOL.md)
