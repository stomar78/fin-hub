from rest_framework import serializers


class FreeValuationRequestSerializer(serializers.Serializer):
    company_name = serializers.CharField(max_length=255)
    sector = serializers.CharField(max_length=120)
    country = serializers.CharField(max_length=2)
    currency = serializers.CharField(max_length=3)
    ttm_revenue = serializers.FloatField(min_value=0)
    ebitda_margin_pct = serializers.FloatField(min_value=-100, max_value=100)
    growth_next_year_pct = serializers.FloatField(min_value=-100, max_value=200)
    stage = serializers.ChoiceField(choices=["seed", "early", "growth", "mature"])


class WaccRequestSerializer(serializers.Serializer):
    risk_free_rate_pct = serializers.FloatField(min_value=0, max_value=50)
    beta = serializers.FloatField(min_value=0, max_value=5)
    equity_risk_premium_pct = serializers.FloatField(min_value=0, max_value=25)
    country_risk_premium_pct = serializers.FloatField(min_value=0, max_value=25)
    size_premium_pct = serializers.FloatField(min_value=0, max_value=20)
    specific_premium_pct = serializers.FloatField(min_value=0, max_value=20)
    tax_rate_pct = serializers.FloatField(min_value=0, max_value=60)
    debt_cost_pct = serializers.FloatField(min_value=0, max_value=50)
    debt_ratio_pct = serializers.FloatField(min_value=0, max_value=100)


class DcfRequestSerializer(serializers.Serializer):
    forecast = serializers.ListField(child=serializers.FloatField(), min_length=1, max_length=20)
    discount_rate_pct = serializers.FloatField(min_value=0, max_value=100)
    terminal_method = serializers.ChoiceField(choices=["gordon", "exit_multiple"])
    g_pct = serializers.FloatField(required=False, min_value=-10, max_value=10)
    exit_multiple = serializers.FloatField(required=False, min_value=0, max_value=100)
    midyear = serializers.BooleanField(default=True)
    valuation_date = serializers.DateField(required=False)


class MultiplesRequestSerializer(serializers.Serializer):
    metric = serializers.ChoiceField(choices=["revenue", "ebitda"])
    value = serializers.FloatField(min_value=-1e12, max_value=1e12)
    sector = serializers.CharField(max_length=120)
    comps = serializers.ListField(child=serializers.FloatField(), required=False)
    overrides = serializers.DictField(child=serializers.FloatField(), required=False)


class BondPriceRequestSerializer(serializers.Serializer):
    face = serializers.FloatField(min_value=0.0)
    coupon_rate_pct = serializers.FloatField(min_value=0.0, max_value=100.0)
    years_to_maturity = serializers.IntegerField(min_value=1, max_value=100)
    yield_rate_pct = serializers.FloatField(min_value=0.0, max_value=100.0)
    frequency = serializers.ChoiceField(choices=["Annual", "Semiannual", "Quarterly", "Monthly"], default="Annual")
    # Optional provider-informed discount curve: [{tenor_years: float, rate_pct: float}]
    discount_curve = serializers.ListField(
        child=serializers.DictField(child=serializers.FloatField()), required=False
    )


class EuropeanOptionPriceRequestSerializer(serializers.Serializer):
    spot = serializers.FloatField(min_value=0.0)
    strike = serializers.FloatField(min_value=0.0)
    r_pct = serializers.FloatField(min_value=0.0, max_value=100.0)
    vol_pct = serializers.FloatField(min_value=0.0, max_value=100.0)
    maturity_years = serializers.FloatField(min_value=0.0, max_value=100.0)
    option_type = serializers.ChoiceField(choices=["call", "put"], default="call")
    q_pct = serializers.FloatField(required=False, min_value=0.0, max_value=100.0)


class PlainSwapPriceRequestSerializer(serializers.Serializer):
    notional = serializers.FloatField(min_value=0.0)
    fixed_rate_pct = serializers.FloatField(min_value=0.0, max_value=100.0)
    float_rate_pct = serializers.FloatField(min_value=0.0, max_value=100.0)
    years = serializers.IntegerField(min_value=1, max_value=50)
    pay_fixed = serializers.BooleanField(default=True)
    fixed_frequency = serializers.ChoiceField(choices=["Annual", "Semiannual", "Quarterly", "Monthly"], default="Annual")
    discount_rate_pct = serializers.FloatField(required=False, min_value=0.0, max_value=100.0)
    # Optional provider-informed curves: arrays of points {tenor_years, rate_pct}
    discount_curve = serializers.ListField(
        child=serializers.DictField(child=serializers.FloatField()), required=False
    )
    projection_curve = serializers.ListField(
        child=serializers.DictField(child=serializers.FloatField()), required=False
    )
