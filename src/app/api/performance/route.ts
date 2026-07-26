import { NextResponse } from 'next/server';
import {
  getScorecards,
  createScorecard,
  updateScorecard,
  getFormulaWeights,
  updateFormulaWeights,
  runAutomatedBatchEvaluation,
} from '@/lib/performanceStore';
export async function GET(request: Request) {
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
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'batch_auto_score') {
      const body = await request.json().catch(() => ({}));
      const period = body.period || 'Tháng 07/2026';
      const updatedList = runAutomatedBatchEvaluation(period);
      return NextResponse.json({ success: true, message: `Auto evaluation complete for ${period}`, data: updatedList });
    }

    const body = await request.json();
    const created = createScorecard(body);
    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'formula') {
      const body = await request.json();
      const updatedWeights = updateFormulaWeights(body);
      return NextResponse.json({ success: true, data: updatedWeights });
    }

    const body = await request.json();
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
