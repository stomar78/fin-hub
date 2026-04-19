"use client";
import React from "react";

export default function AnimatedBackground({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute inset-0 shimmer-bg opacity-20" />
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="valuationPattern" width="200" height="200" patternUnits="userSpaceOnUse">
            <circle cx="100" cy="100" r="2" fill="rgba(255,255,255,0.4)" />
            <path d="M0 100 Q100 0 200 100 T400 100" stroke="rgba(255,255,255,0.2)" fill="none" strokeWidth="1" />
            <path d="M0 100 Q100 200 200 100 T400 100" stroke="rgba(255,255,255,0.2)" fill="none" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#valuationPattern)" />
      </svg>
    </div>
  );
}
