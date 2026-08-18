'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { UserRole } from '@/types';

export interface UserSession {
  id?: string;
  username: string;
  email: string;
  name: string;
  role: UserRole;
  role_name: string;
  is_super_admin: boolean;
  employee_code: string;
  account_status?: string;
  is_2fa_enabled?: boolean;
  roles?: string[];
  permissions?: string[];
  login_at: string;
}

interface AuthContextType {
  user: UserSession | null;
  simulatedRole: UserRole;
  setSimulatedRole: (role: UserRole) => void;
  isLoading: boolean;
  login: (u: string, p: string, totpCode?: string) => Promise<{ success: boolean; require_2fa?: boolean; message: string }>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_ADMIN_USER: UserSession = {
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
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(DEFAULT_ADMIN_USER);
  const [simulatedRole, setSimulatedRole] = useState<UserRole>('SUPER_ADMIN');
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const fetchSession = async () => {
    try {
      const savedUser = localStorage.getItem('ggbg_crm_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setSimulatedRole(parsed.role || 'SUPER_ADMIN');
      }
    } catch {
      // fallback
    }

    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          setSimulatedRole(data.user.role || 'SUPER_ADMIN');
          try {
            localStorage.setItem('ggbg_crm_user', JSON.stringify(data.user));
          } catch {
            // ignore
          }
        }
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchSession();
  }, []);

  const login = async (usernameInput: string, passwordInput: string, totpCode?: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput, totp_code: totpCode }),
      });

      const data = await res.json();
      if (data.require_2fa) {
        return { success: false, require_2fa: true, message: data.message };
      }

      if (data.success && data.user) {
        setUser(data.user);
        setSimulatedRole(data.user.role || 'SUPER_ADMIN');
        try {
          localStorage.setItem('ggbg_crm_user', JSON.stringify(data.user));
        } catch {
          // ignore
        }
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Đăng nhập thất bại' };
      }
    } catch {
      return { success: false, message: 'Không thể kết nối đến hệ thống xác thực' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      setUser(null);
      try {
        localStorage.removeItem('ggbg_crm_user');
      } catch {
        // ignore
      }
      router.push('/login');
    }
  };

  const refreshSession = async () => {
    await fetchSession();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        simulatedRole,
        setSimulatedRole,
        isLoading,
        login,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
