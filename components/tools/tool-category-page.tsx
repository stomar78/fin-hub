import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Route } from 'next';

import type { ToolCategorySlug, ToolSlug } from '@/lib/tool-registry';
import { TOOL_CATEGORIES, getToolsByCategory } from '@/lib/tool-registry';

type ToolRoute = Route<`/tools/${ToolSlug}`>;

type ToolCategoryPageProps = {
  slug: ToolCategorySlug;
};

export default function ToolCategoryPage({ slug }: ToolCategoryPageProps) {
  const category = TOOL_CATEGORIES.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  const tools = getToolsByCategory(slug)
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  if (tools.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="page-shell py-12 flex-1 space-y-10">
        <section className="section-bg section-bg--form space-y-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--epi-slate)]">
            Tool Category
          </p>
          <h1 className="card-title font-display text-2xl sm:text-3xl text-[var(--epi-navy)]">
            {category.title}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--epi-slate)] max-w-3xl">{category.description}</p>
        </section>

        <section className="section-bg section-bg--tools space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg text-[var(--epi-navy)]">Tools in this category</h2>
            <Link
              href="/free-tools#tools-grid"
              className="btn-secondary rounded-button px-4 py-2 text-xs font-medium inline-flex items-center gap-1"
            >
              Back to all tools <span aria-hidden>↩</span>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {tools.map((tool) => (
              <div
                key={tool.slug}
                className="card section-shell p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="chip">{tool.badge}</span>
                    <span className="text-[11px] text-[var(--epi-slate)]">⏱ {tool.timeToComplete}</span>
                  </div>
                  <h3 className="card-title font-display text-lg text-[var(--epi-navy)]">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-[var(--epi-slate)]">{tool.tagline}</p>
                  <p className="text-[11px] text-[var(--epi-slate)]">
                    Outcome: <span className="font-medium">{tool.outcome}</span>
                  </p>
                </div>

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
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
