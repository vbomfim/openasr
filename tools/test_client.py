#!/usr/bin/env python3
"""End-to-end test client for whisperx-streaming-server.

Sends a WAV file over WebSocket using the protocol:
1. HELLO → HELLO_ACK
2. AUDIO_CHUNK (JSON meta) + binary frame (PCM data), repeated
3. END → FINAL_TRANSCRIPT + CHECKPOINT
"""

import asyncio
import json
import sys
import wave
import websockets

SERVER_URL = "ws://localhost:9090/transcribe"
CHUNK_DURATION_MS = 200  # send 200ms chunks


async def run_test(wav_path: str):
    # Read WAV file
    with wave.open(wav_path, "r") as wf:
        assert wf.getnchannels() == 1, "Must be mono"
        assert wf.getsampwidth() == 2, "Must be 16-bit"
        sample_rate = wf.getframerate()
        pcm_data = wf.readframes(wf.getnframes())
        total_frames = wf.getnframes()
        duration_s = total_frames / sample_rate

    print(f"Audio: {wav_path} | {sample_rate}Hz mono 16-bit | {duration_s:.1f}s | {len(pcm_data)} bytes")

    async with websockets.connect(SERVER_URL) as ws:
        # --- HELLO ---
        hello = {
            "type": "HELLO",
            "session_id": None,
            "payload": {
                "language": "en",
                "sample_rate": sample_rate,
                "buffer_config": {
                    "window_duration_ms": 5000,
                    "overlap_duration_ms": 500
                },
                "resume_from_checkpoint": False,
                "checkpoint": None,
                "backend_model_id": "whisper-tiny.en"
            }
        }
        await ws.send(json.dumps(hello))
        print(f"→ HELLO sent")

        # Wait for HELLO_ACK
        resp = await ws.recv()
        ack = json.loads(resp)
        print(f"← {ack['type']}: session={ack['session_id']}")
        session_id = ack["session_id"]

        # --- Stream audio in chunks ---
        chunk_samples = int(sample_rate * CHUNK_DURATION_MS / 1000)
        chunk_bytes = chunk_samples * 2  # 16-bit = 2 bytes per sample
        offset = 0
        chunk_id = 0
        timestamp_ms = 0

        while offset < len(pcm_data):
            end = min(offset + chunk_bytes, len(pcm_data))
            chunk = pcm_data[offset:end]
            actual_samples = len(chunk) // 2
            actual_duration_ms = int(actual_samples * 1000 / sample_rate)

            # Send JSON metadata
            meta = {
                "type": "AUDIO_CHUNK",
                "session_id": session_id,
                "payload": {
                    "chunk_id": chunk_id,
                    "timestamp_ms": timestamp_ms,
                    "encoding": "pcm_s16le",
                    "duration_ms": actual_duration_ms
                }
            }
            await ws.send(json.dumps(meta))

            # Send binary PCM data
            await ws.send(chunk)

            offset = end
            chunk_id += 1
            timestamp_ms += actual_duration_ms

        print(f"→ Sent {chunk_id} audio chunks ({timestamp_ms}ms total)")

        # --- END ---
        end_msg = {
            "type": "END",
            "session_id": session_id,
            "payload": {}
        }
        await ws.send(json.dumps(end_msg))
        print(f"→ END sent")

        # --- Collect responses ---
        try:
            while True:
                resp = await asyncio.wait_for(ws.recv(), timeout=30)
                msg = json.loads(resp)
                msg_type = msg["type"]

                if msg_type == "PARTIAL_TRANSCRIPT":
                    segments = msg["payload"]["segments"]
                    for seg in segments:
                        print(f"← PARTIAL [{seg['start_ms']}ms-{seg['end_ms']}ms]: {seg['text']}")

                elif msg_type == "FINAL_TRANSCRIPT":
                    segments = msg["payload"]["segments"]
                    print(f"\n{'='*60}")
                    print("FINAL TRANSCRIPT:")
                    for seg in segments:
                        print(f"  [{seg['start_ms']}ms-{seg['end_ms']}ms]: {seg['text']}")
                    print(f"{'='*60}")

                elif msg_type == "CHECKPOINT":
                    cp = msg["payload"]
                    print(f"← CHECKPOINT: last_audio={cp['last_audio_ms']}ms transcript_len={len(cp.get('full_transcript',''))}")

                elif msg_type == "ERROR":
                    print(f"← ERROR: {msg['payload']['code']} - {msg['payload']['message']}")
                    break

                else:
                    print(f"← {msg_type}: {json.dumps(msg['payload'])[:100]}")

        except asyncio.TimeoutError:
            print("(no more messages)")
        except websockets.exceptions.ConnectionClosed:
            print("(connection closed)")


if __name__ == "__main__":
    wav_file = sys.argv[1] if len(sys.argv) > 1 else "/tmp/test_speech.wav"
    asyncio.run(run_test(wav_file))
