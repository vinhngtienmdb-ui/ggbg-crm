'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ModuleToggleProvider, useModuleToggles } from '@/context/ModuleToggleContext';
import { BrandingProvider } from '@/context/BrandingContext';
import { ToastProvider } from '@/components/ui/Toast';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import AccessDeniedGuard from '@/components/layout/AccessDeniedGuard';
import { isRouteAllowedForRole } from '@/lib/permissions';

const VoIPCallModal = dynamic(() => import('@/components/telephony/VoIPCallModal'), { ssr: false });

function AppLayoutInner({ children }: { children: React.ReactNode }) {
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, simulatedRole } = useAuth();
  const { toggles } = useModuleToggles();

  const activeRole = simulatedRole || user?.role || 'SUPER_ADMIN';

  // If visiting /login page, render clean without Sidebar & Header
  if (pathname === '/login') {
    return <main className="min-h-screen bg-slate-900">{children}</main>;
  }

  const isAllowed = isRouteAllowedForRole(pathname || '/', activeRole, toggles);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header
          onOpenPhoneModal={() => setIsPhoneModalOpen(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 pb-20 md:pb-6 bg-slate-50 touch-scroll">
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

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <BrandingProvider>
      <ThemeProvider>
        <AuthProvider>
          <ModuleToggleProvider>
            <ToastProvider>
              <AppLayoutInner>{children}</AppLayoutInner>
            </ToastProvider>
          </ModuleToggleProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrandingProvider>
  );
}
