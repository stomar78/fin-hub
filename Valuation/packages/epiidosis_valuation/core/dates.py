from datetime import date


def valuation_date(today: date | None = None) -> date:
    return today or date.today()
