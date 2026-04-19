import os
import requests
from typing import Any, Dict

API_URL = "https://www.alphavantage.co/query"

class AlphaVantageClient:
    def __init__(self, api_key: str | None = None, timeout: int = 10):
        self.api_key = api_key or os.getenv("ALPHA_VANTAGE_API_KEY", "")
        self.timeout = timeout

    def _get(self, params: Dict[str, Any]) -> Dict[str, Any]:
        if not self.api_key:
            raise RuntimeError("Alpha Vantage API key missing (set ALPHA_VANTAGE_API_KEY)")
        merged = {**params, "apikey": self.api_key}
        r = requests.get(API_URL, params=merged, timeout=self.timeout)
        r.raise_for_status()
        data = r.json()
        # Alpha Vantage returns error messages in JSON sometimes with 200 status
        if "Error Message" in data or "Note" in data:
            raise RuntimeError(data.get("Error Message") or data.get("Note"))
        return data

    def global_quote(self, symbol: str) -> Dict[str, Any]:
        return self._get({"function": "GLOBAL_QUOTE", "symbol": symbol})
