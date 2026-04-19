"use client";
import { useEffect, useState } from "react";
import { apiUrl } from "../../../lib/api";
import { useParams } from "next/navigation";

type CaseDetail = {
  id: number;
  tier: string;
  status: string;
  company: {
    id: number;
    legal_name: string;
    sector: string;
    country: string;
    currency: string;
  };
  conclusion: { low: number | null; mid: number | null; high: number | null };
  created_at: string;
};

export default function CaseDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [data, setData] = useState<CaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const run = async () => {
      try {
        const res = await fetch(apiUrl(`/api/valuation/cases/${id}`));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (e: any) {
        setError(e.message || String(e));
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  return (
    <div>
      <h1>Case {id}</h1>
      <p><a href="/cases">← Back to cases</a></p>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}
      {data && (
        <div style={{ display: "grid", gap: 8 }}>
          <div><b>Company:</b> {data.company.legal_name}</div>
          <div><b>Tier:</b> {data.tier} | <b>Status:</b> {data.status}</div>
          <div><b>Conclusion:</b> Low {data.conclusion.low?.toLocaleString() ?? "—"}, Mid {data.conclusion.mid?.toLocaleString() ?? "—"}, High {data.conclusion.high?.toLocaleString() ?? "—"}</div>
          <div><b>Created:</b> {new Date(data.created_at).toLocaleString()}</div>
        </div>
      )}
    </div>
  );
}
