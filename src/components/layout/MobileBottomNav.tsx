'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, UserCheck, MessageSquare, Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useModuleToggles } from '@/context/ModuleToggleContext';
import { isRouteAllowedForRole } from '@/lib/permissions';
interface MobileBottomNavProps {
  onToggleMobileSidebar: () => void;
}

export default function MobileBottomNav({ onToggleMobileSidebar }: MobileBottomNavProps) {
  const pathname = usePathname();
  const { user, simulatedRole } = useAuth();
  const { toggles } = useModuleToggles();
  const activeRole = simulatedRole || user?.role || 'SUPER_ADMIN';

  const navItems = [
    { name: 'Tổng quan', href: '/', icon: LayoutDashboard },
    { name: 'Khách hàng', href: '/customers', icon: Users, moduleKey: 'customers' as const },
    { name: 'Lead', href: '/leads', icon: UserCheck, moduleKey: 'leads' as const },
    { name: 'CSKH', href: '/chat', icon: MessageSquare, moduleKey: 'chat' as const },
  ];

  const visibleNavItems = navItems.filter((item) => {
    if (item.moduleKey && toggles[item.moduleKey] === false) return false;
    return isRouteAllowedForRole(item.href, activeRole, toggles);
  });

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-[58px] bg-white border-t border-line flex items-stretch justify-around">
      {visibleNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors active:scale-95 ${
              isActive ? 'text-brand-600' : 'text-ink-400'
            }`}
          >
            <Icon className="w-[18px] h-[18px]" />
            <span className="text-[9px] font-bold">{item.name}</span>
          </Link>
        );
      })}

      <button
        onClick={onToggleMobileSidebar}
        className="flex-1 flex flex-col items-center justify-center gap-0.5 text-ink-400 hover:text-brand-600 transition-colors active:scale-95"
      >
        <Menu className="w-[18px] h-[18px]" />
        <span className="text-[9px] font-bold">Tất cả</span>
      </button>
    </nav>
  );
}
