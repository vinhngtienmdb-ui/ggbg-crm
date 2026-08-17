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
      ...getJobTitles().map((j: { name: string }) => j.name),
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
        return ( <span className="px-2 py-0.5 bg-red-100 text-red-800 border border-red-200 rounded text-[10px] font-semibold uppercase"> Cấp 1: Giám Đốc </span> );
      case 2:
        return ( <span className="px-2 py-0.5 bg-blue-100 text-blue-800 border border-blue-200 rounded text-[10px] font-medium uppercase"> Cấp 2: Quản Lý / Lead </span> );
      case 3:
        return ( <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-[10px] font-medium uppercase"> Cấp 3: Chuyên Viên </span> );
      case 4:
      default:
        return ( <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-200 rounded text-[10px] font-medium uppercase"> Cấp 4: Thử Việc / Mới </span> );
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
      color: 'text-blue-600',
      items: CORE_12_PERMISSIONS.filter((p) => p.category.includes('Lead') || p.category.includes('Khách Hàng')),
    },
    {
      category: 'Quản Trị Doanh Nghiệp & KPIs',
      icon: Building2,
      color: 'text-emerald-600',
      items: CORE_12_PERMISSIONS.filter((p) => p.category.includes('Doanh Nghiệp')),
    },
    {
      category: 'Hệ Thống & Bảo Mật Audit Logs',
      icon: ShieldCheck,
      color: 'text-purple-600',
      items: CORE_12_PERMISSIONS.filter((p) => p.category.includes('Bảo Mật')),
    },
    {
      category: 'Trợ Lý AI Assist Engine',
      icon: Sparkles,
      color: 'text-amber-500',
      items: CORE_12_PERMISSIONS.filter((p) => p.category.includes('AI')),
    },
  ];

  return ( <div className="space-y-6"> {/* Toast Notification */}
      {saveToast && ( <div className="p-4 rounded-xl bg-emerald-600 text-white font-medium text-xs shadow-xl flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300"> <div className="flex items-center gap-2"> <ShieldCheck className="w-5 h-5 text-emerald-200" /> <span>{saveToast}</span> </div> </div> )}

      {/* Header Bar - Clean White with Colorful Highlights */} <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm"> <div className="flex items-center gap-3"> <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400"> <ShieldCheck className="w-5 h-5" /> </div> <div> <div className="flex items-center gap-2"> <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100"> Cấu Hình Phân Quyền Truy Cập </h1> <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 text-[11px] font-medium border border-indigo-200 dark:border-indigo-800"> RBAC & Data Scope </span> </div> <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5"> Cài đặt chi tiết phạm vi dữ liệu và quyền hạn truy cập theo từng chức danh </p> </div> </div> <div className="flex items-center gap-2 flex-wrap"> <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
          > <Plus className="w-4 h-4" /> + Tạo Chức Danh </button> <button
            onClick={handleSaveMatrix}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          > <Save className="w-4 h-4" /> Lưu Cấu Hình </button> </div> </div> {/* MAIN 2-COLUMN MASTER-DETAIL LAYOUT */} <div className="grid grid-cols-1 lg:grid-cols-12 gap-6"> {/* LEFT COLUMN: MASTER ROLE SELECTOR (4/12 COLS) */} <div className="lg:col-span-4 space-y-4"> <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm space-y-3"> <div className="flex items-center justify-between"> <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5"> <Layers className="w-4 h-4 text-indigo-600" /> Danh Sách Chức Danh ({roleMatrix.length}) </h3> </div> {/* Search Filter */} <div className="relative"> <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /> <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm chức danh..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              /> </div> {/* Rank Level Quick Pills */} <div className="flex items-center gap-1 overflow-x-auto touch-scroll sleek-scrollbar pb-1 text-[11px] font-medium"> <button
                onClick={() => setSelectedRankFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg shrink-0 ${
                  selectedRankFilter === 'ALL' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              > Tất Cả </button> <button
                onClick={() => setSelectedRankFilter(1)}
                className={`px-2.5 py-1 rounded-lg shrink-0 ${
                  selectedRankFilter === 1 ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700'
                }`}
              > Cấp 1 </button> <button
                onClick={() => setSelectedRankFilter(2)}
                className={`px-2.5 py-1 rounded-lg shrink-0 ${
                  selectedRankFilter === 2 ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700'
                }`}
              > Cấp 2 </button> <button
                onClick={() => setSelectedRankFilter(3)}
                className={`px-2.5 py-1 rounded-lg shrink-0 ${
                  selectedRankFilter === 3 ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700'
                }`}
              > Cấp 3 </button> </div> {/* Role Master Card List */} <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 sleek-scrollbar"> {filteredRoles.map((rm) => {
                const isSelected = rm.role === selectedRoleKey;
                const grantedCount = rm.permissions.length;
                return ( <div
                    key={rm.role}
                    onClick={() => setSelectedRoleKey(rm.role)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-blue-50 text-slate-900 border-blue-300 shadow-md ring-2 ring-blue-500/20'
                        : 'bg-slate-50/70 hover:bg-white text-slate-900 border-slate-200/80 shadow-xs'
                    }`}
                  > <div className="flex items-center justify-between gap-2"> <div className="flex items-center gap-2"> <span className={`font-medium text-xs ${isSelected ? 'text-blue-700' : 'text-slate-900'}`}> {rm.role_name} </span> </div> <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} /> </div> <div className="flex items-center justify-between text-[10px]"> {renderRankBadge(rm.rank_level)} <span className={`font-mono font-medium ${isSelected ? 'text-blue-700' : 'text-slate-500'}`}> {grantedCount}/12 quyền </span> </div> {rm.hrm_position_name && ( <p className={`text-[10px] font-mono flex items-center gap-1 ${isSelected ? 'text-purple-700' : 'text-purple-600'}`}> <Briefcase className="w-3 h-3" /> HRM: {rm.hrm_position_name} </p> )} </div> );
              })} </div> </div> </div> {/* RIGHT COLUMN: DETAIL PERMISSION SETTINGS FOR SELECTED ROLE (8/12 COLS) */} <div className="lg:col-span-8 space-y-5"> {selectedRoleObj ? ( <> {/* Selected Role Banner Header */} <div className="gg-hero p-6 rounded-xl shadow-sm space-y-4"> <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"> <div> <div className="flex items-center gap-2.5"> <h2 className="text-lg font-semibold text-slate-900">{selectedRoleObj.role_name}</h2> {renderRankBadge(selectedRoleObj.rank_level)} </div> <p className="text-xs text-slate-500 mt-1 max-w-xl"> {selectedRoleObj.description} </p> </div> {selectedRoleObj.role !== 'SUPER_ADMIN' && ( <div className="flex items-center gap-2 shrink-0"> <button
                        onClick={() => handleToggleAllPermissionsForRole(true)}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-medium transition-all"
                      > Bật Tất Cả Quyền </button> <button
                        onClick={() => handleToggleAllPermissionsForRole(false)}
                        className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-[11px] font-medium transition-all"
                      > Tắt Tất Cả </button> </div> )} </div> {/* Data Scope Config Dropdown */} <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"> <div className="flex items-center gap-2 text-xs font-medium text-amber-600"> <Database className="w-4 h-4" /> <span>Phạm Vi Dữ Liệu Được Phép Truy Cập (Data Scope):</span> </div> {selectedRoleObj.role === 'SUPER_ADMIN' ? ( <span className="px-3 py-1 bg-red-50 text-red-700 font-mono text-xs font-medium rounded-lg border border-red-200"> 🔴 Toàn Công Ty (Super Admin Default) </span> ) : ( <select
                      value={selectedRoleObj.data_scope}
                      onChange={(e) => handleDataScopeChange(e.target.value as DataScopeBoundary)}
                      className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-900 font-mono text-xs font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    > <option value="ALL_COMPANY">🔴 Toàn Công Ty (ALL_COMPANY)</option> <option value="DEPARTMENT">🔵 Trong Phòng Ban (DEPARTMENT)</option> <option value="TEAM">🟢 Trong Đội Nhóm (TEAM)</option> <option value="OWNER_ONLY">🟡 Chỉ Cá Nhân Được Gán (OWNER_ONLY)</option> </select> )} </div> </div> {/* Categorized Permissions List */} <div className="space-y-4"> {permissionCategories.map((cat) => {
                  const CatIcon = cat.icon;
                  return ( <div key={cat.category} className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden p-5 space-y-3"> <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2.5"> <CatIcon className={`w-4 h-4 ${cat.color}`} /> <span>{cat.category}</span> </h4> <div className="grid grid-cols-1 md:grid-cols-2 gap-3"> {cat.items.map((perm) => {
                          const isGranted = selectedRoleObj.permissions.includes(perm.key);
                          const isSuperAdmin = selectedRoleObj.role === 'SUPER_ADMIN';

                          return ( <div
                              key={perm.key}
                              onClick={() => !isSuperAdmin && handleTogglePermission(perm.key)}
                              className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                                isSuperAdmin
                                  ? 'bg-slate-50 border-slate-200 opacity-90 cursor-not-allowed'
                                  : isGranted
                                  ? 'bg-emerald-50/60 border-emerald-200 hover:bg-emerald-50 cursor-pointer'
                                  : 'bg-slate-50/50 border-slate-200/80 hover:bg-slate-100/80 cursor-pointer'
                              }`}
                            > <div className="space-y-1"> <div className="flex items-center gap-2"> <span className="font-medium text-xs text-slate-900">{perm.name}</span> <span className="text-[10px] font-mono font-medium text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded"> {perm.key} </span> </div> <p className="text-[11px] text-slate-500 leading-snug">{perm.description}</p> </div> {/* Sleek Toggle Button */} <button
                                type="button"
                                disabled={isSuperAdmin}
                                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 mt-0.5 ${
                                  isGranted ? 'bg-emerald-600' : 'bg-slate-300'
                                }`}
                              > <span
                                  className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                                    isGranted ? 'left-6' : 'left-1'
                                  }`}
                                /> </button> </div> );
                        })} </div> </div> );
                })} </div> </> ) : ( <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-3 text-slate-500"> <Shield className="w-8 h-8 text-slate-400 mx-auto" /> <p className="text-xs font-semibold">Vui lòng chọn một chức danh ở danh sách bên trái để cấu hình quyền hạn.</p> </div> )} </div> </div> {/* CREATE CUSTOM ROLE / JOB TITLE MODAL */}
      {isCreateModalOpen && ( <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"> <div className="bg-white rounded-xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 space-y-5 animate-in fade-in zoom-in-95 duration-150 my-8"> <div className="flex items-center justify-between border-b border-slate-100 pb-4"> <div className="flex items-center gap-2.5"> <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100"> <Plus className="w-5 h-5" /> </div> <div> <h3 className="font-semibold text-base text-slate-900">Tạo Chức Danh / Chức Vụ Mới</h3> <p className="text-xs text-slate-500">Khai báo chức danh và phân quyền tự động</p> </div> </div> <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              > <X className="w-5 h-5" /> </button> </div> <form onSubmit={handleCreateCustomRole} className="space-y-4 text-xs"> {/* Quick Select from HRM Position List */} <div> <label className="block font-medium text-slate-700 mb-1"> Chọn Nhanh Chức Danh Từ Hệ Thống HRM: </label> <select
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
                > <option value="">-- Chọn vị trí đã có trong hồ sơ HRM --</option> {hrmPositionsList.map((pos) => ( <option key={pos} value={pos}> 💼 {pos} </option> ))} </select> </div> {/* Title Name */} <div> <label className="block font-medium text-slate-700 mb-1"> Tên Chức Danh / Chức Vụ <span className="text-red-500">*</span>: </label> <input
                  type="text"
                  required
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="VD: Trưởng Phòng Marketing, Chuyên Viên Vận Hành Ops..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                /> </div> {/* Description */} <div> <label className="block font-medium text-slate-700 mb-1">Mô Tả Nhiệm Vụ / Trách Nhiệm:</label> <textarea
                  rows={2}
                  value={newRoleDescription}
                  onChange={(e) => setNewRoleDescription(e.target.value)}
                  placeholder="Mô tả phạm vi trách nhiệm của chức danh này..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                /> </div> {/* Rank Level & Data Scope Selection Grid */} <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> <div> <label className="block font-medium text-slate-700 mb-1">Phân Cấp Chức Vụ (Rank Level):</label> <select
                    value={newRankLevel}
                    onChange={(e) => setNewRankLevel(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  > <option value={1}>🔴 Cấp 1: Ban Giám Đốc (Executive)</option> <option value={2}>🔵 Cấp 2: Quản Lý & Trưởng Phòng (Management)</option> <option value={3}>🟢 Cấp 3: Chuyên Viên Thực Thao (Operational)</option> <option value={4}>🟡 Cấp 4: Nhân Sự Mới & Thử Việc (Entry)</option> </select> </div> <div> <label className="block font-medium text-slate-700 mb-1">Phạm Vi Dữ Liệu Ban Đầu (Data Scope):</label> <select
                    value={newDataScope}
                    onChange={(e) => setNewDataScope(e.target.value as DataScopeBoundary)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  > <option value="ALL_COMPANY">🔴 Toàn Công Ty (ALL_COMPANY)</option> <option value="DEPARTMENT">🔵 Phòng Ban (DEPARTMENT)</option> <option value="TEAM">🟢 Đội Nhóm (TEAM)</option> <option value="OWNER_ONLY">🟡 Chỉ Cá Nhân Được Phân Công</option> </select> </div> </div> {/* Footer Actions */} <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5"> <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                > Hủy Bỏ </button> <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                > <Plus className="w-4 h-4" /> Tạo Chức Danh </button> </div> </form> </div> </div> )} </div> );
}
