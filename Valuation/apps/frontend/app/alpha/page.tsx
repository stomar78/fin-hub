"use client";
import { useState } from "react";
import { apiUrl } from "../../lib/api";

export default function AlphaQuotePage() {
  const [symbol, setSymbol] = useState("MSFT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const fetchQuote = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch(apiUrl(`/api/data/alpha/global-quote?symbol=${encodeURIComponent(symbol)}`));
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
        <h1 className="text-xl font-raleway font-bold">Alpha Global Quote</h1>
      </div>
      <div className="maxw-hero row">
        <a href="/" className="nav-link">← Back</a>
      </div>

      <section className="maxw-hero card">
        <div className="card__body row">
          <input className="input" placeholder="Symbol" value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} />
          <button className="btn btn-primary hover-bloom" onClick={fetchQuote} disabled={loading}>{loading ? "Loading..." : "Fetch"}</button>
        </div>
        {error && <div className="card__body alert error">Error: {error}</div>}
      </section>

      {data && (
        <section className="maxw-hero card">
          <div className="card__body">
            <div><b>Symbol:</b> {data.symbol}</div>
            <div><b>Price:</b> {data.price ?? "—"}</div>
            <div><b>Change:</b> {data.change ?? "—"} ({data.change_percent ?? "—"})</div>
            {data.warning && <div className="alert warn" style={{ marginTop: 8 }}>{data.warning}</div>}
          </div>
        </section>
      )}
    </main>
  );
}
