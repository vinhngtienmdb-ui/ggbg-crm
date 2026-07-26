import { NextResponse } from 'next/server';
import { getUserAccounts, createUserAccount, toggleUserAccountStatus } from '@/lib/userStore';
import { getAuthenticatedSessionUser, isAuthorizedForAdminAction } from '@/lib/authSession';
export const dynamic = 'force-dynamic';

export async function GET() {
  const sessionUser = await getAuthenticatedSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ success: false, message: 'Chưa đăng nhập' }, { status: 401 });
  }

  try {
    const users = getUserAccounts();
    return NextResponse.json({ success: true, users });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi lấy danh sách user' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const sessionUser = await getAuthenticatedSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ success: false, message: 'Chưa đăng nhập' }, { status: 401 });
  }

  if (!isAuthorizedForAdminAction(sessionUser)) {
    return NextResponse.json({ success: false, message: 'Không có quyền thực hiện thao tác này' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { username, password, employee_name, employee_code, email, role, role_name } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Tên đăng nhập và mật khẩu là bắt buộc' },
        { status: 400 }
      );
    }

    try {
      const newUser = createUserAccount({
        profile_id: `p_${Date.now()}`,
        employee_code: employee_code || 'NV-00108',
        employee_name: employee_name || 'Nhân viên mới HRM',
        username: username,
        email: email,
        password: password,
        role: role || 'SALE_EXEC',
        role_name: role_name || 'Nhân Viên Sale Exec',
        account_status: 'Active',
        is_super_admin: false,
      });

      return NextResponse.json({ success: true, user: newUser, message: 'Tạo tài khoản thành công!' });
    } catch (err: any) {
      return NextResponse.json(
        { success: false, message: err.message || 'Tên đăng nhập hoặc Email đã tồn tại' },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi tạo tài khoản' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const sessionUser = await getAuthenticatedSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ success: false, message: 'Chưa đăng nhập' }, { status: 401 });
  }

  if (!isAuthorizedForAdminAction(sessionUser)) {
    return NextResponse.json({ success: false, message: 'Không có quyền thực hiện thao tác này' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'User ID là bắt buộc' }, { status: 400 });
    }

    const updatedUsers = toggleUserAccountStatus(id);
    return NextResponse.json({ success: true, users: updatedUsers, message: 'Cập nhật trạng thái thành công!' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi cập nhật trạng thái' }, { status: 500 });
  }
}
