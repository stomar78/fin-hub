"use client";
import React, { useEffect, useState } from "react";
import { apiUrl } from "../../lib/api";

interface CaseItem {
  id: number;
  tier: string;
  status: string;
  company?: string;
  conclusion_mid?: number | null;
  created_at: string;
}

export default function RecentCases() {
  const [rows, setRows] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCases = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl("/api/valuation/cases"), { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const items: CaseItem[] = Array.isArray(json) ? json : json.results || [];
      setRows(items);
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCases(); }, []);

  return (
    <div className="card">
      <div className="card__body">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <h3 className="card__title" style={{ margin: 0 }}>Recent Cases</h3>
          <button onClick={fetchCases} className="btn btn-ghost" disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
        {error && <div className="alert error" style={{ marginBottom: 8 }}>Error: {error}</div>}
        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Company</th>
                <th>Status</th>
                <th>Tier</th>
                <th>Mid</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: 12, textAlign: "center", color: "#64748b" }}>
                    {loading ? "Loading..." : "No cases (submit a Free Valuation to create one)."}
                  </td>
                </tr>
              )}
              {rows.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.company || "—"}</td>
                  <td>{c.status}</td>
                  <td>{c.tier}</td>
                  <td>{c.conclusion_mid != null ? Number(c.conclusion_mid).toLocaleString() : "—"}</td>
                  <td>{new Date(c.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const th: React.CSSProperties = { };
const td: React.CSSProperties = { };
