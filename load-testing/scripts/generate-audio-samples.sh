#!/usr/bin/env bash
# Generate PCM test audio samples for load testing.
# Requires: sox (install via: brew install sox / apt install sox)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AUDIO_DIR="${SCRIPT_DIR}/../data/audio"

mkdir -p "${AUDIO_DIR}"

echo "Generating test audio samples..."

# 5-second sample: sine wave at 440Hz (speech-like frequency range)
sox -n -r 16000 -b 16 -c 1 -e signed-integer -t raw "${AUDIO_DIR}/sample-short-5s.raw" \
    synth 5 sine 440 vol 0.3
echo "  ✓ sample-short-5s.raw ($(du -h "${AUDIO_DIR}/sample-short-5s.raw" | cut -f1))"

# 30-second sample: mixed frequencies for more realistic signal
sox -n -r 16000 -b 16 -c 1 -e signed-integer -t raw "${AUDIO_DIR}/sample-medium-30s.raw" \
    synth 30 sine 300-3400 vol 0.3
echo "  ✓ sample-medium-30s.raw ($(du -h "${AUDIO_DIR}/sample-medium-30s.raw" | cut -f1))"

# 120-second sample: frequency sweep simulating varied speech
sox -n -r 16000 -b 16 -c 1 -e signed-integer -t raw "${AUDIO_DIR}/sample-long-120s.raw" \
    synth 120 sine 200-4000 vol 0.3
echo "  ✓ sample-long-120s.raw ($(du -h "${AUDIO_DIR}/sample-long-120s.raw" | cut -f1))"

echo ""
echo "Audio samples generated in ${AUDIO_DIR}/"
echo "Format: PCM 16-bit signed little-endian, 16kHz, mono"
echo ""
echo "Tip: For more realistic tests, convert actual speech recordings:"
echo "  ffmpeg -i speech.wav -f s16le -acodec pcm_s16le -ar 16000 -ac 1 sample.raw"
