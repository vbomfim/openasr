#pragma once

#include "transcription/backend_interface.hpp"
#include "object_pool.hpp"
#include <whisper.h>
#include <spdlog/spdlog.h>
#include <memory>
#include <stdexcept>
#include <string>

namespace wss::transcription {

/// whisper.cpp-based transcription backend.
/// Model context loaded once and shared; whisper_state pooled for concurrency.
class WhisperBackend : public ITranscriptionBackend {
public:
    ~WhisperBackend() override {
        state_pool_.reset();
        if (ctx_) {
            whisper_free(ctx_);
            ctx_ = nullptr;
        }
    }

    bool initialize(const BackendConfig& config) override {
        config_ = config;

        // Load model (shared context, no per-context state)
        whisper_context_params cparams = whisper_context_default_params();
        ctx_ = whisper_init_from_file_with_params_no_state(
            config.model_path.c_str(), cparams);

        if (!ctx_) {
            spdlog::error("Failed to load whisper model: {}", config.model_path);
            return false;
        }

        spdlog::info("Whisper model loaded: {}", config.model_path);

        // Create state pool (one state per inference thread)
        size_t pool_size = static_cast<size_t>(std::max(1, config.n_threads));
        state_pool_ = std::make_unique<ObjectPool<whisper_state*>>(
            pool_size,
            [this]() -> whisper_state* {
                return whisper_init_state(ctx_);
            },
            [](whisper_state*& state) {
                if (state) {
                    whisper_free_state(state);
                    state = nullptr;
                }
            }
        );

        spdlog::info("Whisper state pool created: size={}", pool_size);
        ready_ = true;
        return true;
    }

    TranscriptionResult transcribe(
        const SampleFloat* samples,
        size_t sample_count,
        int64_t window_start_ms
    ) override {
        if (!ready_ || !ctx_) {
            return {};
        }

        // Checkout a state from the pool
        auto state_opt = state_pool_->try_checkout();
        if (!state_opt) {
            spdlog::warn("No whisper_state available in pool — inference skipped");
            return {};
        }
        auto* state = *state_opt;
        spdlog::info("Whisper state checked out, configuring params...");

        // Configure inference parameters
        whisper_full_params params = whisper_full_default_params(WHISPER_SAMPLING_BEAM_SEARCH);
        params.language = config_.language.c_str();
        params.n_threads = 1; // use 1 thread per inference call for safety
        params.beam_search.beam_size = config_.beam_size;
        params.no_timestamps = false;
        params.print_progress = true;
        params.print_special = false;
        params.print_realtime = false;
        params.print_timestamps = false;
        params.single_segment = false;
        params.no_context = true; // each window is independent

        spdlog::info("Calling whisper_full_with_state: samples={}", sample_count);

        // Run inference
        int ret = whisper_full_with_state(
            ctx_, state, params,
            samples, static_cast<int>(sample_count));
        spdlog::info("whisper_full_with_state returned: {}", ret);

        TranscriptionResult result;

        if (ret != 0) {
            spdlog::error("whisper_full_with_state failed: ret={}", ret);
            state_pool_->checkin(state);
            return result;
        }

        // Extract segments
        int n_segments = whisper_full_n_segments_from_state(state);
        result.segments.reserve(static_cast<size_t>(n_segments));

        for (int i = 0; i < n_segments; ++i) {
            const char* text = whisper_full_get_segment_text_from_state(state, i);
            int64_t t0 = whisper_full_get_segment_t0_from_state(state, i);
            int64_t t1 = whisper_full_get_segment_t1_from_state(state, i);

            // whisper.cpp timestamps are in centiseconds (10ms units)
            result.segments.push_back({
                .start_ms = window_start_ms + t0 * 10,
                .end_ms = window_start_ms + t1 * 10,
                .text = text ? text : "",
                .speaker = ""
            });
        }

        // Return state to pool
        state_pool_->checkin(state);

        return result;
    }

    [[nodiscard]] bool is_ready() const override { return ready_; }

private:
    BackendConfig config_;
    whisper_context* ctx_ = nullptr;
    std::unique_ptr<ObjectPool<whisper_state*>> state_pool_;
    bool ready_ = false;
};

} // namespace wss::transcription
