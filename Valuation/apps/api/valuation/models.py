from django.db import models
from django.contrib.auth import get_user_model


class Company(models.Model):
    legal_name = models.CharField(max_length=255)
    sector = models.CharField(max_length=120, blank=True)
    country = models.CharField(max_length=2)
    currency = models.CharField(max_length=3)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class ValuationCase(models.Model):
    TIER_CHOICES = [("free", "Free"), ("vetted", "Vetted")]
    STATUS_CHOICES = [
        ("new", "New"),
        ("analyst_review", "Analyst Review"),
        ("draft", "Draft"),
        ("qa", "QA"),
        ("finalized", "Finalized"),
    ]
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    tier = models.CharField(max_length=16, choices=TIER_CHOICES, default="free")
    status = models.CharField(max_length=32, choices=STATUS_CHOICES, default="new")
    valuation_date = models.DateField(null=True, blank=True)
    purpose = models.CharField(max_length=255, blank=True)
    standard = models.CharField(max_length=64, default="IVS 2024")
    conclusion_value_low = models.DecimalField(max_digits=18, decimal_places=2, null=True, blank=True)
    conclusion_value_mid = models.DecimalField(max_digits=18, decimal_places=2, null=True, blank=True)
    conclusion_value_high = models.DecimalField(max_digits=18, decimal_places=2, null=True, blank=True)
    created_by = models.CharField(max_length=120, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Assumption(models.Model):
    case = models.ForeignKey(ValuationCase, on_delete=models.CASCADE)
    key = models.CharField(max_length=128)
    value = models.TextField()
    source = models.CharField(max_length=64, blank=True)
    note = models.TextField(blank=True)
    version = models.PositiveIntegerField(default=1)
    created_by = models.CharField(max_length=120, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Result(models.Model):
    case = models.ForeignKey(ValuationCase, on_delete=models.CASCADE)
    method = models.CharField(max_length=64)
    metric = models.CharField(max_length=64)
    value = models.DecimalField(max_digits=20, decimal_places=4)
    scenario = models.CharField(max_length=64, blank=True)
    run_id = models.CharField(max_length=64, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class SourceRef(models.Model):
    TYPE_CHOICES = [("api", "api"), ("manual", "manual"), ("file", "file")]
    case = models.ForeignKey(ValuationCase, on_delete=models.CASCADE)
    type = models.CharField(max_length=16, choices=TYPE_CHOICES)
    locator = models.TextField()
    hash = models.CharField(max_length=128, blank=True)
    retrieved_at = models.DateTimeField(auto_now_add=True)


class AuditLog(models.Model):
    case = models.ForeignKey(ValuationCase, on_delete=models.CASCADE)
    actor = models.CharField(max_length=120)
    action = models.CharField(max_length=120)
    before_json = models.JSONField(null=True, blank=True)
    after_json = models.JSONField(null=True, blank=True)
    at = models.DateTimeField(auto_now_add=True)


class CountryRisk(models.Model):
    year = models.PositiveIntegerField()
    country = models.CharField(max_length=64)
    erp = models.FloatField(help_text="Equity risk premium (percentage points)")
    default_spread = models.FloatField(null=True, blank=True, help_text="Default spread (percentage points)")
    note = models.TextField(blank=True)
    source_url = models.URLField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("year", "country")


class InstrumentQuote(models.Model):
    INSTRUMENT_CHOICES = [
        ("bond", "bond"),
        ("option", "option"),
        ("swap", "swap"),
    ]
    instrument = models.CharField(max_length=16, choices=INSTRUMENT_CHOICES)
    request_json = models.JSONField()
    response_json = models.JSONField(null=True, blank=True)
    status_code = models.PositiveIntegerField(default=200)
    user = models.ForeignKey(get_user_model(), null=True, blank=True, on_delete=models.SET_NULL)
    x_user = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["instrument", "created_at"]),
        ]
