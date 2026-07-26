import { NextResponse } from 'next/server';
import {
  createScorecard as createScorecardStore,
  updateScorecard as updateScorecardStore,
  getFormulaWeights,
  updateFormulaWeights,
  runAutomatedBatchEvaluation,
} from '@/lib/performanceStore';
import {
  listScorecards,
  createScorecard as createScorecardRepo,
  updateScorecard as updateScorecardRepo,
} from '@/lib/performanceRepo';
import { guardApi } from '@/lib/apiGuard';

export const dynamic = 'force-dynamic';

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

    // Dual-mode: đọc qua repo (Supabase hoặc in-memory).
    const scorecards = await listScorecards();
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
      // Đồng bộ DB (dual-mode): upsert từng bảng điểm của kỳ vừa chấm.
      for (const sc of updatedList.filter((s) => s.period === period)) {
        const updated = await updateScorecardRepo(sc.id, sc);
        if (!updated) await createScorecardRepo(sc);
      }
      return NextResponse.json({ success: true, message: `Auto evaluation complete for ${period}`, data: updatedList });
    }

    const body = await request.json();
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return NextResponse.json({ success: false, message: 'Dữ liệu không hợp lệ' }, { status: 400 });
    }
    // Store tính điểm & xếp loại → persist qua repo.
    const created = createScorecardStore(body);
    await createScorecardRepo(created);
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
    // Store tính lại điểm/xếp loại → persist qua repo.
    const updated = updateScorecardStore(id, updates);
    await updateScorecardRepo(id, updated);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
