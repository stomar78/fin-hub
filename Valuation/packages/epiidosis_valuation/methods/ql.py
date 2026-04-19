def npv_with_quantlib(cashflows: list[float], r: float, terminal: dict | None = None) -> dict:
    try:
        import QuantLib as ql
    except Exception as e:
        raise ImportError(f"QuantLib not available: {e}")

    # Build simple flat discount curve at rate r (annual compounding)
    today = ql.Date.todaysDate()
    day_count = ql.Actual365Fixed()
    calendar = ql.NullCalendar()
    ql.Settings.instance().evaluationDate = today

    zero_rate = ql.InterestRate(r, day_count, ql.Compounded, ql.Annual)
    curve = ql.FlatForward(today, zero_rate, day_count)
    discount_curve = ql.YieldTermStructureHandle(curve)

    # Discount factors for each period (assume annual periods)
    v = 0.0
    for i, cf in enumerate(cashflows, start=1):
        t_date = calendar.advance(today, ql.Period(i, ql.Years))
        df = discount_curve.discount(t_date)
        v += cf * df

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
        # Discount terminal value at end of horizon
        t_date = calendar.advance(today, ql.Period(len(cashflows), ql.Years))
        df_tv = discount_curve.discount(t_date)
        v += tv * df_tv

    return {"npv": v, "tv": tv}


def price_bullet_bond(
    face: float,
    coupon_rate: float,
    years_to_maturity: int,
    yield_rate: float,
    frequency: str = "Annual",
    discount_curve: list[dict] | None = None,
) -> dict:
    try:
        import QuantLib as ql
    except Exception as e:
        raise ImportError(f"QuantLib not available: {e}")

    today = ql.Date.todaysDate()
    ql.Settings.instance().evaluationDate = today
    # Allow forecasting for today's fixing; we'll also backfill recent fixings below.
    try:
        ql.Settings.instance().enforceTodaysHistoricFixings = False
    except Exception:
        pass
    calendar = ql.NullCalendar()
    day_count = ql.Actual365Fixed()

    freq_map = {
        "Annual": ql.Annual,
        "Semiannual": ql.Semiannual,
        "Quarterly": ql.Quarterly,
        "Monthly": ql.Monthly,
    }
    ql_freq = freq_map.get(frequency, ql.Annual)

    schedule = ql.Schedule(
        today,
        calendar.advance(today, ql.Period(years_to_maturity, ql.Years)),
        ql.Period(ql_freq),
        calendar,
        ql.Unadjusted,
        ql.Unadjusted,
        ql.DateGeneration.Forward,
        False,
    )

    coupons = [coupon_rate]
    # settlementDays typically 2; use Following convention
    bond = ql.FixedRateBond(
        2,               # settlement days
        face,            # face amount
        schedule,        # schedule
        coupons,         # coupon rates
        day_count,       # day count
        ql.Following,    # payment convention
        100.0,           # redemption
        today,           # issue date
    )

    # Build discount curve: use provider-informed term structure if provided, else flat from yield_rate
    if discount_curve:
        dates = [today]
        rates = [yield_rate]
        for pt in discount_curve:
            t = float(pt.get("tenor_years") or pt.get("tenor") or 0.0)
            r = float(pt.get("rate") or (pt.get("rate_pct", 0.0) / 100.0))
            months = max(1, int(round(t * 12)))
            dates.append(calendar.advance(today, ql.Period(months, ql.Months)))
            rates.append(r)
        zc = ql.ZeroCurve(dates, rates, day_count, calendar)
        disc_handle = ql.YieldTermStructureHandle(zc)
    else:
        # Use FlatForward(Date, Rate, DayCounter, Compounding, Frequency) overload
        disc_handle = ql.YieldTermStructureHandle(
            ql.FlatForward(today, yield_rate, day_count, ql.Compounded, ql.Annual)
        )
    engine = ql.DiscountingBondEngine(disc_handle)
    bond.setPricingEngine(engine)

    clean_price = bond.cleanPrice()
    dirty_price = bond.dirtyPrice()
    accrued = bond.accruedAmount()
    yield_calc = bond.bondYield(day_count, ql.Compounded, ql_freq)

    return {
        "clean_price": clean_price,
        "dirty_price": dirty_price,
        "accrued": accrued,
        "yield": yield_calc,
        "face": face,
        "coupon_rate": coupon_rate,
        "years_to_maturity": years_to_maturity,
        "frequency": frequency,
    }


def price_european_option_bs(spot: float, strike: float, r: float, vol: float, maturity_years: float, option_type: str = "call", q: float = 0.0) -> dict:
    try:
        import QuantLib as ql
    except Exception as e:
        raise ImportError(f"QuantLib not available: {e}")

    today = ql.Date.todaysDate()
    ql.Settings.instance().evaluationDate = today

    maturity = today + int(maturity_years * 365)
    payoff = ql.PlainVanillaPayoff(ql.Option.Call if option_type.lower() == "call" else ql.Option.Put, strike)
    exercise = ql.EuropeanExercise(maturity)
    option = ql.VanillaOption(payoff, exercise)

    spot_handle = ql.QuoteHandle(ql.SimpleQuote(spot))
    r_ts = ql.YieldTermStructureHandle(ql.FlatForward(today, r, ql.Actual365Fixed()))
    q_ts = ql.YieldTermStructureHandle(ql.FlatForward(today, q, ql.Actual365Fixed()))
    vol_ts = ql.BlackVolTermStructureHandle(ql.BlackConstantVol(today, ql.NullCalendar(), vol, ql.Actual365Fixed()))

    process = ql.BlackScholesMertonProcess(spot_handle, q_ts, r_ts, vol_ts)
    engine = ql.AnalyticEuropeanEngine(process)
    option.setPricingEngine(engine)

    npv = option.NPV()
    delta = option.delta()
    gamma = option.gamma()
    vega = option.vega()
    theta = option.theta()
    rho = option.rho()

    return {
        "npv": npv,
        "greeks": {
            "delta": delta,
            "gamma": gamma,
            "vega": vega,
            "theta": theta,
            "rho": rho,
        },
        "inputs": {
            "spot": spot,
            "strike": strike,
            "r": r,
            "vol": vol,
            "q": q,
            "maturity_years": maturity_years,
            "type": option_type,
        },
    }


def price_plain_vanilla_swap(
    notional: float,
    fixed_rate: float,
    float_rate: float,
    years: int,
    pay_fixed: bool = True,
    fixed_frequency: str = "Annual",
    discount_rate: float | None = None,
    discount_curve: list[dict] | None = None,
    projection_curve: list[dict] | None = None,
) -> dict:
    try:
        import QuantLib as ql
    except Exception as e:
        raise ImportError(f"QuantLib not available: {e}")

    today = ql.Date.todaysDate()
    ql.Settings.instance().evaluationDate = today
    calendar = ql.NullCalendar()
    day_count = ql.Actual365Fixed()

    freq_map = {
        "Annual": ql.Annual,
        "Semiannual": ql.Semiannual,
        "Quarterly": ql.Quarterly,
        "Monthly": ql.Monthly,
    }
    ql_fixed_freq = freq_map.get(fixed_frequency, ql.Annual)

    maturity = calendar.advance(today, ql.Period(years, ql.Years))
    fixed_schedule = ql.Schedule(
        today,
        maturity,
        ql.Period(ql_fixed_freq),
        calendar,
        ql.Following,
        ql.Following,
        ql.DateGeneration.Forward,
        False,
    )
    float_schedule = ql.Schedule(
        today,
        maturity,
        ql.Period(ql.Semiannual),
        calendar,
        ql.Following,
        ql.Following,
        ql.DateGeneration.Forward,
        False,
    )

    disc = discount_rate if discount_rate is not None else float_rate
    # Build discount curve handle
    if discount_curve:
        d_dates = [today]
        d_rates = [disc]
        for pt in discount_curve:
            t = float(pt.get("tenor_years") or pt.get("tenor") or 0.0)
            r = float(pt.get("rate") or (pt.get("rate_pct", 0.0) / 100.0))
            months = max(1, int(round(t * 12)))
            d_dates.append(calendar.advance(today, ql.Period(months, ql.Months)))
            d_rates.append(r)
        disc_curve = ql.YieldTermStructureHandle(ql.ZeroCurve(d_dates, d_rates, day_count, calendar))
    else:
        disc_curve = ql.YieldTermStructureHandle(ql.FlatForward(today, disc, day_count))

    # Build projection curve handle for floating index
    if projection_curve:
        p_dates = [today]
        p_rates = [float_rate]
        for pt in projection_curve:
            t = float(pt.get("tenor_years") or pt.get("tenor") or 0.0)
            r = float(pt.get("rate") or (pt.get("rate_pct", 0.0) / 100.0))
            months = max(1, int(round(t * 12)))
            p_dates.append(calendar.advance(today, ql.Period(months, ql.Months)))
            p_rates.append(r)
        proj_curve = ql.YieldTermStructureHandle(ql.ZeroCurve(p_dates, p_rates, day_count, calendar))
    else:
        proj_curve = ql.YieldTermStructureHandle(ql.FlatForward(today, float_rate, day_count))

    index = ql.USDLibor(ql.Period(6, ql.Months), proj_curve)
    # Seed fixings exactly on fixing dates for the floating leg
    try:
        for d in float_schedule:
            fx_date = index.fixingDate(d)
            if fx_date <= today:
                index.addFixing(fx_date, float_rate, True)
        # Also seed a short recent window just in case
        for i in range(0, 10):
            d2 = today - i
            index.addFixing(d2, float_rate, True)
    except Exception:
        pass

    type_ = ql.VanillaSwap.Payer if pay_fixed else ql.VanillaSwap.Receiver
    swap = ql.VanillaSwap(
        type_,
        notional,
        fixed_schedule,
        fixed_rate,
        day_count,
        float_schedule,
        index,
        0.0,
        day_count,
    )

    engine = ql.DiscountingSwapEngine(disc_curve)
    swap.setPricingEngine(engine)

    return {
        "npv": swap.NPV(),
        "fair_rate": swap.fairRate(),
        "fixed_leg_bps": swap.fixedLegBPS(),
        "floating_leg_bps": swap.floatingLegBPS(),
        "inputs": {
            "notional": notional,
            "fixed_rate": fixed_rate,
            "float_rate": float_rate,
            "years": years,
            "pay_fixed": pay_fixed,
            "fixed_frequency": fixed_frequency,
            "discount_rate": disc,
        },
    }
