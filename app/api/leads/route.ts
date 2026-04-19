import { NextRequest, NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';

import { generateAssessmentSummary } from '../../../lib/assessment';
import { sendLeadEmailsAndAssessment } from '../../../lib/lead-mailer';
import { validateLeadSubmission } from '../../../lib/lead-validation';
import getPrismaClient from '../../../lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = validateLeadSubmission(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid submission',
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    const submission = validation.data;

    const assessmentSummary = generateAssessmentSummary(submission);

    const {
      toolSlug,
      fullName,
      companyName,
      email,
      phone,
      country,
      ...payload
    } = submission;

    const prisma = getPrismaClient();

    const payloadJson = payload as Prisma.InputJsonValue;
    const assessmentJson = assessmentSummary as Prisma.InputJsonValue;

    const lead = prisma
      ? await prisma.lead.create({
          data: {
            toolSlug,
            fullName,
            companyName: typeof companyName === 'string' ? companyName : null,
            email,
            phone: typeof phone === 'string' ? phone : null,
            country: typeof country === 'string' ? country : null,
            payload: payloadJson,
            assessment: assessmentJson,
          },
        })
      : {
          id: `temp_${Date.now()}`,
          toolSlug,
          fullName,
          companyName: typeof companyName === 'string' ? companyName : null,
          email,
          phone: typeof phone === 'string' ? phone : null,
          country: typeof country === 'string' ? country : null,
          payload: payloadJson,
          assessment: assessmentJson,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

    await sendLeadEmailsAndAssessment({
      toolSlug,
      leadData: lead,
      assessmentSummary,
    });

    return NextResponse.json({
      ok: true,
      assessmentSummary,
    });
  } catch (error) {
    console.error('[LEADS_POST_ERROR]', error);
    return NextResponse.json(
      { error: 'Unable to process request' },
      { status: 500 }
    );
  }
}
