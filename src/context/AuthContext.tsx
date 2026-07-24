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
  roles?: string[];
  permissions?: string[];
  login_at: string;
}

interface AuthContextType {
  user: UserSession | null;
  simulatedRole: UserRole;
  setSimulatedRole: (role: UserRole) => void;
  isLoading: boolean;
  login: (u: string, p: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const DEFAULT_SUPER_ADMIN_SESSION: UserSession = {
  id: 'usr_admin_001',
  username: 'admin',
  email: 'admin@ggbingo.vn',
  name: 'Super Admin',
  role: 'SUPER_ADMIN',
  role_name: 'Quản Trị Viên Cao Cấp System',
  is_super_admin: true,
  employee_code: 'GGBG-ADMIN-01',
  login_at: new Date().toLocaleString('vi-VN'),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(DEFAULT_SUPER_ADMIN_SESSION);
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

  const login = async (usernameInput: string, passwordInput: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput }),
      });

      const data = await res.json();
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
      setUser(null);
      localStorage.removeItem('ggbg_crm_user');
      router.push('/login');
    } catch {
      setUser(null);
      localStorage.removeItem('ggbg_crm_user');
      router.push('/login');
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white font-sans">
        <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-xs font-semibold text-slate-300 tracking-wide">
          Đang tải GGBingo CRM...
        </p>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        simulatedRole,
        setSimulatedRole,
        isLoading,
        login,
        logout,
        refreshSession: fetchSession,
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
