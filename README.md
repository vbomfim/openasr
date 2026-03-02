# WhisperX Streaming Transcription Server

A lean, memory-efficient C++20 WebSocket server for real-time audio transcription using [whisper.cpp](https://github.com/ggerganov/whisper.cpp).

## Features

- Embedded Whisper inference (no external Python services)
- WebSocket-based streaming protocol (JSON control + binary audio)
- Supports PCM and Opus audio at any sample rate
- Configurable buffering and windowing with overlap
- Stateless checkpointing for session resume on any node
- Designed for Kubernetes deployment (CPU, optional GPU)

## Building

```bash
mkdir build && cd build
cmake .. -DCMAKE_BUILD_TYPE=Release
cmake --build . -j$(nproc)
```

## Docker

```bash
docker build -t whisperx-server -f docker/Dockerfile .
docker run -p 9090:9090 -v /path/to/models:/models whisperx-server
```

## License

MIT
