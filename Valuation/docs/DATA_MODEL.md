# Data Model (PostgreSQL)

## Core Tables
- company(id, legal_name, sector, country, currency, created_at, updated_at)
- valuation_case(id, company_id, tier, status, valuation_date, purpose, standard, conclusion_value_low, conclusion_value_mid, conclusion_value_high, created_by, created_at)
- assumption(id, case_id, key, value, source, note, version, created_by, created_at)
- result(id, case_id, method, metric, value, scenario, run_id, created_at)
- source_ref(id, case_id, type, locator, hash, retrieved_at)
- audit_log(id, case_id, actor, action, before_json, after_json, at)

## Reference Tables
- country_risk(year, country, erp, default_spread, note, source_url)
- sector_multiples(sector, metric, low, mid, high, source, updated_at)

## Indexing & Constraints
- FKs on case_id, company_id
- Unique (year, country) on country_risk
- Created_at indexed for recent activity

## Migrations
- Django migrations; seed scripts/management commands for reference tables.
