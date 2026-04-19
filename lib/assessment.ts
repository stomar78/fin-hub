type LeadInput = Record<string, unknown>;

export type AssessmentSummary = {
  headline: string;
  toolSlug: string;
  headlineDetail?: string | null;
  summaryNarrative: string;
  indicativeRange?: string | null;
  indicativeLtvBand?: string | null;
  liquidityCoverageRatio?: string | null;
  concentrationFlag?: string | null;
  readinessBand?: string | null;
  dscrEstimate?: string | null;
  privateCreditOption?: string | null;
  keySignals: string[];
  riskNotes: string[];
  nextSteps: string[];
  recommendedSolutions: string[];
  advisoryNotes: string[];
  spotlightInsights: string[];
  documentationChecklist?: string[];
  timelineGuidance?: string[];
  bankChannelNotes?: string[];
};

function sanitizeCurrency(value: unknown): number | null {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const numeric = Number(value.replace(/[^0-9.-]/g, ''));
    return Number.isFinite(numeric) ? numeric : null;
  }

  return null;
}

function formatCurrencyAED(amount: number | null): string | null {
  if (!amount && amount !== 0) {
    return null;
  }

  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPercent(value: number | null): string | null {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return null;
  }

  return `${(value * 100).toFixed(1)}%`;
}

function sanitizePercent(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value / 100;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    const numeric = Number(trimmed.replace(/[^0-9.-]/g, ''));
    if (Number.isFinite(numeric)) {
      return numeric / 100;
    }
  }

  return null;
}

function hasRepaymentConcerns(notes: string): boolean {
  const normalized = notes.toLowerCase();

  const cleanPhrases = [
    'no missed',
    'never missed',
    'no late',
    'never late',
    'no arrears',
    'no defaults',
    'clean repayment',
    'all payments on time',
    'current on payments',
  ];

  if (cleanPhrases.some((phrase) => normalized.includes(phrase))) {
    return false;
  }

  const concernPatterns = /(missed|late|arrear|default|restructure|overdue|delinquent)/i;
  return concernPatterns.test(normalized);
}

function computeAnnualDebtService(
  principal: number | null,
  annualRate: number,
  years: number
): number | null {
  if (!principal || principal <= 0 || years <= 0) {
    return null;
  }

  const monthlyRate = annualRate / 12;
  const totalPayments = years * 12;

  if (monthlyRate === 0) {
    return (principal / totalPayments) * 12;
  }

  const denominator = 1 - Math.pow(1 + monthlyRate, -totalPayments);
  if (denominator === 0) {
    return null;
  }

  const monthlyPayment = principal * (monthlyRate / denominator);
  return monthlyPayment * 12;
}

function computeWorkingCapitalInsights(input: LeadInput) {
  const turnover = sanitizeCurrency(input.annualTurnover);
  const requestedLimit = sanitizeCurrency(input.requestedLimit);
  const dscr = typeof input.dscr === 'number' ? input.dscr : null;

  const indicativeRange =
    turnover && turnover > 0
      ? `${formatCurrencyAED(turnover * 0.08)} – ${formatCurrencyAED(
          turnover * 0.15
        )}`
      : null;

  const liquidityCoverageRatio =
    requestedLimit && turnover
      ? `${((requestedLimit / turnover) * 100).toFixed(1)}%`
      : null;

  const keySignals: string[] = [];
  if (dscr && dscr > 0) {
    keySignals.push(`Estimated DSCR: ${dscr.toFixed(1)}x`);
  }
  if (typeof input.sector === 'string' && input.sector.length > 0) {
    keySignals.push(`Sector: ${input.sector}`);
  }

  const riskNotes: string[] = [];
  if (liquidityCoverageRatio) {
    const ratio = Number(liquidityCoverageRatio.replace('%', ''));
    if (ratio > 25) {
      riskNotes.push('Requested limit exceeds typical turnover gearing (>25%).');
    }
  }

  if (typeof input.bankRelationship === 'string' && input.bankRelationship.length === 0) {
    riskNotes.push('No disclosed UAE banking relationship. Introductions required.');
  }

  const workingCapitalPercent = turnover
    ? requestedLimit && turnover > 0
      ? requestedLimit / turnover
      : null
    : null;

  const narrativeSegments: string[] = [];
  if (turnover) {
    narrativeSegments.push(
      `With annual turnover around ${formatCurrencyAED(turnover)}, lenders typically anchor revolving facilities at 8%–15% of sales.`
    );
  } else {
    narrativeSegments.push(
      'Providing annual turnover allows lenders to map revolving appetite against sector benchmarks (normally 8%–15% of sales).'
    );
  }

  if (requestedLimit) {
    narrativeSegments.push(
      `The requested exposure of ${formatCurrencyAED(requestedLimit)} implies gearing of ${formatPercent(
        workingCapitalPercent
      ) ?? 'c.'}${workingCapitalPercent ? '' : ' (once turnover is confirmed)'}.`
    );
  }

  if (dscr) {
    narrativeSegments.push(`Disclosed DSCR of ${dscr.toFixed(1)}x supports bankability for senior lenders.`);
  }

  const summaryNarrative = narrativeSegments.join(' ');

  const recommendedSolutions: string[] = [
    'Structure a revolving working capital line secured on receivables with 60–90 day tenor.',
    'Blend limits with trade instruments (LC/BG) to diversify cost of funds.',
  ];

  if (requestedLimit && turnover && requestedLimit > turnover * 0.12) {
    recommendedSolutions.push('Consider tiered drawdown where the facility scales with seasonal revenues.');
  }

  const advisoryNotes: string[] = [];
  if (!dscr || dscr < 1.2) {
    advisoryNotes.push('Prepare latest audited financials and management accounts to evidence repayment capacity.');
  }

  if (typeof input.bankRelationship === 'string' && input.bankRelationship.length === 0) {
    advisoryNotes.push('Introduce at least one UAE banking relationship to support local credit appetite.');
  }

  const spotlightInsights: string[] = [];
  if (liquidityCoverageRatio) {
    spotlightInsights.push(`Liquidity coverage ratio calculated at ${liquidityCoverageRatio}.`);
  }
  if (indicativeRange) {
    spotlightInsights.push(`Indicative limit sizing: ${indicativeRange}.`);
  }

  return {
    headline: 'Working capital appetite mapped',
    headlineDetail: liquidityCoverageRatio
      ? `Coverage ratio at ${liquidityCoverageRatio} highlights ${
          Number(liquidityCoverageRatio.replace('%', '')) <= 30
            ? 'headroom for senior lenders'
            : 'the need to stagger drawdowns'
        }.`
      : null,
    summaryNarrative,
    indicativeRange,
    liquidityCoverageRatio,
    keySignals,
    riskNotes,
    recommendedSolutions,
    advisoryNotes,
    spotlightInsights,
    nextSteps: [
      'Align management accounts and VAT returns to evidence trading momentum.',
      'Curate ageing schedule of receivables/payables to support underwriting.',
      'Engage with relationship banks to pre-clear security package.',
    ],
  };
}

function computeMortgageFinanceInsights(input: LeadInput) {
  const propertyValue = sanitizeCurrency(input.estimatedValue);
  const outstandingBalance = sanitizeCurrency(input.outstandingBalance);
  const desiredLtv = sanitizePercent(input.desiredLtv);
  const rentalIncomeMonthly = sanitizeCurrency(input.rentalIncome);
  const purpose = typeof input.purpose === 'string' ? input.purpose.trim() : '';
  const propertyType = typeof input.propertyType === 'string' ? input.propertyType.trim() : '';
  const emirate = typeof input.emirate === 'string' ? input.emirate.trim() : '';
  const exitStrategy = typeof input.exitStrategy === 'string' ? input.exitStrategy.trim() : '';
  const repaymentHistory =
    typeof input.repaymentHistory === 'string' ? input.repaymentHistory.trim() : '';

  const assumedRate = 0.065; // 6.5% annual interest assumption
  const amortYears = 15;

  const targetLoanAmount =
    propertyValue && desiredLtv !== null ? propertyValue * desiredLtv : null;

  let totalDebt: number | null = null;
  if (targetLoanAmount !== null && outstandingBalance !== null) {
    totalDebt = Math.max(targetLoanAmount, outstandingBalance);
  } else {
    totalDebt = targetLoanAmount ?? outstandingBalance;
  }

  const actualLtv =
    propertyValue && propertyValue > 0 && totalDebt !== null ? totalDebt / propertyValue : null;
  const actualLtvPercent = actualLtv !== null ? actualLtv * 100 : null;

  const ltvBand = (() => {
    if (actualLtvPercent === null) {
      return null;
    }

    if (actualLtvPercent <= 65) {
      return '≤65% (Green band)';
    }

    if (actualLtvPercent <= 80) {
      return '65–80% (Amber band)';
    }

    return '>80% (Red band)';
  })();

  const annualDebtService = computeAnnualDebtService(
    totalDebt ?? targetLoanAmount ?? outstandingBalance,
    assumedRate,
    amortYears
  );

  const annualRentalIncome = rentalIncomeMonthly ? rentalIncomeMonthly * 12 : null;
  const dscrValue =
    annualDebtService && annualDebtService > 0 && annualRentalIncome
      ? annualRentalIncome / annualDebtService
      : null;

  const dscrBand = (() => {
    if (dscrValue === null) {
      return null;
    }

    if (dscrValue >= 1.3) {
      return '≥1.30x (Green band)';
    }

    if (dscrValue >= 1.0) {
      return '1.00–1.30x (Amber band)';
    }

    return '<1.00x (Red band)';
  })();

  const readinessScores: Array<'Ready' | 'Needs Preparation' | 'Additional Equity Required'> = [];
  const riskNotes: string[] = [];

  if (!propertyValue || propertyValue <= 0) {
    riskNotes.push('Provide a recent UAE valuation so lenders can anchor LTV.');
    readinessScores.push('Needs Preparation');
  }

  if (actualLtvPercent === null) {
    riskNotes.push('Unable to calculate post-transaction LTV. Share target leverage and existing debt.');
    readinessScores.push('Needs Preparation');
  } else if (actualLtvPercent > 80) {
    riskNotes.push('LTV exceeds 80%; banks will require equity top-up or mezzanine support.');
    readinessScores.push('Additional Equity Required');
  } else if (actualLtvPercent > 65) {
    riskNotes.push('LTV sits above the 65% sweet spot. Expect tighter covenants or additional equity.');
    readinessScores.push('Needs Preparation');
  } else {
    readinessScores.push('Ready');
  }

  if (dscrValue === null) {
    riskNotes.push('Share net operating income and expected debt service to evidence DSCR.');
    readinessScores.push('Needs Preparation');
  } else if (dscrValue < 1.0) {
    riskNotes.push('DSCR below 1.0x signals insufficient cash flow to service proposed debt.');
    readinessScores.push('Additional Equity Required');
  } else if (dscrValue < 1.25) {
    riskNotes.push('DSCR between 1.0x and 1.25x; bolster income or moderate leverage to unlock bank appetite.');
    readinessScores.push('Needs Preparation');
  } else {
    readinessScores.push('Ready');
  }

  if (!exitStrategy) {
    riskNotes.push('Clarify exit strategy (hold, refinance, sale) for credit committee comfort.');
    readinessScores.push('Needs Preparation');
  } else if (/sale/i.test(exitStrategy)) {
    riskNotes.push('Sale-led exits are treated as higher risk; prepare contingency and marketing evidence.');
    readinessScores.push('Needs Preparation');
  }

  if (repaymentHistory && hasRepaymentConcerns(repaymentHistory)) {
    riskNotes.push('Previous arrears noted. Prepare a remediation narrative and supporting evidence.');
    readinessScores.push('Additional Equity Required');
  }

  const readinessBand = (() => {
    if (readinessScores.includes('Additional Equity Required')) {
      return 'Additional Equity Required';
    }

    if (readinessScores.includes('Needs Preparation')) {
      return 'Needs Preparation';
    }

    return 'Ready to Engage';
  })();

  const keySignals: string[] = [];

  if (propertyValue) {
    keySignals.push(`Property value: ${formatCurrencyAED(propertyValue)}`);
  }

  if (totalDebt) {
    keySignals.push(`Target financing amount: ${formatCurrencyAED(totalDebt)}`);
  }

  if (actualLtv !== null) {
    keySignals.push(`Post-transaction LTV: ${formatPercent(actualLtv)}`);
  }

  if (desiredLtv !== null) {
    keySignals.push(`Desired LTV: ${formatPercent(desiredLtv)}`);
  }

  if (dscrValue !== null) {
    keySignals.push(`Estimated DSCR: ${dscrValue.toFixed(2)}x`);
  }

  if (propertyType) {
    keySignals.push(`Asset class: ${propertyType.replace(/-/g, ' ')}`);
  }

  if (emirate) {
    keySignals.push(`Emirate: ${emirate}`);
  }

  const nextSteps = new Set<string>([
    'Commission a RERA/land department approved valuation to evidence market value.',
    'Curate tenancy schedules, rent rolls, and service charge receipts to validate income.',
    'Prepare audited financials and management accounts to back DSCR assumptions.',
  ]);

  if (actualLtvPercent !== null && actualLtvPercent > 65) {
    nextSteps.add('Model scenarios that bring LTV below 65% to access prime bank pricing.');
  }

  if (dscrValue !== null && dscrValue < 1.25) {
    nextSteps.add('Improve DSCR via rental uplifts, expense optimisation, or lower debt quantum.');
  }

  if (exitStrategy && /sale/i.test(exitStrategy)) {
    nextSteps.add('Document marketing plan, broker mandates, and potential buyers to derisk sale exit.');
  }

  const documentationChecklist = [
    'Latest property valuation from an approved UAE valuer (≤3 months old).',
    'Title deed, site plan, and any zoning / planning approvals.',
    'Stamped tenancy contracts, rent roll, and occupancy schedule.',
    '12–24 months of management accounts plus latest audited financial statements.',
    'Insurance certificates, service charge statements, and maintenance records.',
  ];

  if (purpose === 'development') {
    documentationChecklist.push('Approved drawings, budget, contractor contracts, and construction timetable.');
  }

  if (outstandingBalance) {
    documentationChecklist.push('Existing facility statements showing outstanding balance and repayment history.');
  }

  const timelineGuidance = [
    'Valuation & appraisal: typically 2–4 weeks once site access and documents are provided.',
    'Credit committee review: 4–8 weeks depending on completeness of financials and tenancy data.',
    'Documentation & disbursement: 1–4 weeks post-approval for security perfection and drawdown.',
  ];

  const privateCreditOption = actualLtv
    ? `Private credit desks could stretch to roughly ${formatPercent(
        Math.min(actualLtv + 0.1, 0.75)
      )} LTV provided DSCR ≥ 1.30x and tenancy is stabilised.`
    : 'Private lenders in the UAE typically cap at 70–75% LTV with DSCR ≥ 1.30x and evidenced exit.';

  const recommendedSolutions = [
    'Build a lender-ready data room covering valuation, tenancy, and sponsor financials.',
    'Assess dual-track financing: senior bank tranche with optional mezzanine or private credit top-up.',
    'Engage existing lenders early if refinancing to negotiate security release timelines.',
  ];

  const advisoryNotes = [
    'Align legal counsel for security perfection (mortgage registration, SPAs, pledge assignments).',
    'Prepare contingency plan for rate hikes—stress DSCR at +200 bps to demonstrate resilience.',
  ];

  const spotlightInsights: string[] = [];

  if (ltvBand) {
    spotlightInsights.push(`Post-transaction LTV sits in the ${ltvBand}.`);
  }

  if (dscrBand) {
    spotlightInsights.push(`DSCR outcome: ${dscrBand}.`);
  }

  if (purpose) {
    spotlightInsights.push(`Purpose of financing: ${purpose.replace(/-/g, ' ')}.`);
  }

  const bankChannelNotes = [
    'UAE banks typically favour ≤65% LTV and ≥1.25x DSCR for income-producing commercial assets.',
    'Prepare for 4–6 weeks of Q&A covering tenancy continuity, sponsor support, and exit strategy.',
  ];

  const summaryNarrativeParts: string[] = [];

  if (propertyValue && totalDebt && actualLtv !== null) {
    summaryNarrativeParts.push(
      `With a property value around ${formatCurrencyAED(propertyValue)} and financing of ${formatCurrencyAED(
        totalDebt
      )}, the post-transaction LTV is ${formatPercent(actualLtv)}, landing in the ${
        ltvBand ?? 'target'
      } lenders monitor.`
    );
  } else if (propertyValue) {
    summaryNarrativeParts.push(
      `Property value of ${formatCurrencyAED(propertyValue)} provided. Share leverage targets to size facilities.`
    );
  }

  if (dscrValue !== null) {
    summaryNarrativeParts.push(
      `Estimated DSCR of ${dscrValue.toFixed(2)}x ${
        dscrValue >= 1.3
          ? 'supports senior lender appetite.'
          : dscrValue >= 1.0
          ? 'sits in cautionary territory—bolster NOI or trim leverage.'
          : 'signals a shortfall; restructure debt service or increase equity.'
      }`
    );
  }

  if (!exitStrategy) {
    summaryNarrativeParts.push('Clarify exit strategy so credit committees understand repayment and contingency.');
  } else {
    summaryNarrativeParts.push(`Exit strategy declared as “${exitStrategy}”. Document supporting evidence for lenders.`);
  }

  const summaryNarrative = summaryNarrativeParts.join(' ');

  const headline = (() => {
    if (readinessBand === 'Ready to Engage') {
      return 'Real estate leverage sits in bankable range';
    }

    if (readinessBand === 'Needs Preparation') {
      return 'Close highlighted gaps before approaching lenders';
    }

    return 'Equity or income uplift needed before lenders engage';
  })();

  const headlineDetail = (() => {
    if (actualLtvPercent !== null) {
      return `Post-LTV: ${actualLtvPercent.toFixed(1)}%.`;
    }

    if (desiredLtv !== null) {
      return `Target LTV provided at ${formatPercent(desiredLtv)}.`;
    }

    return null;
  })();

  const indicativeRange = targetLoanAmount
    ? `${formatCurrencyAED(targetLoanAmount)} target facility (based on ${formatPercent(desiredLtv) ?? 'stated leverage'})`
    : null;

  return {
    headline,
    headlineDetail,
    summaryNarrative,
    indicativeRange,
    indicativeLtvBand: ltvBand,
    readinessBand,
    dscrEstimate: dscrValue ? `${dscrValue.toFixed(2)}x` : null,
    privateCreditOption,
    keySignals,
    riskNotes,
    nextSteps: Array.from(nextSteps),
    recommendedSolutions,
    advisoryNotes,
    spotlightInsights,
    documentationChecklist,
    timelineGuidance,
    bankChannelNotes,
  };
}

function computeTradeFinanceInsights(input: LeadInput) {
  const monthlyImports = sanitizeCurrency(input.monthlyImports);
  const monthlyExports = sanitizeCurrency(input.monthlyExports);
  const requestedLimit = sanitizeCurrency(input.requestedTradeLimit);

  const base = monthlyImports ?? monthlyExports ?? null;
  const indicativeRange =
    base !== null
      ? `${formatCurrencyAED(base * 0.2)} – ${formatCurrencyAED(base * 0.4)}`
      : null;

  const concentrationFlag = Array.isArray(input.counterpartyRegions)
    ? input.counterpartyRegions.length <= 1
      ? 'Counterparty concentration noted; diversify invoices if possible.'
      : null
    : null;

  const keySignals: string[] = [];
  if (typeof input.tradeTenorDays === 'number') {
    keySignals.push(`Average tenor: ${input.tradeTenorDays} days`);
  }
  if (typeof input.paymentTerms === 'string' && input.paymentTerms.length > 0) {
    keySignals.push(`Customer terms: ${input.paymentTerms}`);
  }

  const riskNotes: string[] = [];
  if (requestedLimit && base && requestedLimit > base * 0.5) {
    riskNotes.push('Requested LC/BG limit sits above typical coverage ratios.');
  }

  const narrativeSegments: string[] = [];
  if (base) {
    narrativeSegments.push(
      `Monthly trade flows around ${formatCurrencyAED(base)} position appetite for bank guarantees and LCs between 20%–40% of turnover.`
    );
  } else {
    narrativeSegments.push('Sharing average monthly imports/exports helps size trade instruments accurately.');
  }

  if (requestedLimit) {
    narrativeSegments.push(
      `The requested facility of ${formatCurrencyAED(requestedLimit)} pushes overall coverage to ${formatPercent(
        base && requestedLimit ? requestedLimit / base : null
      ) ?? 'the higher end of market norms'}.`
    );
  }

  if (Array.isArray(input.counterpartyRegions) && input.counterpartyRegions.length <= 1) {
    narrativeSegments.push('Counterparty concentration noted — spreading flows across regions can unlock better terms.');
  }

  const summaryNarrative = narrativeSegments.join(' ');

  const recommendedSolutions = [
    'Blend sight LCs with usance instruments to match customer payment terms.',
    'Introduce receivables discounting to convert export invoices into liquidity.',
  ];

  const advisoryNotes: string[] = [];
  if (typeof input.tradeTenorDays === 'number' && input.tradeTenorDays > 120) {
    advisoryNotes.push('Prepare credit insurance or collateral enhancements for tenors beyond 120 days.');
  }

  if (!Array.isArray(input.counterpartyRegions) || input.counterpartyRegions.length <= 1) {
    advisoryNotes.push('Diversify buyer/supplier exposure to mitigate concentration covenants.');
  }

  const spotlightInsights: string[] = [];
  if (indicativeRange) {
    spotlightInsights.push(`LC/BG appetite signalled between ${indicativeRange}.`);
  }
  if (typeof input.tradeTenorDays === 'number') {
    spotlightInsights.push(`Average trade tenor: ${input.tradeTenorDays} days.`);
  }

  return {
    headline: 'Trade cycle profile assembled',
    headlineDetail: concentrationFlag ?? null,
    summaryNarrative,
    indicativeRange,
    concentrationFlag,
    keySignals,
    riskNotes,
    recommendedSolutions,
    advisoryNotes,
    spotlightInsights,
    nextSteps: [
      'Compile recent shipping invoices and contracts to evidence trade cycle.',
      'Align with logistics and procurement teams on LC issuance calendar.',
      'Confirm insurance/FX hedging arrangements to support approvals.',
    ],
  };
}

function computeProjectFinanceInsights(input: LeadInput) {
  const projectValue = sanitizeCurrency(input.projectValue);
  const equityCommitted = sanitizeCurrency(input.equityCommitted);
  const requestedDebt = sanitizeCurrency(input.requestedDebt);

  const leverage =
    projectValue && requestedDebt
      ? `${((requestedDebt / projectValue) * 100).toFixed(1)}% debt gearing`
      : null;

  const keySignals: string[] = [];
  if (projectValue) {
    keySignals.push(`Project value ~ ${formatCurrencyAED(projectValue)}`);
  }
  if (equityCommitted) {
    keySignals.push(`Equity committed ~ ${formatCurrencyAED(equityCommitted)}`);
  }
  if (typeof input.projectStage === 'string') {
    keySignals.push(`Stage: ${input.projectStage}`);
  }

  const riskNotes: string[] = [];
  if (!equityCommitted || (projectValue && equityCommitted < projectValue * 0.2)) {
    riskNotes.push('Equity cushion below 20%; lenders may request stronger sponsor contribution.');
  }
  if (typeof input.contractStatus === 'string' && input.contractStatus !== 'awarded') {
    riskNotes.push('EPC / offtake contract not fully awarded; term sheets likely conditional.');
  }

  const narrativeSegments: string[] = [];
  if (projectValue) {
    narrativeSegments.push(
      `Project size around ${formatCurrencyAED(projectValue)} positions senior lenders to underwrite structured funding once equity and offtake visibility are confirmed.`
    );
  }

  if (equityCommitted) {
    narrativeSegments.push(
      `Equity commitment of ${formatCurrencyAED(equityCommitted)} (${formatPercent(
        projectValue ? equityCommitted / projectValue : null
      ) ?? 'n/a'}) sets the sponsor contribution baseline.`
    );
  } else {
    narrativeSegments.push('Clarifying sponsor equity percentage is critical for bankability.');
  }

  if (requestedDebt) {
    narrativeSegments.push(
      `Debt ask of ${formatCurrencyAED(requestedDebt)} implies gearing ${leverage ?? ''}; lenders will test DSCR and covenant flexibility.`
    );
  }

  const summaryNarrative = narrativeSegments.join(' ');

  const recommendedSolutions: string[] = [
    'Stage a club deal across 2–3 relationship banks to balance underwriting capacity.',
    'Blend term loan with construction bridge or mezzanine tranche to smooth cash flows.',
  ];

  const advisoryNotes: string[] = [];
  if (!equityCommitted || (projectValue && equityCommitted < projectValue * 0.2)) {
    advisoryNotes.push('Reconfirm sponsor equity contribution plan to reach 20%+ of project cost.');
  }
  if (typeof input.projectStage === 'string') {
    advisoryNotes.push(`Document milestone schedule for current stage (${input.projectStage}).`);
  }

  const spotlightInsights: string[] = [];
  if (leverage) {
    spotlightInsights.push(`Target gearing stands at ${leverage}.`);
  }
  if (typeof input.contractStatus === 'string') {
    spotlightInsights.push(`Contract status: ${input.contractStatus}.`);
  }

  return {
    headline: 'Project finance readiness snapshot',
    headlineDetail: leverage,
    summaryNarrative,
    indicativeRange:
      requestedDebt && projectValue
        ? `${formatCurrencyAED(requestedDebt)} requested vs ${formatCurrencyAED(projectValue)} project`
        : null,
    keySignals,
    riskNotes,
    recommendedSolutions,
    advisoryNotes,
    spotlightInsights,
    nextSteps: [
      'Compile detailed financial model with sensitivities for lenders.',
      'Secure updated term sheets/LOIs from EPC and offtakers.',
      'Prepare independent technical and market studies for diligence.',
    ],
  };
}

export function generateAssessmentSummary(input: LeadInput): AssessmentSummary {
  const toolSlug = String(input.toolSlug ?? 'unknown');

  const baseSummary: AssessmentSummary = {
    headline: 'Submission captured',
    toolSlug,
    summaryNarrative:
      'We are reviewing the financial profile you submitted and will respond with tailored structuring options.',
    keySignals: [],
    riskNotes: [],
    nextSteps: [
      'EGF advisory desk to review full submission against current lender appetite.',
      'Collect supporting financials and bank statements as required.',
      'Arrange follow-up call with decision maker within 1 business day.',
    ],
    recommendedSolutions: ['Our team will tailor financing structures once documentation is reviewed.'],
    advisoryNotes: ['Have audited financials, management accounts, and ID documents ready for onboarding.'],
    spotlightInsights: [],
  };

  switch (toolSlug) {
    case 'line-of-credit': {
      const workingCapital = computeWorkingCapitalInsights(input);
      return {
        ...baseSummary,
        ...workingCapital,
      };
    }

    case 'mortgage-finance': {
      const mortgageInsights = computeMortgageFinanceInsights(input);
      return {
        ...baseSummary,
        ...mortgageInsights,
      };
    }

    case 'trade-finance':
    case 'bill-discounting': {
      const tradeInsights = computeTradeFinanceInsights(input);
      return {
        ...baseSummary,
        ...tradeInsights,
      };
    }

    case 'project-finance': {
      const projectInsights = computeProjectFinanceInsights(input);
      return {
        ...baseSummary,
        ...projectInsights,
      };
    }

    default:
      return baseSummary;
  }
}
