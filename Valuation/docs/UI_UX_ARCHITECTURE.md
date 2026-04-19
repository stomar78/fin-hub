# Epiidosis Valuation Portal — Design & UI/UX Architecture

- Overview: minimalist fintech, 70% white, royal→sea-blue gradients, Framer Motion.
- Stack: Next.js, Tailwind (future), Lucide, Recharts/Chart.js, Inter/Raleway.

## Public Pages & Sections
- Landing: Hero (animated), About, How It Works, Pricing, CTA, Footer.
- About: Hero, Methodology (DCF, Multiples, QuantLib), Compliance (IVS/IFRS/RICS), Team, CTA.
- Valuation Types: Business, Real Estate, Startup, Asset & Machinery (alternating backgrounds, charts/icons).
- Pricing: Two-tier plans, comparison table, payment/security, FAQ, CTA.
- Reports & Samples: PDF preview, sample download, compliance badges.
- Contact: Form, support details, map, CTA.

## Advanced Modules
- User Dashboard: widgets, charts, saved reports table, preferences, upgrade banner.
- API Marketplace: featured APIs, docs block, usage analytics, billing/subscriptions.
- Multi-Currency: currency selector (USD/AED/GBP/INR), FX-driven conversions.
- Partner Portal: firm profile, team roles, client valuations, white-label, revenue dashboard.

## Motion & Components
- Components: Navbar, Button, Card, SectionHeader, IconSet, Footer, AnimatedBackground.
- Motion: fade/slide-in, hover lift, parallax, gradient shifts.

## Accessibility & SEO
- WCAG 2.1 AA, semantic structure, alt/aria, mobile-first.
- SEO: Titles, meta/OG, structured data (Organization, Product, FAQ), keyword targets.

## Backend Notes
- Link pages to existing APIs, add future endpoints for dashboard data, FX, partners.

## Next Steps
- Wire pages to real data and refine styles with a component library.
- Add SEO metadata helper and per-page Head exports.
- Build navigation to new pages.
