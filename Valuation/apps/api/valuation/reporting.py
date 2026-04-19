import os
import uuid
from django.conf import settings


def generate_free_report(payload: dict) -> str:
    report_id = str(uuid.uuid4())
    reports_dir = os.path.join(settings.MEDIA_ROOT, "reports")
    os.makedirs(reports_dir, exist_ok=True)
    file_path = os.path.join(reports_dir, f"{report_id}.html")
    html = f"""
<!doctype html>
<html>
<head>
  <meta charset='utf-8'>
  <title>Free Valuation Report</title>
  <style>
    body {{ font-family: Arial, sans-serif; margin: 24px; }}
    h1 {{ margin-bottom: 8px; }}
    .meta {{ color: #666; margin-bottom: 16px; }}
    .grid table {{ border-collapse: collapse; width: 100%; }}
    .grid th, .grid td {{ border: 1px solid #ddd; padding: 6px; text-align: right; }}
    .grid th {{ text-align: center; background: #f5f5f5; }}
  </style>
</head>
<body>
  <h1>Free Valuation (Indicative)</h1>
  <div class="meta">Company: {payload.get('company_name','N/A')} | Sector: {payload.get('sector','')} | Country: {payload.get('country','')}</div>
  <h2>Value Range</h2>
  <p>Low: {payload['value_low']:,} | Mid: {payload['value_mid']:,} | High: {payload['value_high']:,}</p>
  <h3>Method Weights</h3>
  <p>DCF: {int(payload['method_weights']['dcf']*100)}% | Multiples: {int(payload['method_weights']['multiples']*100)}%</p>
  <h3>Sensitivity</h3>
  <div class="grid">
    <table>
      <tr>
        <th>WACC \\ g</th>
        {''.join(f'<th>{g}%</th>' for g in payload['sensitivity']['g'])}
      </tr>
      {''.join('<tr>'+''.join([f'<td>{w}%</td>']+[f"<td>{v:,}</td>" for v in row])+'</tr>' for w,row in zip(payload['sensitivity']['wacc'], payload['sensitivity']['grid']))}
    </table>
  </div>
  <p style="margin-top:24px;color:#777;">Indicative only. Not investment advice. Based on provided/available data as-of run date.</p>
</body>
</html>
"""
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(html)
    # Try optional PDF rendering if WeasyPrint is available
    pdf_url = None
    try:
        from weasyprint import HTML  # type: ignore

        pdf_path = os.path.join(reports_dir, f"{report_id}.pdf")
        HTML(string=html, base_url=str(reports_dir)).write_pdf(pdf_path)
        pdf_url = settings.MEDIA_URL + "reports/" + os.path.basename(pdf_path)
    except Exception:
        pdf_url = None

    # Prefer PDF if available; otherwise return HTML link
    if pdf_url:
        return pdf_url
    return settings.MEDIA_URL + "reports/" + os.path.basename(file_path)
