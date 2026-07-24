import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { findUserByUsernameOrEmail } from '@/lib/userStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('ggbg_crm_session');

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const userData = JSON.parse(sessionCookie.value);

    // Verify current account status from userStore if present
    const currentAccount = findUserByUsernameOrEmail(userData.username);
    if (currentAccount) {
      const statusUpper = (currentAccount.account_status || 'ACTIVE').toUpperCase();
      if (statusUpper === 'LOCKED' || statusUpper === 'INACTIVE' || statusUpper === 'SUSPENDED') {
        return NextResponse.json({ authenticated: false, user: null, message: 'Tài khoản của bạn đã bị khóa hoặc ngưng hoạt động.' }, { status: 401 });
      }
    }

    const activeStatus = currentAccount ? currentAccount.account_status : (userData.account_status || 'Active');

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
        roles: userData.roles || [userData.role],
        permissions: userData.permissions || (userData.is_super_admin ? ['*'] : []),
        login_at: userData.login_at,
      },
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }
}
