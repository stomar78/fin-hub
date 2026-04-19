from django.urls import path
from .views import WaccView, DcfView, MultiplesView, FreeValuationView, CaseDetailView, CasesListView, AlphaGlobalQuoteView, BondPriceView, EuropeanOptionPriceView, PlainSwapPriceView, InstrumentQuoteListView

urlpatterns = [
    path("calc/wacc", WaccView.as_view()),
    path("calc/dcf", DcfView.as_view()),
    path("calc/multiples", MultiplesView.as_view()),
    path("valuation/free", FreeValuationView.as_view()),
    path("valuation/cases/<int:case_id>", CaseDetailView.as_view()),
    path("valuation/cases", CasesListView.as_view()),
    path("data/alpha/global-quote", AlphaGlobalQuoteView.as_view()),
    path("instruments/bond/price", BondPriceView.as_view()),
    path("instruments/option/european/price", EuropeanOptionPriceView.as_view()),
    path("instruments/swap/plain/price", PlainSwapPriceView.as_view()),
    path("instruments/quotes", InstrumentQuoteListView.as_view()),
]
