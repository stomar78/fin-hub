"use client";
import React from "react";
import HeroSection from "../../../components/marketing/HeroSection";
import CTAButtons from "../../../components/marketing/CTAButtons";
import PricingCard from "../../../components/marketing/PricingCard";
import ComparisonTable from "../../../components/marketing/ComparisonTable";
import FAQAccordion from "../../../components/marketing/FAQAccordion";
import GradientBanner from "../../../components/marketing/GradientBanner";

export default function LandingPreview() {
  return (
    <main className="container space-y-10 pb-6">
        {/* Full-bleed hero */}
        <div className="full-bleed">
          <HeroSection />
        </div>

        <section className="grid md:grid-cols-2 gap-8">
          <PricingCard
            name="Free Instant Valuation"
            price="$0"
            features={["Basic DCF & Multiple Valuation", "Instant Summary", "Email Delivery", "AI Confidence"]}
          />
          <PricingCard
            name="Certified Analyst Valuation"
            price="$1499"
            highlighted
            features={["Certified Analyst Review", "IVS-Compliant Report", "Sensitivity Charts", "Investor-Ready Deck"]}
          />
        </section>

        <section className="space-y-6">
          <ComparisonTable
            columns={["Feature", "Free", "Certified"]}
            rows={[
              { feature: "DCF", values: ["Basic", "Advanced"] },
              { feature: "Multiples", values: ["Market Median", "Industry Curated"] },
              { feature: "Compliance", values: ["—", "IVS / IFRS"] },
              { feature: "Delivery", values: ["Email", "Analyst Signed PDF"] },
            ]}
            highlightCol={1}
          />
        </section>

        <section className="space-y-6">
          <FAQAccordion
            items={[
              { id: "1", q: "Is the free valuation accurate?", a: "It provides a quick estimate using market data and basic DCF/multiples. Use Certified for investor-grade compliance." },
              { id: "2", q: "How long for certified reports?", a: "2–5 business days depending on complexity; rush options available." },
              { id: "3", q: "Which currencies are supported?", a: "USD, AED, GBP, INR initially, with more on request." },
            ]}
          />
        </section>

        {/* Full-bleed gradient banner */}
        <div className="full-bleed">
          <GradientBanner />
        </div>

        <div className="text-center">
          <CTAButtons />
        </div>

        {/* Reports preview block with blue title bar */}
        <section className="space-y-4">
          <div className="titlebar-blue">
            <h3 className="text-xl font-raleway font-bold">Reports</h3>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-blue">
            <p className="text-slate-700 mb-3">Preview analyst-signed PDF reports with compliance badges and zoom controls.</p>
            <div className="h-48 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400">
              PDF Preview Placeholder
            </div>
          </div>
        </section>
    </main>
  );
}
