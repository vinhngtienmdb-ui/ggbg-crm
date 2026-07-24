'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  UserCheck,
  Check,
  X,
  Save,
  AlertTriangle,
  Info,
  Sliders,
  Database,
  Building2,
  Users,
  User,
  Sparkles,
  Key
} from 'lucide-react';
import { GranularPermission, DataScopeBoundary, UserRole, RoleMatrixDefinition } from '@/types';
import { CORE_12_PERMISSIONS, getRoleMatrix, updateRolePermissionToggle, updateRoleDataScope } from '@/lib/rbacStore';
import { useAuth } from '@/context/AuthContext';

export default function RbacPage() {
  const [roleMatrix, setRoleMatrix] = useState<RoleMatrixDefinition[]>(() => getRoleMatrix());
  const [saveToast, setSaveToast] = useState('');
  const { simulatedRole } = useAuth();

  const handleToggle = (role: UserRole, perm: GranularPermission, currentStatus: boolean) => {
    if (role === 'SUPER_ADMIN') return; // Super Admin always has full access
    const updated = updateRolePermissionToggle(role, perm, !currentStatus);
    setRoleMatrix([...updated]);
  };

  const handleScopeChange = (role: UserRole, scope: DataScopeBoundary) => {
    if (role === 'SUPER_ADMIN') return;
    const updated = updateRoleDataScope(role, scope);
    setRoleMatrix([...updated]);
  };

  const handleSave = () => {
    setSaveToast('Đã lưu thành công Ma trận Phân quyền 2D (Function Permissions & Data Scope Boundaries)!');
    setTimeout(() => setSaveToast(''), 4000);
  };

  const getScopeBadge = (scope: DataScopeBoundary) => {
    switch (scope) {
      case 'ALL_COMPANY':
        return <span className="px-2.5 py-1 bg-red-100 text-red-800 text-[11px] font-bold rounded-lg border border-red-200">🔴 Toàn Công Ty (ALL_COMPANY)</span>;
      case 'DEPARTMENT':
        return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-[11px] font-bold rounded-lg border border-blue-200">🔵 Phòng Ban (DEPARTMENT)</span>;
      case 'TEAM':
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-lg border border-emerald-200">🟢 Đội Phụ Trách (TEAM)</span>;
      case 'OWNER_ONLY':
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] font-bold rounded-lg border border-amber-200">🟡 Chỉ Assigned To (auth.uid())</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {saveToast && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-xl flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-200" />
            <span>{saveToast}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Phân Quyền Truy Cập</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Cấu hình quyền hạn chức năng và phạm vi dữ liệu theo vai trò
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-95 shrink-0"
        >
          <Save className="w-4 h-4" /> Lưu Ma Trận Phân Quyền
        </button>
      </div>

      {/* SIMULATED ROLE MATRIX SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Super Admin */}
        <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 bg-red-500 text-white rounded text-[10px] font-black uppercase">Super Admin</span>
            <Building2 className="w-4 h-4 text-red-400" />
          </div>
          <h3 className="font-bold text-sm text-white">Super Admin</h3>
          <p className="text-[11px] text-slate-300">Toàn quyền hệ thống.</p>
          <div className="pt-1">
            <span className="text-[10px] font-mono text-red-300 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/50">
              Toàn Công Ty
            </span>
          </div>
        </div>

        {/* Card 2: Sales Director */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded text-[10px] font-black uppercase">Director</span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Sales Director</h3>
          <p className="text-[11px] text-slate-500">Xem/Sửa toàn bộ dữ liệu công ty và quản lý phân quyền.</p>
          <div className="pt-1">
            <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Toàn Công Ty
            </span>
          </div>
        </div>

        {/* Card 3: Team Lead */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-black uppercase">Team Lead</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Team Lead</h3>
          <p className="text-[11px] text-slate-500">Xem/Quản lý dữ liệu thuộc Đội phụ trách.</p>
          <div className="pt-1">
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Đội Nhóm
            </span>
          </div>
        </div>

        {/* Card 4: Sales Executive */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-black uppercase">Sale Exec</span>
            <User className="w-4 h-4 text-amber-600" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Sales Executive</h3>
          <p className="text-[11px] text-slate-500">Tương tác với Lead/Customer được phân công.</p>
          <div className="pt-1">
            <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Chỉ Cá Nhân
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 1: DATA SCOPE BOUNDARIES MATRIX */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg space-y-4 border border-slate-800">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-2">
          <Database className="w-4 h-4" /> Phạm Vi Dữ Liệu
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roleMatrix.filter(rm => rm.role !== 'SUPER_ADMIN').map((rm) => (
            <div key={rm.role} className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">{rm.role_name}</span>
              </div>
              <label className="block text-[11px] text-slate-400 font-medium">Chọn Phạm Vi Dữ Liệu:</label>
              <select
                value={rm.data_scope}
                onChange={(e) => handleScopeChange(rm.role, e.target.value as DataScopeBoundary)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 text-amber-300 font-mono text-xs font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL_COMPANY">Toàn Công Ty</option>
                <option value="DEPARTMENT">Phòng Ban</option>
                <option value="TEAM">Đội Nhóm</option>
                <option value="OWNER_ONLY">Chỉ Cá Nhân Được Phân Công</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: GRANULAR PERMISSIONS MATRIX TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-2">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Key className="w-4 h-4 text-blue-600" /> Ma Trận Phân Quyền Chức Năng
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            <strong className="text-slate-900">{CORE_12_PERMISSIONS.length} Quyền Hạn</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-extrabold uppercase tracking-wider">
                <th className="p-4 min-w-[280px]">Quyền Hạn</th>
                {roleMatrix.map((rm) => (
                  <th key={rm.role} className="p-4 text-center min-w-[130px]">
                    <div>
                      <p className="font-bold text-slate-900">{rm.role_name.split('(')[0]}</p>
                      <p className="text-[10px] text-slate-400 font-normal lowercase">({rm.role})</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {CORE_12_PERMISSIONS.map((perm) => (
                <tr key={perm.key} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-slate-100 font-mono text-blue-700 font-bold rounded text-[11px]">
                        {perm.key}
                      </span>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-800 text-[10px] font-bold rounded">
                        {perm.category}
                      </span>
                    </div>
                    <p className="font-bold text-slate-900 mt-1">{perm.name}</p>
                    <p className="text-[11px] text-slate-500">{perm.description}</p>
                  </td>

                  {roleMatrix.map((rm) => {
                    const isGranted = rm.permissions.includes(perm.key);
                    const isSuperAdmin = rm.role === 'SUPER_ADMIN';

                    return (
                      <td key={rm.role} className="p-4 text-center">
                        <button
                          type="button"
                          disabled={isSuperAdmin}
                          onClick={() => handleToggle(rm.role, perm.key, isGranted)}
                          className={`w-7 h-7 rounded-lg inline-flex items-center justify-center font-bold transition-all ${
                            isGranted
                              ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
                              : 'bg-slate-100 text-slate-300 hover:bg-slate-200'
                          } ${isSuperAdmin ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'}`}
                        >
                          {isGranted ? <Check className="w-4 h-4" /> : <X className="w-4 h-4 text-slate-400" />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
