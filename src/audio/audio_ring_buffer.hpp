#pragma once

#include "common.hpp"
#include <algorithm>
#include <cassert>
#include <cstring>
#include <vector>

namespace wss::audio {

/// Fixed-capacity ring buffer for float32 audio samples.
/// Pre-allocated at construction, no heap allocations on the hot path.
/// Supports zero-copy window extraction via contiguous memcpy.
class AudioRingBuffer {
public:
    /// Construct with capacity in samples. Allocates once.
    explicit AudioRingBuffer(size_t capacity)
        : buffer_(capacity, 0.0f), capacity_(capacity) {}

    AudioRingBuffer(const AudioRingBuffer&) = delete;
    AudioRingBuffer& operator=(const AudioRingBuffer&) = delete;
    AudioRingBuffer(AudioRingBuffer&&) = default;
    AudioRingBuffer& operator=(AudioRingBuffer&&) = default;

    /// Write samples into the ring buffer.
    /// If the buffer is full, oldest samples are overwritten.
    /// Returns number of samples actually written (always == count unless count > capacity).
    size_t write(const SampleFloat* samples, size_t count) {
        if (count == 0) return 0;

        // If writing more than capacity, only keep the last capacity samples
        if (count > capacity_) {
            samples += (count - capacity_);
            count = capacity_;
        }

        size_t first_chunk = std::min(count, capacity_ - write_pos_);
        std::memcpy(buffer_.data() + write_pos_, samples, first_chunk * sizeof(SampleFloat));

        if (first_chunk < count) {
            size_t second_chunk = count - first_chunk;
            std::memcpy(buffer_.data(), samples + first_chunk, second_chunk * sizeof(SampleFloat));
            write_pos_ = second_chunk;
        } else {
            write_pos_ = (write_pos_ + first_chunk) % capacity_;
        }

        size_t new_total = total_written_ + count;
        if (new_total < total_written_) {
            // Overflow guard — practically impossible at 16kHz
            total_written_ = count;
        } else {
            total_written_ = new_total;
        }

        return count;
    }

    /// Extract a window of `count` samples into `dest`.
    /// `offset_from_end` specifies how far back from the write head.
    /// Returns actual number of samples copied (may be less if not enough data).
    size_t extract_window(SampleFloat* dest, size_t count, size_t offset_from_end = 0) const {
        size_t avail = available();
        if (offset_from_end >= avail) return 0;

        size_t max_count = avail - offset_from_end;
        count = std::min(count, max_count);

        // Calculate start position in ring buffer
        size_t total_offset = offset_from_end + count;
        size_t start;
        if (total_offset <= write_pos_) {
            start = write_pos_ - total_offset;
        } else {
            start = capacity_ - (total_offset - write_pos_);
        }

        // Copy — may wrap around
        size_t first_chunk = std::min(count, capacity_ - start);
        std::memcpy(dest, buffer_.data() + start, first_chunk * sizeof(SampleFloat));

        if (first_chunk < count) {
            std::memcpy(dest + first_chunk, buffer_.data(), (count - first_chunk) * sizeof(SampleFloat));
        }

        return count;
    }

    /// Number of valid samples currently in the buffer.
    [[nodiscard]] size_t available() const {
        return std::min(total_written_, capacity_);
    }

    /// Total samples ever written (monotonically increasing).
    [[nodiscard]] size_t total_written() const { return total_written_; }

    /// Buffer capacity in samples.
    [[nodiscard]] size_t capacity() const { return capacity_; }

    /// Fill ratio (0.0 = empty, 1.0 = full).
    [[nodiscard]] float fill_ratio() const {
        return static_cast<float>(available()) / static_cast<float>(capacity_);
    }

    /// Reset buffer state without deallocating.
    void reset() {
        write_pos_ = 0;
        total_written_ = 0;
    }

private:
    std::vector<SampleFloat> buffer_;
    size_t capacity_;
    size_t write_pos_ = 0;
    size_t total_written_ = 0;
};

} // namespace wss::audio
