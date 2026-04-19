"use client";
import { useState } from "react";
import { apiUrl } from "../lib/api";

type Payload = {
  company_name: string;
  sector: string;
  country: string;
  currency: string;
  ttm_revenue: number;
  ebitda_margin_pct: number;
  growth_next_year_pct: number;
  stage: "seed" | "early" | "growth" | "mature";
};

const steps = ["Company", "Financials", "Assumptions", "Review"] as const;

export default function Wizard() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string>("");

  const [data, setData] = useState<Payload>({
    company_name: "",
    sector: "Software",
    country: "IN",
    currency: "INR",
    ttm_revenue: 15000000,
    ebitda_margin_pct: 18,
    growth_next_year_pct: 25,
    stage: "growth",
  });

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const storedUser = typeof window !== "undefined" ? localStorage.getItem("authUser") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Token ${token}`;
      headers["X-User"] = userEmail || storedUser || "";

      const res = await fetch(apiUrl("/api/valuation/free"), {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setResult(json);
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F8FAFF] to-[#E6F2FF] text-[#0F172A]">
      {/* Hero Header */}
      <header className="hero-gradient animate-gradient-x text-center text-white py-16 shadow-blue">
        <div className="maxw-hero">
          <h1 className="text-4xl font-raleway font-bold mb-4">Business Valuation Wizard</h1>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Enter your company details to get an instant AI-powered valuation estimate. Upgrade for a full IVS-compliant report.
          </p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="flex justify-center gap-8 py-4 bg-white shadow-sm border-b">
        {["Alpha Quote", "Bond Pricer", "Option Pricer", "Swap Pricer", "Cases"].map((link, i) => (
          <a key={i} href={`/${link.toLowerCase().replace(" ", "")}`} className="nav-link text-sm">
            {link}
          </a>
        ))}
      </nav>

      {/* Step Indicator */}
      <section className="section text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-gray-600 mb-2">
            Step {step + 1} of {steps.length} — <span className="font-semibold text-gradient">{steps[step]}</span>
          </p>
          <div className="flex justify-center gap-3 mb-6">
            {steps.map((label, i) => (
              <div
                key={label}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  i === step
                    ? "bg-gradient-accent text-white shadow-blue-strong"
                    : "bg-[#F1F5F9] text-gray-600"
                }`}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="max-w-md mx-auto card p-6 text-left space-y-3">
            {step === 0 && (
              <>
                <input
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Company Name"
                  value={data.company_name}
                  onChange={(e) => setData({ ...data, company_name: e.target.value })}
                />
                <input
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Sector"
                  value={data.sector}
                  onChange={(e) => setData({ ...data, sector: e.target.value })}
                />
                <input
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Country (ISO2)"
                  value={data.country}
                  onChange={(e) => setData({ ...data, country: e.target.value.toUpperCase() })}
                />
                <input
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Currency (ISO3)"
                  value={data.currency}
                  onChange={(e) => setData({ ...data, currency: e.target.value.toUpperCase() })}
                />
                <input
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Your email (optional)"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
              </>
            )}

            {step === 1 && (
              <>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="TTM Revenue"
                  value={data.ttm_revenue}
                  onChange={(e) => setData({ ...data, ttm_revenue: Number(e.target.value) })}
                />
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="EBITDA Margin %"
                  value={data.ebitda_margin_pct}
                  onChange={(e) => setData({ ...data, ebitda_margin_pct: Number(e.target.value) })}
                />
              </>
            )}

            {step === 2 && (
              <>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Growth Next Year %"
                  value={data.growth_next_year_pct}
                  onChange={(e) => setData({ ...data, growth_next_year_pct: Number(e.target.value) })}
                />
                <select
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={data.stage}
                  onChange={(e) => setData({ ...data, stage: e.target.value as Payload["stage"] })}
                >
                  <option value="seed">Seed</option>
                  <option value="early">Early</option>
                  <option value="growth">Growth</option>
                  <option value="mature">Mature</option>
                </select>
              </>
            )}

            {step === 3 && (
              <div className="bg-[#F8FAFF] border border-gray-200 p-4 rounded-md">
                <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(data, null, 2)}</pre>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prev}
              disabled={step === 0}
              className={`btn ${step === 0 ? "opacity-50 cursor-not-allowed" : "btn-outline hover-bloom"}`}
            >
              Back
            </button>
            {step < steps.length - 1 ? (
              <button onClick={next} className="btn btn-primary hover-bloom">
                Next
              </button>
            ) : (
              <button onClick={submit} disabled={loading} className="btn btn-primary hover-bloom">
                {loading ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>

          {/* Result / Error */}
          {error && <p className="text-red-600 mt-4">Error: {error}</p>}
          {result && (
            <div className="mt-6 card p-4 text-left bg-white/90">
              <h3 className="font-semibold text-lg mb-2 text-epi-blue-dark">Result</h3>
              <p>
                Range:{" "}
                <span className="font-semibold text-gradient">
                  {result.value_low.toLocaleString()} — {result.value_high.toLocaleString()}
                </span>{" "}
                (mid {result.value_mid.toLocaleString()})
              </p>
              <p>
                PDF:{" "}
                <a href={`${apiUrl("")}${result.pdf_url}`} target="_blank" className="text-blue-600 underline">
                  Download
                </a>
              </p>
              <div className="flex gap-4 mt-3">
                <a href="/cases" className="nav-link text-blue-700">Recent Cases</a>
                <a href="/alpha" className="nav-link text-blue-700">Alpha Global Quote</a>
              </div>
            </div>
          )}
        </div>
      </section>

      <footer className="footer mt-12">
        © 2025 Epiidosis Valuation Portal • Powered by QuantLib & AI Precision
      </footer>
    </div>
  );
}
