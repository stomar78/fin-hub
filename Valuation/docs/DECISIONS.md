# Decisions Log

- Monorepo with apps/api, apps/frontend, packages/engine, infra, docs (accepted)
- Backend: Django + Django REST Framework (accepted)
- Versions: Python 3.12, Node 20/Next 14, Postgres 15, Redis 7 (accepted)
- Migrations: Django migrations (accepted)
- PDF generator: WeasyPrint (accepted)
- Engine name: `epiidosis_valuation` (accepted)
- Cloud target: Docker Compose for dev (accepted); PaaS target TBD (proposed)
- Secrets management (dev): `.env` file; `DATABASE_URL` via dj-database-url; API keys optional envs (accepted)
- CORS: allow all origins in dev; tighten for prod (accepted)

Update upon stakeholder confirmation.
