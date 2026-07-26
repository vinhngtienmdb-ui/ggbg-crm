'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  UserCheck,
  Check,
  X,
  Save,
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
  Award,
  CheckCircle2,
  Briefcase,
  ChevronRight,
  Shield,
  Layers,
  Settings
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
import { INITIAL_EMPLOYEES, getJobTitles } from '@/lib/hrmStore';

export default function RbacPage() {
  const [roleMatrix, setRoleMatrix] = useState<RoleMatrixDefinition[]>(() => getRoleMatrix());
  const [selectedRoleKey, setSelectedRoleKey] = useState<string>('DIRECTOR');
  const [saveToast, setSaveToast] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRankFilter, setSelectedRankFilter] = useState<number | 'ALL'>('ALL');

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

  // Sync with HRM Store live event
  useEffect(() => {
    const handleHrmSync = () => {
      setRoleMatrix([...getRoleMatrix()]);
    };
    window.addEventListener('ggbg_hrm_job_titles_updated', handleHrmSync);
    return () => window.removeEventListener('ggbg_hrm_job_titles_updated', handleHrmSync);
  }, []);

  // Extract unique HRM positions from HRM Employee Store & Job Titles
  const hrmPositionsList = Array.from(
    new Set([
      ...getJobTitles().map((j) => j.name),
      ...INITIAL_EMPLOYEES.map((e) => e.position).filter(Boolean),
    ])
  );

  const selectedRoleObj =
    roleMatrix.find((r) => r.role === selectedRoleKey) || roleMatrix[0] || roleMatrix[1];

  const handleTogglePermission = (permKey: GranularPermission) => {
    if (!selectedRoleObj || selectedRoleObj.role === 'SUPER_ADMIN') return;
    const isCurrentlyGranted = selectedRoleObj.permissions.includes(permKey);
    const updated = updateRolePermissionToggle(selectedRoleObj.role, permKey, !isCurrentlyGranted);
    setRoleMatrix([...updated]);
  };

  const handleDataScopeChange = (newScope: DataScopeBoundary) => {
    if (!selectedRoleObj || selectedRoleObj.role === 'SUPER_ADMIN') return;
    const updated = updateRoleDataScope(selectedRoleObj.role, newScope);
    setRoleMatrix([...updated]);
  };

  const handleToggleAllPermissionsForRole = (grantAll: boolean) => {
    if (!selectedRoleObj || selectedRoleObj.role === 'SUPER_ADMIN') return;
    CORE_12_PERMISSIONS.forEach((p) => {
      updateRolePermissionToggle(selectedRoleObj.role, p.key, grantAll);
    });
    setRoleMatrix([...getRoleMatrix()]);
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
    setSelectedRoleKey(roleKey);

    // Reset Form
    setNewRoleName('');
    setNewRoleDescription('');
    setNewHrmPosition('');
    setIsCreateModalOpen(false);

    setSaveToast(`Đã khởi tạo & đồng bộ tự động chức danh "${newRoleObj.role_name}"!`);
    setTimeout(() => setSaveToast(''), 4000);
  };

  const handleSaveMatrix = () => {
    setSaveToast('Đã lưu thành công cấu hình Phân quyền & Phạm vi Dữ liệu!');
    setTimeout(() => setSaveToast(''), 4000);
  };

  const renderRankBadge = (rank?: number) => {
    switch (rank) {
      case 1:
        return (
          <span className="px-2 py-0.5 bg-danger-bg text-danger-fg border border-danger-border rounded text-[10px] font-black uppercase">
            Cấp 1: Giám Đốc
          </span>
        );
      case 2:
        return (
          <span className="px-2 py-0.5 bg-brand-300 text-brand-800 border border-brand-100 rounded text-[10px] font-bold uppercase">
            Cấp 2: Quản Lý / Lead
          </span>
        );
      case 3:
        return (
          <span className="px-2 py-0.5 bg-success-bg text-success-fg border border-success-border rounded text-[10px] font-bold uppercase">
            Cấp 3: Chuyên Viên
          </span>
        );
      case 4:
      default:
        return (
          <span className="px-2 py-0.5 bg-warn-bg text-warn-fg border border-gold-border rounded text-[10px] font-bold uppercase">
            Cấp 4: Thử Việc / Mới
          </span>
        );
    }
  };

  const filteredRoles = roleMatrix.filter((rm) => {
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

  // Group 12 permissions into clear categories
  const permissionCategories = [
    {
      category: 'Phân Hệ Lead & Khách Hàng',
      icon: Users,
      color: 'text-brand-600',
      items: CORE_12_PERMISSIONS.filter((p) => p.category.includes('Lead') || p.category.includes('Khách Hàng')),
    },
    {
      category: 'Quản Trị Doanh Nghiệp & KPIs',
      icon: Building2,
      color: 'text-success-fg',
      items: CORE_12_PERMISSIONS.filter((p) => p.category.includes('Doanh Nghiệp')),
    },
    {
      category: 'Hệ Thống & Bảo Mật Audit Logs',
      icon: ShieldCheck,
      color: 'text-plum-fg',
      items: CORE_12_PERMISSIONS.filter((p) => p.category.includes('Bảo Mật')),
    },
    {
      category: 'Trợ Lý AI Assist Engine',
      icon: Sparkles,
      color: 'text-warn-fg',
      items: CORE_12_PERMISSIONS.filter((p) => p.category.includes('AI')),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {saveToast && (
        <div className="p-4 rounded-2xl bg-success-fg text-white font-bold text-xs shadow-cardLg flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-success-dot" />
            <span>{saveToast}</span>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-line shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-ink-900">Cấu Hình Phân Quyền Truy Cập</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-success-bg text-success-fg text-xs font-bold border border-success-border flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success-dot animate-ping"></span> Real-Time Auto-Synced
            </span>
          </div>
          <p className="text-xs text-ink-500 mt-1">
            Chọn chức danh ở cột bên trái để cài đặt chi tiết Phạm vi dữ liệu và Quyền hạn truy cập
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-plum-deep hover:bg-plum-strong text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-card transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Tạo Chức Danh Mới
          </button>

          <button
            onClick={handleSaveMatrix}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-brand-600/20 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            Lưu Cấu Hình
          </button>
        </div>
      </div>

      {/* MAIN 2-COLUMN MASTER-DETAIL LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: MASTER ROLE SELECTOR (4/12 COLS) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-line shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-ink-700 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-plum-fg" /> Danh Sách Chức Danh ({roleMatrix.length})
              </h3>
            </div>

            {/* Search Filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm chức danh..."
                className="w-full pl-8 pr-3 py-1.5 bg-surface-subtle border border-line rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-plum-fg/20"
              />
            </div>

            {/* Rank Level Quick Pills */}
            <div className="flex items-center gap-1 overflow-x-auto touch-scroll sleek-scrollbar pb-1 text-[11px] font-bold">
              <button
                onClick={() => setSelectedRankFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg shrink-0 ${
                  selectedRankFilter === 'ALL' ? 'bg-brand-600 text-white' : 'bg-line-soft text-ink-500 hover:bg-line'
                }`}
              >
                Tất Cả
              </button>
              <button
                onClick={() => setSelectedRankFilter(1)}
                className={`px-2.5 py-1 rounded-lg shrink-0 ${
                  selectedRankFilter === 1 ? 'bg-danger-fg text-white' : 'bg-danger-bg text-danger-fg'
                }`}
              >
                Cấp 1
              </button>
              <button
                onClick={() => setSelectedRankFilter(2)}
                className={`px-2.5 py-1 rounded-lg shrink-0 ${
                  selectedRankFilter === 2 ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-800'
                }`}
              >
                Cấp 2
              </button>
              <button
                onClick={() => setSelectedRankFilter(3)}
                className={`px-2.5 py-1 rounded-lg shrink-0 ${
                  selectedRankFilter === 3 ? 'bg-success-fg text-white' : 'bg-success-bg text-success-fg'
                }`}
              >
                Cấp 3
              </button>
            </div>

            {/* Role Master Card List */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 sleek-scrollbar">
              {filteredRoles.map((rm) => {
                const isSelected = rm.role === selectedRoleKey;
                const grantedCount = rm.permissions.length;
                return (
                  <div
                    key={rm.role}
                    onClick={() => setSelectedRoleKey(rm.role)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-gradient-to-r from-brand-50 to-white text-white border-plum-border shadow-md ring-2 ring-plum-fg/20'
                        : 'bg-surface-subtle hover:bg-white text-ink-900 border-line '
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-xs ${isSelected ? 'text-white' : 'text-ink-900'}`}>
                          {rm.role_name}
                        </span>
                      </div>
                      <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-plum-fg' : 'text-ink-400'}`} />
                    </div>

                    <div className="flex items-center justify-between text-[10px]">
                      {renderRankBadge(rm.rank_level)}
                      <span className={`font-mono font-bold ${isSelected ? 'text-plum-deep' : 'text-ink-500'}`}>
                        {grantedCount}/12 quyền
                      </span>
                    </div>

                    {rm.hrm_position_name && (
                      <p className={`text-[10px] font-mono flex items-center gap-1 ${isSelected ? 'text-plum-deep' : 'text-plum-fg'}`}>
                        <Briefcase className="w-3 h-3" /> HRM: {rm.hrm_position_name}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAIL PERMISSION SETTINGS FOR SELECTED ROLE (8/12 COLS) */}
        <div className="lg:col-span-8 space-y-5">
          {selectedRoleObj ? (
            <>
              {/* Selected Role Banner Header */}
              <div className="bg-gradient-to-r from-brand-50 via-white to-white p-6 rounded-2xl text-white shadow-md border border-brand-600/40 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-lg font-black text-white">{selectedRoleObj.role_name}</h2>
                      {renderRankBadge(selectedRoleObj.rank_level)}
                    </div>
                    <p className="text-xs text-ink-400 mt-1 max-w-xl">
                      {selectedRoleObj.description}
                    </p>
                  </div>

                  {selectedRoleObj.role !== 'SUPER_ADMIN' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleAllPermissionsForRole(true)}
                        className="px-2.5 py-1 bg-success-dot/20 hover:bg-success-dot/30 text-success-dot border border-success-border/30 rounded-lg text-[11px] font-bold transition-all"
                      >
                        Bật Tất Cả Quyền
                      </button>
                      <button
                        onClick={() => handleToggleAllPermissionsForRole(false)}
                        className="px-2.5 py-1 bg-danger-dot/20 hover:bg-danger-dot/30 text-danger-dot border border-danger-border/30 rounded-lg text-[11px] font-bold transition-all"
                      >
                        Tắt Tất Cả
                      </button>
                    </div>
                  )}
                </div>

                {/* Data Scope Config Dropdown */}
                <div className="pt-3 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-warn-fg">
                    <Database className="w-4 h-4" />
                    <span>Phạm Vi Dữ Liệu Được Phép Truy Cập (Data Scope):</span>
                  </div>

                  {selectedRoleObj.role === 'SUPER_ADMIN' ? (
                    <span className="px-3 py-1 bg-danger-bg text-danger-dot font-mono text-xs font-bold rounded-lg border border-danger-border/60">
                      🔴 Toàn Công Ty (Super Admin Default)
                    </span>
                  ) : (
                    <select
                      value={selectedRoleObj.data_scope}
                      onChange={(e) => handleDataScopeChange(e.target.value as DataScopeBoundary)}
                      className="px-3.5 py-1.5 bg-white border border-line text-warn-fg font-mono text-xs font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-600"
                    >
                      <option value="ALL_COMPANY">🔴 Toàn Công Ty (ALL_COMPANY)</option>
                      <option value="DEPARTMENT">🔵 Trong Phòng Ban (DEPARTMENT)</option>
                      <option value="TEAM">🟢 Trong Đội Nhóm (TEAM)</option>
                      <option value="OWNER_ONLY">🟡 Chỉ Cá Nhân Được Gán (OWNER_ONLY)</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Categorized Permissions List */}
              <div className="space-y-4">
                {permissionCategories.map((cat) => {
                  const CatIcon = cat.icon;
                  return (
                    <div key={cat.category} className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden p-5 space-y-3">
                      <h4 className="font-extrabold text-xs uppercase tracking-wider text-ink-900 flex items-center gap-2 border-b border-line pb-2.5">
                        <CatIcon className={`w-4 h-4 ${cat.color}`} />
                        <span>{cat.category}</span>
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {cat.items.map((perm) => {
                          const isGranted = selectedRoleObj.permissions.includes(perm.key);
                          const isSuperAdmin = selectedRoleObj.role === 'SUPER_ADMIN';

                          return (
                            <div
                              key={perm.key}
                              onClick={() => !isSuperAdmin && handleTogglePermission(perm.key)}
                              className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                                isSuperAdmin
                                  ? 'bg-surface-subtle border-line opacity-90 cursor-not-allowed'
                                  : isGranted
                                  ? 'bg-success-bg/60 border-success-border hover:bg-success-hover cursor-pointer'
                                  : 'bg-surface-subtle border-line hover:bg-line-soft cursor-pointer'
                              }`}
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-xs text-ink-900">{perm.name}</span>
                                  <span className="text-[10px] font-mono font-bold text-ink-400 bg-line px-1.5 py-0.5 rounded">
                                    {perm.key}
                                  </span>
                                </div>
                                <p className="text-[11px] text-ink-500 leading-snug">{perm.description}</p>
                              </div>

                              {/* Sleek Toggle Button */}
                              <button
                                type="button"
                                disabled={isSuperAdmin}
                                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 mt-0.5 ${
                                  isGranted ? 'bg-success-fg' : 'bg-line-muted'
                                }`}
                              >
                                <span
                                  className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                                    isGranted ? 'left-6' : 'left-1'
                                  }`}
                                />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-line text-center space-y-3 text-ink-500">
              <Shield className="w-8 h-8 text-ink-400 mx-auto" />
              <p className="text-xs font-semibold">Vui lòng chọn một chức danh ở danh sách bên trái để cấu hình quyền hạn.</p>
            </div>
          )}
        </div>

      </div>

      {/* CREATE CUSTOM ROLE / JOB TITLE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-white flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-cardLg border border-line text-ink-900 space-y-5 animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-plum-bg text-plum-fg rounded-2xl border border-plum-border">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-ink-900">Tạo Chức Danh / Chức Vụ Mới</h3>
                  <p className="text-xs text-ink-500">Khai báo chức danh và phân quyền tự động</p>
                </div>
              </div>

              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-ink-400 hover:bg-line-soft hover:text-ink-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomRole} className="space-y-4 text-xs">
              {/* Quick Select from HRM Position List */}
              <div>
                <label className="block font-bold text-ink-700 mb-1">
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
                  className="w-full px-3.5 py-2.5 bg-surface-subtle border border-line rounded-xl text-xs font-medium text-ink-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-plum-fg/20 focus:border-plum-border"
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
                <label className="block font-bold text-ink-700 mb-1">
                  Tên Chức Danh / Chức Vụ <span className="text-danger-fg">*</span>:
                </label>
                <input
                  type="text"
                  required
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="VD: Trưởng Phòng Marketing, Chuyên Viên Vận Hành Ops..."
                  className="w-full px-3.5 py-2.5 bg-surface-subtle border border-line rounded-xl text-xs font-semibold text-ink-900 placeholder-ink-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-plum-fg/20 focus:border-plum-border"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-ink-700 mb-1">Mô Tả Nhiệm Vụ / Trách Nhiệm:</label>
                <textarea
                  rows={2}
                  value={newRoleDescription}
                  onChange={(e) => setNewRoleDescription(e.target.value)}
                  placeholder="Mô tả phạm vi trách nhiệm của chức danh này..."
                  className="w-full px-3.5 py-2 bg-surface-subtle border border-line rounded-xl text-xs text-ink-900 placeholder-ink-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-plum-fg/20 focus:border-plum-border"
                />
              </div>

              {/* Rank Level & Data Scope Selection Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Phân Cấp Chức Vụ (Rank Level):</label>
                  <select
                    value={newRankLevel}
                    onChange={(e) => setNewRankLevel(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-surface-subtle border border-line rounded-xl text-xs font-bold text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-fg/20 focus:border-plum-border"
                  >
                    <option value={1}>🔴 Cấp 1: Ban Giám Đốc (Executive)</option>
                    <option value={2}>🔵 Cấp 2: Quản Lý & Trưởng Phòng (Management)</option>
                    <option value={3}>🟢 Cấp 3: Chuyên Viên Thực Thao (Operational)</option>
                    <option value={4}>🟡 Cấp 4: Nhân Sự Mới & Thử Việc (Entry)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-ink-700 mb-1">Phạm Vi Dữ Liệu Ban Đầu (Data Scope):</label>
                  <select
                    value={newDataScope}
                    onChange={(e) => setNewDataScope(e.target.value as DataScopeBoundary)}
                    className="w-full px-3.5 py-2.5 bg-surface-subtle border border-line rounded-xl text-xs font-bold text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-fg/20 focus:border-plum-border"
                  >
                    <option value="ALL_COMPANY">🔴 Toàn Công Ty (ALL_COMPANY)</option>
                    <option value="DEPARTMENT">🔵 Phòng Ban (DEPARTMENT)</option>
                    <option value="TEAM">🟢 Đội Nhóm (TEAM)</option>
                    <option value="OWNER_ONLY">🟡 Chỉ Cá Nhân Được Phân Công</option>
                  </select>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-line flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-line-soft hover:bg-line text-ink-700 font-semibold rounded-xl text-xs transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-plum-deep hover:bg-plum-strong text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-card transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  Tạo Chức Danh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
