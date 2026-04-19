"use client";
import React from "react";
import SavedReportsTable from "../../components/dashboard/SavedReportsTable";
import RecentCases from "../../components/dashboard/RecentCases";
import { ResponsiveContainer, LineChart, Line, Tooltip, PieChart, Pie } from "recharts";

export default function DashboardPage() {
  const lineData = [
    { month: "Jan", value: 25 },
    { month: "Feb", value: 40 },
    { month: "Mar", value: 35 },
    { month: "Apr", value: 60 },
  ];
  const pieData = [
    { name: "Business", value: 40 },
    { name: "Real Estate", value: 25 },
    { name: "Startup", value: 20 },
    { name: "Machinery", value: 15 },
  ];
  return (
    <main className="container section space-y-6">
      <div className="maxw-hero titlebar-blue">
        <h1 className="text-xl font-raleway font-bold">User Dashboard (Saved Reports)</h1>
      </div>
      <p className="section__subtitle maxw-hero">Access your saved valuation reports, track trends, and manage downloads.</p>

      <section className="maxw-hero summary-widgets">
        {["Total Reports Generated", "Average Accuracy (%)", "Reports In Progress", "Last Downloaded"].map((label) => (
          <div key={label} className="card">
            <div className="card__body kpi">
              <span className="kpi__label">{label}</span>
              <span className="kpi__value">—</span>
            </div>
          </div>
        ))}
      </section>

      <section className="maxw-hero smart-banner">
        <h2 className="card__title">Smart Recommendations</h2>
        <div>Your latest report indicates improvements — explore growth metrics.</div>
        <div className="row">
          <a href="/pricing" className="nav-link">Generate Certified Report</a>
        </div>
      </section>

      <section className="maxw-hero grid grid-cols-2 gap-4">
        <div className="card">
          <div className="card__body">
            <h3 className="card__title">Valuations Over Time</h3>
            <div className="h-220">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={3} dot={false} />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card__body">
            <h3 className="card__title">Category Distribution</h3>
            <div className="h-220">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={70} fill="#0ea5e9" label />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      <section className="maxw-hero">
        <h2 className="section__title">Saved Reports</h2>
        <SavedReportsTable />
      </section>

      <section className="maxw-hero">
        <h2 className="section__title">Recent Cases</h2>
        <RecentCases />
      </section>
    </main>
  );
}
