#!/usr/bin/env bash
# Run a JMeter test plan locally.
# Usage: ./run-local.sh <scenario> [environment]
#   scenario:    smoke | load | stress | spike | endurance | api-benchmark
#   environment: local (default) | dev | staging | prod
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="${SCRIPT_DIR}/.."

SCENARIO="${1:?Usage: $0 <scenario> [environment]}"
shift
ENV="${1:-local}"
shift 2>/dev/null || true

# Resolve paths
TEST_PLAN="${BASE_DIR}/test-plans/${SCENARIO}/${SCENARIO}-test.jmx"
PROPERTIES="${BASE_DIR}/properties/${ENV}.properties"
RESULTS_DIR="${BASE_DIR}/results/${SCENARIO}-$(date +%Y%m%d-%H%M%S)"
PLUGIN_DIR="${BASE_DIR}/plugins"

# Validate
if [ ! -f "${TEST_PLAN}" ]; then
    echo "Error: Test plan not found: ${TEST_PLAN}"
    echo "Available scenarios:"
    ls -1 "${BASE_DIR}/test-plans/" 2>/dev/null || echo "  (none)"
    exit 1
fi

if [ ! -f "${PROPERTIES}" ]; then
    echo "Error: Properties file not found: ${PROPERTIES}"
    echo "Available environments:"
    ls -1 "${BASE_DIR}/properties/"*.properties 2>/dev/null | xargs -I{} basename {} .properties
    exit 1
fi

# Check JMeter
if ! command -v jmeter &>/dev/null; then
    if [ -n "${JMETER_HOME:-}" ] && [ -f "${JMETER_HOME}/bin/jmeter" ]; then
        JMETER_CMD="${JMETER_HOME}/bin/jmeter"
    else
        echo "Error: JMeter not found. Install it or set JMETER_HOME."
        echo "  brew install jmeter"
        echo "  # or download from https://jmeter.apache.org/download_jmeter.cgi"
        exit 1
    fi
else
    JMETER_CMD="jmeter"
fi

mkdir -p "${RESULTS_DIR}"

echo "═══════════════════════════════════════════════"
echo "  OpenASR Load Test — ${SCENARIO} (${ENV})"
echo "═══════════════════════════════════════════════"
echo "  Test plan:   ${TEST_PLAN}"
echo "  Properties:  ${PROPERTIES}"
echo "  Results:     ${RESULTS_DIR}/"
echo "  Plugins:     ${PLUGIN_DIR}/"
echo "═══════════════════════════════════════════════"
echo ""

# Run JMeter in non-GUI (CLI) mode from the load-testing root
# (IncludeController resolves fragment paths relative to cwd)
cd "${BASE_DIR}"

${JMETER_CMD} \
    -n \
    -t "${TEST_PLAN}" \
    -p "${PROPERTIES}" \
    -l "${RESULTS_DIR}/results.jtl" \
    -j "${RESULTS_DIR}/jmeter.log" \
    -e -o "${RESULTS_DIR}/report" \
    -Jplugin_dependency_paths="${PLUGIN_DIR}" \
    "$@"

echo ""
echo "═══════════════════════════════════════════════"
echo "  Test complete!"
echo "  Results: ${RESULTS_DIR}/results.jtl"
echo "  Report:  ${RESULTS_DIR}/report/index.html"
echo "═══════════════════════════════════════════════"
