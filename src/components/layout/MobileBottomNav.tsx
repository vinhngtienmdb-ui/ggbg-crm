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
    { name: 'Tổng Quan', href: '/', icon: LayoutDashboard },
    { name: 'Khách Hàng', href: '/customers', icon: Users, moduleKey: 'customers' as const },
    { name: 'Quản Lý Lead', href: '/leads', icon: UserCheck, moduleKey: 'leads' as const },
    { name: 'CSKH', href: '/chat', icon: MessageSquare, moduleKey: 'chat' as const },
  ];

  // Filter items based on permission & toggles
  const visibleNavItems = navItems.filter((item) => {
    if (item.moduleKey && toggles[item.moduleKey] === false) return false;
    return isRouteAllowedForRole(item.href, activeRole, toggles);
  });

  return ( <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 flex items-center justify-around shadow-lg"> {visibleNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return ( <Link
            key={item.href}
            href={item.href}
            prefetch={true}
            className={`flex flex-col items-center justify-center py-1 px-2 min-w-[56px] rounded-xl text-[10px] font-medium transition-all active:scale-95 ${
              isActive ? 'text-blue-600 font-semibold' : 'text-slate-400 hover:text-blue-600'
            }`}
          > <div className={`p-1 rounded-lg ${isActive ? 'bg-blue-50 text-blue-600' : ''}`}> <Icon className="w-5 h-5" /> </div> <span className="mt-0.5">{item.name}</span> </Link> );
      })}

      {/* Menu Drawer Toggle Button */} <button
        onClick={onToggleMobileSidebar}
        className="flex flex-col items-center justify-center py-1 px-2 min-w-[56px] rounded-xl text-[10px] font-medium text-slate-400 hover:text-blue-600 transition-all active:scale-95"
      > <div className="p-1 rounded-lg hover:bg-blue-50"> <Menu className="w-5 h-5" /> </div> <span className="mt-0.5">Tất Cả</span> </button> </nav> );
}
