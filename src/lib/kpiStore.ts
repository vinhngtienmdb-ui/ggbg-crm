import { KPIAssignment } from '@/types';

export const INITIAL_KPIS: KPIAssignment[] = [
  {
    id: 'k1',
    kpi_code: 'KPI-COMP-202607',
    kpi_name: 'Doanh Số Chốt Hợp Đồng Dịch Vụ Vận Hành Shopee/TikTok',
    unit: 'VND',
    assignee_type: 'Company',
    assignee_name: 'Toàn Công Ty GGBingo Group',
    period: 'Tháng 07/2026',
    target_value: 4000000000,
    actual_value: 3480000000,
    progress_percentage: 87.0,
    weight: 100,
    notes: 'Chỉ tiêu tổng doanh số ký mới gói vận hành e-commerce toàn tập đoàn',
    created_at: '2026-07-01',
  },
  {
    id: 'k2',
    kpi_code: 'KPI-DEPT1-202607',
    kpi_name: 'Doanh Số Kinh Doanh Phòng 1',
    unit: 'VND',
    assignee_type: 'Department',
    assignee_name: 'Phòng Kinh Doanh 1',
    period: 'Tháng 07/2026',
    target_value: 1500000000,
    actual_value: 1420000000,
    progress_percentage: 94.7,
    weight: 40,
    notes: 'Phòng 1 phụ trách thị trường Hà Nội & Miền Bắc',
    created_at: '2026-07-01',
  },
  {
    id: 'k3',
    kpi_code: 'KPI-TEAM2-202607',
    kpi_name: 'Số Gian Hàng Mới Trên GGBingoVN Platform',
    unit: 'Gian Hàng',
    assignee_type: 'Team',
    assignee_name: 'Team Merchant Acquisition 2',
    period: 'Tháng 07/2026',
    target_value: 50,
    actual_value: 48,
    progress_percentage: 96.0,
    weight: 25,
    notes: 'Phát triển Merchant VIP đăng ký gian hàng sàn GGBingoVN',
    created_at: '2026-07-01',
  },
  {
    id: 'k4',
    kpi_code: 'KPI-INDV-HOANG-202607',
    kpi_name: 'Doanh Số Cá Nhân - Trần Văn Hoàng',
    unit: 'VND',
    assignee_type: 'Individual',
    assignee_name: 'Trần Văn Hoàng (NV-00101)',
    period: 'Tháng 07/2026',
    target_value: 500000000,
    actual_value: 620000000,
    progress_percentage: 124.0,
    weight: 100,
    notes: 'Doanh số cá nhân Trưởng nhóm Sale Đội 1',
    created_at: '2026-07-01',
  },
  {
    id: 'k5',
    kpi_code: 'KPI-INDV-MAI-202607',
    kpi_name: 'Doanh Số Cá Nhân - Lê Thị Mai',
    unit: 'VND',
    assignee_type: 'Individual',
    assignee_name: 'Lê Thị Mai (NV-00102)',
    period: 'Tháng 07/2026',
    target_value: 300000000,
    actual_value: 264000000,
    progress_percentage: 88.0,
    weight: 100,
    notes: 'Doanh số chốt hợp đồng vận hành TikTok/Shopee Mall',
    created_at: '2026-07-01',
  },
];

let kpis = [...INITIAL_KPIS];

export function calculateProgressPercentage(target: number, actual: number): number {
  if (target <= 0) return 0;
  const pct = (actual / target) * 100;
  return Math.round(pct * 10) / 10;
}

export function getKPIs(): KPIAssignment[] {
  return kpis;
}

export function getKPIById(id: string): KPIAssignment | undefined {
  return kpis.find(k => k.id === id);
}

export function createKPI(newItem: Omit<KPIAssignment, 'id' | 'progress_percentage' | 'created_at'>): KPIAssignment {
  const target = Number(newItem.target_value) || 0;
  const actual = Number(newItem.actual_value) || 0;
  const progress_percentage = calculateProgressPercentage(target, actual);

  const created: KPIAssignment = {
    ...newItem,
    target_value: target,
    actual_value: actual,
    progress_percentage,
    id: `k_${Date.now()}`,
    kpi_code: newItem.kpi_code || `KPI-${newItem.assignee_type.toUpperCase().slice(0, 4)}-${Date.now().toString().slice(-6)}`,
    created_at: new Date().toISOString().split('T')[0],
  };

  kpis = [created, ...kpis];
  return created;
}

export function updateKPI(id: string, updates: Partial<KPIAssignment>): KPIAssignment {
  kpis = kpis.map(k => {
    if (k.id === id) {
      const target = updates.target_value !== undefined ? Number(updates.target_value) : k.target_value;
      const actual = updates.actual_value !== undefined ? Number(updates.actual_value) : k.actual_value;
      const progress_percentage = calculateProgressPercentage(target, actual);
      return {
        ...k,
        ...updates,
        target_value: target,
        actual_value: actual,
        progress_percentage,
      };
    }
    return k;
  });

  const updated = kpis.find(k => k.id === id);
  if (!updated) throw new Error('KPI not found');
  return updated;
}

export function deleteKPI(id: string): void {
  kpis = kpis.filter(k => k.id !== id);
}
