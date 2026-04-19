"use client";
import React from "react";
import { Button } from "../ui/button";

export default function CTAButtons() {
  return (
    <div className="flex justify-center gap-4">
      <Button size="lg" className="btn btn-primary hover-bloom">
        Get Free Valuation
      </Button>
      <Button size="lg" variant="outline" className="btn btn-outline hover-bloom">
        Explore Reports
      </Button>
    </div>
  );
}
