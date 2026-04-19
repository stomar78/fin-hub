# Valuation Platform

Comprehensive, IVS 2024–aligned valuation platform supporting free instant valuations and vetted analyst reports across asset classes.

- Frontend: Next.js (wizard + dashboards)
- API: Django + Django REST Framework (DRF)
- Engine: Python package `epiidosis_valuation` (QuantLib-based)
- Data: Alpha Vantage/FMP/Finnhub, Damodaran ERP/CRP seeds
- Storage: Postgres (Django migrations), Redis cache, optional object store

See docs/ for architecture, plans, testing, QA, security, and roadmap.

## Design & Theme
- Design System Spec: docs/DESIGN_SYSTEM_SPEC.md
- UI/UX Architecture: docs/UI_UX_ARCHITECTURE.md
- Components Catalog: docs/COMPONENTS_CATALOG.md
- Public Pages (section-by-section): docs/public_pages/
- Frontend Theme Files (reference for pages/components):
  - apps/frontend/tailwind.config.js (tokens, gradients, shadows)
  - apps/frontend/styles/theme.css (CSS tokens/utilities)
  - apps/frontend/lib/motionVariants.ts (Framer Motion variants)

## Current Status
- Phase 1 (MVP Free Tier): Core backend, engine wiring, seeds, free pipeline, HTML/PDF report, and Next.js wizard are implemented. Docker Compose is ready for dev. CI/CD deferred.

## Quick Links
- docs/ARCHITECTURE.md
- docs/IMPLEMENTATION_PLAN.md
- docs/API_SPEC.md
- docs/DATA_MODEL.md
- docs/TEST_STRATEGY.md
- docs/QA_CHECKLIST.md
- docs/SECURITY_AND_PRIVACY.md
- docs/OBSERVABILITY.md
- docs/ROADMAP.md
- docs/DECISIONS.md
- docs/COMPLIANCE_IVS.md
- docs/CONTRIBUTING.md

## Quickstart

### Backend (local)
1) Python 3.12
2) Create venv and install deps
   - `python -m venv .venv`
   - `./.venv/Scripts/pip install -r apps/api/requirements.txt`
3) Migrate and run
   - `./.venv/Scripts/python apps/api/manage.py migrate`
   - `./.venv/Scripts/python apps/api/manage.py runserver 0.0.0.0:8000`
4) Open API docs: http://localhost:8000/api/docs/

### Frontend (local)
1) From `apps/frontend`
   - `npm install`
   - `npm run dev`
2) Open: http://localhost:3000

Optional Tailwind setup (if enabling utility classes):
- Install deps: `npm i -D tailwindcss postcss autoprefixer`
- Add PostCSS config `apps/frontend/postcss.config.js`:
  ```js
  module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };
  ```
- Import `styles/theme.css` in `app/layout.tsx` (already done).

### Docker Compose (dev)
1) From `infra/`
   - `docker compose up --build`
2) API at http://localhost:8000, Swagger at `/api/docs/`
3) PDF rendering works inside container (WeasyPrint runtime installed). Locally on Windows, HTML fallback is used.

### QuantLib (optional)
- Enable QuantLib-backed DCF by setting env `QL_ENABLED=true` before starting the API.
- If QuantLib is not available, the API automatically falls back to the pure-Python implementation.
