# Templates

## Assumptions Register (per case)
- key: string (e.g., `revenue_growth_y1`)
- value: number|string
- units: %, currency, multiple, text
- rationale: text
- source: api/manual/file
- source_locator: URL or file id
- effective_date: ISO date
- owner: analyst email
- version: integer

## Source Reference
- type: api/manual/file
- provider: AlphaVantage/FMP/Finnhub/Damodaran/Manual
- locator: URL, endpoint, or file path
- retrieved_at: timestamp
- hash: sha256 (files) or signature (payload)
- notes: text

## Method Weights (Free Tier)
- method: dcf|multiples
- weight: 0..1
- rationale: short text

## Report Disclaimers (Free)
- Indicative only, not investment advice
- Based on provided/available data as-of date
