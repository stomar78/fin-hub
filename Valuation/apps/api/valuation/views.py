from rest_framework.views import APIView
import os
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from drf_spectacular.utils import extend_schema, OpenApiExample
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import SessionAuthentication, TokenAuthentication

from .serializers import (
    FreeValuationRequestSerializer,
    WaccRequestSerializer,
    DcfRequestSerializer,
    MultiplesRequestSerializer,
    BondPriceRequestSerializer,
    EuropeanOptionPriceRequestSerializer,
    PlainSwapPriceRequestSerializer,
)
from packages.epiidosis_valuation.methods import wacc as engine_wacc, npv as engine_npv, implied_from_multiple
from .reporting import generate_free_report
from .models import Company, ValuationCase, Assumption, SourceRef, InstrumentQuote
from .providers.alpha import AlphaVantageClient
from django.core.cache import cache


@extend_schema(
    tags=["calc"],
    request=WaccRequestSerializer,
    examples=[
        OpenApiExample(
            "WACC Example",
            value={
                "risk_free_rate_pct": 4.0,
                "equity_risk_premium_pct": 5.5,
                "country_risk_premium_pct": 2.0,
                "size_premium_pct": 1.0,
                "specific_premium_pct": 0.5,
                "tax_rate_pct": 25.0,
                "debt_cost_pct": 9.0,
                "debt_ratio_pct": 20.0,
            },
        )
    ],
)
class WaccView(APIView):
    def post(self, request):
        s = WaccRequestSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        d = s.validated_data
        rf = d["risk_free_rate_pct"] / 100.0
        erp = d["equity_risk_premium_pct"] / 100.0
        crp = d["country_risk_premium_pct"] / 100.0
        beta = d["beta"]
        size = d["size_premium_pct"] / 100.0
        spec = d["specific_premium_pct"] / 100.0
        tax = d["tax_rate_pct"] / 100.0
        kd = d["debt_cost_pct"] / 100.0
        debt_ratio = d["debt_ratio_pct"] / 100.0

        res = engine_wacc(rf, beta, erp, crp, size, spec, tax, kd, debt_ratio)

        return Response({
            "wacc": round(res["wacc"] * 100, 4),
            "ke": round(res["ke"] * 100, 4),
            "kd_after_tax": round(res["kd_after_tax"] * 100, 4),
            "inputs": d,
            "sources": {},
        })


@extend_schema(tags=["calc"], request=DcfRequestSerializer)
class DcfView(APIView):
    def post(self, request):
        s = DcfRequestSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        d = s.validated_data
        cashflows = d["forecast"]
        r = d["discount_rate_pct"] / 100.0
        if d["terminal_method"] == "gordon":
            g = (d.get("g_pct") or 0.0) / 100.0
            guardrail = 0.06
            if g > guardrail:
                g = guardrail
            try_use_ql = os.getenv("QL_ENABLED", "").lower() in ("1", "true", "yes")
            if try_use_ql:
                try:
                    from packages.epiidosis_valuation.methods.ql import npv_with_quantlib
                    res = npv_with_quantlib(cashflows, r, {"method": "gordon", "g": g})
                except Exception:
                    res = engine_npv(cashflows, r, {"method": "gordon", "g": g})
            else:
                res = engine_npv(cashflows, r, {"method": "gordon", "g": g})
        else:
            m = d.get("exit_multiple") or 0.0
            try_use_ql = os.getenv("QL_ENABLED", "").lower() in ("1", "true", "yes")
            if try_use_ql:
                try:
                    from packages.epiidosis_valuation.methods.ql import npv_with_quantlib
                    res = npv_with_quantlib(cashflows, r, {"method": "exit_multiple", "multiple": m})
                except Exception:
                    res = engine_npv(cashflows, r, {"method": "exit_multiple", "multiple": m})
            else:
                res = engine_npv(cashflows, r, {"method": "exit_multiple", "multiple": m})

        return Response({
            "npv": round(res["npv"], 4),
            "tv": round(res["tv"], 4),
            "sensitivity": {},
        })


@extend_schema(tags=["calc"], request=MultiplesRequestSerializer)
class MultiplesView(APIView):
    def post(self, request):
        s = MultiplesRequestSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        d = s.validated_data
        metric = d["metric"]
        value = d["value"]
        # Placeholder bands until comps integration
        bands = (2.0, 4.0, 6.0) if metric == "revenue" else (6.0, 8.0, 10.0)
        implied = implied_from_multiple(value, bands)
        return Response({
            "implied_values": implied,
            "bands": {"low": bands[0], "mid": bands[1], "high": bands[2]},
            "comps_used": [],
        })


@extend_schema(
    tags=["valuation"],
    request=FreeValuationRequestSerializer,
    examples=[
        OpenApiExample(
            "Free Valuation",
            value={
                "company_name": "Epiidosis Investments LLC",
                "sector": "Holding",
                "country": "AE",
                "currency": "AED",
                "ttm_revenue": 15000000,
                "ebitda_margin_pct": 18,
                "growth_next_year_pct": 25,
                "stage": "growth",
            },
        )
    ],
)
class FreeValuationView(APIView):
    permission_classes = [AllowAny]
    authentication_classes: list = []
    def post(self, request):
        s = FreeValuationRequestSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        d = s.validated_data
        created_by = request.headers.get("X-User", "")
        if getattr(request, "user", None) and getattr(request.user, "is_authenticated", False):
            created_by = request.user.get_username() or created_by
        revenue = d["ttm_revenue"]
        margin = d["ebitda_margin_pct"] / 100.0
        growth = d["growth_next_year_pct"] / 100.0
        ebitda = revenue * margin
        # Use engine multiples heuristic and a simple DCF proxy
        m_bands = (4.0, 5.0, 6.0)
        mult_vals = implied_from_multiple(max(revenue, ebitda or 0.0), m_bands)
        # Base discount rate proxy (wacc) by stage: growth higher vs mature lower
        stage = d["stage"]
        base_wacc = 0.14 if stage in ("seed", "early", "growth") else 0.10
        g_cap = min(growth, 0.04)
        dcf_res = engine_npv(
            [revenue * margin, revenue * margin * (1 + growth)],
            base_wacc,
            {"method": "gordon", "g": g_cap},
        )
        multiples_value = mult_vals["mid"]
        dcf_value = dcf_res["npv"]

        # Heuristic method weights
        # Higher weight to DCF when positive margin and stage != seed
        if margin <= 0 or stage in ("seed",):
            weights = {"dcf": 0.3, "multiples": 0.7}
        elif margin < 0.1:
            weights = {"dcf": 0.45, "multiples": 0.55}
        else:
            weights = {"dcf": 0.6, "multiples": 0.4}

        blended = weights["dcf"] * dcf_value + weights["multiples"] * multiples_value
        low = min(multiples_value, dcf_value, blended) * 0.9
        high = max(multiples_value, dcf_value, blended) * 1.1
        mid = blended

        # Sensitivity grid over WACC and g
        wacc_points = [round(x / 100.0, 4) for x in (9, 10, 11, 12, 13)]
        g_points = [round(x / 100.0, 4) for x in (2, 3, 4)]
        grid = []
        base_cf = revenue * margin
        for w in wacc_points:
            row = []
            for g in g_points:
                g_eff = min(g, 0.06)
                res = engine_npv([base_cf, base_cf * (1 + growth)], w, {"method": "gordon", "g": g_eff})
                row.append(round(res["npv"], 2))
            grid.append(row)
        payload = {
            "case_id": None,
            "value_low": round(low, 2),
            "value_mid": round(mid, 2),
            "value_high": round(high, 2),
            "method_weights": {"dcf": round(weights["dcf"], 2), "multiples": round(weights["multiples"], 2)},
            "sensitivity": {"wacc": [int(w*100) for w in wacc_points], "g": [int(g*100) for g in g_points], "grid": grid},
        }
        pdf_url = generate_free_report({
            **d,
            **payload,
        })
        payload["pdf_url"] = pdf_url

        # Persist a free ValuationCase with conclusions
        try:
            company, _ = Company.objects.get_or_create(
                legal_name=d.get("company_name", "N/A") or "N/A",
                defaults={
                    "sector": d.get("sector", ""),
                    "country": d.get("country", "")[0:2],
                    "currency": d.get("currency", "")[0:3],
                },
            )
            # If company existed, update optional fields non-destructively when empty
            if not company.sector and d.get("sector"):
                company.sector = d["sector"]
            if not company.country and d.get("country"):
                company.country = d["country"][0:2]
            if not company.currency and d.get("currency"):
                company.currency = d["currency"][0:3]
            company.save()

            case = ValuationCase.objects.create(
                company=company,
                tier="free",
                status="new",
                conclusion_value_low=payload["value_low"],
                conclusion_value_mid=payload["value_mid"],
                conclusion_value_high=payload["value_high"],
                created_by=created_by,
            )
            # Store assumptions snapshot
            for k, v in d.items():
                try:
                    Assumption.objects.create(
                        case=case,
                        key=str(k),
                        value=str(v),
                        source="manual",
                        note="free_submission",
                        created_by=created_by,
                    )
                except Exception:
                    pass
            # Link report as a SourceRef
            try:
                if pdf_url:
                    SourceRef.objects.create(case=case, type="file", locator=str(pdf_url))
            except Exception:
                pass

            payload["case_id"] = case.id
        except Exception:
            # Do not fail the API if persistence has issues
            payload["case_id"] = None
        return Response(payload, status=status.HTTP_200_OK)


@extend_schema(tags=["cases"])
class CaseDetailView(APIView):
    permission_classes = [AllowAny]
    authentication_classes: list = []
    def get(self, request, case_id: int):
        is_authed = getattr(request, "user", None) and request.user.is_authenticated
        if is_authed:
            username = request.user.get_username()
            qs = ValuationCase.objects.select_related("company").filter(created_by=username)
        else:
            # Public demo access: allow any case by id
            qs = ValuationCase.objects.select_related("company")
        case = get_object_or_404(qs, id=case_id)
        return Response({
            "id": case.id,
            "tier": case.tier,
            "status": case.status,
            "created_by": case.created_by,
            "company": {
                "id": case.company.id,
                "legal_name": case.company.legal_name,
                "sector": case.company.sector,
                "country": case.company.country,
                "currency": case.company.currency,
            },
            "conclusion": {
                "low": float(case.conclusion_value_low) if case.conclusion_value_low is not None else None,
                "mid": float(case.conclusion_value_mid) if case.conclusion_value_mid is not None else None,
                "high": float(case.conclusion_value_high) if case.conclusion_value_high is not None else None,
            },
            "created_at": case.created_at,
        }, status=status.HTTP_200_OK)


@extend_schema(tags=["cases"])
class CasesListView(APIView):
    permission_classes = [AllowAny]
    authentication_classes: list = []
    def get(self, request):
        is_authed = getattr(request, "user", None) and request.user.is_authenticated
        if is_authed:
            username = request.user.get_username()
            qs = ValuationCase.objects.select_related("company").filter(created_by=username).order_by("-id")[:50]
        else:
            # Public demo: show recent cases across users (limited fields)
            qs = ValuationCase.objects.select_related("company").order_by("-id")[:20]
        items = []
        for c in qs:
            items.append({
                "id": c.id,
                "tier": c.tier,
                "status": c.status,
                "company": c.company.legal_name,
                "conclusion_mid": float(c.conclusion_value_mid) if c.conclusion_value_mid is not None else None,
                "created_at": c.created_at,
            })
        return Response({"results": items}, status=status.HTTP_200_OK)


@extend_schema(
    tags=["data"],
    parameters=[],
    examples=[
        OpenApiExample(
            "Alpha Global Quote",
            value={"symbol": "MSFT"},
            request_only=True,
        )
    ],
)
class AlphaGlobalQuoteView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        symbol = request.query_params.get("symbol")
        if not symbol:
            return Response({"detail": "symbol is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            cache_key = f"alpha:global:{symbol.upper()}"
            cached = cache.get(cache_key)
            if cached:
                return Response(cached)
            data = AlphaVantageClient().global_quote(symbol)
            quote = data.get("Global Quote") or {}
            payload = {
                "symbol": quote.get("01. symbol", symbol),
                "price": float(quote.get("05. price")) if quote.get("05. price") else None,
                "change": float(quote.get("09. change")) if quote.get("09. change") else None,
                "change_percent": quote.get("10. change percent"),
                "raw": data,
            }
            # Cache for 60 seconds to be friendly with rate limits
            cache.set(cache_key, payload, timeout=60)
            return Response(payload)
        except Exception as e:
            # If rate limited and we have stale cache, serve it
            cache_key = f"alpha:global:{(symbol or '').upper()}"
            cached = cache.get(cache_key)
            if cached:
                cached_with_warning = {**cached, "warning": f"provider_error: {str(e)} (served cached)"}
                return Response(cached_with_warning, status=status.HTTP_200_OK)
            return Response({"error": str(e)}, status=status.HTTP_502_BAD_GATEWAY)


@extend_schema(
    tags=["instruments"],
    request=BondPriceRequestSerializer,
    examples=[
        OpenApiExample(
            "Bullet Bond",
            value={
                "face": 1000,
                "coupon_rate_pct": 5.0,
                "years_to_maturity": 5,
                "yield_rate_pct": 4.2,
                "frequency": "Semiannual",
            },
        )
    ],
)
class BondPriceView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        s = BondPriceRequestSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        d = s.validated_data
        try:
            from packages.epiidosis_valuation.methods.ql import price_bullet_bond
            res = price_bullet_bond(
                face=d["face"],
                coupon_rate=d["coupon_rate_pct"] / 100.0,
                years_to_maturity=d["years_to_maturity"],
                yield_rate=d["yield_rate_pct"] / 100.0,
                frequency=d.get("frequency") or "Annual",
                discount_curve=d.get("discount_curve"),
            )
            # Convert floats cleanly
            payload = {
                "clean_price": round(res["clean_price"], 6),
                "dirty_price": round(res["dirty_price"], 6),
                "accrued": round(res["accrued"], 6),
                "yield": res["yield"],
                "inputs": d,
            }
            # Persist audit log (best-effort)
            try:
                InstrumentQuote.objects.create(
                    instrument="bond",
                    request_json=d,
                    response_json=payload,
                    status_code=200,
                    user=request.user if getattr(request, "user", None) and request.user.is_authenticated else None,
                    x_user=request.headers.get("X-User", ""),
                )
            except Exception:
                pass
            return Response(payload)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    tags=["instruments"],
    request=PlainSwapPriceRequestSerializer,
    examples=[
        OpenApiExample(
            "Plain Vanilla Swap",
            value={
                "notional": 1000000,
                "fixed_rate_pct": 3.0,
                "float_rate_pct": 2.5,
                "years": 5,
                "pay_fixed": True,
                "fixed_frequency": "Annual",
            },
        )
    ],
)
class PlainSwapPriceView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        s = PlainSwapPriceRequestSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        d = s.validated_data
        try:
            from packages.epiidosis_valuation.methods.ql import price_plain_vanilla_swap
            res = price_plain_vanilla_swap(
                notional=d["notional"],
                fixed_rate=d["fixed_rate_pct"] / 100.0,
                float_rate=d["float_rate_pct"] / 100.0,
                years=d["years"],
                pay_fixed=d.get("pay_fixed", True),
                fixed_frequency=d.get("fixed_frequency") or "Annual",
                discount_rate=(d.get("discount_rate_pct") / 100.0) if d.get("discount_rate_pct") is not None else None,
                discount_curve=d.get("discount_curve"),
                projection_curve=d.get("projection_curve"),
            )
            res["npv"] = round(res["npv"], 6)
            res["fair_rate"] = round(res["fair_rate"], 6)
            res["fixed_leg_bps"] = round(res.get("fixed_leg_bps", 0.0), 6)
            res["floating_leg_bps"] = round(res.get("floating_leg_bps", 0.0), 6)
            # Persist audit log (best-effort)
            try:
                InstrumentQuote.objects.create(
                    instrument="swap",
                    request_json=d,
                    response_json=res,
                    status_code=200,
                    user=request.user if getattr(request, "user", None) and request.user.is_authenticated else None,
                    x_user=request.headers.get("X-User", ""),
                )
            except Exception:
                pass
            return Response(res)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    tags=["instruments"],
    request=EuropeanOptionPriceRequestSerializer,
    examples=[
        OpenApiExample(
            "European Option (BS)",
            value={
                "spot": 100,
                "strike": 105,
                "r_pct": 3.0,
                "vol_pct": 20.0,
                "maturity_years": 1.0,
                "option_type": "call",
            },
        )
    ],
)
class EuropeanOptionPriceView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        s = EuropeanOptionPriceRequestSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        d = s.validated_data
        try:
            from packages.epiidosis_valuation.methods.ql import price_european_option_bs
            res = price_european_option_bs(
                spot=d["spot"],
                strike=d["strike"],
                r=d["r_pct"] / 100.0,
                vol=d["vol_pct"] / 100.0,
                maturity_years=d["maturity_years"],
                option_type=d.get("option_type") or "call",
                q=(d.get("q_pct") or 0.0) / 100.0,
            )
            res["npv"] = round(res["npv"], 6)
            if res.get("greeks"):
                g = res["greeks"]
                for k in list(g.keys()):
                    try:
                        g[k] = float(g[k])
                    except Exception:
                        pass
            # Persist audit log (best-effort)
            try:
                InstrumentQuote.objects.create(
                    instrument="option",
                    request_json=d,
                    response_json=res,
                    status_code=200,
                    user=request.user if getattr(request, "user", None) and request.user.is_authenticated else None,
                    x_user=request.headers.get("X-User", ""),
                )
            except Exception:
                pass
            return Response(res)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class InstrumentQuoteListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        instrument = request.query_params.get("instrument")
        qs = InstrumentQuote.objects.all().order_by("-created_at")
        if instrument:
            qs = qs.filter(instrument=instrument)
        # Visibility: if authenticated, show own; else allow X-User header filtering; otherwise block
        if getattr(request, "user", None) and request.user.is_authenticated:
            qs = qs.filter(user=request.user)
        else:
            x_user = request.headers.get("X-User")
            if x_user:
                qs = qs.filter(x_user=x_user)
            else:
                return Response({"detail": "authentication or X-User required"}, status=status.HTTP_401_UNAUTHORIZED)
        # Simple serialization
        data = [
            {
                "id": it.id,
                "instrument": it.instrument,
                "status_code": it.status_code,
                "request": it.request_json,
                "response": it.response_json,
                "x_user": it.x_user,
                "created_at": it.created_at.isoformat(),
            }
            for it in qs[:100]
        ]
        return Response({"results": data})
