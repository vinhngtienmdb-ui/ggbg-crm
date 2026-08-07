import { UserAccount, UserRole } from '@/types';

export interface RolePermissionItem {
  role: UserRole;
  module: string;
  action: string;
  data_scope: 'own' | 'team' | 'department' | 'all';
  enabled: boolean;
}

export interface AuditLogItem {
  id: string;
  user_name: string;
  action: string;
  target: string;
  ip: string;
  timestamp: string;
}

export interface UserAccountWithAuth extends UserAccount {
  /** Mật khẩu đã băm PBKDF2 (không lưu plaintext). */
  password_hash?: string;
  permissions?: string[];
}

export const INITIAL_USER_ACCOUNTS: UserAccountWithAuth[] = [
  {
    id: 'u0',
    profile_id: 'b0',
    employee_code: 'NV-00000',
    employee_name: 'Super Admin GGBingo',
    username: 'admin',
    email: 'admin@ggbingo.vn',
    password_hash: 'pbkdf2$sha256$120000$c206e4dc4cd029ee97221615d0122e10$47b73358bc48badc157c0572e780b0b830066b75b4e4331efcbd123e79f1057f',
    role: 'SUPER_ADMIN',
    role_name: 'Super Admin (Toàn Quyền)',
    account_status: 'Active',
    is_super_admin: true,
    last_login_at: '2026-07-22 09:20',
    created_at: '2026-07-01',
    permissions: ['*'],
  },
  {
    id: 'u1',
    profile_id: 'e1',
    employee_code: 'NV-00101',
    employee_name: 'Trần Văn Hoàng',
    username: 'hoang.tv',
    email: 'hoang.tv@ggbingo.vn',
    password_hash: 'pbkdf2$sha256$120000$a34e51787fca6cee4e1a38a74e4dba89$9fdd08eee7697aebdb36895f74e5a90d79dcd83d1a31ec1b4879e027b2108d37',
    role: 'TEAM_LEADER',
    role_name: 'Trưởng Nhóm Sale',
    account_status: 'Active',
    is_super_admin: false,
    last_login_at: '2026-07-22 08:30',
    created_at: '2026-07-05',
    permissions: ['customers.view', 'customers.edit', 'leads.view', 'leads.edit', 'leads.assign'],
  },
  {
    id: 'u2',
    profile_id: 'e2',
    employee_code: 'NV-00102',
    employee_name: 'Lê Thị Mai',
    username: 'mai.lt',
    email: 'mai.lt@ggbingo.vn',
    password_hash: 'pbkdf2$sha256$120000$8fd5e5fc8400fc63ed50d719c0656343$2671da0cc6c29ba185e1c1ec7a4db35f095350764e534cf8ef2464d4c6c7f61e',
    role: 'SALE_EXEC',
    role_name: 'Nhân Viên Sale Exec',
    account_status: 'Active',
    is_super_admin: false,
    last_login_at: '2026-07-21 17:45',
    created_at: '2026-07-10',
    permissions: ['customers.view_own', 'leads.view_own', 'leads.edit_own'],
  },
  {
    id: 'u3',
    profile_id: 'e3',
    employee_code: 'NV-00103',
    employee_name: 'Đặng Kim Anh',
    username: 'anh.dk',
    email: 'anh.dk@ggbingo.vn',
    password_hash: 'pbkdf2$sha256$120000$61a8b40e8bad30881b3292ab1d002acb$3845a637f4e7b35ab3fc968b57673d5c53b8f15535514eeec2316b5aad7743bd',
    role: 'HR_MANAGER',
    role_name: 'Quản Lý HR',
    account_status: 'Locked',
    is_super_admin: false,
    last_login_at: '2026-07-15 11:20',
    created_at: '2026-07-12',
    permissions: ['hrm.view', 'hrm.edit', 'hrm.contracts'],
  },
];

let userAccounts = [...INITIAL_USER_ACCOUNTS];

let rolePermissionsMatrix: RolePermissionItem[] = [
  { role: 'SUPER_ADMIN', module: 'System', action: 'All Privileges', data_scope: 'all', enabled: true },
  { role: 'SUPER_ADMIN', module: 'Customers', action: 'View / Edit / Delete', data_scope: 'all', enabled: true },
  { role: 'SUPER_ADMIN', module: 'Leads', action: 'View / Assign / Convert', data_scope: 'all', enabled: true },
  { role: 'SUPER_ADMIN', module: 'HRM', action: 'Manage Profiles & Contracts', data_scope: 'all', enabled: true },

  { role: 'DIRECTOR', module: 'System', action: 'View Reports & Strategy', data_scope: 'all', enabled: true },
  { role: 'DIRECTOR', module: 'Customers', action: 'View All Customers', data_scope: 'all', enabled: true },
  { role: 'DIRECTOR', module: 'Leads', action: 'View All Leads', data_scope: 'all', enabled: true },
  { role: 'DIRECTOR', module: 'HRM', action: 'View Executive Dashboard', data_scope: 'all', enabled: true },

  { role: 'SALES_MANAGER', module: 'Customers', action: 'View / Edit Department Data', data_scope: 'department', enabled: true },
  { role: 'SALES_MANAGER', module: 'Leads', action: 'Distribute & Reassign Leads', data_scope: 'department', enabled: true },
  { role: 'SALES_MANAGER', module: 'KPIs', action: 'Approve & Assign Target', data_scope: 'department', enabled: true },

  { role: 'TEAM_LEADER', module: 'Customers', action: 'View Team Customers', data_scope: 'team', enabled: true },
  { role: 'TEAM_LEADER', module: 'Leads', action: 'Assign Lead in Team', data_scope: 'team', enabled: true },

  { role: 'SALE_EXEC', module: 'Customers', action: 'View Own Customers', data_scope: 'own', enabled: true },
  { role: 'SALE_EXEC', module: 'Leads', action: 'Update Own Lead Stage', data_scope: 'own', enabled: true },

  { role: 'HR_MANAGER', module: 'HRM', action: 'Full Employee Profiles & Cloud R2 PDFs', data_scope: 'all', enabled: true },
  { role: 'HR_MANAGER', module: 'Settings', action: 'Create User Accounts from HRM', data_scope: 'all', enabled: true },
];

let auditLogs: AuditLogItem[] = [
  {
    id: 'l1',
    user_name: 'Trần Văn Hoàng (Sale Leader)',
    action: 'Click Xem Full SĐT Khách Hàng',
    target: 'KH-00102 (Công Ty Thời Trang An An)',
    ip: '113.190.24.12',
    timestamp: '2026-07-22 09:10:15',
  },
  {
    id: 'l2',
    user_name: 'Lê Thị Mai',
    action: 'Xuất File Excel Danh Sách Lead',
    target: 'Phễu Dịch Vụ Shopee/TikTok (35 Leads)',
    ip: '118.70.188.45',
    timestamp: '2026-07-22 08:45:00',
  },
];

export function getUserAccounts() {
  return userAccounts;
}

export function findUserByUsernameOrEmail(input: string) {
  const clean = input.trim().toLowerCase();
  return userAccounts.find(u => u.username.toLowerCase() === clean || u.email.toLowerCase() === clean);
}

export function toggleUserAccountStatus(id: string) {
  userAccounts = userAccounts.map(u => {
    if (u.id === id && !u.is_super_admin) {
      const isCurrentlyActive = u.account_status === 'Active' || (u.account_status as string) === 'ACTIVE';
      const nextStatus = isCurrentlyActive ? 'Locked' : 'Active';
      return { ...u, account_status: nextStatus };
    }
    return u;
  });
  const updatedUser = userAccounts.find(u => u.id === id);
  if (updatedUser) {
    addAuditLog({
      user_name: 'Super Admin GGBingo',
      action: updatedUser.account_status === 'Locked' ? 'Khóa Tài Khoản System' : 'Mở Khóa Tài Khoản System',
      target: `User ${updatedUser.username} (${updatedUser.employee_name})`,
      ip: '127.0.0.1',
    });
  }
  return userAccounts;
}

export function createUserAccount(newUser: Omit<UserAccount, 'id' | 'created_at'> & { password_hash?: string }) {
  const cleanUsername = newUser.username.trim().toLowerCase();
  const cleanEmail = (newUser.email || '').trim().toLowerCase();

  const existing = userAccounts.find(
    u => u.username.toLowerCase() === cleanUsername || (cleanEmail !== '' && u.email.toLowerCase() === cleanEmail)
  );

  if (existing) {
    throw new Error('Tên đăng nhập hoặc Email đã tồn tại');
  }

  const created: UserAccountWithAuth = {
    ...newUser,
    username: cleanUsername,
    email: newUser.email ? newUser.email.trim() : `${cleanUsername}@ggbingo.vn`,
    id: `u_${Date.now()}`,
    created_at: new Date().toISOString().split('T')[0],
    account_status: newUser.account_status || 'Active',
    password_hash: newUser.password_hash,
    permissions: ['customers.view', 'leads.view'],
  };
  userAccounts = [created, ...userAccounts];
  addAuditLog({
    user_name: 'Super Admin GGBingo',
    action: 'Cấp Tài Khoản Mới Từ HRM',
    target: `User ${created.username} (${created.employee_name})`,
    ip: '127.0.0.1',
  });
  return created;
}

export function updateUserAccount(id: string, updates: Partial<UserAccountWithAuth>) {
  userAccounts = userAccounts.map(u => {
    if (u.id === id) {
      return { ...u, ...updates };
    }
    return u;
  });
  const updated = userAccounts.find(u => u.id === id);
  if (updated) {
    addAuditLog({
      user_name: 'Super Admin GGBingo',
      action: 'Cập Nhật Thông Tin Tài Khoản',
      target: `User ${updated.username} (${updated.employee_name})`,
      ip: '127.0.0.1',
    });
  }
  return userAccounts;
}

export function deleteUserAccount(id: string) {
  const target = userAccounts.find(u => u.id === id);
  if (target?.is_super_admin || target?.username === 'admin') {
    throw new Error('Không thể xóa tài khoản Super Admin chính hệ thống!');
  }
  userAccounts = userAccounts.filter(u => u.id !== id);
  if (target) {
    addAuditLog({
      user_name: 'Super Admin GGBingo',
      action: 'Xóa Tài Khoản System',
      target: `User ${target.username} (${target.employee_name})`,
      ip: '127.0.0.1',
    });
  }
  return userAccounts;
}

export function resetUserPassword(id: string, password_hash: string) {
  userAccounts = userAccounts.map(u => {
    if (u.id === id) {
      return { ...u, password_hash, must_change_password: true };
    }
    return u;
  });
  const updated = userAccounts.find(u => u.id === id);
  if (updated) {
    addAuditLog({
      user_name: 'Super Admin GGBingo',
      action: 'Admin Reset Mật Khẩu User',
      target: `User ${updated.username} (${updated.employee_name})`,
      ip: '127.0.0.1',
    });
  }
  return userAccounts;
}

export function setUserPasswordByUsername(username: string, password_hash: string) {
  const clean = username.trim().toLowerCase();
  userAccounts = userAccounts.map(u => {
    if (u.username.toLowerCase() === clean) {
      return { ...u, password_hash, must_change_password: false };
    }
    return u;
  });
  const updated = userAccounts.find(u => u.username.toLowerCase() === clean);
  if (updated) {
    addAuditLog({
      user_name: updated.employee_name,
      action: 'Tự Đổi Mật Khẩu Cá Nhân Thành Công',
      target: `User ${updated.username}`,
      ip: '127.0.0.1',
    });
  }
  return updated;
}

export function setUser2FAStatus(username: string, is_2fa_enabled: boolean, totp_secret?: string) {
  const clean = username.trim().toLowerCase();
  userAccounts = userAccounts.map(u => {
    if (u.username.toLowerCase() === clean) {
      return {
        ...u,
        is_2fa_enabled,
        totp_secret: is_2fa_enabled ? (totp_secret || u.totp_secret) : undefined,
      };
    }
    return u;
  });
  const updated = userAccounts.find(u => u.username.toLowerCase() === clean);
  if (updated) {
    addAuditLog({
      user_name: updated.employee_name,
      action: is_2fa_enabled ? 'Kích Hoạt Google Authenticator (2FA)' : 'Tắt Xác Thực Google Authenticator (2FA)',
      target: `User ${updated.username}`,
      ip: '127.0.0.1',
    });
  }
  return updated;
}

export function getRolePermissionsMatrix() {
  return rolePermissionsMatrix;
}

export function updateRolePermission(role: UserRole, module: string, action: string, updates: Partial<RolePermissionItem>) {
  if (role === 'SUPER_ADMIN' || (role as string) === 'r0') {
    return rolePermissionsMatrix;
  }
  rolePermissionsMatrix = rolePermissionsMatrix.map(item => {
    if (item.role === role && item.module === module && item.action === action) {
      return { ...item, ...updates };
    }
    return item;
  });
  addAuditLog({
    user_name: 'Super Admin GGBingo',
    action: 'Cập Nhật Ma Trận Phân Quyền RBAC',
    target: `Role ${role} - ${module}:${action}`,
    ip: '127.0.0.1',
  });
  return rolePermissionsMatrix;
}

export function getAuditLogs() {
  return auditLogs;
}

export function addAuditLog(log: Omit<AuditLogItem, 'id' | 'timestamp'>) {
  const newLog: AuditLogItem = {
    ...log,
    id: `l_${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };
  auditLogs = [newLog, ...auditLogs];
  return newLog;
}
