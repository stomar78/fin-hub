"use client";
import React from "react";
import { Badge } from "./badge";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "error";
  heading?: React.ReactNode; // renamed from 'title' to avoid clash with HTMLAttributes.title
}

const variantCls: Record<NonNullable<AlertProps["variant"]>, string> = {
  info: "bg-blue-50 border-blue-200 text-slate-800",
  success: "bg-emerald-50 border-emerald-200 text-slate-800",
  warning: "bg-amber-50 border-amber-200 text-slate-800",
  error: "bg-red-50 border-red-200 text-slate-800",
};

export function Alert({ className, variant = "info", heading, children, ...rest }: AlertProps) {
  const cls = `rounded-lg border p-4 ${variantCls[variant]} ${className || ""}`.trim();
  return (
    <div role="status" className={cls} {...rest}>
      {heading ? (
        <div className="flex items-center gap-2 mb-1">
          <Badge variant={variant === "error" ? "destructive" : variant === "success" ? "success" : "outline"}>{variant.toUpperCase()}</Badge>
          <span className="font-semibold">{heading}</span>
        </div>
      ) : null}
      <div className="text-sm text-slate-700">{children}</div>
    </div>
  );
}

export default Alert;
