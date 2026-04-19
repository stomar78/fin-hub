# EGF Free Tools Hub — Project Documentation

## 1. Vision & Scope
- **Objective:** Deliver a public-facing hub on `tools.epiidosisglobalfin.com` that offers free finance assessment tools for UAE businesses, capturing qualified leads for advisory follow-up.
- **Key Outcomes:**
  - Provide valuable calculators that reflect UAE banking and private credit practices.
  - Centralise lead capture with structured assessments and automated outreach from `ktomar@epiidosisglobalfin.com`.
  - Maintain brand fidelity through the mandated CSS and Tailwind configuration in the project. See @global.css.example#1-144 and @taliwind.config.ts.example#1-64.
- **Out of Scope (Phase 1):** Native mobile apps, lender portal, automated credit decisioning, payment processing.

## 2. Stakeholders & Roles
| Role | Responsibility |
| --- | --- |
| **EGF Product Owner** | Approves roadmap, messaging, compliance alignment. |
| **Engineering Lead** | Owns Next.js codebase, API layer, deployments. |
| **Design Lead** | Enforces brand styling using provided CSS rules and Tailwind theme. |
| **AI Automation Lead** | Configures IMAP listener, SES integration, AI reply workflows. |
| **Data & Compliance Officer** | Ensures PII handling, consent, audit retention. |

## 3. High-Level System Overview
- **Frontend:** Next.js 14 App Router + TypeScript.
- **Styling:** Tailwind CSS with global overrides from `global.css.example` and custom theme tokens in `taliwind.config.ts.example`.
- **Backend:** Next.js API routes for lead intake, assessment generation, and email triggers.
- **Database:** PostgreSQL (preferred) or compatible SQL store with JSON support for payloads.
- **Email & AI:** AWS SES (SMTP) for outbound mail, IMAP inbox for inbound, AI worker (n8n or custom) for context-aware responses.
- **Hosting:** Same server as primary domain, reverse proxied subdomain with TLS.

## 4. Frontend Architecture
```
app/
  layout.tsx
  free-tools/page.tsx            # Landing page
  tools/
    [tool-slug]/page.tsx         # Individual tool forms
  api/
    leads/route.ts               # Lead intake endpoint
components/
  layout/Header.tsx
  layout/Footer.tsx
  ui/Card.tsx
  ui/PrimaryButton.tsx
  ui/SecondaryButton.tsx
lib/
  assessment.ts
  lead-mailer.ts
  db.ts
```
- **Routing:** Each tool uses `/tools/<slug>`. Landing page `/free-tools` features hero, workflow explanation, and tool grid.
- **Component Guidelines:**
  - Reuse `.card`, `.btn-primary`, `.btn-secondary`, `.chip`, `.app-header`, and `.app-footer` classes from the mandated stylesheet for consistent brand styling (see @global.css.example#27-140).
  - Use Tailwind utilities for layout and spacing, leveraging extended theme tokens (colors, fonts, radii, shadows, animations) described in @taliwind.config.ts.example#9-59.
- **Client vs Server Components:**
  - Landing page and tool descriptions: server components for SEO.
  - Form pages: client components to manage state and fetch submission.
- **Accessibility:** Follow focus states defined by `.btn-*` classes and Tailwind shadows to ensure keyboard navigation support.

## 5. Styling & Brand Compliance
- **Global CSS (`global.css.example`):** Defines gradients, card styling, button states, chips, app header/footer elevation, and animated card title accent (see @global.css.example#16-138).
- **Tailwind Config (`taliwind.config.ts.example`):** Extends colors (brand palette), fonts (Inter & Playfair Display), border radii, shadows, spacing, transition timing, and `fade-in-up` animation (see @taliwind.config.ts.example#9-59).
- **Usage Requirements:**
  - Import CSS in `app/globals.css` exactly as provided to inherit brand theming.
  - Limit additional custom styles to exceptional cases; default to Tailwind utilities and defined classes.
  - Ensure hero typography leverages `font-display` (Playfair Display) and body copy uses `font-sans` (Inter).

## 6. Backend & Data Layer
- **Lead Intake API (`POST /api/leads`):**
  - Validates payload (required: `toolSlug`, `fullName`, `email`).
  - Calls generator to produce structured assessment summary (tool-specific).
  - Persists lead + assessment JSON to `leads` table.
  - Triggers outbound emails via `sendLeadEmailsAndAssessment`.
  - Returns JSON `{ ok: true }` on success.
- **Assessment Helpers (`lib/assessment.ts`):** Provide deterministic scoring (e.g., DSCR, LTV bands) before any AI refinement.
- **Database Client (`lib/db.ts`):** Use Prisma or pg driver; ensure connection pooling for serverless or edge deployments is handled if applicable.

### 6.1 Data Model
| Column | Type | Notes |
| --- | --- | --- |
| `id` | UUID | Primary key |
| `tool_slug` | VARCHAR | E.g., `line-of-credit`, `mortgage-finance` |
| `full_name` | VARCHAR | Required |
| `company_name` | VARCHAR | Required |
| `email` | VARCHAR | Required |
| `phone` | VARCHAR | Optional |
| `country` | VARCHAR | Optional |
| `payload` | JSONB | Raw form submission |
| `assessment` | JSONB | Generated summary |
| `status` | VARCHAR | Workflow state (`new`, `in_review`, `contacted`, `closed`) |
| `thread_id` | VARCHAR | Email thread reference |
| `created_at` / `updated_at` | TIMESTAMP | Auto-managed |

### 6.2 Persistence Implementation
- **ORM:** Prisma Client with PostgreSQL datasource defined in `prisma/schema.prisma`.
- **Client Setup:** Singleton Prisma client exported from `lib/db.ts` to avoid multiple instances in development.
- **Migrations:**
  1. Set `DATABASE_URL` in `.env` (see `.env.example`).
  2. Run `npm run prisma:migrate` for schema changes (uses `prisma migrate dev`).
  3. Run `npm run prisma:generate` if Prisma schema updates without migrations.
- **Runtime Usage:** API routes (e.g., `/api/leads`) call `prisma.lead.create` to persist submissions, storing both raw payload JSON and generated assessment.

### 6.3 Assessment Engine
- **Module:** `lib/assessment.ts`.
- **Purpose:** Produces structured summaries (`headline`, indicative ranges, ratios, flags) tailored to each tool category.
- **Logic Highlights:**
  - Normalises currency inputs (handles numeric or formatted strings) and computes indicative ranges using market heuristics.
  - Adds key signals (e.g., sector, DSCR, tenor) and risk notes (e.g., leverage limits, concentration flags).
  - Provides next-step checklist for advisors; output feeds both client acknowledgement and internal alert emails.

### 6.4 Admin Lead Management API
- **Endpoints:**
  - `GET /api/admin/leads`: Returns latest leads (default 50, configurable up to 100) optionally filtered by status.
  - `PATCH /api/admin/leads`: Updates workflow `status` and/or `threadId` for a specific lead record.
- **Security:** Requires `x-api-key` header matching `ADMIN_API_KEY` environment variable (set via infrastructure secret manager).
- **Usage Notes:**
  - Rejects invalid status values (must be one of `NEW | IN_REVIEW | CONTACTED | CLOSED`).
  - Only allows updates to `status` and `threadId` to keep surface area minimal.
  - Intended for back-office tooling (CLI, admin dashboard, automation workers).

### 6.5 Lead Submission Validation & Error Handling
- **Schema:** Implemented with Zod (`lib/lead-validation.ts`) to enforce required fields (`toolSlug`, `fullName`, `companyName`, `email`) for all tools while permitting tool-specific payload fields via `.passthrough()`.
- **Usage:** `/api/leads` parses request JSON, validates using `validateLeadSubmission`, trims strings, and returns structured 400 responses when validation fails (`{ error, details: [{ field, message }] }`).
- **Benefits:** Hardens API against malformed requests, standardises error handling for frontend forms, and ensures clean data reaches Prisma persistence and assessment engine.

## 7. Email & AI Automation
- **Outbound:**
  - Uses AWS SES SMTP credentials stored in environment variables.
  - Implemented via Nodemailer transport in `lib/lead-mailer.ts`, configured with SES SMTP host/port, TLS requirements, and credentials drawn from environment variables.
  - Sends two messages per lead: (1) prospect acknowledgement with assessment highlights, (2) internal alert to `ktomar@...` (or `INTERNAL_ALERT_EMAIL`) with detailed payload.
  - Include consistent `Message-ID` and `References` headers to preserve threading.
- **Inbound:**
  - IMAP listener (n8n workflow or custom Node/Python service) monitors `ktomar@epiidosisglobalfin.com` inbox.
  - Each new inbound email is matched to a `lead` via subject token or custom header.
  - Worker retrieves full thread history, lead payload, and assessment; constructs AI prompt.
  - AI generates draft reply with advisory tone; response sent via SES, updating lead status to `contacted`.
- **Fallbacks:** Human override interface (future) for manual responses when AI confidence is low.

## 8. Hosting & Deployment
- **Environment:** Same server cluster as primary site; Next.js app served behind reverse proxy with SSL.
- **Process Management:** Use `pm2` or `systemd` to run production build (`next start`) on fixed port (e.g., 3100).
- **Deployment Pipeline:**
  1. Build artifacts (`next build`).
  2. Run tests/lint checks.
  3. Sync build output to server.
  4. Restart process with zero downtime (`pm2 reload` or `systemctl restart`).
- **DNS:** Create A/ALIAS record for `tools.epiidosisglobalfin.com` pointing to server IP; provision TLS certificate (e.g., Let’s Encrypt).

## 9. Environment Variables
Maintain `.env` at runtime; rotate secrets via infrastructure tooling. Reference `.env.example` for placeholder values.
````
NEXT_PUBLIC_BASE_URL=https://tools.epiidosisglobalfin.com
DATABASE_URL=postgresql://user:pass@host:5432/egf_tools
AWS_SES_SMTP_HOST=email-smtp.eu-west-1.amazonaws.com
AWS_SES_SMTP_PORT=587
AWS_SES_SMTP_USER=...
AWS_SES_SMTP_PASS=...
IMAP_HOST=mail.epiidosisglobalfin.com
IMAP_PORT=993
IMAP_USERNAME=ktomar@epiidosisglobalfin.com
IMAP_PASSWORD=...
OPENAI_API_KEY=...
````
- **Important:** `.env.example` intentionally uses non-sensitive placeholders—replace these with environment-specific values via your secrets manager (AWS SSM, Doppler, Vault, etc.) before deploying.
- Never commit `.env`; store `.env.example` with non-sensitive defaults to guide configuration.
- For production, inject secrets using infrastructure secrets manager (AWS SSM, Vault, etc.).

## 10. Security & Compliance
- **PII Handling:** Encrypt sensitive columns (phone, assessment) where feasible; ensure DB backups are encrypted.
- **Consent:** Include consent statement on each form; only share submissions with lenders after explicit approval.
- **Access Control:** Future admin dashboard must require MFA and role-based permissions.
- **Logging:** Store minimal metadata; redact PII from logs. Adopt retention policy aligned with UAE data regulations.

## 11. User Journeys & Flows
1. **Landing Page:** Visitor reads value proposition, explores tool cards, clicks CTA.
2. **Tool Intake:** User completes short form (3–7 minutes) tailored to financing product.
3. **Submission:** Backend stores lead, generates assessment, triggers emails.
4. **Follow-up:** AI-assisted advisor replies from `ktomar@...`, referencing assessment and conversation history.
5. **Conversion:** Prospect schedules consultation; status updated manually or via CRM integration.

## 12. Roadmap Snapshot
| Phase | Focus | Key Deliverables |
| --- | --- | --- |
| **Phase 1** | Core Hub Launch | Landing page, five primary tools, lead API, email triggers, baseline assessments. |
| **Phase 2** | Automation & Analytics | IMAP AI responder, CRM sync, enhanced analytics dashboard. |
| **Phase 3** | Expanded Tools | Additional calculators (compliance, valuation), personalised dashboards, multilingual support. |

## 13. References & Artifacts
- **Styling References:** `global.css.example`, `taliwind.config.ts.example` (must be mirrored verbatim in the live app).
- **Environment Template:** `.env.example` — ensure production credentials are injected securely.
- **Related Docs:** Project planner and progress tracker maintained alongside this document for day-to-day execution.

## 14. UI/UX Design System Specification
- **Design Principles:**
  - Clarity, trust, and advisory tone; avoid heavy sales language.
  - Use whitespace and soft shadows (`.card`, Tailwind `shadow-card`) to create depth without clutter.
  - Animations limited to `fade-in-up` and card underline animation for subtle polish.
- **Layout Grid:**
  - Desktop: 12-column CSS grid via Tailwind (`grid-cols-12`) with max width `max-w-5xl` (80rem).
  - Tablet: 8-column responsive breakpoints (`md:` modifiers) collapsing to stacked layout.
  - Mobile: Single column flow with generous spacing (`space-y-5`).
- **Typography:**
  - Headings: `font-display` (Playfair Display) with weights 600–700 per hero requirements.
  - Body copy: `font-sans` (Inter) with 400–600 weights for readability.
  - Meta text / chips: uppercase or small caps with tracking (`tracking-[0.18em]`).
- **Color Palette Usage:**
  - Backgrounds: gradient defined in global stylesheet (`html, body` rule). @global.css.example#16-20
  - Primary actions: `.btn-primary` gradient (deep blue) for main CTAs; `.btn-secondary` green for supportive CTAs.
  - Accents: `.chip` for category tags; `var(--epi-slate)` for descriptive text.
- **Components Inventory:**
  - **App Header/Footer:** Sticky header with blur/backdrop, matching `.app-header`, `.app-footer` definitions.
  - **Cards:** `.card` styling with interactive hover states; use for tool summaries, process explainer, success/error states.
  - **Buttons:** `.btn-primary`, `.btn-secondary` classes combined with Tailwind utilities for padding and rounding.
  - **Chips:** Highlight categories, benefits, completion time.
  - **Form Inputs:** Tailwind `rounded-button` radius from theme (`button: '12px'`) with focus shadow `shadow-focus-dark`.
- **Iconography:** Minimal; use simple Unicode arrows (→, ↗) or inline SVG icons with consistent stroke weight.
- **Accessibility Considerations:**
  - Minimum contrast ratio 4.5:1; avoid light text on mist background without emphasis.
  - Provide descriptive labels and helper text for each form field.
  - Ensure focus states mimic `.btn-primary:focus-visible` pattern for all interactive elements.

## 15. Landing Page Design Specification
- **URL:** `/free-tools`
- **Structure Overview:**
  1. **Hero Section** (full-width card):
     - Left column: headline (`h1`), supporting paragraph, CTA buttons, chips.
     - Right column: hero card summarising benefits or key stats.
  2. **Process Explainer Card:** `.card` with ordered steps 1–4.
  3. **Tool Grid Section:** 2-column responsive card grid featuring each tool with badges, completion time, outcomes, CTA.
  4. **Credibility Footer:** Licensing info, infrastructure reassurance, contact mention.
- **Wireframe (Desktop approximation):**
  ```
  -----------------------------------------------------------
  | Header (logo + tagline + chips)                        |
  -----------------------------------------------------------
  | Hero Text (col 1)       | How it works card (col 2)    |
  -----------------------------------------------------------
  | Tool Card 1 | Tool Card 2 |
  | Tool Card 3 | Tool Card 4 |
  | Tool Card 5 | (Future slots) |
  -----------------------------------------------------------
  | Footer (disclaimer + infra note)                      |
  -----------------------------------------------------------
  ```
- **Copy Blocks:**
  - **Headline:** “Run real credit & finance checks before you talk to a bank.”
  - **Supporting paragraph:** Outline free tools, advisory follow-up, mention `ktomar@epiidosisglobalfin.com` as contact email.
  - **CTA Labels:** Primary `Explore free tools`, Secondary `Open tool` per card.
  - **Badges:** “UAE Businesses • Founders • CFOs” meta copy, chips for product categories.
- **Interactions:**
  - Smooth scroll to tool grid on CTA click (`href="#tools-grid"`).
  - Hover state on tool cards increasing shadow to `shadow-card-hover` and slight translate.
  - Responsive collapse: hero image/card moves below text on screens < 768px.

## 16. Tool Page Template & Design Requirements
- **URL Pattern:** `/tools/<slug>` (e.g., `/tools/line-of-credit`).
- **Page Sections:**
  1. **Intro Card:** `.card` containing breadcrumb chips, tool title, descriptive paragraph, compliance note.
  2. **Status Alerts:** Inline success (`bg-emerald-50`) or error (`bg-red-50`) banners displayed conditionally after submission.
  3. **Form Sections:** Grouped inputs using Tailwind grid (`md:grid-cols-2` or `md:grid-cols-3`) with consistent spacing.
  4. **Consent & Submit Row:** CTA button + microcopy for consent/privacy.
- **Form UX Guidelines:**
  - Use descriptive placeholders (AED amounts, bank names, etc.).
  - Provide default values where appropriate (e.g., country = United Arab Emirates).
  - Validate client-side for required fields before submission.
  - Disable submit button and show “Submitting…” state during fetch.
- **Accessibility:**
  - Each `input`/`textarea` accompanied by `<label>`.
  - Use `aria-live="polite"` for status alerts.
  - All form controls reachable via keyboard; focus outline uses `shadow-focus-dark`.
- **Form Submission Flow:**
  - On success: clear form, display success alert, optionally suggest next steps (download brochure, schedule call).
  - On error: show inline error alert with guidance to retry.
- **Responsive Behaviour:** Stacked layout on mobile; maintain spacing between groups to avoid clutter.

## 17. Tool-Specific Content & User Flows
Each tool page follows the template above with custom copy, required fields, and assessment logic.

### 17.1 Line of Credit Eligibility Tool
- **Slug:** `line-of-credit`
- **Target Persona:** SMEs or mid-market companies seeking working capital lines/overdrafts.
- **Hero Content:**
  - Subtitle chip: “Free Tool • Working Capital”.
  - Title: “Line of Credit Eligibility Check”.
  - Description: Emphasise assessment based on UAE banks/private credit, mention follow-up from `ktomar@...`.
- **Form Sections & Fields:**
  1. **Contact Information:** full name, company name, work email, phone/WhatsApp.
  2. **Business Metrics:** annual turnover (AED), country (default UAE), sector.
  3. **Facility Details:** requested limit, existing bank relationship, existing facilities (select), facility usage description (textarea).
- **Assessment Logic Outline:**
  - Compute turnover-based eligibility band (e.g., 15–25% of turnover).
  - Determine risk notes based on existing facilities selection.
  - Suggest next steps: provide bank statements, financials, credit bureau report.
- **User Flow:**
  1. User reads intro, confirms tool relevance via chip/description.
  2. Completes form (~3 minutes) with validation hints (numeric for amounts).
  3. Submits; success alert displayed.
  4. Receives email summarising potential credit line band and DSCR checklist.
  5. Follow-up from AI advisor referencing response and recommending documentation.
- **Public Page Content:** Provide bullet list of what the output includes (eligibility band, DSCR estimate, bank requirements) below intro paragraph.

### 17.2 Mortgage & Real Estate Finance Readiness Tool
- **Slug:** `mortgage-finance`
- **Target Persona:** Property investors/developers needing commercial mortgages or refinancing.
- **Hero Content:**
  - Subtitle chip: “Free Tool • Real Estate Finance”.
  - Title: “Mortgage & Real Estate Finance Readiness”.
  - Description: Outline LTV/DSCR assessment, escrow coordination, mention contact email.
- **Form Sections & Fields:**
  1. **Contact Info:** same structure as Line of Credit.
  2. **Asset Details:** property type (select), estimated value (AED), location (emirate), rental income or projected NOI.
  3. **Funding Objectives:** desired LTV %, purpose (purchase/refinance/development), exit strategy (textarea).
  4. **Current Exposure:** existing mortgage provider, outstanding balance, repayment history notes.
- **Assessment Logic:**
  - Calculate LTV vs target; flag if >80%.
  - Estimate DSCR using NOI vs assumed interest & amortisation.
  - Provide readiness notes (valuation required, escrow setup, legal documentation).
- **User Flow:**
  1. User selects property type, enters valuation/income data.
  2. Submission triggers readiness rating (Ready / Needs Preparation / Additional Equity Required).
  3. Email includes recommended lenders (banks/private funds) and checklist (valuation report, title deed, lease agreements).
- **Public Page Content:** Add bullet points for outputs: LTV band, DSCR summary, required documents, timeline estimate.

### 17.3 Bill Discounting / Receivables Estimator
- **Slug:** `bill-discounting`
- **Target Persona:** Trading companies, exporters with invoice financing needs.
- **Hero Content:**
  - Chip: “Free Tool • Receivables Finance”.
  - Title: “Bill Discounting / Receivables Estimator”.
  - Description: Emphasise cash unlock from invoices, private factoring options.
- **Form Sections & Fields:**
  1. **Contact Info:** standard fields.
  2. **Invoice Profile:** average invoice size, monthly invoice volume, buyer markets (dropdown/multi-select), payment terms (days).
  3. **Credit Profile:** % invoices overdue >30 days, existing factoring arrangements, buyer credit ratings (if known).
  4. **Use Case:** how funds will be used, key trading partners.
- **Assessment Logic:**
  - Calculate indicative limit (70–80% of monthly invoice volume).
  - Estimate discount fee range based on payment terms and overdue ratio.
  - Flag risks (high overdue %, concentrated buyers).
- **User Flow:**
  1. User understands outputs (limit + cost range) from intro card.
  2. Completes invoice-specific inputs with tooltips clarifying terms.
  3. On submission receives assessment summarising limit, cost, recommended financiers, documentation checklist (invoices, contracts, trade licenses).
- **Public Page Content:** Provide quick FAQ: “What details do we need?” “Will this affect existing banking lines?” etc.

### 17.4 Trade & LC Cost Estimator
- **Slug:** `trade-finance`
- **Target Persona:** Import/export firms needing LCs, SBLCs, guarantees.
- **Hero Content:**
  - Chip: “Free Tool • Trade Finance”.
  - Title: “Trade & LC Cost Estimator”.
  - Description: Explain modelling of LC/SBLC fees, collateral expectations.
- **Form Sections & Fields:**
  1. **Contact Info:** standard.
  2. **Transaction Details:** LC type (sight/usance/standby), amount (AED/USD), tenor days, beneficiary country.
  3. **Collateral & Security:** available collateral (cash margin %, property, inventory), bank relationship status.
  4. **Trade Cycle:** number of LCs annually, average shipment value, compliance considerations (sanctioned countries, dual-use goods).
- **Assessment Logic:**
  - Estimate fee range (issuance, confirmation, negotiation) based on amount/tenor.
  - Determine likely collateral requirements (cash margin, security).
  - Suggest recommended banks or private trade financiers.
- **User Flow:**
  1. User inputs transaction specifics.
  2. Assessment summarises expected costs, required collateral, timeline to issuance.
  3. Email follow-up includes sample LC text considerations and list of documents (commercial invoice, packing list, CO, etc.).
- **Public Page Content:** Outline difference between LC types, emphasise compliance support, highlight EGF’s escrow and documentation role.

### 17.5 Project Finance Bankability Scan
- **Slug:** `project-finance`
- **Target Persona:** Developers, infrastructure sponsors, large capex projects.
- **Hero Content:**
  - Chip: “Free Tool • Project Finance”.
  - Title: “Project Finance Bankability Scan”.
  - Description: Evaluate limited recourse financing potential, DSCR, equity requirements.
- **Form Sections & Fields:**
  1. **Sponsor Info:** sponsor name, track record summary.
  2. **Project Snapshot:** total project cost (capex), committed equity (%), sector (renewable, real estate, infrastructure), location.
  3. **Financials:** projected revenue, operating cost, repayment tenor, DSCR target.
  4. **Contracts & Support:** status of offtake/PPA, EPC contract, government guarantees, permits.
  5. **Timeline & Needs:** financial close target date, required debt amount, currency exposure.
- **Assessment Logic:**
  - Determine bankability score using equity committed, DSCR, contract readiness.
  - Provide next-step recommendations (financial model refinement, term sheet preparation, syndication strategy).
  - Highlight potential funding channels (banks, DFIs, private credit SPVs).
- **User Flow:**
  1. User reviews output expectations (bankability score + next steps).
  2. Completes multi-section form (could extend to multi-step wizard in future phases).
  3. On submission receives assessment summary with readiness level (Ready / Needs Equity / Contracts Pending) and documentation checklist.
- **Public Page Content:** Include timeline expectations (typical 12–18 month cycle), emphasise EGF’s role as arranger, mention confidentiality of project data.

## 18. Future Enhancements for Documentation
- Prepare design mockups (Figma) mapping to this specification for dev handoff.
- Extend documentation with API contracts (request/response schemas) as they stabilise.
- Add analytics event taxonomy (e.g., `tool_open`, `lead_submitted`, `email_sent`).
- Document AI prompt templates and fallback handling once copy is approved.

## 19. Public Page Copy Deck
This section provides draft-ready copy for all public pages. Content is organised by section and includes notes for tone and formatting.

### 19.1 Landing Page (`/free-tools`)

#### Hero Section
- **Eyebrow Copy:** “UAE Businesses • Founders • CFOs”
- **Headline:** “Run real credit & finance checks before you talk to a bank.”
- **Subheadline:** “Use Epiidosis Global Finance’s free tools to understand your eligibility for working capital, mortgage, trade and project funding. We deliver a structured assessment and follow up from `ktomar@epiidosisglobalfin.com` only if you invite us to.”
- **CTA (Primary):** “Explore free tools”
- **CTA (Secondary, optional):** “Talk to an advisor” → mailto: link in future iteration.
- **Supporting Chips:** “100% Free”, “No obligation”, “Secure & confidential”.
- **Hero Highlights (right column card):**
  - Title: “What you get instantly”
  - Bullet points:
    1. “Indicative eligibility band for your financing need.”
    2. “Checklist of documents lenders will request in the UAE.”
    3. “Tailored next steps from our advisory desk within 1 business day.”

#### “How It Works” Card
- **Section Title:** “How it works”
- **Steps:**
  1. “Pick the tool that matches your requirement — line of credit, mortgage, receivables, trade, or project finance.”
  2. “Fill a concise form (3–7 minutes). We only ask for details lenders evaluate first.”
  3. “We produce an internal assessment and notify `ktomar@epiidosisglobalfin.com` instantly.”
  4. “Our advisor — assisted by AI — replies with tailored bank and private credit options. You stay in control throughout.”
- **Assurance Note:** “We never share your information with lenders without your consent. You can stop the conversation anytime.”

#### Tools Grid Intro
- **Section Heading:** “Free tools for UAE businesses”
- **Paragraph:** “Run structured assessments across working capital, real estate, receivables, trade and project finance. Each tool produces an eligibility summary, risk notes, and lender expectations specific to the UAE market.”

#### Tool Card Copy
Provide consistent format for all tool cards:

1. **Line of Credit Eligibility**
   - Tagline: “Check how much working capital you could access.”
   - Badge: “Working Capital”
   - Time: “3–4 minutes”
   - Outcome: “Instant eligibility band + DSCR snapshot.”
   - CTA: “Open tool”

2. **Mortgage & Real Estate Finance Readiness**
   - Tagline: “Assess LTV, DSCR and refinance options for your property.”
   - Badge: “Real Estate Finance”
   - Time: “4–5 minutes”
   - Outcome: “Indicative LTV band + bankability score.”

3. **Bill Discounting / Receivables Estimator**
   - Tagline: “Estimate how much cash you can unlock from invoices.”
   - Badge: “Receivables Finance”
   - Time: “3 minutes”
   - Outcome: “Indicative limit + discount cost range.”

4. **Trade & LC Cost Estimator**
   - Tagline: “Model LC/SBLC costs and collateral expectations.”
   - Badge: “Trade Finance”
   - Time: “4 minutes”
   - Outcome: “Cost range + security expectations.”

5. **Project Finance Bankability Scan**
   - Tagline: “Test if your project fits bank / private credit criteria.”
   - Badge: “Project Finance”
   - Time: “6–7 minutes”
   - Outcome: “Bankability score + next-step recommendations.”

#### Footer Copy
- “© {{YEAR}} Epiidosis Global Finance LLC-FZ · Advisory only, no public deposit taking.”
- “Licensed in the UAE · Powered by secure AWS infrastructure.”
- Microcopy: “All assessments are indicative and for advisory purposes. Final financing decisions remain with partner institutions.”

### 19.2 Tool Page Copy Template
Each tool page follows the same structure with customised text.

#### Introductory Card
- **Subtitle Chip:** “Free Tool • [Category]”
- **Heading:** Specific to tool (see below).
- **Intro Paragraph:** 2–3 sentences clarifying purpose, confidentiality, and follow-up from `ktomar@epiidosisglobalfin.com`.
- **Output Summary List:** 3 bullet points describing what the user receives (eligibility band, cost estimate, next steps).
- **Compliance Note:** “We assess your details internally. Data remains confidential and is only shared with lenders after you approve it.”

#### Success & Error Messages
- **Success Copy:** “Thank you — your details have been received. We’ll review your submission and respond from `ktomar@epiidosisglobalfin.com` with tailored options.”
- **Error Copy:** “Something went wrong while submitting. Please try once more or email `ktomar@epiidosisglobalfin.com`.”

#### Consent Microcopy
- “By submitting, you consent to Epiidosis Global Finance contacting you about this enquiry. We share data with lenders only after your explicit approval.”

### 19.3 Tool-Specific Copy

#### 19.3.1 Line of Credit Eligibility (`/tools/line-of-credit`)
- **Heading:** “Line of Credit Eligibility Check”
- **Intro Paragraph:** “Find out how much revolving working capital your company could access from UAE banks and private credit funds. Share a few headline numbers and we’ll benchmark you against current lending appetites.”
- **Output Bullets:**
  - “Indicative credit line range (AED) based on turnover and sector.”
  - “Quick DSCR and covenant health snapshot.”
  - “Checklist of what banks will request (financials, statements, trade licenses).”
- **Form Helper Text Examples:**
  - Annual turnover field placeholder: “e.g., 12,000,000 (AED)”
  - Requested limit placeholder: “e.g., 2,500,000 (AED)”
  - Facility usage textarea hint: “Inventory buildup, supplier payments, contract mobilization…”
- **After-Submission Email Highlights:** Mention that the follow-up email will include 3 recommended steps and potential lenders.

#### 19.3.2 Mortgage & Real Estate Finance Readiness (`/tools/mortgage-finance`)
- **Heading:** “Mortgage & Real Estate Finance Readiness”
- **Intro Paragraph:** “Plan your next commercial property move with clarity on loan-to-value, DSCR, and refinance options. Tell us about the asset, income profile, and objectives — we’ll respond with lender expectations built for the UAE market.”
- **Output Bullets:**
  - “LTV and DSCR readiness rating (Ready / Needs Preparation / Additional Equity).”
  - “Valuation & legal document checklist for banks and private lenders.”
  - “Timeline guidance for appraisal, approval, and disbursement.”
- **Form Helper Text Examples:**
  - Property type select labels: “Office, Warehouse, Retail, Hospitality, Mixed-use, Land Development.”
  - Estimated value placeholder: “e.g., 18,500,000 (AED).”
  - Exit strategy textarea hint: “Hold for rental income, refinance after completion, sale upon stabilization…”
- **Email Highlights:** “Expect an email summarising your readiness stage and recommended lender mix (Islamic vs conventional, international vs local).”

#### 19.3.3 Bill Discounting / Receivables Estimator (`/tools/bill-discounting`)
- **Heading:** “Bill Discounting / Receivables Estimator”
- **Intro Paragraph:** “Unlock liquidity tied up in invoices. Share your receivables profile and buyer mix so we can estimate discounting limits and cost ranges aligned with UAE factoring partners.”
- **Output Bullets:**
  - “Indicative financing limit based on receivables turnover.”
  - “Estimated discounting cost (% per 30/60/90 days).”
  - “Risk notes on overdue receivables and buyer concentration.”
- **Form Helper Text Examples:**
  - Average invoice size placeholder: “e.g., 85,000 (AED).”
  - Buyer markets multi-select: “UAE, GCC, Asia, Europe, Africa.”
  - Overdue % select: “<10%, 10–25%, 25–40%, >40%.”
- **Email Highlights:** “We’ll summarise financing options (bank vs private factoring) and what documentation to prepare for onboarding.”

#### 19.3.4 Trade & LC Cost Estimator (`/tools/trade-finance`)
- **Heading:** “Trade & LC Cost Estimator”
- **Intro Paragraph:** “Model the fees, collateral, and timelines for issuing Letters of Credit, Standby LCs, or guarantees. Enter your trade specifics and we’ll map bank and private trade finance options.”
- **Output Bullets:**
  - “Expected cost range (issuance, confirmation, negotiation fees).”
  - “Indicative collateral requirement (cash margin %, security).”
  - “Documentation and compliance checklist (UCP 600, AML, sanctioned trade).”
- **Form Helper Text Examples:**
  - LC amount placeholder: “e.g., 750,000 (AED or USD).”
  - Tenor field placeholder: “e.g., 90 days, 120 days.”
  - Collateral input hint: “Available cash margin %, property, inventory liens.”
- **Email Highlights:** “Follow-up includes a timeline for issuance plus guidance on preparing pro forma invoices, packing lists, and shipping documents.”

#### 19.3.5 Project Finance Bankability Scan (`/tools/project-finance`)
- **Heading:** “Project Finance Bankability Scan”
- **Intro Paragraph:** “Evaluate whether your project qualifies for limited recourse financing. Describe the capex, commitments, contracts, and projected cash flows — we’ll respond with a bankability score and next-step advisory plan.”
- **Output Bullets:**
  - “Bankability score (Ready / Needs Equity / Contracts Pending / Feasibility Required).”
  - “Key gaps to close (financial model enhancements, sponsor guarantees, permits).”
  - “Potential funding channels (syndicated banks, DFIs, private credit funds).”
- **Form Helper Text Examples:**
  - Total project cost placeholder: “e.g., 220,000,000 (AED).”
  - Committed equity field: “e.g., 35% of capex committed.”
  - Offtake status select: “Signed PPA, Draft PPA, Negotiating, Not applicable.”
- **Email Highlights:** “We’ll send a structured assessment including recommended next meetings and document preparation for term sheet discussions.”

### 19.4 SEO & Metadata Guidelines
- **Title Tags:**
  - Landing: “Free Finance Tools for UAE Businesses | Epiidosis Global Finance”
  - Line of Credit Tool: “Line of Credit Eligibility Tool – UAE Working Capital”
  - Mortgage Tool: “Commercial Mortgage Readiness – UAE Finance Tool”
  - Bill Discounting Tool: “Invoice Discounting Estimator – UAE Receivables”
  - Trade Finance Tool: “Trade & LC Cost Calculator – UAE Import Export”
  - Project Finance Tool: “Project Finance Bankability Scan – UAE”
- **Meta Descriptions (≤160 chars):**
  - Landing: “Assess your financing options with EGF’s free tools. Get instant eligibility insights for credit lines, mortgages, trade, and project finance in the UAE.”
  - Line of Credit: “Estimate your UAE working capital line. See DSCR, eligibility bands, and next steps in minutes.”
  - Mortgage: “Check commercial mortgage readiness with LTV/DSCR guidance tailored to UAE lenders.”
  - Bill Discounting: “Calculate invoice finance limits and costs for UAE trading companies.”
  - Trade Finance: “Model LC and guarantee costs, collateral, and timelines before approaching banks.”
  - Project Finance: “Evaluate project bankability and prepare for limited recourse financing in the UAE.”

