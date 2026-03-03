# Contributing to OpenASR

Welcome! We're glad you're interested in contributing to OpenASR. Whether you're reporting a bug, suggesting a feature, or submitting code, your help is appreciated.

## Reporting Bugs

Please use our [bug report template](https://github.com/vbomfim/openasr/issues/new?template=bug_report.yml) to report issues. Include steps to reproduce, expected behavior, and any relevant logs.

## Suggesting Features

Feature ideas are welcome! Use the [feature request template](https://github.com/vbomfim/openasr/issues/new?template=feature_request.yml) to describe the problem you'd like to solve and your proposed solution.

## Development Setup

### Prerequisites

- C++20 compiler (GCC 11+, Clang 14+, or MSVC 2022+)
- CMake 3.20+
- libopus-dev
- libsamplerate0-dev
- zlib1g-dev

### Build Instructions

```bash
cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build --parallel
```

### Running Tests

Unit tests:

```bash
cd build
ctest --output-on-failure
```

Integration tests:

```bash
python3 tools/integration_tests.py
```

## Code Style

- C++20 standard
- No comments unless they clarify non-obvious logic
- Match existing code style throughout the project

## Pull Request Process

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes and add tests
4. Ensure all tests pass
5. Submit a pull request against `main`

### Commit Message Format

Use the following format: `type: description`

Types:
- `feat` — new feature
- `fix` — bug fix
- `docs` — documentation only
- `test` — adding or updating tests
- `ci` — CI/CD changes
- `refactor` — code restructuring without behavior change
- `security` — security improvements
- `build` — build system changes
- `chore` — maintenance tasks

### CI Requirements

All pull requests must pass CI before merging:
- Unit tests
- CodeQL security analysis
