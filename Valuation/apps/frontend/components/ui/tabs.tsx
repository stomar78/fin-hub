"use client";
import React, { createContext, useContext, useId, useState } from "react";

interface TabsContextValue {
  value: string;
  setValue: (v: string) => void;
  id: string;
}
const TabsCtx = createContext<TabsContextValue | null>(null);

export interface TabsProps {
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
}

export function Tabs({ defaultValue, className, children }: TabsProps) {
  const [value, setValue] = useState(defaultValue);
  const id = useId();
  return (
    <TabsCtx.Provider value={{ value, setValue, id }}>
      <div className={className}>{children}</div>
    </TabsCtx.Provider>
  );
}

export function TabsList({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`inline-flex rounded-lg border border-slate-200 bg-white p-1 ${className || ""}`.trim()} role="tablist">
      {children}
    </div>
  );
}

export function TabsTrigger({ value, className, children }: { value: string; className?: string; children: React.ReactNode }) {
  const ctx = useContext(TabsCtx);
  if (!ctx) return null;
  const active = ctx.value === value;
  return (
    <button
      role="tab"
      aria-selected={active}
      aria-controls={`${ctx.id}-${value}`}
      onClick={() => ctx.setValue(value)}
      className={`px-3 py-1.5 text-sm rounded-md border transition ${active ? "bg-blue-600 text-white border-blue-600" : "bg-transparent text-slate-700 border-transparent hover:bg-slate-50"} ${className || ""}`.trim()}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className, children }: { value: string; className?: string; children: React.ReactNode }) {
  const ctx = useContext(TabsCtx);
  if (!ctx || ctx.value !== value) return null;
  return (
    <div id={`${ctx.id}-${value}`} role="tabpanel" className={className}>
      {children}
    </div>
  );
}

export default Tabs;
