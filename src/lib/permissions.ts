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
    groupName: 'Tổng Quan & Điều Hành',
    groupKey: 'overview_ops',
    items: [
      {
        name: 'Tổng Quan',
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
        name: 'Quản Lý Dự Án',
        href: '/projects',
        iconName: 'FolderKanban',
        moduleKey: 'hrm',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR', 'HR_MANAGER', 'SALES_MANAGER', 'TEAM_LEADER'],
      },
      {
        name: 'Quản Lý Văn Bản',
        href: '/documents',
        iconName: 'FileText',
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
        name: 'Quản Lý Phê Duyệt',
        href: '/proposals',
        iconName: 'FileCheck',
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
    ],
  },
  {
    groupName: 'Kinh Doanh & Khách Hàng',
    groupKey: 'sales_customers',
    items: [
      {
        name: 'Quản Lý Khách Hàng',
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
        name: 'Quản Lý Lead',
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
        name: 'CSKH',
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
        name: 'Hợp Đồng',
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
      {
        name: 'Gian Hàng TMĐT',
        href: '/stores',
        iconName: 'ShoppingBag',
        moduleKey: 'stores',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR', 'SALES_MANAGER', 'SALES_REP', 'SALE_EXEC', 'TEAM_LEADER'],
      },
      {
        name: 'Sản Phẩm',
        href: '/products',
        iconName: 'Package',
        moduleKey: 'products',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR', 'SALES_MANAGER', 'SALES_REP', 'SALE_EXEC', 'TEAM_LEADER'],
      },
    ],
  },
  {
    groupName: 'Tài Chính & Kế Toán',
    groupKey: 'finance_accounting',
    items: [
      {
        name: 'Báo Cáo Tài Chính',
        href: '/finance',
        iconName: 'PieChart',
        moduleKey: 'finance',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR', 'SALES_MANAGER', 'TEAM_LEADER', 'AUDITOR'],
      },
      {
        name: 'Hóa Đơn Điện Tử',
        href: '/invoices',
        iconName: 'FileSpreadsheet',
        moduleKey: 'finance',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR', 'HR_MANAGER', 'SALES_MANAGER', 'AUDITOR'],
      },
      {
        name: 'Tài Sản Cố Định',
        href: '/assets',
        iconName: 'Truck',
        moduleKey: 'finance',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR', 'HR_MANAGER', 'SALES_MANAGER', 'AUDITOR'],
      },
      {
        name: 'Mua Hàng & NCC',
        href: '/purchasing',
        iconName: 'ShoppingCart',
        moduleKey: 'finance',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR', 'HR_MANAGER', 'SALES_MANAGER', 'AUDITOR'],
      },
    ],
  },
  {
    groupName: 'Nhân Sự & Hiệu Suất',
    groupKey: 'hrm_performance',
    items: [
      {
        name: 'Quản Lý Nhân Sự',
        href: '/hrm',
        iconName: 'Briefcase',
        moduleKey: 'hrm',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR', 'HR_MANAGER', 'TEAM_LEADER'],
      },
      {
        name: 'Quản Lý Chấm Công',
        href: '/attendance',
        iconName: 'Clock',
        moduleKey: 'hrm',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR', 'HR_MANAGER', 'TEAM_LEADER', 'SALES_MANAGER'],
      },
      {
        name: 'Quản Lý Bảng Lương',
        href: '/payroll',
        iconName: 'PieChart',
        moduleKey: 'hrm',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR', 'HR_MANAGER', 'TEAM_LEADER', 'SALES_MANAGER'],
      },
      {
        name: 'Quản Lý Hiệu Suất',
        href: '/kpis',
        iconName: 'TrendingUp',
        moduleKey: 'kpis',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR', 'SALES_MANAGER', 'TEAM_LEADER', 'HR_MANAGER'],
      },
      {
        name: 'Đánh Giá 360°',
        href: '/reviews',
        iconName: 'UserCog',
        moduleKey: 'reviews',
        allowedRoles: [
          'SUPER_ADMIN',
          'DIRECTOR',
          'SALES_MANAGER',
          'SALES_REP',
          'SALE_EXEC',
          'TEAM_LEADER',
          'CSKH',
          'HR_MANAGER',
        ],
      },
    ],
  },
  {
    groupName: 'Cấu Hình & Quản Trị Hệ Thống',
    groupKey: 'admin_settings',
    items: [
      {
        name: 'Cấu Hình Nhân Sự',
        href: '/hrm-settings',
        iconName: 'Settings',
        moduleKey: 'hrm',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR', 'HR_MANAGER'],
      },
      {
        name: 'Cấu Hình Hệ Thống',
        href: '/settings/system',
        iconName: 'Sliders',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR'],
      },
      {
        name: 'Phân Quyền Truy Cập',
        href: '/settings/rbac',
        iconName: 'ShieldCheck',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR'],
      },
      {
        name: 'Quản Lý Tài Khoản',
        href: '/settings/users',
        iconName: 'UserCog',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR', 'HR_MANAGER'],
      },
      {
        name: 'Nhật Ký Hệ Thống',
        href: '/audit',
        iconName: 'ShieldAlert',
        moduleKey: 'audit',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR', 'AUDITOR'],
      },
    ],
  },
];

export function isRouteAllowedForRole(href: string, role: UserRole, toggles?: ModuleToggles): boolean {
  if (role === 'SUPER_ADMIN') return true;

  for (const group of MENU_CLUSTERS) {
    for (const item of group.items) {
      if (item.href === href || (href !== '/' && href.startsWith(item.href))) {
        // Check toggle if provided
        if (toggles && item.moduleKey && toggles[item.moduleKey] === false) {
          return false;
        }
        if (role === 'DIRECTOR') return true;
        return item.allowedRoles.includes(role);
      }
    }
  }
  return true;
}

export function getFilteredMenuClusters(role: UserRole, toggles: ModuleToggles): MenuGroupDefinition[] {
  return MENU_CLUSTERS.map((group) => {
    const visibleItems = group.items.filter((item) => {
      // 1. Check feature toggle
      if (item.moduleKey && toggles[item.moduleKey] === false) {
        return false;
      }
      // 2. Check role permission
      if (role !== 'SUPER_ADMIN' && role !== 'DIRECTOR') {
        if (!item.allowedRoles.includes(role)) {
          return false;
        }
      }
      return true;
    });

    return {
      ...group,
      items: visibleItems,
    };
  }).filter((group) => group.items.length > 0);
}
