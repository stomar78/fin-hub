# Advanced Modules Design & Content

Records the approved UX, layout, and content for:
- User Login Dashboard (Saved Reports)
- API Marketplace
- Multi-Currency Interface (USD/AED/GBP/INR)
- Partner Portal Dashboard

## User Dashboard
- **Hero**: Welcome headline; notifications/avatar.
- **Saved Reports Table**: ID • Type • Date • Accuracy • Status • Actions (View/Download/Delete).
- **Summary KPIs**: Total Reports • Avg Accuracy • In Progress • Last Downloaded.
- **Charts**: Valuations Over Time (line), Category Distribution (pie).
- **Smart Recommendations**: AI prompts (upgrade, insights).
- **Profile & Preferences**: Name, Org, Preferred Currency, Notifications, Theme.
- **Upgrade Panel**: CTA to Pricing.

## API Marketplace
- **Intro**: Plug & Play Valuation Intelligence; CTA Get API Key • View Docs.
- **API Cards**: /v1/valuation/dcf • /v1/valuation/multiples • /v1/valuation/reports with pricing and Try It.
- **Docs**: Tabs (Overview • Auth • Endpoints • Samples) with JSON examples.
- **Usage Analytics**: Calls, quota, latency, error logs.
- **Billing**: Plans, Stripe checkout, invoice download.
- **DX**: OAuth2 keys, sandbox, Swagger/Redoc.

## Multi-Currency
- **Selector**: USD • AED • GBP • INR; persists to profile/cookie.
- **Conversion**: Backend FX API (Fixer/OpenExchangeRates), hourly cache.
- **UI**: Primary price with secondary converted hints; smooth count-up.
- **Scope**: Pricing page, Dashboard tables, Marketplace prices.

## Partner Portal
- **Hero**: Apply for Partnership CTA.
- **Firm Profile**: Logo, license, country, status.
- **Team Management**: Roles (Admin/Reviewer/Analyst/Viewer).
- **Client Valuations**: Table with actions; sharing/invoicing.
- **White-Label**: Logo, accent color, subpath domain.
- **Revenue Dashboard**: Valuations vs Revenue; payouts in preferred currency.
- **APIs**: /partner/v1/valuation/submit, /partner/v1/report/fetch/{id}.
- **Tiers**: Silver/Gold/Platinum; commission scaling.

## Design Tokens
- currencyHighlight #00E0FF
- dashboardCardGradient linear-gradient(135deg, #0033A0, #00BFFF)
- apiDocsBg #0F172A
- whiteLabelAccent #0096FF
- statusSuccess #16A34A • statusPending #F59E0B • statusError #DC2626

## SEO & Content Notes
- SEO phrases per module captured (valuation partner program UAE, AI valuation API, multi-currency valuation software, etc.).
- Contact remains Epiidosis Global Finance (epiidosisglobalfin.com).
