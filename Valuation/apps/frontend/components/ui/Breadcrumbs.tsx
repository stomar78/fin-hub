"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
  const pathname = usePathname() || "/";
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length < 2) return null;
  const crumbs = parts.map((p, i) => ({
    label: decodeURIComponent(p.replace(/[-_]/g, " ")), 
    href: "/" + parts.slice(0, i + 1).join("/")
  }));
  return (
    <nav aria-label="Breadcrumb" className="maxw-hero breadcrumbs" style={{ paddingTop: 8 }}>
      <Link href="/" className="nav-link">Home</Link>
      {crumbs.map((c, i) => (
        <React.Fragment key={c.href}>
          <span className="sep">/</span>
          {i === crumbs.length - 1 ? (
            <span>{c.label}</span>
          ) : (
            <Link href={c.href} className="nav-link">{c.label}</Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
