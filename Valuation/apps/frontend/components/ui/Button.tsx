"use client";
import React from "react";

type Variant = "default" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const base = "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 border";
const variantCls: Record<Variant, string> = {
  default: "bg-blue-700 text-white hover:bg-blue-800 border-blue-700",
  secondary: "bg-white text-[#0033A0] border-slate-200 hover:bg-blue-50",
  outline: "bg-transparent text-white border-white hover:bg-white/10",
  ghost: "bg-transparent text-[#0f172a] border-transparent hover:bg-slate-50",
};
const sizeCls: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-3 text-base",
};

export function Button({ variant = "default", size = "md", className, children, ...rest }: ButtonProps) {
  const cls = `${base} ${variantCls[variant]} ${sizeCls[size]} ${className || ""}`.trim();
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}

export default Button;
