"use client";
import React, { useRef, useState } from "react";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  return (
    <div
      ref={ref}
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap bg-slate-900 text-white text-xs px-2 py-1 rounded shadow">
          {content}
        </div>
      )}
    </div>
  );
}

export default Tooltip;
