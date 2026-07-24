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
  Key,
  Plus,
  RefreshCw,
  Search,
  Filter,
  Layers,
  Award,
  CheckCircle2,
  Briefcase
} from 'lucide-react';
import { GranularPermission, DataScopeBoundary, UserRole, RoleMatrixDefinition } from '@/types';
import {
  CORE_12_PERMISSIONS,
  getRoleMatrix,
  updateRolePermissionToggle,
  updateRoleDataScope,
  syncRolesFromHrmPositions,
  addCustomRoleMatrix
} from '@/lib/rbacStore';
import { INITIAL_EMPLOYEES } from '@/lib/hrmStore';
import { useAuth } from '@/context/AuthContext';

export default function RbacPage() {
  const [roleMatrix, setRoleMatrix] = useState<RoleMatrixDefinition[]>(() => getRoleMatrix());
  const [saveToast, setSaveToast] = useState('');
  const [selectedRankFilter, setSelectedRankFilter] = useState<number | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State for Creating Custom Job Title / Role
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [newRankLevel, setNewRankLevel] = useState<number>(3);
  const [newDataScope, setNewDataScope] = useState<DataScopeBoundary>('TEAM');
  const [newHrmPosition, setNewHrmPosition] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<GranularPermission[]>([
    'leads:read',
    'customers:read',
    'ai:use',
  ]);

  const { simulatedRole } = useAuth();

  // Extract unique HRM positions from HRM Employee Store
  const hrmPositionsList = Array.from(
    new Set(INITIAL_EMPLOYEES.map((e) => e.position).filter(Boolean))
  );

  const handleSyncHrmPositions = () => {
    const updated = syncRolesFromHrmPositions(hrmPositionsList);
    setRoleMatrix([...updated]);
    setSaveToast(`Đã đồng bộ thành công ${hrmPositionsList.length} chức danh chuẩn từ phân hệ HRM!`);
    setTimeout(() => setSaveToast(''), 4000);
  };

  const handleCreateCustomRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    const roleKey = `CUSTOM_${newRoleName.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`;

    const newRoleObj: RoleMatrixDefinition = {
      role: roleKey,
      role_name: newRoleName.trim(),
      description: newRoleDescription.trim() || 'Chức danh mới được khởi tạo từ hệ thống Phân quyền',
      data_scope: newDataScope,
      rank_level: newRankLevel,
      hrm_position_name: newHrmPosition || newRoleName.trim(),
      is_custom: true,
      permissions: selectedPermissions,
    };

    const updated = addCustomRoleMatrix(newRoleObj);
    setRoleMatrix([...updated]);

    // Reset Form
    setNewRoleName('');
    setNewRoleDescription('');
    setNewHrmPosition('');
    setIsCreateModalOpen(false);

    setSaveToast(`Đã khởi tạo thành công chức danh mới "${newRoleObj.role_name}"!`);
    setTimeout(() => setSaveToast(''), 4000);
  };

  const handleToggle = (role: UserRole | string, perm: GranularPermission, currentStatus: boolean) => {
    if (role === 'SUPER_ADMIN') return; // Super Admin always has full access
    const updated = updateRolePermissionToggle(role, perm, !currentStatus);
    setRoleMatrix([...updated]);
  };

  const handleScopeChange = (role: UserRole | string, scope: DataScopeBoundary) => {
    if (role === 'SUPER_ADMIN') return;
    const updated = updateRoleDataScope(role, scope);
    setRoleMatrix([...updated]);
  };

  const handleSave = () => {
    setSaveToast('Đã lưu thành công Ma trận Phân quyền & Phân cấp Chức danh (2D RBAC & Rank Hierarchy)!');
    setTimeout(() => setSaveToast(''), 4000);
  };

  const togglePermissionSelection = (perm: GranularPermission) => {
    if (selectedPermissions.includes(perm)) {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== perm));
    } else {
      setSelectedPermissions([...selectedPermissions, perm]);
    }
  };

  const getRankBadge = (rank?: number) => {
    switch (rank) {
      case 1:
        return (
          <span className="px-2 py-0.5 bg-red-100 text-red-800 border border-red-200 rounded text-[10px] font-black uppercase flex items-center gap-1">
            <Award className="w-3 h-3 text-red-600" /> Cấp 1: Ban Giám Đốc
          </span>
        );
      case 2:
        return (
          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 border border-blue-200 rounded text-[10px] font-bold uppercase flex items-center gap-1">
            <Building2 className="w-3 h-3 text-blue-600" /> Cấp 2: Quản Lý / Lead
          </span>
        );
      case 3:
        return (
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-[10px] font-bold uppercase flex items-center gap-1">
            <Users className="w-3 h-3 text-emerald-600" /> Cấp 3: Chuyên Viên
          </span>
        );
      case 4:
      default:
        return (
          <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-200 rounded text-[10px] font-bold uppercase flex items-center gap-1">
            <User className="w-3 h-3 text-amber-600" /> Cấp 4: Thử Việc / Khác
          </span>
        );
    }
  };

  const filteredRoleMatrix = roleMatrix.filter((rm) => {
    if (selectedRankFilter !== 'ALL' && (rm.rank_level || 3) !== selectedRankFilter) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return (
        rm.role_name.toLowerCase().includes(term) ||
        rm.description.toLowerCase().includes(term) ||
        (rm.hrm_position_name && rm.hrm_position_name.toLowerCase().includes(term))
      );
    }
    return true;
  });

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
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Phân Quyền Truy Cập & Phân Cấp Chức Danh</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
              Chuẩn Đơn Vị HRM
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Khởi tạo chức danh mới, phân cấp chức vụ 4 cấp bậc và đồng bộ trực tiếp với danh mục vị trí trong hệ thống HRM.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleSyncHrmPositions}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-slate-200 transition-all shrink-0"
            title="Tự động đồng bộ các chức danh mới từ Hồ sơ nhân sự HRM"
          >
            <RefreshCw className="w-4 h-4 text-purple-600" />
            <span>Đồng Bộ Từ HRM</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Chức Danh Mới</span>
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>Lưu Ma Trận RBAC</span>
          </button>
        </div>
      </div>

      {/* HIERARCHICAL RANK CARDS (PHÂN CẤP CHỨC DANH / CHỨC VỤ) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card Cấp 1 */}
        <div
          onClick={() => setSelectedRankFilter(selectedRankFilter === 1 ? 'ALL' : 1)}
          className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
            selectedRankFilter === 1
              ? 'bg-red-950/90 text-white border-red-500 shadow-md ring-2 ring-red-500/30'
              : 'bg-white text-slate-900 border-slate-200 hover:border-red-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 bg-red-500 text-white rounded text-[10px] font-black uppercase">
              Level 1
            </span>
            <Award className={`w-4 h-4 ${selectedRankFilter === 1 ? 'text-red-300' : 'text-red-500'}`} />
          </div>
          <div>
            <h3 className="font-bold text-sm">Cấp 1: Ban Giám Đốc</h3>
            <p className={`text-[11px] mt-0.5 ${selectedRankFilter === 1 ? 'text-slate-300' : 'text-slate-500'}`}>
              Super Admin, Sales Director, Giám Đốc Chức Năng (Toàn quyền quản trị).
            </p>
          </div>
          <div className="pt-1 flex items-center justify-between text-[11px]">
            <span className="font-bold">
              {roleMatrix.filter((rm) => rm.rank_level === 1).length} Chức danh
            </span>
            <span className="text-[10px] font-mono opacity-80">Data Scope: ALL_COMPANY</span>
          </div>
        </div>

        {/* Card Cấp 2 */}
        <div
          onClick={() => setSelectedRankFilter(selectedRankFilter === 2 ? 'ALL' : 2)}
          className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
            selectedRankFilter === 2
              ? 'bg-blue-950/90 text-white border-blue-500 shadow-md ring-2 ring-blue-500/30'
              : 'bg-white text-slate-900 border-slate-200 hover:border-blue-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-black uppercase">
              Level 2
            </span>
            <Building2 className={`w-4 h-4 ${selectedRankFilter === 2 ? 'text-blue-300' : 'text-blue-600'}`} />
          </div>
          <div>
            <h3 className="font-bold text-sm">Cấp 2: Quản Lý & Lead</h3>
            <p className={`text-[11px] mt-0.5 ${selectedRankFilter === 2 ? 'text-slate-300' : 'text-slate-500'}`}>
              Trưởng Phòng, Trưởng Nhóm Sale, Quản Lý HR (Quản lý đội ngũ & giao KPI).
            </p>
          </div>
          <div className="pt-1 flex items-center justify-between text-[11px]">
            <span className="font-bold">
              {roleMatrix.filter((rm) => rm.rank_level === 2).length} Chức danh
            </span>
            <span className="text-[10px] font-mono opacity-80">Data Scope: DEPARTMENT / TEAM</span>
          </div>
        </div>

        {/* Card Cấp 3 */}
        <div
          onClick={() => setSelectedRankFilter(selectedRankFilter === 3 ? 'ALL' : 3)}
          className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
            selectedRankFilter === 3
              ? 'bg-emerald-950/90 text-white border-emerald-500 shadow-md ring-2 ring-emerald-500/30'
              : 'bg-white text-slate-900 border-slate-200 hover:border-emerald-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-black uppercase">
              Level 3
            </span>
            <Users className={`w-4 h-4 ${selectedRankFilter === 3 ? 'text-emerald-300' : 'text-emerald-600'}`} />
          </div>
          <div>
            <h3 className="font-bold text-sm">Cấp 3: Chuyên Viên Thực Thao</h3>
            <p className={`text-[11px] mt-0.5 ${selectedRankFilter === 3 ? 'text-slate-300' : 'text-slate-500'}`}>
              NVKD, Specialist CSKH, Chuyên Viên Kiểm Toán (Tác nghiệp trực tiếp).
            </p>
          </div>
          <div className="pt-1 flex items-center justify-between text-[11px]">
            <span className="font-bold">
              {roleMatrix.filter((rm) => (rm.rank_level || 3) === 3).length} Chức danh
            </span>
            <span className="text-[10px] font-mono opacity-80">Data Scope: OWNER_ONLY / DEPT</span>
          </div>
        </div>

        {/* Card Cấp 4 */}
        <div
          onClick={() => setSelectedRankFilter(selectedRankFilter === 4 ? 'ALL' : 4)}
          className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
            selectedRankFilter === 4
              ? 'bg-amber-950/90 text-white border-amber-500 shadow-md ring-2 ring-amber-500/30'
              : 'bg-white text-slate-900 border-slate-200 hover:border-amber-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 bg-amber-500 text-slate-900 rounded text-[10px] font-black uppercase">
              Level 4
            </span>
            <User className={`w-4 h-4 ${selectedRankFilter === 4 ? 'text-amber-300' : 'text-amber-600'}`} />
          </div>
          <div>
            <h3 className="font-bold text-sm">Cấp 4: Thử Việc & Khác</h3>
            <p className={`text-[11px] mt-0.5 ${selectedRankFilter === 4 ? 'text-slate-300' : 'text-slate-500'}`}>
              Nhân sự thử việc, Thực tập sinh, Chức danh tùy chỉnh mới khởi tạo.
            </p>
          </div>
          <div className="pt-1 flex items-center justify-between text-[11px]">
            <span className="font-bold">
              {roleMatrix.filter((rm) => rm.rank_level === 4).length} Chức danh
            </span>
            <span className="text-[10px] font-mono opacity-80">Data Scope: RESTRICTED</span>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo Tên chức danh, Vị trí HRM..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto touch-scroll sleek-scrollbar w-full md:w-auto text-xs font-semibold">
          <span className="text-slate-500 flex items-center gap-1 mr-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Phân cấp:
          </span>
          <button
            onClick={() => setSelectedRankFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
              selectedRankFilter === 'ALL'
                ? 'bg-slate-900 text-white font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất Cả ({roleMatrix.length})
          </button>
          <button
            onClick={() => setSelectedRankFilter(1)}
            className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
              selectedRankFilter === 1
                ? 'bg-red-600 text-white font-bold'
                : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            Cấp 1 ({roleMatrix.filter((rm) => rm.rank_level === 1).length})
          </button>
          <button
            onClick={() => setSelectedRankFilter(2)}
            className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
              selectedRankFilter === 2
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            Cấp 2 ({roleMatrix.filter((rm) => rm.rank_level === 2).length})
          </button>
          <button
            onClick={() => setSelectedRankFilter(3)}
            className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
              selectedRankFilter === 3
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Cấp 3 ({roleMatrix.filter((rm) => (rm.rank_level || 3) === 3).length})
          </button>
        </div>
      </div>

      {/* SECTION 1: DATA SCOPE BOUNDARIES MATRIX */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg space-y-4 border border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <Database className="w-4 h-4" /> Cấu Hình Phạm Vi Dữ Liệu Theo Chức Danh (Data Scope Boundaries)
          </h3>
          <span className="text-[11px] text-slate-400">
            Hiển thị {filteredRoleMatrix.length} chức danh
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredRoleMatrix
            .filter((rm) => rm.role !== 'SUPER_ADMIN')
            .map((rm) => (
              <div key={rm.role} className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-xs text-white truncate">{rm.role_name}</span>
                  {getRankBadge(rm.rank_level)}
                </div>
                {rm.hrm_position_name && (
                  <p className="text-[10px] text-purple-300 font-mono flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-purple-400" /> HRM: {rm.hrm_position_name}
                  </p>
                )}
                <label className="block text-[11px] text-slate-400 font-medium">Chọn Phạm Vi Dữ Liệu:</label>
                <select
                  value={rm.data_scope}
                  onChange={(e) => handleScopeChange(rm.role, e.target.value as DataScopeBoundary)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 text-amber-300 font-mono text-xs font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL_COMPANY">🔴 Toàn Công Ty</option>
                  <option value="DEPARTMENT">🔵 Phòng Ban</option>
                  <option value="TEAM">🟢 Đội Nhóm</option>
                  <option value="OWNER_ONLY">🟡 Chỉ Cá Nhân Được Phân Công</option>
                </select>
              </div>
            ))}
        </div>
      </div>

      {/* SECTION 2: GRANULAR PERMISSIONS MATRIX TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-2">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Key className="w-4 h-4 text-blue-600" /> Ma Trận Phân Quyền Chi Tiết (Granular Permissions Matrix)
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            <strong className="text-slate-900">{CORE_12_PERMISSIONS.length} Quyền Hạn Hạt Mịn</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-extrabold uppercase tracking-wider">
                <th className="p-4 min-w-[280px]">Quyền Hạn Hệ Thống</th>
                {filteredRoleMatrix.map((rm) => (
                  <th key={rm.role} className="p-4 text-center min-w-[150px]">
                    <div className="space-y-1">
                      <p className="font-bold text-slate-900">{rm.role_name}</p>
                      <div className="flex justify-center">{getRankBadge(rm.rank_level)}</div>
                      {rm.hrm_position_name && (
                        <p className="text-[9px] text-purple-600 font-semibold">
                          HRM: {rm.hrm_position_name}
                        </p>
                      )}
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

                  {filteredRoleMatrix.map((rm) => {
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

      {/* CREATE CUSTOM ROLE / JOB TITLE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 space-y-5 animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Tạo Chức Danh / Chức Vụ Mới</h3>
                  <p className="text-xs text-slate-500">Đồng bộ vị trí làm việc với ma trận phân quyền RBAC</p>
                </div>
              </div>

              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomRole} className="space-y-4 text-xs">
              {/* Quick Select from HRM Position List */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Chọn Nhanh Chức Danh Từ Hệ Thống HRM:
                </label>
                <select
                  value={newHrmPosition}
                  onChange={(e) => {
                    const pos = e.target.value;
                    setNewHrmPosition(pos);
                    if (pos) {
                      setNewRoleName(pos);
                      if (pos.toLowerCase().includes('giám đốc')) setNewRankLevel(1);
                      else if (pos.toLowerCase().includes('trưởng') || pos.toLowerCase().includes('quản lý')) setNewRankLevel(2);
                      else setNewRankLevel(3);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="">-- Chọn vị trí đã có trong hồ sơ HRM --</option>
                  {hrmPositionsList.map((pos) => (
                    <option key={pos} value={pos}>
                      💼 {pos}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tên Chức Danh / Chức Vụ <span className="text-red-500">*</span>:
                </label>
                <input
                  type="text"
                  required
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="VD: Trưởng Phòng Marketing, Chuyên Viên Vận Hành Ops..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô Tả Nhiệm Vụ / Trách Nhiệm:</label>
                <textarea
                  rows={2}
                  value={newRoleDescription}
                  onChange={(e) => setNewRoleDescription(e.target.value)}
                  placeholder="Mô tả phạm vi trách nhiệm của chức danh này..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Rank Level & Data Scope Selection Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phân Cấp Chức Vụ (Rank Level):</label>
                  <select
                    value={newRankLevel}
                    onChange={(e) => setNewRankLevel(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value={1}>🔴 Cấp 1: Ban Giám Đốc (Executive)</option>
                    <option value={2}>🔵 Cấp 2: Quản Lý & Trưởng Phòng (Management)</option>
                    <option value={3}>🟢 Cấp 3: Chuyên Viên Thực Thao (Operational)</option>
                    <option value={4}>🟡 Cấp 4: Nhân Sự Mới & Thử Việc (Entry)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phạm Vi Dữ Liệu Ban Đầu (Data Scope):</label>
                  <select
                    value={newDataScope}
                    onChange={(e) => setNewDataScope(e.target.value as DataScopeBoundary)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="ALL_COMPANY">🔴 Toàn Công Ty (ALL_COMPANY)</option>
                    <option value="DEPARTMENT">🔵 Phòng Ban (DEPARTMENT)</option>
                    <option value="TEAM">🟢 Đội Nhóm (TEAM)</option>
                    <option value="OWNER_ONLY">🟡 Chỉ Cá Nhân Được Phân Công</option>
                  </select>
                </div>
              </div>

              {/* Permission Checkbox Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Cấu Hình Quyền Hạn Ban Đầu ({selectedPermissions.length}/12 quyền):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 bg-slate-50 border border-slate-200 rounded-2xl sleek-scrollbar">
                  {CORE_12_PERMISSIONS.map((perm) => {
                    const isChecked = selectedPermissions.includes(perm.key);
                    return (
                      <label
                        key={perm.key}
                        className={`flex items-center gap-2 p-2 rounded-xl border transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-indigo-50/80 border-indigo-200 text-indigo-900 font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePermissionSelection(perm.key)}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-[11px] truncate">{perm.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  Tạo & Lưu Chức Danh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
