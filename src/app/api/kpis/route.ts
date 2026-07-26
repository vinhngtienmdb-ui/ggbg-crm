import { NextResponse } from 'next/server';
import { getKPIs, createKPI, updateKPI } from '@/lib/kpiStore';
export async function GET() {
  try {
    const kpis = getKPIs();
    return NextResponse.json({ success: true, data: kpis });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = createKPI(body);
    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'KPI ID is required' }, { status: 400 });
    }
    const updated = updateKPI(id, updates);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
