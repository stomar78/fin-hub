# Privacy Data Map

## Data Categories
- Business data: company name, sector, country (non-PII)
- Contact data (Phase 2): analyst/client names/emails (PII)
- Valuation data: assumptions, results (non-PII)
- API keys: secrets (confidential)

## Locations
- Postgres: cases, assumptions, results, references
- Object store: PDFs, attachments (Phase 2)
- Redis: cached market/reference data

## Retention
- Cases: 3 years (configurable)
- Logs: 90 days (configurable)
- PII: minimal, deletion on request; separate table with encryption

## Transfers
- Data APIs: Alpha Vantage/FMP/Finnhub (no PII shared)

## Rights Handling
- Access/correction/erasure procedures (Phase 2)
