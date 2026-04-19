# Implementation Plan (Phase 1: MVP Free Tier)

## Objectives
- Deliver `/valuation/free` with WACC, DCF, Multiples and a 1–2 page PDF.
- Establish data provenance, schema, and CI.

## Work Packages
- WP1: Repo scaffolding (monorepo: apps/api (Django+DRF), apps/frontend, packages/engine, infra, docs)
- WP2: Engine skeleton with methods (stubs + tests)
- WP3: Django + DRF service with `/calc` and `/valuation/free`
- WP4: Data seeds (Damodaran ERP/CRP) + caching and provenance
- WP5: Database schema via Django models + migrations
- WP6: PDF generator (WeasyPrint) for Free report
- WP7: Next.js 4-step wizard
- WP8: Docker Compose dev env

## Detailed Tasks
- T1: pyproject for engine; pytest and coverage; type checking
- T2: methods/wacc with ERP/CRP inputs; unit + golden tests
- T3: methods/dcf with guardrails and sensitivity grid
- T4: methods/multiples with FinanceToolkit; bands p25–p75
- T5: DRF serializers/viewsets for inputs/outputs; OpenAPI via drf-spectacular
- T6: Django ORM models and migrations
- T7: Seed loader for Damodaran datasets; caching to Redis
- T8: Django middleware/logging and provenance hooks
- T9: `/valuation/free` pipeline: method weights and range aggregation
- T10: Free PDF template with assumptions snapshot
- T11: Next.js wizard pages, form validation, charts
- T12: —

## Acceptance Criteria
- API returns value range within 5s p95 for test cases
- All unit tests pass; coverage ≥80% for engine methods
- Free PDF generated and retrievable by case_id
- OpenAPI generated and documented via drf-spectacular

## Dependencies
- Python 3.11, Node 20, Postgres 15, Redis 7

## Risks & Mitigations
- API limits: cache and backoff; allow manual inputs
- Standards drift: pin IVS 2024 and checklist in QA

## Timeline
- Phase 1: 2 weeks (calendar) with daily checkpoints. CI/CD deferred to later phase.
