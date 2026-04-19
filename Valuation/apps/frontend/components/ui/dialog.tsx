"use client";
import React, { useEffect } from "react";

export interface DialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title?: React.ReactNode;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, title, children }: DialogProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={() => onOpenChange(false)} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-deep max-w-lg w-full">
          {title ? (
            <div className="p-4 border-b border-slate-200 font-semibold text-slate-800">{title}</div>
          ) : null}
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Dialog;
