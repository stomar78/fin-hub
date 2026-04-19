"use client";
import { useState } from "react";
import { apiUrl } from "../../lib/api";

export default function OptionPricingPage() {
  const [form, setForm] = useState({
    spot: 100,
    strike: 105,
    r_pct: 3,
    vol_pct: 20,
    maturity_years: 1,
    option_type: "call",
    q_pct: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const onChange = (k: string, v: any) => setForm((s) => ({ ...s, [k]: v }));

  const price = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch(apiUrl("/api/instruments/option/european/price"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container section space-y-6">
      <div className="maxw-hero titlebar-blue">
        <h1 className="text-xl font-raleway font-bold">European Option Pricing</h1>
      </div>
      <div className="maxw-hero row">
        <a href="/" className="nav-link">← Back</a>
      </div>

      <section className="maxw-hero card">
        <div className="card__body stack maxw-form">
          <label>Spot <input className="input" type="number" value={form.spot} onChange={(e) => onChange("spot", Number(e.target.value))} /></label>
          <label>Strike <input className="input" type="number" value={form.strike} onChange={(e) => onChange("strike", Number(e.target.value))} /></label>
          <label>Rate % <input className="input" type="number" value={form.r_pct} onChange={(e) => onChange("r_pct", Number(e.target.value))} /></label>
          <label>Vol % <input className="input" type="number" value={form.vol_pct} onChange={(e) => onChange("vol_pct", Number(e.target.value))} /></label>
          <label>Maturity (years) <input className="input" type="number" value={form.maturity_years} step="0.1" onChange={(e) => onChange("maturity_years", Number(e.target.value))} /></label>
          <label>Type
            <select className="select" value={form.option_type} onChange={(e) => onChange("option_type", e.target.value)}>
              <option>call</option>
              <option>put</option>
            </select>
          </label>
          <label>Dividend yield % <input className="input" type="number" value={form.q_pct} onChange={(e) => onChange("q_pct", Number(e.target.value))} /></label>
          <div className="form-actions">
            <button className="btn btn-primary hover-bloom" onClick={price} disabled={loading}>{loading ? "Pricing..." : "Price"}</button>
          </div>
        </div>
        {error && <div className="card__body alert error">Error: {error}</div>}
      </section>

      {data && (
        <section className="maxw-hero card">
          <div className="card__body">
            <div><b>NPV:</b> {data.npv}</div>
            {data.greeks && (
              <div className="description-list">
                <dt>Delta</dt><dd>{data.greeks.delta}</dd>
                <dt>Gamma</dt><dd>{data.greeks.gamma}</dd>
                <dt>Vega</dt><dd>{data.greeks.vega}</dd>
                <dt>Theta</dt><dd>{data.greeks.theta}</dd>
                <dt>Rho</dt><dd>{data.greeks.rho}</dd>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
