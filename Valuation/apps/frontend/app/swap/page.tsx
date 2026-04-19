"use client";
import { useState } from "react";
import { apiUrl } from "../../lib/api";

export default function SwapPricingPage() {
  const [form, setForm] = useState({
    notional: 1000000,
    fixed_rate_pct: 3.0,
    float_rate_pct: 2.5,
    years: 5,
    pay_fixed: true,
    fixed_frequency: "Annual",
    discount_rate_pct: undefined as number | undefined,
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
      const payload: any = { ...form };
      if (payload.discount_rate_pct === undefined || payload.discount_rate_pct === null || payload.discount_rate_pct === "") {
        delete payload.discount_rate_pct;
      }
      const res = await fetch(apiUrl("/api/instruments/swap/plain/price"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
        <h1 className="text-xl font-raleway font-bold">Plain Vanilla Swap Pricing</h1>
      </div>
      <div className="maxw-hero row">
        <a href="/" className="nav-link">← Back</a>
      </div>

      <section className="maxw-hero card">
        <div className="card__body stack maxw-form">
          <label>Notional <input className="input" type="number" value={form.notional} onChange={(e) => onChange("notional", Number(e.target.value))} /></label>
          <label>Fixed rate % <input className="input" type="number" value={form.fixed_rate_pct} onChange={(e) => onChange("fixed_rate_pct", Number(e.target.value))} /></label>
          <label>Float rate % <input className="input" type="number" value={form.float_rate_pct} onChange={(e) => onChange("float_rate_pct", Number(e.target.value))} /></label>
          <label>Years <input className="input" type="number" value={form.years} onChange={(e) => onChange("years", Number(e.target.value))} /></label>
          <label>Pay fixed
            <select className="select" value={String(form.pay_fixed)} onChange={(e) => onChange("pay_fixed", e.target.value === "true")}> 
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          </label>
          <label>Fixed frequency
            <select className="select" value={form.fixed_frequency} onChange={(e) => onChange("fixed_frequency", e.target.value)}>
              <option>Annual</option>
              <option>Semiannual</option>
              <option>Quarterly</option>
              <option>Monthly</option>
            </select>
          </label>
          <label>Discount rate % (optional)
            <input className="input" type="number" value={form.discount_rate_pct ?? ""} onChange={(e) => onChange("discount_rate_pct", e.target.value === "" ? undefined : Number(e.target.value))} />
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
            <div><b>NPV:</b> {data.npv}</div>
            <div><b>Fair rate:</b> {data.fair_rate}</div>
            <div><b>Fixed leg BPS:</b> {data.fixed_leg_bps}</div>
            <div><b>Floating leg BPS:</b> {data.floating_leg_bps}</div>
          </div>
        </section>
      )}
    </main>
  );
}
