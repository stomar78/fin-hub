import json
from django.test import Client

def test_free_endpoint_smoke(db):
    c = Client()
    payload = {
        "company_name": "Test Co",
        "sector": "Software",
        "country": "IN",
        "currency": "INR",
        "ttm_revenue": 1_500_000,
        "ebitda_margin_pct": 20,
        "growth_next_year_pct": 15,
        "stage": "growth",
    }
    resp = c.post("/api/valuation/free", data=json.dumps(payload), content_type="application/json")
    assert resp.status_code == 200
    data = resp.json()
    assert {"value_low", "value_mid", "value_high", "method_weights", "pdf_url"}.issubset(data.keys())
