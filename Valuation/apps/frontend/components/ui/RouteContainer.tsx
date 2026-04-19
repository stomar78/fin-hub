"use client";
import React from "react";
import { usePathname } from "next/navigation";

export default function RouteContainer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPreview = pathname?.startsWith("/preview");
  if (isPreview) {
    return <>{children}</>;
  }
  return <div style={{ maxWidth: 1120, margin: "0 auto", padding: 24 }}>{children}</div>;
}
