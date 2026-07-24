import { GranularPermission, DataScopeBoundary, RoleMatrixDefinition, UserRole } from '@/types';

export const CORE_12_PERMISSIONS: { key: GranularPermission; name: string; category: string; description: string }[] = [
  { key: 'leads:read', name: 'Xem Danh Sách Leads', category: 'Phân Hệ Lead', description: 'Cho phép xem và tìm kiếm thông tin Lead trong hệ thống' },
  { key: 'leads:create', name: 'Tạo Lead Mới', category: 'Phân Hệ Lead', description: 'Khởi tạo Lead thủ công hoặc import hàng loạt' },
  { key: 'leads:update', name: 'Cập Nhật Lead', category: 'Phân Hệ Lead', description: 'Đổi giai đoạn phễu 7 bước và thông tin Lead' },
  { key: 'leads:delete', name: 'Xóa Lead', category: 'Phân Hệ Lead', description: 'Xóa bớt Lead khỏi danh sách quản lý' },
  { key: 'leads:assign', name: 'Phân Bổ Lead (Assign)', category: 'Phân Hệ Lead', description: 'Gán Lead cho nhân sự Sales Exec trong đội' },

  { key: 'customers:read', name: 'Xem Khách Hàng 360°', category: 'Phân Hệ Khách Hàng', description: 'Xem hồ sơ 360° Doanh nghiệp & Cá nhân' },
  { key: 'customers:edit', name: 'Sửa Hồ Sơ Khách Hàng', category: 'Phân Hệ Khách Hàng', description: 'Chỉnh sửa thông tin định danh MST, CCCD, KYC' },
  { key: 'customers:export', name: 'Xuất Dữ Liệu Excel', category: 'Phân Hệ Khách Hàng', description: 'Xuất danh sách khách hàng ra tệp Excel' },

  { key: 'teams:manage', name: 'Quản Lý Đội Nhóm & KPIs', category: 'Quản Trị Doanh Nghiệp', description: 'Giao chỉ tiêu KPI và quản lý cơ cấu đội nhóm' },
  { key: 'rbac:manage', name: 'Quản Lý Ma Trận RBAC', category: 'Hệ Thống & Bảo Mật', description: 'Cấu hình quyền hạn và Data Scope Boundaries' },
  { key: 'audit:read', name: 'Xem Nhật Ký Hệ Thống', category: 'Hệ Thống & Bảo Mật', description: 'Tra cứu Audit Logs toàn bộ thao tác trong CRM' },
  { key: 'ai:use', name: 'Sử Dụng AI Assist Engine', category: 'Trợ Lý AI', description: 'Khai thác AI Chấm điểm LeadScore & gợi ý kịch bản' },
];

export const INITIAL_ROLE_MATRIX: RoleMatrixDefinition[] = [
  {
    role: 'SUPER_ADMIN',
    role_name: 'Super Admin (Quản Trị Tối Cao)',
    description: 'Toàn quyền truy cập mọi phân hệ và cấu hình hệ thống toàn công ty.',
    data_scope: 'ALL_COMPANY',
    permissions: [
      'leads:read', 'leads:create', 'leads:update', 'leads:delete', 'leads:assign',
      'customers:read', 'customers:edit', 'customers:export',
      'teams:manage', 'rbac:manage', 'audit:read', 'ai:use'
    ],
  },
  {
    role: 'DIRECTOR',
    role_name: 'Sales Director (Giám Đốc Bán Hàng)',
    description: 'Xem/Sửa toàn bộ dữ liệu công ty, quản lý chỉ tiêu KPI, cấu hình ma trận RBAC.',
    data_scope: 'ALL_COMPANY',
    permissions: [
      'leads:read', 'leads:create', 'leads:update', 'leads:delete', 'leads:assign',
      'customers:read', 'customers:edit', 'customers:export',
      'teams:manage', 'rbac:manage', 'audit:read', 'ai:use'
    ],
  },
  {
    role: 'TEAM_LEADER',
    role_name: 'Team Lead (Trưởng Phòng / Trưởng Nhóm)',
    description: 'Xem/Quản lý dữ liệu thuộc Đội mình phụ trách, gán Lead cho thành viên trong team.',
    data_scope: 'TEAM',
    permissions: [
      'leads:read', 'leads:create', 'leads:update', 'leads:assign',
      'customers:read', 'customers:edit', 'customers:export',
      'teams:manage', 'ai:use'
    ],
  },
  {
    role: 'SALE_EXEC',
    role_name: 'Sales Executive (NVKD)',
    description: 'Chỉ xem và tương tác với các Lead/Customer do chính mình được phân công (assigned_to = auth.uid()).',
    data_scope: 'OWNER_ONLY',
    permissions: [
      'leads:read', 'leads:create', 'leads:update',
      'customers:read', 'customers:edit', 'ai:use'
    ],
  },
  {
    role: 'CSKH',
    role_name: 'Chuyên Viên CSKH',
    description: 'Chăm sóc và tương tác khách hàng được phân công trong phạm vi phòng ban.',
    data_scope: 'DEPARTMENT',
    permissions: [
      'leads:read', 'leads:update',
      'customers:read', 'customers:edit', 'ai:use'
    ],
  },
];

let roleMatrix = [...INITIAL_ROLE_MATRIX];

export function getRoleMatrix(): RoleMatrixDefinition[] {
  return roleMatrix;
}

export function updateRolePermissionToggle(
  role: UserRole,
  permission: GranularPermission,
  enabled: boolean
): RoleMatrixDefinition[] {
  roleMatrix = roleMatrix.map((rm) => {
    if (rm.role === role) {
      const hasPerm = rm.permissions.includes(permission);
      let updatedPerms = [...rm.permissions];
      if (enabled && !hasPerm) {
        updatedPerms.push(permission);
      } else if (!enabled && hasPerm) {
        updatedPerms = updatedPerms.filter((p) => p !== permission);
      }
      return { ...rm, permissions: updatedPerms };
    }
    return rm;
  });

  return roleMatrix;
}

export function updateRoleDataScope(role: UserRole, data_scope: DataScopeBoundary): RoleMatrixDefinition[] {
  roleMatrix = roleMatrix.map((rm) => (rm.role === role ? { ...rm, data_scope } : rm));
  return roleMatrix;
}
