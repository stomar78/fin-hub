def npv(cashflows: list[float], r: float, terminal: dict | None = None) -> dict:
    tv = 0.0
    if terminal:
        if terminal.get("method") == "gordon":
            g = terminal.get("g", 0.0)
            if r <= g:
                raise ValueError("Discount rate must exceed growth rate")
            last = cashflows[-1]
            tv = last * (1 + g) / (r - g)
        elif terminal.get("method") == "exit_multiple":
            m = terminal.get("multiple", 0.0)
            tv = cashflows[-1] * m
    v = 0.0
    for i, cf in enumerate(cashflows, start=1):
        v += cf / ((1 + r) ** i)
    v += tv / ((1 + r) ** len(cashflows))
    return {"npv": v, "tv": tv}
