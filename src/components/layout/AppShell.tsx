'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useModuleToggles } from '@/context/ModuleToggleContext';
import { isRouteAllowedForRole } from '@/lib/permissions';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import AccessDeniedGuard from '@/components/layout/AccessDeniedGuard';
import { ToastProvider } from '@/components/ui/Toast';

const VoIPCallModal = dynamic(() => import('@/components/telephony/VoIPCallModal'), { ssr: false });

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const pathname = usePathname();
  const { user, simulatedRole } = useAuth();
  const { toggles } = useModuleToggles();

  const activeRole = simulatedRole || user?.role || 'SUPER_ADMIN';

  // Login page — render clean, no shell
  if (pathname === '/login') {
    return <main className="min-h-screen bg-slate-900">{children}</main>;
  }

  const isAllowed = isRouteAllowedForRole(pathname, activeRole, toggles);

  return (
    <ToastProvider>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
        <Sidebar
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((v) => !v)}
        />

        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden transition-all duration-300">
          <Header
            onOpenPhoneModal={() => setIsPhoneModalOpen(true)}
            onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          />
          <main className="flex-1 overflow-y-auto p-3 sm:p-6 pb-20 md:pb-6 bg-slate-50 dark:bg-slate-950 touch-scroll sleek-scrollbar">
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
    </ToastProvider>
  );
}
