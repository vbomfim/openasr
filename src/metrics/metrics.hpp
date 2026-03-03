#pragma once

#include <prometheus/counter.h>
#include <prometheus/gauge.h>
#include <prometheus/histogram.h>
#include <prometheus/registry.h>
#include <memory>

namespace wss::metrics {

class Metrics {
public:
    static Metrics& instance() {
        static Metrics m;
        return m;
    }

    std::shared_ptr<prometheus::Registry> registry() { return registry_; }

private:
    // registry_ must be declared first — members initialize in declaration order
    std::shared_ptr<prometheus::Registry> registry_;

public:
    // --- Gauges ---
    prometheus::Gauge& active_sessions;
    prometheus::Gauge& active_connections;
    prometheus::Gauge& inference_queue_depth;

    // --- Counters ---
    prometheus::Counter& connections_total;
    prometheus::Counter& connections_rejected_auth;
    prometheus::Counter& connections_rejected_limit;
    prometheus::Counter& sessions_created_total;
    prometheus::Counter& sessions_destroyed_total;
    prometheus::Counter& audio_bytes_received_total;
    prometheus::Counter& audio_chunks_received_total;
    prometheus::Counter& inference_jobs_submitted_total;
    prometheus::Counter& inference_jobs_completed_total;
    prometheus::Counter& inference_jobs_dropped_total;  // queue full
    prometheus::Counter& transcription_segments_total;
    prometheus::Counter& errors_total;
    prometheus::Counter& backpressure_events_total;

    // --- Histograms ---
    prometheus::Histogram& inference_duration_seconds;  // per-window inference time
    prometheus::Histogram& audio_window_duration_seconds;  // audio window size

private:
    Metrics()
        : registry_(std::make_shared<prometheus::Registry>())

        // Gauges
        , active_sessions(prometheus::BuildGauge()
            .Name("openasr_active_sessions")
            .Help("Number of active transcription sessions")
            .Register(*registry_).Add({}))
        , active_connections(prometheus::BuildGauge()
            .Name("openasr_active_connections")
            .Help("Number of active WebSocket connections")
            .Register(*registry_).Add({}))
        , inference_queue_depth(prometheus::BuildGauge()
            .Name("openasr_inference_queue_depth")
            .Help("Number of inference jobs waiting in queue")
            .Register(*registry_).Add({}))

        // Counters
        , connections_total(prometheus::BuildCounter()
            .Name("openasr_connections_total")
            .Help("Total WebSocket connections")
            .Register(*registry_).Add({}))
        , connections_rejected_auth(prometheus::BuildCounter()
            .Name("openasr_connections_rejected_auth_total")
            .Help("Connections rejected due to auth failure")
            .Register(*registry_).Add({}))
        , connections_rejected_limit(prometheus::BuildCounter()
            .Name("openasr_connections_rejected_limit_total")
            .Help("Connections rejected due to connection limit")
            .Register(*registry_).Add({}))
        , sessions_created_total(prometheus::BuildCounter()
            .Name("openasr_sessions_created_total")
            .Help("Total sessions created")
            .Register(*registry_).Add({}))
        , sessions_destroyed_total(prometheus::BuildCounter()
            .Name("openasr_sessions_destroyed_total")
            .Help("Total sessions destroyed")
            .Register(*registry_).Add({}))
        , audio_bytes_received_total(prometheus::BuildCounter()
            .Name("openasr_audio_bytes_received_total")
            .Help("Total audio bytes received")
            .Register(*registry_).Add({}))
        , audio_chunks_received_total(prometheus::BuildCounter()
            .Name("openasr_audio_chunks_received_total")
            .Help("Total audio binary frames received")
            .Register(*registry_).Add({}))
        , inference_jobs_submitted_total(prometheus::BuildCounter()
            .Name("openasr_inference_jobs_submitted_total")
            .Help("Total inference jobs submitted")
            .Register(*registry_).Add({}))
        , inference_jobs_completed_total(prometheus::BuildCounter()
            .Name("openasr_inference_jobs_completed_total")
            .Help("Total inference jobs completed")
            .Register(*registry_).Add({}))
        , inference_jobs_dropped_total(prometheus::BuildCounter()
            .Name("openasr_inference_jobs_dropped_total")
            .Help("Inference jobs dropped due to full queue")
            .Register(*registry_).Add({}))
        , transcription_segments_total(prometheus::BuildCounter()
            .Name("openasr_transcription_segments_total")
            .Help("Total transcription segments produced")
            .Register(*registry_).Add({}))
        , errors_total(prometheus::BuildCounter()
            .Name("openasr_errors_total")
            .Help("Total errors sent to clients")
            .Register(*registry_).Add({}))
        , backpressure_events_total(prometheus::BuildCounter()
            .Name("openasr_backpressure_events_total")
            .Help("Total backpressure events sent")
            .Register(*registry_).Add({}))

        // Histograms
        , inference_duration_seconds(prometheus::BuildHistogram()
            .Name("openasr_inference_duration_seconds")
            .Help("Inference duration per window in seconds")
            .Register(*registry_).Add({}, prometheus::Histogram::BucketBoundaries{
                0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0, 30.0, 60.0, 120.0}))
        , audio_window_duration_seconds(prometheus::BuildHistogram()
            .Name("openasr_audio_window_duration_seconds")
            .Help("Audio window duration in seconds")
            .Register(*registry_).Add({}, prometheus::Histogram::BucketBoundaries{
                1.0, 2.0, 5.0, 10.0, 20.0, 30.0, 60.0}))
    {}
};

} // namespace wss::metrics
