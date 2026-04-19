from django.contrib import admin
from .models import Company, ValuationCase, Assumption, Result, SourceRef, AuditLog, CountryRisk, InstrumentQuote

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ("id", "legal_name", "sector", "country", "currency", "created_at")
    search_fields = ("legal_name", "sector")

@admin.register(ValuationCase)
class ValuationCaseAdmin(admin.ModelAdmin):
    list_display = ("id", "company", "tier", "status", "conclusion_value_mid", "created_at")
    list_filter = ("tier", "status")
    search_fields = ("company__legal_name",)

@admin.register(Assumption)
class AssumptionAdmin(admin.ModelAdmin):
    list_display = ("id", "case", "key", "value", "source", "version", "created_at")
    search_fields = ("key", "value")

@admin.register(Result)
class ResultAdmin(admin.ModelAdmin):
    list_display = ("id", "case", "method", "metric", "value", "scenario", "created_at")
    search_fields = ("method", "metric")

@admin.register(SourceRef)
class SourceRefAdmin(admin.ModelAdmin):
    list_display = ("id", "case", "type", "locator", "retrieved_at")
    list_filter = ("type",)

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ("id", "case", "actor", "action", "at")
    search_fields = ("actor", "action")

@admin.register(InstrumentQuote)
class InstrumentQuoteAdmin(admin.ModelAdmin):
    list_display = ("id", "instrument", "status_code", "user", "x_user", "created_at")
    list_filter = ("instrument", "status_code")
    search_fields = ("x_user",)

@admin.register(CountryRisk)
class CountryRiskAdmin(admin.ModelAdmin):
    list_display = ("id", "year", "country", "erp", "default_spread", "updated_at")
    list_filter = ("year",)
    search_fields = ("country",)
