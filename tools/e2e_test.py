#!/usr/bin/env python3
"""
End-to-end transcription test for OpenASR.

Sends a WAV file through the WebSocket protocol and verifies
that the server produces non-empty transcription text.

Usage:
    python e2e_test.py --server-url ws://localhost:9090/transcribe --wav test.wav
"""

import argparse
import asyncio
import json
import os
import sys
import wave

import websockets


async def run_e2e_test(server_url: str, wav_path: str, api_key: str = "") -> bool:
    """Run E2E transcription and return True if non-empty text was produced."""
    with wave.open(wav_path, "r") as wf:
        assert wf.getnchannels() == 1, "WAV must be mono"
        assert wf.getsampwidth() == 2, "WAV must be 16-bit"
        sample_rate = wf.getframerate()
        pcm_data = wf.readframes(wf.getnframes())
        duration_s = wf.getnframes() / sample_rate

    print(f"Audio: {wav_path} | {sample_rate}Hz mono 16-bit | {duration_s:.1f}s | {len(pcm_data)} bytes")

    headers = {}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"

    texts = []

    async with websockets.connect(server_url, additional_headers=headers or None) as ws:
        # Send config with a small window so inference runs during streaming
        config = {
            "type": "speech.config",
            "payload": {
                "language": "en",
                "sample_rate": sample_rate,
                "encoding": "pcm_s16le",
                "window_duration_ms": 2000,
                "overlap_duration_ms": 200,
            },
        }
        await ws.send(json.dumps(config))
        ack = await asyncio.wait_for(ws.recv(), timeout=10)
        ack_msg = json.loads(ack)
        print(f"← {ack_msg['type']}")
        assert ack_msg["type"] != "speech.error", f"Config failed: {ack_msg}"

        # Concurrent receiver: collects transcription results while audio streams
        async def receive_results():
            try:
                while True:
                    resp = await asyncio.wait_for(ws.recv(), timeout=30)
                    if isinstance(resp, bytes):
                        continue
                    msg = json.loads(resp)
                    msg_type = msg["type"]
                    payload = msg.get("payload", {})

                    if msg_type in ("speech.phrase", "speech.hypothesis"):
                        text = payload.get("text", "")
                        if text.strip():
                            texts.append(text.strip())
                            print(f"  ← {msg_type}: {text}")
                    elif msg_type == "speech.error":
                        print(f"  ← ERROR: {payload}")
                    elif msg_type == "speech.checkpoint":
                        print(f"  ← {msg_type}")
                    else:
                        print(f"  ← {msg_type}")
            except (asyncio.TimeoutError, websockets.exceptions.ConnectionClosed):
                pass

        # Sender: streams audio at real-time rate
        async def send_audio():
            chunk_duration_s = 0.2
            chunk_size = int(sample_rate * 2 * chunk_duration_s)
            offset = 0
            chunks = 0
            while offset < len(pcm_data):
                end = min(offset + chunk_size, len(pcm_data))
                await ws.send(pcm_data[offset:end])
                offset = end
                chunks += 1
                await asyncio.sleep(chunk_duration_s)

            print(f"→ Sent {chunks} audio chunks (real-time pacing)")

            # Wait for in-flight inference to finish before ending session
            await asyncio.sleep(3)

            await ws.send(json.dumps({"type": "speech.end", "payload": {}}))
            print("→ speech.end sent")

        # Run sender and receiver concurrently
        await asyncio.gather(send_audio(), receive_results())

    if texts:
        print(f"\n✓ E2E test passed: {len(texts)} transcription segment(s)")
        return True
    else:
        print("\n✗ E2E test failed: no transcription text produced")
        return False


def main():
    parser = argparse.ArgumentParser(description="E2E transcription test for OpenASR")
    parser.add_argument(
        "--server-url",
        default=os.environ.get("OPENASR_WS_URL", "ws://localhost:9090/transcribe"),
        help="WebSocket endpoint (default: ws://localhost:9090/transcribe)",
    )
    parser.add_argument(
        "--wav",
        required=True,
        help="Path to mono 16-bit WAV file",
    )
    parser.add_argument(
        "--api-key",
        default=os.environ.get("WSS_API_KEY", ""),
        help="Bearer token for Authorization header",
    )
    args = parser.parse_args()

    success = asyncio.run(run_e2e_test(args.server_url, args.wav, args.api_key))
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
