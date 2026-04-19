"use client";
import { useEffect, useState } from "react";
import { apiUrl } from "../../lib/api";

type CaseItem = {
  id: number;
  tier: string;
  status: string;
  company: string;
  conclusion_mid: number | null;
  created_at: string;
};

export default function CasesList() {
  const [items, setItems] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needLogin, setNeedLogin] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
        if (!token) {
          setNeedLogin(true);
          setLoading(false);
          return;
        }
        const res = await fetch(apiUrl("/api/valuation/cases"), {
          headers: { Authorization: `Token ${token}` },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setItems(json.results || []);
      } catch (e: any) {
        setError(e.message || String(e));
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <main className="container section space-y-6">
      <div className="maxw-hero titlebar-blue">
        <h1 className="text-xl font-raleway font-bold">Cases</h1>
      </div>

      <div className="maxw-hero" style={{ display: "flex", gap: 12 }}>
        <a href="/" className="nav-link">← Back</a>
        {!needLogin && <a href="/dashboard" className="nav-link">Dashboard</a>}
      </div>

      {needLogin && (
        <div className="maxw-hero alert info">
          <div>Please <a href="/login" className="nav-link">login</a> to view your cases.</div>
        </div>
      )}

      {loading && (
        <div className="maxw-hero loading-overlay" style={{ position: "relative", inset: "unset", background: "transparent" }}>
          <div className="spinner" />
        </div>
      )}

      {error && (
        <div className="maxw-hero alert error">Error: {error}</div>
      )}

      {!loading && !error && !needLogin && (
        <div className="maxw-hero">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Company</th>
                <th>Status</th>
                <th>Tier</th>
                <th style={{ textAlign: "right" }}>Mid</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id}>
                  <td><a href={`/cases/${c.id}`} className="nav-link">{c.id}</a></td>
                  <td>{c.company}</td>
                  <td>{c.status}</td>
                  <td>{c.tier}</td>
                  <td style={{ textAlign: "right" }}>{c.conclusion_mid?.toLocaleString() ?? "—"}</td>
                  <td>{new Date(c.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && (
            <div className="empty" style={{ marginTop: 12 }}>No cases yet.</div>
          )}
        </div>
      )}
    </main>
  );
}
