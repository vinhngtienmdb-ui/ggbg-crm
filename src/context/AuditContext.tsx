'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AuditLogEntry, AuditSeverity } from '@/types/audit';
import { INITIAL_AUDIT_LOGS } from '@/lib/auditStore';
import { useAuth } from '@/context/AuthContext';
export interface LogActionInput {
  action_type: string;
  action_description: string;
  resource_module: string;
  severity?: AuditSeverity;
}

interface AuditContextType {
  logs: AuditLogEntry[];
  /**
   * Append an entry to the security audit trail. Sensitive operations across the
   * app (unmasking PII, bulk reassignment, RBAC edits, exports…) call this so
   * the Nhật Ký Hệ Thống screen reflects what actually happened this session.
   */
  logAction: (input: LogActionInput) => void;
}

const AuditContext = createContext<AuditContextType | undefined>(undefined);

/** Local wall-clock stamp in the `YYYY-MM-DD HH:mm:ss` shape the log table renders. */
function stamp(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(
    d.getMinutes(),
  )}:${p(d.getSeconds())}`;
}

export function AuditProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const { user, simulatedRole } = useAuth();

  const logAction = useCallback(
    ({ action_type, action_description, resource_module, severity = 'INFO' }: LogActionInput) => {
      const entry: AuditLogEntry = {
        id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        timestamp: stamp(),
        actor_name: user?.name ?? 'Super Admin GGBingo',
        actor_username: user?.username ?? 'admin',
        actor_role: simulatedRole || user?.role || 'SUPER_ADMIN',
        action_type,
        action_description,
        resource_module,
        ip_address: '127.0.0.1',
        device_info: typeof navigator === 'undefined' ? 'Unknown' : navigator.userAgent.slice(0, 60),
        severity,
      };
      setLogs((prev) => [entry, ...prev]);
    },
    [user, simulatedRole],
  );

  const value = useMemo(() => ({ logs, logAction }), [logs, logAction]);

  return <AuditContext.Provider value={value}>{children}</AuditContext.Provider>;
}

export function useAudit() {
  const context = useContext(AuditContext);
  if (!context) throw new Error('useAudit must be used within an AuditProvider');
  return context;
}
