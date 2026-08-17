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
    rank_level: 1,
    hrm_position_name: 'Giám Đốc Công Nghệ / Super Admin',
    permissions: [
      'leads:read', 'leads:create', 'leads:update', 'leads:delete', 'leads:assign',
      'customers:read', 'customers:edit', 'customers:export',
      'teams:manage', 'rbac:manage', 'audit:read', 'ai:use'
    ],
  },
  {
    role: 'DIRECTOR',
    role_name: 'Sales Director (Giám Đốc Kinh Doanh)',
    description: 'Xem/Sửa toàn bộ dữ liệu công ty, quản lý chỉ tiêu KPI, cấu hình ma trận RBAC.',
    data_scope: 'ALL_COMPANY',
    rank_level: 1,
    hrm_position_name: 'Giám Đốc Kinh Doanh',
    permissions: [
      'leads:read', 'leads:create', 'leads:update', 'leads:delete', 'leads:assign',
      'customers:read', 'customers:edit', 'customers:export',
      'teams:manage', 'rbac:manage', 'audit:read', 'ai:use'
    ],
  },
  {
    role: 'SALES_MANAGER',
    role_name: 'Trưởng Phòng Kinh Doanh',
    description: 'Quản lý doanh số toàn phòng kinh doanh, giao KPI & điều phối đội nhóm.',
    data_scope: 'DEPARTMENT',
    rank_level: 2,
    hrm_position_name: 'Trưởng Phòng Kinh Doanh',
    permissions: [
      'leads:read', 'leads:create', 'leads:update', 'leads:assign',
      'customers:read', 'customers:edit', 'customers:export',
      'teams:manage', 'ai:use'
    ],
  },
  {
    role: 'HR_MANAGER',
    role_name: 'Quản Lý HR (Trưởng Phòng Nhân Sự)',
    description: 'Quản lý hồ sơ nhân sự, quy trình tuyển dụng onboarding & đánh giá hiệu suất.',
    data_scope: 'ALL_COMPANY',
    rank_level: 2,
    hrm_position_name: 'Quản Lý HR',
    permissions: [
      'customers:read', 'teams:manage', 'ai:use'
    ],
  },
  {
    role: 'TEAM_LEADER',
    role_name: 'Team Lead (Trưởng Nhóm Sale)',
    description: 'Xem/Quản lý dữ liệu thuộc Đội mình phụ trách, gán Lead cho thành viên trong team.',
    data_scope: 'TEAM',
    rank_level: 2,
    hrm_position_name: 'Trưởng Nhóm Sale',
    permissions: [
      'leads:read', 'leads:create', 'leads:update', 'leads:assign',
      'customers:read', 'customers:edit', 'customers:export',
      'teams:manage', 'ai:use'
    ],
  },
  {
    role: 'SALE_EXEC',
    role_name: 'Sales Executive (NVKD / Chuyên Viên Sale)',
    description: 'Chỉ xem và tương tác với các Lead/Customer do chính mình được phân công.',
    data_scope: 'OWNER_ONLY',
    rank_level: 3,
    hrm_position_name: 'Chuyên Viên Sale',
    permissions: [
      'leads:read', 'leads:create', 'leads:update',
      'customers:read', 'customers:edit', 'ai:use'
    ],
  },
  {
    role: 'CSKH',
    role_name: 'Specialist CSKH',
    description: 'Chăm sóc và tương tác khách hàng được phân công trong phạm vi phòng ban.',
    data_scope: 'DEPARTMENT',
    rank_level: 3,
    hrm_position_name: 'Specialist CSKH',
    permissions: [
      'leads:read', 'leads:update',
      'customers:read', 'customers:edit', 'ai:use'
    ],
  },
  {
    role: 'AUDITOR',
    role_name: 'Chuyên Viên Kiểm Toán Hệ Thống',
    description: 'Tra cứu nhật ký thao tác audit logs và kiểm soát tuân thủ an toàn dữ liệu.',
    data_scope: 'ALL_COMPANY',
    rank_level: 3,
    hrm_position_name: 'Chuyên Viên Kiểm Toán',
    permissions: [
      'customers:read', 'audit:read'
    ],
  },
];

import { getJobTitles, INITIAL_EMPLOYEES } from './hrmStore';

let roleMatrix = [...INITIAL_ROLE_MATRIX];

export function getRoleMatrix(): RoleMatrixDefinition[] {
  try {
    const jobTitles = getJobTitles();
    const empPositions = INITIAL_EMPLOYEES.map((e) => e.position);
    const allPositions = Array.from(new Set([...jobTitles.map((j: { name: string }) => j.name), ...empPositions]));
    syncRolesFromHrmPositions(allPositions);
  } catch (e) {
    // Fallback if hrmStore is not fully initialized
  }
  return roleMatrix;
}

export function syncRolesFromHrmPositions(hrmPositions: string[]): RoleMatrixDefinition[] {
  hrmPositions.forEach((posName) => {
    if (!posName) return;
    const exists = roleMatrix.some(
      (rm) => rm.hrm_position_name?.toLowerCase() === posName.toLowerCase() || rm.role_name.toLowerCase().includes(posName.toLowerCase())
    );
    if (!exists) {
      const generatedRoleKey = `HRM_${posName.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`;
      let inferredRank = 3;
      if (posName.toLowerCase().includes('giám đốc') || posName.toLowerCase().includes('director')) inferredRank = 1;
      else if (posName.toLowerCase().includes('trưởng') || posName.toLowerCase().includes('quản lý') || posName.toLowerCase().includes('manager')) inferredRank = 2;
      else if (posName.toLowerCase().includes('thử việc') || posName.toLowerCase().includes('intern')) inferredRank = 4;

      roleMatrix.push({
        role: generatedRoleKey,
        role_name: `${posName} (Đồng Bộ HRM)`,
        description: `Chức danh đồng bộ trực tiếp từ hệ thống HRM`,
        data_scope: inferredRank === 1 ? 'ALL_COMPANY' : inferredRank === 2 ? 'TEAM' : 'OWNER_ONLY',
        rank_level: inferredRank,
        hrm_position_name: posName,
        is_custom: true,
        permissions: ['leads:read', 'customers:read', 'ai:use'],
      });
    }
  });

  return roleMatrix;
}

export function addCustomRoleMatrix(newRole: RoleMatrixDefinition): RoleMatrixDefinition[] {
  const exists = roleMatrix.some((rm) => rm.role === newRole.role);
  if (!exists) {
    roleMatrix.push(newRole);
  }
  return roleMatrix;
}

export function updateRolePermissionToggle(
  role: UserRole | string,
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

export function updateRoleDataScope(role: UserRole | string, data_scope: DataScopeBoundary): RoleMatrixDefinition[] {
  roleMatrix = roleMatrix.map((rm) => (rm.role === role ? { ...rm, data_scope } : rm));
  return roleMatrix;
}
