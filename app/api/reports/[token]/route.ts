import fs from 'node:fs';

import { NextRequest, NextResponse } from 'next/server';

import getPrismaClient from '../../../../lib/db';
import { resolveReportAbsolutePath } from '../../../../lib/report-service';

type RouteContext = {
  params: {
    token: string;
  };
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const token = context.params.token;

  if (!token || typeof token !== 'string') {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
  }

  const prisma = getPrismaClient();

  if (!prisma) {
    return NextResponse.json(
      { error: 'Report service temporarily unavailable' },
      { status: 503 }
    );
  }

  const reportRecord = await prisma.assessmentReport.findUnique({
    where: { token },
  });

  if (!reportRecord) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }

  if (reportRecord.tokenExpiresAt.getTime() < Date.now()) {
    return NextResponse.json({ error: 'Report link expired' }, { status: 410 });
  }

  const absolutePath = resolveReportAbsolutePath(reportRecord.filePath);

  try {
    await fs.promises.access(absolutePath, fs.constants.R_OK);
  } catch (error) {
    console.error('[REPORT_DOWNLOAD_MISSING_FILE]', error);
    return NextResponse.json({ error: 'Report file unavailable' }, { status: 404 });
  }

  try {
    const fileBuffer = await fs.promises.readFile(absolutePath);

    const filenameHeader = encodeURIComponent(reportRecord.filePath);

    return new NextResponse(fileBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filenameHeader}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('[REPORT_DOWNLOAD_ERROR]', error);
    return NextResponse.json({ error: 'Unable to download report' }, { status: 500 });
  }
}
