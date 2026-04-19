"use client";
import React from "react";

export default function PartnerPortalPage() {
  return (
    <main className="container section space-y-6">
      <div className="maxw-hero partner-hero">
        <h1 className="text-xl font-raleway font-bold">Partner Portal Dashboard</h1>
        <p className="section__subtitle">Manage firm profile, earnings, and team workflows in one place.</p>
      </div>

      <section className="maxw-hero summary-widgets">
        {["Monthly Earnings", "Active Clients", "Completed Reports"].map((label) => (
          <div key={label} className="card">
            <div className="card__body">
              <div className="kpi">
                <span className="kpi__label">{label}</span>
                <span className="kpi__value">—</span>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="maxw-hero smart-banner">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="partner-card">
            <h3 className="card__title">Firm Profile</h3>
            <p className="card__subtitle">Upload logo, manage team, and configure white-label settings.</p>
            <div className="whitelabel">White-label area</div>
          </div>
          <div className="partner-card">
            <h3 className="card__title">Revenue Dashboard</h3>
            <p className="card__subtitle">Track valuation volume, payout shares, and analytics.</p>
            <button className="btn btn-secondary hover-bloom">Request Payout</button>
          </div>
        </div>
      </section>
    </main>
  );
}
