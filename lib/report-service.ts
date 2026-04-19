import fs from 'node:fs';
import path from 'node:path';
import { randomBytes } from 'node:crypto';

import PDFDocument from 'pdfkit';

type PDFKitDocument = InstanceType<typeof PDFDocument>;

import getPrismaClient from './db';
import type { AssessmentSummary } from './assessment';

const REPORTS_DIR = path.join(process.cwd(), 'storage', 'assessment-reports');
const LOGO_PATH = path.join(
  process.cwd(),
  'public',
  'images',
  'egf-logo-white.png'
);
const TOKEN_TTL_HOURS = Number(process.env.REPORT_TOKEN_TTL_HOURS ?? '168');
const BRAND_COLORS = {
  navy: '#0f172a',
  slate: '#334155',
  accent: '#2563eb',
  background: '#f8fafc',
  divider: '#e2e8f0',
};

const PAGE_BG = '#f5f5f0';
const CARD_BG = '#ffffff';
const HEADER_BG = '#003057';
const ACCENT_GOLD = '#d4a574';

const FONT_PATHS = {
  headingRegular: path.join(process.cwd(), 'public', 'fonts', 'Raleway-Regular.ttf'),
  headingSemiBold: path.join(process.cwd(), 'public', 'fonts', 'Raleway-SemiBold.ttf'),
  headingBold: path.join(process.cwd(), 'public', 'fonts', 'Raleway-Bold.ttf'),
  bodyRegular: path.join(process.cwd(), 'public', 'fonts', 'Inter-Regular.ttf'),
  bodyMedium: path.join(process.cwd(), 'public', 'fonts', 'Inter-Medium.ttf'),
  bodyBold: path.join(process.cwd(), 'public', 'fonts', 'Inter-Bold.ttf'),
} as const;

const FONT_NAMES = {
  headingRegular: 'EGF-Raleway-Regular',
  headingSemiBold: 'EGF-Raleway-SemiBold',
  headingBold: 'EGF-Raleway-Bold',
  bodyRegular: 'EGF-Inter-Regular',
  bodyMedium: 'EGF-Inter-Medium',
  bodyBold: 'EGF-Inter-Bold',
} as const;

type RegisteredFonts = {
  heading: {
    regular: string;
    semiBold: string;
    bold: string;
  };
  body: {
    regular: string;
    medium: string;
    bold: string;
  };
};

const DEFAULT_FONTS: RegisteredFonts = {
  heading: {
    regular: 'Helvetica',
    semiBold: 'Helvetica-Bold',
    bold: 'Helvetica-Bold',
  },
  body: {
    regular: 'Helvetica',
    medium: 'Helvetica',
    bold: 'Helvetica-Bold',
  },
};

function registerDocumentFonts(doc: PDFKitDocument): RegisteredFonts {
  const resolved: RegisteredFonts = {
    heading: { ...DEFAULT_FONTS.heading },
    body: { ...DEFAULT_FONTS.body },
  };

  const tryRegister = (
    fontPath: string,
    fontName: string,
    assign: (name: string) => void
  ) => {
    try {
      if (fs.existsSync(fontPath)) {
        doc.registerFont(fontName, fontPath);
        assign(fontName);
      }
    } catch (error) {
      console.warn(`[report-service] Failed to register font "${fontName}" from ${fontPath}`, error);
    }
  };

  tryRegister(FONT_PATHS.headingRegular, FONT_NAMES.headingRegular, (name) => {
    resolved.heading.regular = name;
  });
  tryRegister(FONT_PATHS.headingSemiBold, FONT_NAMES.headingSemiBold, (name) => {
    resolved.heading.semiBold = name;
  });
  tryRegister(FONT_PATHS.headingBold, FONT_NAMES.headingBold, (name) => {
    resolved.heading.bold = name;
  });
  tryRegister(FONT_PATHS.bodyRegular, FONT_NAMES.bodyRegular, (name) => {
    resolved.body.regular = name;
  });
  tryRegister(FONT_PATHS.bodyMedium, FONT_NAMES.bodyMedium, (name) => {
    resolved.body.medium = name;
  });
  tryRegister(FONT_PATHS.bodyBold, FONT_NAMES.bodyBold, (name) => {
    resolved.body.bold = name;
  });

  return resolved;
}

const SECTION_SPACING = 24;
const METRIC_CARD_BG = '#f8f8f8';
const METRIC_LABEL_COLOR = '#666666';
const METRIC_VALUE_COLOR = '#1a1a1a';

const TOOL_NAMES: Record<string, string> = {
  'line-of-credit': 'Line of Credit Eligibility Snapshot',
  'mortgage-finance': 'Mortgage & Real Estate Finance Readiness',
  'bill-discounting': 'Receivables & Bill Discounting Estimator',
  'trade-finance': 'Trade & Letter of Credit Cost Estimator',
  'project-finance': 'Project Finance Bankability Scan',
};

export type ReportTokenInfo = {
  token: string;
  tokenExpiresAt: Date;
  filePath: string;
  absolutePath: string;
};

type LeadForReport = {
  id: string;
  toolSlug: string;
  fullName: string;
  companyName: string | null;
  email: string;
  createdAt: Date;
};

async function ensureReportsDirectory() {
  await fs.promises.mkdir(REPORTS_DIR, { recursive: true });
}

function friendlyToolName(slug: string): string {
  return TOOL_NAMES[slug] ?? 'EGF Finance Assessment';
}

function formatDateForReport(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(date);
}

function drawSectionHeader(doc: PDFKitDocument, label: string, fonts: RegisteredFonts) {
  doc.moveDown(0.6);
  const startY = doc.y;

  doc
    .font(fonts.heading.semiBold)
    .fontSize(16)
    .fillColor('#1a1a1a')
    .text(label, 50, startY);

  doc.moveDown(0.4);
}

function drawBulletList(doc: PDFKitDocument, items: string[], fonts: RegisteredFonts) {
  if (!items.length) {
    return;
  }

  doc.font(fonts.body.regular).fontSize(10.5).fillColor('#333333');
  doc.list(items, {
    bulletRadius: 2,
    textIndent: 12,
    lineGap: 5,
  });
  doc.moveDown(1);
}

function drawMetricPanel(
  doc: PDFKitDocument,
  entries: Array<{ label: string; value: string }>,
  fonts: RegisteredFonts,
  startX: number,
  startY: number,
  width: number
) {
  if (!entries.length) {
    return;
  }

  const rowHeight = 68;
  const panelHeight = rowHeight * entries.length;

  doc.save();
  doc
    .rect(startX, startY, width, panelHeight)
    .fillAndStroke('#fbfbfb', '#d7d7d7')
    .lineWidth(0.75);
  doc.restore();

  entries.forEach((entry, index) => {
    const y = startY + index * rowHeight;

    doc
      .font(fonts.body.regular)
      .fontSize(8)
      .fillColor('#5b6472')
      .text(entry.label.toUpperCase(), startX + 16, y + 14, {
        width: width - 32,
        align: 'left',
        lineGap: 1.5,
      });

    const valueFontSize = entry.value.length > 14 ? 14 : 18;

    doc
      .font(fonts.heading.bold)
      .fontSize(valueFontSize)
      .fillColor('#1f2937')
      .text(entry.value, startX + 16, y + 32, {
        width: width - 32,
        align: 'left',
      });

    if (index < entries.length - 1) {
      doc
        .moveTo(startX + 12, y + rowHeight - 1)
        .lineTo(startX + width - 12, y + rowHeight - 1)
        .strokeColor('#dcdcdc')
        .lineWidth(0.6)
        .stroke();
    }
  });
}

function drawInsightCard(
  doc: PDFKitDocument,
  title: string,
  items: string[],
  fonts: RegisteredFonts,
  x: number,
  y: number,
  width: number,
  { measureOnly = false }: { measureOnly?: boolean } = {}
): number {
  if (!items.length) {
    return 0;
  }

  const padding = 16;
  const headingSize = 13;
  const bodySize = 10.5;

  doc.font(fonts.heading.semiBold).fontSize(headingSize);
  const headingHeight = doc.heightOfString(title, {
    width: width - padding * 2,
  });

  const bulletText = items.map((item) => `• ${item}`).join('\n');
  doc.font(fonts.body.regular).fontSize(bodySize);
  const bulletsHeight = doc.heightOfString(bulletText, {
    width: width - padding * 2,
    lineGap: 4,
  });

  const cardHeight = padding + headingHeight + 12 + bulletsHeight + padding;

  if (measureOnly) {
    doc.font(fonts.body.regular).fontSize(bodySize);
    return cardHeight;
  }

  doc.save();
  doc
    .roundedRect(x, y, width, cardHeight, 12)
    .fill('#f7f7f5');
  doc.restore();

  doc.save();
  doc.rect(x, y, width, 4).fill(ACCENT_GOLD);
  doc.restore();

  const headingY = y + padding;
  doc
    .font(fonts.heading.semiBold)
    .fontSize(headingSize)
    .fillColor('#111827')
    .text(title, x + padding, headingY, {
      width: width - padding * 2,
    });

  const bulletStartY = headingY + headingHeight + 12;
  doc
    .font(fonts.body.regular)
    .fontSize(bodySize)
    .fillColor('#374151')
    .text(bulletText, x + padding, bulletStartY, {
      width: width - padding * 2,
      lineGap: 4,
    });

  return cardHeight;
}

function drawCircularProgress(
  doc: PDFKitDocument,
  percentage: number,
  centerX: number,
  centerY: number,
  radius: number,
  fonts: RegisteredFonts
) {
  const strokeWidth = 12;
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + (2 * Math.PI * (percentage / 100));

  // Background circle (gray)
  doc.save();
  doc
    .circle(centerX, centerY, radius)
    .lineWidth(strokeWidth)
    .strokeColor('#e0e0e0')
    .stroke();
  doc.restore();

  // Progress arc (gold)
  if (percentage > 0) {
    doc.save();
    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    doc.moveTo(x1, y1);
    
    // Draw arc
    const steps = Math.ceil(percentage * 3.6);
    for (let i = 0; i <= steps; i++) {
      const angle = startAngle + (endAngle - startAngle) * (i / steps);
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      doc.lineTo(x, y);
    }
    
    doc
      .lineWidth(strokeWidth)
      .strokeColor(ACCENT_GOLD)
      .stroke();
    doc.restore();
  }

  // Center text
  doc
    .font(fonts.heading.bold)
    .fontSize(28)
    .fillColor('#1a1a1a')
    .text(`${percentage.toFixed(1)}%`, centerX - 40, centerY - 14, {
      width: 80,
      align: 'center'
    });
}

async function buildPdf(
  lead: LeadForReport,
  summary: AssessmentSummary,
  absolutePath: string
): Promise<void> {
  await ensureReportsDirectory();

  await new Promise<void>((resolve, reject) => {
    const doc = new PDFDocument({ 
      size: 'A4', 
      margin: 0,
      bufferPages: true 
    });
    const stream = fs.createWriteStream(absolutePath);
    const cleanUp = (error?: Error) => {
      if (error) {
        stream.close();
        reject(error);
      } else {
        resolve();
      }
    };

    stream.on('finish', () => cleanUp());
    stream.on('error', (error) => cleanUp(error));
    doc.on('error', (error) => cleanUp(error));

    doc.pipe(stream);

    const fonts = registerDocumentFonts(doc);
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    // Full-width navy header
    const headerHeight = 240;
    doc.rect(0, 0, pageWidth, headerHeight).fill(HEADER_BG);

    // Company name in header
    doc
      .font(fonts.body.medium)
      .fontSize(9)
      .fillColor('#ffffff')
      .text('EPIIDOSIS GLOBAL FINANCE', 50, 50, {
        width: pageWidth - 100,
        align: 'right',
        characterSpacing: 1.5
      });

    // Main title
    doc
      .font(fonts.heading.bold)
      .fontSize(42)
      .fillColor('#ffffff')
      .text('Automated', 50, 90, { width: pageWidth - 100 });
    
    doc
      .font(fonts.heading.bold)
      .fontSize(42)
      .fillColor('#ffffff')
      .text('Assessment Report', 50, doc.y, { width: pageWidth - 100 });

    // Subtitle with tool name
    const toolName = friendlyToolName(lead.toolSlug);
    doc
      .font(fonts.heading.regular)
      .fontSize(20)
      .fillColor('#ffffff')
      .text(toolName, 50, doc.y + 8, { width: pageWidth - 100 });

    // Yellow accent line
    doc
      .moveTo(50, doc.y + 8)
      .lineTo(230, doc.y + 8)
      .strokeColor(ACCENT_GOLD)
      .lineWidth(2)
      .stroke();

    // Client info
    doc.y += 20;
    doc
      .font(fonts.body.regular)
      .fontSize(10.5)
      .fillColor('#ffffff')
      .text(`Prepared for ${lead.fullName}: ${lead.companyName || 'N/A'}`, 50, doc.y, {
        width: pageWidth - 100,
      });

    doc
      .font(fonts.body.regular)
      .fontSize(10.5)
      .fillColor('#ffffff')
      .text(`Generated on ${formatDateForReport(new Date())}`, 50, doc.y + 2, {
        width: pageWidth - 100,
      });

    // White content area starts
    const contentTop = headerHeight;
    doc.rect(0, contentTop, pageWidth, pageHeight - contentTop).fill(CARD_BG);

    doc.y = contentTop + 40;
    const leftCol = 50;
    const leftColWidth = 340;
    const rightCol = leftCol + leftColWidth + 20;
    const rightColWidth = 150;

    // Left column: Headline and narrative
    if (summary.headline) {
      doc
        .font(fonts.heading.bold)
        .fontSize(19)
        .fillColor('#1a1a1a')
        .text(summary.headline, leftCol, doc.y, {
          width: leftColWidth,
        });
    }

    if (summary.headlineDetail) {
      doc
        .font(fonts.body.regular)
        .fontSize(10.5)
        .fillColor('#333333')
        .text(summary.headlineDetail, leftCol, doc.y + 8, { 
          width: leftColWidth,
          lineGap: 2
        });
    }

    const narrativeY = doc.y + 12;
    doc
      .font(fonts.body.regular)
      .fontSize(10)
      .fillColor('#333333')
      .text(summary.summaryNarrative || '', leftCol, narrativeY, {
        width: leftColWidth,
        lineGap: 2.4,
      });

    const narrativeBottom = doc.y;

    // Right column: Metric cards
    const metricsStartY = contentTop + 40;

    let facilityRangeShort = 'N/A';
    if (summary.indicativeRange) {
      const rangeMatch = summary.indicativeRange.match(/AED\s+([\d,]+)/);
      if (rangeMatch) {
        facilityRangeShort = `AED ${rangeMatch[1]}`;
      }
    }

    const metricEntries = [
      { label: 'AED', value: '45 Million' },
      { label: 'Indicative\nFacility Range', value: facilityRangeShort },
      { label: 'Liquidity\nCoverage Ratio', value: summary.liquidityCoverageRatio || 'N/A' },
    ];

    const metricPanelWidth = rightColWidth;
    drawMetricPanel(doc, metricEntries, fonts, rightCol, metricsStartY, metricPanelWidth);
    const metricPanelBottom = metricsStartY + metricEntries.length * 68;

    // Draw horizontal divider
    const dividerY = Math.max(narrativeBottom + 28, metricsStartY + 76);
    doc
      .moveTo(leftCol, dividerY)
      .lineTo(leftCol + leftColWidth, dividerY)
      .strokeColor(ACCENT_GOLD)
      .lineWidth(2)
      .stroke();

    // Continue with detailed sections
    doc.y = Math.max(dividerY + 28, metricPanelBottom + 24);
    const sectionLeft = 50;
    const sectionWidth = pageWidth - 100;

    // Indicative facility sizing
    doc
      .font(fonts.heading.semiBold)
      .fontSize(14)
      .fillColor('#1a1a1a')
      .text('Indicative facility sizing', sectionLeft, doc.y);
    
    doc
      .font(fonts.heading.bold)
      .fontSize(18)
      .fillColor('#1a1a1a')
      .text(summary.indicativeRange || 'N/A', sectionLeft, doc.y + 6);

    doc
      .moveTo(sectionLeft, doc.y + 12)
      .lineTo(sectionLeft + 260, doc.y + 12)
      .strokeColor('#e0e0e0')
      .lineWidth(1)
      .stroke();

    // Liquidity coverage ratio section with circular chart
    const chartY = doc.y + 32;
    doc
      .font(fonts.heading.semiBold)
      .fontSize(14)
      .fillColor('#1a1a1a')
      .text('Liquidity coverage ratio', sectionLeft, chartY);

    // Extract percentage value
    const liquidityValue = summary.liquidityCoverageRatio || '0%';
    const liquidityPercent = parseFloat(liquidityValue.replace('%', ''));

    // Draw circular progress chart on the right
    const chartCenterX = rightCol + metricPanelWidth / 2;
    const chartCenterY = chartY + 78;
    drawCircularProgress(doc, liquidityPercent, chartCenterX, chartCenterY, 45, fonts);

    // Label below chart
    doc
      .font(fonts.body.regular)
      .fontSize(10)
      .fillColor('#666666')
      .text('Liquidity coverage ratio', chartCenterX - 60, chartCenterY + 60, {
        width: 120,
        align: 'center'
      });

    doc.y = chartY + 180;

    const insightSections: Array<{ title: string; items: string[] | undefined }> = [
      { title: 'Key signals observed', items: summary.keySignals },
      { title: 'Risk considerations', items: summary.riskNotes },
      { title: 'Spotlight insights', items: summary.spotlightInsights },
      { title: 'Recommended next steps', items: summary.nextSteps },
      { title: 'Recommended solutions', items: summary.recommendedSolutions },
      { title: 'Advisory desk notes', items: summary.advisoryNotes },
    ];

    const columnGutter = 24;
    const columnWidth = (sectionWidth - columnGutter) / 2;
    const columnX = [sectionLeft, sectionLeft + columnWidth + columnGutter];
    const columnBottomLimit = pageHeight - 120;

    let columnHeights = [doc.y, doc.y];
    let cardsRendered = false;

    const resetForNewPage = () => {
      doc.addPage();
      doc.rect(0, 0, pageWidth, pageHeight).fill(CARD_BG);
      const baseY = 60;
      columnHeights = [baseY, baseY];
      doc.y = baseY;
    };

    insightSections.forEach((section) => {
      const items = section.items?.filter(Boolean) ?? [];
      if (!items.length) {
        return;
      }

      const columnIndex = columnHeights[0] <= columnHeights[1] ? 0 : 1;
      let targetY = columnHeights[columnIndex];
      let cardHeight = drawInsightCard(
        doc,
        section.title,
        items,
        fonts,
        columnX[columnIndex],
        targetY,
        columnWidth,
        { measureOnly: true }
      );

      if (!cardHeight) {
        return;
      }

      if (targetY + cardHeight > columnBottomLimit) {
        resetForNewPage();
        targetY = columnHeights[columnIndex];
        cardHeight = drawInsightCard(
          doc,
          section.title,
          items,
          fonts,
          columnX[columnIndex],
          targetY,
          columnWidth,
          { measureOnly: true }
        );
        if (!cardHeight) {
          return;
        }
      }

      drawInsightCard(
        doc,
        section.title,
        items,
        fonts,
        columnX[columnIndex],
        targetY,
        columnWidth
      );
      columnHeights[columnIndex] = targetY + cardHeight + 18;
      cardsRendered = true;
    });

    if (cardsRendered) {
      doc.y = Math.max(columnHeights[0], columnHeights[1]);
    }

    // Footer on last page
    const footerY = pageHeight - 60;
    
    // Ensure we're not too close to the footer
    if (doc.y > footerY - 40) {
      doc.addPage();
      doc.rect(0, 0, pageWidth, pageHeight).fill(CARD_BG);
    }
    
    doc
      .font(fonts.body.regular)
      .fontSize(8.5)
      .fillColor('#666666')
      .text(
        'Confidential: Prepared by Epiidosis Global Finance based on the data shared via our tools hub. The assessment is indicative and subject to full credit review.',
        sectionLeft,
        footerY,
        {
          width: sectionWidth,
          lineGap: 2
        }
      );

    // Page number on each page
    const range = doc.bufferedPageRange();
    for (let i = 0; i < range.count; i++) {
      doc.switchToPage(i);
      doc
        .font(fonts.body.regular)
        .fontSize(9)
        .fillColor('#999999')
        .text(
          String(i + 1),
          pageWidth - 70,
          pageHeight - 30,
          { width: 20, align: 'right' }
        );
    }

    doc.end();
  });
}

export async function generateAndStoreAssessmentReport(
  lead: LeadForReport,
  summary: AssessmentSummary
): Promise<ReportTokenInfo | null> {
  const prisma = getPrismaClient();

  if (!prisma) {
    console.warn('[report-service] Prisma unavailable; skipping report generation.');
    return null;
  }

  const fileName = `${lead.id}.pdf`;
  const absolutePath = path.join(REPORTS_DIR, fileName);

  await buildPdf(lead, summary, absolutePath);

  const token = randomBytes(24).toString('hex');
  const expiresAt = new Date(Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000);

  const record = await prisma.assessmentReport.upsert({
    where: { leadId: lead.id },
    create: {
      leadId: lead.id,
      token,
      tokenExpiresAt: expiresAt,
      filePath: fileName,
    },
    update: {
      token,
      tokenExpiresAt: expiresAt,
      filePath: fileName,
    },
  });

  return {
    token: record.token,
    tokenExpiresAt: record.tokenExpiresAt,
    filePath: record.filePath,
    absolutePath,
  };
}

export function getReportDownloadUrl(token: string): string {
  const baseUrl = (process.env.APP_BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
  return `${baseUrl}/api/reports/${token}`;
}

export function resolveReportAbsolutePath(fileName: string): string {
  return path.join(REPORTS_DIR, fileName);
}
