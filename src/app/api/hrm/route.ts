import { NextResponse } from 'next/server';
import { guardApi } from '@/lib/apiGuard';
import { getEmployees, createEmployee, updateEmployee, getOrgChartTree } from '@/lib/hrmStore';

const HRM_ROLES = ['HR_MANAGER', 'DIRECTOR'];

export async function GET(request: Request) {
  const session = await guardApi(request);
  if (session instanceof NextResponse) return session;
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode');

    if (mode === 'org_chart') {
      const orgTree = getOrgChartTree();
      return NextResponse.json({ success: true, data: orgTree });
    }

    const employees = getEmployees();
    return NextResponse.json({ success: true, data: employees });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await guardApi(request, { roles: HRM_ROLES });
  if (session instanceof NextResponse) return session;
  try {
    const body = await request.json();
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return NextResponse.json({ success: false, message: 'Dữ liệu không hợp lệ' }, { status: 400 });
    }
    const created = createEmployee(body);
    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  const session = await guardApi(request, { roles: HRM_ROLES });
  if (session instanceof NextResponse) return session;
  try {
    const body = await request.json();
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return NextResponse.json({ success: false, message: 'Dữ liệu không hợp lệ' }, { status: 400 });
    }
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Employee ID is required' }, { status: 400 });
    }
    const updated = updateEmployee(id, updates);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
