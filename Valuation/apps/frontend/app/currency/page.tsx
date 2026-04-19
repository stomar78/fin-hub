"use client";
import React, { useState } from "react";

const currencies = ["USD", "AED", "GBP", "INR"] as const;

export default function MultiCurrencyPage() {
  const [cur, setCur] = useState<typeof currencies[number]>("USD");
  return (
    <main className="container section space-y-6">
      <div className="maxw-hero titlebar-blue">
        <h1 className="text-xl font-raleway font-bold">Multi-Currency Support</h1>
      </div>

      <p className="section__subtitle maxw-hero">Valuate in any currency. Prices and reports adapt in real-time.</p>

      <div className="maxw-hero currency-bar">
        {currencies.map((c) => (
          <button key={c} onClick={() => setCur(c)} className={`currency-chip ${cur === c ? "bright" : ""}`}>{c}</button>
        ))}
      </div>

      <section className="maxw-hero">
        <h2 className="section__title">Pricing Conversion</h2>
        <div className="card p-4">
          <div>Free Valuation → 0.00 {cur}</div>
          <div>Certified Valuation → auto-converted price (demo)</div>
          <div className="price-fx mt-2">Updated periodically using FX rates.</div>
        </div>
      </section>
    </main>
  );
}
