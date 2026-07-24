import { PerformanceScorecard, RatingGrade, FormulaWeights } from '@/types';
import { getEmployees } from './hrmStore';
import { getKPIs } from './kpiStore';

export const DEFAULT_FORMULA_WEIGHTS: FormulaWeights = {
  kpi_weight: 50,
  compliance_weight: 20,
  teamwork_weight: 15,
  csat_weight: 15,
  behavior_weight: 15,
  grade_s_threshold: 90, // >= 90 điểm (A+ Xuất sắc)
  grade_a_threshold: 80, // >= 80 điểm (A Giỏi)
  grade_b_threshold: 70, // >= 70 điểm (B Khá)
  grade_c_threshold: 60, // >= 60 điểm (C Trung bình)
};

export const INITIAL_SCORECARDS: PerformanceScorecard[] = [
  // Tháng 07/2026 (Chính thức)
  {
    id: 's1',
    employee_id: 'e1',
    employee_name: 'Trần Văn Hoàng',
    employee_code: 'NV-00101',
    department: 'Phòng Kinh Doanh 1',
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
    status: 'Approved',
    reviewer_notes: 'Trưởng nhóm Sale xuất sắc đạt danh hiệu A+ Xuất sắc',
    created_at: '2026-07-20',
  },
  {
    id: 's2',
    employee_id: 'e2',
    employee_name: 'Lê Thị Mai',
    employee_code: 'NV-00102',
    department: 'Phòng Kinh Doanh 2',
    period: 'Tháng 07/2026',
    kpi_score: 8.8,
    compliance_score: 9.0,
    teamwork_score: 8.5,
    csat_score: 8.5,
    behavior_score: 8.5,
    bonus_score: 0,
    penalty_score: 0,
    final_score: 87.5,
    achievement_percentage: 88.0,
    rating_grade: 'A',
    status: 'Approved',
    reviewer_notes: 'Hoàn thành tốt nhiệm vụ chăm sóc Lead đạt danh hiệu A Giỏi',
    created_at: '2026-07-20',
  },
  {
    id: 's3',
    employee_id: 'e4',
    employee_name: 'Nguyễn Quốc Tuấn',
    employee_code: 'NV-00104',
    department: 'Phòng Vận Hành TMĐT',
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
    status: 'Submitted',
    reviewer_notes: 'Cần nâng cao tỷ lệ phản hồi ticket SLA đạt danh hiệu B Khá',
    created_at: '2026-07-21',
  },
  {
    id: 's4',
    employee_id: 'e3',
    employee_name: 'Đặng Kim Anh',
    employee_code: 'NV-00103',
    department: 'Phòng Nhân Sự (HR)',
    period: 'Tháng 07/2026',
    kpi_score: 9.5,
    compliance_score: 9.8,
    teamwork_score: 9.5,
    csat_score: 9.6,
    behavior_score: 9.5,
    bonus_score: 3,
    penalty_score: 0,
    final_score: 97.5,
    achievement_percentage: 105.0,
    rating_grade: 'S',
    status: 'Approved',
    reviewer_notes: 'Tổ chức tuyển dụng & quản lý hợp đồng xuất sắc A+ Xuất sắc',
    created_at: '2026-07-21',
  },

  // Historical Month: Tháng 06/2026 (Lưu trữ)
  {
    id: 's_hist_1',
    employee_id: 'e1',
    employee_name: 'Trần Văn Hoàng',
    employee_code: 'NV-00101',
    department: 'Phòng Kinh Doanh 1',
    period: 'Tháng 06/2026',
    kpi_score: 9.5,
    compliance_score: 9.0,
    teamwork_score: 9.0,
    csat_score: 9.0,
    behavior_score: 9.0,
    bonus_score: 2,
    penalty_score: 0,
    final_score: 94.5,
    achievement_percentage: 115.0,
    rating_grade: 'S',
    status: 'Approved',
    reviewer_notes: 'Đã tổng hợp gửi HR ngày 05/06/2026',
    created_at: '2026-06-05',
  },
  {
    id: 's_hist_2',
    employee_id: 'e2',
    employee_name: 'Lê Thị Mai',
    employee_code: 'NV-00102',
    department: 'Phòng Kinh Doanh 2',
    period: 'Tháng 06/2026',
    kpi_score: 8.2,
    compliance_score: 8.5,
    teamwork_score: 8.0,
    csat_score: 8.0,
    behavior_score: 8.0,
    bonus_score: 0,
    penalty_score: 0,
    final_score: 82.0,
    achievement_percentage: 82.0,
    rating_grade: 'A',
    status: 'Approved',
    reviewer_notes: 'Đã tổng hợp gửi HR ngày 05/06/2026',
    created_at: '2026-06-05',
  },

  // Historical Month: Tháng 05/2026 (Lưu trữ)
  {
    id: 's_hist_3',
    employee_id: 'e1',
    employee_name: 'Trần Văn Hoàng',
    employee_code: 'NV-00101',
    department: 'Phòng Kinh Doanh 1',
    period: 'Tháng 05/2026',
    kpi_score: 9.0,
    compliance_score: 8.8,
    teamwork_score: 8.5,
    csat_score: 9.0,
    behavior_score: 8.8,
    bonus_score: 0,
    penalty_score: 0,
    final_score: 89.1,
    achievement_percentage: 105.0,
    rating_grade: 'A',
    status: 'Approved',
    reviewer_notes: 'Đã tổng hợp gửi HR ngày 04/05/2026',
    created_at: '2026-05-04',
  },
];

let scorecards = [...INITIAL_SCORECARDS];
let formulaWeights: FormulaWeights = { ...DEFAULT_FORMULA_WEIGHTS };

export function getFormulaWeights(): FormulaWeights {
  return formulaWeights;
}

export function updateFormulaWeights(newWeights: Partial<FormulaWeights>): FormulaWeights {
  formulaWeights = { ...formulaWeights, ...newWeights };
  scorecards = scorecards.map((sc) => recalculateScorecard(sc));
  return formulaWeights;
}

export function calculateFinalScore(
  kpiScore: number,
  complianceScore: number,
  teamworkScore: number = 8.5,
  csatScore: number = 8.5,
  bonusScore: number = 0,
  penaltyScore: number = 0,
  weights: FormulaWeights = formulaWeights
): number {
  const twWeight = weights.teamwork_weight ?? 15;
  const csatWeight = weights.csat_weight ?? 15;

  const weightedSum =
    kpiScore * (weights.kpi_weight / 10) +
    complianceScore * (weights.compliance_weight / 10) +
    teamworkScore * (twWeight / 10) +
    csatScore * (csatWeight / 10);

  const total = weightedSum + bonusScore - penaltyScore;
  return Math.max(0, Math.min(100.0, Math.round(total * 10) / 10));
}

export function classifyRatingGrade(
  finalScore: number = 0,
  weights: FormulaWeights = formulaWeights
): RatingGrade {
  if (finalScore >= weights.grade_s_threshold) return 'S';
  if (finalScore >= weights.grade_a_threshold) return 'A';
  if (finalScore >= weights.grade_b_threshold) return 'B';
  if (finalScore >= weights.grade_c_threshold) return 'C';
  return 'D';
}

export function recalculateScorecard(sc: PerformanceScorecard): PerformanceScorecard {
  const final_score = calculateFinalScore(
    sc.kpi_score,
    sc.compliance_score,
    sc.teamwork_score || 8.5,
    sc.csat_score || 8.5,
    sc.bonus_score,
    sc.penalty_score
  );
  const rating_grade = classifyRatingGrade(final_score);

  return {
    ...sc,
    final_score,
    rating_grade,
  };
}

export function getScorecards(): PerformanceScorecard[] {
  return scorecards;
}

export function getScorecardsByPeriod(period: string = 'Tháng 07/2026'): PerformanceScorecard[] {
  const periodScorecards = scorecards.filter((sc) => sc.period === period);

  if (periodScorecards.length > 0) {
    return periodScorecards;
  }

  // If no scores exist for requested current period, generate PROVISIONAL scorecards auto-synced from KPIs
  const employees = getEmployees();
  const kpis = getKPIs();

  return employees.map((emp) => {
    const indvKpi = kpis.find(
      (k) => k.assignee_type === 'Individual' && (k.assignee_name.includes(emp.full_name) || k.assignee_name.includes(emp.employee_code))
    );
    const deptKpi = kpis.find((k) => k.assignee_type === 'Department' && k.assignee_name.includes(emp.department));

    const activeKpi = indvKpi || deptKpi;
    const achievementPct = activeKpi ? activeKpi.progress_percentage : 80.0;

    const kpiScore = Math.min(10.0, Math.round((achievementPct / 10) * 10) / 10);
    const complianceScore = 8.5;
    const teamworkScore = 8.5;
    const csatScore = 8.5;
    const bonusScore = achievementPct >= 110 ? 5 : 0;
    const penaltyScore = 0;

    const final_score = calculateFinalScore(kpiScore, complianceScore, teamworkScore, csatScore, bonusScore, penaltyScore);
    const rating_grade = classifyRatingGrade(final_score);

    return {
      id: `prov_${period}_${emp.id}`,
      employee_id: emp.id,
      employee_name: emp.full_name,
      employee_code: emp.employee_code,
      department: emp.department,
      period: `${period} (Tạm Tính KPI Auto-Sync)`,
      kpi_score: kpiScore,
      compliance_score: complianceScore,
      teamwork_score: teamworkScore,
      csat_score: csatScore,
      behavior_score: 8.5,
      bonus_score: bonusScore,
      penalty_score: penaltyScore,
      final_score,
      achievement_percentage: achievementPct,
      rating_grade,
      status: 'Draft',
      reviewer_notes: `⚠️ Điểm TẠM TÍNH thời gian thực tự động đồng bộ từ chỉ số KPIs (${achievementPct}%)`,
      created_at: new Date().toISOString().split('T')[0],
    };
  });
}

export function createScorecard(
  newSc: Omit<PerformanceScorecard, 'id' | 'final_score' | 'rating_grade' | 'created_at'>
): PerformanceScorecard {
  const final_score = calculateFinalScore(
    newSc.kpi_score,
    newSc.compliance_score,
    newSc.teamwork_score || 8.5,
    newSc.csat_score || 8.5,
    newSc.bonus_score,
    newSc.penalty_score
  );
  const rating_grade = classifyRatingGrade(final_score);

  const created: PerformanceScorecard = {
    ...newSc,
    final_score,
    rating_grade,
    id: `s_${Date.now()}`,
    created_at: new Date().toISOString().split('T')[0],
  };

  scorecards = [created, ...scorecards];
  return created;
}

export function updateScorecard(id: string, updates: Partial<PerformanceScorecard>): PerformanceScorecard {
  scorecards = scorecards.map((sc) => {
    if (sc.id === id) {
      const merged = { ...sc, ...updates };
      return recalculateScorecard(merged);
    }
    return sc;
  });

  const updated = scorecards.find((sc) => sc.id === id);
  if (!updated) throw new Error('Scorecard not found');
  return updated;
}

export function deleteScorecard(id: string): void {
  scorecards = scorecards.filter((sc) => sc.id !== id);
}

export function runAutomatedBatchEvaluation(period: string = 'Tháng 07/2026'): PerformanceScorecard[] {
  const employees = getEmployees();
  const kpis = getKPIs();

  employees.forEach((emp) => {
    const indvKpi = kpis.find(
      (k) => k.assignee_type === 'Individual' && (k.assignee_name.includes(emp.full_name) || k.assignee_name.includes(emp.employee_code))
    );
    const deptKpi = kpis.find((k) => k.assignee_type === 'Department' && k.assignee_name.includes(emp.department));

    const activeKpi = indvKpi || deptKpi;
    const achievementPct = activeKpi ? activeKpi.progress_percentage : 85.0;

    const kpiScore = Math.min(10.0, Math.round((achievementPct / 10) * 10) / 10);
    const complianceScore = 9.0;
    const teamworkScore = 8.5;
    const csatScore = 8.5;
    const bonusScore = achievementPct >= 110 ? 5 : 0;
    const penaltyScore = 0;

    const existingIndex = scorecards.findIndex((s) => s.employee_code === emp.employee_code && s.period === period);

    const final_score = calculateFinalScore(kpiScore, complianceScore, teamworkScore, csatScore, bonusScore, penaltyScore);
    const rating_grade = classifyRatingGrade(final_score);

    if (existingIndex >= 0) {
      scorecards[existingIndex] = {
        ...scorecards[existingIndex],
        kpi_score: kpiScore,
        compliance_score: complianceScore,
        teamwork_score: teamworkScore,
        csat_score: csatScore,
        behavior_score: 8.5,
        bonus_score: bonusScore,
        penalty_score: penaltyScore,
        final_score,
        achievement_percentage: achievementPct,
        rating_grade,
        status: 'Approved',
      };
    } else {
      scorecards.push({
        id: `s_auto_${Date.now()}_${emp.id}`,
        employee_id: emp.id,
        employee_name: emp.full_name,
        employee_code: emp.employee_code,
        department: emp.department,
        period,
        kpi_score: kpiScore,
        compliance_score: complianceScore,
        teamwork_score: teamworkScore,
        csat_score: csatScore,
        behavior_score: 8.5,
        bonus_score: bonusScore,
        penalty_score: penaltyScore,
        final_score,
        achievement_percentage: achievementPct,
        rating_grade,
        status: 'Approved',
        reviewer_notes: `Tự động chấm điểm từ kết quả KPI (${achievementPct}%)`,
        created_at: new Date().toISOString().split('T')[0],
      });
    }
  });

  return scorecards;
}
