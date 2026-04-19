import json
import time
import urllib.request

BASE = "http://localhost:8000/api"

def post(path, payload):
    data = json.dumps(payload).encode()
    req = urllib.request.Request(f"{BASE}{path}", data=data, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        return resp.status, resp.read().decode()

if __name__ == "__main__":
    # Give server a moment if just started
    for i in range(3):
        try:
            code, body = post("/calc/wacc", {
                "risk_free_rate_pct": 7.2,
                "beta": 1.1,
                "equity_risk_premium_pct": 5.5,
                "country_risk_premium_pct": 2.0,
                "size_premium_pct": 1.0,
                "specific_premium_pct": 0.5,
                "tax_rate_pct": 25,
                "debt_cost_pct": 9.0,
                "debt_ratio_pct": 20
            })
            print("WACC:", code, body)
            break
        except Exception as e:
            if i == 2:
                raise
            time.sleep(1)

    code, body = post("/calc/dcf", {
        "forecast": [1500000, 1600000, 1700000],
        "discount_rate_pct": 12.0,
        "terminal_method": "gordon",
        "g_pct": 3.0,
        "midyear": True
    })
    print("DCF:", code, body)

    code, body = post("/calc/multiples", {
        "metric": "revenue",
        "value": 15000000,
        "sector": "Software"
    })
    print("Multiples:", code, body)

    code, body = post("/valuation/free", {
        "company_name": "Alpha Beta Pvt Ltd",
        "sector": "Software",
        "country": "IN",
        "currency": "INR",
        "ttm_revenue": 15000000,
        "ebitda_margin_pct": 18,
        "growth_next_year_pct": 25,
        "stage": "growth"
    })
    print("Free:", code, body)
