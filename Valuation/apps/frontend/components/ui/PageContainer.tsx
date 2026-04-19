"use client";
import React from "react";

export default function PageContainer({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: 24, ...style }}>{children}</div>
  );
}
