"use client";
import React from "react";

export default function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <h2 style={{ margin: 0, color: "#0f172a" }}>{title}</h2>
      {subtitle ? (
        <p style={{ margin: 0, marginTop: 4, color: "#475569" }}>{subtitle}</p>
      ) : null}
      <div style={{ height: 2, width: 48, background: "#0ea5e9", borderRadius: 2, marginTop: 8 }} />
    </div>
  );
}
