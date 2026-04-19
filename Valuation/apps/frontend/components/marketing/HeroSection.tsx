"use client";
import React from "react";
import { Button } from "../ui/button";

export default function HeroSection() {
  return (
    <section className="hero overflow-hidden">
      {/* SVG pattern overlay */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.2 }} className="animate-float-pattern" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="valuationPattern" width="200" height="200" patternUnits="userSpaceOnUse">
            <circle cx="100" cy="100" r="2" fill="rgba(255,255,255,0.4)" />
            <path d="M0 100 Q100 0 200 100 T400 100" stroke="rgba(255,255,255,0.2)" fill="none" strokeWidth="1" />
            <path d="M0 100 Q100 200 200 100 T400 100" stroke="rgba(255,255,255,0.2)" fill="none" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#valuationPattern)" />
      </svg>

      {/* Particles */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div className="particle" style={{ top: "15%", left: "20%" }} />
        <div className="particle" style={{ top: "30%", left: "70%" }} />
        <div className="particle" style={{ top: "55%", left: "40%" }} />
        <div className="particle" style={{ top: "65%", left: "80%" }} />
        <div className="particle" style={{ top: "40%", left: "15%" }} />
        <div className="particle" style={{ top: "20%", left: "85%" }} />
        <div className="particle" style={{ top: "75%", left: "25%" }} />
        <div className="particle" style={{ top: "10%", left: "60%" }} />
      </div>

      <div className="maxw-hero" style={{ position: "relative", zIndex: 1 }}>
        <h1 className="hero__title font-raleway" style={{ color: "#fff" }}>
          AI-Driven Business & Asset Valuation Platform
        </h1>
        <p className="hero__subtitle">
          Experience next-gen valuation precision using QuantLib, deep-learning analytics, and real-time global market datasets.
        </p>
        <div className="dual-cta">
          <Button size="lg" className="btn btn-primary hover-bloom">
            Get Free Valuation
          </Button>
          <Button size="lg" variant="outline" className="btn btn-outline hover-bloom">
            Explore Vetted Reports
          </Button>
        </div>
      </div>
    </section>
  );
}
