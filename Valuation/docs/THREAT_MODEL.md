# Threat Model (STRIDE)

## Assets
- Valuation cases, assumptions, results, PDFs, API keys, PII (limited)

## Trust Boundaries
- Internet → API
- API → Engine/DB/Redis
- API → External APIs (Alpha Vantage/FMP/Finnhub)
- Analyst portal (Phase 2)

## STRIDE Analysis
- Spoofing: enforce AuthN/OIDC (Phase 2), signed URLs for PDFs
- Tampering: immutability of results versions; audit logs with hashes
- Repudiation: audit_log with actor, action, before/after snapshots
- Information Disclosure: least-privilege DB roles; field-level encryption for PII
- Denial of Service: rate limiting per IP/key; circuit breakers for upstream data
- Elevation of Privilege: RBAC; input validation; dependency scanning

## Controls
- OAuth2/OIDC and RBAC (Phase 2+)
- Input validation with Pydantic; size limits on payloads
- Caching and rate limiting with Redis
- Secure secrets management; no keys in repo
- SAST/DAST and SBOM in CI
