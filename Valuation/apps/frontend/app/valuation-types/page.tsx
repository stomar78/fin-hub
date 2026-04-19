"use client";
import React from "react";

export default function ValuationTypesPage() {
  return (
    <main className="container section space-y-6">
      <div className="maxw-hero types-hero">
        <h1 className="text-xl font-raleway font-bold">Valuation Types We Offer</h1>
        <p className="section__subtitle" style={{ color: "#DBEAFE", marginTop: 8 }}>Business, Real Estate, Startup, and Asset/Machinery valuations with IVS alignment.</p>
      </div>

      <section className="maxw-hero methods-overview">
        <div className="feature">
          <h3>Business Valuation</h3>
          <p>DCF, EBITDA multiples, and market benchmarking for SMEs and corporates.</p>
        </div>
        <div className="feature">
          <h3>Real Estate Valuation</h3>
          <p>Income approach, comparable sales, and cap rate analysis.</p>
        </div>
        <div className="feature">
          <h3>Startup Valuation</h3>
          <p>Growth projections, risk models, and investor readiness.</p>
        </div>
        <div className="feature">
          <h3>Asset & Machinery</h3>
          <p>Depreciation modeling, market comparison, and cost reconstruction.</p>
        </div>
      </section>
    </main>
  );
}
