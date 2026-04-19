import { NextRequest, NextResponse } from 'next/server';

import getPrismaClient from '../../../../lib/db';

const LEAD_STATUSES = ['NEW', 'IN_REVIEW', 'CONTACTED', 'CLOSED'] as const;
type LeadStatus = (typeof LEAD_STATUSES)[number];

function ensureAdminApiKey(): string {
  const key = process.env.ADMIN_API_KEY;
  if (!key) {
    throw new Error('ADMIN_API_KEY is not configured');
  }
  return key;
}

function isAuthorized(request: NextRequest): boolean {
  try {
    const expectedKey = ensureAdminApiKey();
    const providedKey = request.headers.get('x-api-key');
    return Boolean(providedKey) && providedKey === expectedKey;
  } catch (error) {
    console.error('[ADMIN_API_KEY_ERROR]', error);
    return false;
  }
}

export async function PATCH(request: NextRequest) {
  const prisma = getPrismaClient();

  if (!prisma) {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const { id, status, threadId } = body as {
    id?: string;
    status?: string;
    threadId?: string | null;
  };

  if (!id) {
    return NextResponse.json({ error: 'Lead id is required' }, { status: 400 });
  }

  const updateData: { status?: LeadStatus; threadId?: string | null } = {};

  if (typeof status === 'string') {
    const normalizedStatus = status.toUpperCase();
    if (!LEAD_STATUSES.includes(normalizedStatus as LeadStatus)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }
    updateData.status = normalizedStatus as LeadStatus;
  }

  if (threadId !== undefined) {
    updateData.threadId = threadId;
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  try {
    const updatedLead = await prisma.lead.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ lead: updatedLead });
  } catch (error) {
    console.error('[ADMIN_LEADS_PATCH]', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const prisma = getPrismaClient();

  if (!prisma) {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const limitParam = url.searchParams.get('limit');
  const statusParam = url.searchParams.get('status');

  const take = limitParam ? Math.min(Math.max(parseInt(limitParam, 10), 1), 100) : 50;

  let where: { status?: LeadStatus } | undefined;
  if (statusParam) {
    const normalizedStatus = statusParam.toUpperCase();
    if (!LEAD_STATUSES.includes(normalizedStatus as LeadStatus)) {
      return NextResponse.json({ error: 'Invalid status filter' }, { status: 400 });
    }
    where = { status: normalizedStatus as LeadStatus };
  }

  try {
    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take,
    });

    return NextResponse.json({ leads });
  } catch (error) {
    console.error('[ADMIN_LEADS_GET]', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}
