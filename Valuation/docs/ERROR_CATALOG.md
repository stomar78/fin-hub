# Error Catalog

## Error Model
- error_id: stable code (e.g., VAL-INPUT-001)
- message: human-readable
- hint: remediation hint for clients
- http_status: 4xx/5xx
- trace_id: for correlation

## Common Errors
- VAL-INPUT-001: Invalid payload schema — Fix request body to match OpenAPI
- VAL-INPUT-002: Out-of-bounds parameter (e.g., growth > 50%) — Adjust to reasonable range
- VAL-DATA-001: External provider unavailable — Retry with backoff; use cached data
- VAL-DATA-002: Missing reference data (ERP/CRP) — Run seed loader or provide override
- VAL-CALC-001: DCF guardrail violated (terminal g too high) — Lower g
- VAL-CALC-002: Convergence failure (method) — Check inputs; try alternate method
- VAL-PDF-001: PDF renderer error — Retry; check template variables
- VAL-CASE-001: Case not found — Verify case_id

## Validation Rules (selected)
- Terminal growth `g` <= 6% (configurable); warn at > 4%
- WACC in [2%, 40%]; inputs validated individually
- Forecast horizon in [3, 15] years
- Multiples metric must be revenue or ebitda in Phase 1
