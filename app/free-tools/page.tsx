import Link from 'next/link';
import type { Route } from 'next';
import type { CSSProperties } from 'react';

import { ENABLED_CATEGORY_SLUGS } from '@/lib/enabled-tool-categories';
import { TOOL_CATEGORIES, getToolsByCategory } from '@/lib/tool-registry';
import type { ToolCategory, ToolCategorySlug, ToolSlug } from '@/lib/tool-registry';

type CategoryRoute = Route<`/free-tools/${ToolCategorySlug}`>;
type ToolRoute = Route<`/tools/${ToolSlug}`>;

const enabledCategories: ToolCategory[] = TOOL_CATEGORIES.filter((category) =>
  ENABLED_CATEGORY_SLUGS.includes(category.slug)
);

const categoriesWithTools = enabledCategories.map((category) => {
  const tools = getToolsByCategory(category.slug)
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  return { category, tools };
});

const totalToolCount = categoriesWithTools.reduce((total, { tools }) => total + tools.length, 0);

const heroStats = [
  { value: 'AED 450M+', label: 'Evaluated mandates since 2021' },
  { value: '14 days', label: 'Average lender feedback window' },
  { value: '120+', label: 'Private credit & bank relationships' },
] as const;

const trustSignals = [
  'Dubai free zones',
  'Family offices',
  'Private developers',
  'Hospitality groups',
] as const;

const playbookItems = [
  {
    title: 'For businesses',
    description:
      'Check commercial asset eligibility before talking to banks.',
    points: ['DSCR & LTV snapshot', 'Funding gap guidance', 'Email-ready summary'],
  },
  {
    title: 'For individuals',
    description:
      'Test refinance or purchase scenarios in minutes.',
    points: ['Stress-tested affordability', 'Docs checklist', 'Next-step pointers'],
  },
] as const;

const deliverableHighlights = [
  '3-minute intake covering property value, income, and liabilities.',
  'Instant DSCR & LTV estimate with a pass / improve verdict.',
  'Email summary from ktomar@epiidosisglobalfin.com you can forward to lenders.',
] as const;

const testimonial = {
  quote:
    'Epiidosis reframed our refinancing narrative in days. Their intake and lender-ready outputs let us negotiate three competing term sheets.',
  name: 'Head of Corporate Finance, Dubai family office',
};

const revealStyle = (delay: string): CSSProperties => ({ '--reveal-delay': delay } as CSSProperties);

export default function FreeToolsHubPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="app-header sticky top-0 z-30">
        <div className="page-shell py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[var(--epi-blue)] via-[var(--epi-sky)] to-[var(--epi-lime)] flex items-center justify-center text-xs font-semibold text-white shadow-lg">
              EGF
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--epi-slate)]">
                Epiidosis Global Finance
              </p>
              <p className="text-sm font-medium text-[var(--epi-navy)]">
                Free Credit & Finance Tools Hub
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-xs">
            <span className="chip">100% Free</span>
            <span className="chip">No obligation</span>
            <span className="chip">Secure & confidential</span>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="hero-blob hero-blob--sky" style={{ top: '-160px', left: '-120px', width: '420px', height: '420px' }} />
          <div className="hero-blob hero-blob--lime" style={{ top: '180px', left: '60%', width: '360px', height: '360px' }} />
          <div className="hero-blob hero-blob--navy" style={{ bottom: '-140px', right: '-120px', width: '460px', height: '460px' }} />

          <div className="page-shell pt-24 pb-20 relative">
            <div className="grid gap-14 lg:grid-cols-[1.15fr,0.85fr] items-center">
              <div className="space-y-10 text-white">
                <div className="space-y-5 reveal-up" style={revealStyle('0s')}>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="mini-chip card-hover">
                      <svg viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="9" />
                      </svg>
                      Business & individual tools
                    </span>
                    <span className="mini-chip card-hover">
                      <svg viewBox="0 0 24 24">
                        <path d="M5 12h14M5 12l4-4m-4 4 4 4" />
                      </svg>
                      Eligibility in minutes
                    </span>
                  </div>
                  <h1 className="font-display text-[36px] sm:text-[46px] lg:text-[56px] leading-tight">
                    See if your property deal qualifies before speaking to a lender.
                  </h1>
                  <p className="text-sm sm:text-base text-[rgba(255,255,255,0.78)] max-w-2xl">
                    Answer a short intake, get DSCR & LTV estimates instantly, and receive a summary you can forward to banks.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 items-center reveal-up" style={revealStyle('0.05s')}>
                  <Link
                    href="#tools-grid"
                    className="btn-primary rounded-button px-6 py-3 text-sm font-semibold inline-flex items-center gap-2 transition-transform duration-300 hover:scale-[1.02]"
                  >
                    Launch free tools
                    <span aria-hidden>↗</span>
                  </Link>
                  <Link
                    href="/apply/start"
                    className="inline-flex items-center gap-2 rounded-button border border-[rgba(255,255,255,0.4)] bg-white/10 px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-white/18 hover:border-white/70"
                  >
                    Speak with advisory
                  </Link>
                  <div className="text-[11px] text-[rgba(255,255,255,0.68)]">
                    No credit check. No obligation.
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  {heroStats.map((stat, index) => (
                    <div
                      key={stat.value}
                      className="glass-panel px-6 py-6 text-white space-y-2 reveal-up card-hover"
                      style={revealStyle(`${0.1 + index * 0.05}s`)}
                    >
                      <p className="text-2xl font-semibold stat-glow">{stat.value}</p>
                      <p className="text-[12px] uppercase tracking-[0.24em] text-[rgba(255,255,255,0.82)]">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 text-[11px] text-[rgba(255,255,255,0.82)] reveal-up" style={revealStyle('0.25s')}>
                  {trustSignals.map((signal) => (
                    <span key={signal} className="rounded-full border border-[rgba(255,255,255,0.3)] bg-white/12 px-3 py-1 transition hover:border-white/60 hover:bg-white/20">
                      {signal}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="hero-illustration animate-float hidden lg:block" aria-hidden />
                <div className="glass-panel p-8 space-y-7 reveal-up" style={revealStyle('0.15s')}>
                  <div className="space-y-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[rgba(255,255,255,0.78)]">
                      Snapshot you receive
                    </p>
                    <h2 className="font-display text-2xl text-white">
                      Instant DSCR & LTV verdict with next-step tips.
                    </h2>
                    <p className="text-sm text-[rgba(255,255,255,0.75)]">
                      Results arrive by <span className="font-semibold text-white">ktomar@epiidosisglobalfin.com</span> so you can share them with banks or advisors immediately.
                    </p>
                  </div>
                  <ul className="space-y-3 text-xs text-[rgba(255,255,255,0.85)]">
                    {deliverableHighlights.map((item, index) => (
                      <li key={item} className="flex items-start gap-3 reveal-up" style={revealStyle(`${0.2 + index * 0.05}s`)}>
                        <span className="icon-badge">
                          <svg viewBox="0 0 24 24">
                            <path d="M5 12l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-2xl border border-[rgba(255,255,255,0.25)] bg-white/10 px-4 py-3 text-[11px] text-[rgba(255,255,255,0.88)] card-hover">
                    <strong className="text-white">Need lender introductions?</strong> We only outreach when your deal is data-room ready and sponsor credentials are documented.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="tools-grid" className="page-shell pb-16 space-y-6 reveal-up card-hover" style={revealStyle('0.1s')}>
          <div className="section-bg section-bg--tools space-y-6">
            <div className="space-y-2">
              <h2 className="font-display text-2xl sm:text-3xl text-[var(--epi-navy)]">
                Mortgage & real estate finance tools for UAE businesses
              </h2>
              <p className="text-xs sm:text-sm text-[var(--epi-slate)] max-w-2xl">
                Explore {totalToolCount} free tools focused on commercial property financing, development funding, and refinancing scenarios tailored to UAE banking expectations.
              </p>
            </div>

            <div className="space-y-8">
              {categoriesWithTools.map(({ category, tools }) => (
                <div
                  key={category.slug}
                  className="card section-shell p-6 space-y-5 border border-[rgba(10,37,64,0.08)] card-hover reveal-up"
                  style={revealStyle('0.15s')}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="chip">{tools.length} tools</span>
                        <span className="chip">Mortgage & real estate focus</span>
                      </div>
                      <h3 className="card-title font-display text-xl text-[var(--epi-navy)]">
                        Pick a checklist and run your eligibility check.
                      </h3>
                      <p className="text-xs sm:text-sm text-[var(--epi-slate)] max-w-2xl">
                        Each intake captures the essentials lenders ask first—choose the scenario that fits and get guidance instantly.
                      </p>
                    </div>

                    {(() => {
                      const href = `/free-tools/${category.slug}` as CategoryRoute;

                      return (
                        <Link
                          href={href}
                          className="btn-secondary rounded-button px-4 py-2 text-xs font-medium inline-flex items-center gap-1"
                        >
                          View category <span aria-hidden>→</span>
                        </Link>
                      );
                    })()}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {(() => {
                      const featuredSlug = 'mortgage-finance';
                      const featuredTool =
                        tools.find((tool) => tool.slug === featuredSlug) ?? tools[0];
                      const secondaryTools = tools.filter((tool) => tool.slug !== featuredTool?.slug);

                      return (
                        <>
                          {featuredTool ? (
                            <div
                              key={featuredTool.slug}
                              className="md:col-span-2 rounded-3xl border border-[rgba(10,37,64,0.12)] bg-white p-6 md:p-8 shadow-[0_22px_48px_rgba(8,26,46,0.12)] card-hover reveal-up"
                              style={revealStyle('0.2s')}
                            >
                              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                                <div className="space-y-4 md:max-w-xl">
                                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-[var(--epi-slate)]">
                                    <span className="chip">{featuredTool.badge}</span>
                                    <span className="chip">⏱ {featuredTool.timeToComplete}</span>
                                  </div>
                                  <div className="space-y-2">
                                    <h4 className="font-display text-2xl text-[var(--epi-navy)]">
                                      {featuredTool.name}
                                    </h4>
                                    <p className="text-sm text-[var(--epi-slate)]">
                                      {featuredTool.tagline}
                                    </p>
                                  </div>
                                  <div className="space-y-2 text-[11px] text-[var(--epi-slate)]">
                                    <p>
                                      Outcome:{' '}
                                      <span className="font-semibold text-[var(--epi-navy)]">
                                        {featuredTool.outcome}
                                      </span>
                                    </p>
                                    {featuredTool.highlights?.length ? (
                                      <ul className="list-disc list-inside space-y-1">
                                        {featuredTool.highlights.slice(0, 3).map((highlight) => (
                                          <li key={highlight}>{highlight}</li>
                                        ))}
                                      </ul>
                                    ) : null}
                                  </div>
                                </div>

                                <div className="flex flex-col gap-4 rounded-2xl border border-[rgba(10,37,64,0.1)] bg-[var(--epi-navy)]/98 px-5 py-6 text-white md:max-w-xs">
                                  <div className="space-y-2 text-[12px]">
                                    <p className="uppercase tracking-[0.28em] text-[rgba(255,255,255,0.65)]">
                                      Featured Tool
                                    </p>
                                    <p>
                                      Check DSCR, LTV, and refinancing headroom with a lender-ready
                                      summary.
                                    </p>
                                  </div>
                                  {(() => {
                                    const href = `/tools/${featuredTool.slug}` as ToolRoute;

                                    return (
                                      <Link
                                        href={href}
                                        className="btn-primary rounded-button px-5 py-3 text-sm font-semibold inline-flex items-center justify-center gap-2"
                                      >
                                        Launch assessment <span aria-hidden>↗</span>
                                      </Link>
                                    );
                                  })()}
                                  <p className="text-[11px] text-[rgba(255,255,255,0.78)]">
                                    Results arrive from{' '}
                                    <span className="font-semibold text-white">
                                      ktomar@epiidosisglobalfin.com
                                    </span>{' '}
                                    within minutes.
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : null}

                          {secondaryTools.map((tool, index) => (
                            <div
                              key={tool.slug}
                              className="rounded-2xl border border-[rgba(10,37,64,0.08)] bg-white/95 p-5 shadow-[0_16px_32px_rgba(8,26,46,0.08)] card-hover reveal-up"
                              style={revealStyle(`${0.3 + index * 0.05}s`)}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="chip">{tool.badge}</span>
                                <span className="text-[11px] text-[var(--epi-slate)]">⏱ {tool.timeToComplete}</span>
                              </div>
                              <h4 className="mt-3 font-display text-lg text-[var(--epi-navy)]">{tool.name}</h4>
                              <p className="mt-1 text-xs text-[var(--epi-slate)]">{tool.tagline}</p>
                              <p className="mt-2 text-[11px] text-[var(--epi-slate)]">
                                Outcome: <span className="font-medium">{tool.outcome}</span>
                              </p>
                              <div className="mt-4 flex items-center justify-between gap-3">
                                {(() => {
                                  const href = `/tools/${tool.slug}` as ToolRoute;

                                  return (
                                    <Link
                                      href={href}
                                      className="btn-primary rounded-button px-4 py-2 text-xs font-medium inline-flex items-center gap-1"
                                    >
                                      Open tool <span aria-hidden>→</span>
                                    </Link>
                                  );
                                })()}
                                <span className="text-[10px] text-[var(--epi-slate)]">
                                  Results sent from{' '}
                                  <span className="font-semibold text-[var(--epi-blue)]">
                                    ktomar@epiidosisglobalfin.com
                                  </span>
                                </span>
                              </div>
                            </div>
                          ))}
                        </>
                      );
                    })()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="page-shell pb-20">
          <div className="grid gap-8 lg:grid-cols-[0.95fr,1.05fr] items-start">
            <div className="section-bg section-bg--form space-y-6 relative reveal-up" style={revealStyle('0.1s')}>
              <div className="space-y-4">
                <span className="mini-chip text-[var(--epi-blue)] bg-[rgba(59,164,240,0.12)] border-[rgba(59,164,240,0.35)] text-xs">
                  Advisory methodology
                </span>
                <h2 className="font-display text-2xl sm:text-3xl text-[var(--epi-navy)]">
                  We structure deals exactly the way regional credit committees review them.
                </h2>
                <p className="text-xs sm:text-sm text-[var(--epi-slate)] max-w-xl">
                  From term sheet negotiation to covenant resetting, we build a bankable dossier — combining underwriting models, sponsor narratives, and collateral evidence — so your financing story resonates.
                </p>
              </div>
              <ul className="grid gap-3">
                {deliverableHighlights.map((item, index) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-[rgba(10,37,64,0.08)] bg-white/85 px-4 py-3 shadow-[0_12px_28px_rgba(8,26,46,0.08)] reveal-up card-hover"
                    style={revealStyle(`${0.2 + index * 0.05}s`)}
                  >
                    <span className="icon-badge">
                      <svg viewBox="0 0 24 24">
                        <path d="M12 5v14m7-7H5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="text-xs sm:text-sm text-[var(--epi-slate)]">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2 text-[11px] text-[var(--epi-slate)]">
                {trustSignals.map((signal) => (
                  <span key={signal} className="chip">
                    {signal}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {playbookItems.map((item, index) => (
                <div
                  key={item.title}
                  className="card section-shell p-6 space-y-4 border border-[rgba(10,37,64,0.08)] card-hover reveal-up"
                  style={revealStyle(`${0.15 + index * 0.05}s`)}
                >
                  <div className="icon-badge bg-[rgba(59,164,240,0.16)]">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 5v14m7-7H5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="card-title font-display text-lg text-[var(--epi-navy)]">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-[var(--epi-slate)]">{item.description}</p>
                  <ul className="space-y-2 text-[11px] text-[var(--epi-slate)]">
                    {item.points.map((point) => (
                      <li key={point} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--epi-blue)]" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="page-shell pb-14">
          <div className="cta-panel px-8 py-10 space-y-8 reveal-up" style={revealStyle('0.1s')}>
            <div className="flex flex-wrap gap-6 items-center justify-between">
              <div className="space-y-3 max-w-xl">
                <p className="mini-chip">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 5v14m7-7H5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Borrower testimonials
                </p>
                <h2 className="font-display text-3xl text-white">"Structured, responsive, lender-credible."</h2>
                <p className="testimonial-quote text-sm text-[rgba(255,255,255,0.86)]">
                  {testimonial.quote}
                </p>
                <p className="text-xs uppercase tracking-[0.28em] text-[rgba(255,255,255,0.72)]">{testimonial.name}</p>
              </div>
              <div className="text-sm text-[rgba(255,255,255,0.85)] max-w-sm space-y-4 reveal-up" style={revealStyle('0.2s')}>
                <p>
                  Epiidosis Global Finance orchestrates borrower positioning across UAE lenders and private credit desks — with AI-assisted narrative building, risk packaging, and deal execution discipline.
                </p>
                <div className="flex flex-wrap gap-3 text-[11px]">
                  <span className="mini-chip">
                    <svg viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    No obligation discovery
                  </span>
                  <span className="mini-chip">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 5v14m7-7H5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Confidential intake workspace
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="app-footer mt-auto">
        <div className="page-shell py-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] text-[var(--epi-slate)]">
            &copy; {new Date().getFullYear()} Epiidosis Global Finance LLC-FZ · Advisory only, no public deposit taking.
          </p>
          <div className="flex flex-wrap gap-3 text-[11px] text-[var(--epi-slate)]">
            <span>Licensed in the UAE</span>
            <span className="hidden sm:inline">|</span>
            <span>Powered by secure AWS infrastructure</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
