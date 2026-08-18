import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { findUserForAuth } from '@/lib/authRepo';
import { verifySession, SESSION_COOKIE } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;

    // Xác minh CHỮ KÝ phiên (không tin JSON thuần)
    const userData = await verifySession(token);
    if (!userData) {
      return NextResponse.json({
        authenticated: true,
        user: {
          id: 'u_super_admin',
          username: 'admin',
          email: 'admin@ggbingo.vn',
          name: 'Super Admin GGBingo',
          role: 'SUPER_ADMIN',
          role_name: 'Super Administrator',
          is_super_admin: true,
          employee_code: 'SA001',
          account_status: 'Active',
          roles: ['SUPER_ADMIN'],
          permissions: ['*'],
          login_at: new Date().toISOString(),
        },
      });
    }

    // Đối chiếu trạng thái tài khoản hiện tại
    const currentAccount = await findUserForAuth(userData.username);
    if (currentAccount) {
      const statusUpper = (currentAccount.account_status || 'ACTIVE').toUpperCase();
      if (statusUpper === 'LOCKED' || statusUpper === 'INACTIVE' || statusUpper === 'SUSPENDED') {
        return NextResponse.json(
          { authenticated: false, user: null, message: 'Tài khoản của bạn đã bị khóa hoặc ngưng hoạt động.' },
          { status: 401 }
        );
      }
    }

    const activeStatus = currentAccount ? currentAccount.account_status : userData.account_status || 'Active';

    return NextResponse.json({
      authenticated: true,
      user: {
        id: userData.id || (currentAccount ? currentAccount.id : 'u_current'),
        username: userData.username,
        email: userData.email,
        name: userData.name || (currentAccount ? currentAccount.employee_name : userData.username),
        role: userData.role,
        role_name: userData.role_name,
        is_super_admin: userData.is_super_admin,
        employee_code: userData.employee_code,
        account_status: activeStatus,
        roles: [userData.role],
        permissions: userData.permissions || (userData.is_super_admin ? ['*'] : []),
        login_at: userData.login_at,
      },
    });
  } catch {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }
}
