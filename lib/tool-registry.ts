import { z } from 'zod';

export type ToolCategorySlug =
  | 'working-capital-credit'
  | 'mortgage-real-estate-finance'
  | 'bill-discounting-receivables'
  | 'trade-finance'
  | 'project-finance'
  | 'corporate-finance-treasury'
  | 'compliance-vat-business-setup'
  | 'investment-valuation'
  | 'specialized-sector'
  | 'integrated-financial-health';

export type ToolFieldOption = {
  label: string;
  value: string;
};

export type ToolFieldType =
  | 'text'
  | 'email'
  | 'number'
  | 'currency'
  | 'textarea'
  | 'select'
  | 'tel';

export type ToolFieldLayout = 'single' | 'two-column' | 'three-column';

export type ToolField = {
  name: string;
  label: string;
  type: ToolFieldType;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  options?: ToolFieldOption[];
  defaultValue?: string;
  layout?: ToolFieldLayout;
  colSpan?: 1 | 2 | 3;
  rows?: number;
  autoComplete?: string;
  inputMode?: 'text' | 'decimal' | 'numeric' | 'tel';
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
};

export type ToolFormSectionLayout = 'single' | 'two-column' | 'three-column';

export type ToolFormSection = {
  id: string;
  title?: string;
  description?: string;
  layout: ToolFormSectionLayout;
  fields: ToolField[];
};

export type ToolDefinition = {
  slug: string;
  name: string;
  shortName?: string;
  category: ToolCategorySlug;
  badge: string;
  tagline: string;
  heroTitle: string;
  heroHighlight?: string;
  heroDescription: string;
  highlights: string[];
  timeToComplete: string;
  outcome: string;
  ctaLabel: string;
  successMessage?: string;
  errorMessage?: string;
  dataPrivacyNote?: string;
  sections: ToolFormSection[];
};

export type ToolCategory = {
  slug: ToolCategorySlug;
  title: string;
  description: string;
};

const STANDARD_CONTACT_SECTION: ToolFormSection = {
  id: 'contact-details',
  title: 'Contact details',
  layout: 'two-column',
  fields: [
    {
      name: 'fullName',
      label: 'Your full name',
      type: 'text',
      required: true,
      placeholder: 'e.g. CEO / Finance Director',
      autoComplete: 'name',
    },
    {
      name: 'companyName',
      label: 'Company name',
      type: 'text',
      required: true,
      placeholder: 'Registered trade name in UAE',
      autoComplete: 'organization',
    },
    {
      name: 'email',
      label: 'Work email',
      type: 'email',
      required: true,
      placeholder: 'you@company.com',
      autoComplete: 'email',
    },
    {
      name: 'phone',
      label: 'Mobile / WhatsApp',
      type: 'tel',
      placeholder: '+971-5x-xxx-xxxx',
      autoComplete: 'tel',
    },
  ],
};

function cloneSection(section: ToolFormSection): ToolFormSection {
  return {
    ...section,
    fields: section.fields.map((field) => ({
      ...field,
      options: field.options ? field.options.map((option) => ({ ...option })) : undefined,
    })),
  };
}

function createContactSection(description?: string): ToolFormSection {
  const section = cloneSection(STANDARD_CONTACT_SECTION);

  if (description) {
    section.description = description;
  }

  return section;
}

export const TOOL_FIELD_SCHEMA = z.object({
  name: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(['text', 'email', 'number', 'currency', 'textarea', 'select', 'tel']),
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
  helperText: z.string().optional(),
  options: z
    .array(
      z.object({
        label: z.string().min(1),
        value: z.string().min(1),
      })
    )
    .optional(),
  defaultValue: z.string().optional(),
  layout: z.enum(['single', 'two-column', 'three-column']).optional(),
  colSpan: z
    .enum(['1', '2', '3'])
    .transform((value) => Number(value) as 1 | 2 | 3)
    .optional(),
  rows: z.number().int().min(1).max(12).optional(),
  autoComplete: z.string().optional(),
  inputMode: z.enum(['text', 'decimal', 'numeric', 'tel']).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  pattern: z.string().optional(),
});

export const TOOL_DEFINITION_SCHEMA = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  shortName: z.string().optional(),
  category: z.discriminatedUnion('slug', [
    z.object({ slug: z.literal('working-capital-credit') }),
    z.object({ slug: z.literal('mortgage-real-estate-finance') }),
    z.object({ slug: z.literal('bill-discounting-receivables') }),
    z.object({ slug: z.literal('trade-finance') }),
    z.object({ slug: z.literal('project-finance') }),
    z.object({ slug: z.literal('corporate-finance-treasury') }),
    z.object({ slug: z.literal('compliance-vat-business-setup') }),
    z.object({ slug: z.literal('investment-valuation') }),
    z.object({ slug: z.literal('specialized-sector') }),
    z.object({ slug: z.literal('integrated-financial-health') }),
  ]).transform((value) => value.slug as ToolCategorySlug),
  badge: z.string().min(1),
  tagline: z.string().min(1),
  heroTitle: z.string().min(1),
  heroDescription: z.string().min(1),
  heroHighlight: z.string().optional(),
  highlights: z.array(z.string().min(1)),
  timeToComplete: z.string().min(1),
  outcome: z.string().min(1),
  ctaLabel: z.string().min(1),
  successMessage: z.string().optional(),
  errorMessage: z.string().optional(),
  dataPrivacyNote: z.string().optional(),
  sections: z
    .array(
      z.object({
        id: z.string().min(1),
        title: z.string().optional(),
        description: z.string().optional(),
        layout: z.enum(['single', 'two-column', 'three-column']).default('single'),
        fields: z
          .array(TOOL_FIELD_SCHEMA)
          .min(1, 'Each section must have at least one field'),
      })
    )
    .min(1, 'At least one form section is required'),
});

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    slug: 'working-capital-credit',
    title: 'Working Capital & Credit Line Tools',
    description:
      'Understand revolving credit appetite, stress scenarios, and consolidation strategies for UAE businesses.',
  },
  {
    slug: 'mortgage-real-estate-finance',
    title: 'Mortgage & Real Estate Finance Tools',
    description:
      'Assess commercial property financing, development funding, and bridge requirements before approaching lenders.',
  },
  {
    slug: 'bill-discounting-receivables',
    title: 'Bill Discounting & Receivables Finance Tools',
    description:
      'Unlock liquidity from invoices, gauge buyer risk, and estimate discounting economics across receivables programs.',
  },
  {
    slug: 'trade-finance',
    title: 'Trade Finance Tools',
    description:
      'Model trade instruments, collateral, and FX hedging benchmarks for importers, exporters, and traders.',
  },
  {
    slug: 'project-finance',
    title: 'Project Finance Tools',
    description:
      'Evaluate bankability, capital structure, and concession financing for large-scale projects.',
  },
  {
    slug: 'corporate-finance-treasury',
    title: 'Corporate Finance & Treasury Tools',
    description:
      'Stress-test corporate leverage, coverage, liquidity metrics, and treasury risk before refinancing or raising debt.',
  },
  {
    slug: 'compliance-vat-business-setup',
    title: 'Compliance, VAT & Business Setup Tools',
    description:
      'Ensure readiness for UAE tax, ESR, ownership, and licensing requirements with quick diagnostic wizards.',
  },
  {
    slug: 'investment-valuation',
    title: 'Investment & Valuation Tools',
    description:
      'Gauge valuation ranges, ROI scenarios, and investor readiness to prepare for capital raises.',
  },
  {
    slug: 'specialized-sector',
    title: 'Specialized Sector Tools',
    description:
      'Sector-specific financing diagnostics tailored to construction, tech, infrastructure, and export-led businesses.',
  },
  {
    slug: 'integrated-financial-health',
    title: 'Integrated Financial Health Tools',
    description:
      'Holistic credit health scores, AI-generated assessments, and dashboards to steer financing decisions.',
  },
];

export const DEFAULT_SUCCESS_MESSAGE =
  'Thank you — your details have been received. We’ll review your submission and respond from ktomar@epiidosisglobalfin.com with tailored options.';

export const DEFAULT_ERROR_MESSAGE =
  'Something went wrong while submitting. Please try once more or email ktomar@epiidosisglobalfin.com.';

export const DEFAULT_DATA_PRIVACY_NOTE =
  'By submitting, you consent to Epiidosis Global Finance contacting you about this enquiry. We share data with lenders only after your explicit approval.';

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    slug: 'line-of-credit',
    name: 'Line of Credit Eligibility',
    shortName: 'Line of Credit',
    category: 'working-capital-credit',
    badge: 'Working Capital',
    tagline: 'Check how much working capital you could access.',
    heroTitle: 'Line of Credit',
    heroHighlight: 'Eligibility Check',
    heroDescription:
      'Find out how much revolving working capital your company could access from UAE banks and private credit funds. Share key headline numbers and we’ll benchmark you against current lending appetites.',
    highlights: [
      'Indicative credit line range (AED) based on turnover and sector.',
      'Quick DSCR and covenant health snapshot.',
      'Checklist of lender documentation expectations.',
    ],
    timeToComplete: '3–4 minutes',
    outcome: 'Instant eligibility band + DSCR snapshot.',
    ctaLabel: 'Get my eligibility assessment',
    successMessage: DEFAULT_SUCCESS_MESSAGE,
    errorMessage: DEFAULT_ERROR_MESSAGE,
    dataPrivacyNote: DEFAULT_DATA_PRIVACY_NOTE,
    sections: [
      {
        id: 'contact-details',
        title: 'Contact details',
        description: 'Tell us who to send the assessment to.',
        layout: 'two-column',
        fields: [
          {
            name: 'fullName',
            label: 'Your full name',
            type: 'text',
            required: true,
            placeholder: 'e.g. CEO / Finance Director',
            autoComplete: 'name',
          },
          {
            name: 'companyName',
            label: 'Company name',
            type: 'text',
            required: true,
            placeholder: 'Registered trade name in UAE',
            autoComplete: 'organization',
          },
          {
            name: 'email',
            label: 'Work email',
            type: 'email',
            required: true,
            placeholder: 'you@company.com',
            autoComplete: 'email',
          },
          {
            name: 'phone',
            label: 'Mobile / WhatsApp',
            type: 'tel',
            placeholder: '+971-5x-xxx-xxxx',
            autoComplete: 'tel',
          },
        ],
      },
      {
        id: 'business-profile',
        title: 'Business profile',
        layout: 'three-column',
        fields: [
          {
            name: 'annualTurnover',
            label: 'Approximate annual turnover (AED)',
            type: 'currency',
            required: true,
            placeholder: 'e.g. 12,000,000',
            colSpan: 2,
            inputMode: 'decimal',
          },
          {
            name: 'country',
            label: 'Country of incorporation',
            type: 'text',
            defaultValue: 'United Arab Emirates',
          },
        ],
      },
      {
        id: 'facility-request',
        title: 'Facility request details',
        layout: 'two-column',
        fields: [
          {
            name: 'requestedLimit',
            label: 'Requested line of credit (AED)',
            type: 'currency',
            required: true,
            placeholder: 'e.g. 2,500,000',
            inputMode: 'decimal',
          },
          {
            name: 'sector',
            label: 'Industry / sector',
            type: 'text',
            placeholder: 'Trading, manufacturing, services, etc.',
          },
          {
            name: 'bankRelationship',
            label: 'Existing primary bank in UAE',
            type: 'text',
            placeholder: 'e.g. Emirates NBD, FAB, Mashreq',
          },
          {
            name: 'hasExistingFacilities',
            label: 'Existing facilities?',
            type: 'select',
            options: [
              { label: 'Select one', value: '' },
              { label: 'No existing facilities', value: 'none' },
              { label: 'Overdraft only', value: 'overdraft' },
              { label: 'LC / BG only', value: 'lc-bg' },
              { label: 'Multiple facilities', value: 'multiple' },
            ],
          },
        ],
      },
      {
        id: 'usage-notes',
        layout: 'single',
        fields: [
          {
            name: 'description',
            label: 'How do you plan to use this facility?',
            type: 'textarea',
            rows: 3,
            placeholder: 'Inventory buildup, supplier payments, contract mobilization…',
          },
        ],
      },
    ],
  },
  {
    slug: 'vat-cashflow-impact-check',
    name: 'VAT Cashflow Impact Check',
    shortName: 'VAT Impact Check',
    category: 'compliance-vat-business-setup',
    badge: 'Compliance & VAT',
    tagline: 'Model VAT payment cycles and their impact on working capital.',
    heroTitle: 'Compliance & VAT',
    heroHighlight: 'VAT Impact Check',
    heroDescription:
      'For UAE businesses managing VAT outflows, we analyse payment cycles, input credit recovery, and supplier terms to highlight cashflow pinch points. Enter your VAT data to receive actionable mitigation tips.',
    highlights: [
      'Models VAT outflow vs input credit timings.',
      'Identifies suppliers or customers impacting recovery cycles.',
      'Provides recommendations for payment planning and facility use.',
    ],
    timeToComplete: '3 minutes',
    outcome: 'VAT cashflow profile with mitigation checklist.',
    ctaLabel: 'Review my VAT impact',
    successMessage: DEFAULT_SUCCESS_MESSAGE,
    errorMessage: DEFAULT_ERROR_MESSAGE,
    dataPrivacyNote: DEFAULT_DATA_PRIVACY_NOTE,
    sections: [
      createContactSection(),
      {
        id: 'vat-profile',
        title: 'VAT profile',
        layout: 'two-column',
        fields: [
          {
            name: 'monthlyVatCollected',
            label: 'Monthly VAT collected (AED)',
            type: 'currency',
            placeholder: 'e.g. 420,000',
            inputMode: 'decimal',
          },
          {
            name: 'monthlyVatPaid',
            label: 'Monthly VAT paid (AED)',
            type: 'currency',
            placeholder: 'e.g. 380,000',
            inputMode: 'decimal',
          },
          {
            name: 'filingFrequency',
            label: 'VAT filing frequency',
            type: 'select',
            options: [
              { label: 'Select frequency', value: '' },
              { label: 'Monthly', value: 'monthly' },
              { label: 'Quarterly', value: 'quarterly' },
              { label: 'Semi-annual', value: 'semi-annual' },
            ],
          },
          {
            name: 'averageInputRecoveryDays',
            label: 'Average input credit recovery days',
            type: 'number',
            placeholder: 'e.g. 45',
            inputMode: 'numeric',
          },
        ],
      },
      {
        id: 'planning-mitigation',
        title: 'Planning & mitigation',
        layout: 'two-column',
        fields: [
          {
            name: 'vatFundingApproach',
            label: 'How do you fund VAT payments today?',
            type: 'textarea',
            rows: 3,
            placeholder: 'Use operating cash, overdraft, dedicated VAT facility…',
            colSpan: 2,
          },
          {
            name: 'supportNeeded',
            label: 'Support needed',
            type: 'textarea',
            rows: 3,
            placeholder: 'Negotiating supplier terms, setting up VAT loan, improving invoicing cadence…',
            colSpan: 2,
          },
        ],
      },
    ],
  },
  {
    slug: 'business-setup-readiness',
    name: 'Business Setup Readiness Scanner',
    shortName: 'Setup Readiness',
    category: 'compliance-vat-business-setup',
    badge: 'Compliance & VAT',
    tagline: 'Check regulatory, licensing, and banking readiness for UAE setup.',
    heroTitle: 'Compliance & VAT',
    heroHighlight: 'Setup Readiness',
    heroDescription:
      'Before incorporating or expanding into the UAE, map regulatory requirements, banking readiness, and VAT obligations. Provide your business plan and ownership structure to identify next steps.',
    highlights: [
      'Outlines licensing and regulatory approvals required.',
      'Highlights banking, VAT, and compliance timelines.',
      'Provides checklist for documentation and local partnerships.',
    ],
    timeToComplete: '4 minutes',
    outcome: 'Setup readiness score with action plan.',
    ctaLabel: 'Check my setup readiness',
    successMessage: DEFAULT_SUCCESS_MESSAGE,
    errorMessage: DEFAULT_ERROR_MESSAGE,
    dataPrivacyNote: DEFAULT_DATA_PRIVACY_NOTE,
    sections: [
      createContactSection(),
      {
        id: 'business-plan',
        title: 'Business plan',
        layout: 'two-column',
        fields: [
          {
            name: 'intendedActivities',
            label: 'Intended activities',
            type: 'textarea',
            rows: 3,
            placeholder: 'Consulting, trading, manufacturing, fintech, etc.',
            colSpan: 2,
          },
          {
            name: 'targetEmirate',
            label: 'Target emirate / free zone',
            type: 'text',
            placeholder: 'e.g. Dubai Mainland, DMCC, ADGM…',
          },
          {
            name: 'ownershipStructure',
            label: 'Ownership structure',
            type: 'textarea',
            rows: 3,
            placeholder: 'Shareholders, foreign ownership %, UAE national partners…',
            colSpan: 2,
          },
        ],
      },
      {
        id: 'readiness-factors',
        title: 'Readiness factors',
        layout: 'two-column',
        fields: [
          {
            name: 'bankingStatus',
            label: 'Banking status',
            type: 'select',
            options: [
              { label: 'Select status', value: '' },
              { label: 'Account opened', value: 'opened' },
              { label: 'Application in progress', value: 'in-progress' },
              { label: 'Not started', value: 'not-started' },
            ],
          },
          {
            name: 'complianceDocumentation',
            label: 'Compliance documentation ready',
            type: 'textarea',
            rows: 3,
            placeholder: 'Business plan, shareholder KYC, board resolutions, lease agreement…',
            colSpan: 2,
          },
          {
            name: 'supportRequested',
            label: 'Support requested from EGF',
            type: 'textarea',
            rows: 3,
            placeholder: 'Licensing, VAT registration, bank introductions, PRO services…',
            colSpan: 2,
          },
        ],
      },
    ],
  },
  {
    slug: 'valuation-benchmarking-tool',
    name: 'Valuation Benchmarking Tool',
    shortName: 'Valuation Benchmark',
    category: 'investment-valuation',
    badge: 'Investment & Valuation',
    tagline: 'Compare your valuation assumptions against market peers.',
    heroTitle: 'Investment & Valuation',
    heroHighlight: 'Valuation Benchmark',
    heroDescription:
      'For founders and CFOs planning fundraising or M&A, we benchmark revenue, EBITDA, and growth metrics against recent UAE/GCC transactions. Submit your metrics to get valuation ranges and readiness actions.',
    highlights: [
      'Provides EV/Revenue and EV/EBITDA benchmarks by sector.',
      'Flags gaps in data room and investor readiness.',
      'Recommends advisors and timeline actions.',
    ],
    timeToComplete: '4 minutes',
    outcome: 'Valuation range summary with readiness checklist.',
    ctaLabel: 'Benchmark my valuation',
    successMessage: DEFAULT_SUCCESS_MESSAGE,
    errorMessage: DEFAULT_ERROR_MESSAGE,
    dataPrivacyNote: DEFAULT_DATA_PRIVACY_NOTE,
    sections: [
      createContactSection(),
      {
        id: 'financial-metrics',
        title: 'Financial metrics',
        layout: 'two-column',
        fields: [
          {
            name: 'annualRevenue',
            label: 'Latest annual revenue (AED)',
            type: 'currency',
            placeholder: 'e.g. 95,000,000',
            inputMode: 'decimal',
          },
          {
            name: 'annualEbitda',
            label: 'Annual EBITDA (AED)',
            type: 'currency',
            placeholder: 'e.g. 14,500,000',
            inputMode: 'decimal',
          },
          {
            name: 'yearOnYearGrowth',
            label: 'Year-on-year growth (%)',
            type: 'number',
            placeholder: 'e.g. 28',
            inputMode: 'decimal',
          },
          {
            name: 'sector',
            label: 'Sector',
            type: 'text',
            placeholder: 'SaaS, manufacturing, healthcare, retail…',
          },
        ],
      },
      {
        id: 'transaction-readiness',
        title: 'Transaction readiness',
        layout: 'two-column',
        fields: [
          {
            name: 'fundraiseTimeline',
            label: 'Fundraise / M&A timeline',
            type: 'text',
            placeholder: 'e.g. Target close in 9 months',
          },
          {
            name: 'dataRoomStatus',
            label: 'Data room status',
            type: 'select',
            options: [
              { label: 'Select status', value: '' },
              { label: 'Ready', value: 'ready' },
              { label: 'In progress', value: 'in-progress' },
              { label: 'Not started', value: 'not-started' },
            ],
          },
          {
            name: 'investorTargets',
            label: 'Investor / buyer targets',
            type: 'textarea',
            rows: 3,
            placeholder: 'Strategic buyers, PE funds, venture investors…',
            colSpan: 2,
          },
          {
            name: 'supportNeeded',
            label: 'Support needed from EGF',
            type: 'textarea',
            rows: 3,
            placeholder: 'Valuation modelling, investor introductions, data room prep…',
            colSpan: 2,
          },
        ],
      },
    ],
  },
  {
    slug: 'fundraising-readiness-audit',
    name: 'Fundraising Readiness Audit',
    shortName: 'Fundraising Audit',
    category: 'investment-valuation',
    badge: 'Investment & Valuation',
    tagline: 'Assess governance, metrics, and collateral for raising capital.',
    heroTitle: 'Investment & Valuation',
    heroHighlight: 'Fundraising Audit',
    heroDescription:
      'Before approaching investors, evaluate your financial metrics, governance, and materials. Share details on traction, unit economics, and capital sought to receive a readiness score plus action steps.',
    highlights: [
      'Assesses revenue quality and unit economics.',
      'Reviews governance, board structure, and reporting cadence.',
      'Provides investor engagement roadmap and collateral checklist.',
    ],
    timeToComplete: '5 minutes',
    outcome: 'Fundraising readiness score with next steps.',
    ctaLabel: 'Audit my fundraising readiness',
    successMessage: DEFAULT_SUCCESS_MESSAGE,
    errorMessage: DEFAULT_ERROR_MESSAGE,
    dataPrivacyNote: DEFAULT_DATA_PRIVACY_NOTE,
    sections: [
      createContactSection(),
      {
        id: 'traction-metrics',
        title: 'Traction metrics',
        layout: 'two-column',
        fields: [
          {
            name: 'monthlyRevenue',
            label: 'Monthly recurring revenue (AED)',
            type: 'currency',
            placeholder: 'e.g. 1,200,000',
            inputMode: 'decimal',
          },
          {
            name: 'grossMarginPercent',
            label: 'Gross margin (%)',
            type: 'number',
            placeholder: 'e.g. 62',
            inputMode: 'decimal',
          },
          {
            name: 'customerRetention',
            label: 'Customer retention / churn data',
            type: 'textarea',
            rows: 3,
            placeholder: 'Monthly churn %, retention cohorts, contract lengths…',
            colSpan: 2,
          },
          {
            name: 'capitalSought',
            label: 'Capital sought (AED)',
            type: 'currency',
            placeholder: 'e.g. 25,000,000',
            inputMode: 'decimal',
          },
        ],
      },
      {
        id: 'governance-readiness',
        title: 'Governance & readiness',
        layout: 'two-column',
        fields: [
          {
            name: 'boardStructure',
            label: 'Board / advisory structure',
            type: 'textarea',
            rows: 3,
            placeholder: 'Independent directors, investor observers, committees…',
            colSpan: 2,
          },
          {
            name: 'reportingCadence',
            label: 'Financial reporting cadence',
            type: 'select',
            options: [
              { label: 'Select cadence', value: '' },
              { label: 'Monthly', value: 'monthly' },
              { label: 'Quarterly', value: 'quarterly' },
              { label: 'Semi-annual', value: 'semi-annual' },
            ],
          },
          {
            name: 'investmentMaterials',
            label: 'Investment materials prepared',
            type: 'textarea',
            rows: 3,
            placeholder: 'Pitch deck, financial model, investor FAQs…',
            colSpan: 2,
          },
          {
            name: 'supportNeeded',
            label: 'Support needed from EGF',
            type: 'textarea',
            rows: 3,
            placeholder: 'Capital raise advisory, data room build, investor outreach…',
            colSpan: 2,
          },
        ],
      },
    ],
  },
  {
    slug: 'sector-healthcare-finance-check',
    name: 'Healthcare Finance Eligibility Check',
    shortName: 'Healthcare Finance',
    category: 'specialized-sector',
    badge: 'Specialized Sector',
    tagline: 'Assess financing appetite tailored to UAE healthcare providers.',
    heroTitle: 'Specialized Sector',
    heroHighlight: 'Healthcare Finance',
    heroDescription:
      'Healthcare operators can benchmark funding options for expansion, equipment, and working capital. Share revenue mix, payer exposure, and capex plans to receive tailored lender feedback.',
    highlights: [
      'Evaluates payer mix vs lender comfort.',
      'Highlights collateral options for equipment and real estate.',
      'Recommends debt structures aligned with healthcare cashflows.',
    ],
    timeToComplete: '4 minutes',
    outcome: 'Healthcare financing playbook with lender signals.',
    ctaLabel: 'Check healthcare financing options',
    successMessage: DEFAULT_SUCCESS_MESSAGE,
    errorMessage: DEFAULT_ERROR_MESSAGE,
    dataPrivacyNote: DEFAULT_DATA_PRIVACY_NOTE,
    sections: [
      createContactSection(),
      {
        id: 'operations-profile',
        title: 'Operations profile',
        layout: 'two-column',
        fields: [
          {
            name: 'facilityType',
            label: 'Facility type',
            type: 'select',
            options: [
              { label: 'Select facility type', value: '' },
              { label: 'Clinic / polyclinic', value: 'clinic' },
              { label: 'Hospital', value: 'hospital' },
              { label: 'Laboratory / diagnostics', value: 'lab' },
              { label: 'Pharmacy chain', value: 'pharmacy' },
            ],
          },
          {
            name: 'annualRevenue',
            label: 'Annual revenue (AED)',
            type: 'currency',
            placeholder: 'e.g. 75,000,000',
            inputMode: 'decimal',
          },
          {
            name: 'payerMix',
            label: 'Payer mix breakdown',
            type: 'textarea',
            rows: 3,
            placeholder: 'Insurance %, cash %, government %, corporate contracts…',
            colSpan: 2,
          },
          {
            name: 'bedCountOrCapacity',
            label: 'Bed count / capacity metrics',
            type: 'text',
            placeholder: 'e.g. 65 beds, 15 clinics, 10 pharmacies…',
          },
        ],
      },
      {
        id: 'financing-objectives',
        title: 'Financing objectives',
        layout: 'two-column',
        fields: [
          {
            name: 'capexPlan',
            label: 'Capex plan (AED)',
            type: 'currency',
            placeholder: 'e.g. 28,000,000 for new imaging equipment',
            inputMode: 'decimal',
          },
          {
            name: 'workingCapitalNeed',
            label: 'Working capital requirement (AED)',
            type: 'currency',
            placeholder: 'e.g. 6,500,000',
            inputMode: 'decimal',
          },
          {
            name: 'collateralAvailable',
            label: 'Collateral available',
            type: 'textarea',
            rows: 3,
            placeholder: 'Property, equipment, receivables, personal guarantees…',
            colSpan: 2,
          },
          {
            name: 'supportNeeded',
            label: 'Support required from EGF',
            type: 'textarea',
            rows: 3,
            placeholder: 'Project finance advisory, lender introductions, documentation prep…',
            colSpan: 2,
          },
        ],
      },
    ],
  },
  {
    slug: 'sector-construction-finance-check',
    name: 'Construction Finance Capacity Check',
    shortName: 'Construction Finance',
    category: 'specialized-sector',
    badge: 'Specialized Sector',
    tagline: 'Evaluate bonding and working capital headroom for contractors.',
    heroTitle: 'Specialized Sector',
    heroHighlight: 'Construction Finance',
    heroDescription:
      'Construction and EPC contractors can test bonding capacity, working capital availability, and lender appetite. Share project pipeline, guarantee needs, and collateral to benchmark readiness.',
    highlights: [
      'Assesses bonding bandwidth across upcoming tenders.',
      'Highlights cash margin and collateral gaps.',
      'Provides roadmap for bank engagement and surety alternatives.',
    ],
    timeToComplete: '4 minutes',
    outcome: 'Construction finance capacity summary.',
    ctaLabel: 'Check my construction finance capacity',
    successMessage: DEFAULT_SUCCESS_MESSAGE,
    errorMessage: DEFAULT_ERROR_MESSAGE,
    dataPrivacyNote: DEFAULT_DATA_PRIVACY_NOTE,
    sections: [
      createContactSection(),
      {
        id: 'pipeline-summary',
        title: 'Pipeline summary',
        layout: 'two-column',
        fields: [
          {
            name: 'currentBacklog',
            label: 'Current backlog (AED)',
            type: 'currency',
            placeholder: 'e.g. 180,000,000',
            inputMode: 'decimal',
          },
          {
            name: 'upcomingTenders',
            label: 'Upcoming tenders (AED)',
            type: 'currency',
            placeholder: 'e.g. 240,000,000',
            inputMode: 'decimal',
          },
          {
            name: 'projectTypes',
            label: 'Project types',
            type: 'textarea',
            rows: 3,
            placeholder: 'Infrastructure, utilities, real estate, industrial…',
            colSpan: 2,
          },
          {
            name: 'existingBankers',
            label: 'Existing relationship bankers',
            type: 'text',
            placeholder: 'Mashreq, FAB, Emirates Islamic…',
          },
        ],
      },
      {
        id: 'bonding-working-capital',
        title: 'Bonding & working capital',
        layout: 'two-column',
        fields: [
          {
            name: 'bondingCapacityRequired',
            label: 'Bonding capacity required (AED)',
            type: 'currency',
            placeholder: 'e.g. 40,000,000',
            inputMode: 'decimal',
          },
          {
            name: 'cashMarginAvailable',
            label: 'Cash margin available (%)',
            type: 'number',
            placeholder: 'e.g. 15',
            inputMode: 'decimal',
          },
          {
            name: 'collateralOffered',
            label: 'Collateral offered',
            type: 'textarea',
            rows: 3,
            placeholder: 'Corporate guarantees, property, equipment, receivables…',
            colSpan: 2,
          },
          {
            name: 'supportNeeded',
            label: 'Support needed from EGF',
            type: 'textarea',
            rows: 3,
            placeholder: 'Bank introductions, surety providers, facility structuring…',
            colSpan: 2,
          },
        ],
      },
    ],
  },
  {
    slug: 'integrated-liquidity-health-check',
    name: 'Integrated Liquidity Health Check',
    shortName: 'Liquidity Health Check',
    category: 'integrated-financial-health',
    badge: 'Integrated Financial Health',
    tagline: 'Holistic view of liquidity, leverage, and profitability signals.',
    heroTitle: 'Integrated Financial Health',
    heroHighlight: 'Liquidity Health Check',
    heroDescription:
      'Bring together cash, working capital, and leverage indicators for a board-ready dashboard. Provide key financial metrics to receive a composite health score and advisory actions.',
    highlights: [
      'Consolidates liquidity, leverage, and profitability indicators.',
      'Highlights early warning signals and covenant headroom.',
      'Suggests short-term and strategic remediation steps.',
    ],
    timeToComplete: '4 minutes',
    outcome: 'Integrated financial health report with actions.',
    ctaLabel: 'Assess my financial health',
    successMessage: DEFAULT_SUCCESS_MESSAGE,
    errorMessage: DEFAULT_ERROR_MESSAGE,
    dataPrivacyNote: DEFAULT_DATA_PRIVACY_NOTE,
    sections: [
      createContactSection(),
      {
        id: 'financial-metrics-overview',
        title: 'Financial metrics overview',
        layout: 'two-column',
        fields: [
          {
            name: 'cashOnHand',
            label: 'Cash on hand (AED)',
            type: 'currency',
            placeholder: 'e.g. 12,500,000',
            inputMode: 'decimal',
          },
          {
            name: 'revolvingFacilitiesUsed',
            label: 'Revolving facilities utilised (AED)',
            type: 'currency',
            placeholder: 'e.g. 4,600,000',
            inputMode: 'decimal',
          },
          {
            name: 'ebitdaMarginPercent',
            label: 'EBITDA margin (%)',
            type: 'number',
            placeholder: 'e.g. 18',
            inputMode: 'decimal',
          },
          {
            name: 'netLeverageRatio',
            label: 'Net leverage ratio (x)',
            type: 'number',
            placeholder: 'e.g. 2.4',
            inputMode: 'decimal',
          },
        ],
      },
      {
        id: 'risk-signals',
        title: 'Risk signals & priorities',
        layout: 'two-column',
        fields: [
          {
            name: 'covenantHeadroom',
            label: 'Covenant headroom',
            type: 'textarea',
            rows: 3,
            placeholder: 'Detail covenants, headroom %, next testing dates…',
            colSpan: 2,
          },
          {
            name: 'upcomingCashEvents',
            label: 'Upcoming cash events',
            type: 'textarea',
            rows: 3,
            placeholder: 'Dividend payments, large payables, project milestones…',
            colSpan: 2,
          },
          {
            name: 'supportNeeded',
            label: 'Support needed from EGF',
            type: 'textarea',
            rows: 3,
            placeholder: 'Liquidity strategy, lender negotiations, board pack preparation…',
            colSpan: 2,
          },
        ],
      },
    ],
  },
  {
    slug: 'treasury-liquidity-review',
    name: 'Treasury Liquidity Review',
    shortName: 'Liquidity Review',
    category: 'corporate-finance-treasury',
    badge: 'Corporate Treasury',
    tagline: 'Benchmark cash, investments, and hedging versus best practice.',
    heroTitle: 'Corporate Treasury',
    heroHighlight: 'Liquidity Review',
    heroDescription:
      'Understand if your treasury function is optimised for cash visibility, surplus deployment, and risk management. Share cash positions, treasury policies, and hedging usage to receive a structured scorecard.',
    highlights: [
      'Evaluates cash visibility, pooling, and short-term investments.',
      'Benchmarks FX and commodity hedging usage vs policy.',
      'Provides governance and system enhancement checklist.',
    ],
    timeToComplete: '5 minutes',
    outcome: 'Treasury health score with actionable roadmap.',
    ctaLabel: 'Review my treasury setup',
    successMessage: DEFAULT_SUCCESS_MESSAGE,
    errorMessage: DEFAULT_ERROR_MESSAGE,
    dataPrivacyNote: DEFAULT_DATA_PRIVACY_NOTE,
    sections: [
      createContactSection('Tell us who oversees treasury operations.'),
      {
        id: 'cash-visibility',
        title: 'Cash visibility & deployment',
        layout: 'two-column',
        fields: [
          {
            name: 'groupCashBalance',
            label: 'Group cash & equivalents (AED)',
            type: 'currency',
            placeholder: 'e.g. 45,000,000',
            inputMode: 'decimal',
          },
          {
            name: 'numberOfBankAccounts',
            label: 'Number of bank accounts',
            type: 'number',
            placeholder: 'e.g. 28',
            inputMode: 'numeric',
          },
          {
            name: 'treasurySystems',
            label: 'Treasury systems in use',
            type: 'text',
            placeholder: 'e.g. Kyriba, Excel-based tracking…',
            colSpan: 2,
          },
          {
            name: 'investmentPolicy',
            label: 'Short-term investment policy summary',
            type: 'textarea',
            rows: 3,
            placeholder: 'Permitted instruments, limits, approval matrix…',
            colSpan: 2,
          },
        ],
      },
      {
        id: 'risk-management',
        title: 'Risk management & governance',
        layout: 'two-column',
        fields: [
          {
            name: 'fxExposure',
            label: 'FX exposure (currencies & % revenues)',
            type: 'textarea',
            rows: 3,
            placeholder: 'USD 40%, EUR 10%, SAR 8%…',
            colSpan: 2,
          },
          {
            name: 'hedgingToolsUsed',
            label: 'Hedging tools currently used',
            type: 'text',
            placeholder: 'Forwards, options, swaps, natural hedging…',
          },
          {
            name: 'governanceFramework',
            label: 'Treasury governance framework',
            type: 'textarea',
            rows: 3,
            placeholder: 'Policies, board oversight, compliance, audit cadence…',
            colSpan: 2,
          },
        ],
      },
    ],
  },
  {
    slug: 'working-capital-forecasting-lab',
    name: 'Working Capital Forecasting Lab',
    shortName: 'Forecasting Lab',
    category: 'corporate-finance-treasury',
    badge: 'Corporate Treasury',
    tagline: 'Stress-test 13-week cashflow forecasts and liquidity buffers.',
    heroTitle: 'Corporate Treasury',
    heroHighlight: 'Forecasting Lab',
    heroDescription:
      'Upload top-line forecast drivers to evaluate cashflow gaps, borrowing needs, and contingency buffers. We benchmark forecast discipline and recommend enhancements to your treasury cadence.',
    highlights: [
      'Reviews forecast process quality and variance tracking.',
      'Identifies liquidity pinch points and required buffers.',
      'Recommends governance and tooling upgrades.',
    ],
    timeToComplete: '5 minutes',
    outcome: 'Forecast accuracy score with mitigation plan.',
    ctaLabel: 'Assess my cashflow forecasts',
    successMessage: DEFAULT_SUCCESS_MESSAGE,
    errorMessage: DEFAULT_ERROR_MESSAGE,
    dataPrivacyNote: DEFAULT_DATA_PRIVACY_NOTE,
    sections: [
      createContactSection('Provide treasury contact for follow-up.'),
      {
        id: 'forecast-basics',
        title: 'Forecast basics',
        layout: 'two-column',
        fields: [
          {
            name: 'forecastHorizonWeeks',
            label: 'Forecast horizon (weeks)',
            type: 'number',
            placeholder: 'e.g. 13',
            inputMode: 'numeric',
          },
          {
            name: 'updateFrequency',
            label: 'Update frequency',
            type: 'select',
            options: [
              { label: 'Select frequency', value: '' },
              { label: 'Weekly', value: 'weekly' },
              { label: 'Bi-weekly', value: 'bi-weekly' },
              { label: 'Monthly', value: 'monthly' },
            ],
          },
          {
            name: 'varianceTracking',
            label: 'Variance tracking method',
            type: 'textarea',
            rows: 3,
            placeholder: 'Explain how actuals vs forecast are reconciled…',
            colSpan: 2,
          },
          {
            name: 'borrowingsInForecast',
            label: 'Borrowings modelled in forecast',
            type: 'text',
            placeholder: 'Overdraft, revolving credit, term loans…',
          },
          {
            name: 'cashBufferPolicy',
            label: 'Cash buffer policy',
            type: 'textarea',
            rows: 3,
            placeholder: 'Minimum cash days, contingency facilities, board limits…',
            colSpan: 2,
          },
        ],
      },
      {
        id: 'data-integrity',
        title: 'Data integrity & tooling',
        layout: 'two-column',
        fields: [
          {
            name: 'sourceSystems',
            label: 'Source systems feeding the forecast',
            type: 'text',
            placeholder: 'ERP, CRM, BI tools…',
          },
          {
            name: 'scenarioPlanning',
            label: 'Scenario planning capabilities',
            type: 'select',
            options: [
              { label: 'Select option', value: '' },
              { label: 'Manual spreadsheets', value: 'manual' },
              { label: 'Basic sensitivity models', value: 'sensitivity' },
              { label: 'Advanced scenario engine', value: 'advanced' },
            ],
          },
          {
            name: 'supportNeeded',
            label: 'Support required from EGF',
            type: 'textarea',
            rows: 3,
            placeholder: 'Process redesign, systems upgrade, liquidity facility planning…',
            colSpan: 2,
          },
        ],
      },
    ],
  },
  {
    slug: 'capital-structure-optimizer',
    name: 'Capital Structure Optimizer',
    shortName: 'Capital Optimizer',
    category: 'corporate-finance-treasury',
    badge: 'Corporate Finance',
    tagline: 'Analyse leverage mix, cost of capital, and refinancing windows.',
    heroTitle: 'Corporate Finance',
    heroHighlight: 'Capital Optimizer',
    heroDescription:
      'Review your debt and equity mix to identify refinancing opportunities and cost of capital improvements. Submit leverage metrics, facility details, and maturities to receive tailored recommendations.',
    highlights: [
      'Evaluates leverage ratios vs sector benchmarks.',
      'Identifies refinancing or recapitalisation windows.',
      'Recommends debt instruments and equity strategies.',
    ],
    timeToComplete: '4 minutes',
    outcome: 'Capital structure playbook with recommended actions.',
    ctaLabel: 'Optimise my capital structure',
    successMessage: DEFAULT_SUCCESS_MESSAGE,
    errorMessage: DEFAULT_ERROR_MESSAGE,
    dataPrivacyNote: DEFAULT_DATA_PRIVACY_NOTE,
    sections: [
      createContactSection(),
      {
        id: 'capital-overview',
        title: 'Capital structure overview',
        layout: 'two-column',
        fields: [
          {
            name: 'totalDebt',
            label: 'Total debt outstanding (AED)',
            type: 'currency',
            placeholder: 'e.g. 320,000,000',
            inputMode: 'decimal',
          },
          {
            name: 'ebitda',
            label: 'Latest annual EBITDA (AED)',
            type: 'currency',
            placeholder: 'e.g. 68,000,000',
            inputMode: 'decimal',
          },
          {
            name: 'equityBookValue',
            label: 'Equity book value (AED)',
            type: 'currency',
            placeholder: 'e.g. 210,000,000',
            inputMode: 'decimal',
          },
          {
            name: 'ratingOrScore',
            label: 'Credit rating or internal score',
            type: 'text',
            placeholder: 'e.g. Fitch BBB-, internal grade 3…',
          },
        ],
      },
      {
        id: 'maturity-portfolio',
        title: 'Maturity & portfolio',
        layout: 'two-column',
        fields: [
          {
            name: 'debtInstruments',
            label: 'Debt instruments in place',
            type: 'textarea',
            rows: 3,
            placeholder: 'Term loans, sukuk, revolving credit, leases…',
            colSpan: 2,
          },
          {
            name: 'nearestMaturity',
            label: 'Nearest maturity (month/year)',
            type: 'text',
            placeholder: 'e.g. Aug 2026',
          },
          {
            name: 'refinanceObjectives',
            label: 'Refinancing / capital raising objectives',
            type: 'textarea',
            rows: 3,
            placeholder: 'Lower pricing, tap capital markets, raise mezzanine, reduce leverage…',
            colSpan: 2,
          },
        ],
      },
    ],
  },
  {
    slug: 'invoice-purchase-comparison',
    name: 'Invoice Purchase vs Factoring Comparison',
    shortName: 'Invoice Purchase Comparison',
    category: 'bill-discounting-receivables',
    badge: 'Receivables Finance',
    tagline: 'Compare true cost of invoice discounting vs outright purchase structures.',
    heroTitle: 'Receivables Finance',
    heroHighlight: 'Invoice Purchase Comparison',
    heroDescription:
      'Understand whether a disclosed factoring line or invoice purchase structure better fits your receivables. Share buyer mix, payment terms, and advance expectations to map cost and cashflow impact.',
    highlights: [
      'Benchmarks discount rate vs purchase fee scenarios.',
      'Highlights impact of recourse vs non-recourse variations.',
      'Provides negotiation checklist for factoring partners.',
    ],
    timeToComplete: '3 minutes',
    outcome: 'Comparison of financing structures with pricing levers.',
    ctaLabel: 'Compare my receivables options',
    successMessage: DEFAULT_SUCCESS_MESSAGE,
    errorMessage: DEFAULT_ERROR_MESSAGE,
    dataPrivacyNote: DEFAULT_DATA_PRIVACY_NOTE,
    sections: [
      createContactSection(),
      {
        id: 'receivables-profile',
        title: 'Receivables profile',
        layout: 'two-column',
        fields: [
          {
            name: 'monthlyReceivablesTurnover',
            label: 'Monthly receivables turnover (AED)',
            type: 'currency',
            placeholder: 'e.g. 5,500,000',
            inputMode: 'decimal',
          },
          {
            name: 'averageInvoiceSize',
            label: 'Average invoice size (AED)',
            type: 'currency',
            placeholder: 'e.g. 85,000',
            inputMode: 'decimal',
          },
          {
            name: 'buyerConcentration',
            label: 'Top buyer concentration (%)',
            type: 'number',
            placeholder: 'e.g. 35',
            inputMode: 'decimal',
          },
          {
            name: 'internationalExposure',
            label: 'International exposure (%)',
            type: 'number',
            placeholder: 'e.g. 40',
            inputMode: 'decimal',
          },
        ],
      },
      {
        id: 'structure-preferences',
        title: 'Structure preferences',
        layout: 'two-column',
        fields: [
          {
            name: 'desiredAdvanceRate',
            label: 'Desired advance rate (%)',
            type: 'number',
            placeholder: 'e.g. 80',
            inputMode: 'decimal',
          },
          {
            name: 'paymentTermsDays',
            label: 'Average payment terms (days)',
            type: 'number',
            placeholder: 'e.g. 60',
            inputMode: 'numeric',
          },
          {
            name: 'existingArrangements',
            label: 'Existing arrangements',
            type: 'textarea',
            rows: 3,
            placeholder: 'Highlight factoring partners, facility size, pricing, covenants…',
            colSpan: 2,
          },
          {
            name: 'supportNeeded',
            label: 'Support needed from EGF',
            type: 'textarea',
            rows: 3,
            placeholder: 'Negotiating terms, onboarding buyers, legal review…',
            colSpan: 2,
          },
        ],
      },
    ],
  },
  {
    slug: 'receivables-portfolio-diagnostics',
    name: 'Receivables Portfolio Diagnostics',
    shortName: 'Receivables Diagnostics',
    category: 'bill-discounting-receivables',
    badge: 'Receivables Finance',
    tagline: 'Diagnose overdue ratios and eligibility for diversified receivables programmes.',
    heroTitle: 'Receivables Finance',
    heroHighlight: 'Portfolio Diagnostics',
    heroDescription:
      'Map overdue patterns, debtor diversification, and documentation readiness to secure receivables financing. Upload key stats so we can highlight eligibility and remediation actions.',
    highlights: [
      'Flags overdue and concentration risks impacting funding.',
      'Benchmarks documentation readiness for factoring partners.',
      'Suggests workflow improvements to speed collections.',
    ],
    timeToComplete: '4 minutes',
    outcome: 'Receivables health report with remediation tasks.',
    ctaLabel: 'Diagnose my receivables portfolio',
    successMessage: DEFAULT_SUCCESS_MESSAGE,
    errorMessage: DEFAULT_ERROR_MESSAGE,
    dataPrivacyNote: DEFAULT_DATA_PRIVACY_NOTE,
    sections: [
      createContactSection('Tell us who leads credit control.'),
      {
        id: 'portfolio-overview',
        title: 'Portfolio overview',
        layout: 'two-column',
        fields: [
          {
            name: 'totalReceivables',
            label: 'Total receivables outstanding (AED)',
            type: 'currency',
            placeholder: 'e.g. 14,000,000',
            inputMode: 'decimal',
          },
          {
            name: 'overdue30Percent',
            label: 'Overdue >30 days (%)',
            type: 'number',
            placeholder: 'e.g. 18',
            inputMode: 'decimal',
          },
          {
            name: 'overdue60Percent',
            label: 'Overdue >60 days (%)',
            type: 'number',
            placeholder: 'e.g. 7',
            inputMode: 'decimal',
          },
          {
            name: 'top5BuyerShare',
            label: 'Top 5 buyers share (%)',
            type: 'number',
            placeholder: 'e.g. 55',
            inputMode: 'decimal',
          },
          {
            name: 'averageCollectionDays',
            label: 'Average collection days',
            type: 'number',
            placeholder: 'e.g. 68',
            inputMode: 'numeric',
          },
          {
            name: 'creditInsuranceStatus',
            label: 'Credit insurance status',
            type: 'select',
            options: [
              { label: 'Select status', value: '' },
              { label: 'Insured', value: 'insured' },
              { label: 'Partially insured', value: 'partially-insured' },
              { label: 'No insurance', value: 'none' },
            ],
          },
        ],
      },
      {
        id: 'process-readiness',
        title: 'Process & readiness',
        layout: 'two-column',
        fields: [
          {
            name: 'documentationPack',
            label: 'Documentation pack available',
            type: 'textarea',
            rows: 3,
            placeholder: 'Invoices, purchase orders, contracts, delivery notes…',
            colSpan: 2,
          },
          {
            name: 'erpSystem',
            label: 'ERP / accounting system in use',
            type: 'text',
            placeholder: 'e.g. SAP, Oracle NetSuite, Zoho Books…',
          },
          {
            name: 'collectionsChallenges',
            label: 'Key collections challenges',
            type: 'textarea',
            rows: 3,
            placeholder: 'Disputes, approvals, manpower, documentation gaps…',
            colSpan: 2,
          },
        ],
      },
    ],
  },
  {
    slug: 'trade-finance-bid-bond',
    name: 'Bid Bond & Performance Guarantee Mapper',
    shortName: 'Bid Bond Mapper',
    category: 'trade-finance',
    badge: 'Trade Finance',
    tagline: 'Assess bonding requirements and bank appetite for project bids.',
    heroTitle: 'Trade Finance',
    heroHighlight: 'Guarantee Mapper',
    heroDescription:
      'Plan upcoming tender participation by mapping bid bond and performance guarantee requirements. Share project details, guarantee sizes, and timelines to estimate collateral, pricing, and issuance feasibility.',
    highlights: [
      'Estimates bond/guarantee sizes vs tender requirements.',
      'Highlights collateral needs and bank underwriting criteria.',
      'Suggests private surety alternatives when bank appetite is limited.',
    ],
    timeToComplete: '4 minutes',
    outcome: 'Bonding feasibility assessment with next steps.',
    ctaLabel: 'Map my guarantee strategy',
    successMessage: DEFAULT_SUCCESS_MESSAGE,
    errorMessage: DEFAULT_ERROR_MESSAGE,
    dataPrivacyNote: DEFAULT_DATA_PRIVACY_NOTE,
    sections: [
      createContactSection(),
      {
        id: 'tender-basics',
        title: 'Tender basics',
        layout: 'two-column',
        fields: [
          {
            name: 'tenderName',
            label: 'Tender / project name',
            type: 'text',
            placeholder: 'e.g. Abu Dhabi Municipality landscaping contract',
          },
          {
            name: 'sector',
            label: 'Sector',
            type: 'text',
            placeholder: 'Infrastructure, EPC, facilities management…',
          },
          {
            name: 'bidBondValue',
            label: 'Bid bond value (AED)',
            type: 'currency',
            placeholder: 'e.g. 1,200,000',
            inputMode: 'decimal',
          },
          {
            name: 'performanceBondValue',
            label: 'Performance guarantee value (AED)',
            type: 'currency',
            placeholder: 'e.g. 6,500,000',
            inputMode: 'decimal',
          },
        ],
      },
      {
        id: 'guarantee-parameters',
        title: 'Guarantee parameters',
        layout: 'two-column',
        fields: [
          {
            name: 'bidSubmissionDate',
            label: 'Bid submission date',
            type: 'text',
            placeholder: 'e.g. 15 March 2026',
          },
          {
            name: 'expectedProjectAward',
            label: 'Expected project award date',
            type: 'text',
            placeholder: 'e.g. Q2 2026',
          },
          {
            name: 'collateralAvailable',
            label: 'Collateral you can pledge',
            type: 'textarea',
            rows: 3,
            placeholder: 'Cash margin %, property, inventory, parent guarantee…',
            colSpan: 2,
          },
          {
            name: 'bankFeedback',
            label: 'Bank feedback so far',
            type: 'textarea',
            rows: 3,
            placeholder: 'Quotes received, collateral requests, declined applications…',
            colSpan: 2,
          },
        ],
      },
    ],
  },
  {
    slug: 'export-finance-readiness',
    name: 'Export Finance Readiness Tool',
    shortName: 'Export Finance Readiness',
    category: 'trade-finance',
    badge: 'Trade Finance',
    tagline: 'Prepare for ECA-backed export finance with lender expectations.',
    heroTitle: 'Trade Finance',
    heroHighlight: 'Export Readiness',
    heroDescription:
      'Plan export transactions backed by ECAs or trade insurers. Share buyer jurisdictions, payment terms, and contract details so we can outline bank appetite, documentation, and pricing assumptions.',
    highlights: [
      'Assesses ECA eligibility based on buyer location and tenor.',
      'Identifies collateral and guarantee enhancements required.',
      'Provides checklist for compliance and shipping documentation.',
    ],
    timeToComplete: '5 minutes',
    outcome: 'Export finance readiness score with documentation roadmap.',
    ctaLabel: 'Check my export finance readiness',
    successMessage: DEFAULT_SUCCESS_MESSAGE,
    errorMessage: DEFAULT_ERROR_MESSAGE,
    dataPrivacyNote: DEFAULT_DATA_PRIVACY_NOTE,
    sections: [
      createContactSection(),
      {
        id: 'export-transaction',
        title: 'Export transaction snapshot',
        layout: 'two-column',
        fields: [
          {
            name: 'buyerCountry',
            label: 'Buyer country',
            type: 'text',
            placeholder: 'e.g. Saudi Arabia, India, UK…',
          },
          {
            name: 'contractValue',
            label: 'Contract value (AED or USD)',
            type: 'currency',
            placeholder: 'e.g. 9,500,000',
            inputMode: 'decimal',
          },
          {
            name: 'tenorDays',
            label: 'Payment tenor (days)',
            type: 'number',
            placeholder: 'e.g. 180',
            inputMode: 'numeric',
          },
          {
            name: 'incoterms',
            label: 'Incoterms',
            type: 'text',
            placeholder: 'e.g. CIF, FOB, DAP…',
          },
        ],
      },
      {
        id: 'support-structure',
        title: 'Support & structure',
        layout: 'two-column',
        fields: [
          {
            name: 'existingEcaCoverage',
            label: 'Existing ECA coverage',
            type: 'select',
            options: [
              { label: 'Select option', value: '' },
              { label: 'Already insured', value: 'insured' },
              { label: 'Applying', value: 'applying' },
              { label: 'No coverage yet', value: 'none' },
            ],
          },
          {
            name: 'bankPartners',
            label: 'Bank partners engaged',
            type: 'text',
            placeholder: 'e.g. Emirates NBD, HSBC, FAB…',
          },
          {
            name: 'documentationStatus',
            label: 'Documentation status',
            type: 'textarea',
            rows: 3,
            placeholder: 'Draft contract, audited financials, shipping documents, compliance certifications…',
            colSpan: 2,
          },
          {
            name: 'supportNeeded',
            label: 'Support needed from EGF',
            type: 'textarea',
            rows: 3,
            placeholder: 'Arranging ECA cover, lender introductions, structuring term sheets…',
            colSpan: 2,
          },
        ],
      },
    ],
  },
  {
    slug: 'project-finance-readiness-tracker',
    name: 'Project Finance Readiness Tracker',
    shortName: 'Readiness Tracker',
    category: 'project-finance',
    badge: 'Project Finance',
    tagline: 'Track bankability milestones across complex project financings.',
    heroTitle: 'Project Finance',
    heroHighlight: 'Readiness Tracker',
    heroDescription:
      'For sponsors managing large projects, capture progress across equity, contracts, permits, and modelling. Understand bankability gaps before launching lender outreach.',
    highlights: [
      'Summarises status across key bankability pillars.',
      'Identifies missing documentation or approvals for limited recourse financing.',
      'Aligns next steps across advisors, sponsors, and lenders.',
    ],
    timeToComplete: '5 minutes',
    outcome: 'Readiness tracker with priority actions.',
    ctaLabel: 'Track my project readiness',
    successMessage: DEFAULT_SUCCESS_MESSAGE,
    errorMessage: DEFAULT_ERROR_MESSAGE,
    dataPrivacyNote: DEFAULT_DATA_PRIVACY_NOTE,
    sections: [
      createContactSection(),
      {
        id: 'project-milestones',
        title: 'Project milestones',
        layout: 'two-column',
        fields: [
          {
            name: 'financialCloseTarget',
            label: 'Target financial close date',
            type: 'text',
            placeholder: 'e.g. Q1 2027',
          },
          {
            name: 'constructionStart',
            label: 'Construction start date',
            type: 'text',
            placeholder: 'e.g. Q3 2026',
          },
          {
            name: 'sponsorEquityCommitted',
            label: 'Sponsor equity committed (%)',
            type: 'number',
            placeholder: 'e.g. 35',
            inputMode: 'decimal',
          },
          {
            name: 'projectIrr',
            label: 'Project IRR (%)',
            type: 'number',
            placeholder: 'e.g. 14',
            inputMode: 'decimal',
          },
        ],
      },
      {
        id: 'bankability-pillars',
        title: 'Bankability pillars',
        layout: 'two-column',
        fields: [
          {
            name: 'offtakeStatus',
            label: 'Offtake / revenue contract status',
            type: 'select',
            options: [
              { label: 'Select status', value: '' },
              { label: 'Signed', value: 'signed' },
              { label: 'Advanced negotiations', value: 'advanced' },
              { label: 'Drafting', value: 'drafting' },
              { label: 'Not yet started', value: 'not-started' },
            ],
          },
          {
            name: 'epcStatus',
            label: 'EPC contract status',
            type: 'select',
            options: [
              { label: 'Select status', value: '' },
              { label: 'Signed', value: 'signed' },
              { label: 'Preferred bidder', value: 'preferred' },
              { label: 'Negotiating', value: 'negotiating' },
              { label: 'Not yet started', value: 'not-started' },
            ],
          },
          {
            name: 'regulatoryApprovals',
            label: 'Regulatory approvals obtained',
            type: 'textarea',
            rows: 3,
            placeholder: 'Environmental permits, land rights, governmental support letters…',
            colSpan: 2,
          },
          {
            name: 'modelAuditStatus',
            label: 'Financial model audit status',
            type: 'select',
            options: [
              { label: 'Select status', value: '' },
              { label: 'Audited', value: 'audited' },
              { label: 'In progress', value: 'in-progress' },
              { label: 'Planned', value: 'planned' },
              { label: 'Not started', value: 'not-started' },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'development-finance-feasibility',
    name: 'Development Finance Feasibility Scan',
    shortName: 'Development Feasibility',
    category: 'mortgage-real-estate-finance',
    badge: 'Real Estate Finance',
    tagline: 'Check if your development is finance-ready before approaching lenders.',
    heroTitle: 'Mortgage & Real Estate',
    heroHighlight: 'Development Feasibility',
    heroDescription:
      'Gauge the bankability of your development project. Share capex, equity, approvals, and sales velocity so we can outline lender appetite, key gaps, and supporting documentation needed in the UAE.',
    highlights: [
      'Assesses equity commitments versus lender expectations.',
      'Flags approval and permitting gaps before mandate discussions.',
      'Provides checklist for feasibility, valuations, and sales evidence.',
    ],
    timeToComplete: '5 minutes',
    outcome: 'Development finance readiness rating with gap analysis.',
    ctaLabel: 'Check my development readiness',
    successMessage: DEFAULT_SUCCESS_MESSAGE,
    errorMessage: DEFAULT_ERROR_MESSAGE,
    dataPrivacyNote: DEFAULT_DATA_PRIVACY_NOTE,
    sections: [
      createContactSection(),
      {
        id: 'project-basics',
        title: 'Project basics',
        layout: 'two-column',
        fields: [
          {
            name: 'projectName',
            label: 'Project name / code',
            type: 'text',
            placeholder: 'Internal reference or marketing name',
          },
          {
            name: 'projectType',
            label: 'Project type',
            type: 'select',
            options: [
              { label: 'Select project type', value: '' },
              { label: 'Residential development', value: 'residential' },
              { label: 'Commercial development', value: 'commercial' },
              { label: 'Mixed-use development', value: 'mixed-use' },
              { label: 'Hospitality', value: 'hospitality' },
              { label: 'Industrial / logistics', value: 'industrial' },
            ],
          },
          {
            name: 'totalCapex',
            label: 'Total capex (AED)',
            type: 'currency',
            placeholder: 'e.g. 180,000,000',
            inputMode: 'decimal',
          },
          {
            name: 'equityCommittedPercent',
            label: 'Equity committed (%)',
            type: 'number',
            placeholder: 'e.g. 30',
            inputMode: 'decimal',
          },
          {
            name: 'projectLocation',
            label: 'Location (emirate / community)',
            type: 'text',
            placeholder: 'e.g. Dubai – Business Bay',
            colSpan: 2,
          },
        ],
      },
      {
        id: 'status-sales',
        title: 'Status & sales',
        layout: 'two-column',
        fields: [
          {
            name: 'approvalStatus',
            label: 'Masterplan / authority approvals status',
            type: 'select',
            options: [
              { label: 'Select status', value: '' },
              { label: 'All approvals obtained', value: 'obtained' },
              { label: 'Submitted / in review', value: 'submitted' },
              { label: 'In preparation', value: 'preparation' },
            ],
          },
          {
            name: 'targetCompletion',
            label: 'Target completion date',
            type: 'text',
            placeholder: 'e.g. Q4 2026',
          },
          {
            name: 'presalesStatus',
            label: 'Pre-sales / leasing status',
            type: 'select',
            options: [
              { label: 'Select status', value: '' },
              { label: 'Off-plan launched', value: 'launched' },
              { label: 'LOIs signed', value: 'loi' },
              { label: 'Under negotiation', value: 'negotiation' },
              { label: 'No pre-sales yet', value: 'none' },
            ],
          },
          {
            name: 'salesVelocity',
            label: 'Sales/leasing velocity (%)',
            type: 'number',
            placeholder: 'e.g. 45',
            inputMode: 'decimal',
          },
          {
            name: 'supportNeeded',
            label: 'Where do you need support?',
            type: 'textarea',
            rows: 3,
            placeholder: 'Feasibility refresh, valuation updates, lender introductions…',
            colSpan: 2,
          },
        ],
      },
    ],
  },
  {
    slug: 'bridge-loan-readiness',
    name: 'Bridge Loan Readiness Checker',
    shortName: 'Bridge Loan Readiness',
    category: 'mortgage-real-estate-finance',
    badge: 'Real Estate Finance',
    tagline: 'Confirm if your property qualifies for short-term bridge financing.',
    heroTitle: 'Mortgage & Real Estate',
    heroHighlight: 'Bridge Loan Readiness',
    heroDescription:
      'Evaluate whether your asset can secure bridge financing ahead of refinance or sale. Share valuation, exit plans, and documentation so we can map UAE lender appetite and timeline expectations.',
    highlights: [
      'Benchmarks eligible loan size vs current appraised value.',
      'Assesses exit strategy credibility and timeline.',
      'Outlines immediate documentation to line up bridge lenders.',
    ],
    timeToComplete: '3 minutes',
    outcome: 'Bridge loan viability score with next steps.',
    ctaLabel: 'Check my bridge loan options',
    successMessage: DEFAULT_SUCCESS_MESSAGE,
    errorMessage: DEFAULT_ERROR_MESSAGE,
    dataPrivacyNote: DEFAULT_DATA_PRIVACY_NOTE,
    sections: [
      createContactSection(),
      {
        id: 'asset-snapshot',
        title: 'Asset snapshot',
        layout: 'two-column',
        fields: [
          {
            name: 'assetType',
            label: 'Asset type',
            type: 'select',
            options: [
              { label: 'Select asset type', value: '' },
              { label: 'Completed income-producing', value: 'stabilised' },
              { label: 'Under renovation', value: 'renovation' },
              { label: 'Land with approvals', value: 'land' },
            ],
          },
          {
            name: 'currentValuation',
            label: 'Latest valuation (AED)',
            type: 'currency',
            placeholder: 'e.g. 24,000,000',
            inputMode: 'decimal',
          },
          {
            name: 'outstandingDebt',
            label: 'Outstanding debt (AED)',
            type: 'currency',
            placeholder: 'e.g. 12,500,000',
            inputMode: 'decimal',
          },
          {
            name: 'requiredBridgeAmount',
            label: 'Bridge amount required (AED)',
            type: 'currency',
            placeholder: 'e.g. 8,000,000',
            inputMode: 'decimal',
          },
        ],
      },
      {
        id: 'exit-plan',
        title: 'Exit plan',
        layout: 'two-column',
        fields: [
          {
            name: 'exitStrategy',
            label: 'Primary exit strategy',
            type: 'select',
            options: [
              { label: 'Select exit', value: '' },
              { label: 'Sale of asset', value: 'sale' },
              { label: 'Refinance with term loan', value: 'refinance' },
              { label: 'Equity injection', value: 'equity' },
            ],
          },
          {
            name: 'exitTimeline',
            label: 'Expected exit timeline',
            type: 'text',
            placeholder: 'e.g. 9–12 months',
          },
          {
            name: 'rentalIncome',
            label: 'Current monthly rental income (AED)',
            type: 'currency',
            placeholder: 'e.g. 280,000',
            inputMode: 'decimal',
          },
          {
            name: 'documentationReady',
            label: 'Documentation ready to share',
            type: 'textarea',
            rows: 3,
            placeholder: 'Valuation report, lease agreements, title deed, feasibility study…',
            colSpan: 2,
          },
        ],
      },
    ],
  },
  {
    slug: 'rental-income-refinance-check',
    name: 'Rental Income Refinance Check',
    shortName: 'Rental Refinance',
    category: 'mortgage-real-estate-finance',
    badge: 'Real Estate Finance',
    tagline: 'Test LTV and DSCR metrics for refinancing income properties.',
    heroTitle: 'Mortgage & Real Estate',
    heroHighlight: 'Refinance Check',
    heroDescription:
      'Understand how lenders will view your income-producing property for refinance. Provide NOI, tenancy data, and refinance goals to benchmark LTV, DSCR, and likely pricing.',
    highlights: [
      'Benchmarks DSCR against bank thresholds.',
      'Estimates refinance proceeds based on NOI and value.',
      'Prepares checklist for valuation, tenancy, and compliance documents.',
    ],
    timeToComplete: '4 minutes',
    outcome: 'Refinance eligibility band with DSCR diagnostics.',
    ctaLabel: 'Assess my refinance options',
    successMessage: DEFAULT_SUCCESS_MESSAGE,
    errorMessage: DEFAULT_ERROR_MESSAGE,
    dataPrivacyNote: DEFAULT_DATA_PRIVACY_NOTE,
    sections: [
      createContactSection(),
      {
        id: 'property-income',
        title: 'Property & income profile',
        layout: 'two-column',
        fields: [
          {
            name: 'propertyType',
            label: 'Property type',
            type: 'select',
            options: [
              { label: 'Select property type', value: '' },
              { label: 'Office', value: 'office' },
              { label: 'Retail', value: 'retail' },
              { label: 'Residential portfolio', value: 'residential' },
              { label: 'Industrial', value: 'industrial' },
            ],
          },
          {
            name: 'currentValuation',
            label: 'Current valuation (AED)',
            type: 'currency',
            placeholder: 'e.g. 22,000,000',
            inputMode: 'decimal',
          },
          {
            name: 'grossMonthlyIncome',
            label: 'Gross monthly rental income (AED)',
            type: 'currency',
            placeholder: 'e.g. 350,000',
            inputMode: 'decimal',
          },
          {
            name: 'operatingExpenses',
            label: 'Monthly operating expenses (AED)',
            type: 'currency',
            placeholder: 'e.g. 95,000',
            inputMode: 'decimal',
          },
          {
            name: 'occupancyRate',
            label: 'Occupancy rate (%)',
            type: 'number',
            placeholder: 'e.g. 87',
            inputMode: 'decimal',
          },
          {
            name: 'leaseRollOver',
            label: 'Upcoming lease rollovers (months)',
            type: 'text',
            placeholder: 'e.g. 30% within 12 months',
          },
        ],
      },
      {
        id: 'refinance-goals',
        title: 'Refinance objectives',
        layout: 'two-column',
        fields: [
          {
            name: 'refinanceAmount',
            label: 'Target refinance amount (AED)',
            type: 'currency',
            placeholder: 'e.g. 12,000,000',
            inputMode: 'decimal',
          },
          {
            name: 'desiredLtv',
            label: 'Desired LTV (%)',
            type: 'number',
            placeholder: 'e.g. 65',
            inputMode: 'decimal',
          },
          {
            name: 'rateExpectation',
            label: 'Rate expectation (bps over benchmark)',
            type: 'number',
            placeholder: 'e.g. 275',
            inputMode: 'decimal',
          },
          {
            name: 'useOfProceeds',
            label: 'Use of proceeds',
            type: 'textarea',
            rows: 3,
            placeholder: 'Debt consolidation, equity release, acquisition, capex upgrades…',
            colSpan: 2,
          },
        ],
      },
    ],
  },
  {
    slug: 'portfolio-repricing-review',
    name: 'Portfolio Repricing Review',
    shortName: 'Portfolio Repricing',
    category: 'mortgage-real-estate-finance',
    badge: 'Real Estate Finance',
    tagline: 'Review multi-asset portfolios for repricing or consolidation.',
    heroTitle: 'Mortgage & Real Estate',
    heroHighlight: 'Portfolio Review',
    heroDescription:
      'For landlords with multiple assets, benchmark your financing stack for repricing or consolidation. Provide asset mix, lender exposure, and pricing to surface opportunities with UAE lenders.',
    highlights: [
      'Aggregates asset-level data into a portfolio repricing summary.',
      'Identifies lenders likely to consolidate exposures.',
      'Prioritises documentation needed for mandate refresh.',
    ],
    timeToComplete: '4 minutes',
    outcome: 'Portfolio repricing strategy outline.',
    ctaLabel: 'Review my portfolio financing',
    successMessage: DEFAULT_SUCCESS_MESSAGE,
    errorMessage: DEFAULT_ERROR_MESSAGE,
    dataPrivacyNote: DEFAULT_DATA_PRIVACY_NOTE,
    sections: [
      createContactSection('Tell us who is coordinating the portfolio review.'),
      {
        id: 'portfolio-summary',
        title: 'Portfolio summary',
        layout: 'two-column',
        fields: [
          {
            name: 'numberOfAssets',
            label: 'Number of assets',
            type: 'number',
            placeholder: 'e.g. 12',
            inputMode: 'numeric',
          },
          {
            name: 'portfolioValue',
            label: 'Portfolio value (AED)',
            type: 'currency',
            placeholder: 'e.g. 420,000,000',
            inputMode: 'decimal',
          },
          {
            name: 'assetMix',
            label: 'Asset mix',
            type: 'textarea',
            rows: 3,
            placeholder: 'e.g. 6 offices, 3 retail, 2 hospitality, 1 industrial…',
            colSpan: 2,
          },
          {
            name: 'weightedOccupancy',
            label: 'Weighted occupancy (%)',
            type: 'number',
            placeholder: 'e.g. 89',
            inputMode: 'decimal',
          },
          {
            name: 'weightedNoi',
            label: 'Weighted annual NOI (AED)',
            type: 'currency',
            placeholder: 'e.g. 58,000,000',
            inputMode: 'decimal',
          },
        ],
      },
      {
        id: 'lender-exposure',
        title: 'Lender exposure & goals',
        layout: 'two-column',
        fields: [
          {
            name: 'currentLenders',
            label: 'Current lenders (top 3)',
            type: 'textarea',
            rows: 3,
            placeholder: 'Bank A – AED 120m @ +325bps, Bank B – AED 80m @ +290bps…',
            colSpan: 2,
          },
          {
            name: 'averageMargin',
            label: 'Average margin over benchmark (bps)',
            type: 'number',
            placeholder: 'e.g. 315',
            inputMode: 'decimal',
          },
          {
            name: 'repricingObjectives',
            label: 'Repricing / consolidation objectives',
            type: 'textarea',
            rows: 3,
            placeholder: 'Reduce lenders to two, extend maturities, release collateral, switch to Islamic structure…',
            colSpan: 2,
          },
          {
            name: 'upcomingMaturities',
            label: 'Upcoming maturities (12–24 months)',
            type: 'text',
            placeholder: 'e.g. AED 65m due Q1 2026, AED 40m due Q3 2026',
          },
        ],
      },
    ],
  },
  {
    slug: 'working-capital-consolidation',
    name: 'Working Capital Consolidation Planner',
    shortName: 'Consolidation Planner',
    category: 'working-capital-credit',
    badge: 'Working Capital',
    tagline: 'Compare current facility mix against a consolidated structure.',
    heroTitle: 'Working Capital',
    heroHighlight: 'Consolidation Planner',
    heroDescription:
      'Simplify your working capital stack by testing how overdrafts, receivables finance, and guarantees could be consolidated. Share utilisation, pricing, and collateral so we can recommend structures that match UAE lender appetite.',
    highlights: [
      'Side-by-side comparison of existing vs consolidated limits.',
      'Indicative pricing and collateral impact for the target structure.',
      'Checklist for engaging banks and private credit funds.',
    ],
    timeToComplete: '4 minutes',
    outcome: 'Consolidation roadmap with pricing benchmarks.',
    ctaLabel: 'Plan my consolidation strategy',
    successMessage: DEFAULT_SUCCESS_MESSAGE,
    errorMessage: DEFAULT_ERROR_MESSAGE,
    dataPrivacyNote: DEFAULT_DATA_PRIVACY_NOTE,
    sections: [
      createContactSection(),
      {
        id: 'facility-mix',
        title: 'Current facility mix',
        layout: 'two-column',
        fields: [
          {
            name: 'overdraftLimit',
            label: 'Total overdraft limit (AED)',
            type: 'currency',
            placeholder: 'e.g. 1,500,000',
            inputMode: 'decimal',
          },
          {
            name: 'invoiceDiscountingLimit',
            label: 'Invoice discounting limit (AED)',
            type: 'currency',
            placeholder: 'e.g. 3,000,000',
            inputMode: 'decimal',
          },
          {
            name: 'guaranteeLimit',
            label: 'Bank guarantee / SBLC limit (AED)',
            type: 'currency',
            placeholder: 'e.g. 2,000,000',
            inputMode: 'decimal',
          },
          {
            name: 'relationshipBanks',
            label: 'Number of relationship banks',
            type: 'number',
            placeholder: 'e.g. 3',
            inputMode: 'numeric',
          },
          {
            name: 'currentMarginEibor',
            label: 'Weighted average margin over EIBOR (bps)',
            type: 'number',
            placeholder: 'e.g. 375',
            inputMode: 'decimal',
          },
          {
            name: 'collateralSummary',
            label: 'Collateral pledged today',
            type: 'textarea',
            rows: 2,
            placeholder: 'Receivables assignment, property, inventory, cash margin…',
            colSpan: 2,
          },
        ],
      },
      {
        id: 'consolidation-objectives',
        title: 'Consolidation objectives',
        layout: 'two-column',
        fields: [
          {
            name: 'targetLimit',
            label: 'Target consolidated limit (AED)',
            type: 'currency',
            placeholder: 'e.g. 6,000,000',
            inputMode: 'decimal',
          },
          {
            name: 'desiredTenorMonths',
            label: 'Desired revolving tenor (months)',
            type: 'number',
            placeholder: 'e.g. 24',
            inputMode: 'numeric',
          },
          {
            name: 'priorityOutcomes',
            label: 'Priority outcomes',
            type: 'textarea',
            rows: 3,
            placeholder: 'Lower pricing, reduced collateral, single bank relationship, faster drawdowns…',
            colSpan: 2,
          },
          {
            name: 'recentBankFeedback',
            label: 'Recent bank feedback',
            type: 'textarea',
            rows: 3,
            placeholder: 'Renewal conditions, pricing offers, covenant pressure…',
            colSpan: 2,
          },
        ],
      },
    ],
  },
  {
    slug: 'seasonal-cashflow-buffer',
    name: 'Seasonal Cashflow Buffer Estimator',
    shortName: 'Cashflow Buffer',
    category: 'working-capital-credit',
    badge: 'Working Capital',
    tagline: 'Size the buffer you need to cover seasonal working capital swings.',
    heroTitle: 'Working Capital',
    heroHighlight: 'Seasonal Buffer Estimator',
    heroDescription:
      'Plan for peak trading periods by mapping monthly inflows, outflows, and inventory builds. We estimate the buffer facility required and suggest the best instruments to cover seasonal gaps before you engage lenders.',
    highlights: [
      'Identifies monthly cash surplus/deficit across your trading cycle.',
      'Benchmarks optimal mix of overdraft, invoice discounting, and supplier finance.',
      'Action plan for timely renewal discussions with lenders.',
    ],
    timeToComplete: '3 minutes',
    outcome: 'Seasonal buffer sizing with facility recommendations.',
    ctaLabel: 'Estimate my seasonal buffer',
    successMessage: DEFAULT_SUCCESS_MESSAGE,
    errorMessage: DEFAULT_ERROR_MESSAGE,
    dataPrivacyNote: DEFAULT_DATA_PRIVACY_NOTE,
    sections: [
      createContactSection(),
      {
        id: 'seasonality-profile',
        title: 'Seasonality profile',
        layout: 'two-column',
        fields: [
          {
            name: 'peakMonths',
            label: 'Peak trading months',
            type: 'text',
            placeholder: 'e.g. Sep–Dec',
          },
          {
            name: 'slowMonths',
            label: 'Slow trading months',
            type: 'text',
            placeholder: 'e.g. Jan–Feb',
          },
          {
            name: 'monthlyHighRevenue',
            label: 'Monthly revenue in peak months (AED)',
            type: 'currency',
            placeholder: 'e.g. 4,800,000',
            inputMode: 'decimal',
          },
          {
            name: 'monthlyLowRevenue',
            label: 'Monthly revenue in slow months (AED)',
            type: 'currency',
            placeholder: 'e.g. 1,900,000',
            inputMode: 'decimal',
          },
          {
            name: 'averageCollectionDays',
            label: 'Average receivable days',
            type: 'number',
            placeholder: 'e.g. 65',
            inputMode: 'numeric',
          },
          {
            name: 'averagePayableDays',
            label: 'Average payable days',
            type: 'number',
            placeholder: 'e.g. 45',
            inputMode: 'numeric',
          },
        ],
      },
      {
        id: 'buffer-drivers',
        title: 'Buffer drivers',
        layout: 'two-column',
        fields: [
          {
            name: 'largestInventoryBuild',
            label: 'Largest inventory build (AED)',
            type: 'currency',
            placeholder: 'e.g. 900,000',
            inputMode: 'decimal',
          },
          {
            name: 'seasonalPayroll',
            label: 'Seasonal payroll uplift (AED)',
            type: 'currency',
            placeholder: 'e.g. 350,000',
            inputMode: 'decimal',
          },
          {
            name: 'existingBufferFacilities',
            label: 'Existing buffer facilities',
            type: 'text',
            placeholder: 'Overdraft, invoice discounting, supplier finance…',
            colSpan: 2,
          },
          {
            name: 'supportNeeded',
            label: 'Support required from EGF',
            type: 'textarea',
            rows: 3,
            placeholder: 'Negotiating seasonal top-ups, arranging standby facilities, lender introductions…',
            colSpan: 2,
          },
        ],
      },
    ],
  },
  {
    slug: 'revolving-repricing-check',
    name: 'Revolving Facility Repricing Check',
    shortName: 'Repricing Check',
    category: 'working-capital-credit',
    badge: 'Working Capital',
    tagline: 'Gauge if utilisation and collateral support repricing your limits.',
    heroTitle: 'Working Capital',
    heroHighlight: 'Repricing Check',
    heroDescription:
      'Assess whether your revolving facilities can be repriced or restructured. Provide utilisation patterns, pricing, and collateral so we can benchmark against current lender mandates and suggest negotiation levers.',
    highlights: [
      'Benchmarks current pricing against live market ranges.',
      'Flags utilisation and collateral levers to support repricing.',
      'Recommends negotiation steps with core banking partners.',
    ],
    timeToComplete: '3 minutes',
    outcome: 'Repricing eligibility summary with lender signals.',
    ctaLabel: 'Check my repricing potential',
    successMessage: DEFAULT_SUCCESS_MESSAGE,
    errorMessage: DEFAULT_ERROR_MESSAGE,
    dataPrivacyNote: DEFAULT_DATA_PRIVACY_NOTE,
    sections: [
      createContactSection(),
      {
        id: 'facility-snapshot',
        title: 'Facility snapshot',
        layout: 'two-column',
        fields: [
          {
            name: 'facilityType',
            label: 'Facility type',
            type: 'select',
            options: [
              { label: 'Select facility type', value: '' },
              { label: 'Overdraft', value: 'overdraft' },
              { label: 'Revolving credit', value: 'revolver' },
              { label: 'Short-term loan', value: 'short-term-loan' },
              { label: 'Syndicated revolver', value: 'syndicated' },
            ],
          },
          {
            name: 'currentMargin',
            label: 'Current margin over EIBOR (bps)',
            type: 'number',
            placeholder: 'e.g. 325',
            inputMode: 'decimal',
          },
          {
            name: 'averageUtilisation',
            label: 'Average utilisation (%)',
            type: 'number',
            placeholder: 'e.g. 62',
            inputMode: 'decimal',
          },
          {
            name: 'remainingTenorMonths',
            label: 'Remaining tenor (months)',
            type: 'number',
            placeholder: 'e.g. 18',
            inputMode: 'numeric',
          },
          {
            name: 'collateralType',
            label: 'Collateral pledged',
            type: 'text',
            placeholder: 'Receivables, inventory, property, cash margin…',
            colSpan: 2,
          },
        ],
      },
      {
        id: 'repricing-goals',
        title: 'Repricing goals',
        layout: 'two-column',
        fields: [
          {
            name: 'targetMargin',
            label: 'Target margin (bps)',
            type: 'number',
            placeholder: 'e.g. 250',
            inputMode: 'decimal',
          },
          {
            name: 'repricingTimeline',
            label: 'Preferred repricing timeline',
            type: 'text',
            placeholder: 'e.g. Within next renewal cycle',
          },
          {
            name: 'bankFeedback',
            label: 'Most recent bank feedback',
            type: 'textarea',
            rows: 3,
            placeholder: 'Renewal discussions, covenants, collateral requests…',
            colSpan: 2,
          },
          {
            name: 'supportAreas',
            label: 'Where do you need support?',
            type: 'textarea',
            rows: 3,
            placeholder: 'Benchmarking, lender introductions, documentation refresh…',
            colSpan: 2,
          },
        ],
      },
    ],
  },
  {
    slug: 'liquidity-runway-stress',
    name: 'Liquidity Runway Stress Test',
    shortName: 'Runway Stress Test',
    category: 'working-capital-credit',
    badge: 'Working Capital',
    tagline: 'Model how long your cash runway lasts under stress scenarios.',
    heroTitle: 'Working Capital',
    heroHighlight: 'Stress Test',
    heroDescription:
      'Benchmark the resilience of your cash runway against downside trading scenarios. Provide cash position, fixed costs, and committed pipeline so we can highlight mitigation options before liquidity pressure builds.',
    highlights: [
      'Calculates stressed cash runway with and without new facilities.',
      'Flags gaps in contingency planning and collateral headroom.',
      'Advisory checklist for immediate liquidity actions.',
    ],
    timeToComplete: '3 minutes',
    outcome: 'Stressed liquidity runway with mitigation checklist.',
    ctaLabel: 'Stress test my liquidity',
    successMessage: DEFAULT_SUCCESS_MESSAGE,
    errorMessage: DEFAULT_ERROR_MESSAGE,
    dataPrivacyNote: DEFAULT_DATA_PRIVACY_NOTE,
    sections: [
      createContactSection(),
      {
        id: 'runway-basics',
        title: 'Runway basics',
        layout: 'two-column',
        fields: [
          {
            name: 'cashOnHand',
            label: 'Cash on hand (AED)',
            type: 'currency',
            placeholder: 'e.g. 2,400,000',
            inputMode: 'decimal',
          },
          {
            name: 'monthlyFixedCosts',
            label: 'Monthly fixed costs (AED)',
            type: 'currency',
            placeholder: 'e.g. 750,000',
            inputMode: 'decimal',
          },
          {
            name: 'variableCostRatio',
            label: 'Variable cost ratio (% of revenue)',
            type: 'number',
            placeholder: 'e.g. 48',
            inputMode: 'decimal',
          },
          {
            name: 'availableFacilities',
            label: 'Undrawn facilities available (AED)',
            type: 'currency',
            placeholder: 'e.g. 1,200,000',
            inputMode: 'decimal',
          },
          {
            name: 'pipelineContracts',
            label: 'Confirmed pipeline contracts (AED)',
            type: 'currency',
            placeholder: 'e.g. 3,500,000',
            inputMode: 'decimal',
          },
          {
            name: 'stressHorizonMonths',
            label: 'Stress horizon (months)',
            type: 'number',
            placeholder: 'e.g. 6',
            inputMode: 'numeric',
          },
        ],
      },
      {
        id: 'downside-scenarios',
        title: 'Downside scenarios',
        layout: 'two-column',
        fields: [
          {
            name: 'revenueDropPercent',
            label: 'Revenue drop assumption (%)',
            type: 'number',
            placeholder: 'e.g. 25',
            inputMode: 'decimal',
          },
          {
            name: 'collectionDelay',
            label: 'Collections delay (days)',
            type: 'number',
            placeholder: 'e.g. +20 days',
            inputMode: 'numeric',
          },
          {
            name: 'mitigationActions',
            label: 'Mitigation actions planned',
            type: 'textarea',
            rows: 3,
            placeholder: 'Cost rationalisation, standby facilities, equity top-ups, asset sales…',
            colSpan: 2,
          },
          {
            name: 'additionalNotes',
            label: 'Anything else we should know?',
            type: 'textarea',
            rows: 3,
            placeholder: 'Covenant headroom, lender discussions scheduled, internal approvals…',
            colSpan: 2,
          },
        ],
      },
    ],
  },
  {
    slug: 'bill-discounting',
    name: 'Bill Discounting / Receivables Estimator',
    shortName: 'Bill Discounting',
    category: 'bill-discounting-receivables',
    badge: 'Receivables Finance',
    tagline: 'Estimate how much cash you can unlock from invoices.',
    heroTitle: 'Bill Discounting',
    heroHighlight: 'Receivables Estimator',
    heroDescription:
      'Unlock liquidity tied up in invoices. Share your receivables profile and buyer mix so we can estimate discounting limits and cost ranges aligned with UAE factoring partners.',
    highlights: [
      'Indicative financing limit based on receivables turnover.',
      'Estimated discounting cost (% per 30/60/90 days).',
      'Risk notes on overdue receivables and buyer concentration.',
    ],
    timeToComplete: '3 minutes',
    outcome: 'Indicative limit + discount cost range.',
    ctaLabel: 'Get my receivables assessment',
    successMessage: DEFAULT_SUCCESS_MESSAGE,
    errorMessage: DEFAULT_ERROR_MESSAGE,
    dataPrivacyNote: DEFAULT_DATA_PRIVACY_NOTE,
    sections: [
      {
        id: 'contact-details',
        title: 'Contact details',
        layout: 'two-column',
        fields: [
          {
            name: 'fullName',
            label: 'Your full name',
            type: 'text',
            required: true,
            placeholder: 'e.g. CEO / Finance Director',
            autoComplete: 'name',
          },
          {
            name: 'companyName',
            label: 'Company name',
            type: 'text',
            required: true,
            placeholder: 'Registered trade name in UAE',
            autoComplete: 'organization',
          },
          {
            name: 'email',
            label: 'Work email',
            type: 'email',
            required: true,
            placeholder: 'you@company.com',
            autoComplete: 'email',
          },
          {
            name: 'phone',
            label: 'Mobile / WhatsApp',
            type: 'tel',
            placeholder: '+971-5x-xxx-xxxx',
            autoComplete: 'tel',
          },
        ],
      },
      {
        id: 'invoice-profile',
        title: 'Receivables profile',
        layout: 'two-column',
        fields: [
          {
            name: 'averageInvoiceSize',
            label: 'Average invoice size (AED)',
            type: 'currency',
            required: true,
            placeholder: 'e.g. 85,000',
            inputMode: 'decimal',
          },
          {
            name: 'monthlyInvoiceVolume',
            label: 'Monthly invoice volume (AED)',
            type: 'currency',
            required: true,
            placeholder: 'e.g. 1,200,000',
            inputMode: 'decimal',
          },
          {
            name: 'buyerMarkets',
            label: 'Buyer markets',
            type: 'text',
            placeholder: 'UAE, GCC, Asia, Europe, Africa',
            colSpan: 2,
          },
          {
            name: 'paymentTerms',
            label: 'Average payment terms (days)',
            type: 'text',
            placeholder: 'e.g. 60 days',
          },
          {
            name: 'overduePercentage',
            label: '% invoices overdue >30 days',
            type: 'select',
            options: [
              { label: 'Select range', value: '' },
              { label: 'Less than 10%', value: 'lt-10' },
              { label: '10–25%', value: '10-25' },
              { label: '25–40%', value: '25-40' },
              { label: 'More than 40%', value: 'gt-40' },
            ],
          },
          {
            name: 'existingFactoring',
            label: 'Existing factoring arrangements',
            type: 'select',
            options: [
              { label: 'Select option', value: '' },
              { label: 'None', value: 'none' },
              { label: 'Bank factoring', value: 'bank' },
              { label: 'Private factoring', value: 'private' },
              { label: 'Combination', value: 'mix' },
            ],
          },
        ],
      },
      {
        id: 'risk-notes',
        title: 'Risk & usage notes',
        layout: 'two-column',
        fields: [
          {
            name: 'buyerCreditQuality',
            label: 'Buyer credit quality (if known)',
            type: 'textarea',
            rows: 2,
            placeholder: 'Investment grade, unrated, mix of SMEs…',
          },
          {
            name: 'useOfFunds',
            label: 'How will funds be used?',
            type: 'textarea',
            rows: 2,
            placeholder: 'Supplier payments, growth inventory, payroll…',
          },
          {
            name: 'keyTradingPartners',
            label: 'Key trading partners / top buyers',
            type: 'textarea',
            rows: 3,
            placeholder: 'Top 5 buyer names, geographies, contract terms…',
            colSpan: 2,
          },
        ],
      },
    ],
  },
  {
    slug: 'mortgage-finance',
    name: 'Mortgage & Real Estate Finance Readiness',
    shortName: 'Mortgage Finance',
    category: 'mortgage-real-estate-finance',
    badge: 'Real Estate Finance',
    tagline: 'Assess LTV, DSCR and refinance options for your property.',
    heroTitle: 'Mortgage & Real Estate',
    heroHighlight: 'Finance Readiness',
    heroDescription:
      'Plan your next commercial property move with clarity on loan-to-value, DSCR, and refinance options. Share asset and income details so we can respond with lender expectations built for the UAE market.',
    highlights: [
      'LTV and DSCR readiness rating (Ready / Needs Preparation / Additional Equity).',
      'Valuation & legal document checklist for banks and private lenders.',
      'Timeline guidance for appraisal, approval, and disbursement.',
    ],
    timeToComplete: '4–5 minutes',
    outcome: 'Indicative LTV band + bankability score.',
    ctaLabel: 'Get my readiness assessment',
    successMessage: DEFAULT_SUCCESS_MESSAGE,
    errorMessage: DEFAULT_ERROR_MESSAGE,
    dataPrivacyNote: DEFAULT_DATA_PRIVACY_NOTE,
    sections: [
      {
        id: 'contact-details',
        title: 'Contact details',
        layout: 'two-column',
        fields: [
          {
            name: 'fullName',
            label: 'Your full name',
            type: 'text',
            required: true,
            placeholder: 'e.g. CEO / Finance Director',
            autoComplete: 'name',
          },
          {
            name: 'companyName',
            label: 'Company name',
            type: 'text',
            required: true,
            placeholder: 'Registered trade name in UAE',
            autoComplete: 'organization',
          },
          {
            name: 'email',
            label: 'Work email',
            type: 'email',
            required: true,
            placeholder: 'you@company.com',
            autoComplete: 'email',
          },
          {
            name: 'phone',
            label: 'Mobile / WhatsApp',
            type: 'tel',
            placeholder: '+971-5x-xxx-xxxx',
            autoComplete: 'tel',
          },
        ],
      },
      {
        id: 'asset-profile',
        title: 'Asset profile',
        layout: 'two-column',
        fields: [
          {
            name: 'propertyType',
            label: 'Property type',
            type: 'select',
            required: true,
            options: [
              { label: 'Select property type', value: '' },
              { label: 'Office', value: 'office' },
              { label: 'Retail', value: 'retail' },
              { label: 'Warehouse / industrial', value: 'warehouse' },
              { label: 'Mixed-use', value: 'mixed-use' },
              { label: 'Hospitality', value: 'hospitality' },
              { label: 'Land acquisition', value: 'land' },
            ],
          },
          {
            name: 'estimatedValue',
            label: 'Estimated property value (AED)',
            type: 'currency',
            required: true,
            placeholder: 'e.g. 15,000,000',
            inputMode: 'decimal',
          },
          {
            name: 'emirate',
            label: 'Emirate / region',
            type: 'text',
            placeholder: 'Dubai, Abu Dhabi, Northern Emirates…',
            colSpan: 2,
          },
        ],
      },
      {
        id: 'income-leverage',
        title: 'Income & leverage profile',
        layout: 'two-column',
        fields: [
          {
            name: 'rentalIncome',
            label: 'Net rental income (monthly AED)',
            type: 'currency',
            placeholder: 'e.g. 180,000',
            inputMode: 'decimal',
          },
          {
            name: 'desiredLtv',
            label: 'Desired LTV (%)',
            type: 'number',
            placeholder: 'e.g. 70',
            inputMode: 'decimal',
          },
          {
            name: 'purpose',
            label: 'Purpose of financing',
            type: 'select',
            options: [
              { label: 'Select purpose', value: '' },
              { label: 'Acquisition', value: 'acquisition' },
              { label: 'Refinance', value: 'refinance' },
              { label: 'Equity release', value: 'equity-release' },
              { label: 'Development', value: 'development' },
            ],
          },
          {
            name: 'exitStrategy',
            label: 'Exit strategy',
            type: 'textarea',
            rows: 2,
            placeholder: 'Hold, refinance, sale upon stabilization…',
          },
        ],
      },
      {
        id: 'existing-lending',
        title: 'Existing lending & performance',
        layout: 'two-column',
        fields: [
          {
            name: 'currentLender',
            label: 'Current lender (if any)',
            type: 'text',
            placeholder: 'Bank / lender name',
          },
          {
            name: 'outstandingBalance',
            label: 'Outstanding balance (AED)',
            type: 'currency',
            placeholder: 'e.g. 6,200,000',
            inputMode: 'decimal',
          },
          {
            name: 'repaymentHistory',
            label: 'Repayment history notes',
            type: 'textarea',
            rows: 2,
            placeholder: 'Any missed payments, restructuring, etc.',
          },
        ],
      },
    ],
  },
  {
    slug: 'trade-finance',
    name: 'Trade & LC Cost Estimator',
    shortName: 'Trade Finance',
    category: 'trade-finance',
    badge: 'Trade Finance',
    tagline: 'Model LC/SBLC costs and collateral expectations.',
    heroTitle: 'Trade & LC',
    heroHighlight: 'Cost Estimator',
    heroDescription:
      'Model the fees, collateral, and timelines for issuing Letters of Credit, Standby LCs, or guarantees. Enter your trade specifics and we’ll map bank and private trade finance options aligned to your transaction.',
    highlights: [
      'Expected cost range (issuance, confirmation, negotiation fees).',
      'Indicative collateral requirement (cash margin %, security).',
      'Documentation and compliance checklist (UCP 600, AML, sanctioned trade).',
    ],
    timeToComplete: '4 minutes',
    outcome: 'Cost range + security expectations.',
    ctaLabel: 'Get my trade finance assessment',
    successMessage: DEFAULT_SUCCESS_MESSAGE,
    errorMessage: DEFAULT_ERROR_MESSAGE,
    dataPrivacyNote: DEFAULT_DATA_PRIVACY_NOTE,
    sections: [
      {
        id: 'contact-details',
        title: 'Contact details',
        layout: 'two-column',
        fields: [
          {
            name: 'fullName',
            label: 'Your full name',
            type: 'text',
            required: true,
            placeholder: 'e.g. CEO / Finance Director',
            autoComplete: 'name',
          },
          {
            name: 'companyName',
            label: 'Company name',
            type: 'text',
            required: true,
            placeholder: 'Registered trade name in UAE',
            autoComplete: 'organization',
          },
          {
            name: 'email',
            label: 'Work email',
            type: 'email',
            required: true,
            placeholder: 'you@company.com',
            autoComplete: 'email',
          },
          {
            name: 'phone',
            label: 'Mobile / WhatsApp',
            type: 'tel',
            placeholder: '+971-5x-xxx-xxxx',
            autoComplete: 'tel',
          },
        ],
      },
      {
        id: 'transaction-basics',
        title: 'Transaction basics',
        layout: 'two-column',
        fields: [
          {
            name: 'lcType',
            label: 'Instrument type',
            type: 'select',
            required: true,
            options: [
              { label: 'Select instrument', value: '' },
              { label: 'Letter of Credit (Sight)', value: 'sight' },
              { label: 'Letter of Credit (Usance)', value: 'usance' },
              { label: 'Standby Letter of Credit', value: 'standby' },
              { label: 'Bank Guarantee', value: 'guarantee' },
            ],
          },
          {
            name: 'transactionAmount',
            label: 'Transaction amount',
            type: 'currency',
            required: true,
            placeholder: 'e.g. 750,000',
            inputMode: 'decimal',
          },
          {
            name: 'currency',
            label: 'Currency',
            type: 'select',
            options: [
              { label: 'AED', value: 'AED' },
              { label: 'USD', value: 'USD' },
              { label: 'EUR', value: 'EUR' },
              { label: 'GBP', value: 'GBP' },
            ],
            defaultValue: 'AED',
          },
          {
            name: 'tenorDays',
            label: 'Tenor (days)',
            type: 'number',
            placeholder: 'e.g. 90',
            inputMode: 'numeric',
          },
        ],
      },
      {
        id: 'counterparty-collateral',
        title: 'Counterparty & collateral',
        layout: 'two-column',
        fields: [
          {
            name: 'beneficiaryCountry',
            label: 'Beneficiary country',
            type: 'text',
            placeholder: 'Country of supplier/beneficiary',
          },
          {
            name: 'collateralAvailable',
            label: 'Available collateral',
            type: 'select',
            options: [
              { label: 'Select option', value: '' },
              { label: 'Cash margin', value: 'cash-margin' },
              { label: 'Property', value: 'property' },
              { label: 'Inventory', value: 'inventory' },
              { label: 'Combination of securities', value: 'mixed' },
              { label: 'No collateral available', value: 'none' },
            ],
          },
          {
            name: 'collateralDescription',
            label: 'Collateral notes',
            type: 'textarea',
            rows: 2,
            placeholder: 'Cash margin %, property details, inventory values…',
          },
          {
            name: 'bankRelationship',
            label: 'Existing bank relationship',
            type: 'text',
            placeholder: 'Primary bank or trade finance provider',
          },
        ],
      },
      {
        id: 'activity-profile',
        title: 'Trade activity profile',
        layout: 'two-column',
        fields: [
          {
            name: 'annualLcCount',
            label: 'Approx. number of LCs/guarantees per year',
            type: 'number',
            placeholder: 'e.g. 12',
            inputMode: 'numeric',
          },
          {
            name: 'averageShipmentValue',
            label: 'Average shipment value',
            type: 'currency',
            placeholder: 'e.g. 250,000',
            inputMode: 'decimal',
          },
          {
            name: 'complianceConsiderations',
            label: 'Compliance considerations',
            type: 'textarea',
            rows: 2,
            placeholder: 'Sanctioned countries, dual-use goods, export controls…',
            colSpan: 2,
          },
        ],
      },
    ],
  },
  {
    slug: 'project-finance',
    name: 'Project Finance Bankability Scan',
    shortName: 'Project Finance',
    category: 'project-finance',
    badge: 'Project Finance',
    tagline: 'Test if your project fits bank / private credit criteria.',
    heroTitle: 'Project Finance',
    heroHighlight: 'Bankability Scan',
    heroDescription:
      'Evaluate whether your project qualifies for limited recourse financing. Provide a snapshot of the capital stack, cash flows, and contract readiness to receive a bankability score and next-step advisory plan.',
    highlights: [
      'Bankability score (Ready / Needs Equity / Contracts Pending / Feasibility Required).',
      'Key gaps to close (financial model enhancements, sponsor guarantees, permits).',
      'Potential funding channels (syndicated banks, DFIs, private credit funds).',
    ],
    timeToComplete: '6–7 minutes',
    outcome: 'Bankability score + next-step recommendations.',
    ctaLabel: 'Get my bankability scan',
    successMessage: DEFAULT_SUCCESS_MESSAGE,
    errorMessage: DEFAULT_ERROR_MESSAGE,
    dataPrivacyNote: DEFAULT_DATA_PRIVACY_NOTE,
    sections: [
      {
        id: 'sponsor-details',
        title: 'Sponsor details',
        layout: 'two-column',
        fields: [
          {
            name: 'sponsorName',
            label: 'Sponsor / developer name',
            type: 'text',
            required: true,
            placeholder: 'Corporate entity',
          },
          {
            name: 'sponsorTrackRecord',
            label: 'Sponsor track record highlights',
            type: 'textarea',
            rows: 2,
            placeholder: 'Completed projects, sector experience, partners…',
          },
          {
            name: 'email',
            label: 'Work email',
            type: 'email',
            required: true,
            placeholder: 'you@company.com',
            autoComplete: 'email',
          },
          {
            name: 'phone',
            label: 'Mobile / WhatsApp',
            type: 'tel',
            placeholder: '+971-5x-xxx-xxxx',
            autoComplete: 'tel',
          },
        ],
      },
      {
        id: 'project-overview',
        title: 'Project overview',
        layout: 'two-column',
        fields: [
          {
            name: 'projectSector',
            label: 'Project sector',
            type: 'select',
            options: [
              { label: 'Select sector', value: '' },
              { label: 'Renewable energy', value: 'renewable' },
              { label: 'Infrastructure', value: 'infrastructure' },
              { label: 'Real estate development', value: 'real-estate' },
              { label: 'Industrial / manufacturing', value: 'industrial' },
              { label: 'Hospitality / leisure', value: 'hospitality' },
              { label: 'Logistics / transport', value: 'logistics' },
            ],
          },
          {
            name: 'projectLocation',
            label: 'Project location (emirate / region)',
            type: 'text',
            placeholder: 'Dubai, Abu Dhabi, GCC, etc.',
          },
          {
            name: 'totalProjectCost',
            label: 'Total project cost (AED)',
            type: 'currency',
            required: true,
            placeholder: 'e.g. 220,000,000',
            inputMode: 'decimal',
          },
          {
            name: 'committedEquity',
            label: 'Committed equity (% of capex)',
            type: 'text',
            placeholder: 'e.g. 35%',
          },
          {
            name: 'debtRequired',
            label: 'Debt required (AED)',
            type: 'currency',
            placeholder: 'e.g. 143,000,000',
            inputMode: 'decimal',
          },
          {
            name: 'financialCloseTarget',
            label: 'Financial close target date',
            type: 'text',
            placeholder: 'MM/YYYY',
          },
        ],
      },
      {
        id: 'cash-flows',
        title: 'Cash flow & tenor profile',
        layout: 'three-column',
        fields: [
          {
            name: 'projectedRevenue',
            label: 'Projected annual revenue (AED)',
            type: 'currency',
            placeholder: 'e.g. 48,000,000',
            inputMode: 'decimal',
          },
          {
            name: 'operatingCosts',
            label: 'Annual operating costs (AED)',
            type: 'currency',
            placeholder: 'e.g. 24,000,000',
            inputMode: 'decimal',
          },
          {
            name: 'repaymentTenor',
            label: 'Desired repayment tenor (years)',
            type: 'number',
            placeholder: 'e.g. 12 years',
            inputMode: 'numeric',
          },
          {
            name: 'targetDscr',
            label: 'Target DSCR',
            type: 'text',
            placeholder: 'e.g. 1.35x',
            colSpan: 2,
          },
          {
            name: 'currencyExposure',
            label: 'Currency exposure notes',
            type: 'textarea',
            rows: 2,
            placeholder: 'AED, USD, cross-border exposures, hedging plans…',
            colSpan: 2,
          },
        ],
      },
      {
        id: 'contracts-permits',
        title: 'Contracts & permits status',
        layout: 'two-column',
        fields: [
          {
            name: 'offtakeStatus',
            label: 'Offtake / PPA status',
            type: 'select',
            options: [
              { label: 'Select status', value: '' },
              { label: 'Signed agreement', value: 'signed' },
              { label: 'Draft under negotiation', value: 'draft' },
              { label: 'In negotiation', value: 'negotiating' },
              { label: 'No offtake', value: 'none' },
            ],
          },
          {
            name: 'epcStatus',
            label: 'EPC contract status',
            type: 'select',
            options: [
              { label: 'Select status', value: '' },
              { label: 'Signed EPC', value: 'signed' },
              { label: 'Shortlisted contractors', value: 'shortlisted' },
              { label: 'Tendering', value: 'tendering' },
              { label: 'Not started', value: 'not-started' },
            ],
          },
          {
            name: 'permitsStatus',
            label: 'Permits & approvals',
            type: 'select',
            options: [
              { label: 'Select status', value: '' },
              { label: 'All obtained', value: 'all-obtained' },
              { label: 'Partially obtained', value: 'partial' },
              { label: 'Application in progress', value: 'in-progress' },
              { label: 'Not started', value: 'not-started' },
            ],
          },
          {
            name: 'guaranteeSupport',
            label: 'Government / sponsor guarantees',
            type: 'textarea',
            rows: 2,
            placeholder: 'Sovereign support, sponsor guarantees, credit enhancements…',
          },
        ],
      },
      {
        id: 'additional-context',
        title: 'Additional context',
        layout: 'single',
        fields: [
          {
            name: 'additionalNotes',
            label: 'Additional context or support required',
            type: 'textarea',
            rows: 3,
            placeholder: 'Advisors engaged, sponsor commitments, key risks…',
          },
        ],
      },
    ],
  },
];

export type ToolSlug = ToolDefinition['slug'];

export const TOOL_DEFINITION_MAP: Record<ToolSlug, ToolDefinition> = TOOL_DEFINITIONS.reduce(
  (accumulator, definition) => {
    accumulator[definition.slug as ToolSlug] = definition;
    return accumulator;
  },
  {} as Record<ToolSlug, ToolDefinition>
);

export const TOOL_SLUGS = Object.freeze(
  TOOL_DEFINITIONS.map((tool) => tool.slug) as ToolSlug[]
);

export function getToolDefinition(slug: string) {
  return TOOL_DEFINITION_MAP[slug as ToolSlug];
}

export function getToolsByCategory(category: ToolCategorySlug) {
  return TOOL_DEFINITIONS.filter((tool) => tool.category === category);
}
