import { cookies } from 'next/headers';
import { findUserByUsernameOrEmail } from '@/lib/userStore';
import { verifySession, SESSION_COOKIE } from '@/lib/session';

export interface SessionUser {
  id?: string;
  username: string;
  email?: string;
  name?: string;
  role: string;
  role_name?: string;
  is_super_admin?: boolean;
  permissions?: string[];
  account_status?: string;
}

export async function getAuthenticatedSessionUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;

    // Xác minh CHỮ KÝ phiên (không tin JSON thuần)
    const userData = await verifySession(token);
    if (!userData || !userData.username) {
      return null;
    }

    const currentAccount = findUserByUsernameOrEmail(userData.username);
    if (currentAccount) {
      const statusUpper = (currentAccount.account_status || 'ACTIVE').toUpperCase();
      if (statusUpper === 'LOCKED' || statusUpper === 'INACTIVE' || statusUpper === 'SUSPENDED') {
        return null;
      }
      return {
        id: currentAccount.id,
        username: currentAccount.username,
        email: currentAccount.email,
        name: currentAccount.employee_name,
        role: currentAccount.role,
        role_name: currentAccount.role_name,
        is_super_admin: currentAccount.is_super_admin,
        permissions: currentAccount.permissions || (currentAccount.is_super_admin ? ['*'] : []),
        account_status: currentAccount.account_status,
      };
    }

    return userData;
  } catch {
    return null;
  }
}

export function isAuthorizedForAdminAction(user: SessionUser | null): boolean {
  if (!user) return false;
  if (user.is_super_admin) return true;
  const role = (user.role || '').toUpperCase();
  if (role === 'SUPER_ADMIN' || role === 'ADMIN') return true;
  if (Array.isArray(user.permissions) && (user.permissions.includes('manage_users') || user.permissions.includes('*'))) {
    return true;
  }
  return false;
}
