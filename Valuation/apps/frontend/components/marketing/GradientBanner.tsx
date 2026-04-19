"use client";
import React from "react";
import { Button } from "../ui/button";

export default function GradientBanner() {
  return (
    <section className="cta-strip">
      <div className="maxw-hero">
        <h2 className="section__title" style={{ color: "#fff", marginBottom: 12 }}>Transform Your Valuation Workflow</h2>
        <p className="section__subtitle" style={{ color: "#DBEAFE", marginBottom: 24 }}>Automate valuations, ensure compliance, and deliver investor-grade insights in minutes.</p>
        <Button size="lg" className="btn btn-primary hover-bloom">Start Free Valuation</Button>
      </div>
    </section>
  );
}
