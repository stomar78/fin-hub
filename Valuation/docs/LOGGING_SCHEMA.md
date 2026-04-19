# Logging Schema

## Fields
- timestamp: ISO8601
- level: debug|info|warn|error
- trace_id: string
- span_id: string (optional)
- service: api|engine|worker|frontend
- route: e.g., /valuation/free
- method: HTTP method
- case_id: uuid (optional)
- event: code (e.g., CALC_WACC_START)
- duration_ms: number (optional)
- inputs_hash: short hash of inputs (optional)
- error_id: from ERROR_CATALOG (optional)
- message: string

## Examples
```json
{"timestamp":"2025-01-01T10:00:00Z","level":"info","trace_id":"abc123","service":"api","route":"/valuation/free","event":"FREE_PIPELINE_START","message":"Start free valuation","case_id":"..."}
```
