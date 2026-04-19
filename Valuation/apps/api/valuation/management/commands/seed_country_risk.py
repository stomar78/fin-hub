import csv
import io
import sys
from urllib.request import urlopen
from django.core.management.base import BaseCommand, CommandError
from valuation.models import CountryRisk

DEFAULT_URLS = [
    # Common Damodaran paths (names occasionally change)
    "https://raw.githubusercontent.com/AswathDamodaran/Data/master/Country%20Data/Global_ERP_Country.csv",
    "https://raw.githubusercontent.com/AswathDamodaran/Data/master/Country%20Data/CountryDefaultSpreads.csv",
    "https://raw.githubusercontent.com/AswathDamodaran/Data/master/Country%20Data/Global%20Equity%20Risk%20Premiums.csv",
]

class Command(BaseCommand):
    help = "Seed CountryRisk (ERP/Default Spread) from Damodaran CSV. Provide --file or --url."

    def add_arguments(self, parser):
        parser.add_argument("--file", dest="file", help="Local CSV file path")
        parser.add_argument("--url", dest="url", help="CSV URL (defaults to Damodaran)")
        parser.add_argument("--year", dest="year", type=int, help="Year to tag records with", required=True)
        parser.add_argument("--overwrite", action="store_true", help="Overwrite existing entries for (year,country)")

    def handle(self, *args, **opts):
        src = opts.get("file")
        url = opts.get("url")
        year = opts["year"]
        overwrite = opts["overwrite"]

        if src:
            data = open(src, "rb").read()
            source_url = f"file://{src}"
        else:
            urls = [url] if url else DEFAULT_URLS
            last_err = None
            data = None
            source_url = None
            for candidate in urls:
                try:
                    self.stdout.write(self.style.NOTICE(f"Downloading {candidate} ..."))
                    with urlopen(candidate) as resp:
                        data = resp.read()
                    source_url = candidate
                    break
                except Exception as e:
                    last_err = e
                    continue
            if data is None:
                raise CommandError(f"Failed to download from known URLs. Last error: {last_err}")

        decoded = data.decode("utf-8", errors="ignore")
        reader = csv.DictReader(io.StringIO(decoded))
        count = 0
        for row in reader:
            # Column variations across files
            country = (row.get("Country") or row.get("country") or row.get("Country Name") or "").strip()
            if not country:
                continue
            # ERP may be in 'Total ERP' or 'ERP' or 'Equity Risk Premium'
            erp_raw = row.get("Total ERP") or row.get("ERP") or row.get("Equity Risk Premium") or row.get("Equity Risk Premium (CRP)") or ""
            try:
                erp = float(erp_raw) if erp_raw != "" else 0.0
            except Exception:
                continue
            default_spread = row.get("Default Spread") or row.get("DefaultSpread") or row.get("Sovereign Default Spread") or ""
            try:
                default_spread = float(default_spread) if default_spread != "" else None
            except Exception:
                default_spread = None

            if overwrite:
                CountryRisk.objects.update_or_create(
                    year=year, country=country,
                    defaults={"erp": erp, "default_spread": default_spread, "source_url": source_url}
                )
                count += 1
            else:
                obj, created = CountryRisk.objects.get_or_create(
                    year=year, country=country,
                    defaults={"erp": erp, "default_spread": default_spread, "source_url": source_url}
                )
                if created:
                    count += 1
        self.stdout.write(self.style.SUCCESS(f"Seeded {count} CountryRisk records for {year}"))
