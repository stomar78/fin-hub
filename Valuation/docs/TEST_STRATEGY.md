# Test Strategy

## Levels
- Unit: engine methods (wacc, dcf, multiples) with fixtures and golden cases
- Integration: Django + DRF endpoints with test DB and Redis (pytest-django)
- Contract: OpenAPI schema validation via drf-spectacular schema checks
- E2E (light): Next.js wizard → API → PDF link (mocked PDF)

## Techniques
- Property tests for discount factor monotonicity and guardrails (g <= long-run)
- Golden tests for sample companies with locked inputs
- Snapshot tests for JSON response shapes

## Tooling
- pytest, pytest-cov, pytest-django, DRF APIClient/APITestCase, factory-boy, faker

## Coverage Targets
- Engine ≥80% lines/branches
- API routers ≥70%

## CI Gates
- Lint (ruff/flake8), mypy, tests, coverage threshold, image build
