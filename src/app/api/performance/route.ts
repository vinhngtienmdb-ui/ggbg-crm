import { NextResponse } from 'next/server';
import {
  getScorecards,
  createScorecard,
  updateScorecard,
  getFormulaWeights,
  updateFormulaWeights,
  runAutomatedBatchEvaluation,
} from '@/lib/performanceStore';
import { guardApi } from '@/lib/apiGuard';

export async function GET(request: Request) {
  const session = await guardApi(request);
  if (session instanceof NextResponse) return session;
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'formula') {
      const weights = getFormulaWeights();
      return NextResponse.json({ success: true, data: weights });
    }

    const scorecards = getScorecards();
    return NextResponse.json({ success: true, data: scorecards });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await guardApi(request);
  if (session instanceof NextResponse) return session;
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'batch_auto_score') {
      const body = await request.json().catch(() => ({}));
      const period = typeof body.period === 'string' && body.period.length <= 100 ? body.period : 'Tháng 07/2026';
      const updatedList = runAutomatedBatchEvaluation(period);
      return NextResponse.json({ success: true, message: `Auto evaluation complete for ${period}`, data: updatedList });
    }

    const body = await request.json();
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return NextResponse.json({ success: false, message: 'Dữ liệu không hợp lệ' }, { status: 400 });
    }
    const created = createScorecard(body);
    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  const session = await guardApi(request);
  if (session instanceof NextResponse) return session;
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'formula') {
      const body = await request.json();
      if (typeof body !== 'object' || body === null || Array.isArray(body)) {
        return NextResponse.json({ success: false, message: 'Dữ liệu không hợp lệ' }, { status: 400 });
      }
      const updatedWeights = updateFormulaWeights(body);
      return NextResponse.json({ success: true, data: updatedWeights });
    }

    const body = await request.json();
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return NextResponse.json({ success: false, message: 'Dữ liệu không hợp lệ' }, { status: 400 });
    }
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Scorecard ID is required' }, { status: 400 });
    }
    const updated = updateScorecard(id, updates);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
