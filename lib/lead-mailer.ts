import fs from 'node:fs';
import path from 'node:path';

import nodemailer from 'nodemailer';
import type { Attachment } from 'nodemailer/lib/mailer';

import type { AssessmentSummary as AssessmentDetails } from './assessment';

type AssessmentSummary = AssessmentDetails;

type LeadRecord = {
  id: string;
  toolSlug: string;
  fullName: string;
  companyName: string | null;
  email: string;
  phone: string | null;
  country: string | null;
  payload: unknown;
  assessment: unknown;
  createdAt: Date;
  updatedAt: Date;
};

type LeadEmailPayload = {
  toolSlug: string;
  leadData: LeadRecord;
  assessmentSummary: AssessmentSummary;
};

type LogoAsset = {
  cid: string;
  filename: string;
  content: Buffer;
  contentType: string;
};

type SummaryScalar = {
  label: string;
  value: string;
};

type SummarySection = {
  title: string;
  items: string[];
};

type FormattedSummary = {
  headline: string;
  scalars: SummaryScalar[];
  sections: SummarySection[];
  text: string;
  html: string;
};

const TOOL_LABELS: Record<string, string> = {
  'line-of-credit': 'Line of Credit Eligibility Snapshot',
  'mortgage-finance': 'Mortgage & Real Estate Finance Readiness',
  'bill-discounting': 'Receivables & Bill Discounting Estimator',
  'trade-finance': 'Trade & Letter of Credit Cost Estimator',
  'project-finance': 'Project Finance Bankability Scan',
};

const REQUIRED_ENV_VARS = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USERNAME',
  'SMTP_PASSWORD',
  'SENDER_EMAIL',
];

let transporter: nodemailer.Transporter | null = null;
let logoAsset: LogoAsset | null | undefined;

const LOGO_PATH = path.join(
  process.cwd(),
  'public',
  'images',
  'egf-logo-white.png'
);
const LOGO_CID = 'egf-logo-inline@egf-tools';

function missingMailerEnvVars(): string[] {
  return REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
}

function friendlyToolName(slug: string): string {
  return TOOL_LABELS[slug] ?? 'EGF Finance Assessment';
}

function ensureEnv() {
  const missing = missingMailerEnvVars();
  if (missing.length) {
    throw new Error(
      `Missing required SMTP environment variables: ${missing.join(', ')}`
    );
  }
}

function getLogoAsset(): LogoAsset | null {
  if (logoAsset !== undefined) {
    return logoAsset;
  }

  try {
    const content = fs.readFileSync(LOGO_PATH);
    logoAsset = {
      cid: LOGO_CID,
      filename: 'egf-logo.png',
      content,
      contentType: 'image/png',
    };
  } catch (error) {
    console.warn('[lead-mailer] Unable to load logo asset:', error);
    logoAsset = null;
  }

  return logoAsset;
}

function boolFromEnv(key: string, fallback = false): boolean {
  const value = process.env[key];
  if (value === undefined) {
    return fallback;
  }
  return ['true', '1', 'yes'].includes(value.toLowerCase());
}

function getTransporter(): nodemailer.Transporter {
  if (transporter) {
    return transporter;
  }

  ensureEnv();

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: boolFromEnv('SMTP_USE_SSL'),
    requireTLS: boolFromEnv('SMTP_USE_TLS', true),
    auth: {
      user: process.env.SMTP_USERNAME as string,
      pass: process.env.SMTP_PASSWORD as string,
    },
  });

  return transporter;
}

function formatSummary(summary: AssessmentSummary): FormattedSummary {
  const scalars: SummaryScalar[] = [];
  const sections: SummarySection[] = [];

  const pushScalar = (label: string, value: unknown) => {
    if (value === null || value === undefined) {
      return;
    }

    const stringValue = String(value).trim();

    if (!stringValue) {
      return;
    }

    scalars.push({ label, value: stringValue });
  };

  const pushSection = (title: string, value: unknown) => {
    if (!Array.isArray(value) || value.length === 0) {
      return;
    }

    const items = value
      .map((item) => {
        if (typeof item === 'string') {
          return item.trim();
        }

        if (item === null || item === undefined) {
          return '';
        }

        return String(item);
      })
      .filter((item) => item.length > 0);

    if (!items.length) {
      return;
    }

    sections.push({ title, items });
  };

  const headline =
    typeof summary.headline === 'string' && summary.headline.trim().length
      ? summary.headline.trim()
      : 'Assessment snapshot';

  const toolSummary = friendlyToolName(summary.toolSlug);

  pushScalar('Assessment focus', toolSummary);
  pushScalar('Indicative facility range', summary.indicativeRange ?? null);
  pushScalar('Liquidity coverage ratio', summary.liquidityCoverageRatio ?? null);
  pushScalar('Readiness band', summary.readinessBand ?? null);
  pushScalar('Indicative LTV band', summary.indicativeLtvBand ?? null);
  pushScalar('Estimated DSCR', summary.dscrEstimate ?? null);
  pushScalar('Private credit headline', summary.privateCreditOption ?? null);

  if (summary.concentrationFlag) {
    pushSection('Alerts & flags', [summary.concentrationFlag]);
  }

  pushSection('Key signals observed', summary.keySignals);
  pushSection('Risk considerations', summary.riskNotes);
  pushSection('Recommended next steps', summary.nextSteps);
  pushSection('Documentation checklist', summary.documentationChecklist);
  pushSection('Timeline guidance', summary.timelineGuidance);
  pushSection('Bank channel briefing', summary.bankChannelNotes);

  const textLines: string[] = [headline, ''];

  if (scalars.length) {
    scalars.forEach((scalar) => {
      textLines.push(`${scalar.label}: ${scalar.value}`);
    });
    textLines.push('');
  }

  sections.forEach((section) => {
    textLines.push(`${section.title}:`);
    section.items.forEach((item) => {
      textLines.push(` - ${item}`);
    });
    textLines.push('');
  });

  if (!scalars.length && !sections.length) {
    textLines.push('Our advisory team is reviewing the information you shared.');
  }

  const scalarRows = scalars
    .map(
      (scalar) => `
        <tr>
          <td style="padding:8px 16px;font-weight:600;color:#1e293b;width:50%;">${escapeHtml(
            scalar.label
          )}</td>
          <td style="padding:8px 16px;color:#334155;">${escapeHtml(
            scalar.value
          )}</td>
        </tr>`
    )
    .join('');

  const sectionsHtml = sections
    .map(
      (section) => `
        <div style="margin-top:16px;">
          <h3 style="margin:0 0 8px;font-size:14px;font-weight:600;color:#0f172a;">${escapeHtml(
            section.title
          )}</h3>
          <ul style="margin:0;padding-left:20px;color:#334155;font-size:14px;line-height:1.6;">
            ${section.items
              .map(
                (item) =>
                  `<li style="margin-bottom:6px;">${escapeHtml(item)}</li>`
              )
              .join('')}
          </ul>
        </div>`
    )
    .join('');

  const htmlParts: string[] = [
    `<h2 style="margin:0 0 16px;font-size:18px;font-weight:600;color:#0f172a;">${escapeHtml(
      headline
    )}</h2>`,
  ];

  if (scalarRows) {
    htmlParts.push(
      `<table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;font-size:14px;line-height:1.6;">${scalarRows}</table>`
    );
  }

  if (sectionsHtml) {
    htmlParts.push(sectionsHtml);
  }

  if (!scalarRows && !sectionsHtml) {
    htmlParts.push(
      '<p style="margin:0;color:#334155;font-size:14px;line-height:1.6;">We are reviewing the information you provided and will revert shortly.</p>'
    );
  }

  const text = textLines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trimEnd();

  const html = `<div style="font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:1.6;color:#0f172a;">${htmlParts.join(
    ''
  )}</div>`;

  return {
    headline,
    scalars,
    sections,
    text,
    html,
  };
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function resolveEligibilityMessaging(summary: AssessmentSummary): {
  headline: string;
  body: string;
} {
  const hasRisk = Array.isArray(summary.riskNotes) && summary.riskNotes.length > 0;
  const hasNextSteps = Array.isArray(summary.nextSteps) && summary.nextSteps.length > 0;

  if (!hasRisk) {
    return {
      headline: 'You’re well positioned to apply',
      body: 'The indicators we analysed point to a strong case for senior lender engagement. We recommend beginning your full application while the signals remain favourable.',
    };
  }

  if (hasNextSteps) {
    return {
      headline: 'Address the highlighted items before submitting',
      body: 'We spotted a few considerations that lenders typically review closely. Tackle the recommended next steps below, then continue with your application when you are ready.',
    };
  }

  return {
    headline: 'Assessment received',
    body: 'Review the signals below and gather the supporting information outlined in the application checklist before proceeding.',
  };
}

function normaliseApplicationStartBase(raw?: string | null): string | null {
  if (!raw) {
    return null;
  }

  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }

  const candidate = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const url = new URL(candidate);
    const path = url.pathname.replace(/\/+$/, '');

    if (!path || path === '') {
      url.pathname = '/apply/start';
    } else if (!/\/apply\/start$/i.test(path)) {
      url.pathname = `${path.replace(/\/+$/, '')}/apply/start`;
    } else {
      url.pathname = path;
    }

    url.search = '';
    url.hash = '';
    return url.toString();
  } catch {
    return null;
  }
}

function isLocalHost(urlString: string): boolean {
  try {
    const hostname = new URL(urlString).hostname;
    return (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.endsWith('.local')
    );
  } catch {
    return false;
  }
}

function buildStartBaseUrl(): string {
  const brandBase =
    normaliseApplicationStartBase('https://epiidosisglobalfin.com') ??
    'https://epiidosisglobalfin.com/apply/start';
  const localBase =
    normaliseApplicationStartBase('http://localhost:3000') ??
    'http://localhost:3000/apply/start';

  const explicit = normaliseApplicationStartBase(
    process.env.APPLICATION_START_URL
  );
  if (explicit) {
    return explicit;
  }

  const appBaseEnv = normaliseApplicationStartBase(process.env.APP_BASE_URL);
  if (appBaseEnv) {
    if (isLocalHost(appBaseEnv)) {
      return localBase;
    }

    const hostname = new URL(appBaseEnv).hostname;
    if (hostname === 'epiidosis.com') {
      return brandBase;
    }

    return appBaseEnv;
  }

  if (process.env.NODE_ENV !== 'production') {
    return localBase;
  }

  return brandBase;
}

function appendQueryParams(base: string, params: URLSearchParams): string {
  const url = new URL(base);
  params.forEach((value, key) => {
    url.searchParams.set(key, value);
  });
  return url.toString();
}

function getApplicationStartUrl(lead: LeadRecord): string {
  const params = new URLSearchParams({
    email: lead.email,
    applicationId: lead.id,
  });

  const baseUrl = buildStartBaseUrl();
  return appendQueryParams(baseUrl, params);
}

function renderLeadEmail(
  lead: LeadRecord,
  formattedSummary: FormattedSummary,
  rawSummary: AssessmentSummary,
  logo: LogoAsset | null
) {
  const greetingName = lead.fullName?.split(' ')[0] ?? 'there';
  const toolName = friendlyToolName(lead.toolSlug);
  const eligibility = resolveEligibilityMessaging(rawSummary);
  const applicationUrl = getApplicationStartUrl(lead);

  const summaryTable = formattedSummary.scalars.length
    ? `<table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:24px;">
        ${formattedSummary.scalars
          .map(
            (scalar, index) => `
              <tr style="background-color:${
                index % 2 === 0 ? '#f8fafc' : '#ffffff'
              };">
                <td style="padding:12px 18px;font-weight:600;color:#0f172a;font-size:14px;width:45%;">${escapeHtml(
                  scalar.label
                )}</td>
                <td style="padding:12px 18px;color:#334155;font-size:14px;">${escapeHtml(
                  scalar.value
                )}</td>
              </tr>`
          )
          .join('')}
      </table>`
    : '';

  const sectionBlocks = formattedSummary.sections
    .map((section: SummarySection) => `
        <div style="margin-top:16px;">
          <h3 style="margin:0 0 10px;font-size:14px;font-weight:600;color:#0f172a;">${escapeHtml(
            section.title
          )}</h3>
          <ul style="margin:0;padding-left:20px;color:#334155;font-size:14px;line-height:1.7;">
            ${section.items
              .map((item: string) => `<li style="margin-bottom:8px;">${escapeHtml(item)}</li>`)
              .join('')}
          </ul>
        </div>`
    )
    .join('');

  const summaryBlock = summaryTable || sectionBlocks
    ? `<div>${summaryTable}${sectionBlocks}</div>`
    : `<p style="margin:0;color:#334155;font-size:14px;line-height:1.7;">We are reviewing the information you provided and will revert shortly.</p>`;

  const logoMarkup = logo
    ? `<img src="cid:${logo.cid}" alt="Epiidosis Global Finance" style="max-width:180px;height:auto;display:block;margin:0 auto;" />`
    : `<div style="font-size:18px;font-weight:600;color:#ffffff;">Epiidosis Global Finance</div>`;

  const disclaimerText =
    'This message (including any attachments) is intended solely for the named recipient and may contain confidential or privileged information. If you are not the intended recipient, please notify the sender immediately and delete this email. Any unauthorised review, distribution, or copying is prohibited.';


  const ctaHtml = `<div style="margin-top:32px;padding:28px;border-radius:28px;background:linear-gradient(135deg,#1d4ed8,#0ea5e9);box-shadow:0 20px 45px -18px rgba(14,116,144,0.45);">
      <h2 style="margin:0;font-size:20px;font-weight:600;color:#f8fafc;">${escapeHtml(
        eligibility.headline
      )}</h2>
      <p style="margin:12px 0 24px;font-size:14px;color:#e0f2fe;line-height:1.7;">${escapeHtml(
        eligibility.body
      )}</p>
      <a href="${escapeHtml(applicationUrl)}" style="display:inline-block;padding:14px 30px;border-radius:999px;background:#f8fafc;color:#0f172a;font-weight:600;text-decoration:none;">Start your application</a>
      <p style="margin:14px 0 0;font-size:12px;color:#cbd5f5;">Save progress, upload documents, and resume any time with your email or application reference.</p>
    </div>`;

  const companyBadge = lead.companyName
    ? `<span style="display:inline-block;padding:10px 18px;border-radius:18px;background:linear-gradient(135deg,#e2e8f0,#f8fafc);color:#0f172a;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.14em;">Prepared for ${escapeHtml(
        lead.companyName
      )}</span>`
    : '';

  const headlineLabel = `<span style="display:block;font-size:12px;font-weight:600;color:#1d4ed8;text-transform:uppercase;letter-spacing:0.24em;">${escapeHtml(
    formattedSummary.headline
  )}</span>`;

  const titleCell = `<h1 style="margin:0;font-size:26px;font-weight:700;line-height:1.25;color:#0f172a;">${escapeHtml(
    toolName
  )}</h1>`;

  const headingRows = companyBadge
    ? `<tr>
          <td style="padding:0;vertical-align:top;">${headlineLabel}</td>
          <td style="padding:0;vertical-align:top;text-align:right;min-width:180px;">${companyBadge}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding:14px 0 0;vertical-align:top;">${titleCell}</td>
        </tr>`
    : `<tr>
          <td style="padding:0;vertical-align:top;">
            ${headlineLabel}
            <div style="margin-top:14px;">${titleCell}</div>
          </td>
        </tr>`;

  const toolHeading = `<table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="width:100%;border-collapse:collapse;">
      ${headingRows}
    </table>`;

  return {
    subject: `Your ${toolName} Assessment`,
    text: `Hi ${greetingName},

Thanks for using Epiidosis Global Finance's ${toolName}. Here's a quick summary based on the details you shared:

${formattedSummary.text}

Eligibility insight: ${eligibility.headline}

Apply next: ${applicationUrl}

An EGF advisor will reach out shortly to discuss tailored financing options for your organisation.

Warm regards,
Epiidosis Global Finance

----------------------------------------
${disclaimerText}`,
    html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(toolName)} Assessment</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
  </head>
  <body style="margin:0;padding:0;background-color:#f1f5f9;">
    <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="background-color:#f1f5f9;padding:36px 0;font-family:'Inter','Helvetica Neue',Arial,sans-serif;">
      <tr>
        <td align="center" style="padding:0 16px;">
          <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="max-width:680px;background-color:#ffffff;border-radius:28px;overflow:hidden;box-shadow:0 35px 65px -32px rgba(15,23,42,0.25);">
            <tr>
              <td style="padding:40px 38px;background:linear-gradient(160deg,rgba(15,23,42,0.94),rgba(30,64,175,0.9));text-align:left;">
                <div style="display:flex;justify-content:flex-start;">${logoMarkup}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 38px;background-color:#ffffff;">
                ${toolHeading}
                <p style="margin:24px 0 20px;font-size:14px;color:#0f172a;line-height:1.7;">Hi ${escapeHtml(
                  greetingName
                )}, thanks for completing the ${escapeHtml(
                  toolName
                )} inputs. We analysed your responses and compiled the highlights below so you can decide on the next steps confidently.</p>
                ${summaryBlock
                  ? `<div style="margin:24px 0 0;padding:24px;border-radius:22px;background-color:#f8fafc;border:1px solid #e2e8f0;">${summaryBlock}</div>`
                  : ''}
                ${ctaHtml}
                <div style="margin-top:32px;padding:24px;border-radius:22px;background:linear-gradient(135deg,rgba(37,99,235,0.08),rgba(14,165,233,0.12));border:1px solid #c7d2fe;">
                  <h3 style="margin:0 0 12px;font-size:16px;font-weight:600;color:#1e3a8a;">What happens after you continue?</h3>
                  <ul style="margin:0;padding-left:20px;font-size:13px;line-height:1.8;color:#1f2937;">
                    <li>Save-as-draft across every step and resume using your email or application reference.</li>
                    <li>Upload financial statements, mandates, and documents securely in one workspace.</li>
                    <li>Sign the fee agreement digitally before final submission.</li>
                  </ul>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 38px 38px;background-color:#ffffff;">
                <div style="margin:0;padding:24px;border-radius:22px;background-color:#0f172a;">
                  <h3 style="margin:0 0 12px;font-size:15px;font-weight:600;color:#f8fafc;">Need assistance?</h3>
                  <p style="margin:0 0 10px;font-size:13px;line-height:1.7;color:#cbd5f5;">Reply directly to this email or contact <a href="mailto:support@epiidosisglobalfin.com" style="color:#38bdf8;text-decoration:none;">support@epiidosisglobalfin.com</a> for guidance on the application process or required documentation.</p>
                  <p style="margin:0;font-size:12px;line-height:1.6;color:#94a3b8;">Our advisors respond within one business day and can arrange a consultation call if you prefer.</p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:26px 38px;background-color:#0b142b;border-top:1px solid rgba(148,163,184,0.18);">
                <p style="margin:0 0 12px;font-size:11px;line-height:1.6;color:#94a3b8;">${escapeHtml(
                  disclaimerText
                )}</p>
                <p style="margin:0;font-size:11px;line-height:1.6;color:#64748b;">Epiidosis Global Finance | DIFC Innovation Hub, Dubai, United Arab Emirates</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  };
}

function renderInternalEmail(
  lead: LeadRecord,
  summary: FormattedSummary
) {
  const toolName = friendlyToolName(lead.toolSlug);
  const submissionDetails = {
    id: lead.id,
    toolSlug: lead.toolSlug,
    createdAt: lead.createdAt,
    contact: {
      fullName: lead.fullName,
      email: lead.email,
      phone: lead.phone,
      companyName: lead.companyName,
      country: lead.country,
    },
    payload: lead.payload,
    assessment: lead.assessment,
  };

  const serializedSubmission = JSON.stringify(submissionDetails, null, 2);

  return {
    subject: `[Lead] ${toolName} – ${lead.fullName}`,
    text: `A new lead was captured via ${toolName}.

${summary.headline}

${summary.text}

Full submission:
${serializedSubmission}`,
    html: `<p style="font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-size:14px;color:#0f172a;">A new lead was captured via <strong>${escapeHtml(
      toolName
    )}</strong>.</p>
<div style="font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-size:14px;color:#0f172a;line-height:1.6;">
  ${summary.html}
</div>
<h3 style="font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-size:14px;color:#0f172a;margin-top:24px;">Full submission</h3>
<pre style="padding:16px;background:#0f172a;color:#e2e8f0;border-radius:12px;overflow:auto;font-size:12px;line-height:1.5;">${escapeHtml(
      serializedSubmission
    )}</pre>`,
  };
}

export async function sendLeadEmailsAndAssessment(
  payload: LeadEmailPayload
): Promise<void> {
  const missing = missingMailerEnvVars();

  if (missing.length) {
    const warning = `Missing required SMTP environment variables: ${missing.join(', ')}. Skipping email dispatch.`;

    if (process.env.NODE_ENV === 'production') {
      throw new Error(warning);
    }

    console.warn('[lead-mailer] ', warning);
    return;
  }

  const transporterInstance = getTransporter();
  const senderEmail = process.env.SENDER_EMAIL as string;
  const senderName = process.env.SENDER_NAME ?? 'Epiidosis Global Finance';
  const internalEmail =
    process.env.INTERNAL_ALERT_EMAIL ?? process.env.SENDER_EMAIL ?? senderEmail;

  const formattedSummary = formatSummary(payload.assessmentSummary);
  const logo = getLogoAsset();
  const leadMessage = renderLeadEmail(
    payload.leadData,
    formattedSummary,
    payload.assessmentSummary,
    logo
  );
  const internalMessage = renderInternalEmail(payload.leadData, formattedSummary);

  const attachments: Attachment[] = logo
    ? [
        {
          filename: logo.filename,
          content: logo.content,
          cid: logo.cid,
          contentType: logo.contentType,
        },
      ]
    : [];

  await Promise.all([
    transporterInstance.sendMail({
      from: `${senderName} <${senderEmail}>`,
      to: payload.leadData.email,
      replyTo: senderEmail,
      subject: leadMessage.subject,
      text: leadMessage.text,
      html: leadMessage.html,
      attachments: attachments.length ? attachments : undefined,
    }),
    transporterInstance.sendMail({
      from: `${senderName} <${senderEmail}>`,
      to: internalEmail,
      subject: internalMessage.subject,
      text: internalMessage.text,
      html: internalMessage.html,
      attachments: attachments.length ? attachments : undefined,
    }),
  ]);
}
