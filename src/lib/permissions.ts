import { UserRole } from '@/types';
import { ModuleToggles } from '@/context/ModuleToggleContext';

export interface SubMenuItemDefinition {
  name: string;
  href: string;
  tabKey: string;
  allowedRoles?: UserRole[];
}

export interface MenuItemDefinition {
  name: string;
  href: string;
  iconName: string;
  moduleKey?: keyof ModuleToggles;
  allowedRoles: UserRole[];
  badge?: string;
  subItems?: SubMenuItemDefinition[];
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
    ],
  },
  {
    groupName: 'Hành Chính & Văn Phòng',
    groupKey: 'office_admin',
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
        subItems: [
          { name: 'Công Văn Đến', href: '/documents?tab=inbound', tabKey: 'inbound' },
          { name: 'Công Văn Đi', href: '/documents?tab=outbound', tabKey: 'outbound' },
          { name: 'Văn Bản Nội Bộ', href: '/documents?tab=internal_sop', tabKey: 'internal_sop' },
          { name: 'Bút Phê Chỉ Đạo', href: '/documents?tab=directive_log', tabKey: 'directive_log' },
          { name: 'Cấu Hình Sổ', href: '/documents?tab=doc_config', tabKey: 'doc_config' },
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
        subItems: [
          { name: 'Chờ Duyệt', href: '/proposals?tab=pending', tabKey: 'pending' },
          { name: 'Đề Xuất Của Tôi', href: '/proposals?tab=my_submissions', tabKey: 'my_submissions' },
          { name: 'Đã Duyệt', href: '/proposals?tab=all_approved', tabKey: 'all_approved' },
          { name: 'Tạo Đề Xuất', href: '/proposals?tab=create', tabKey: 'create' },
          { name: 'Mẫu Biểu', href: '/proposals?tab=templates', tabKey: 'templates' },
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
        subItems: [
          { name: 'Dòng Tiền', href: '/finance?tab=revenue', tabKey: 'revenue' },
          { name: 'Chi Phí', href: '/finance?tab=expenses', tabKey: 'expenses' },
          { name: 'Lãi Lỗ (P&L)', href: '/finance?tab=profit_loss', tabKey: 'profit_loss' },
          { name: 'Công Nợ', href: '/finance?tab=debt', tabKey: 'debt' },
          { name: 'Bảng Cân Đối', href: '/finance?tab=vas', tabKey: 'vas' },
        ],
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
        subItems: [
          { name: 'Hồ Sơ Nhân Sự', href: '/hrm?tab=directory', tabKey: 'directory' },
          { name: 'Tuyển Dụng', href: '/hrm?tab=recruitment', tabKey: 'recruitment' },
          { name: 'Phân Ca', href: '/hrm?tab=shifts', tabKey: 'shifts' },
          { name: 'Bảo Hiểm Xã Hội', href: '/hrm?tab=bhxh', tabKey: 'bhxh' },
          { name: 'Hợp Đồng & Biểu Mẫu', href: '/hrm?tab=documents', tabKey: 'documents' },
          { name: 'Sơ Đồ Tổ Chức', href: '/hrm?tab=org_chart', tabKey: 'org_chart' },
          { name: 'Sổ Lao Động', href: '/hrm?tab=labor_book', tabKey: 'labor_book' },
          { name: 'Bản Đồ Nhân Sự', href: '/hrm?tab=map', tabKey: 'map' },
        ],
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
        subItems: [
          { name: 'Bảng Lương', href: '/payroll?tab=payroll', tabKey: 'payroll' },
          { name: 'Phiếu Lương', href: '/payroll?tab=paystubs', tabKey: 'paystubs' },
          { name: 'Lệnh Chi', href: '/payroll?tab=banking', tabKey: 'banking' },
        ],
      },
      {
        name: 'Quản Lý Hiệu Suất',
        href: '/kpis',
        iconName: 'TrendingUp',
        moduleKey: 'kpis',
        allowedRoles: ['SUPER_ADMIN', 'DIRECTOR', 'SALES_MANAGER', 'TEAM_LEADER', 'HR_MANAGER'],
        subItems: [
          { name: 'Chỉ Tiêu KPI', href: '/kpis?tab=list', tabKey: 'list' },
          { name: 'KPI Cá Nhân', href: '/kpis?tab=individual', tabKey: 'individual' },
          { name: 'KPI Phòng Ban', href: '/kpis?tab=department', tabKey: 'department' },
          { name: 'OKR Công Ty', href: '/kpis?tab=company', tabKey: 'company' },
          { name: 'Đánh Giá 3P', href: '/kpis?tab=evaluation', tabKey: 'evaluation' },
          { name: 'Đồng Bộ Lương', href: '/kpis?tab=sync', tabKey: 'sync' },
        ],
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
        subItems: [
          { name: 'Pháp Lý & Con Dấu', href: '/settings/system?tab=identity', tabKey: 'identity' },
          { name: 'Quản Lý Phân Hệ', href: '/settings/system?tab=modules', tabKey: 'modules' },
          { name: 'Hạ Tầng & Cloud', href: '/settings/system?tab=backup', tabKey: 'backup' },
          { name: 'API & Tích Hợp', href: '/settings/system?tab=integrations', tabKey: 'integrations' },
          { name: 'Email & Tổng Đài', href: '/settings/system?tab=email_smtp', tabKey: 'email_smtp' },
          { name: 'Webhook & Bot', href: '/settings/system?tab=webhooks', tabKey: 'webhooks' },
          { name: 'Bảo Mật & Nhật Ký', href: '/settings/system?tab=security', tabKey: 'security' },
        ],
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

export function canAccessSettings(role: UserRole): boolean {
  const adminRoles: UserRole[] = ['SUPER_ADMIN', 'DIRECTOR', 'HR_MANAGER'];
  return adminRoles.includes(role);
}

export function isRouteAllowedForRole(href: string, role: UserRole, toggles?: ModuleToggles): boolean {
  if (role === 'SUPER_ADMIN') return true;

  // Siết chặt kiểm tra các trang Cấu Hình & Cài Đặt hệ thống
  if (href.startsWith('/settings') || href === '/hrm-settings') {
    if (href === '/settings/system' || href === '/settings/rbac') {
      return role === 'DIRECTOR';
    }
    return canAccessSettings(role);
  }

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
