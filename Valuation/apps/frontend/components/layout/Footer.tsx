"use client";
import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="maxw-hero" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div>© 2025 Epiidosis Valuation Portal • Powered by QuantLib & AI Precision</div>
        <nav style={{ display: "flex", gap: 12 }}>
          <Link href="/pricing" className="nav-link">Pricing</Link>
          <Link href="/reports" className="nav-link">Reports</Link>
          <Link href="/contact" className="nav-link">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
