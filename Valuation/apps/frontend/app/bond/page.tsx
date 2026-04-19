"use client";
import { useState } from "react";
import { apiUrl } from "../../lib/api";

export default function BondPricingPage() {
  const [form, setForm] = useState({
    face: 1000,
    coupon_rate_pct: 5,
    years_to_maturity: 5,
    yield_rate_pct: 4.2,
    frequency: "Semiannual",
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
      const res = await fetch(apiUrl("/api/instruments/bond/price"), {
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
        <h1 className="text-xl font-raleway font-bold">Bond Pricing</h1>
      </div>
      <div className="maxw-hero row">
        <a href="/" className="nav-link">← Back</a>
      </div>

      <section className="maxw-hero card">
        <div className="card__body stack maxw-form">
          <label>Face <input className="input" type="number" value={form.face} onChange={(e) => onChange("face", Number(e.target.value))} /></label>
          <label>Coupon % <input className="input" type="number" value={form.coupon_rate_pct} onChange={(e) => onChange("coupon_rate_pct", Number(e.target.value))} /></label>
          <label>Years to Maturity <input className="input" type="number" value={form.years_to_maturity} onChange={(e) => onChange("years_to_maturity", Number(e.target.value))} /></label>
          <label>Yield % <input className="input" type="number" value={form.yield_rate_pct} onChange={(e) => onChange("yield_rate_pct", Number(e.target.value))} /></label>
          <label>Frequency
            <select className="select" value={form.frequency} onChange={(e) => onChange("frequency", e.target.value)}>
              <option>Annual</option>
              <option>Semiannual</option>
              <option>Quarterly</option>
              <option>Monthly</option>
            </select>
          </label>
          <div className="form-actions">
            <button className="btn btn-primary hover-bloom" onClick={price} disabled={loading}>{loading ? "Pricing..." : "Price"}</button>
          </div>
        </div>
        {error && <div className="card__body alert error">Error: {error}</div>}
      </section>

      {data && (
        <section className="maxw-hero card">
          <div className="card__body">
            <div><b>Clean price:</b> {data.clean_price}</div>
            <div><b>Dirty price:</b> {data.dirty_price}</div>
            <div><b>Accrued:</b> {data.accrued}</div>
          </div>
        </section>
      )}
    </main>
  );
}
