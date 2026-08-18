'use client';

import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Plus,
  Clock,
  Sparkles,
  Award,
  FileText,
  DollarSign,
  X,
  CheckCircle2,
  Trash2,
  Calendar,
  Layers,
  ArrowRight,
  AlertTriangle,
  Crown,
  ShieldCheck,
  Check,
  Ban,
  Search,
  Filter,
  User,
  Building2
} from 'lucide-react';
import { CompensationHistoryRecord, EmployeeProfile, EmployeeAllowanceItem, AllowanceCatalogItem } from '@/types';
import {
  getCompensationHistory,
  addCompensationRecord,
  approveCompensationRecordByCeo,
  rejectCompensationRecordByCeo,
  getEmployees,
  getAllowanceCatalog,
  getSalaryGrades,
  getSalaryStep
} from '@/lib/hrmStore';
import { formatCurrency } from '@/lib/formatters';

export default function CompensationView({ targetEmployee }: { targetEmployee?: EmployeeProfile | null }) {
  React.useEffect(() => {
    const handleUpdate = () => {
      try { setHistory(getCompensationHistory(targetEmployee?.id)); } catch(e){}
      try { set_employees(getEmployees()); } catch(e){}
      try { set_allowanceCatalog(getAllowanceCatalog()); } catch(e){}
      try { set_salaryGrades(getSalaryGrades()); } catch(e){}
    };
    window.addEventListener('hrm-update', handleUpdate);
    return () => window.removeEventListener('hrm-update', handleUpdate);
  }, []);

  const [history, setHistory] = useState<CompensationHistoryRecord[]>(() => getCompensationHistory(targetEmployee?.id));
  const [employees, set_employees] = useState<EmployeeProfile[]>(() => getEmployees());
  const [allowanceCatalog, set_allowanceCatalog] = useState<AllowanceCatalogItem[]>(() => getAllowanceCatalog());
  const [salaryGrades, set_salaryGrades] = useState(() => getSalaryGrades());

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form State
  const [targetEmpId, setTargetEmpId] = useState(targetEmployee?.id || employees[0]?.id || '');
  const [changeType, setChangeType] = useState<CompensationHistoryRecord['change_type']>('PERIODIC_RAISE');
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);

  // Grade & Step state
  const currentEmp = employees.find((e) => e.id === targetEmpId) || targetEmployee || employees[0];
  const [targetGradeId, setTargetGradeId] = useState(currentEmp?.salary_grade_id || 'sg_g4');
  const [targetStepNumber, setTargetStepNumber] = useState<number>(currentEmp?.salary_step_number ? currentEmp.salary_step_number + 1 : 2);

  const selectedGrade = salaryGrades.find((g) => g.id === targetGradeId) || salaryGrades[0];
  const selectedStep = selectedGrade?.steps.find((s) => s.step_number === targetStepNumber) || selectedGrade?.steps[0];

  const [newBaseSalary, setNewBaseSalary] = useState<number>(selectedStep?.base_salary || 22000000);
  const [newInsuranceSalary, setNewInsuranceSalary] = useState<number>(selectedStep?.insurance_salary || 14000000);
  const [isManualOverride, setIsManualOverride] = useState(false);
  const [outOfScaleReason, setOutOfScaleReason] = useState('');

  const [selectedAllowances, setSelectedAllowances] = useState<EmployeeAllowanceItem[]>(
    currentEmp?.allowances && currentEmp.allowances.length > 0
      ? currentEmp.allowances
      : [
          { id: 'al_1', allowance_type_id: 'al_1', name: 'Phụ Cấp Ăn Trưa', amount: 730000, taxable: false, tax_exempt_cap: 730000, include_in_insurance: false },
        ]
  );
  const [decisionNumber, setDecisionNumber] = useState(`QĐ-NL/2026/${String(Math.floor(Math.random() * 90 + 10))}`);
  const [approverName, setApproverName] = useState('Phạm Minh Đức (Giám Đốc)');
  const [reason, setReason] = useState('');

  

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const reloadHistory = () => {
    setHistory([...getCompensationHistory(targetEmployee?.id)]);
  };

  // Check if this adjustment is out of scale / requires CEO approval
  const isOutOfScale: boolean = Boolean(
    isManualOverride ||
    (selectedGrade && selectedStep && newBaseSalary > selectedGrade.steps[selectedGrade.steps.length - 1].base_salary) ||
    changeType === 'SPECIAL_ADJUSTMENT' ||
    (currentEmp?.salary_step_number !== undefined && targetStepNumber > currentEmp.salary_step_number + 1) ||
    (currentEmp?.salary_grade_id && targetGradeId !== currentEmp.salary_grade_id && changeType !== 'PROMOTION')
  );

  const handleSelectGrade = (gradeId: string) => {
    setTargetGradeId(gradeId);
    const gr = salaryGrades.find((g) => g.id === gradeId);
    if (gr && gr.steps.length > 0) {
      const st = gr.steps[0];
      setTargetStepNumber(st.step_number);
      if (!isManualOverride) {
        setNewBaseSalary(st.base_salary);
        setNewInsuranceSalary(st.insurance_salary);
      }
    }
  };

  const handleSelectStep = (stepNum: number) => {
    setTargetStepNumber(stepNum);
    const st = selectedGrade?.steps.find((s) => s.step_number === stepNum);
    if (st && !isManualOverride) {
      setNewBaseSalary(st.base_salary);
      setNewInsuranceSalary(st.insurance_salary);
    }
  };

  const handleCreateAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEmp) return;

    const previousBase = currentEmp.base_salary || 15000000;
    const previousIns = currentEmp.insurance_salary || 6000000;
    const previousAllowances = currentEmp.allowances || [];

    const record = addCompensationRecord({
      employee_id: currentEmp.id,
      employee_name: currentEmp.full_name,
      effective_date: effectiveDate,
      change_type: changeType,
      from_grade_id: currentEmp.salary_grade_id,
      from_grade_code: currentEmp.salary_grade || 'G4',
      from_step_number: currentEmp.salary_step_number || 1,
      to_grade_id: targetGradeId,
      to_grade_code: selectedGrade?.code || 'G4',
      to_step_number: targetStepNumber,
      previous_base_salary: previousBase,
      new_base_salary: Number(newBaseSalary),
      previous_insurance_salary: previousIns,
      new_insurance_salary: Number(newInsuranceSalary),
      previous_allowances: previousAllowances,
      new_allowances: selectedAllowances,
      is_out_of_scale: isOutOfScale,
      out_of_scale_reason: isOutOfScale ? (outOfScaleReason || 'Điều chỉnh vượt khung ngạch lương tiêu chuẩn') : undefined,
      approval_status: isOutOfScale ? 'PENDING_CEO_APPROVAL' : 'APPROVED',
      decision_number: decisionNumber,
      approved_by_name: approverName,
      reason: reason || 'Nâng lương định kỳ theo kết quả đánh giá 3P và thâm niên cống hiến',
    });

    reloadHistory();
    setShowCreateModal(false);
    showToast(
      record.approval_status === 'PENDING_CEO_APPROVAL'
        ? `Đã gửi tờ trình phê duyệt Nâng Lương Vượt Khung lên CEO!`
        : `Đã cập nhật quyết định nâng lương: ${currentEmp.full_name}`
    );
  };

  const handleCeoApprove = (recordId: string) => {
    approveCompensationRecordByCeo(recordId, 'Phạm Minh Đức (CEO / Giám Đốc)', 'Đã phê duyệt quyết định');
    reloadHistory();
    showToast('CEO đã phê duyệt quyết định nâng lương vượt khung thành công!');
  };

  const handleCeoReject = (recordId: string) => {
    rejectCompensationRecordByCeo(recordId, 'CEO từ chối: Chưa đạt tiêu chí đánh giá hiệu suất', 'Phạm Minh Đức (CEO / Giám Đốc)');
    reloadHistory();
    showToast('Đã từ chối quyết định nâng lương.');
  };

  const filteredHistory = useMemo(() => {
    return history.filter((rec) => {
      const matchSearch =
        (rec.employee_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (rec.decision_number || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = filterType === 'ALL' || rec.change_type === filterType;
      const matchStatus = filterStatus === 'ALL' || rec.approval_status === filterStatus;
      return matchSearch && matchType && matchStatus;
    });
  }, [history, searchTerm, filterType, filterStatus]);

  const stats = useMemo(() => {
    const totalRecords = history.length;
    const totalRaiseAmount = history.reduce(
      (s, h) => s + (h.new_base_salary > h.previous_base_salary ? h.new_base_salary - h.previous_base_salary : 0),
      0
    );
    const pendingCeo = history.filter((h) => h.approval_status === 'PENDING_CEO_APPROVAL').length;
    const periodicCount = history.filter((h) => h.change_type === 'PERIODIC_RAISE').length;
    return { totalRecords, totalRaiseAmount, pendingCeo, periodicCount };
  }, [history]);

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Tổng Đợt Điều Chỉnh</span>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{stats.totalRecords} Quyết định</p>
            <span className="text-[11px] text-blue-600 font-medium">Toàn bộ nhân sự</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Tổng Quỹ Lương Tăng</span>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">+{formatCurrency(stats.totalRaiseAmount)}</p>
            <span className="text-[11px] text-emerald-600 font-medium">Chi phí phát sinh / tháng</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Chờ CEO Phê Duyệt</span>
            <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">{stats.pendingCeo} Tờ trình</p>
            <span className="text-[11px] text-amber-600 font-medium">Nâng lương vượt khung 3P</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            <Crown className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Nâng Lương Định Kỳ</span>
            <p className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-1">{stats.periodicCount} Đợt</p>
            <span className="text-[11px] text-purple-600 font-medium">Theo chu kỳ hàng năm</span>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* FILTER & TOP ACTION BAR */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 flex-wrap">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên nhân sự, số quyết định..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            <option value="ALL">Tất Cả Loại Điều Chỉnh</option>
            <option value="PERIODIC_RAISE">Nâng Lương Định Kỳ</option>
            <option value="PROMOTION">Thăng Chức / Bổ Nhiệm</option>
            <option value="SPECIAL_ADJUSTMENT">Điều Chỉnh Đột Xuất / Vượt Khung</option>
            <option value="ALLOWANCE_ADJUSTMENT">Điều Chỉnh Phụ Cấp</option>
            <option value="PROBATION_TO_OFFICIAL">Chuyển Chính Thức</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            <option value="ALL">Tất Cả Trạng Thái Phê Duyệt</option>
            <option value="APPROVED">Đã Phê Duyệt & Có Hiệu Lực</option>
            <option value="PENDING_CEO_APPROVAL">Chờ CEO Phê Duyệt</option>
            <option value="REJECTED_BY_CEO">Bị Từ Chối</option>
          </select>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all self-start md:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tạo Quyết Định Nâng Lương</span>
        </button>
      </div>

      {/* TABLE LIST OF COMPENSATION ADJUSTMENTS */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold uppercase tracking-wider text-[10.5px] border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3.5">Số Quyết Định & Nhân Sự</th>
                <th className="p-3.5">Loại Điều Chỉnh</th>
                <th className="p-3.5">Mức Lương Cũ → Mới</th>
                <th className="p-3.5">Ngạch / Bậc Lương</th>
                <th className="p-3.5">Ngày Hiệu Lực</th>
                <th className="p-3.5">Trạng Thái Phê Duyệt</th>
                <th className="p-3.5 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 italic">
                    Không tìm thấy lịch sử điều chỉnh lương phù hợp.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((rec) => {
                  const diffAmount = (rec.new_base_salary || 0) - (rec.previous_base_salary || 0);
                  const diffPct = rec.previous_base_salary > 0 ? Math.round((diffAmount / rec.previous_base_salary) * 1000) / 10 : 0;

                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5">
                        <div>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs block">
                            {rec.decision_number || 'QĐ-NL/2026/01'}
                          </span>
                          <span className="font-semibold text-slate-900 dark:text-white text-xs">
                            {rec.employee_name || 'Nhân sự'}
                          </span>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {rec.change_type === 'PERIODIC_RAISE'
                            ? 'Nâng Lương Định Kỳ'
                            : rec.change_type === 'PROMOTION'
                            ? 'Thăng Chức / Bổ Nhiệm'
                            : rec.change_type === 'SPECIAL_ADJUSTMENT'
                            ? 'Đột Xuất / Vượt Khung'
                            : rec.change_type === 'ALLOWANCE_ADJUSTMENT'
                            ? 'Điều Chỉnh Phụ Cấp'
                            : 'Chuyển Chính Thức'}
                        </span>
                      </td>

                      <td className="p-3.5 tabular-nums">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-xs">
                            <span className="text-slate-400 line-through">{formatCurrency(rec.previous_base_salary)}</span>
                            <ArrowRight className="w-3 h-3 text-slate-400" />
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(rec.new_base_salary)}</span>
                          </div>
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/60 inline-block">
                            +{formatCurrency(diffAmount)} (+{diffPct}%)
                          </span>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 rounded-lg text-[11px] font-semibold border border-blue-200 dark:border-blue-800">
                          {rec.to_grade_code || 'G4'} · Bậc {rec.to_step_number || 1}
                        </span>
                      </td>

                      <td className="p-3.5 tabular-nums text-slate-600 dark:text-slate-400">
                        {rec.effective_date}
                      </td>

                      <td className="p-3.5">
                        {rec.is_out_of_scale ? (
                          <div className="space-y-1">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border inline-flex items-center gap-1 ${
                                rec.approval_status === 'APPROVED'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : rec.approval_status === 'PENDING_CEO_APPROVAL'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              <Crown className="w-3 h-3" />
                              {rec.approval_status === 'APPROVED'
                                ? 'CEO Đã Duyệt'
                                : rec.approval_status === 'PENDING_CEO_APPROVAL'
                                ? 'Chờ CEO Duyệt'
                                : 'CEO Từ Chối'}
                            </span>
                            <span className="text-[9.5px] text-amber-600 block italic">Vượt khung</span>
                          </div>
                        ) : (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-medium inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Chuẩn Ngạch 3P
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {rec.approval_status === 'PENDING_CEO_APPROVAL' && (
                            <>
                              <button
                                onClick={() => handleCeoApprove(rec.id)}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1"
                                title="CEO Phê duyệt nâng lương"
                              >
                                <Check className="w-3 h-3" />
                                <span>Duyệt</span>
                              </button>
                              <button
                                onClick={() => handleCeoReject(rec.id)}
                                className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg"
                                title="Từ chối"
                              >
                                <Ban className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE ADJUSTMENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-lg p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Tạo Quyết Định Điều Chỉnh / Nâng Lương
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Cập nhật ngạch bậc 3P, mức lương P1 và phụ cấp cho nhân sự.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAdjustment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nhân Sự Áp Dụng *</label>
                <select
                  value={targetEmpId}
                  onChange={(e) => setTargetEmpId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.full_name} ({e.employee_code}) - {e.department} - Lương hiện tại: {formatCurrency(e.base_salary || 15000000)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Loại Điều Chỉnh *</label>
                  <select
                    value={changeType}
                    onChange={(e) => setChangeType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-emerald-700 dark:text-emerald-300 font-bold"
                  >
                    <option value="PERIODIC_RAISE">Nâng Lương Định Kỳ</option>
                    <option value="PROMOTION">Thăng Chức / Bổ Nhiệm</option>
                    <option value="SPECIAL_ADJUSTMENT">Đột Xuất / Vượt Khung</option>
                    <option value="ALLOWANCE_ADJUSTMENT">Điều Chỉnh Phụ Cấp</option>
                    <option value="PROBATION_TO_OFFICIAL">Chuyển Chính Thức</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Ngày Hiệu Lực *</label>
                  <input
                    type="date"
                    required
                    value={effectiveDate}
                    onChange={(e) => setEffectiveDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Ngạch Lương Mới</label>
                  <select
                    value={targetGradeId}
                    onChange={(e) => handleSelectGrade(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                  >
                    {salaryGrades.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.code} - {g.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Bậc Lương Mới</label>
                  <select
                    value={targetStepNumber}
                    onChange={(e) => handleSelectStep(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                  >
                    {selectedGrade?.steps.map((st) => (
                      <option key={st.step_number} value={st.step_number}>
                        Bậc {st.step_number} ({formatCurrency(st.base_salary)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Lương Cơ Bản P1 Mới (VNĐ) *</label>
                <input
                  type="number"
                  step={500000}
                  required
                  value={newBaseSalary}
                  onChange={(e) => setNewBaseSalary(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm text-emerald-600"
                />
              </div>

              {isOutOfScale && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-[11px] text-amber-800 dark:text-amber-300 space-y-1">
                  <span className="font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Cảnh báo vượt khung:
                  </span>
                  <p className="text-slate-600 dark:text-slate-400">
                    Quyết định này vượt khung tiêu chuẩn ngạch bậc và sẽ được tự động chuyển sang trạng thái <strong>Chờ CEO Phê Duyệt</strong>.
                  </p>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Lý Do / Căn Cứ Điều Chỉnh *</label>
                <textarea
                  rows={2}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="VD: Hoàn thành vượt mức 125% chỉ tiêu KPIs quý và đạt chuẩn thâm niên..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-md active:scale-95 transition-all"
                >
                  Lưu & Ban Hành Quyết Định
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
