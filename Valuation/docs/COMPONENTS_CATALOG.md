# Epiidosis Valuation Portal — Components Catalog (Global + Local)

Purpose: An exhaustive catalog of UI components for the entire portal, covering present and planned features. Use this document to standardize design, drive reusability, and accelerate development.

Status legend
- P = Planned
- I = Implemented (scaffolded/basic)
- D = Deferred

## 1) Global Layout & Navigation
- AppShell (Header + Main + Footer) [P]
- Navbar (brand, links, CTA) [P]
- MobileNav Drawer (hamburger, slide-in) [P]
- Footer (links, copyright) [I]
- PageContainer (max-width, spacing presets) [P]
- Section (title, subtitle, divider variants) [P]
- Breadcrumbs [P]
- SkipToContent link (accessibility) [P]

## 2) Global Foundations (UI primitives)
- Button (primary, secondary, ghost, destructive, link) [P]
- IconButton [P]
- Badge/Chip (status: success/pending/error) [P]
- Card (elevations, gradient outline) [I]
- Tooltip [P]
- Popover [P]
- Modal/Dialog (sizes, close behaviors) [P]
- Drawer/Sheet [P]
- Tabs [P]
- Accordion [P]
- Alert/Callout (info/warn/error/success) [P]
- Toast/Notification (stacked) [P]
- Progress Bar / Spinner / Skeleton [P]
- Divider (horizontal/vertical) [P]

## 3) Forms & Inputs
- TextField (with label, help, error) [P]
- TextArea [P]
- NumberField (step, min/max) [P]
- Select/Combobox (searchable) [P]
- MultiSelect [P]
- Checkbox / Switch / RadioGroup [P]
- DatePicker / DateRangePicker [P]
- CurrencyInput (prefix, localized) [P]
- FileUpload (drag-and-drop, multiple, validation) [P]
- JSONEditor (monaco-based) [P]
- OTPInput (verification) [P]
- FormStepper (wizard navigation) [P]
- FormActions (Submit/Reset/Cancel group) [P]

## 4) Data Display & Tables
- Table (sortable, paginated, sticky header) [P]
- DataGrid (virtualized, column chooser) [P]
- DescriptionList (key:value) [P]
- KeyMetric (label + value + delta) [P]
- Timeline (activities) [P]
- EmptyState (illustration + CTA) [P]
- JSONViewer (collapsible) [P]

## 5) Feedback & Overlays
- LoadingOverlay [P]
- BlockingLoader (route-level) [P]
- ConfirmDialog [P]
- ErrorBoundary + ErrorPanel [P]

## 6) Charts & Visualization
- LineChart (Valuations over time) [P]
- BarChart (category comps) [P]
- PieChart / DonutChart (distribution) [P]
- AreaChart (ranges) [P]
- Sparkline (compact trend) [P]
- KPI Counter (animated) [P]
- ScenarioChart (sensitivity matrix) [P]

## 7) Media & Preview
- PDFViewer (PDF.js/React-PDF, with toolbar) [P]
- ImageLightbox [P]
- VideoPlayer (hero embeds/tutorials) [P]
- MapEmbed (Google Maps styled) [P]

## 8) SEO & Meta
- PageHead (title, meta, OG, schema) [P]
- FAQSchema (Pricing/Reports) [P]
- OrganizationSchema [P]

## 9) Authentication & Accounts
- LoginForm (email/password) [I]
- RegisterForm (multi-step if company) [P]
- PasswordReset / OTPVerify [P]
- ProfileForm (name, org, currency, notifications) [P]
- SessionGuard (protected routes) [P]

## 10) Landing Page Components
- HeroAnimatedBackground (waves, particles, gradient) [P]
- DualCTA (primary/secondary) [P]
- FeatureCard (IVS/Data/AI) [P]
- HowItWorksSteps (4-step with timeline) [P]
- PricingTeaser (Free vs Vetted) [I]
- CTADeepStrip [P]

## 11) About Page Components
- BannerSplit (text + illustration) [P]
- MethodologyCard (DCF/Multiples/QuantLib) [I]
- StandardsRow (IVS/IFRS/RICS logos) [I]
- TeamGrid (portrait, role, bio) [P]
- TestimonialSlider [P]
- CTAReportLink [P]

## 12) Valuation Types Page Components
- TypesHero (animated gradient) [P]
- BusinessValuationSection (with mini chart) [I]
- RealEstateValuationSection (skyline parallax) [P]
- StartupValuationSection (KPI counter) [P]
- MachineryValuationSection (gear blueprint BG) [P]
- MethodsOverview (DCF/Multiples/NAV cards) [I]
- GlobalCTA [P]

## 13) Pricing Page Components
- PricingHero (overview) [P]
- PlanCard (Free) [I]
- PlanCard (Vetted) [I]
- ComparisonTable [P]
- PaymentSecurityRow (badges/logos) [P]
- FAQAccordion [P]
- PricingCTA [P]

## 14) Reports & Samples Components
- ReportsHero (report mockup + CTAs) [P]
- PDFPreviewEmbed [P]
- ReportComponentCard (Exec Summary/Methodology/Outputs/Compliance) [P]
- ComplianceGlassRow [P]
- AccuracySpectrumChart [P]
- TestimonialsCarousel [P]
- ReportsCTA [P]

## 15) Contact / Support Components
- ContactHero (advisor CTA) [P]
- ContactForm (validated, attachment) [I]
- QuickContactCards (email/phone/location) [P]
- MapSection (with Book Meeting CTA) [P]
- ChatWidget (floating) [P]
- FAQTeaser [P]
- SupportCTA [P]

## 16) Dashboard (Saved Reports) Components
- DashboardHero / Welcome [P]
- SummaryWidgets (total reports, accuracy, in-progress, last downloaded) [P]
- ValuationsOverTimeChart [P]
- CategoryDistributionPie [P]
- SavedReportsTable (id, instrument, created_at, actions) [P]
- SmartRecommendationsBanner [P]
- PreferencesPanel (currency, notifications) [P]

## 17) API Marketplace Components
- MarketplaceHero [I]
- APICard (endpoint, desc, pricing, Try Now) [I]
- TryNowModal (example requests, copy-to-clipboard) [P]
- DocsBlock (tabs: Overview/Auth/Endpoints/Samples) [P]
- UsageAnalyticsPanel (calls/quota/errors) [P]
- BillingSubscriptionCard [P]

## 18) Multi-Currency Components
- CurrencySelector (USD/AED/GBP/INR with flags) [I]
- PriceWithFX (primary + converted) [P]
- FXTicker (periodic updates) [P]
- CurrencyCountUp (animated change) [P]
- FXProvider (context, cache, fallback) [P]

## 19) Partner Portal Components
- PartnerHero [I]
- FirmProfileForm [P]
- TeamManagementTable (roles, invite) [P]
- ClientValuationsTable [P]
- WhiteLabelSettings (logo, colors, domain path) [P]
- RevenueDashboard (charts + payout) [I]
- RequestPayoutDialog [I]
- PartnerTierBadge (Silver/Gold/Platinum) [P]

## 20) Valuation Flows (Wizard) Components
- WizardStepper (4+ steps with autosave) [P]
- CompanyProfileForm (multi-section) [P]
- FinancialUpload (manual + Excel/CSV + OCR) [P]
- AccountingConnect (QuickBooks/Xero/Tally/Odoo) [P]
- DataPreview & Validation (ratios, anomalies) [P]
- InstantValuationSummary (range + confidence + charts) [P]
- UpgradeCTA (Certified Valuation) [P]
- PaymentCheckout (Stripe/PayFort) [P]
- AnalystAssignmentPanel [P]
- CertifiedReportDelivery (download link, request revision) [P]

## 21) Instruments & Analytics Components
- BondPricingForm [I]
- OptionPricingForm [I]
- SwapPricingForm [I]
- ResultsCard (NPV/prices/greeks) [I]
- TermStructureEditor (curve points) [P]
- ScenarioRunner (batches/sensitivities) [P]

## 22) Cases & Reports Management
- CasesList (id, company, status, tier, mid, created) [I]
- CaseDetail (company summary, conclusions) [P]
- ReportLinks (PDF, source refs) [P]
- AuditTrailList [P]

## 23) Providers & Data Integrations
- AlphaQuoteCard (symbol/price/change) [I]
- ProviderStatusBadge [P]
- BackoffNotice (retry-after) [P]
- CacheStaleBanner (SWR) [P]

## 24) Admin/Settings (Future)
- FeatureFlagsPanel [P]
- SecretsManagerForm (env hints) [P]
- RateLimitConfig [P]
- Logging/Observability Panel [P]

## 25) Utilities (Hooks/Context)
- useApi (base URL, headers, error normalization) [P]
- useFX (FX fetch/calc/cache) [P]
- useQuotes (list, paginate, filter) [P]
- useCases (list/detail) [P]
- useAuth (token/session) [P]
- ThemeProvider (light/dark) [P]

## 26) Accessibility & Intl
- VisuallyHidden helper [P]
- FocusRing wrapper [P]
- LangSwitcher (future i18n) [P]

## 27) Content & SEO blocks
- SEOHead (meta/OG/schema presets) [P]
- FAQList (schema-enabled) [P]
- TestimonialCard [P]
- TrustBadgesRow [P]

## 28) File & Document Handling
- FileList (name, size, status) [P]
- UploadProgress (per-file) [P]
- DocViewer (PDF/image toggle) [P]

## 29) Notifications & Messaging
- InAppNotificationList [P]
- EmailTemplatePreview [P]
- SystemStatusBanner [P]

## 30) Error & Empty States
- FourOhFour (not found) [P]
- ServerErrorPanel [P]
- EmptyPlaceholder (page-level) [P]

---

Roadmap linkage (short)
- Immediate: Navbar/Footer, Dashboard SavedReportsTable, API TryNowModal, CurrencySelector wiring, Pricing ComparisonTable + FAQAccordion, Reports PDFPreview.
- Near-term: WizardStepper + Company/Financial forms, AccountingConnect, TermStructureEditor, Partner TeamManagementTable.
- Later: Admin/Settings panels, Observability UI, full i18n.

Notes
- Prefer Tailwind + shadcn/ui for consistency; keep motion via Framer Motion.
- Compose components top-down; expose variants/slots for design tokens.
- Add Storybook in future to visualize and test components.
