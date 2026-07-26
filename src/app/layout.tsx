'use client';

import React, { useState } from 'react';
import './globals.css';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ModuleToggleProvider } from '@/context/ModuleToggleContext';
import { ToastProvider } from '@/context/ToastContext';
import { AuditProvider } from '@/context/AuditContext';
import { usePathname } from 'next/navigation';

const VoIPCallModal = dynamic(() => import('@/components/telephony/VoIPCallModal'), { ssr: false });

import MobileBottomNav from '@/components/layout/MobileBottomNav';
import AccessDeniedGuard from '@/components/layout/AccessDeniedGuard';
import { useAuth } from '@/context/AuthContext';
import { useModuleToggles } from '@/context/ModuleToggleContext';
import { isRouteAllowedForRole } from '@/lib/permissions';

function AppLayout({ children }: { children: React.ReactNode }) {
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, simulatedRole } = useAuth();
  const { toggles } = useModuleToggles();

  const activeRole = simulatedRole || user?.role || 'SUPER_ADMIN';

  // If visiting /login page, render clean without Sidebar & Header
  if (pathname === '/login') {
    return <main className="min-h-screen bg-surface-page">{children}</main>;
  }

  const isAllowed = isRouteAllowedForRole(pathname, activeRole, toggles);

  return (
    <div className="flex h-screen bg-surface-page text-ink-900 overflow-hidden font-sans">
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header
          onOpenPhoneModal={() => setIsPhoneModalOpen(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />
        <main className="flex-1 overflow-y-auto p-3.5 md:px-6 md:py-[22px] pb-20 md:pb-6 bg-surface-page touch-scroll">
          {isAllowed ? children : <AccessDeniedGuard />}
        </main>
      </div>

      <MobileBottomNav
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      <VoIPCallModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
      />
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <title>GGBingo CRM - Enterprise E-Commerce Platform</title>
        <meta name="description" content="Hệ thống CRM quản lý khách hàng, lead, dịch vụ vận hành gian hàng TMĐT và nền tảng GGBingoVN" />
      </head>
      <body className="bg-surface-page text-ink-900 overflow-hidden font-sans">
        <ThemeProvider>
          <AuthProvider>
            <AuditProvider>
              <ToastProvider>
                <ModuleToggleProvider>
                  <AppLayout>{children}</AppLayout>
                </ModuleToggleProvider>
              </ToastProvider>
            </AuditProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
