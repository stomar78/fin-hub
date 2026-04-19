"use client";
import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="header">
      <nav className="navbar maxw-hero">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link href="/" className="nav-link" style={{ fontWeight: 700 }}>Epiidosis Valuation</Link>
          <div className="links">
            <Link href="/about" className="nav-link">About</Link>
            <Link href="/valuation-types" className="nav-link">Valuation Types</Link>
            <Link href="/pricing" className="nav-link">Pricing</Link>
            <Link href="/reports" className="nav-link">Reports</Link>
            <Link href="/contact" className="nav-link">Contact</Link>
          </div>
        </div>
        <div className="links">
          <Link href="/dashboard" className="nav-link">Dashboard</Link>
          <Link href="/marketplace" className="nav-link">API</Link>
          <Link href="/currency" className="nav-link">Currency</Link>
          <Link href="/partners" className="nav-link">Partners</Link>
        </div>
      </nav>
    </header>
  );
}
