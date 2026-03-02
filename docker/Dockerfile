# ---- Build stage ----
FROM debian:bookworm-slim AS builder

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
      -DGGML_METAL=OFF && \
    cmake --build . -j$(nproc)

# ---- Runtime stage ----
FROM debian:bookworm-slim AS runtime

# Security: run as non-root
RUN groupadd --system wss && useradd --system --gid wss --no-create-home wss

RUN apt-get update && apt-get install -y --no-install-recommends \
    libopus0 \
    libsamplerate0 \
    libgomp1 \
    zlib1g \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy binary and default config
COPY --from=builder /build/build/transcription_server /usr/local/bin/transcription_server
COPY --from=builder /build/config/server.toml /etc/whisperx/server.toml

# Models directory (mount at runtime)
RUN mkdir -p /models && chown wss:wss /models
VOLUME ["/models"]

# Drop privileges
USER wss

EXPOSE 9090

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD curl -sf http://localhost:9090/health || exit 1

ENV WSS_CONFIG_PATH=/etc/whisperx/server.toml

ENTRYPOINT ["transcription_server"]
