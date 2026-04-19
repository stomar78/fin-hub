import os
import json
import pytest


def test_dcf_endpoint_with_flag(client, settings, monkeypatch):
    # Enable QuantLib path; if QuantLib is missing, API should safely fall back
    monkeypatch.setenv("QL_ENABLED", "true")
    payload = {
        "forecast": [100000, 110000, 120000],
        "discount_rate_pct": 10.0,
        "terminal_method": "gordon",
        "g_pct": 2.0,
    }
    resp = client.post(
        "/api/calc/dcf",
        data=json.dumps(payload),
        content_type="application/json",
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "npv" in data and "tv" in data


@pytest.mark.skipif(
    __import__("importlib").util.find_spec("QuantLib") is None,
    reason="QuantLib not installed in this environment",
)
def test_quantlib_function_direct():
    from packages.epiidosis_valuation.methods.ql import npv_with_quantlib

    res = npv_with_quantlib([100000, 110000, 120000], 0.10, {"method": "gordon", "g": 0.02})
    assert isinstance(res["npv"], float)
    assert isinstance(res["tv"], float)
