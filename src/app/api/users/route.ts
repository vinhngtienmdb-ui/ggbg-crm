import { NextResponse } from 'next/server';
import {
  getUserAccounts,
  createUserAccount,
  toggleUserAccountStatus,
  updateUserAccount,
  deleteUserAccount,
  resetUserPassword
} from '@/lib/userStore';
import { getAuthenticatedSessionUser, isAuthorizedForAdminAction } from '@/lib/authSession';
import { hashPassword } from '@/lib/password';

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
      const password_hash = await hashPassword(password);
      const newUser = createUserAccount({
        profile_id: `p_${Date.now()}`,
        employee_code: employee_code || 'NV-00108',
        employee_name: employee_name || 'Nhân viên mới HRM',
        username: username,
        email: email,
        password_hash,
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

// Toggle status or Edit Account / Admin Reset Password
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
    const { action, id, employee_name, email, role, role_name, account_status, new_password } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'User ID là bắt buộc' }, { status: 400 });
    }

    if (action === 'RESET_PASSWORD') {
      if (!new_password || new_password.trim().length < 6) {
        return NextResponse.json({ success: false, message: 'Mật khẩu mới phải có tối thiểu 6 ký tự' }, { status: 400 });
      }
      const password_hash = await hashPassword(new_password.trim());
      resetUserPassword(id, password_hash);
      const updatedUsers = getUserAccounts();
      return NextResponse.json({ success: true, users: updatedUsers, message: 'Reset mật khẩu người dùng thành công!' });
    }

    // Default: Edit user profile fields
    const updates: any = {};
    if (employee_name) updates.employee_name = employee_name;
    if (email) updates.email = email;
    if (role) updates.role = role;
    if (role_name) updates.role_name = role_name;
    if (account_status) updates.account_status = account_status;

    const updatedUsers = updateUserAccount(id, updates);
    return NextResponse.json({ success: true, users: updatedUsers, message: 'Cập nhật tài khoản người dùng thành công!' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Lỗi cập nhật tài khoản' }, { status: 500 });
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

export async function DELETE(request: Request) {
  const sessionUser = await getAuthenticatedSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ success: false, message: 'Chưa đăng nhập' }, { status: 401 });
  }

  if (!isAuthorizedForAdminAction(sessionUser)) {
    return NextResponse.json({ success: false, message: 'Không có quyền thực hiện thao tác này' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'User ID là bắt buộc' }, { status: 400 });
    }

    try {
      const updatedUsers = deleteUserAccount(id);
      return NextResponse.json({ success: true, users: updatedUsers, message: 'Đã xóa tài khoản thành công!' });
    } catch (err: any) {
      return NextResponse.json({ success: false, message: err.message || 'Không thể xóa tài khoản này' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi xóa tài khoản' }, { status: 500 });
  }
}
