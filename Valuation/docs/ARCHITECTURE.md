# System Architecture

## Logical View
- Frontend (Next.js): intake wizards, charts, downloads.
- Public API (Django + DRF): `/valuation/free`, `/calc/*`, `/cases/*`.
- Calculation Engine (Python): QuantLib-based methods (WACC, DCF, Multiples; later Bonds/Options/RE/Intangibles).
- Data Services: connectors for Alpha Vantage, FMP, Finnhub; Damodaran ERP/CRP loader.
- Storage: Postgres (core + reference), Redis cache, object store (optional), secrets via env/KMS.
- Back-office (Phase 2): Django CRM, QA workflow, n8n automations.
- Observability: central logging, metrics, traces.

## Deployment View
- Containers: django-api (gunicorn), workers (future), frontend, postgres, redis, (minio optional).
- Environments: dev/stage/prod with separate secrets and data.
- CI/CD: GitHub Actions → build/test → sign images → deploy.

## Module View (Engine `epiidosis_valuation`)
- core/dates.py: valuation date alignment (QuantLib evaluationDate)
- core/curves.py: risk-free curves per currency
- methods/wacc.py: CAPM/WACC
- methods/dcf.py: deterministic and scenario DCF
- methods/multiples.py: comps selection and bands
- risk/montecarlo.py: correlated draws (Phase 4)
- instruments (Phase 3): bonds/options
- realestate/income.py (Phase 3)
- intangibles/rfr.py (Phase 4)
- reporting/{summary,pdf}.py

## Data Flow
1. Intake → validate → persist `valuation_case`, `assumptions`.
2. Engine runs methods → writes `result` rows + sensitivity grid.
3. Reporter generates Free PDF (link stored to object store or local path).
4. Provenance logged to `source_ref`; actions to `audit_log`.

## Security & Compliance
- OAuth2/OIDC (future), RBAC, least privileges.
- IVS 2024 alignment (Data & Inputs, Documentation, Financial Instruments chapters).
- UAE PDPL, India DPDP handling; PII minimized and encrypted.
