'use client';

import React, { useState } from 'react';
import {
  UserPlus,
  User,
  Briefcase,
  Layers,
  Wallet,
  Calendar,
  CreditCard,
  Building2,
  CheckCircle2,
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Plus,
  Trash2,
  ShieldCheck,
  MapPin,
  Clock
} from 'lucide-react';
import { Candidate, EmployeeProfile, EmployeeAllowanceItem, AllowanceCatalogItem, SalaryGradeScale } from '@/types';
import {
  getSalaryGrades,
  getAllowanceCatalog,
  getWorkShifts,
  convertCandidateToEmployee
} from '@/lib/hrmStore';
import { formatCurrency } from '@/lib/formatters';
import VietnamAddressPicker from '@/components/common/VietnamAddressPicker';

interface CandidateOnboardingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate | null;
  onSuccess: (newEmp: EmployeeProfile) => void;
}

export default function CandidateOnboardingWizardModal({
  isOpen,
  onClose,
  candidate,
  onSuccess,
}: CandidateOnboardingWizardModalProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const salaryGrades = getSalaryGrades();
  const allowanceCatalog = getAllowanceCatalog();
  const workShifts = getWorkShifts();

  // Form State initialized from Candidate
  const [fullName, setFullName] = useState(candidate?.full_name || candidate?.name || '');
  const [email, setEmail] = useState(candidate?.email || '');
  const [phone, setPhone] = useState(candidate?.phone || '');
  const [gender, setGender] = useState<'Nam' | 'Nữ' | 'Khác'>('Nam');
  const [dateOfBirth, setDateOfBirth] = useState('1998-05-15');
  const [idCardNumber, setIdCardNumber] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');

  // Step 2: Org & Contract
  const [department, setDepartment] = useState(candidate?.department || 'Phòng Kinh Doanh 1');
  const [position, setPosition] = useState(candidate?.position_applied || candidate?.position || 'Chuyên Viên Tư Vấn TMĐT');
  const [contractType, setContractType] = useState('Thử việc');
  const [joinedDate, setJoinedDate] = useState(new Date().toISOString().split('T')[0]);

  // Step 3: Salary Grade & Step & Allowances
  const [salaryGradeId, setSalaryGradeId] = useState('sg_g4');
  const [salaryStepNumber, setSalaryStepNumber] = useState(1);

  const selectedGrade = salaryGrades.find((g) => g.id === salaryGradeId) || salaryGrades[0];
  const selectedStep = selectedGrade?.steps.find((s) => s.step_number === salaryStepNumber) || selectedGrade?.steps[0];

  const [baseSalary, setBaseSalary] = useState<number>(selectedStep?.base_salary || candidate?.expected_salary || 18000000);
  const [insuranceSalary, setInsuranceSalary] = useState<number>(selectedStep?.insurance_salary || 11000000);
  const [dependentCount, setDependentCount] = useState<number>(0);

  const [selectedAllowances, setSelectedAllowances] = useState<EmployeeAllowanceItem[]>([
    { id: 'al_1', allowance_type_id: 'al_1', name: 'Phụ Cấp Ăn Trưa', amount: 730000, taxable: false, tax_exempt_cap: 730000, include_in_insurance: false },
    { id: 'al_2', allowance_type_id: 'al_2', name: 'Phụ Cấp Xăng Xe & Đi Lại', amount: 500000, taxable: false, include_in_insurance: false },
  ]);

  // Step 4: Shift & Bank
  const [defaultShiftId, setDefaultShiftId] = useState(workShifts[0]?.id || 'shift_office');
  const [bankAccountHolder, setBankAccountHolder] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankName, setBankName] = useState('Techcombank');
  const [bankBranch, setBankBranch] = useState('Chi nhánh Hà Nội');

  if (!isOpen || !candidate) return null;

  const handleSelectGrade = (gradeId: string) => {
    setSalaryGradeId(gradeId);
    const gr = salaryGrades.find((g) => g.id === gradeId);
    if (gr && gr.steps.length > 0) {
      const step = gr.steps[0];
      setSalaryStepNumber(step.step_number);
      setBaseSalary(step.base_salary);
      setInsuranceSalary(step.insurance_salary);
    }
  };

  const handleSelectStep = (stepNum: number) => {
    setSalaryStepNumber(stepNum);
    const step = selectedGrade?.steps.find((s) => s.step_number === stepNum);
    if (step) {
      setBaseSalary(step.base_salary);
      setInsuranceSalary(step.insurance_salary);
    }
  };

  const handleAddAllowance = (item: AllowanceCatalogItem) => {
    if (selectedAllowances.some((a) => a.allowance_type_id === item.id)) return;
    setSelectedAllowances([
      ...selectedAllowances,
      {
        id: `al_${Date.now()}`,
        allowance_type_id: item.id,
        name: item.name,
        amount: item.default_amount,
        taxable: item.is_taxable_pit,
        include_in_insurance: item.is_social_insurance,
        tax_exempt_cap: item.tax_exempt_cap,
        insurance_exempt_cap: item.insurance_exempt_cap,
      },
    ]);
  };

  const handleRemoveAllowance = (id: string) => {
    setSelectedAllowances(selectedAllowances.filter((a) => a.id !== id));
  };

  const handleSubmitOnboarding = (e: React.FormEvent) => {
    e.preventDefault();

    const customData: Partial<EmployeeProfile> = {
      full_name: fullName,
      email,
      phone,
      gender,
      date_of_birth: dateOfBirth,
      id_card_number: idCardNumber,
      permanent_address: permanentAddress,
      current_address: currentAddress,
      department,
      position,
      joined_date: joinedDate,
      contract_type: contractType as any,
      contract_start_date: joinedDate,
      salary_grade: selectedGrade?.code || 'G4',
      salary_grade_id: salaryGradeId,
      salary_step_number: salaryStepNumber,
      base_salary: Number(baseSalary),
      probation_salary: contractType === 'Thử việc' ? Math.round(Number(baseSalary) * 0.85) : Number(baseSalary),
      insurance_salary: Number(insuranceSalary),
      dependent_count: Number(dependentCount),
      allowances: selectedAllowances,
      default_shift_id: defaultShiftId,
      bank_account: bankAccount,
      bank_name: bankName,
      status: contractType === 'Thử việc' ? 'Probation' : 'Active',
      bhxh_status: contractType === 'Thử việc' ? 'Chưa tham gia' : 'Đang tham gia',
    };

    const newEmp = convertCandidateToEmployee(candidate.id, customData);
    if (newEmp) {
      onSuccess(newEmp);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-800 w-full max-w-4xl rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-slate-900 dark:text-white flex items-center gap-2">
                Tiếp Nhận Ứng Viên & Khởi Tạo Hồ Sơ Nhân Viên Mới
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Ứng viên: <strong className="text-blue-700 dark:text-blue-400">{candidate.full_name || candidate.name}</strong> ({candidate.position_applied || candidate.position})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-white dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Step Navigation */}
        <div className="grid grid-cols-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/40 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`p-3 text-center border-r border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-2 ${
              currentStep === 1
                ? 'bg-white dark:bg-slate-800 text-blue-600 border-b-2 border-b-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] flex items-center justify-center font-bold">1</span>
            <span>Cá Nhân & CCCD</span>
          </button>
          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            className={`p-3 text-center border-r border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-2 ${
              currentStep === 2
                ? 'bg-white dark:bg-slate-800 text-blue-600 border-b-2 border-b-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-[10px] flex items-center justify-center font-bold">2</span>
            <span>Vị Trí & Hợp Đồng</span>
          </button>
          <button
            type="button"
            onClick={() => setCurrentStep(3)}
            className={`p-3 text-center border-r border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-2 ${
              currentStep === 3
                ? 'bg-white dark:bg-slate-800 text-blue-600 border-b-2 border-b-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] flex items-center justify-center font-bold">3</span>
            <span>Ngạch Bậc & Phụ Cấp</span>
          </button>
          <button
            type="button"
            onClick={() => setCurrentStep(4)}
            className={`p-3 text-center transition-colors flex items-center justify-center gap-2 ${
              currentStep === 4
                ? 'bg-white dark:bg-slate-800 text-blue-600 border-b-2 border-b-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[10px] flex items-center justify-center font-bold">4</span>
            <span>Ca & Ngân Hàng</span>
          </button>
        </div>

        {/* Wizard Body Form */}
        <form onSubmit={handleSubmitOnboarding} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* STEP 1: THÔNG TIN CÁ NHÂN & LIÊN HỆ */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-900 dark:text-blue-200 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Thông tin cá nhân được trích xuất tự động từ hồ sơ ứng viên và CV. Vui lòng xác thực và bổ sung CCCD.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Họ Và Tên *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Email Công Ty / Cá Nhân *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Số Điện Thoại Liên Hệ *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Giới Tính</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Ngày Sinh (YYYY-MM-DD)</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Số Căn Cước / CCCD *</label>
                  <input
                    type="text"
                    required
                    placeholder="001098001234"
                    value={idCardNumber}
                    onChange={(e) => setIdCardNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-semibold text-blue-700"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <VietnamAddressPicker
                  label="🏠 Hộ Khẩu Thường Trú (HKTT)"
                  value={{ detailAddress: permanentAddress }}
                  onChange={(a) => setPermanentAddress(a.fullAddress)}
                />
                <VietnamAddressPicker
                  label="📍 Địa Chỉ Nơi Ở Hiện Tại"
                  value={{ detailAddress: currentAddress }}
                  onChange={(a) => setCurrentAddress(a.fullAddress)}
                />
              </div>
            </div>
          )}

          {/* STEP 2: PHÒNG BAN & HỢP ĐỒNG */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3 bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-xl text-purple-900 dark:text-purple-200 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Thiết lập phòng ban phụ trách, chức danh công việc và loại hợp đồng lao động ban đầu.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Phòng Ban Tiếp Nhận *</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                  >
                    <option value="Phòng Kinh Doanh 1">Phòng Kinh Doanh 1</option>
                    <option value="Phòng Kinh Doanh 2">Phòng Kinh Doanh 2</option>
                    <option value="Phòng Marketing">Phòng Marketing</option>
                    <option value="Phòng Vận Hành TMĐT">Phòng Vận Hành TMĐT</option>
                    <option value="Phòng CSKH">Phòng CSKH</option>
                    <option value="Phòng Nhân Sự (HR)">Phòng Nhân Sự (HR)</option>
                    <option value="Ban Giám Đốc">Ban Giám Đốc</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Chức Danh Công Việc *</label>
                  <input
                    type="text"
                    required
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Loại Hợp Đồng Khởi Đầu</label>
                  <select
                    value={contractType}
                    onChange={(e) => setContractType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                  >
                    <option value="Thử việc">Hợp Đồng Thử Việc (60 ngày / 85% Lương)</option>
                    <option value="Chính thức">Hợp Đồng Lao Động Xác Định Thời Hạn (12 Tháng)</option>
                    <option value="Không xác định">Hợp Đồng Không Xác Định Thời Hạn</option>
                    <option value="Cộng tác viên">Hợp Đồng Cộng Tác Viên (CTV/Dự Án)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Ngày Bắt Đầu Làm Việc</label>
                  <input
                    type="date"
                    value={joinedDate}
                    onChange={(e) => setJoinedDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: NGẠCH BẬC LƯƠNG & PHỤ CẤP */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Chọn Ngạch Lương & Bậc Lương chuẩn doanh nghiệp. Hệ thống tự động tính mức lương P1 và nền đóng BHXH.</span>
              </div>

              <div className="p-3.5 bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Ngạch Lương Áp Dụng *</label>
                    <select
                      value={salaryGradeId}
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
                    <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Bậc Lương Xếp Hạng *</label>
                    <select
                      value={salaryStepNumber}
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-blue-200/60 dark:border-blue-900/60">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Lương Vị Trí P1 (VNĐ/tháng)</label>
                    <input
                      type="number"
                      step={500000}
                      value={baseSalary}
                      onChange={(e) => setBaseSalary(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-semibold text-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Lương Căn Cứ Đóng BHXH</label>
                    <input
                      type="number"
                      step={500000}
                      value={insuranceSalary}
                      onChange={(e) => setInsuranceSalary(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-medium text-purple-700"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Số Người Phụ Thuộc (Tax)</label>
                    <input
                      type="number"
                      min={0}
                      value={dependentCount}
                      onChange={(e) => setDependentCount(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Allowances */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Wallet className="w-4 h-4 text-amber-600" /> Các Khoản Phụ Cấp Được Hưởng:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {allowanceCatalog.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleAddAllowance(cat)}
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
                        <span className="font-mono font-semibold text-emerald-600">{formatCurrency(a.amount)}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAllowance(a.id)}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: CA LÀM VIỆC & NGÂN HÀNG */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-900 dark:text-amber-200 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Gán ca làm việc tiêu chuẩn và thông tin tài khoản ngân hàng nhận lương.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Ca Làm Việc Tiêu Chuẩn</label>
                  <select
                    value={defaultShiftId}
                    onChange={(e) => setDefaultShiftId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                  >
                    {workShifts.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.start_time} - {s.end_time})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Tên Chủ Tài Khoản *</label>
                  <input
                    type="text"
                    placeholder="VD: NGUYEN VAN A"
                    value={bankAccountHolder || fullName.toUpperCase()}
                    onChange={(e) => setBankAccountHolder(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold uppercase text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Số Tài Khoản (STK) *</label>
                  <input
                    type="text"
                    placeholder="19036789998888"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl tabular-nums font-semibold text-blue-700 dark:text-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Ngân Hàng *</label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                  >
                    <option value="Techcombank">Techcombank</option>
                    <option value="MBBank">MBBank Quân Đội</option>
                    <option value="Vietcombank">Vietcombank</option>
                    <option value="VietinBank">VietinBank</option>
                    <option value="BIDV">BIDV</option>
                    <option value="VPBank">VPBank</option>
                    <option value="ACB">ACB</option>
                    <option value="TPBank">TPBank</option>
                    <option value="Sacombank">Sacombank</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Chi Nhánh</label>
                  <input
                    type="text"
                    placeholder="VD: CN Cầu Giấy, Hà Nội"
                    value={bankBranch}
                    onChange={(e) => setBankBranch(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                  />
                </div>
              </div>

              {/* Summary box */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-semibold text-slate-900 dark:text-white block">Tóm Tắt Hồ Sơ Tiếp Nhận:</span>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                  <p>• Họ tên: <strong className="text-slate-900 dark:text-white">{fullName}</strong></p>
                  <p>• Vị trí: <strong className="text-slate-900 dark:text-white">{position} ({department})</strong></p>
                  <p>• Ngạch / Bậc: <strong className="text-blue-600">{selectedGrade?.code} Bậc {salaryStepNumber}</strong></p>
                  <p>• Lương P1: <strong className="text-emerald-600">{formatCurrency(baseSalary)}</strong></p>
                  <p>• Ngày vào làm: <strong>{joinedDate}</strong></p>
                  <p>• Phụ cấp: <strong>{selectedAllowances.length} khoản ({formatCurrency(selectedAllowances.reduce((s, a) => s + a.amount, 0))})</strong></p>
                </div>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900 -mx-6 -mb-6 mt-4">
            <div>
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((currentStep - 1) as any)}
                  className="px-3.5 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 rounded-xl font-medium flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Quay Lại
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-medium"
                >
                  Hủy
                </button>
              )}
            </div>

            <div>
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((currentStep + 1) as any)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center gap-1 shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                >
                  Tiếp Tục <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" /> Hoàn Tất & Tạo Hồ Sơ HRM
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
