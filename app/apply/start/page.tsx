import Link from 'next/link';

const checklistItems = [
  'Latest 12-month management accounts with cash flow breakdown',
  'Summary of existing facilities, lenders, limits, and security held',
  'Last three months of bank statements for operating entities',
  'Copy of trade licence or incorporation documents',
  'Projected cash requirements over the next two quarters',
  'Supporting documents for major contracts or purchase orders',
];

const supportItems = [
  'Need guidance on what to upload? An EGF advisor will follow up once you proceed.',
  'Save your application at any time and resume with your email address or application number.',
  'A fee agreement will be issued for e-signature right before final submission.',
];

type StartPageProps = {
  searchParams: {
    email?: string;
    applicationId?: string;
  };
};

export const metadata = {
  title: 'Start application | Epiidosis Global Finance',
  description:
    'Prepare the information you need before continuing with the Epiidosis Global Finance application experience.',
};

export default function ApplicationStartPage({ searchParams }: StartPageProps) {
  const applicantEmail = searchParams.email || 'your registered email';
  const applicationRef = searchParams.applicationId || 'your application reference';

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-16">
        <header className="flex flex-col gap-4 rounded-3xl bg-slate-800/70 p-8 shadow-lg shadow-slate-900/40 backdrop-blur">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">
                Epiidosis Global Finance
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-white">
                Start your application
              </h1>
            </div>
            <div className="rounded-full bg-blue-500/15 px-5 py-2 text-xs font-medium uppercase tracking-[0.2em] text-blue-200 ring-1 ring-blue-500/40">
              Secure workspace
            </div>
          </div>
          <p className="text-base leading-7 text-slate-200">
            We’ve completed your initial assessment. Before you proceed, make sure the following
            information is ready. You can return at any time using{' '}
            <span className="font-semibold text-white">{applicantEmail}</span> or your reference{' '}
            <span className="font-semibold text-white">{applicationRef}</span>.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-[minmax(0,_1fr)_minmax(0,_1fr)]">
          <div className="rounded-3xl bg-slate-800/70 p-8 shadow-lg shadow-slate-900/40 backdrop-blur">
            <h2 className="text-lg font-semibold text-white">What to prepare</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
              {checklistItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-slate-900/40 px-4 py-3 shadow-inner shadow-slate-900/60"
                >
                  <span className="mt-1 inline-flex h-3 w-3 flex-shrink-0 rounded-full bg-emerald-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-3xl bg-gradient-to-br from-blue-700 to-blue-500 p-[1px] shadow-lg shadow-slate-900/30">
              <div className="h-full rounded-[calc(1.5rem-1px)] bg-slate-900/80 p-8 backdrop-blur">
                <h2 className="text-lg font-semibold text-white">When you continue</h2>
                <ul className="mt-4 space-y-4 text-sm leading-6 text-slate-200">
                  {supportItems.map((item) => (
                    <li key={item} className="flex gap-3 rounded-2xl bg-slate-800/60 px-4 py-3">
                      <span className="mt-1 inline-flex h-3 w-3 flex-shrink-0 rounded-full bg-blue-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-800/70 p-8 shadow-lg shadow-slate-900/40 backdrop-blur">
              <h2 className="text-lg font-semibold text-white">Ready to apply?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-200">
                The guided application captures one section at a time, allowing you to save each step and
                return later. If you haven’t received your readiness checklist, our team will send it to
                your inbox shortly after you begin.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={{
                    pathname: '/apply/flow',
                    query: { email: searchParams.email, applicationId: searchParams.applicationId },
                  }}
                  className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/40 transition hover:bg-blue-500"
                >
                  Continue to guided form
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-400 hover:text-white"
                >
                  Return to site
                </Link>
              </div>
            </div>
          </div>
        </section>

        <footer className="rounded-3xl bg-slate-800/70 p-6 text-xs leading-6 text-slate-400 shadow-inner shadow-slate-900/50">
          This secure intake environment is provided by Epiidosis Global Finance. Do not forward this link. If
          you believe you received this in error, contact support@epiidosisglobalfin.com immediately.
        </footer>
      </div>
    </main>
  );
}
