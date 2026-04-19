def wacc(rf: float, beta: float, erp: float, crp: float, size: float, spec: float, tax: float, kd: float, debt_ratio: float) -> dict:
    ke = rf + beta * erp + crp + size + spec
    kd_after_tax = kd * (1 - tax)
    w = ke * (1 - debt_ratio) + kd_after_tax * debt_ratio
    return {"wacc": w, "ke": ke, "kd_after_tax": kd_after_tax}
