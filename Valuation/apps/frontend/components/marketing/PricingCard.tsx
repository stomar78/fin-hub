"use client";
import React from "react";
import { Button } from "../ui/button";

export interface PricingCardProps {
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}

export default function PricingCard({ name, price, features, highlighted }: PricingCardProps) {
  return (
    <div className={`rounded-2xl border border-slate-200 p-10 text-center bg-white shadow-md transition-shadow hover:shadow-xl`}>
      <div className="mb-3 flex items-center justify-center gap-2">
        <h3 className="text-2xl font-bold text-blue-700">{name}</h3>
        {highlighted ? <span className="badge info">Most Popular</span> : null}
      </div>
      <p className="text-5xl font-bold mb-6 text-slate-800">{price}</p>
      <ul className="space-y-3 mb-8 text-slate-600">
        {features.map((f, i) => (
          <li key={i}>✔ {f}</li>
        ))}
      </ul>
      <Button size="lg" className={`bg-blue-700 hover:bg-blue-800 text-white font-semibold hover-bloom`}>
        {highlighted ? "Upgrade Now" : "Get Started"}
      </Button>
    </div>
  );
}
