# Observability

## Logging
- Structured logs with trace IDs, method, case_id, duration

## Metrics
- API latency (p50/p95), queue depth (future), job durations, PDF render time

## Tracing
- Trace inbound request → engine methods → DB writes → PDF

## Dashboards & Alerts
- SLO: free valuation ≤5s p95
- Alerts on error rate spikes, cache misses, API provider failures
