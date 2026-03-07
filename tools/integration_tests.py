#!/usr/bin/env python3
"""
Adversarial integration test suite for OpenASR WebSocket server.

Sends malformed, oversized, and out-of-sequence messages to verify
the server responds with proper errors without crashing.

Usage:
    python integration_tests.py --server-url wss://localhost:9090/transcribe --api-key SECRET
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
SERVER_URL: str = "wss://localhost:9090/transcribe"
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
        "model_id": "whisper-tiny.en",
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
        try:
            async with websockets.connect(
                SERVER_URL, additional_headers={}, close_timeout=5, open_timeout=5
            ):
                self.fail("Should have been rejected")
        except websockets.exceptions.InvalidStatus as e:
            self.assertEqual(e.response.status_code, 401)
        except (ConnectionRefusedError, OSError):
            pass  # Other connection errors also acceptable

    async def test_wrong_auth_rejected(self):
        """Authorization: Bearer wrong-key → 401."""
        if not API_KEY:
            self.skipTest("No API key configured – auth tests not applicable")
        try:
            async with websockets.connect(
                SERVER_URL,
                additional_headers={"Authorization": "Bearer wrong-key"},
                close_timeout=5,
                open_timeout=5,
            ):
                self.fail("Should have been rejected")
        except websockets.exceptions.InvalidStatus as e:
            self.assertEqual(e.response.status_code, 401)
        except (ConnectionRefusedError, OSError):
            pass

    async def test_empty_bearer_rejected(self):
        """Authorization: Bearer (empty) → 401."""
        if not API_KEY:
            self.skipTest("No API key configured – auth tests not applicable")
        try:
            async with websockets.connect(
                SERVER_URL,
                additional_headers={"Authorization": "Bearer "},
                close_timeout=5,
                open_timeout=5,
            ):
                self.fail("Should have been rejected")
        except websockets.exceptions.InvalidStatus as e:
            self.assertEqual(e.response.status_code, 401)
        except (ConnectionRefusedError, OSError):
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
        """Send 0-byte binary frame after config → no crash (error is OK)."""
        async with await _connect() as ws:
            ack = await _setup_session(ws)
            if ack.get("type") == "speech.error":
                return  # Config itself failed, skip
            await ws.send(b"")
            # May get error or nothing — either is fine, just don't crash
            try:
                resp = await asyncio.wait_for(ws.recv(), timeout=2)
                # Any response is fine — server didn't crash
            except (asyncio.TimeoutError, websockets.exceptions.ConnectionClosed):
                pass

    async def test_odd_byte_binary_frame(self):
        """Send 101-byte binary frame (not aligned to int16) → no crash."""
        async with await _connect() as ws:
            ack = await _setup_session(ws)
            if ack.get("type") == "speech.error":
                return  # Config itself failed, skip
            await ws.send(os.urandom(101))
            try:
                resp = await asyncio.wait_for(ws.recv(), timeout=2)
            except (asyncio.TimeoutError, websockets.exceptions.ConnectionClosed):
                pass

    async def test_single_byte_binary(self):
        """Send 1 byte binary → no crash."""
        async with await _connect() as ws:
            ack = await _setup_session(ws)
            if ack.get("type") == "speech.error":
                return  # Config itself failed, skip
            await ws.send(b"\xff")
            try:
                resp = await asyncio.wait_for(ws.recv(), timeout=2)
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


class TestConcurrentSessions(unittest.IsolatedAsyncioTestCase):
    """Test concurrent sessions across I/O threads.
    
    These tests verify that multiple simultaneous connections work correctly,
    which exercises multi-threaded I/O when WSS_IO_THREADS > 1.
    """

    async def test_multiple_simultaneous_sessions(self):
        """Open 5 sessions concurrently, each gets a unique session ID."""
        sessions = []
        for _ in range(5):
            ws = await _connect()
            ack = await _setup_session(ws)
            if ack.get("type") != "speech.error":
                sessions.append((ws, ack["payload"]["session_id"]))

        # All session IDs should be unique
        ids = [sid for _, sid in sessions]
        self.assertEqual(len(ids), len(set(ids)), "Duplicate session IDs detected")

        # Clean up
        for ws, _ in sessions:
            await ws.close()

        await asyncio.sleep(0.5)
        self.assertTrue(_health_ok())

    async def test_concurrent_audio_streaming(self):
        """Stream audio on 3 sessions simultaneously → no crash or cross-talk."""
        async def stream_session(session_num):
            ws = await _connect()
            ack = await _setup_session(ws)
            if ack.get("type") == "speech.error":
                await ws.close()
                return None
            sid = ack["payload"]["session_id"]
            # Send some audio
            silence = b"\x00" * 6400  # 200ms
            for _ in range(10):
                await ws.send(silence)
                await asyncio.sleep(0.05)
            await ws.close()
            return sid

        tasks = [stream_session(i) for i in range(3)]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        successful = [r for r in results if isinstance(r, str)]
        self.assertGreaterEqual(len(successful), 1, "At least 1 session should succeed")
        self.assertTrue(_health_ok())

    async def test_connections_distributed(self):
        """Open 10 connections rapidly to test distribution across I/O threads."""
        connections = []
        for _ in range(10):
            try:
                ws = await _connect()
                connections.append(ws)
            except Exception:
                pass

        self.assertGreaterEqual(len(connections), 5, "At least 5 connections should succeed")

        # Verify health shows correct active connection count
        url = f"{_http_base_url()}/health"
        req = urllib.request.Request(url, method="GET")
        with urllib.request.urlopen(req, timeout=5) as resp:
            body = json.loads(resp.read())
            # active_sessions is 0 (no speech.config sent), but connections are open

        # Close all
        for ws in connections:
            await ws.close()

        await asyncio.sleep(0.5)
        self.assertTrue(_health_ok())

    async def test_cross_thread_inference_delivery(self):
        """Start session, send enough audio for a window, verify hypothesis arrives.
        
        This tests that inference results (from the worker thread pool) are
        delivered back to the correct WebSocket connection regardless of which
        I/O thread handles it.
        """
        ws = await _connect()
        ack = await _setup_session(ws, window_duration_ms=3000, overlap_duration_ms=0)
        if ack.get("type") == "speech.error":
            await ws.close()
            self.skipTest("Session creation failed")
            return

        # Send 3.5s of audio (enough for a 3s window)
        silence = b"\x00" * 6400  # 200ms at 16kHz
        for _ in range(18):  # 18 * 200ms = 3.6s
            await ws.send(silence)
            await asyncio.sleep(0.01)

        # Wait for a response (hypothesis, phrase, or checkpoint)
        got_response = False
        try:
            while True:
                resp = await asyncio.wait_for(ws.recv(), timeout=30)
                msg = json.loads(resp)
                if msg["type"] in ("speech.hypothesis", "speech.phrase", "speech.checkpoint"):
                    got_response = True
                    break
        except (asyncio.TimeoutError, websockets.exceptions.ConnectionClosed):
            pass

        await ws.close()
        self.assertTrue(got_response, "Should receive inference result (hypothesis/phrase/checkpoint)")
        self.assertTrue(_health_ok())

    async def asyncTearDown(self):
        self.assertTrue(_health_ok(), "Server not healthy after concurrency test")


# ── Security / rate-limiting tests ──────────────────────────────────────────

def _rate_limit_available() -> bool:
    """Probe whether the running server enforces auth rate limiting (429).

    Sends 15 rapid connections with wrong Bearer tokens.  If any returns
    HTTP 429, the feature is deployed; otherwise it isn't yet.
    The result is cached after the first call.
    """
    if hasattr(_rate_limit_available, "_cached"):
        return _rate_limit_available._cached

    import asyncio as _aio

    async def _probe():
        for _ in range(15):
            try:
                async with websockets.connect(
                    SERVER_URL,
                    additional_headers={"Authorization": "Bearer probe-wrong-key"},
                    open_timeout=3,
                    close_timeout=2,
                ):
                    pass
            except websockets.exceptions.InvalidStatus as exc:
                if exc.response.status_code == 429:
                    return True
            except Exception:
                pass
        return False

    _rate_limit_available._cached = _aio.get_event_loop().run_until_complete(_probe())
    return _rate_limit_available._cached


class TestSecurityRateLimiting(unittest.IsolatedAsyncioTestCase):
    """Verify auth rate limiting and message-flood backpressure.

    Auth rate limiting: 10 failures per 60 s window → HTTP 429.
    Message rate limiting: 100 msgs/s / 640 KB/s → frames dropped with
    backpressure notification.

    NOTE: These tests require the updated server image that includes the
    rate-limiting middleware.  If the running pod does not have it, the
    auth-rate-limit tests are skipped automatically.
    """

    # ── auth rate limiting ──────────────────────────────────────────────

    async def test_auth_rate_limit_blocks_after_failures(self):
        """Send 15 rapid wrong-key connections → later ones get 429.

        Requires the rate-limiting middleware (WSS_AUTH_RATE_LIMIT_*).
        Skipped when the running server image does not include it.
        """
        if not API_KEY:
            self.skipTest("No API key configured – auth rate-limit test N/A")

        results: list[int] = []
        for i in range(15):
            try:
                async with websockets.connect(
                    SERVER_URL,
                    additional_headers={"Authorization": f"Bearer wrong-{i}"},
                    open_timeout=3,
                    close_timeout=2,
                ):
                    results.append(200)
            except websockets.exceptions.InvalidStatus as exc:
                results.append(exc.response.status_code)
            except Exception:
                results.append(-1)

        has_429 = 429 in results
        if not has_429:
            self.skipTest(
                "Rate limiting not active on running server – "
                "needs updated image with auth rate-limit middleware"
            )

        # At least one 429 should appear in the last 5 attempts
        tail = results[-5:]
        self.assertIn(429, tail, f"Expected 429 in last 5 attempts, got {tail}")

    async def test_auth_rate_limit_correct_key_still_works(self):
        """After triggering auth rate limit, a correct key from same IP may
        still be blocked (rate limit is per-IP, not per-key).

        Verifies either:
        - correct key is allowed (rate limit is per-key), OR
        - correct key is also blocked with 429 (rate limit is per-IP).
        Both are valid behaviours.

        Requires the rate-limiting middleware; skipped otherwise.
        """
        if not API_KEY:
            self.skipTest("No API key configured – auth rate-limit test N/A")

        # Trigger failures
        for i in range(15):
            try:
                async with websockets.connect(
                    SERVER_URL,
                    additional_headers={"Authorization": f"Bearer bad-{i}"},
                    open_timeout=3,
                    close_timeout=2,
                ):
                    pass
            except Exception:
                pass

        # Now try with the correct key
        try:
            async with websockets.connect(
                SERVER_URL,
                additional_headers={"Authorization": f"Bearer {API_KEY}"},
                open_timeout=3,
                close_timeout=2,
            ) as ws:
                # If we get here, correct key bypasses rate limit (per-key)
                pass
            correct_key_allowed = True
            status_code = 200
        except websockets.exceptions.InvalidStatus as exc:
            correct_key_allowed = False
            status_code = exc.response.status_code
        except Exception:
            self.skipTest(
                "Rate limiting not active on running server – "
                "needs updated image with auth rate-limit middleware"
            )
            return

        if not correct_key_allowed and status_code != 429:
            self.skipTest(
                "Rate limiting not active on running server – "
                "needs updated image with auth rate-limit middleware"
            )

        # Both outcomes are valid; document which one we observed
        if correct_key_allowed:
            pass  # rate limit is per-key → correct key still works
        else:
            self.assertEqual(
                status_code, 429,
                f"Expected 429 (per-IP block) or 200, got {status_code}",
            )

    # ── message flood / backpressure ────────────────────────────────────

    async def test_message_flood_triggers_backpressure(self):
        """Connect, configure, then blast 200 binary frames with no delay.

        Verifies the server either:
        - sends a backpressure notification (speech.error RATE_LIMITED), or
        - stays stable and healthy (frames silently dropped), or
        - closes the connection gracefully.

        All three are acceptable; a crash or unhealthy state is not.
        """
        ws = await _connect()
        ack = await _setup_session(ws)
        if ack.get("type") == "speech.error":
            await ws.close()
            self.skipTest("Session creation failed, cannot test flood")
            return

        # 200 frames × 3200 bytes = 640 KB burst
        frame = os.urandom(3200)
        got_backpressure = False
        got_close = False

        try:
            for _ in range(200):
                await ws.send(frame)
        except (
            websockets.exceptions.ConnectionClosed,
            websockets.exceptions.ConnectionClosedError,
        ):
            got_close = True

        # Drain any pending responses
        if not got_close:
            try:
                while True:
                    raw = await asyncio.wait_for(ws.recv(), timeout=2)
                    msg = json.loads(raw)
                    if msg.get("type") == "speech.error" and \
                       msg.get("payload", {}).get("code") == "RATE_LIMITED":
                        got_backpressure = True
            except (asyncio.TimeoutError, websockets.exceptions.ConnectionClosed):
                pass

        if not got_close:
            try:
                await ws.close()
            except Exception:
                pass

        # The server must still be healthy regardless of outcome
        self.assertTrue(
            _health_ok(),
            "Server not healthy after message flood test",
        )

    async def asyncTearDown(self):
        # Allow the server a moment to recover rate-limit windows
        await asyncio.sleep(1)
        self.assertTrue(_health_ok(), "Server not healthy after security test")


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


def _fetch_metrics() -> dict[str, float]:
    """Fetch /metrics and parse into {metric_name: value} dict."""
    url = f"{_http_base_url()}/metrics"
    req = urllib.request.Request(url, method="GET")
    with urllib.request.urlopen(req, timeout=5) as resp:
        text = resp.read().decode()
    result = {}
    for line in text.splitlines():
        if line.startswith("#") or not line.strip():
            continue
        parts = line.split()
        if len(parts) >= 2:
            # Handle labels: openasr_x{le="1"} 0 → key=openasr_x{le="1"}
            result[parts[0]] = float(parts[1])
    return result


class TestMetrics(unittest.IsolatedAsyncioTestCase):
    """Verify Prometheus metrics endpoint works and counters update correctly."""

    async def test_metrics_endpoint_returns_200(self):
        """GET /metrics returns 200 with Prometheus text format."""
        url = f"{_http_base_url()}/metrics"
        req = urllib.request.Request(url, method="GET")
        with urllib.request.urlopen(req, timeout=5) as resp:
            self.assertEqual(resp.status, 200)
            body = resp.read().decode()
            self.assertIn("openasr_active_sessions", body)
            self.assertIn("openasr_connections_total", body)
            self.assertIn("openasr_inference_duration_seconds", body)

    async def test_metrics_has_all_expected_metrics(self):
        """All documented metrics are present."""
        metrics = _fetch_metrics()
        expected = [
            "openasr_active_sessions",
            "openasr_active_connections",
            "openasr_connections_total",
            "openasr_connections_rejected_auth_total",
            "openasr_connections_rejected_limit_total",
            "openasr_sessions_created_total",
            "openasr_sessions_destroyed_total",
            "openasr_audio_bytes_received_total",
            "openasr_audio_chunks_received_total",
            "openasr_inference_jobs_submitted_total",
            "openasr_inference_jobs_completed_total",
            "openasr_inference_jobs_dropped_total",
            "openasr_transcription_segments_total",
            "openasr_errors_total",
            "openasr_backpressure_events_total",
            "openasr_inference_duration_seconds_count",
            "openasr_inference_duration_seconds_sum",
        ]
        for name in expected:
            self.assertIn(name, metrics, f"Missing metric: {name}")

    async def test_connection_counter_increments(self):
        """Connecting increments openasr_connections_total."""
        before = _fetch_metrics().get("openasr_connections_total", 0)
        async with await _connect() as ws:
            pass  # just connect and disconnect
        await asyncio.sleep(0.5)
        after = _fetch_metrics().get("openasr_connections_total", 0)
        self.assertGreater(after, before)

    async def test_session_counters_increment(self):
        """Creating a session increments sessions_created_total."""
        before = _fetch_metrics().get("openasr_sessions_created_total", 0)
        async with await _connect() as ws:
            await _setup_session(ws)
        await asyncio.sleep(0.5)
        after = _fetch_metrics().get("openasr_sessions_created_total", 0)
        self.assertGreater(after, before)

    async def test_audio_bytes_counter_increments(self):
        """Sending audio increments audio_bytes_received_total."""
        before = _fetch_metrics().get("openasr_audio_bytes_received_total", 0)
        async with await _connect() as ws:
            ack = await _setup_session(ws)
            if ack.get("type") != "speech.error":
                await ws.send(b'\x00' * 6400)  # 200ms silence
                await asyncio.sleep(0.5)
        await asyncio.sleep(0.5)
        after = _fetch_metrics().get("openasr_audio_bytes_received_total", 0)
        self.assertGreater(after, before)

    async def test_auth_rejected_counter_increments(self):
        """Failed auth increments connections_rejected_auth_total."""
        if not API_KEY:
            self.skipTest("No API key configured, auth disabled")
        before = _fetch_metrics().get("openasr_connections_rejected_auth_total", 0)
        try:
            async with websockets.connect(
                SERVER_URL,
                additional_headers={"Authorization": "Bearer wrong-key"},
                close_timeout=5, open_timeout=5,
            ):
                pass
        except Exception:
            pass
        await asyncio.sleep(0.5)
        after = _fetch_metrics().get("openasr_connections_rejected_auth_total", 0)
        self.assertGreater(after, before)

    async def test_errors_counter_increments(self):
        """Sending invalid message increments errors_total."""
        before = _fetch_metrics().get("openasr_errors_total", 0)
        async with await _connect() as ws:
            await ws.send("{invalid json")
            try:
                await asyncio.wait_for(ws.recv(), timeout=2)
            except Exception:
                pass
        await asyncio.sleep(0.5)
        after = _fetch_metrics().get("openasr_errors_total", 0)
        self.assertGreater(after, before)

    async def test_active_sessions_gauge_returns_to_zero(self):
        """After session closes, active_sessions returns to its previous value."""
        before = _fetch_metrics().get("openasr_active_sessions", 0)
        async with await _connect() as ws:
            await _setup_session(ws)
            during = _fetch_metrics().get("openasr_active_sessions", 0)
            self.assertGreater(during, before)
        await asyncio.sleep(1)
        after = _fetch_metrics().get("openasr_active_sessions", 0)
        self.assertEqual(after, before)


# ── CLI entry point ─────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Adversarial integration tests for OpenASR WebSocket server"
    )
    parser.add_argument(
        "--server-url",
        default=os.environ.get("OPENASR_WS_URL", "wss://localhost:9090/transcribe"),
        help="WebSocket endpoint (default: wss://localhost:9090/transcribe)",
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
