# Non-Functional Requirements

## Performance
- Free endpoint p95 ≤ 5s for standard payloads (≤10y forecast, ≤50 comps)
- API cold start ≤ 1s (container warm in prod)

## Scalability
- Horizontal scaling for API and workers
- Redis-backed cache for market data and seeds

## Reliability
- 99.9% monthly uptime target for API (Phase 2+)
- Idempotent POST operations with idempotency keys

## Maintainability
- Modular engine with clear boundaries; ≥80% unit coverage
- Type hints and static checks (mypy, ruff)

## Security
- Secrets via env/KMS; no plaintext keys in repo
- OWASP ASVS L1 baseline

## Observability
- Structured logs, tracing, metrics

## Compliance
- IVS 2024 documentation mapping enforced via QA checklist
