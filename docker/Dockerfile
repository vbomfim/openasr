# ---- Build stage ----
FROM ubuntu:24.04 AS builder

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    cmake \
    git \
    pkg-config \
    libopus-dev \
    libsamplerate0-dev \
    zlib1g-dev \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /build
COPY . .

RUN git submodule update --init --recursive || true

RUN mkdir -p build && cd build && \
    cmake .. \
      -DCMAKE_BUILD_TYPE=Release \
      -DCMAKE_POLICY_VERSION_MINIMUM=3.5 \
      -DWHISPER_BUILD_TESTS=OFF \
      -DWHISPER_BUILD_EXAMPLES=OFF \
      -DGGML_METAL=OFF \
      -DGGML_FP16_VA=OFF && \
    cmake --build . -j$(nproc)

# Collect shared library dependencies for distroless
RUN mkdir -p /runtime-libs && \
    ldd /build/build/transcription_server | \
    grep "=> /" | awk '{print $3}' | \
    xargs -I{} cp --parents {} /runtime-libs/ && \
    cp --parents /lib/*/ld-linux-* /runtime-libs/ 2>/dev/null || true

# ---- Runtime stage (distroless) ----
FROM gcr.io/distroless/cc-debian12:nonroot

# Copy binary
COPY --from=builder /build/build/transcription_server /usr/local/bin/transcription_server

# Copy shared libraries not in distroless base
COPY --from=builder /runtime-libs/ /

# Copy default config
COPY --from=builder /build/config/server.toml /etc/whisperx/server.toml

EXPOSE 9090

ENV WSS_CONFIG_PATH=/etc/whisperx/server.toml

ENTRYPOINT ["transcription_server"]
