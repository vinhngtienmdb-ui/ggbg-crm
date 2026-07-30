import { UserRole } from '@/types';
import { ModuleToggles } from '@/context/ModuleToggleContext';

export interface MenuItemDefinition {
  name: string;
  href: string;
  iconName: string;
  moduleKey?: keyof ModuleToggles;
  allowedRoles: UserRole[];
  badge?: string;
}

export interface MenuGroupDefinition {
  groupName: string;
  groupKey: string;
  iconName?: string;
  items: MenuItemDefinition[];
}

export const MENU_CLUSTERS: MenuGroupDefinition[] = [
  {
    groupName: '📊 Tổng Quan & Báo Cáo',
    groupKey: 'overview_reports',
    items: [
      {
        name: 'Tổng Quan Executive',
        href: '/',
        iconName: 'LayoutDashboard',
        allowedRoles: [
          'SUPER_ADMIN',
          'DIRECTOR',
          'SALES_MANAGER',
          'SALES_REP',
          'SALE_EXEC',
          'TEAM_LEADER',
          'CSKH',
          'AUDITOR',
          'HR_MANAGER',
        ],
      },
      {
        name: 'Báo Cáo Tài Chính',
        href: '/finance',
        iconName: 'PieChart',
        moduleKey: 'finance',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR', 'SALES_MANAGER', 'TEAM_LEADER', 'AUDITOR'],
      },
      {
        name: 'Nhật Ký Thao Tác Audit Log',
        href: '/audit',
        iconName: 'ShieldCheck',
        moduleKey: 'audit',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR', 'AUDITOR'],
      },
    ],
  },
  {
    groupName: '💼 Kinh Doanh & Khách Hàng',
    groupKey: 'sales_customers',
    items: [
      {
        name: 'Quản Lý Khách Hàng (CRM)',
        href: '/customers',
        iconName: 'Users',
        moduleKey: 'customers',
        allowedRoles: [
          'SUPER_ADMIN',
          'DIRECTOR',
          'SALES_MANAGER',
          'SALES_REP',
          'SALE_EXEC',
          'TEAM_LEADER',
          'CSKH',
          'AUDITOR',
          'HR_MANAGER',
        ],
      },
      {
        name: 'Quản Lý Lead (Bán Hàng)',
        href: '/leads',
        iconName: 'UserCheck',
        moduleKey: 'leads',
        allowedRoles: [
          'SUPER_ADMIN',
          'DIRECTOR',
          'SALES_MANAGER',
          'SALES_REP',
          'SALE_EXEC',
          'TEAM_LEADER',
          'CSKH',
        ],
      },
      {
        name: 'Tổng Đài & CSKH Multi-Channel',
        href: '/chat',
        iconName: 'MessageSquare',
        moduleKey: 'chat',
        allowedRoles: [
          'SUPER_ADMIN',
          'DIRECTOR',
          'SALES_MANAGER',
          'SALES_REP',
          'SALE_EXEC',
          'TEAM_LEADER',
          'CSKH',
        ],
      },
      {
        name: 'Gian Hàng Đa Sàn TMĐT',
        href: '/stores',
        iconName: 'ShoppingBag',
        moduleKey: 'stores',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR', 'SALES_MANAGER', 'SALES_REP', 'SALE_EXEC', 'TEAM_LEADER'],
      },
      {
        name: 'Danh Mục Sản Phẩm',
        href: '/products',
        iconName: 'Package',
        moduleKey: 'products',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR', 'SALES_MANAGER', 'SALES_REP', 'SALE_EXEC', 'TEAM_LEADER'],
      },
      {
        name: 'Quản Lý Hợp Đồng PDF',
        href: '/contracts',
        iconName: 'FileText',
        moduleKey: 'contracts',
        allowedRoles: [
          'SUPER_ADMIN',
          'DIRECTOR',
          'SALES_MANAGER',
          'SALES_REP',
          'SALE_EXEC',
          'TEAM_LEADER',
          'CSKH',
          'AUDITOR',
          'HR_MANAGER',
        ],
      },
    ],
  },
  {
    groupName: '👥 Quản Trị Nhân Sự (HRM)',
    groupKey: 'hrm_management',
    items: [
      {
        name: 'Hồ Sơ Nhân Sự',
        href: '/hrm',
        iconName: 'Briefcase',
        moduleKey: 'hrm',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR', 'HR_MANAGER', 'TEAM_LEADER'],
      },
      {
        name: 'Tuyển Dụng & Onboarding',
        href: '/recruitment',
        iconName: 'UserPlus',
        moduleKey: 'hrm',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR', 'HR_MANAGER', 'TEAM_LEADER'],
      },
      {
        name: 'Bản Đồ Phân Bổ Nhân Sự GPS',
        href: '/hr-map',
        iconName: 'MapPin',
        moduleKey: 'hrm',
        allowedRoles: [
          'SUPER_ADMIN',
          'DIRECTOR',
          'SALES_MANAGER',
          'SALES_REP',
          'SALE_EXEC',
          'TEAM_LEADER',
          'CSKH',
          'AUDITOR',
          'HR_MANAGER',
        ],
      },
      {
        name: 'Cấu Hình Nhân Sự',
        href: '/hrm-settings',
        iconName: 'Settings',
        moduleKey: 'hrm',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR', 'HR_MANAGER'],
      },
    ],
  },
  {
    groupName: '📈 Hiệu Suất, Chấm Công & Lương',
    groupKey: 'performance_payroll',
    items: [
      {
        name: 'Quản Lý KPIs Doanh Số',
        href: '/kpis',
        iconName: 'TrendingUp',
        moduleKey: 'kpis',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR', 'SALES_MANAGER', 'TEAM_LEADER', 'HR_MANAGER'],
      },
      {
        name: 'Chấm Điểm Hiệu Suất (P3)',
        href: '/performance',
        iconName: 'Award',
        moduleKey: 'performance',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR', 'SALES_MANAGER', 'TEAM_LEADER', 'HR_MANAGER'],
      },
      {
        name: 'Quản Lý Chấm Công',
        href: '/attendance',
        iconName: 'Clock',
        moduleKey: 'hrm',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR', 'HR_MANAGER', 'TEAM_LEADER', 'SALES_MANAGER'],
      },
      {
        name: 'Quản Lý Bảng Lương (3P)',
        href: '/payroll',
        iconName: 'Wallet',
        moduleKey: 'hrm',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR', 'HR_MANAGER', 'SALES_MANAGER'],
      },
      {
        name: 'Đánh Giá Nhân Sự',
        href: '/reviews',
        iconName: 'CheckCircle2',
        moduleKey: 'performance',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR', 'HR_MANAGER', 'TEAM_LEADER'],
      },
    ],
  },
];

export function hasPermissionForMenu(
  item: MenuItemDefinition,
  role: UserRole | undefined,
  toggles?: ModuleToggles
): boolean {
  if (!role) return false;
  if (item.moduleKey && toggles && toggles[item.moduleKey] === false) {
    return false;
  }
  return item.allowedRoles.includes(role);
}

export function getFilteredMenuClusters(
  role: UserRole | undefined,
  toggles?: ModuleToggles
): MenuGroupDefinition[] {
  if (!role) return [];
  return MENU_CLUSTERS.map((group) => ({
    ...group,
    items: group.items.filter((item) => hasPermissionForMenu(item, role, toggles)),
  })).filter((group) => group.items.length > 0);
}

export function isRouteAllowedForRole(
  pathname: string,
  role: UserRole | undefined,
  toggles?: ModuleToggles
): boolean {
  if (!role) return false;
  if (pathname === '/' || pathname === '/login') return true;

  for (const group of MENU_CLUSTERS) {
    for (const item of group.items) {
      if (item.href === pathname || (item.href !== '/' && pathname.startsWith(item.href))) {
        return hasPermissionForMenu(item, role, toggles);
      }
    }
  }
  return true;
}
