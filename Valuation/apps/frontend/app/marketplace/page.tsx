"use client";
import React from "react";
import Tabs, { TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import Modal from "../../components/ui/Modal";

const apis = [
  { path: "/api/valuation/dcf", desc: "Run discounted cash flow valuations.", pricing: "Free tier + premium" },
  { path: "/api/instruments/bond/price", desc: "Price fixed-rate bullet bonds with QuantLib.", pricing: "Free" },
  { path: "/api/instruments/option/european/price", desc: "Black–Scholes European option pricing.", pricing: "Free" },
  { path: "/api/instruments/swap/plain/price", desc: "Plain vanilla swap pricing.", pricing: "Free" },
];

export default function ApiMarketplacePage() {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(apis[0]);
  return (
    <main className="container section space-y-6">
      <div className="maxw-hero titlebar-blue">
        <h1 className="text-xl font-raleway font-bold">API Marketplace</h1>
      </div>

      <p className="section__subtitle maxw-hero">Plug & Play valuation intelligence. Built on QuantLib and global standards.</p>

      <section className="maxw-hero api-grid">
        {apis.map((a) => (
          <div key={a.path} className="api-card">
            <div className="fw-700">{a.path}</div>
            <div className="mt-2">{a.desc}</div>
            <div className="mt-2 text-sm">Pricing: {a.pricing}</div>
            <div className="row mt-2">
              <a href="/api/docs" className="nav-link">View API Docs</a>
              <button className="btn btn-secondary" onClick={() => { setSelected(a); setOpen(true); }}>Try Now</button>
            </div>
          </div>
        ))}
      </section>

      <section className="maxw-hero">
        <h2 className="section__title">Developer Resources</h2>
        <Tabs defaultValue="overview">
          <TabsList className="row-sm" >
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="auth">Auth</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="samples">Samples</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="card p-4">
            <p>Overview: Use bearer auth token. Base URL is server dependent.</p>
          </TabsContent>
          <TabsContent value="auth" className="card p-4">
            <p>Auth: Send Authorization: Token &lt;token&gt; header in all requests.</p>
          </TabsContent>
          <TabsContent value="endpoints" className="card p-4">
            <ul className="description-list"><dt>GET</dt><dd>/api/valuation/dcf</dd><dt>POST</dt><dd>/api/instruments/bond/price</dd></ul>
          </TabsContent>
          <TabsContent value="samples" className="card p-4">
            <pre>{`curl -X POST /api/instruments/bond/price -d '{"face":1000,...}'`}</pre>
          </TabsContent>
        </Tabs>
      </section>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="stack">
          <div className="badge info">Try Now</div>
          <div><code>{selected.path}</code></div>
          <p className="price-fx">Example requests use demo payloads; configure your auth headers to test live.</p>
          <div className="form-actions">
            <button className="btn btn-primary" onClick={() => setOpen(false)}>Close</button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
