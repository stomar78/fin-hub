# Sample API Payloads

## POST /valuation/free (request)
```json
{
  "company_name": "Alpha Beta Pvt Ltd",
  "sector": "Software",
  "country": "IN",
  "currency": "INR",
  "ttm_revenue": 15000000,
  "ebitda_margin_pct": 18,
  "growth_next_year_pct": 25,
  "stage": "growth"
}
```

## POST /valuation/free (response)
```json
{
  "case_id": "f7f9a9bc-7e6e-4c9f-8e43-d1a0e6b2d4a1",
  "value_low": 9_500_000,
  "value_mid": 11_200_000,
  "value_high": 13_400_000,
  "method_weights": {"dcf": 0.6, "multiples": 0.4},
  "sensitivity": {"wacc": [9,10,11], "g": [2,3,4], "grid": [[...]]},
  "pdf_url": "/reports/f7f9.../free.pdf"
}
```

## POST /calc/wacc (request)
```json
{
  "risk_free_rate_pct": 7.2,
  "beta": 1.1,
  "equity_risk_premium_pct": 5.5,
  "country_risk_premium_pct": 2.0,
  "size_premium_pct": 1.0,
  "specific_premium_pct": 0.5,
  "tax_rate_pct": 25,
  "debt_cost_pct": 9.0,
  "debt_ratio_pct": 20
}
```
