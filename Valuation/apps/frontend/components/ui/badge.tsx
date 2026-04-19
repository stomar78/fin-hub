"use client";
import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "destructive" | "outline";
}

export function Badge({ className, variant = "default", children, ...rest }: BadgeProps) {
  const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
    default: "bg-blue-50 text-blue-700 border border-blue-200",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    destructive: "bg-red-50 text-red-700 border border-red-200",
    outline: "bg-transparent text-slate-700 border border-slate-300",
  };
  const cls = `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant]} ${className || ""}`.trim();
  return (
    <span className={cls} {...rest}>
      {children}
    </span>
  );
}

export default Badge;
