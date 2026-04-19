# Deployment Guide

## Local (Dev)
- Prereqs: Docker, Docker Compose, Python 3.11, Node 20
- Services: django-api, postgres, redis (frontend later)
- Env: `.env` with DATABASE_URL, REDIS_URL, ALPHA_VANTAGE_API_KEY (optional)
- Steps: build images → run compose → `python manage.py migrate` → smoke tests

## Staging/Prod (Preview)
- Build: GitHub Actions → test → build images → sign → push to registry
- Deploy: container platform (Fly/Render/ECS/Kubernetes)
- Secrets: platform secret manager or KMS
- Migrations: run `python manage.py migrate` on deploy; static files via `python manage.py collectstatic`

## Configuration
- DATABASE_URL: postgres connection string
- REDIS_URL: redis connection string
- LOG_LEVEL: info|debug
- CORS_ORIGINS: list

## Observability
- Configure log drain to central collector
- Metrics: expose /metrics (Phase 2)

## Rollbacks
- Keep last two image tags; rollback via previous image and database backup/snapshot; use `manage.py migrate <app> <migration>` for targeted downgrades
