import {
  PerformanceScorecard,
  RatingGrade,
  FormulaWeights,
  EvaluationCriterion,
  SelfWorkItem,
  CustomCriterionScore,
  ScorecardStatus
} from '@/types';
import { getEmployees } from './hrmStore';
import { getKPIs } from './kpiStore';

export const PERFORMANCE_UPDATED_EVENT = 'ggbg_performance_updated_event';

export const DEFAULT_FORMULA_WEIGHTS: FormulaWeights = {
  kpi_weight: 40,
  compliance_weight: 20,
  teamwork_weight: 15,
  csat_weight: 15,
  behavior_weight: 10,
  grade_s_threshold: 90, // >= 90 điểm (Hạng S / A+ Xuất sắc)
  grade_a_threshold: 80, // >= 80 điểm (Hạng A Hoàn thành tốt)
  grade_b_threshold: 70, // >= 70 điểm (Hạng B Khá / Đạt)
  grade_c_threshold: 60, // >= 60 điểm (Hạng C Trung bình)
  grade_s_p3_multiplier: 1.2, // 120% Lương P3
  grade_a_p3_multiplier: 1.0, // 100% Lương P3
  grade_b_p3_multiplier: 0.85, // 85% Lương P3
  grade_c_p3_multiplier: 0.50, // 50% Lương P3
  grade_d_p3_multiplier: 0.00, // 0% Lương P3
};

export const DEFAULT_HR_CRITERIA: EvaluationCriterion[] = [
  {
    id: 'crit_1',
    code: 'CRIT_KPI',
    name: '🎯 Kết Quả Chỉ Tiêu KPI & Doanh Số',
    assessor_role: 'DIRECT_MANAGER',
    weight: 40,
    description: 'Tự động đồng bộ từ Module Quản lý KPIs & Đánh giá của Quản lý trực tiếp',
  },
  {
    id: 'crit_2',
    code: 'CRIT_COMPLIANCE',
    name: '📋 Tuân Thủ Nội Quy & Chuyên Cần',
    assessor_role: 'HR',
    weight: 20,
    description: 'Đánh giá tỷ lệ đi làm đúng giờ, tuân thủ quy trình CRM & nội quy công ty',
  },
  {
    id: 'crit_3',
    code: 'CRIT_TEAMWORK',
    name: '👥 Phối Hợp Đội Nhóm & Hỗ Trợ',
    assessor_role: 'INDIRECT_MANAGER',
    weight: 15,
    description: 'Đánh giá khả năng giao tiếp, làm việc nhóm & tương tác giữa các bộ phận',
  },
  {
    id: 'crit_4',
    code: 'CRIT_CSAT',
    name: '⭐ Chất Lượng Dịch Vụ & CSAT',
    assessor_role: 'DIRECT_MANAGER',
    weight: 15,
    description: 'Đánh giá mức độ hài lòng khách hàng & tỷ lệ giải quyết khiếu nại',
  },
  {
    id: 'crit_5',
    code: 'CRIT_BEHAVIOR',
    name: '💡 Thái Độ, Động Lực & Tăng Trưởng',
    assessor_role: 'HR',
    weight: 10,
    description: 'Đánh giá tinh thần cầu tiến, tự học & đóng góp cải tiến quy trình',
  },
];

export const INITIAL_SCORECARDS: PerformanceScorecard[] = [
  {
    id: 's1',
    employee_id: 'e1',
    employee_name: 'Trần Văn Hoàng',
    employee_code: 'NV-00101',
    department: 'Phòng Kinh Doanh 1',
    position: 'Trưởng Nhóm Sale',
    period: 'Tháng 07/2026',
    kpi_score: 9.8,
    compliance_score: 9.5,
    teamwork_score: 9.0,
    csat_score: 9.5,
    behavior_score: 9.0,
    bonus_score: 5,
    penalty_score: 0,
    final_score: 98.5,
    achievement_percentage: 124.0,
    rating_grade: 'S',
    status: 'FINAL_LOCKED',
    base_p3_salary: 6000000,
    calculated_p3_salary: 7200000, // 120% P3
    p3_multiplier: 1.2,
    auto_synced_kpis: true,
    direct_manager_name: 'Nguyễn Tiến Vinh (Giám Đốc Sale)',
    hr_evaluator_name: 'Đặng Kim Anh (HR Manager)',
    reviewer_notes: 'Trưởng nhóm xuất sắc chốt vượt 124% KPI doanh số',
    created_at: '2026-07-01',
    self_work_items: [
      {
        id: 'w1',
        work_title: 'Chốt 3 hợp đồng vận hành TikTok Shop Mall lớn',
        result_summary: 'Doanh số chốt 620M (Vượt 124% target 500M)',
        proof_note: 'Hợp đồng HD-2026-0789',
        self_score: 10,
        manager_score: 9.8,
      },
    ],
  },
  {
    id: 's2',
    employee_id: 'e2',
    employee_name: 'Lê Thị Mai',
    employee_code: 'NV-00102',
    department: 'Phòng CSKH',
    position: 'Chuyên Viên CSKH',
    period: 'Tháng 07/2026',
    kpi_score: 8.5,
    compliance_score: 9.0,
    teamwork_score: 8.5,
    csat_score: 9.2,
    behavior_score: 8.5,
    bonus_score: 0,
    penalty_score: 0,
    final_score: 87.2,
    achievement_percentage: 88.0,
    rating_grade: 'A',
    status: 'REVIEWING_HR',
    base_p3_salary: 4000000,
    calculated_p3_salary: 4000000, // 100% P3
    p3_multiplier: 1.0,
    auto_synced_kpis: true,
    direct_manager_name: 'Phạm Minh Đức (Trưởng Phòng CSKH)',
    reviewer_notes: 'Phân tích & giải quyết 150 cuộc gọi CSKH chất lượng cao',
    created_at: '2026-07-01',
    self_work_items: [
      {
        id: 'w2',
        work_title: 'Tư vấn hotline CSKH và xử lý ticket tồn đọng',
        result_summary: 'Xử lý 150 cuộc gọi tư vấn Shopee Mall',
        self_score: 9,
        manager_score: 8.5,
      },
    ],
  },
  {
    id: 's3',
    employee_id: 'e4',
    employee_name: 'Nguyễn Quốc Tuấn',
    employee_code: 'NV-00104',
    department: 'Phòng Vận Hành TMĐT',
    position: 'Chuyên Viên Vận Hành',
    period: 'Tháng 07/2026',
    kpi_score: 7.2,
    compliance_score: 8.0,
    teamwork_score: 7.5,
    csat_score: 7.0,
    behavior_score: 7.5,
    bonus_score: 0,
    penalty_score: 2,
    final_score: 73.0,
    achievement_percentage: 75.0,
    rating_grade: 'B',
    status: 'SUBMITTED_MANAGER',
    base_p3_salary: 3500000,
    calculated_p3_salary: 2975000, // 85% P3
    p3_multiplier: 0.85,
    auto_synced_kpis: true,
    direct_manager_name: 'Trần Thanh Nam (Trưởng Phòng Vận Hành)',
    reviewer_notes: 'Cần cải thiện tỷ lệ phản hồi ticket SLA tồn',
    created_at: '2026-07-01',
  },
  {
    id: 's4',
    employee_id: 'e3',
    employee_name: 'Đặng Kim Anh',
    employee_code: 'NV-00103',
    department: 'Phòng Nhân Sự (HR)',
    position: 'Trưởng Phòng HR',
    period: 'Tháng 07/2026',
    kpi_score: 9.6,
    compliance_score: 9.8,
    teamwork_score: 9.5,
    csat_score: 9.6,
    behavior_score: 9.5,
    bonus_score: 3,
    penalty_score: 0,
    final_score: 97.6,
    achievement_percentage: 105.0,
    rating_grade: 'S',
    status: 'FINAL_LOCKED',
    base_p3_salary: 5000000,
    calculated_p3_salary: 6000000, // 120% P3
    p3_multiplier: 1.2,
    auto_synced_kpis: true,
    direct_manager_name: 'Ban Giám Đốc (CEO)',
    reviewer_notes: 'Tuyển dụng nhân sự & rà soát tiêu chí đánh giá xuất sắc',
    created_at: '2026-07-01',
  },
];

const STORAGE_KEY = 'ggbg_performance_scorecards_v2';
const WEIGHTS_KEY = 'ggbg_performance_weights_v2';
const CRITERIA_KEY = 'ggbg_performance_hr_criteria_v2';

function loadScorecards(): PerformanceScorecard[] {
  if (typeof window === 'undefined') return INITIAL_SCORECARDS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SCORECARDS));
      return INITIAL_SCORECARDS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading scorecards from localStorage:', e);
    return INITIAL_SCORECARDS;
  }
}

function saveScorecards(data: PerformanceScorecard[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event(PERFORMANCE_UPDATED_EVENT));
  } catch (e) {
    console.error('Error saving scorecards:', e);
  }
}

export function getFormulaWeights(): FormulaWeights {
  if (typeof window === 'undefined') return DEFAULT_FORMULA_WEIGHTS;
  try {
    const raw = localStorage.getItem(WEIGHTS_KEY);
    if (!raw) return DEFAULT_FORMULA_WEIGHTS;
    return { ...DEFAULT_FORMULA_WEIGHTS, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_FORMULA_WEIGHTS;
  }
}

export function updateFormulaWeights(newWeights: Partial<FormulaWeights>): FormulaWeights {
  const current = getFormulaWeights();
  const updated = { ...current, ...newWeights };
  if (typeof window !== 'undefined') {
    localStorage.setItem(WEIGHTS_KEY, JSON.stringify(updated));
  }

  // Recalculate all scorecards with new weights
  const currentScorecards = loadScorecards();
  const recalculated = currentScorecards.map((sc) => recalculateScorecard(sc, updated));
  saveScorecards(recalculated);

  return updated;
}

export function getHrCriteria(): EvaluationCriterion[] {
  if (typeof window === 'undefined') return DEFAULT_HR_CRITERIA;
  try {
    const raw = localStorage.getItem(CRITERIA_KEY);
    if (!raw) {
      localStorage.setItem(CRITERIA_KEY, JSON.stringify(DEFAULT_HR_CRITERIA));
      return DEFAULT_HR_CRITERIA;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_HR_CRITERIA;
  }
}

export function saveHrCriteria(criteria: EvaluationCriterion[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CRITERIA_KEY, JSON.stringify(criteria));
  window.dispatchEvent(new Event(PERFORMANCE_UPDATED_EVENT));
}

export function calculateFinalScore(
  kpiScore: number,
  complianceScore: number,
  teamworkScore: number = 8.5,
  csatScore: number = 8.5,
  bonusScore: number = 0,
  penaltyScore: number = 0,
  weights: FormulaWeights = getFormulaWeights()
): number {
  const kpiWeight = weights.kpi_weight ?? 40;
  const compWeight = weights.compliance_weight ?? 20;
  const twWeight = weights.teamwork_weight ?? 15;
  const csatWeight = weights.csat_weight ?? 15;
  const behWeight = weights.behavior_weight ?? 10;

  const weightedSum =
    kpiScore * (kpiWeight / 10) +
    complianceScore * (compWeight / 10) +
    teamworkScore * (twWeight / 10) +
    csatScore * (csatWeight / 10);

  const total = weightedSum + bonusScore - penaltyScore;
  return Math.max(0, Math.min(100.0, Math.round(total * 10) / 10));
}

export function classifyRatingGrade(
  finalScore: number = 0,
  weights: FormulaWeights = getFormulaWeights()
): RatingGrade {
  if (finalScore >= weights.grade_s_threshold) return 'S';
  if (finalScore >= weights.grade_a_threshold) return 'A';
  if (finalScore >= weights.grade_b_threshold) return 'B';
  if (finalScore >= weights.grade_c_threshold) return 'C';
  return 'D';
}

export function calculateP3Salary(
  baseP3Salary: number = 4000000,
  ratingGrade: RatingGrade = 'A',
  weights: FormulaWeights = getFormulaWeights()
): { calculatedP3: number; multiplier: number } {
  let multiplier = 1.0;
  switch (ratingGrade) {
    case 'S':
      multiplier = weights.grade_s_p3_multiplier ?? 1.2;
      break;
    case 'A':
      multiplier = weights.grade_a_p3_multiplier ?? 1.0;
      break;
    case 'B':
      multiplier = weights.grade_b_p3_multiplier ?? 0.85;
      break;
    case 'C':
      multiplier = weights.grade_c_p3_multiplier ?? 0.50;
      break;
    case 'D':
      multiplier = weights.grade_d_p3_multiplier ?? 0.00;
      break;
  }

  const calculatedP3 = Math.round(baseP3Salary * multiplier);
  return { calculatedP3, multiplier };
}

export function recalculateScorecard(
  sc: PerformanceScorecard,
  weights: FormulaWeights = getFormulaWeights()
): PerformanceScorecard {
  const final_score = calculateFinalScore(
    sc.kpi_score,
    sc.compliance_score,
    sc.teamwork_score || 8.5,
    sc.csat_score || 8.5,
    sc.bonus_score,
    sc.penalty_score,
    weights
  );

  const rating_grade = classifyRatingGrade(final_score, weights);
  const baseP3 = sc.base_p3_salary || 4000000;
  const { calculatedP3, multiplier } = calculateP3Salary(baseP3, rating_grade, weights);

  return {
    ...sc,
    final_score,
    rating_grade,
    base_p3_salary: baseP3,
    calculated_p3_salary: calculatedP3,
    p3_multiplier: multiplier,
  };
}

export function getScorecards(): PerformanceScorecard[] {
  return loadScorecards();
}

export function getScorecardsByPeriod(period: string = 'Tháng 07/2026'): PerformanceScorecard[] {
  const list = loadScorecards();
  return list.filter((s) => s.period === period);
}

export function createScorecard(
  newItem: Omit<PerformanceScorecard, 'id' | 'final_score' | 'rating_grade' | 'created_at'>
): PerformanceScorecard {
  const currentList = loadScorecards();
  const weights = getFormulaWeights();

  const temp: PerformanceScorecard = {
    ...newItem,
    id: `sc_${Date.now()}`,
    final_score: 0,
    rating_grade: 'A',
    status: newItem.status || 'DRAFT_SELF',
    base_p3_salary: newItem.base_p3_salary || 4000000,
    created_at: new Date().toISOString().split('T')[0],
  };

  const created = recalculateScorecard(temp, weights);
  const updatedList = [created, ...currentList];
  saveScorecards(updatedList);
  return created;
}

export function updateScorecard(id: string, updates: Partial<PerformanceScorecard>): PerformanceScorecard {
  const currentList = loadScorecards();
  const weights = getFormulaWeights();
  let updatedObj: PerformanceScorecard | undefined;

  const updatedList = currentList.map((sc) => {
    if (sc.id === id) {
      const merged = { ...sc, ...updates };
      updatedObj = recalculateScorecard(merged, weights);
      return updatedObj;
    }
    return sc;
  });

  if (!updatedObj) throw new Error('Scorecard not found');
  saveScorecards(updatedList);
  return updatedObj;
}

export function deleteScorecard(id: string): void {
  const currentList = loadScorecards();
  const updatedList = currentList.filter((sc) => sc.id !== id);
  saveScorecards(updatedList);
}

/**
 * Sync employee KPIs from /kpis store into Performance Scorecard
 */
export function syncEmployeeKpisToScorecard(employeeName: string, period: string): number {
  const allKpis = getKPIs();
  const matched = allKpis.filter(
    (k) => (k.assignee_name.toLowerCase().includes(employeeName.toLowerCase()) || k.period === period)
  );

  if (matched.length === 0) return 8.5; // default fallback score 8.5 / 10

  const avgPct = matched.reduce((acc, curr) => acc + (curr.progress_percentage || 0), 0) / matched.length;
  // Convert 100% -> 10.0 score, 120% -> 10.0 score, 80% -> 8.0 score
  const score = Math.min(10.0, Math.max(0.0, Math.round((avgPct / 10) * 10) / 10));
  return score;
}

/**
 * Automate Monthly Scorecard Initialization on Day 1 (Ngày 01 Hàng Tháng)
 */
export function autoOpenMonthlyEvaluationScorecards(period: string): PerformanceScorecard[] {
  const employees = getEmployees();
  const currentList = loadScorecards();
  const weights = getFormulaWeights();

  const newScorecards: PerformanceScorecard[] = [];

  employees.forEach((emp) => {
    const exists = currentList.find((sc) => sc.employee_id === emp.id && sc.period === period);
    if (!exists) {
      const kpiScore = syncEmployeeKpisToScorecard(emp.full_name, period);
      const newSc: PerformanceScorecard = recalculateScorecard({
        id: `sc_auto_${emp.id}_${Date.now()}`,
        employee_id: emp.id,
        employee_name: emp.full_name,
        employee_code: emp.employee_code,
        department: emp.department || 'Phòng Kinh Doanh 1',
        position: emp.position || 'Chuyên Viên',
        period,
        kpi_score: kpiScore,
        compliance_score: 9.0,
        teamwork_score: 8.5,
        csat_score: 8.5,
        behavior_score: 8.5,
        bonus_score: 0,
        penalty_score: 0,
        final_score: 0,
        rating_grade: 'A',
        status: 'DRAFT_SELF', // Open for self-assessment on day 1
        base_p3_salary: 4000000,
        auto_synced_kpis: true,
        reviewer_notes: `Tự động mở bảng chấm điểm ngày 01 tháng ${period}`,
        created_at: new Date().toISOString().split('T')[0],
      }, weights);

      newScorecards.push(newSc);
    }
  });

  if (newScorecards.length > 0) {
    const updatedList = [...newScorecards, ...currentList];
    saveScorecards(updatedList);
    return updatedList.filter((s) => s.period === period);
  }

  return currentList.filter((s) => s.period === period);
}

/**
 * Transition Workflow: Transfer to Direct Manager on Day 01 of next month
 */
export function transitionPeriodToManager(period: string): PerformanceScorecard[] {
  const currentList = loadScorecards();
  const updatedList = currentList.map((sc) => {
    if (sc.period === period && (sc.status === 'DRAFT_SELF' || sc.status === 'Draft')) {
      return {
        ...sc,
        status: 'SUBMITTED_MANAGER' as ScorecardStatus,
        reviewer_notes: `${sc.reviewer_notes || ''} [Hệ thống tự động khóa phần tự đánh giá ngày 01 & chuyển Quản lý trực tiếp]`,
      };
    }
    return sc;
  });

  saveScorecards(updatedList);
  return updatedList.filter((s) => s.period === period);
}

/**
 * Transition Workflow: Transfer to HR for Final Assessment
 */
export function transitionPeriodToHr(period: string): PerformanceScorecard[] {
  const currentList = loadScorecards();
  const updatedList = currentList.map((sc) => {
    if (sc.period === period && (sc.status === 'SUBMITTED_MANAGER' || sc.status === 'Submitted')) {
      return {
        ...sc,
        status: 'REVIEWING_HR' as ScorecardStatus,
        reviewer_notes: `${sc.reviewer_notes || ''} [Quản lý đã hoàn thành chấm điểm, chuyển HR tổng hợp & rà soát nội quy]`,
      };
    }
    return sc;
  });

  saveScorecards(updatedList);
  return updatedList.filter((s) => s.period === period);
}

export function finalizePeriodScorecards(period: string): PerformanceScorecard[] {
  const currentList = loadScorecards();
  const weights = getFormulaWeights();

  const updatedList = currentList.map((sc) => {
    if (sc.period === period && sc.status !== 'FINAL_LOCKED' && sc.status !== 'Locked') {
      const recalculated = recalculateScorecard({
        ...sc,
        status: 'FINAL_LOCKED' as ScorecardStatus,
        reviewer_notes: `${sc.reviewer_notes || ''} [HR đã chốt bảng điểm & tính lương hiệu suất P3]`,
      }, weights);
      return recalculated;
    }
    return sc;
  });

  saveScorecards(updatedList);
  return updatedList.filter((s) => s.period === period);
}

export function runAutomatedBatchEvaluation(period: string): PerformanceScorecard[] {
  return finalizePeriodScorecards(period);
}
