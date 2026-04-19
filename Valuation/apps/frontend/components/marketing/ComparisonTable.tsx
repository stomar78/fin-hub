"use client";
import React from "react";

export interface ComparisonTableProps {
  columns: string[]; // first column is feature name header
  rows: Array<{ feature: string; values: (string | React.ReactNode)[]; highlightIndex?: number }>; // values length should equal columns.length - 1
  highlightCol?: number; // 0-based index among plan columns
}

export default function ComparisonTable({ columns, rows, highlightCol }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="comp-table" role="table">
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th key={i} style={{ width: i === 0 ? "34%" : undefined, textAlign: i === 0 ? "left" : "left" }}>
                {i > 0 && highlightCol === i - 1 ? (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    {c}
                    <span className="badge info">Best</span>
                  </span>
                ) : (
                  c
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri}>
              <td style={{ fontWeight: 600, color: "#0f172a" }}>{r.feature}</td>
              {r.values.map((v, vi) => (
                <td key={vi} style={highlightCol === vi ? { background: "#EFF6FF" } : undefined}>{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
