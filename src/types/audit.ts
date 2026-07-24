export type AuditSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor_name: string;
  actor_username: string;
  actor_role: string;
  action_type: string;
  action_description: string;
  resource_module: string;
  ip_address: string;
  device_info: string;
  severity: AuditSeverity;
}
