# Security and Privacy

## Authentication & Authorization
- OAuth2/OIDC (future), RBAC roles: Admin, Analyst, Viewer, Client

## Secrets
- Never commit API keys; use env vars; rotate via console later

## Data Protection
- TLS in transit; AES-256 at rest (DB/objects)
- PII minimized, stored separately when needed

## Compliance
- IVS 2024 documentation rigor
- UAE PDPL and India DPDP: consent, subject rights, retention, deletion SLAs

## AppSec
- SAST/DAST in CI, dependency scanning, tamper-evident logs
