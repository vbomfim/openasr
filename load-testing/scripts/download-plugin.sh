#!/usr/bin/env bash
# Download the JMeter WebSocket Samplers plugin.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_DIR="${SCRIPT_DIR}/../plugins"
PLUGIN_VERSION="1.3.1"
PLUGIN_JAR="jmeter-websocket-samplers-${PLUGIN_VERSION}.jar"
DOWNLOAD_URL="https://repo1.maven.org/maven2/net/luminis/jmeter/jmeter-websocket-samplers/${PLUGIN_VERSION}/${PLUGIN_JAR}"

mkdir -p "${PLUGIN_DIR}"

if [ -f "${PLUGIN_DIR}/${PLUGIN_JAR}" ]; then
    echo "Plugin already exists: ${PLUGIN_DIR}/${PLUGIN_JAR}"
    exit 0
fi

echo "Downloading JMeter WebSocket Samplers v${PLUGIN_VERSION}..."
curl -fSL -o "${PLUGIN_DIR}/${PLUGIN_JAR}" "${DOWNLOAD_URL}"
echo "  ✓ Downloaded to ${PLUGIN_DIR}/${PLUGIN_JAR}"

echo ""
echo "For local JMeter: copy this JAR to your JMeter lib/ext/ directory:"
echo "  cp ${PLUGIN_DIR}/${PLUGIN_JAR} \$(JMETER_HOME)/lib/ext/"
echo ""
echo "For Azure Load Testing: the JAR is included via zipArtifacts in config/*.yaml"
