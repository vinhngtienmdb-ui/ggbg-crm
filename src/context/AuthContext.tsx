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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [simulatedRole, setSimulatedRole] = useState<UserRole>('SUPER_ADMIN');
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          setSimulatedRole(data.user.role || 'SUPER_ADMIN');
          return;
        }
      }
      setUser(null);
      await fetch('/api/auth/logout', { method: 'POST' });
      if (pathname !== '/login') {
        router.push('/login');
      }
    } catch {
      setUser(null);
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
      router.push('/login');
    } catch {
      setUser(null);
      router.push('/login');
    }
  };

  if (!isMounted || (isLoading && pathname !== '/login')) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white font-sans">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-semibold text-slate-300 tracking-wide">
          Đang xác thực hệ thống GGBingo CRM...
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
