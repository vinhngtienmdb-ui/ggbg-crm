import { KPIAssignment, KpiAssigneeType, KpiCategory, KpiMetricType } from '@/types';

export const KPI_UPDATED_EVENT = 'ggbg_kpi_updated_event';

export const INITIAL_KPIS: KPIAssignment[] = [
  {
    id: 'k1',
    kpi_code: 'KPI-COMP-202607',
    kpi_name: 'Tổng Doanh Số Chốt Hợp Đồng Dịch Vụ Vận Hành E-commerce',
    category: 'REVENUE',
    category_label: '💰 Doanh Số',
    metric_type: 'Currency',
    unit: 'VND',
    assignee_type: 'Company',
    assignee_name: 'Toàn Công Ty GGBingo Group',
    period: 'Tháng 07/2026',
    target_value: 4000000000,
    actual_value: 4250000000,
    progress_percentage: 106.3,
    weight: 100,
    notes: 'Chỉ tiêu tổng doanh số ký mới hợp đồng vận hành Shopee/TikTok/Lazada toàn tập đoàn',
    created_at: '2026-07-01',
  },
  {
    id: 'k2',
    kpi_code: 'KPI-DEPT1-202607',
    kpi_name: 'Doanh Số Kinh Doanh Khối Sale Miền Bắc',
    category: 'REVENUE',
    category_label: '💰 Doanh Số',
    metric_type: 'Currency',
    unit: 'VND',
    assignee_type: 'Department',
    assignee_name: 'Phòng Kinh Doanh 1',
    department: 'Phòng Kinh Doanh 1',
    region: 'Sale Miền Bắc',
    period: 'Tháng 07/2026',
    target_value: 1500000000,
    actual_value: 1420000000,
    progress_percentage: 94.7,
    weight: 40,
    notes: 'Phát triển doanh thu thị trường Hà Nội và khu vực phía Bắc',
    created_at: '2026-07-01',
  },
  {
    id: 'k3',
    kpi_code: 'KPI-LEADS-202607',
    kpi_name: 'Chỉ Tiêu Tiếp Nhận & Phân Phối Lead Mới MKT',
    category: 'LEADS',
    category_label: '🎯 Lead Mới',
    metric_type: 'Count',
    unit: 'Lead',
    assignee_type: 'Department',
    assignee_name: 'Phòng Marketing',
    department: 'Phòng Marketing',
    period: 'Tháng 07/2026',
    target_value: 500,
    actual_value: 540,
    progress_percentage: 108.0,
    weight: 30,
    notes: 'Chạy các chiến dịch Ads TikTok/Facebook đưa Lead chất lượng về CRM',
    created_at: '2026-07-01',
  },
  {
    id: 'k4',
    kpi_code: 'KPI-TEAM2-202607',
    kpi_name: 'Số Lượng Gian Hàng Mới Đăng Ký GGBingoVN Platform',
    category: 'CONTRACTS',
    category_label: '🛍️ Gian Hàng / Hợp Đồng',
    metric_type: 'Count',
    unit: 'Gian Hàng',
    assignee_type: 'Team',
    assignee_name: 'Team Merchant Acquisition 2',
    department: 'Phòng Kinh Doanh 2',
    period: 'Tháng 07/2026',
    target_value: 50,
    actual_value: 48,
    progress_percentage: 96.0,
    weight: 25,
    notes: 'Phát triển Merchant VIP đăng ký mở gian hàng đa sàn trên GGBingoVN',
    created_at: '2026-07-01',
  },
  {
    id: 'k5',
    kpi_code: 'KPI-INDV-HOANG-202607',
    kpi_name: 'Doanh Số Cá Nhân - Trần Văn Hoàng',
    category: 'REVENUE',
    category_label: '💰 Doanh Số',
    metric_type: 'Currency',
    unit: 'VND',
    assignee_type: 'Individual',
    assignee_name: 'Trần Văn Hoàng (NV-00101)',
    department: 'Phòng Kinh Doanh 1',
    period: 'Tháng 07/2026',
    target_value: 500000000,
    actual_value: 620000000,
    progress_percentage: 124.0,
    weight: 100,
    notes: 'Doanh số cá nhân Trưởng nhóm Sale Đội 1 (Vượt chỉ tiêu xuất sắc)',
    created_at: '2026-07-01',
  },
  {
    id: 'k6',
    kpi_code: 'KPI-INDV-MAI-202607',
    kpi_name: 'Số Cuộc Gọi Tư Vấn CSKH & Demo Sản Phẩm',
    category: 'CALLS',
    category_label: '📞 Cuộc Gọi',
    metric_type: 'Count',
    unit: 'Cuộc Gọi',
    assignee_type: 'Individual',
    assignee_name: 'Lê Thị Mai (NV-00102)',
    department: 'Phòng CSKH',
    period: 'Tháng 07/2026',
    target_value: 200,
    actual_value: 150,
    progress_percentage: 75.0,
    weight: 20,
    notes: 'Gọi tư vấn trực tiếp cho khách hàng quan tâm gói Shopee Mall',
    created_at: '2026-07-01',
  },
  {
    id: 'k7',
    kpi_code: 'KPI-CONV-202607',
    kpi_name: 'Tỷ Lệ Chuyển Đổi Lead Thành Khách Hàng (Conversion Rate)',
    category: 'CONVERSION',
    category_label: '📈 Tỷ Lệ Chuyển Đổi',
    metric_type: 'Percentage',
    unit: '%',
    assignee_type: 'Department',
    assignee_name: 'Phòng Kinh Doanh 2',
    department: 'Phòng Kinh Doanh 2',
    period: 'Tháng 07/2026',
    target_value: 20.0,
    actual_value: 18.5,
    progress_percentage: 92.5,
    weight: 25,
    notes: 'Đo lường tỷ lệ chốt thành công từ Lead tiếp nhận sang hợp đồng',
    created_at: '2026-07-01',
  },
];

const STORAGE_KEY = 'ggbg_kpi_assignments_v2';

function loadKPIs(): KPIAssignment[] {
  if (typeof window === 'undefined') return INITIAL_KPIS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_KPIS));
      return INITIAL_KPIS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading KPIs from localStorage:', e);
    return INITIAL_KPIS;
  }
}

function saveKPIs(data: KPIAssignment[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event(KPI_UPDATED_EVENT));
  } catch (e) {
    console.error('Error saving KPIs to localStorage:', e);
  }
}

export function calculateProgressPercentage(target: number, actual: number): number {
  if (target <= 0) return 0;
  const pct = (actual / target) * 100;
  return Math.round(pct * 10) / 10;
}

export function getKPIs(): KPIAssignment[] {
  return loadKPIs();
}

export function getKPIById(id: string): KPIAssignment | undefined {
  const list = loadKPIs();
  return list.find((k) => k.id === id);
}

export function createKPI(newItem: Omit<KPIAssignment, 'id' | 'progress_percentage' | 'created_at'>): KPIAssignment {
  const currentList = loadKPIs();
  const target = Number(newItem.target_value) || 0;
  const actual = Number(newItem.actual_value) || 0;
  const progress_percentage = calculateProgressPercentage(target, actual);

  const created: KPIAssignment = {
    ...newItem,
    target_value: target,
    actual_value: actual,
    progress_percentage,
    id: `kpi_${Date.now()}`,
    kpi_code: newItem.kpi_code || `KPI-${newItem.assignee_type.toUpperCase().slice(0, 4)}-${Date.now().toString().slice(-6)}`,
    created_at: new Date().toISOString().split('T')[0],
  };

  const updatedList = [created, ...currentList];
  saveKPIs(updatedList);
  return created;
}

export function updateKPI(id: string, updates: Partial<KPIAssignment>): KPIAssignment {
  const currentList = loadKPIs();
  let updatedObj: KPIAssignment | undefined;

  const updatedList = currentList.map((k) => {
    if (k.id === id) {
      const target = updates.target_value !== undefined ? Number(updates.target_value) : k.target_value;
      const actual = updates.actual_value !== undefined ? Number(updates.actual_value) : k.actual_value;
      const progress_percentage = calculateProgressPercentage(target, actual);
      updatedObj = {
        ...k,
        ...updates,
        target_value: target,
        actual_value: actual,
        progress_percentage,
      };
      return updatedObj;
    }
    return k;
  });

  if (!updatedObj) throw new Error('KPI item not found');
  saveKPIs(updatedList);
  return updatedObj;
}

export function deleteKPI(id: string): void {
  const currentList = loadKPIs();
  const updatedList = currentList.filter((k) => k.id !== id);
  saveKPIs(updatedList);
}
