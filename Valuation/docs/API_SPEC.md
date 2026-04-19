# API Specification (Seed)

Base URL: `/api` (Django + DRF)

Documentation: OpenAPI 3 via drf-spectacular at `/api/schema/` and Swagger UI at `/api/docs/`.

## POST /valuation/free
- Request: company basics, sector, country, currency, TTM revenue, margin, growth, stage
- Response: { case_id, value_low, value_mid, value_high, method_weights, sensitivity, pdf_url }
- Validation: DRF serializers with field bounds and business rules (see ERROR_CATALOG)
- Throttling: DRF scoped rate limits for anonymous and authenticated

## POST /calc/wacc
- Request: risk-free, beta, ERP, CRP, size, specific, tax_rate, debt_cost, debt_ratio
- Response: { wacc, ke, kd_after_tax, inputs, sources }

## POST /calc/dcf
- Request: forecast array, discount_rate, terminal_method, g or exit_multiple, midyear, valuation_date
- Response: { npv, tv, df_table, sensitivity }

## POST /calc/multiples
- Request: metric (revenue/ebitda), value, comps (optional), sector, overrides
- Response: { implied_values: {low, mid, high}, comps_used, bands }

## GET /cases/{id}
- Response: case record with assumptions and latest results (Phase 1 minimal)

## Notes
- Idempotency via header; trace-id in responses; pagination not needed for Phase 1.
- Authentication (Phase 2): JWT/OIDC, DRF permissions & RBAC.
