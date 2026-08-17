import { Review360Session, EvaluationCriterion, FeedbackSubmission, ReviewCyclePeriodType } from '@/types';
import { getEmployees } from './hrmStore';

export const DEFAULT_360_CRITERIA: EvaluationCriterion[] = [
  {
    id: 'crit_1',
    code: 'COMPETENCE',
    name: 'Năng Lực Chuyên Môn & Giao Việc',
    category: 'Chuyên Môn',
    description: 'Khả năng hoàn thành nhiệm vụ, giải quyết vấn đề và chất lượng đầu ra công việc.',
    weight: 25,
    max_score: 10,
  },
  {
    id: 'crit_2',
    code: 'TEAMWORK',
    name: 'Kỹ Năng Phối Hợp & Teamwork',
    category: 'Thái Độ',
    description: 'Sự hỗ trợ đồng nghiệp, tinh thần hợp tác liên phòng ban và chia sẻ mục tiêu chung.',
    weight: 20,
    max_score: 10,
  },
  {
    id: 'crit_3',
    code: 'LEADERSHIP',
    name: 'Kỹ Năng Lãnh Đạo & Quản Lý',
    category: 'Quản Lý',
    description: 'Khả năng định hướng, đào tạo cấp dưới, lắng nghe và phân bổ nguồn lực hiệu quả.',
    weight: 20,
    max_score: 10,
  },
  {
    id: 'crit_4',
    code: 'INNOVATION',
    name: 'Đổi Mới, Sáng Tạo & Đóng Góp',
    category: 'Đổi Mới',
    description: 'Đề xuất giải pháp mới, cải tiến quy trình công việc và chủ động nhận thử thách.',
    weight: 20,
    max_score: 10,
  },
  {
    id: 'crit_5',
    code: 'CULTURE',
    name: 'Văn Hóa Công Ty & Độ Tin Cậy',
    category: 'Văn Hóa',
    description: 'Tuân thủ giá trị cốt lõi GGBingo, bảo mật thông tin và trách nhiệm cam kết.',
    weight: 15,
    max_score: 10,
  },
];

export const INITIAL_360_SESSIONS: Review360Session[] = [];

let sessions = [...INITIAL_360_SESSIONS];
let customCriteria = [...DEFAULT_360_CRITERIA];

export function get360Sessions(): Review360Session[] {
  return sessions;
}

export function get360Criteria(): EvaluationCriterion[] {
  return customCriteria;
}

export function update360Criteria(newCriteria: EvaluationCriterion[]): EvaluationCriterion[] {
  customCriteria = [...newCriteria];
  return customCriteria;
}

export function get360SessionsByPeriod(periodName: string): Review360Session[] {
  return sessions.filter((s) => s.period_name === periodName || periodName === 'ALL');
}

export function submit360Feedback(
  sessionId: string,
  submission: Omit<FeedbackSubmission, 'id' | 'submitted_at'>
): Review360Session | undefined {
  const session = sessions.find((s) => s.id === sessionId);
  if (!session) return undefined;

  const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
  const newSub: FeedbackSubmission = {
    ...submission,
    id: `sub_${Date.now()}`,
    submitted_at: now,
  };

  session.submissions = [...session.submissions, newSub];

  // Recalculate perspective averages
  const perspectiveGroups = {
    SELF: session.submissions.filter((s) => s.perspective === 'SELF'),
    MANAGER: session.submissions.filter((s) => s.perspective === 'MANAGER'),
    PEER: session.submissions.filter((s) => s.perspective === 'PEER'),
    SUBORDINATE: session.submissions.filter((s) => s.perspective === 'SUBORDINATE'),
  };

  const calcGroupAvg = (subs: FeedbackSubmission[]) => {
    if (subs.length === 0) return undefined;
    let totalScoreSum = 0;

    subs.forEach((sub) => {
      let subWeightedSum = 0;
      session.criteria_framework.forEach((crit) => {
        const critScore = sub.scores[crit.id] ?? 8.5;
        subWeightedSum += critScore * (crit.weight / 10);
      });
      totalScoreSum += subWeightedSum;
    });

    return Math.round((totalScoreSum / subs.length) * 10) / 10;
  };

  session.self_score = calcGroupAvg(perspectiveGroups.SELF);
  session.manager_score = calcGroupAvg(perspectiveGroups.MANAGER);
  session.peer_score = calcGroupAvg(perspectiveGroups.PEER);
  session.subordinate_score = calcGroupAvg(perspectiveGroups.SUBORDINATE);

  // Overall 360 Weighted Average (0-100)
  const validScores = [session.self_score, session.manager_score, session.peer_score, session.subordinate_score].filter(
    (s): s is number => s !== undefined
  );

  if (validScores.length > 0) {
    const sum = validScores.reduce((acc, v) => acc + v, 0);
    session.overall_360_score = Math.round((sum / validScores.length) * 10) / 10;
  }

  return session;
}

export function create360Session(
  newSession: Partial<Review360Session>
): Review360Session {
  const code = `360-2026/${newSession.period_type || 'QUARTERLY'}-${String(sessions.length + 1).padStart(3, '0')}`;
  const created: Review360Session = {
    id: `r360_${Date.now()}`,
    review_code: code,
    employee_id: newSession.employee_id || `e_${Date.now()}`,
    employee_name: newSession.employee_name || 'Trần Văn Hoàng',
    employee_code: newSession.employee_code || 'NV-00101',
    department: newSession.department || 'Phòng Kinh Doanh 1',
    position: newSession.position || 'Trưởng Nhóm Sale',
    period_type: newSession.period_type || 'QUARTERLY',
    period_name: newSession.period_name || 'Quý 3/2026',
    status: newSession.status || 'IN_PROGRESS',
    overall_360_score: 85.0,
    submissions: [],
    criteria_framework: newSession.criteria_framework || [...customCriteria],
    created_at: new Date().toISOString().split('T')[0],
  };

  sessions = [created, ...sessions];
  return created;
}
