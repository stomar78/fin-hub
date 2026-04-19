"use client";
import React from "react";

export default function ContactPage() {
  return (
    <main className="container section space-y-6">
      <div className="maxw-hero titlebar-blue">
        <h1 className="text-xl font-raleway font-bold">Contact / Support</h1>
      </div>

      <p className="section__subtitle maxw-hero">Reach our valuation team for support and inquiries.</p>

      <section className="maxw-hero grid md:grid-cols-2 gap-6">
        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
          <div className="field">
            <label className="label">Name</label>
            <input className="input" placeholder="Your name" />
          </div>
          <div className="field">
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="you@example.com" />
          </div>
          <div className="field">
            <label className="label">Message</label>
            <textarea className="textarea" rows={5} placeholder="How can we help?" />
          </div>
          <div className="form-actions">
            <button className="btn btn-primary hover-bloom" type="submit">Send</button>
          </div>
        </form>

        <div className="quick-contacts">
          <div className="card">
            <div className="card__body">
              <div className="badge info">Email</div>
              <p className="mt-2"><a className="nav-link" href="mailto:support@epiidosis.com">support@epiidosis.com</a></p>
            </div>
          </div>
          <div className="card">
            <div className="card__body">
              <div className="badge success">Response SLA</div>
              <p className="mt-2">We typically respond within 1 business day.</p>
            </div>
          </div>
          <div className="card">
            <div className="card__body">
              <div className="badge">Docs</div>
              <p className="mt-2"><a className="nav-link" href="/api/docs">API Documentation</a></p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
