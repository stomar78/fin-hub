 # Work Tracker (Phase 1)

## Status Legend
- Todo | In Progress | Blocked | Done | Deferred

## Tasks
- Decisions confirmation — Done
- Docs baseline — Done
- Repo scaffolding — Done
- Engine skeleton — Done
- Django + DRF service skeleton — Done
- DB schema & migrations — Done
- Wire views to engine — Done
- Basic smoke test — Done
- Damodaran seed loader — Done
- `/valuation/free` pipeline — Done
- Free PDF template — Done
- Next.js wizard — Done
- Docker Compose — Done
- CI workflow — Deferred (out of Phase 1 scope)
- README quickstart update — Done
- Phase 1 polish checklist — Done (see docs/PHASE1_POLISH.md)
- Persist ValuationCase + retrieval endpoint — Done
- Assumptions snapshot on free submission — Done
- Cases list endpoint + report link saved (SourceRef) — Done
- Admin registrations for models — Done
- Frontend cases list & detail pages — Done
- Secrets hygiene (.env.local gitignored, .env.example added) — Done
- Provider integration (Alpha Vantage global quote) — Done
- Provider caching & rate-limit handling — Done
- QuantLib integration (engine + DCF via feature flag) — Done
- QuantLib tests and README note (QL_ENABLED) — Done
- QuantLib: Bond pricing endpoint — Done
- QuantLib: European option pricing endpoint — Done
- Frontend: Bond pricing page — Done
- Frontend: European option pricing page — Done

- QuantLib: Plain vanilla swap pricing endpoint — Done
- Frontend: Swap pricing page — Done
- Frontend: API base via env (NEXT_PUBLIC_API_BASE) — Done

## Gaps / Improvements (Todo)
- Error normalization: consistent error shape for all endpoints — Todo
- Provider rate-limit backoff (exponential backoff, retry-after) — Todo
- Providers/fallbacks and data stitching into valuation inputs — Todo
- Caching strategy: per-symbol TTLs, invalidation, stale-while-revalidate — Todo

### Providers & Data
- Additional providers/fallbacks (FMP/Finnhub) with env-based switching — Todo

### QuantLib & Analytics
- Term-structure bootstrapping from market quotes — Todo
- Midyear convention fully integrated with QL date math — Todo
- Greeks/explain for more instruments; scenario/sensitivity tooling — Todo

## New Completed Items
- Provider-informed curves (term structures) for swaps/bonds — Done
- Persist instrument pricing requests/results (audit logging) — Done
- Backend env loading via apps/api/.env.local; .env.example added — Done
- Bond pricing FlatForward overload fix — Done
- Cases list/detail public + demo mode (unauthenticated) — Done
- Free valuation endpoint public (no auth) — Done
- Frontend public pages scaffolded:
  - /dashboard (User Dashboard) — Done
  - /marketplace (API Marketplace) — Done
  - /currency (Multi-Currency) — Done
  - /partners (Partner Portal) — Done
- Documentation:
  - docs/MODULES_CONTENT_PLAN.md — Done
  - docs/ACCOUNTS_AND_FINANCIALS_WORKFLOW.md — Done
  - docs/UI_UX_ARCHITECTURE.md — Done
  - Public pages design (section-by-section) — Done
    - docs/public_pages/LANDING_PAGE_DESIGN.md
    - docs/public_pages/ABOUT_PAGE_DESIGN.md
    - docs/public_pages/VALUATION_TYPES_PAGE_DESIGN.md
    - docs/public_pages/PRICING_PAGE_DESIGN.md
    - docs/public_pages/REPORTS_SAMPLES_PAGE_DESIGN.md
    - docs/public_pages/CONTACT_PAGE_DESIGN.md

## Next Up (Proposed)
- Error normalization across endpoints (unified error schema)
- Provider backoff & Retry-After handling (Alpha)
- SWR caching for data endpoints
- QuantLib advanced: bootstrapped curves, midyear convention, Greeks/scenarios

## Frontend Priorities
- Navbar/Footer across site (links to all public + modules pages)
- Dashboard: wire to GET /api/instruments/quotes (X-User) and Cases list
- API Marketplace: Try Now links + request examples; docs link
- Multi-Currency: add FX fetcher and animated conversions
- Pricing: comparison table + FAQ accordion
- Reports & Samples: PDF preview embed + sample link
