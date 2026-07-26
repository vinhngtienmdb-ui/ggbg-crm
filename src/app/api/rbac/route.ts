import { NextResponse } from 'next/server';
import { getRolePermissionsMatrix, updateRolePermission, getAuditLogs } from '@/lib/userStore';
import { getAuthenticatedSessionUser, isAuthorizedForAdminAction } from '@/lib/authSession';
export const dynamic = 'force-dynamic';

export async function GET() {
  const sessionUser = await getAuthenticatedSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ success: false, message: 'Chưa đăng nhập' }, { status: 401 });
  }

  try {
    const matrix = getRolePermissionsMatrix();
    const auditLogs = getAuditLogs();
    return NextResponse.json({ success: true, matrix, auditLogs });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi lấy dữ liệu RBAC' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const sessionUser = await getAuthenticatedSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ success: false, message: 'Chưa đăng nhập' }, { status: 401 });
  }

  if (!isAuthorizedForAdminAction(sessionUser)) {
    return NextResponse.json({ success: false, message: 'Không có quyền thực hiện thao tác này' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { role, roleId, roleName, module, action, updates } = body;

    const targetRoleUpper = (role || roleName || '').toString().toUpperCase();
    const targetRoleId = (roleId || '').toString();

    // Protect Super Admin Role Integrity: prevent modifying or revoking SUPER_ADMIN permissions
    if (
      targetRoleUpper === 'SUPER_ADMIN' ||
      targetRoleId === 'r0' ||
      role === 'r0'
    ) {
      return NextResponse.json(
        { success: false, message: 'Không thể thay đổi quyền Super Admin' },
        { status: 403 }
      );
    }

    if (!role || !module || !action) {
      return NextResponse.json({ success: false, message: 'Thông tin phân quyền không đầy đủ' }, { status: 400 });
    }

    const updatedMatrix = updateRolePermission(role, module, action, updates);
    const auditLogs = getAuditLogs();

    return NextResponse.json({
      success: true,
      matrix: updatedMatrix,
      auditLogs,
      message: 'Cập nhật phân quyền RBAC thành công!',
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi cập nhật RBAC' }, { status: 500 });
  }
}
