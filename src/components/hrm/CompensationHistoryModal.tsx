'use client';

import React, { useState } from 'react';
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
  Ban
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

interface CompensationHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee?: EmployeeProfile | null;
}

export default function CompensationHistoryModal({ isOpen, onClose, employee }: CompensationHistoryModalProps) {
  const [history, setHistory] = useState<CompensationHistoryRecord[]>(() => getCompensationHistory(employee?.id));
  const [employees] = useState<EmployeeProfile[]>(() => getEmployees());
  const [allowanceCatalog] = useState<AllowanceCatalogItem[]>(() => getAllowanceCatalog());
  const [salaryGrades] = useState(() => getSalaryGrades());

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form State
  const [targetEmpId, setTargetEmpId] = useState(employee?.id || employees[0]?.id || '');
  const [changeType, setChangeType] = useState<CompensationHistoryRecord['change_type']>('PERIODIC_RAISE');
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);

  // Grade & Step state
  const currentEmp = employees.find((e) => e.id === targetEmpId) || employee || employees[0];
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

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
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
      const step = gr.steps[0];
      setTargetStepNumber(step.step_number);
      if (!isManualOverride) {
        setNewBaseSalary(step.base_salary);
        setNewInsuranceSalary(step.insurance_salary);
      }
    }
  };

  const handleSelectStep = (stepNum: number) => {
    setTargetStepNumber(stepNum);
    const step = selectedGrade?.steps.find((s) => s.step_number === stepNum);
    if (step && !isManualOverride) {
      setNewBaseSalary(step.base_salary);
      setNewInsuranceSalary(step.insurance_salary);
    }
  };

  const handleAddAllowanceItem = (catalogItem: AllowanceCatalogItem) => {
    if (selectedAllowances.some((a) => a.allowance_type_id === catalogItem.id)) return;
    setSelectedAllowances([
      ...selectedAllowances,
      {
        id: `al_${Date.now()}`,
        allowance_type_id: catalogItem.id,
        name: catalogItem.name,
        amount: catalogItem.default_amount,
        taxable: catalogItem.is_taxable_pit,
        include_in_insurance: catalogItem.is_social_insurance,
        tax_exempt_cap: catalogItem.tax_exempt_cap,
        insurance_exempt_cap: catalogItem.insurance_exempt_cap,
      },
    ]);
  };

  const handleRemoveAllowanceItem = (allowanceId: string) => {
    setSelectedAllowances(selectedAllowances.filter((a) => a.id !== allowanceId));
  };

  const handleUpdateAllowanceAmount = (allowanceId: string, amount: number) => {
    setSelectedAllowances(
      selectedAllowances.map((a) => (a.id === allowanceId ? { ...a, amount } : a))
    );
  };

  const handleCreateAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEmp) return;

    const previousBase = currentEmp.base_salary || 15000000;
    const previousIns = currentEmp.insurance_salary || 6000000;
    const previousAllowances = currentEmp.allowances || [];

    const newRecord = addCompensationRecord({
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
      out_of_scale_reason: isOutOfScale ? (outOfScaleReason || 'Điều chỉnh vượt khung bậc / vượt hạn thâm niên quy định') : undefined,
      approval_status: isOutOfScale ? 'PENDING_CEO_APPROVAL' : 'APPROVED',
      decision_number: decisionNumber,
      approved_by_name: approverName,
      reason: reason || 'Hoàn thành tốt nhiệm vụ và nâng bậc lương định kỳ theo quy chế',
    });

    setHistory([...getCompensationHistory(employee?.id)]);
    setShowCreateModal(false);
    if (isOutOfScale) {
      showToast(`⚠️ Đã tạo đề xuất nâng lương vượt khung - Đang chờ CEO Phê Duyệt!`);
    } else {
      showToast(`✅ Đã lưu và áp dụng quyết định điều chỉnh lương cho ${currentEmp.full_name}!`);
    }
  };

  const handleApproveByCeo = (recId: string) => {
    const updated = approveCompensationRecordByCeo(recId, 'Nguyễn Văn Tiến (CEO)', 'Đã phê duyệt chấp thuận đặc cách');
    if (updated) {
      setHistory([...getCompensationHistory(employee?.id)]);
      showToast(`👑 CEO đã phê duyệt quyết định điều chỉnh lương thành công!`);
    }
  };

  const handleRejectByCeo = (recId: string) => {
    const reasonPrompt = window.prompt('Nhập lý do từ chối quyết định điều chỉnh lương:', 'Chưa đạt đủ điều kiện thâm niên và đóng góp');
    if (reasonPrompt !== null) {
      rejectCompensationRecordByCeo(recId, reasonPrompt, 'Nguyễn Văn Tiến (CEO)');
      setHistory([...getCompensationHistory(employee?.id)]);
      showToast(`🔴 Đã từ chối quyết định điều chỉnh lương.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 w-full max-w-5xl rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-900/80 dark:to-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-slate-900 dark:text-white flex items-center gap-2">
                Lịch Sử Biến Động Lương, Ngạch Bậc & Phê Duyệt CEO
                {employee && (
                  <span className="px-2.5 py-0.5 bg-emerald-600 text-white rounded-full text-[10px] font-medium">
                    {employee.full_name} ({employee.employee_code}) · {employee.salary_grade || 'G4'} Bậc {employee.salary_step_number || 1}
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Lưu vết toàn diện các mốc nâng ngạch bậc, điều chỉnh phụ cấp, căn cứ pháp lý và cơ chế trình CEO phê duyệt khi vượt khung
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setTargetEmpId(employee?.id || employees[0]?.id || '');
                setShowCreateModal(true);
              }}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" /> + Tạo Quyết Định Nâng Lương / Bậc
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-white dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {history.length > 0 ? (
            <div className="space-y-4">
              {history.map((rec) => (
                <div
                  key={rec.id}
                  className={`p-5 rounded-xl border space-y-3 transition-all ${
                    rec.approval_status === 'PENDING_CEO_APPROVAL'
                      ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
                      : rec.approval_status === 'REJECTED_BY_CEO'
                      ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900'
                      : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-700/80 pb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-medium text-xs rounded-lg">
                        {rec.change_type === 'PERIODIC_RAISE' && 'Nâng Lương Định Kỳ'}
                        {rec.change_type === 'PROBATION_TO_OFFICIAL' && 'Thử Việc ➔ Chính Thức'}
                        {rec.change_type === 'PROMOTION' && 'Thăng Chức / Nâng Ngạch'}
                        {rec.change_type === 'ALLOWANCE_ADJUSTMENT' && 'Điều Chỉnh Phụ Cấp'}
                        {rec.change_type === 'DEMOTION' && 'Giáng Cấp / Giảm Lương'}
                        {rec.change_type === 'SPECIAL_ADJUSTMENT' && 'Điều Chỉnh Đặc Biệt'}
                      </span>

                      {/* Grade step transition badge */}
                      {rec.to_grade_code && (
                        <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-semibold text-xs rounded-lg flex items-center gap-1.5">
                          <span>{rec.from_grade_code || 'G4'} (Bậc {rec.from_step_number || 1})</span>
                          <ArrowRight className="w-3 h-3 text-blue-500" />
                          <span>{rec.to_grade_code} (Bậc {rec.to_step_number})</span>
                        </span>
                      )}

                      <span className="font-mono font-medium text-slate-900 dark:text-white text-xs">
                        Số: {rec.decision_number || 'QĐ-NL/2026'}
                      </span>

                      {/* Approval status badge */}
                      {rec.approval_status === 'PENDING_CEO_APPROVAL' ? (
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200 font-semibold text-[11px] rounded-lg border border-amber-300 flex items-center gap-1">
                          <Crown className="w-3.5 h-3.5 text-amber-600" /> Chờ CEO Phê Duyệt (Vượt Mốc)
                        </span>
                      ) : rec.approval_status === 'REJECTED_BY_CEO' ? (
                        <span className="px-2.5 py-1 bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-semibold text-[11px] rounded-lg border border-rose-200 flex items-center gap-1">
                          <Ban className="w-3.5 h-3.5 text-rose-600" /> CEO Đã Từ Chối
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold text-[11px] rounded-lg flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Đã Phê Duyệt
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500 font-mono flex items-center gap-3">
                      <span>Hiệu lực: <strong className="text-slate-800 dark:text-slate-200">{rec.effective_date}</strong></span>
                      <span>Người đề xuất: <strong className="text-slate-800 dark:text-slate-200">{rec.approved_by_name}</strong></span>
                    </div>
                  </div>

                  {/* Out of scale alert note if any */}
                  {rec.is_out_of_scale && (
                    <div className="p-3 bg-amber-100/70 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl text-xs flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span><strong>Căn cứ đặc cách:</strong> {rec.out_of_scale_reason || 'Điều chỉnh vượt khung bậc hoặc trước thời hạn thâm niên'}</span>
                      </div>
                      {rec.approval_status === 'PENDING_CEO_APPROVAL' && (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleApproveByCeo(rec.id)}
                            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                          >
                            <Crown className="w-3.5 h-3.5" /> Phê Duyệt (CEO)
                          </button>
                          <button
                            onClick={() => handleRejectByCeo(rec.id)}
                            className="px-2.5 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg text-xs font-medium transition-all"
                          >
                            Từ Chối
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Salary and Allowances Diff */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Previous */}
                    <div className="p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-1.5 opacity-80">
                      <span className="text-[10px] font-medium uppercase text-slate-400">Mức Cũ Trước Điều Chỉnh:</span>
                      <p className="font-semibold text-slate-700 dark:text-slate-300 font-mono text-sm">
                        Lương cứng P1: {formatCurrency(rec.previous_base_salary)}
                      </p>
                      {rec.previous_insurance_salary !== undefined && (
                        <p className="text-[11px] text-slate-500 font-mono">
                          Lương đóng BHXH: {formatCurrency(rec.previous_insurance_salary)}
                        </p>
                      )}
                      <div className="pt-1.5 border-t border-slate-100 dark:border-slate-700 text-[11px] text-slate-500">
                        <span className="font-semibold">Phụ cấp cũ ({rec.previous_allowances?.length || 0}):</span>
                        <ul className="list-disc list-inside mt-0.5 text-slate-600 dark:text-slate-400">
                          {rec.previous_allowances?.map((a, i) => (
                            <li key={i}>{a.name}: {formatCurrency(a.amount)}</li>
                          ))}
                          {(!rec.previous_allowances || rec.previous_allowances.length === 0) && <li>Không có</li>}
                        </ul>
                      </div>
                    </div>

                    {/* New */}
                    <div className="p-3.5 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-900/50 space-y-1.5">
                      <span className="text-[10px] font-medium uppercase text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Mức Mới Được Phê Duyệt:
                      </span>
                      <p className="font-semibold text-emerald-700 dark:text-emerald-300 font-mono text-sm">
                        Lương cứng P1: {formatCurrency(rec.new_base_salary)}
                      </p>
                      {rec.new_insurance_salary !== undefined && (
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                          Lương đóng BHXH: {formatCurrency(rec.new_insurance_salary)}
                        </p>
                      )}
                      <div className="pt-1.5 border-t border-emerald-100 dark:border-emerald-900/40 text-[11px]">
                        <span className="font-medium text-emerald-800 dark:text-emerald-300">Phụ cấp mới áp dụng ({rec.new_allowances?.length || 0}):</span>
                        <ul className="list-disc list-inside mt-0.5 text-emerald-700 dark:text-emerald-400 font-medium">
                          {rec.new_allowances?.map((a, i) => (
                            <li key={i}>{a.name}: {formatCurrency(a.amount)}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 pt-1">
                    <p className="italic">
                      <strong>Lý do căn cứ:</strong> {rec.reason}
                    </p>
                    {rec.ceo_approved_by && (
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <Crown className="w-3.5 h-3.5 text-amber-500" /> {rec.ceo_approved_by} ({rec.ceo_approved_at})
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center text-slate-400 text-xs font-medium border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center">
              Chưa có lịch sử điều chỉnh lương nào. Bấm nút <strong>"+ Tạo Quyết Định Nâng Lương / Bậc"</strong> để ghi nhận biến động đầu tiên.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-xl text-xs font-medium"
          >
            Đóng
          </button>
        </div>
      </div>

      {/* CREATE ADJUSTMENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-60 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden max-h-[90vh] flex flex-col">
            <form onSubmit={handleCreateAdjustment} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-600" /> Tạo Quyết Định Nâng Lương, Bậc & Phụ Cấp
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Chọn Nhân Sự Áp Dụng *</label>
                  <select
                    value={targetEmpId}
                    onChange={(e) => {
                      const empId = e.target.value;
                      setTargetEmpId(empId);
                      const emp = employees.find((x) => x.id === empId);
                      if (emp) {
                        setTargetGradeId(emp.salary_grade_id || 'sg_g4');
                        setTargetStepNumber((emp.salary_step_number || 1) + 1);
                        if (emp.allowances) setSelectedAllowances(emp.allowances);
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-800 dark:text-slate-100"
                  >
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.full_name} - {emp.employee_code} ({emp.position}) - Hiện tại: {emp.salary_grade || 'G4'} Bậc {emp.salary_step_number || 1} ({formatCurrency(emp.base_salary || 0)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Loại Biến Động Lương</label>
                    <select
                      value={changeType}
                      onChange={(e) => setChangeType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                    >
                      <option value="PERIODIC_RAISE">Nâng Lương Định Kỳ</option>
                      <option value="PROBATION_TO_OFFICIAL">Hết Thử Việc ➔ Chính Thức</option>
                      <option value="PROMOTION">Thăng Chức / Nâng Ngạch</option>
                      <option value="ALLOWANCE_ADJUSTMENT">Bổ Sung / Điều Chỉnh Phụ Cấp</option>
                      <option value="DEMOTION">Giảm Lương / Giáng Cấp</option>
                      <option value="SPECIAL_ADJUSTMENT">Điều Chỉnh Đặc Biệt (Vượt Khung)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Ngày Bắt Đầu Có Hiệu Lực</label>
                    <input
                      type="date"
                      value={effectiveDate}
                      onChange={(e) => setEffectiveDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium font-mono"
                    />
                  </div>
                </div>

                {/* Pickers for Ngạch Lương & Bậc Lương */}
                <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-1.5 text-xs">
                      <Layers className="w-4 h-4 text-blue-600" /> Chọn Ngạch & Bậc Lương Mới (Theo Cấu Hình)
                    </span>
                    <label className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isManualOverride}
                        onChange={(e) => setIsManualOverride(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>Tùy chỉnh số tiền thủ công</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1 text-[11px]">Ngạch Lương Áp Dụng</label>
                      <select
                        value={targetGradeId}
                        onChange={(e) => handleSelectGrade(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                      >
                        {salaryGrades.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1 text-[11px]">Bậc Lương Đề Xuất</label>
                      <select
                        value={targetStepNumber}
                        onChange={(e) => handleSelectStep(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-blue-700"
                      >
                        {selectedGrade?.steps.map((s) => (
                          <option key={s.step_number} value={s.step_number}>
                            {s.step_name} — {formatCurrency(s.base_salary)} (Hệ số {s.coefficient})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Salay inputs */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Lương Cơ Bản Mới P1 (VND/tháng) *</label>
                    <input
                      type="number"
                      required
                      step={500000}
                      value={newBaseSalary}
                      onChange={(e) => setNewBaseSalary(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-semibold text-emerald-600 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Mức Lương Đóng BHXH Mới (VND)</label>
                    <input
                      type="number"
                      step={500000}
                      value={newInsuranceSalary}
                      onChange={(e) => setNewInsuranceSalary(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-medium text-purple-700"
                    />
                  </div>
                </div>

                {/* Out of scale warning and CEO requirement banner */}
                {isOutOfScale && (
                  <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-semibold">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>⚠️ Cảnh Báo: Điều Chỉnh Vượt Mốc Quy Định (Yêu Cầu CEO Phê Duyệt)</span>
                    </div>
                    <p className="text-amber-800 dark:text-amber-300 text-[11px]">
                      Quyết định này nhảy vượt bậc, vượt khung lương trần hoặc vượt hạn thâm niên tiêu chuẩn. Hệ thống sẽ chuyển trạng thái sang <strong>Chờ CEO Phê Duyệt</strong>. Mức lương mới chỉ chính thức áp dụng sau khi CEO duyệt.
                    </p>
                    <div>
                      <label className="block font-medium text-amber-900 dark:text-amber-200 mb-1">Lý Do Đề Xuất Đặc Cách Trình CEO *</label>
                      <input
                        type="text"
                        required
                        placeholder="VD: Nhân sự xuất sắc vượt chỉ tiêu 200%, nhảy cóc Bậc 3 lên Bậc 5..."
                        value={outOfScaleReason}
                        onChange={(e) => setOutOfScaleReason(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 rounded-xl font-medium text-slate-800 dark:text-slate-100"
                      />
                    </div>
                  </div>
                )}

                {/* Dynamic Allowances Picker */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-700 dark:text-slate-300 font-medium">Danh Mục Phụ Cấp Kèm Theo:</label>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {allowanceCatalog.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleAddAllowanceItem(cat)}
                          className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded text-[10px] font-medium text-slate-700 dark:text-slate-200 transition-colors"
                        >
                          + {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {selectedAllowances.map((a) => (
                      <div
                        key={a.id}
                        className="flex items-center justify-between gap-3 p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700"
                      >
                        <span className="font-medium text-slate-800 dark:text-slate-200 flex-1">{a.name}</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={a.amount}
                            onChange={(e) => handleUpdateAllowanceAmount(a.id, Number(e.target.value))}
                            className="w-32 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-right font-mono font-medium text-xs"
                          />
                          <span className="text-slate-400 text-[10px]">₫/tháng</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveAllowanceItem(a.id)}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Số Quyết Định / Tờ Trình</label>
                    <input
                      type="text"
                      value={decisionNumber}
                      onChange={(e) => setDecisionNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Người Đề Xuất / Ký Duyệt</label>
                    <input
                      type="text"
                      value={approverName}
                      onChange={(e) => setApproverName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Lý Do Điều Chỉnh & Thành Tích Căn Cứ</label>
                  <textarea
                    rows={2}
                    placeholder="VD: Đạt 150% chỉ tiêu KPI quý 2/2026 và đủ thâm niên nâng bậc theo quy định..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3 bg-slate-50 dark:bg-slate-900">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white rounded-xl font-medium text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5 ${
                    isOutOfScale
                      ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/30'
                      : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                  }`}
                >
                  {isOutOfScale ? (
                    <>
                      <Crown className="w-4 h-4" /> Trình CEO Phê Duyệt Đặc Cách
                    </>
                  ) : (
                    'Lưu & Cập Nhật Hồ Sơ Nhân Sự'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
