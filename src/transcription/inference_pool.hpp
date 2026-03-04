#pragma once

#include "transcription/backend_interface.hpp"
#include "metrics/metrics.hpp"
#include "common.hpp"
#include <spdlog/spdlog.h>
#include <atomic>
#include <chrono>
#include <condition_variable>
#include <functional>
#include <mutex>
#include <queue>
#include <thread>
#include <vector>

namespace wss::transcription {

/// Work item for the inference thread pool.
struct InferenceJob {
    std::string session_id;
    std::vector<SampleFloat> audio; // owned copy from ring buffer
    int64_t window_start_ms = 0;
    int64_t window_end_ms = 0;

    using Callback = std::function<void(const std::string& session_id,
                                        TranscriptionResult result,
                                        int64_t window_start_ms,
                                        int64_t window_end_ms)>;
    Callback on_complete;
};

/// Thread pool dedicated to inference work.
/// Each thread has its own pre-allocated scratch buffer.
class InferencePool {
public:
    InferencePool(ITranscriptionBackend& backend, size_t num_threads, size_t max_queue_size = 100)
        : backend_(backend), running_(true), max_queue_size_(max_queue_size) {
        workers_.reserve(num_threads);
        for (size_t i = 0; i < num_threads; ++i) {
            workers_.emplace_back([this] { worker_loop(); });
        }
    }

    ~InferencePool() {
        shutdown();
    }

    InferencePool(const InferencePool&) = delete;
    InferencePool& operator=(const InferencePool&) = delete;

    /// Submit a job for async inference.
    void submit(InferenceJob job) {
        {
            std::lock_guard lock(mutex_);
            if (queue_.size() >= max_queue_size_) {
                spdlog::warn("Inference queue full ({} jobs), dropping job for session={}",
                    queue_.size(), job.session_id);
                metrics::Metrics::instance().inference_jobs_dropped_total.Increment();
                return;
            }
            queue_.push(std::move(job));
            metrics::Metrics::instance().inference_queue_depth.Set(static_cast<double>(queue_.size()));
        }
        cv_.notify_one();
    }

    /// Graceful shutdown: finish pending jobs then stop.
    void shutdown() {
        {
            std::lock_guard lock(mutex_);
            running_ = false;
        }
        cv_.notify_all();
        for (auto& t : workers_) {
            if (t.joinable()) t.join();
        }
        workers_.clear();
    }

    /// Number of pending jobs in the queue.
    [[nodiscard]] size_t pending() const {
        std::lock_guard lock(mutex_);
        return queue_.size();
    }

    /// Number of jobs currently being processed by worker threads.
    [[nodiscard]] size_t in_flight() const {
        return in_flight_.load(std::memory_order_acquire);
    }

    /// True when the queue is empty and no jobs are being processed.
    [[nodiscard]] bool drain_complete() const {
        std::lock_guard lock(mutex_);
        return queue_.empty() && in_flight_.load(std::memory_order_acquire) == 0;
    }

    /// Check if the backend is ready for inference.
    [[nodiscard]] bool backend_ready() const {
        return backend_.is_ready();
    }

private:
    void worker_loop() {
        while (true) {
            InferenceJob job;
            {
                std::unique_lock lock(mutex_);
                cv_.wait(lock, [this] { return !running_ || !queue_.empty(); });
                if (!running_ && queue_.empty()) return;
                job = std::move(queue_.front());
                queue_.pop();
                metrics::Metrics::instance().inference_queue_depth.Set(static_cast<double>(queue_.size()));
            }

            in_flight_.fetch_add(1, std::memory_order_acq_rel);

            // Run inference
            spdlog::info("Inference starting: session={} samples={} window_start={}ms",
                job.session_id, job.audio.size(), job.window_start_ms);
            auto t_start = std::chrono::steady_clock::now();
            auto result = backend_.transcribe(
                job.audio.data(), job.audio.size(), job.window_start_ms);
            auto t_end = std::chrono::steady_clock::now();
            double duration_s = std::chrono::duration<double>(t_end - t_start).count();
            metrics::Metrics::instance().inference_duration_seconds.Observe(duration_s);
            spdlog::info("Inference done: session={} segments={} duration={:.3f}s",
                job.session_id, result.segments.size(), duration_s);

            // Deliver result
            if (job.on_complete) {
                job.on_complete(job.session_id, std::move(result),
                    job.window_start_ms, job.window_end_ms);
            }

            in_flight_.fetch_sub(1, std::memory_order_acq_rel);
        }
    }

    ITranscriptionBackend& backend_;
    std::vector<std::thread> workers_;
    std::queue<InferenceJob> queue_;
    mutable std::mutex mutex_;
    std::condition_variable cv_;
    std::atomic<bool> running_;
    std::atomic<size_t> in_flight_{0};
    size_t max_queue_size_;
};

} // namespace wss::transcription
