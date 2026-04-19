"use client";
import React from "react";
import { Accordion } from "../ui/accordion";

export interface FAQItem { id: string; q: string; a: React.ReactNode }

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const mapped = items.map((x) => ({ id: x.id, title: x.q, children: x.a }));
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-blue">
      <h3 className="text-xl font-semibold text-[#0033A0] mb-4">Frequently Asked Questions</h3>
      <Accordion items={mapped} />
    </div>
  );
}
