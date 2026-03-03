# Security Policy

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| latest  | ✅ Yes             |
| < 0.1.0 | ❌ No              |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do NOT open a public GitHub issue.**
2. Email: [security@openasr.dev](mailto:security@openasr.dev) or use [GitHub Security Advisories](https://github.com/vbomfim/openasr/security/advisories/new).
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will acknowledge receipt within 48 hours and provide a fix timeline within 7 days.

## Security Measures

This project implements:
- API key authentication (Bearer token, header-only — no query strings)
- Input validation on all WebSocket messages (field types, ranges, string lengths)
- Connection and session limits (DoS protection)
- Inference queue depth limits (OOM protection)
- Exception handling in all audio processing paths
- Distroless container image (no shell, minimal attack surface)
- Non-root container execution
- Security-hardened compiler flags (`-fstack-protector-strong`, `-D_FORTIFY_SOURCE=2`, RELRO/NOW)
- CodeQL static analysis on every push
- Dependabot for dependency updates
