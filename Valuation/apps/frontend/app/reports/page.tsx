"use client";
import React from "react";

export default function ReportsSamplesPage() {
  return (
    <main className="container section space-y-6">
      <div className="maxw-hero titlebar-blue">
        <h1 className="text-xl font-raleway font-bold">Reports</h1>
      </div>

      <div className="maxw-hero card p-6">
        <p className="section__subtitle mb-4">Preview analyst-signed PDF reports with compliance badges and zoom controls.</p>
        <div className="pdf-viewer h-380 center" style={{ color: "#94a3b8" }}>
          PDF Preview Placeholder
        </div>
        <div className="mt-4">
          <a href="#" className="nav-link">Download Sample Report (PDF)</a>
        </div>
      </div>
    </main>
  );
}
