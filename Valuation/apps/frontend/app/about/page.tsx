"use client";
import React from "react";
import { Button } from "../../components/ui/button";

export default function AboutPage() {
  return (
    <main className="section space-y-6">
      {/* Hero Split */}
      <section className="full-bleed about-hero">
        <div className="maxw-hero banner-split">
          <div>
            <h1 className="hero__title">Building Global Trust Through AI-Powered Valuation Precision</h1>
            <p className="hero__subtitle">Deep sea-blue gradient background with animated contours and subtle particles conveying stability and innovation.</p>
            <Button size="lg" className="btn btn-primary hover-bloom">Learn About Our Process</Button>
          </div>
          <div className="feature card--glass" style={{ minHeight: 220 }}>
            <div className="skeleton h-180" />
            <p className="mt-2">Abstract illustration placeholder</p>
          </div>
        </div>
      </section>

      {/* Our Methodology */}
      <section className="section">
        <h2 className="section__title">Our Methodology</h2>
        <p className="section__subtitle">White background, three horizontal cards with blue highlights.</p>
        <div className="how-steps maxw-hero">
          <div className="feature">
            <h3>DCF</h3>
            <p>Cash flow discounting with robust scenario analysis.</p>
          </div>
          <div className="feature">
            <h3>Market Multiples</h3>
            <p>Global comparable benchmarking with curated datasets.</p>
          </div>
          <div className="feature">
            <h3>Quantitative Models</h3>
            <p>QuantLib-driven analytics and risk-adjusted returns.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
