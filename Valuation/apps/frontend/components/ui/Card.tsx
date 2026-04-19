"use client";
import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, children, ...rest }: CardProps) {
  const cls = `bg-white rounded-xl border border-slate-200 shadow-sm ${className || ""}`.trim();
  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...rest }: CardProps) {
  const cls = `p-6 ${className || ""}`.trim();
  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  );
}

export default Card;
