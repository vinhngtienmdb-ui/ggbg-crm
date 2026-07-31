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
    groupName: 'Tổng Quan & Tài Chính',
    groupKey: 'overview_finance',
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
        name: 'Báo Cáo Tài Chính',
        href: '/finance',
        iconName: 'PieChart',
        moduleKey: 'finance',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR', 'SALES_MANAGER', 'TEAM_LEADER', 'AUDITOR'],
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
      {
        name: 'Hóa Đơn Điện Tử',
        href: '/invoices',
        iconName: 'FileSpreadsheet',
        moduleKey: 'finance',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR', 'HR_MANAGER', 'SALES_MANAGER', 'AUDITOR'],
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
    ],
  },
  {
    groupName: 'Bàn Làm Việc',
    groupKey: 'operations_projects',
    items: [
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
        name: 'Tờ Trình & Đề Xuất',
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
        name: 'Tuyển Dụng & Onboarding',
        href: '/recruitment',
        iconName: 'UserPlus',
        moduleKey: 'hrm',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR', 'HR_MANAGER', 'TEAM_LEADER'],
      },
      {
        name: 'Cấu Hình Nhân Sự',
        href: '/hrm-settings',
        iconName: 'Settings',
        moduleKey: 'hrm',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR', 'HR_MANAGER'],
      },
      {
        name: 'Quản Lý Hiệu Suất',
        href: '/kpis',
        iconName: 'TrendingUp',
        moduleKey: 'kpis',
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
        name: 'Quản Lý Bảng Lương',
        href: '/payroll',
        iconName: 'PieChart',
        moduleKey: 'hrm',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR', 'HR_MANAGER', 'TEAM_LEADER', 'SALES_MANAGER'],
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
    groupName: 'Quản Trị & Cấu Hình',
    groupKey: 'admin_settings',
    items: [
      {
        name: 'Nhật Ký Hệ Thống',
        href: '/audit',
        iconName: 'ShieldAlert',
        moduleKey: 'audit',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR', 'AUDITOR'],
      },
      {
        name: 'Quản Lý Tài Khoản',
        href: '/settings/users',
        iconName: 'UserCog',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR', 'HR_MANAGER'],
      },
      {
        name: 'Phân Quyền Truy Cập',
        href: '/settings/rbac',
        iconName: 'ShieldCheck',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR'],
      },
      {
        name: 'Cấu Hình Hệ Thống',
        href: '/settings/system',
        iconName: 'Settings',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR'],
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
