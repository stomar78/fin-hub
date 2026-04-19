"use client";
import React, { useEffect, useMemo, useState } from "react";
import { apiUrl } from "../../lib/api";

interface QuoteItem {
  id: number;
  instrument: string;
  payload: any;
  result: any;
  created_at: string;
}

export default function SavedReportsTable() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<QuoteItem[]>([]);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("authUser") : null;
    if (stored && !email) setEmail(stored);
  }, [email]);

  const canFetch = useMemo(() => email && email.includes("@"), [email]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (email) headers["X-User"] = email;
      const res = await fetch(apiUrl("/api/instruments/quotes"), { headers, cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const items: QuoteItem[] = Array.isArray(json) ? json : json.results || [];
      setRows(items);
      if (typeof window !== "undefined") localStorage.setItem("authUser", email);
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch if we have a valid email from storage or input
  useEffect(() => {
    if (canFetch && rows.length === 0 && !loading) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canFetch]);

  return (
    <div className="card">
      <div className="card__body">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <label style={{ fontSize: 12, color: "#475569" }}>X-User</label>
            <input
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
            />
            <button className="btn btn-primary hover-bloom" onClick={fetchData} disabled={!canFetch || loading}>
              {loading ? "Loading..." : "Fetch"}
            </button>
          </div>
          <div style={{ fontSize: 12, color: "#64748b" }}>
            Showing saved instrument quotes for the provided X-User header
          </div>
        </div>

        {error && (
          <div className="alert error" style={{ marginBottom: 8 }}>Error: {error}</div>
        )}

        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Instrument</th>
                <th>Created</th>
                <th>Key Fields</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: 12, color: "#64748b", textAlign: "center" }}>
                    {loading ? "Fetching..." : "No rows. Enter X-User and click Fetch."}
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.instrument || "—"}</td>
                  <td>{new Date(r.created_at).toLocaleString()}</td>
                  <td>
                    <code style={{ fontSize: 11 }}>
                      {summarize(r.payload, r.result)}
                    </code>
                  </td>
                  <td>
                    <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); alert(JSON.stringify(r, null, 2)); }}>View</a>
                  </td>
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

function summarize(payload: any, result: any): string {
  try {
    const p = typeof payload === "string" ? JSON.parse(payload) : payload || {};
    const r = typeof result === "string" ? JSON.parse(result) : result || {};
    const keys = ["face", "coupon_rate_pct", "years_to_maturity", "yield_rate_pct", "frequency", "symbol", "price", "npv"];
    const parts: string[] = [];
    keys.forEach((k) => {
      if (p && p[k] != null) parts.push(`${k}:${p[k]}`);
      if (r && r[k] != null) parts.push(`${k}:${r[k]}`);
    });
    return parts.slice(0, 6).join(", ");
  } catch {
    return "";
  }
}
