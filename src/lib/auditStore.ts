import { AuditLogEntry } from '@/types/audit';

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'audit_1',
    timestamp: '2026-08-18 16:40:22',
    actor_name: 'Nguyễn Hoàng Long',
    actor_username: 'long.nh',
    actor_role: 'Tổng Giám Đốc (CEO)',
    action_type: 'LOGIN_2FA',
    action_description: 'Đăng nhập thành công với xác thực 2 lớp TOTP',
    resource_module: 'AUTH_SECURITY',
    ip_address: '118.69.182.54',
    device_info: 'Chrome 128 / macOS Sequoia',
    severity: 'INFO',
  },
  {
    id: 'audit_2',
    timestamp: '2026-08-18 15:30:10',
    actor_name: 'Phạm Minh Đức',
    actor_username: 'duc.pm',
    actor_role: 'Giám Đốc Khối Sales',
    action_type: 'APPROVE_CONTRACT',
    action_description: 'Phê duyệt hợp đồng dịch vụ Shopee Mall HĐ-2026-001 (SunGroup)',
    resource_module: 'CONTRACTS',
    ip_address: '14.161.22.89',
    device_info: 'Chrome 128 / Windows 11',
    severity: 'INFO',
  },
  {
    id: 'audit_3',
    timestamp: '2026-08-18 14:15:45',
    actor_name: 'Đặng Kim Anh',
    actor_username: 'anh.dk',
    actor_role: 'HR Admin',
    action_type: 'UPDATE_SALARY',
    action_description: 'Nâng bậc lương Bậc 2 -> Bậc 3 (G4) cho nhân sự NV-00101 (Trần Văn Hoàng)',
    resource_module: 'HRM_COMPENSATION',
    ip_address: '113.190.234.12',
    device_info: 'Edge 127 / Windows 11',
    severity: 'WARNING',
  },
  {
    id: 'audit_4',
    timestamp: '2026-08-18 11:20:00',
    actor_name: 'Lê Thị Thu Thủy',
    actor_username: 'thuy.lt',
    actor_role: 'Kế Toán Trưởng',
    action_type: 'ISSUE_VAT_INVOICE',
    action_description: 'Ký số & phát hành Hóa đơn VAT điện tử số 00000101 (MCCQT: 00C8F91A2026)',
    resource_module: 'FINANCE_INVOICE',
    ip_address: '115.79.138.45',
    device_info: 'Firefox 129 / macOS Sonoma',
    severity: 'INFO',
  },
  {
    id: 'audit_5',
    timestamp: '2026-08-18 09:05:18',
    actor_name: 'Hệ Thống Quản Trị',
    actor_username: 'system_root',
    actor_role: 'SUPER_ADMIN',
    action_type: 'RBAC_PERMISSION_CHANGE',
    action_description: 'Cập nhật phân quyền module Quản lý Tài chính cho nhóm Trưởng Nhóm Sale',
    resource_module: 'SYSTEM_RBAC',
    ip_address: '127.0.0.1 (Localhost)',
    device_info: 'Next.js Server API Guard',
    severity: 'CRITICAL',
  },
];

let auditLogsStore: AuditLogEntry[] = [...INITIAL_AUDIT_LOGS];

export const AUDIT_UPDATED_EVENT = 'ggbg_audit_updated';

function notifyAuditUpdate() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('ggbg_audit_data', JSON.stringify(auditLogsStore));
    } catch (e) {
      console.error('Error saving audit logs to localStorage:', e);
    }
    window.dispatchEvent(new Event(AUDIT_UPDATED_EVENT));
  }
}

if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('ggbg_audit_data');
    if (saved) auditLogsStore = JSON.parse(saved);
  } catch (e) {
    console.error('Error loading audit logs from localStorage:', e);
  }
}

export function getAuditLogs(): AuditLogEntry[] {
  return auditLogsStore;
}

export function addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
  const newLog: AuditLogEntry = {
    ...entry,
    id: `audit_${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };
  auditLogsStore = [newLog, ...auditLogsStore];
  notifyAuditUpdate();
  return newLog;
}
