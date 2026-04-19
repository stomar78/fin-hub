"use client";
import React from "react";
import PricingCard from "../../components/marketing/PricingCard";

export default function PricingPage() {
  return (
    <main className="container section space-y-6">
      <div className="maxw-hero titlebar-blue">
        <h1 className="text-xl font-raleway font-bold">Pricing</h1>
      </div>

      <section className="maxw-hero pricing-teaser">
        <PricingCard
          name="Free Instant Valuation"
          price="$0"
          features={["Basic DCF & Multiple Valuation", "Instant Summary", "Email Delivery", "AI Confidence"]}
        />
        <PricingCard
          name="Certified Analyst Valuation"
          price="$1499"
          features={["IVS-Compliant Report", "Analyst-Reviewed Model", "Sensitivity Charts", "Investor-Ready Deck"]}
          highlighted
        />
      </section>
    </main>
  );
}
