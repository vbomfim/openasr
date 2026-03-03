#!/usr/bin/env python3
"""
Adversarial integration test suite for OpenASR WebSocket server.

Sends malformed, oversized, and out-of-sequence messages to verify
the server responds with proper errors without crashing.

Usage:
    python integration_tests.py --server-url ws://localhost:9090/transcribe --api-key SECRET
"""

import argparse
import asyncio
import json
import os
import socket
import struct
import unittest
import urllib.request
import urllib.error
from urllib.parse import urlparse

import websockets
import websockets.exceptions

# ── globals set by CLI args ──────────────────────────────────────────────────
SERVER_URL: str = "ws://localhost:9090/transcribe"
API_KEY: str = ""


# ── helpers ──────────────────────────────────────────────────────────────────

def _http_base_url() -> str:
    """Derive http(s) base URL from the WebSocket URL."""
    parsed = urlparse(SERVER_URL)
    scheme = "https" if parsed.scheme == "wss" else "http"
    return f"{scheme}://{parsed.netloc}"


def _health_ok() -> bool:
    """Return True if GET /health returns 200."""
    try:
        req = urllib.request.Request(f"{_http_base_url()}/health", method="GET")
        with urllib.request.urlopen(req, timeout=5) as resp:
            return resp.status == 200
    except Exception:
        return False


async def _connect(extra_headers: dict | None = None):
    """Open an authenticated WebSocket connection."""
    headers = dict(extra_headers or {})
    if API_KEY and "Authorization" not in headers:
        headers["Authorization"] = f"Bearer {API_KEY}"
    return await websockets.connect(
        SERVER_URL,
        additional_headers=headers if headers else None,
        close_timeout=5,
        open_timeout=5,
    )


async def _setup_session(ws, **overrides) -> dict:
    """Send a valid speech.config and return the server's ack."""
    payload = {
        "language": "en",
        "sample_rate": 16000,
        "encoding": "pcm_s16le",
        "window_duration_ms": 5000,
        "overlap_duration_ms": 500,
    }
    payload.update(overrides)
    msg = {"type": "speech.config", "payload": payload}
    await ws.send(json.dumps(msg))
    raw = await asyncio.wait_for(ws.recv(), timeout=5)
    return json.loads(raw)


async def _recv_json(ws, timeout: float = 5) -> dict:
    raw = await asyncio.wait_for(ws.recv(), timeout=timeout)
    return json.loads(raw)


def _assert_error(test: unittest.TestCase, msg: dict, code: str | None = None):
    """Assert the message is a speech.error, optionally with a specific code."""
    test.assertEqual(msg.get("type"), "speech.error", f"Expected speech.error, got: {msg}")
    if code:
        test.assertEqual(
            msg.get("payload", {}).get("code"),
            code,
            f"Expected error code {code}, got: {msg}",
        )


def _assert_error_or_close(test: unittest.TestCase, msg: dict):
    """Assert the message is a speech.error (server may also just close)."""
    test.assertIn(
        msg.get("type"),
        ("speech.error",),
        f"Expected speech.error, got: {msg}",
    )


# ── Auth tests ───────────────────────────────────────────────────────────────

class TestAuth(unittest.IsolatedAsyncioTestCase):
    """Verify authentication is enforced."""

    async def test_no_auth_header_rejected(self):
        """Connect without Authorization header → connection refused or 401."""
        if not API_KEY:
            self.skipTest("No API key configured – auth tests not applicable")
        with self.assertRaises(
            (websockets.exceptions.InvalidStatusCode, ConnectionRefusedError, OSError)
        ):
            async with websockets.connect(
                SERVER_URL, additional_headers={}, close_timeout=5, open_timeout=5
            ):
                pass  # should not reach here

    async def test_wrong_auth_rejected(self):
        """Authorization: Bearer wrong-key → 401."""
        if not API_KEY:
            self.skipTest("No API key configured – auth tests not applicable")
        with self.assertRaises(
            (websockets.exceptions.InvalidStatusCode, ConnectionRefusedError, OSError)
        ):
            async with websockets.connect(
                SERVER_URL,
                additional_headers={"Authorization": "Bearer wrong-key"},
                close_timeout=5,
                open_timeout=5,
            ):
                pass

    async def test_empty_bearer_rejected(self):
        """Authorization: Bearer (empty) → 401."""
        if not API_KEY:
            self.skipTest("No API key configured – auth tests not applicable")
        with self.assertRaises(
            (websockets.exceptions.InvalidStatusCode, ConnectionRefusedError, OSError)
        ):
            async with websockets.connect(
                SERVER_URL,
                additional_headers={"Authorization": "Bearer "},
                close_timeout=5,
                open_timeout=5,
            ):
                pass

    async def asyncTearDown(self):
        self.assertTrue(_health_ok(), "Server not healthy after auth test")


# ── Malformed JSON tests ────────────────────────────────────────────────────

class TestMalformedInput(unittest.IsolatedAsyncioTestCase):
    """Send various kinds of unparseable or structurally invalid messages."""

    async def _send_and_expect_error(self, payload: str, code: str | None = None):
        async with await _connect() as ws:
            await ws.send(payload)
            resp = await _recv_json(ws)
            _assert_error(self, resp, code)

    async def test_garbage_json(self):
        """Send '{{{not json' → speech.error INVALID_MESSAGE."""
        await self._send_and_expect_error("{{{not json", "INVALID_MESSAGE")

    async def test_empty_string(self):
        """Send '' → speech.error."""
        await self._send_and_expect_error("")

    async def test_json_array(self):
        """Send '[]' → speech.error (not an object)."""
        await self._send_and_expect_error("[]")

    async def test_json_string(self):
        """Send '"hello"' → speech.error."""
        await self._send_and_expect_error('"hello"')

    async def test_json_number(self):
        """Send '42' → speech.error."""
        await self._send_and_expect_error("42")

    async def test_missing_type_field(self):
        """Send {"payload":{}} → speech.error INVALID_MESSAGE."""
        await self._send_and_expect_error(json.dumps({"payload": {}}), "INVALID_MESSAGE")

    async def test_missing_payload_field(self):
        """Send {"type":"speech.config"} → speech.error INVALID_MESSAGE."""
        await self._send_and_expect_error(json.dumps({"type": "speech.config"}), "INVALID_MESSAGE")

    async def test_unknown_message_type(self):
        """Send {"type":"HELLO","payload":{}} → speech.error."""
        await self._send_and_expect_error(json.dumps({"type": "HELLO", "payload": {}}))

    async def asyncTearDown(self):
        self.assertTrue(_health_ok(), "Server not healthy after malformed-input test")


# ── Protocol state tests ────────────────────────────────────────────────────

class TestProtocolState(unittest.IsolatedAsyncioTestCase):
    """Send messages in the wrong order."""

    async def test_binary_before_config(self):
        """Send binary frame before speech.config → speech.error INVALID_STATE."""
        async with await _connect() as ws:
            await ws.send(b"\x00" * 320)
            resp = await _recv_json(ws)
            _assert_error(self, resp, "INVALID_STATE")

    async def test_speech_end_before_config(self):
        """Send speech.end without speech.config → speech.error INVALID_STATE."""
        async with await _connect() as ws:
            await ws.send(json.dumps({"type": "speech.end", "payload": {}}))
            resp = await _recv_json(ws)
            _assert_error(self, resp, "INVALID_STATE")

    async def test_speech_config_twice(self):
        """Send speech.config, get ack, send speech.config again → speech.error INVALID_STATE."""
        async with await _connect() as ws:
            ack = await _setup_session(ws)
            self.assertNotEqual(ack.get("type"), "speech.error", f"First config failed: {ack}")
            # second config
            msg = {
                "type": "speech.config",
                "payload": {
                    "language": "en",
                    "sample_rate": 16000,
                    "encoding": "pcm_s16le",
                    "window_duration_ms": 5000,
                    "overlap_duration_ms": 500,
                },
            }
            await ws.send(json.dumps(msg))
            resp = await _recv_json(ws)
            _assert_error(self, resp, "INVALID_STATE")

    async def asyncTearDown(self):
        self.assertTrue(_health_ok(), "Server not healthy after protocol-state test")


# ── Invalid field values ────────────────────────────────────────────────────

class TestInvalidValues(unittest.IsolatedAsyncioTestCase):
    """Send speech.config with individually invalid field values."""

    async def _config_expect_error(self, **overrides):
        async with await _connect() as ws:
            resp = await _setup_session(ws, **overrides)
            _assert_error(self, resp)

    async def test_sample_rate_zero(self):
        """sample_rate: 0 → speech.error."""
        await self._config_expect_error(sample_rate=0)

    async def test_sample_rate_negative(self):
        """sample_rate: -1 → speech.error."""
        await self._config_expect_error(sample_rate=-1)

    async def test_sample_rate_too_high(self):
        """sample_rate: 999999 → speech.error."""
        await self._config_expect_error(sample_rate=999999)

    async def test_sample_rate_string(self):
        """sample_rate: "sixteen thousand" → speech.error."""
        await self._config_expect_error(sample_rate="sixteen thousand")

    async def test_sample_rate_null(self):
        """sample_rate: null → speech.error."""
        await self._config_expect_error(sample_rate=None)

    async def test_encoding_invalid(self):
        """encoding: "mp3" → speech.error."""
        await self._config_expect_error(encoding="mp3")

    async def test_encoding_number(self):
        """encoding: 42 → speech.error."""
        await self._config_expect_error(encoding=42)

    async def test_language_too_long(self):
        """language: "A"*1000 → speech.error."""
        await self._config_expect_error(language="A" * 1000)

    async def test_window_zero(self):
        """window_duration_ms: 0 → speech.error."""
        await self._config_expect_error(window_duration_ms=0)

    async def test_window_negative(self):
        """window_duration_ms: -1 → speech.error."""
        await self._config_expect_error(window_duration_ms=-1)

    async def test_overlap_equals_window(self):
        """overlap_duration_ms == window_duration_ms → speech.error."""
        await self._config_expect_error(window_duration_ms=5000, overlap_duration_ms=5000)

    async def test_overlap_exceeds_window(self):
        """overlap_duration_ms > window_duration_ms → speech.error."""
        await self._config_expect_error(window_duration_ms=5000, overlap_duration_ms=6000)

    async def test_model_id_too_long(self):
        """model_id: "X"*200 → speech.error."""
        await self._config_expect_error(model_id="X" * 200)

    async def asyncTearDown(self):
        self.assertTrue(_health_ok(), "Server not healthy after invalid-values test")


# ── Payload size tests ──────────────────────────────────────────────────────

class TestPayloadSize(unittest.IsolatedAsyncioTestCase):
    """Send abnormally sized frames."""

    async def test_huge_json_payload(self):
        """Send ~1 MB JSON text frame → server handles without crash."""
        async with await _connect() as ws:
            huge = json.dumps({
                "type": "speech.config",
                "payload": {
                    "language": "A" * 1_000_000,
                    "sample_rate": 16000,
                    "encoding": "pcm_s16le",
                    "window_duration_ms": 5000,
                    "overlap_duration_ms": 500,
                },
            })
            await ws.send(huge)
            try:
                resp = await _recv_json(ws)
                _assert_error(self, resp)
            except (
                websockets.exceptions.ConnectionClosed,
                websockets.exceptions.ConnectionClosedError,
                asyncio.TimeoutError,
            ):
                pass  # closing the connection is also acceptable

    async def test_empty_binary_frame(self):
        """Send 0-byte binary frame after config → no crash."""
        async with await _connect() as ws:
            ack = await _setup_session(ws)
            self.assertNotEqual(ack.get("type"), "speech.error")
            await ws.send(b"")
            # server may ignore or error; either is fine as long as it stays up
            try:
                resp = await _recv_json(ws, timeout=3)
                # any response is acceptable
            except (asyncio.TimeoutError, websockets.exceptions.ConnectionClosed):
                pass

    async def test_odd_byte_binary_frame(self):
        """Send 101-byte binary frame (not aligned to int16) → no crash."""
        async with await _connect() as ws:
            ack = await _setup_session(ws)
            self.assertNotEqual(ack.get("type"), "speech.error")
            await ws.send(os.urandom(101))
            try:
                resp = await _recv_json(ws, timeout=3)
            except (asyncio.TimeoutError, websockets.exceptions.ConnectionClosed):
                pass

    async def test_single_byte_binary(self):
        """Send 1 byte binary → no crash."""
        async with await _connect() as ws:
            ack = await _setup_session(ws)
            self.assertNotEqual(ack.get("type"), "speech.error")
            await ws.send(b"\xff")
            try:
                resp = await _recv_json(ws, timeout=3)
            except (asyncio.TimeoutError, websockets.exceptions.ConnectionClosed):
                pass

    async def asyncTearDown(self):
        self.assertTrue(_health_ok(), "Server not healthy after payload-size test")


# ── Rapid connect / disconnect ──────────────────────────────────────────────

class TestStress(unittest.IsolatedAsyncioTestCase):
    """Stress the server with rapid connection churn."""

    async def test_rapid_connect_disconnect(self):
        """Open and close 50 connections rapidly → server still healthy."""
        for _ in range(50):
            try:
                ws = await _connect()
                await ws.close()
            except Exception:
                pass
        self.assertTrue(_health_ok(), "Server not healthy after rapid connect/disconnect")

    async def test_connect_send_config_disconnect_immediately(self):
        """Config then immediate close, 20 times → no resource leak."""
        for _ in range(20):
            try:
                ws = await _connect()
                config = json.dumps({
                    "type": "speech.config",
                    "payload": {
                        "language": "en",
                        "sample_rate": 16000,
                        "encoding": "pcm_s16le",
                        "window_duration_ms": 5000,
                        "overlap_duration_ms": 500,
                    },
                })
                await ws.send(config)
                await ws.close()
            except Exception:
                pass
        self.assertTrue(_health_ok(), "Server not healthy after config-then-close stress")

    async def test_connect_send_audio_disconnect_no_end(self):
        """Send audio but never send speech.end, just close → server cleans up."""
        try:
            ws = await _connect()
            ack = await _setup_session(ws)
            # send a few chunks of fake audio
            silence = b"\x00" * 3200  # 100ms of 16-bit 16kHz mono
            for _ in range(5):
                await ws.send(silence)
            # close without speech.end
            await ws.close()
        except Exception:
            pass
        self.assertTrue(_health_ok(), "Server not healthy after audio-no-end test")

    async def asyncTearDown(self):
        self.assertTrue(_health_ok(), "Server not healthy after stress test")


# ── Health after all abuse ──────────────────────────────────────────────────

class TestServerSurvival(unittest.IsolatedAsyncioTestCase):
    """Final check: the server still responds normally after all adversarial tests."""

    async def test_health_after_abuse(self):
        """GET /health returns 200 with status=ok after all adversarial tests."""
        url = f"{_http_base_url()}/health"
        req = urllib.request.Request(url, method="GET")
        with urllib.request.urlopen(req, timeout=5) as resp:
            self.assertEqual(resp.status, 200)
            body = json.loads(resp.read())
            self.assertEqual(body.get("status"), "ok")

    async def test_ready_after_abuse(self):
        """GET /ready returns 200 after all adversarial tests."""
        url = f"{_http_base_url()}/ready"
        req = urllib.request.Request(url, method="GET")
        with urllib.request.urlopen(req, timeout=5) as resp:
            self.assertEqual(resp.status, 200)


# ── CLI entry point ─────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Adversarial integration tests for OpenASR WebSocket server"
    )
    parser.add_argument(
        "--server-url",
        default=os.environ.get("OPENASR_WS_URL", "ws://localhost:9090/transcribe"),
        help="WebSocket endpoint (default: ws://localhost:9090/transcribe)",
    )
    parser.add_argument(
        "--api-key",
        default=os.environ.get("WSS_API_KEY", ""),
        help="Bearer token for Authorization header",
    )
    parser.add_argument(
        "--ingress",
        default=None,
        help="IP to resolve the server hostname to (DNS override)",
    )

    args, remaining = parser.parse_known_args()

    SERVER_URL = args.server_url
    API_KEY = args.api_key

    # DNS override: resolve the server hostname to a specific IP
    if args.ingress:
        parsed = urlparse(SERVER_URL)
        target_host = parsed.hostname
        target_ip = args.ingress

        _original_getaddrinfo = socket.getaddrinfo

        def _patched_getaddrinfo(host, port, *a, **kw):
            if host == target_host:
                host = target_ip
            return _original_getaddrinfo(host, port, *a, **kw)

        socket.getaddrinfo = _patched_getaddrinfo

    # Run with verbosity=2 for per-test output
    unittest.main(argv=["integration_tests"] + remaining, verbosity=2)
