def implied_from_multiple(metric_value: float, bands: tuple[float, float, float]) -> dict:
    low, mid, high = bands
    return {"low": metric_value * low, "mid": metric_value * mid, "high": metric_value * high}
