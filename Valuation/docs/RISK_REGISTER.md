# Risk Register

| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|------------|--------|------------|
| R1 | API rate limits cause failures | Medium | Medium | Caching, backoff, manual overrides |
| R2 | Standards drift vs IVS updates | Low | Medium | Annual review, QA checklist updates |
| R3 | Data inaccuracies from free feeds | Medium | High | Provenance logging, analyst review for vetted tier |
| R4 | Performance regressions | Medium | Medium | Benchmarks, p95 SLO alerts |
| R5 | Secret leakage | Low | High | Env-only secrets, scanning in CI |
