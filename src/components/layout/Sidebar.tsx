'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  TrendingUp,
  Briefcase,
  Package,
  Award,
  ShieldCheck,
  UserCog,
  PhoneCall,
  Building2,
  Settings,
  MessageSquare,
  PieChart,
  ShoppingBag,
  ShieldAlert,
  FileText,
  X,
  Lock,
  Sparkles
} from 'lucide-react';

import { useModuleToggles } from '@/context/ModuleToggleContext';
import { useAuth } from '@/context/AuthContext';
import { useBranding } from '@/context/BrandingContext';
import { getFilteredMenuClusters, MenuItemDefinition } from '@/lib/permissions';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Users,
  UserCheck,
  MessageSquare,
  ShoppingBag,
  PieChart,
  FileText,
  Briefcase,
  Package,
  TrendingUp,
  Award,
  UserCog,
  ShieldAlert,
  ShieldCheck,
  Settings,
};

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { toggles } = useModuleToggles();
  const { user, simulatedRole } = useAuth();
  const { branding } = useBranding();

  const activeRole = simulatedRole || user?.role || 'SUPER_ADMIN';
  const filteredClusters = getFilteredMenuClusters(activeRole, toggles);

  return ( <> {/* Mobile Backdrop Overlay */}
      {isOpen && ( <div
          onClick={onClose}
          className="md:hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        /> )} <aside
        className={`w-[255px] bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 flex flex-col h-screen fixed md:sticky top-0 border-r border-slate-200/80 dark:border-slate-800 z-50 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      > {/* Brand Header */} <div className="px-4 pt-4 pb-3 flex items-center justify-between"> <div className="flex items-center gap-2.5 min-w-0"> {branding.logoType === 'IMAGE' && branding.logoUrl ? ( <img
                src={branding.logoUrl}
                alt={branding.systemName}
                className="w-[34px] h-[34px] rounded-lg object-contain bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs shrink-0"
              /> ) : ( <div
                className={`w-[34px] h-[34px] rounded-lg bg-gradient-to-tr ${branding.logoBgGradient || 'from-blue-600 via-indigo-600 to-purple-600'} flex items-center justify-center text-white font-semibold text-sm shadow-xs shrink-0 uppercase`}
              > {branding.logoText || 'GG'} </div> )} <div className="min-w-0 flex-1"> <h1 className="font-semibold text-slate-900 dark:text-slate-100 text-sm tracking-tight leading-tight truncate" title={branding.systemName}> {branding.systemName || 'GGBingo CRM'} </h1> <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider truncate" title={branding.tagline}> {branding.tagline || 'E-Commerce Platform'} </p> </div> </div> <button onClick={onClose} className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"> <X className="w-5 h-5" /> </button> </div> {/* Clustered & RBAC Filtered Navigation */} <nav className="flex-1 overflow-y-auto px-2.5 pb-2.5 pt-1 flex flex-col gap-3 sleek-scrollbar"> {filteredClusters.map((cluster) => ( <div key={cluster.groupKey} className="flex flex-col gap-0.5"> {/* Cluster Group Title Header */} <div className="px-2.5 py-1 flex items-center justify-between"> <span className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider"> {cluster.groupName} </span> <span className="text-[9px] font-mono font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded"> {cluster.items.length} </span> </div> {/* Group Items */} <div className="flex flex-col gap-0.5"> {cluster.items.map((item: MenuItemDefinition) => {
                  const Icon = ICON_MAP[item.iconName] || LayoutDashboard;
                  const isActive = pathname === item.href;

                  return ( <Link
                      key={item.href}
                      href={item.href}
                      prefetch={true}
                      onMouseEnter={() => router.prefetch(item.href)}
                      onClick={() => {
                        if (onClose) onClose();
                      }}
                      className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white font-medium shadow-xs'
                          : 'text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                    > <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                        }`}
                      /> <span className="flex-1 truncate">{item.name}</span> {isActive && ( <span className="w-1.5 h-1.5 rounded-full bg-white/90" /> )} </Link> );
                })} </div> </div> ))}

          {filteredClusters.length === 0 && ( <div className="p-4 text-center text-slate-500 text-xs font-medium"> <Lock className="w-5 h-5 mx-auto mb-2 text-slate-400" /> Không có phân hệ nào được phân quyền cho vai trò hiện tại. </div> )} </nav> {/* User Footer */} <div className="px-3.5 py-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5 bg-slate-50/70 dark:bg-slate-850"> <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-semibold flex items-center justify-center text-xs shrink-0 shadow-xs"> {user ? user.username.substring(0, 2).toUpperCase() : 'SA'} </div> <div className="flex-1 min-w-0"> <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{user ? user.name : 'Super Admin GGBingo'}</p> <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium truncate flex items-center gap-1"> <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {activeRole} · Trực tuyến </p> </div> </div> </aside> </> );
}
