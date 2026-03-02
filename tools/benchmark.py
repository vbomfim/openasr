#!/usr/bin/env python3
"""
Load test / benchmark for OpenASR streaming transcription server.

Runs N concurrent sessions for a specified duration, continuously streaming
audio and collecting metrics on latency, throughput, errors, and reliability.

Usage:
    python3 tools/benchmark.py --sessions 5 --duration 7200 --ingress 127.0.0.1
"""

import argparse
import asyncio
import json
import os
import socket
import statistics
import struct
import sys
import time
import wave
from collections import defaultdict
from dataclasses import dataclass, field

import websockets


@dataclass
class SessionMetrics:
    session_id: str = ""
    session_num: int = 0
    windows_submitted: int = 0
    hypotheses_received: int = 0
    phrases_received: int = 0
    checkpoints_received: int = 0
    errors_received: int = 0
    backpressures_received: int = 0
    connection_failures: int = 0
    reconnections: int = 0
    bytes_sent: int = 0
    inference_latencies: list = field(default_factory=list)  # seconds
    total_audio_sent_ms: int = 0
    transcript_chars: int = 0
    start_time: float = 0.0
    end_time: float = 0.0


@dataclass
class BenchmarkResults:
    duration_s: float = 0.0
    sessions_target: int = 0
    total_connections: int = 0
    total_connection_failures: int = 0
    total_reconnections: int = 0
    total_windows: int = 0
    total_hypotheses: int = 0
    total_phrases: int = 0
    total_checkpoints: int = 0
    total_errors: int = 0
    total_backpressures: int = 0
    total_bytes_sent: int = 0
    total_audio_ms: int = 0
    inference_latencies: list = field(default_factory=list)
    error_details: list = field(default_factory=list)
    session_metrics: list = field(default_factory=list)


def generate_silence(sample_rate: int, duration_ms: int) -> bytes:
    """Generate silence as PCM int16 bytes."""
    n_samples = sample_rate * duration_ms // 1000
    return b'\x00\x00' * n_samples


def generate_tone(sample_rate: int, duration_ms: int, freq: float = 440.0) -> bytes:
    """Generate a sine tone as PCM int16 bytes."""
    import math
    n_samples = sample_rate * duration_ms // 1000
    samples = []
    for i in range(n_samples):
        t = i / sample_rate
        val = int(16000 * math.sin(2 * math.pi * freq * t))
        samples.append(struct.pack('<h', max(-32768, min(32767, val))))
    return b''.join(samples)


def load_or_generate_audio(wav_path: str, sample_rate: int = 16000) -> bytes:
    """Load WAV file or generate test audio if not available."""
    if wav_path and os.path.exists(wav_path):
        with wave.open(wav_path, 'r') as wf:
            return wf.readframes(wf.getnframes())
    # Generate 30 seconds of alternating tone and silence
    audio = b''
    for i in range(15):
        audio += generate_tone(sample_rate, 1000, freq=440 + i * 50)
        audio += generate_silence(sample_rate, 1000)
    return audio


async def run_session(
    session_num: int,
    server_url: str,
    api_key: str,
    audio_data: bytes,
    sample_rate: int,
    duration_s: float,
    results_queue: asyncio.Queue,
    stop_event: asyncio.Event,
):
    """Run a single session that continuously streams audio."""
    metrics = SessionMetrics(session_num=session_num)
    metrics.start_time = time.time()
    chunk_size = sample_rate * 200 // 1000 * 2  # 200ms chunks

    headers = {}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"

    while not stop_event.is_set():
        try:
            async with websockets.connect(
                server_url,
                additional_headers=headers,
                close_timeout=10,
                ping_interval=30,
                ping_timeout=10,
            ) as ws:
                metrics.reconnections += (1 if metrics.session_id else 0)

                # speech.config
                await ws.send(json.dumps({
                    "type": "speech.config",
                    "payload": {
                        "language": "en",
                        "sample_rate": sample_rate,
                        "encoding": "pcm_s16le",
                        "window_duration_ms": 5000,
                        "overlap_duration_ms": 500,
                        "model_id": "whisper-base.en",
                    }
                }))
                ack = json.loads(await ws.recv())
                if ack.get("type") == "speech.error":
                    metrics.errors_received += 1
                    metrics.error_details = ack.get("payload", {})
                    await asyncio.sleep(5)
                    continue

                metrics.session_id = ack.get("payload", {}).get("session_id", "?")

                # Stream audio continuously until stop or disconnect
                audio_offset = 0
                window_send_time = time.time()

                # Create a task to receive responses
                async def receive_responses():
                    nonlocal metrics
                    try:
                        while not stop_event.is_set():
                            resp = await asyncio.wait_for(ws.recv(), timeout=120)
                            msg = json.loads(resp)
                            msg_type = msg.get("type", "")
                            payload = msg.get("payload", {})

                            if msg_type == "speech.hypothesis":
                                metrics.hypotheses_received += 1
                            elif msg_type == "speech.phrase":
                                metrics.phrases_received += 1
                                latency = time.time() - window_send_time
                                metrics.inference_latencies.append(latency)
                                metrics.transcript_chars += len(payload.get("text", ""))
                            elif msg_type == "speech.checkpoint":
                                metrics.checkpoints_received += 1
                            elif msg_type == "speech.backpressure":
                                metrics.backpressures_received += 1
                                if payload.get("action") == "slow_down":
                                    await asyncio.sleep(1)
                            elif msg_type == "speech.error":
                                metrics.errors_received += 1
                                await results_queue.put(("error", session_num, payload))
                    except (asyncio.TimeoutError, websockets.exceptions.ConnectionClosed):
                        pass

                recv_task = asyncio.create_task(receive_responses())

                try:
                    while not stop_event.is_set():
                        # Send a chunk of audio
                        end = min(audio_offset + chunk_size, len(audio_data))
                        chunk = audio_data[audio_offset:end]
                        await ws.send(chunk)
                        metrics.bytes_sent += len(chunk)
                        metrics.total_audio_sent_ms += 200

                        audio_offset = end
                        if audio_offset >= len(audio_data):
                            audio_offset = 0  # loop audio
                            metrics.windows_submitted += 1
                            window_send_time = time.time()

                        # Pace: send at ~real-time speed
                        await asyncio.sleep(0.18)  # slightly faster than real-time

                except (websockets.exceptions.ConnectionClosed, OSError):
                    pass
                finally:
                    recv_task.cancel()
                    try:
                        await recv_task
                    except asyncio.CancelledError:
                        pass

        except (
            websockets.exceptions.InvalidMessage,
            websockets.exceptions.InvalidStatus,
            ConnectionRefusedError,
            OSError,
        ) as e:
            metrics.connection_failures += 1
            await results_queue.put(("conn_fail", session_num, str(e)))
            await asyncio.sleep(5)  # backoff before retry
        except Exception as e:
            metrics.errors_received += 1
            await results_queue.put(("exception", session_num, str(e)))
            await asyncio.sleep(5)

    metrics.end_time = time.time()
    await results_queue.put(("done", session_num, metrics))


async def monitor(results_queue: asyncio.Queue, num_sessions: int, stop_event: asyncio.Event):
    """Monitor and print progress."""
    session_done = set()
    errors = []
    conn_fails = 0
    start = time.time()

    while len(session_done) < num_sessions:
        try:
            event_type, session_num, data = await asyncio.wait_for(
                results_queue.get(), timeout=60
            )
            elapsed = time.time() - start

            if event_type == "done":
                session_done.add(session_num)
                m = data
                print(f"[{elapsed:.0f}s] Session {session_num} done: "
                      f"phrases={m.phrases_received} errors={m.errors_received} "
                      f"reconnects={m.reconnections}")
            elif event_type == "error":
                errors.append(data)
                print(f"[{elapsed:.0f}s] Session {session_num} error: {data}")
            elif event_type == "conn_fail":
                conn_fails += 1
                if conn_fails <= 5:
                    print(f"[{elapsed:.0f}s] Session {session_num} connection failed: {data}")
            elif event_type == "exception":
                errors.append(data)
                print(f"[{elapsed:.0f}s] Session {session_num} exception: {data}")
        except asyncio.TimeoutError:
            elapsed = time.time() - start
            print(f"[{elapsed:.0f}s] Still running... ({len(session_done)}/{num_sessions} done)")

    return errors


async def run_benchmark(
    server_url: str,
    api_key: str,
    wav_path: str,
    num_sessions: int,
    duration_s: float,
):
    print(f"{'='*70}")
    print(f"OpenASR Benchmark")
    print(f"{'='*70}")
    print(f"Server:     {server_url}")
    print(f"Sessions:   {num_sessions} concurrent")
    print(f"Duration:   {duration_s:.0f}s ({duration_s/3600:.1f}h)")
    print(f"Audio:      {wav_path or 'generated tone'}")
    print(f"{'='*70}")
    print()

    audio_data = load_or_generate_audio(wav_path)
    sample_rate = 16000  # assume 16kHz
    print(f"Audio loaded: {len(audio_data)//2/sample_rate:.1f}s ({len(audio_data)} bytes)")
    print(f"Starting {num_sessions} sessions...")
    print()

    results_queue = asyncio.Queue()
    stop_event = asyncio.Event()
    start_time = time.time()

    # Start sessions
    session_tasks = []
    for i in range(num_sessions):
        task = asyncio.create_task(run_session(
            i, server_url, api_key, audio_data, sample_rate,
            duration_s, results_queue, stop_event
        ))
        session_tasks.append(task)
        await asyncio.sleep(0.5)  # stagger starts

    # Progress reporting
    progress_task = asyncio.create_task(monitor(results_queue, num_sessions, stop_event))

    # Wait for duration
    try:
        await asyncio.sleep(duration_s)
    except asyncio.CancelledError:
        pass

    print(f"\n[{time.time()-start_time:.0f}s] Stopping sessions...")
    stop_event.set()

    # Wait for all sessions to finish (with timeout)
    try:
        await asyncio.wait_for(
            asyncio.gather(*session_tasks, return_exceptions=True),
            timeout=30
        )
    except asyncio.TimeoutError:
        print("Warning: some sessions didn't stop cleanly")
        for t in session_tasks:
            t.cancel()

    try:
        await asyncio.wait_for(progress_task, timeout=10)
    except asyncio.TimeoutError:
        progress_task.cancel()

    # Collect all metrics
    all_metrics = []
    while not results_queue.empty():
        event_type, _, data = results_queue.get_nowait()
        if event_type == "done":
            all_metrics.append(data)

    # Build results
    total_duration = time.time() - start_time
    results = BenchmarkResults(
        duration_s=total_duration,
        sessions_target=num_sessions,
    )

    for m in all_metrics:
        results.total_connections += 1
        results.total_connection_failures += m.connection_failures
        results.total_reconnections += m.reconnections
        results.total_hypotheses += m.hypotheses_received
        results.total_phrases += m.phrases_received
        results.total_checkpoints += m.checkpoints_received
        results.total_errors += m.errors_received
        results.total_backpressures += m.backpressures_received
        results.total_bytes_sent += m.bytes_sent
        results.total_audio_ms += m.total_audio_sent_ms
        results.inference_latencies.extend(m.inference_latencies)

    # Print report
    print()
    print(f"{'='*70}")
    print(f"BENCHMARK RESULTS")
    print(f"{'='*70}")
    print(f"Duration:              {total_duration:.0f}s ({total_duration/3600:.2f}h)")
    print(f"Target sessions:       {num_sessions}")
    print(f"Sessions completed:    {len(all_metrics)}")
    print(f"Connection failures:   {results.total_connection_failures}")
    print(f"Reconnections:         {results.total_reconnections}")
    print()
    print(f"--- Throughput ---")
    print(f"Total audio sent:      {results.total_audio_ms/1000:.0f}s ({results.total_bytes_sent/1024/1024:.1f} MB)")
    print(f"Total hypotheses:      {results.total_hypotheses}")
    print(f"Total phrases:         {results.total_phrases}")
    print(f"Total checkpoints:     {results.total_checkpoints}")
    print(f"Total errors:          {results.total_errors}")
    print(f"Total backpressures:   {results.total_backpressures}")
    print()

    if results.inference_latencies:
        lats = results.inference_latencies
        print(f"--- Inference Latency ---")
        print(f"Samples:               {len(lats)}")
        print(f"Min:                   {min(lats):.2f}s")
        print(f"Max:                   {max(lats):.2f}s")
        print(f"Mean:                  {statistics.mean(lats):.2f}s")
        print(f"Median:                {statistics.median(lats):.2f}s")
        print(f"P95:                   {sorted(lats)[int(len(lats)*0.95)]:.2f}s" if len(lats) > 20 else "")
        print(f"P99:                   {sorted(lats)[int(len(lats)*0.99)]:.2f}s" if len(lats) > 100 else "")
    else:
        print("No inference latency data collected")

    print()
    error_rate = results.total_errors / max(1, results.total_phrases + results.total_errors) * 100
    print(f"--- Reliability ---")
    print(f"Error rate:            {error_rate:.2f}%")
    print(f"Success rate:          {100 - error_rate:.2f}%")
    print(f"{'='*70}")

    # Per-session breakdown
    print()
    print(f"--- Per-Session Breakdown ---")
    print(f"{'Sess':>4} {'Phrases':>8} {'Errors':>7} {'Reconn':>7} {'ConnFail':>9} {'AvgLat':>7} {'AudioMB':>8}")
    for m in all_metrics:
        avg_lat = statistics.mean(m.inference_latencies) if m.inference_latencies else 0
        print(f"{m.session_num:>4} {m.phrases_received:>8} {m.errors_received:>7} "
              f"{m.reconnections:>7} {m.connection_failures:>9} "
              f"{avg_lat:>6.1f}s {m.bytes_sent/1024/1024:>7.1f}")
    print()

    return results


def main():
    parser = argparse.ArgumentParser(description="OpenASR Benchmark")
    parser.add_argument("--server-url", default="ws://whisperx.local/transcribe",
                        help="WebSocket URL")
    parser.add_argument("--api-key", default=os.environ.get("WSS_API_KEY", ""),
                        help="API key")
    parser.add_argument("--wav", default="/tmp/test_speech.wav",
                        help="WAV file path (or generates test tone)")
    parser.add_argument("--sessions", type=int, default=5,
                        help="Number of concurrent sessions")
    parser.add_argument("--duration", type=int, default=7200,
                        help="Test duration in seconds (default: 7200 = 2h)")
    parser.add_argument("--ingress", metavar="IP", default=None,
                        help="Resolve whisperx.local to this IP")
    args = parser.parse_args()

    if args.ingress:
        _orig = socket.getaddrinfo
        def patched(host, port, *a, **kw):
            if host == "whisperx.local":
                host = args.ingress
            return _orig(host, port, *a, **kw)
        socket.getaddrinfo = patched

    asyncio.run(run_benchmark(
        args.server_url, args.api_key, args.wav,
        args.sessions, args.duration
    ))


if __name__ == "__main__":
    main()
