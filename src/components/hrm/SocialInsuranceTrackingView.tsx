'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Building2,
  Calendar,
  Sparkles,
  Edit3,
  Save,
  X,
  FileText,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { SocialInsuranceProfile, BhxhChangeLogRecord, BhxhParticipationStatus, EmployeeProfile } from '@/types';
import {
  getSocialInsuranceProfiles,
  updateSocialInsuranceProfile,
  getBhxhChangeLogs,
  addBhxhChangeLog,
  getSocialInsuranceConfig,
  getEmployees
} from '@/lib/hrmStore';
import { formatCurrency } from '@/lib/formatters';

const STATUS_BADGES: Record<BhxhParticipationStatus, { label: string; class: string }> = {
  ACTIVE: { label: '🟢 Đang Đóng Đủ', class: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' },
  NOT_ENROLLED: { label: '⚪ Chưa Tham Gia', class: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  SUSPENDED_MATERNITY: { label: '🟣 Tạm Dừng - Thai Sản', class: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300' },
  SUSPENDED_UNPAID_LEAVE: { label: '🟠 Tạm Dừng - Không Lương', class: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' },
  PENDING_INCREASE: { label: '🔵 Đang Báo Tăng', class: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300' },
  PENDING_DECREASE: { label: '🟡 Đang Báo Giảm', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-300' },
  FINALIZED_RETURNED_BOOK: { label: '🔴 Đã Chốt & Trả Sổ', class: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' },
};

export default function SocialInsuranceTrackingView() {
  const [profiles, setProfiles] = useState<SocialInsuranceProfile[]>(() => getSocialInsuranceProfiles());
  const [changeLogs, setChangeLogs] = useState<BhxhChangeLogRecord[]>(() => getBhxhChangeLogs());
  const [config] = useState(() => getSocialInsuranceConfig());
  const [employees] = useState<EmployeeProfile[]>(() => getEmployees());

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [activeSubTab, setActiveSubTab] = useState<'ROSTER' | 'D02_CHANGELOG'>('ROSTER');

  // Edit Modal State
  const [editingProfile, setEditingProfile] = useState<SocialInsuranceProfile | null>(null);
  const [showAddLogModal, setShowAddLogModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Log Form
  const [newLogData, setNewLogData] = useState({
    employee_id: employees[0]?.id || '',
    change_type: 'TĂNG_MỚI' as const,
    new_salary: 12000000,
    note: '',
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredProfiles = profiles.filter((p) => {
    const emp = employees.find((e) => e.id === p.employee_id);
    const empName = emp?.full_name || p.employee_name || '';
    const matchSearch =
      empName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.social_insurance_code?.includes(searchTerm) ||
      p.health_insurance_code?.includes(searchTerm);
    const matchStatus = statusFilter === 'ALL' || p.bhxh_status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalActive = profiles.filter((p) => p.bhxh_status === 'ACTIVE').length;
  const totalMonthlyContribution = profiles
    .filter((p) => p.bhxh_status === 'ACTIVE')
    .reduce((sum, p) => sum + (p.insurance_salary * 0.32), 0); // 10.5% NV + 21.5% DN
  const totalSuspended = profiles.filter((p) => p.bhxh_status.startsWith('SUSPENDED')).length;
  const totalPending = profiles.filter((p) => p.bhxh_status.startsWith('PENDING')).length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile) return;

    updateSocialInsuranceProfile(editingProfile.employee_id, {
      ...editingProfile,
      monthly_employee_deduction: editingProfile.insurance_salary * 0.105,
      monthly_company_contribution: editingProfile.insurance_salary * 0.215,
      trade_union_fee: editingProfile.insurance_salary * 0.02,
    });

    setProfiles([...getSocialInsuranceProfiles()]);
    setEditingProfile(null);
    showToast('Đã cập nhật hồ sơ bảo hiểm xã hội thành công!');
  };

  const handleAddChangeLog = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((e) => e.id === newLogData.employee_id);
    if (!emp) return;

    const created = addBhxhChangeLog({
      period: 'Tháng 08/2026',
      employee_id: emp.id,
      employee_name: emp.full_name,
      social_insurance_code: emp.social_insurance_code || '7910999999',
      change_type: newLogData.change_type,
      new_salary: Number(newLogData.new_salary),
      effective_month: '08/2026',
      status: 'ĐÃ_NỘP_CƠ_QUAN_BHXH',
      submission_date: new Date().toISOString().split('T')[0],
      note: newLogData.note,
    });

    setChangeLogs([...getBhxhChangeLogs()]);
    setShowAddLogModal(false);
    showToast('Đã thêm bản ghi biến động báo tăng/giảm BHXH (Mẫu D02-LT)!');
  };

  return ( <div className="space-y-6"> {/* Toast Notification */}
      {toastMsg && ( <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in"> <Sparkles className="w-4 h-4 text-amber-400" /> <span className="text-sm font-semibold">{toastMsg}</span> </div> )}

      {/* KPI Cards */} <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"> <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3"> <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center font-medium"> <ShieldCheck className="w-6 h-6" /> </div> <div> <span className="text-xs text-slate-500 font-semibold">Đang Tham Gia BHXH</span> <p className="text-xl font-semibold font-mono text-slate-900 dark:text-white mt-0.5">{totalActive} Nhân Sự</p> </div> </div> <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3"> <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 flex items-center justify-center font-medium"> <Building2 className="w-6 h-6" /> </div> <div> <span className="text-xs text-slate-500 font-semibold">Quỹ Trích Nộp BHXH / Tháng</span> <p className="text-xl font-semibold font-mono text-blue-600 dark:text-blue-400 mt-0.5">{formatCurrency(totalMonthlyContribution)}</p> </div> </div> <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3"> <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 flex items-center justify-center font-medium"> <Clock className="w-6 h-6" /> </div> <div> <span className="text-xs text-slate-500 font-semibold">Tạm Dừng (Thai Sản / Nghỉ)</span> <p className="text-xl font-semibold font-mono text-purple-600 dark:text-purple-400 mt-0.5">{totalSuspended} Hồ Sơ</p> </div> </div> <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3"> <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 flex items-center justify-center font-medium"> <FileSpreadsheet className="w-6 h-6" /> </div> <div> <span className="text-xs text-slate-500 font-semibold">Chờ Báo Tăng / Giảm</span> <p className="text-xl font-semibold font-mono text-amber-600 dark:text-amber-400 mt-0.5">{totalPending} Hồ Sơ</p> </div> </div> </div> {/* Controls & Sub-tabs */} <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"> <div className="flex items-center gap-3 flex-1 flex-wrap"> <div className="relative flex-1 min-w-[240px]"> <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /> <input
              type="text"
              placeholder="Tìm theo tên nhân sự, mã sổ BHXH, thẻ BHYT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 font-medium"
            /> </div> <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200"
          > <option value="ALL">Tất Cả Trạng Thái BHXH</option> <option value="ACTIVE">🟢 Đang Đóng Đủ</option> <option value="NOT_ENROLLED">⚪ Chưa Tham Gia</option> <option value="SUSPENDED_MATERNITY">🟣 Tạm Dừng - Thai Sản</option> <option value="SUSPENDED_UNPAID_LEAVE">🟠 Tạm Dừng - Không Lương</option> <option value="PENDING_INCREASE">🔵 Đang Báo Tăng</option> <option value="PENDING_DECREASE">🟡 Đang Báo Giảm</option> <option value="FINALIZED_RETURNED_BOOK">🔴 Đã Chốt & Trả Sổ</option> </select> <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700"> <button
              onClick={() => setActiveSubTab('ROSTER')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeSubTab === 'ROSTER'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            > Sổ Theo Dõi BHXH Nhân Viên </button> <button
              onClick={() => setActiveSubTab('D02_CHANGELOG')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeSubTab === 'D02_CHANGELOG'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            > Biến Động Báo Tăng/Giảm (Mẫu D02-LT) </button> </div> </div> {activeSubTab === 'D02_CHANGELOG' && ( <button
            onClick={() => setShowAddLogModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-medium flex items-center gap-2 shadow-md shadow-emerald-500/20 active:scale-95 transition-all shrink-0"
          > <Plus className="w-4 h-4" /> + Báo Tăng / Giảm Mới (D02-LT) </button> )} </div> {/* SUB-TAB 1: ROSTER VIEW */}
      {activeSubTab === 'ROSTER' && ( <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm"> <div className="overflow-x-auto"> <table className="w-full text-left text-xs"> <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 font-medium border-b border-slate-200 dark:border-slate-700"> <tr> <th className="p-3.5">Nhân Viên</th> <th className="p-3.5">Mã Sổ BHXH & Thẻ BHYT</th> <th className="p-3.5">Bệnh Viện KCB Ban Đầu</th> <th className="p-3.5">Mức Lương Đóng BHXH</th> <th className="p-3.5">Trừ Lương NV (10.5%)</th> <th className="p-3.5">Công Ty Trích (21.5%)</th> <th className="p-3.5">Tình Trạng Tham Gia</th> <th className="p-3.5 text-center">Thao Tác</th> </tr> </thead> <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-medium"> {filteredProfiles.map((p) => {
                  const emp = employees.find((e) => e.id === p.employee_id);
                  const badge = STATUS_BADGES[p.bhxh_status] || STATUS_BADGES.NOT_ENROLLED;

                  return ( <tr key={p.employee_id} className="hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"> <td className="p-3.5"> <div className="font-medium text-slate-900 dark:text-white">{emp?.full_name || p.employee_name}</div> <div className="text-[10px] text-slate-400 font-mono">{emp?.employee_code} · {emp?.department}</div> </td> <td className="p-3.5 font-mono"> <p className="font-medium text-blue-600">BHXH: {p.social_insurance_code || 'Chưa có'}</p> <p className="text-[10px] text-slate-400">BHYT: {p.health_insurance_code || 'Chưa có'}</p> </td> <td className="p-3.5"> <span className="text-slate-700 dark:text-slate-300 font-medium">{p.health_provider || 'Chưa đăng ký'}</span> <div className="text-[10px] text-slate-400 font-mono">Mã: {p.health_provider_code || 'N/A'}</div> </td> <td className="p-3.5 font-mono font-medium text-slate-900 dark:text-white"> {formatCurrency(p.insurance_salary)} </td> <td className="p-3.5 font-mono font-semibold text-rose-600"> {formatCurrency(p.insurance_salary * 0.105)} </td> <td className="p-3.5 font-mono font-semibold text-emerald-600"> {formatCurrency(p.insurance_salary * 0.215)} </td> <td className="p-3.5"> <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${badge.class}`}> {badge.label} </span> </td> <td className="p-3.5 text-center"> <button
                          onClick={() => setEditingProfile(p)}
                          className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-xl font-medium text-[11px] flex items-center gap-1 shadow-sm transition-all mx-auto"
                        > <Edit3 className="w-3.5 h-3.5" /> Sửa BHXH </button> </td> </tr> );
                })} </tbody> </table> </div> </div> )}

      {/* SUB-TAB 2: D02-LT CHANGELOG VIEW */}
      {activeSubTab === 'D02_CHANGELOG' && ( <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm"> <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between"> <h4 className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-2"> <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Bảng Kê Biến Động Lao Động, Tiền Lương Tham Gia BHXH (Mẫu D02-LT) </h4> <span className="text-[11px] text-slate-400 font-mono">Căn cứ Quyết định 595/QĐ-BHXH</span> </div> <div className="overflow-x-auto"> <table className="w-full text-left text-xs"> <thead className="bg-slate-50 dark:bg-slate-900/40 text-slate-500 font-medium border-b border-slate-200 dark:border-slate-700"> <tr> <th className="p-3.5">Kỳ Kê Khai</th> <th className="p-3.5">Họ và Tên Nhân Sự</th> <th className="p-3.5">Mã Số BHXH</th> <th className="p-3.5">Loại Biến Động</th> <th className="p-3.5">Mức Lương Mới</th> <th className="p-3.5">Trạng Thái Hồ Sơ</th> <th className="p-3.5">Ghi Chú Nghiệp Vụ</th> </tr> </thead> <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-medium"> {changeLogs.map((log) => ( <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"> <td className="p-3.5 font-medium font-mono text-slate-700 dark:text-slate-300">{log.period}</td> <td className="p-3.5 font-medium text-slate-900 dark:text-white">{log.employee_name}</td> <td className="p-3.5 font-mono text-blue-600 font-semibold">{log.social_insurance_code}</td> <td className="p-3.5"> <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 rounded text-[10px] font-medium"> {log.change_type} </span> </td> <td className="p-3.5 font-mono font-medium text-emerald-600"> {formatCurrency(log.new_salary)} </td> <td className="p-3.5"> <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-full text-[10px] font-medium"> {log.status} </span> </td> <td className="p-3.5 text-slate-500">{log.note || 'Theo quyết định công ty'}</td> </tr> ))} </tbody> </table> </div> </div> )}

      {/* EDIT PROFILE MODAL */}
      {editingProfile && ( <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"> <div className="bg-white dark:bg-slate-800 w-full max-w-xl rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"> <form onSubmit={handleSaveProfile}> <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900"> <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2"> <ShieldCheck className="w-4 h-4 text-emerald-600" /> Cập Nhật Thông Tin Tham Gia BHXH </h3> <button
                  type="button"
                  onClick={() => setEditingProfile(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl"
                > <X className="w-5 h-5" /> </button> </div> <div className="p-6 space-y-4 text-xs"> <div className="grid grid-cols-2 gap-3"> <div> <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Mã Số Sổ BHXH (10 số)</label> <input
                      type="text"
                      placeholder="VD: 7910928374"
                      value={editingProfile.social_insurance_code || ''}
                      onChange={(e) => setEditingProfile({ ...editingProfile, social_insurance_code: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-medium"
                    /> </div> <div> <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Mã Thẻ BHYT (15 ký tự)</label> <input
                      type="text"
                      placeholder="VD: DN4010928374"
                      value={editingProfile.health_insurance_code || ''}
                      onChange={(e) => setEditingProfile({ ...editingProfile, health_insurance_code: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-medium"
                    /> </div> </div> <div> <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Nơi Khám Chữa Bệnh Ban Đầu (Bệnh Viện / TTYT)</label> <input
                    type="text"
                    placeholder="VD: Bệnh Viện Đa Khoa Y Học Cổ Truyền Hà Nội (01-018)"
                    value={editingProfile.health_provider || ''}
                    onChange={(e) => setEditingProfile({ ...editingProfile, health_provider: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                  /> </div> <div className="grid grid-cols-2 gap-3"> <div> <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Mức Lương Đóng BHXH (VND) *</label> <input
                      type="number"
                      required
                      value={editingProfile.insurance_salary}
                      onChange={(e) => setEditingProfile({ ...editingProfile, insurance_salary: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-medium text-emerald-600"
                    /> </div> <div> <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Tình Trạng Tham Gia BHXH *</label> <select
                      value={editingProfile.bhxh_status}
                      onChange={(e) => setEditingProfile({ ...editingProfile, bhxh_status: e.target.value as BhxhParticipationStatus })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                    > <option value="ACTIVE">🟢 Đang Đóng Đủ</option> <option value="NOT_ENROLLED">⚪ Chưa Tham Gia (Thử việc/CTV)</option> <option value="SUSPENDED_MATERNITY">🟣 Tạm Dừng - Nghỉ Thai Sản</option> <option value="SUSPENDED_UNPAID_LEAVE">🟠 Tạm Dừng - Nghỉ Không Lương</option> <option value="PENDING_INCREASE">🔵 Đang Làm Thủ Tục Báo Tăng</option> <option value="PENDING_DECREASE">🟡 Đang Làm Thủ Tục Báo Giảm</option> <option value="FINALIZED_RETURNED_BOOK">🔴 Đã Chốt Sổ & Trả Sổ BHXH</option> </select> </div> </div> <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900/40 text-[11px] space-y-1"> <div className="flex justify-between"> <span className="text-slate-600 dark:text-slate-300">Trừ vào lương Người Lao Động (10.5%):</span> <strong className="font-mono text-rose-600">{formatCurrency(editingProfile.insurance_salary * 0.105)}</strong> </div> <div className="flex justify-between"> <span className="text-slate-600 dark:text-slate-300">Doanh nghiệp đóng (21.5%):</span> <strong className="font-mono text-emerald-600">{formatCurrency(editingProfile.insurance_salary * 0.215)}</strong> </div> <div className="flex justify-between"> <span className="text-slate-600 dark:text-slate-300">Kinh phí công đoàn (2%):</span> <strong className="font-mono text-blue-600">{formatCurrency(editingProfile.insurance_salary * 0.02)}</strong> </div> </div> </div> <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3 bg-slate-50 dark:bg-slate-900"> <button
                  type="button"
                  onClick={() => setEditingProfile(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium text-xs"
                > Hủy </button> <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
                > Lưu Thay Đổi </button> </div> </form> </div> </div> )}

      {/* ADD D02-LT CHANGELOG MODAL */}
      {showAddLogModal && ( <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"> <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"> <form onSubmit={handleAddChangeLog}> <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900"> <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2"> <Plus className="w-4 h-4 text-emerald-600" /> Kê Khai Biến Động BHXH (Mẫu D02-LT) </h3> <button
                  type="button"
                  onClick={() => setShowAddLogModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl"
                > <X className="w-5 h-5" /> </button> </div> <div className="p-6 space-y-4 text-xs"> <div> <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Chọn Nhân Sự Kê Khai *</label> <select
                    value={newLogData.employee_id}
                    onChange={(e) => setNewLogData({ ...newLogData, employee_id: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                  > {employees.map((emp) => ( <option key={emp.id} value={emp.id}> {emp.full_name} ({emp.employee_code}) - {emp.department} </option> ))} </select> </div> <div className="grid grid-cols-2 gap-3"> <div> <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Loại Biến Động *</label> <select
                      value={newLogData.change_type}
                      onChange={(e) => setNewLogData({ ...newLogData, change_type: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                    > <option value="TĂNG_MỚI">Báo Tăng Mới Lao Động</option> <option value="BÁO_GIẢM">Báo Giảm / Thôi Việc</option> <option value="ĐIỀU_CHỈNH_LƯƠNG">Điều Chỉnh Mức Đóng Lương</option> <option value="THAI_SẢN">Nghỉ Hưởng Chế Độ Thai Sản</option> <option value="NGHỈ_ỐM">Nghỉ Ốm Đau Dài Ngày</option> </select> </div> <div> <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Mức Lương Mới (VND)</label> <input
                      type="number"
                      value={newLogData.new_salary}
                      onChange={(e) => setNewLogData({ ...newLogData, new_salary: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-medium"
                    /> </div> </div> <div> <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Ghi Chú Căn Cứ Nghiệp Vụ</label> <textarea
                    rows={2}
                    placeholder="VD: Ký HĐLĐ chính thức sau 2 tháng thử việc..."
                    value={newLogData.note}
                    onChange={(e) => setNewLogData({ ...newLogData, note: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                  /> </div> </div> <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3 bg-slate-50 dark:bg-slate-900"> <button
                  type="button"
                  onClick={() => setShowAddLogModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium text-xs"
                > Hủy </button> <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
                > Nộp Kê Khai D02-LT </button> </div> </form> </div> </div> )} </div> );
}
