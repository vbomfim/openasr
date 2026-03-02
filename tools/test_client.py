#!/usr/bin/env python3
"""End-to-end test client for whisperx-streaming-server.

Sends a WAV file over WebSocket using the Azure-aligned protocol:
1. speech.config → speech.config.ack
2. Continuous binary frames (raw PCM data)
3. speech.end
"""

import argparse
import asyncio
import json
import os
import socket
import time
import wave

import websockets

DEFAULT_URL = "ws://localhost:9090/transcribe"
CHUNK_DURATION_MS = 200  # send 200ms chunks


def patch_dns(target_host: str, dest_ip: str):
    """Monkey-patch socket.getaddrinfo to resolve target_host → dest_ip."""
    _orig = socket.getaddrinfo

    def _patched(host, port, *args, **kwargs):
        if host == target_host:
            host = dest_ip
        return _orig(host, port, *args, **kwargs)

    socket.getaddrinfo = _patched


async def run_test(server_url: str, wav_path: str):
    with wave.open(wav_path, "r") as wf:
        assert wf.getnchannels() == 1, "Must be mono"
        assert wf.getsampwidth() == 2, "Must be 16-bit"
        sample_rate = wf.getframerate()
        pcm_data = wf.readframes(wf.getnframes())
        duration_s = wf.getnframes() / sample_rate

    print(f"Audio: {wav_path} | {sample_rate}Hz mono 16-bit | {duration_s:.1f}s | {len(pcm_data)} bytes")
    t0 = time.monotonic()

    async with websockets.connect(server_url) as ws:
        # --- speech.config ---
        config = {
            "type": "speech.config",
            "payload": {
                "language": "en",
                "sample_rate": sample_rate,
                "encoding": "pcm_s16le",
                "window_duration_ms": 5000,
                "overlap_duration_ms": 500,
                "model_id": "whisper-tiny.en",
                "resume_checkpoint": None,
            },
        }
        await ws.send(json.dumps(config))
        print(f"→ speech.config sent")

        # Wait for speech.config.ack
        resp = await ws.recv()
        ack = json.loads(resp)
        elapsed = time.monotonic() - t0
        print(f"← {ack['type']} ({elapsed:.3f}s)")

        # --- Stream binary audio frames ---
        chunk_samples = int(sample_rate * CHUNK_DURATION_MS / 1000)
        chunk_bytes = chunk_samples * 2  # 16-bit = 2 bytes/sample
        offset = 0
        chunk_count = 0
        total_audio_ms = 0

        while offset < len(pcm_data):
            end = min(offset + chunk_bytes, len(pcm_data))
            await ws.send(pcm_data[offset:end])
            actual_ms = (end - offset) // 2 * 1000 // sample_rate
            total_audio_ms += actual_ms
            offset = end
            chunk_count += 1

        print(f"→ Sent {chunk_count} binary frames ({total_audio_ms}ms audio)")

        # --- speech.end ---
        await ws.send(json.dumps({"type": "speech.end", "payload": {}}))
        print(f"→ speech.end sent")

        # --- Collect responses ---
        try:
            while True:
                resp = await asyncio.wait_for(ws.recv(), timeout=30)
                elapsed = time.monotonic() - t0

                if isinstance(resp, bytes):
                    print(f"← binary frame ({len(resp)} bytes) [{elapsed:.3f}s]")
                    continue

                msg = json.loads(resp)
                msg_type = msg["type"]
                payload = msg.get("payload", {})

                if msg_type == "speech.hypothesis":
                    print(
                        f"← hypothesis [{payload.get('offset_ms',0)}ms "
                        f"+{payload.get('duration_ms',0)}ms]: "
                        f"{payload.get('text','')} [{elapsed:.3f}s]"
                    )

                elif msg_type == "speech.phrase":
                    print(f"\n{'='*60}")
                    print(
                        f"← phrase [{payload.get('offset_ms',0)}ms "
                        f"+{payload.get('duration_ms',0)}ms] "
                        f"confidence={payload.get('confidence','')}:"
                    )
                    print(f"  {payload.get('text','')}")
                    print(f"{'='*60} [{elapsed:.3f}s]")

                elif msg_type == "speech.checkpoint":
                    print(f"← checkpoint [{elapsed:.3f}s]: {json.dumps(payload)[:120]}")

                elif msg_type == "speech.backpressure":
                    print(f"← backpressure [{elapsed:.3f}s]: {json.dumps(payload)[:120]}")

                elif msg_type == "speech.error":
                    print(f"← ERROR [{elapsed:.3f}s]: {payload.get('code','')} - {payload.get('message','')}")
                    break

                else:
                    print(f"← {msg_type} [{elapsed:.3f}s]: {json.dumps(payload)[:100]}")

        except asyncio.TimeoutError:
            print("(no more messages)")
        except websockets.exceptions.ConnectionClosed:
            print("(connection closed)")

    total = time.monotonic() - t0
    print(f"\nDone in {total:.3f}s")


def main():
    parser = argparse.ArgumentParser(description="Test client for whisperx-streaming-server")
    parser.add_argument("server_url", nargs="?",
                        default=os.environ.get("SERVER_URL", DEFAULT_URL),
                        help=f"WebSocket URL (default: $SERVER_URL or {DEFAULT_URL})")
    parser.add_argument("wav_file", nargs="?", default="/tmp/test_speech.wav",
                        help="Path to mono 16-bit WAV file (default: /tmp/test_speech.wav)")
    parser.add_argument("--ingress", metavar="IP", default=None,
                        help="Resolve whisperx.local to this IP (e.g. 127.0.0.1)")
    args = parser.parse_args()

    if args.ingress:
        patch_dns("whisperx.local", args.ingress)

    asyncio.run(run_test(args.server_url, args.wav_file))


if __name__ == "__main__":
    main()
