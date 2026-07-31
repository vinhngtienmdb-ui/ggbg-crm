import { FixedAsset, EnterpriseProject } from '@/types';

export const INITIAL_FIXED_ASSETS: FixedAsset[] = [
  {
    id: 'ast_1',
    asset_code: 'TS-IT-001',
    name: 'Máy Tính Bàn Server Dell PowerEdge T340',
    category: 'IT_EQUIPMENT',
    category_name: 'Thiết Bị CNTT & Server',
    purchase_date: '2025-01-15',
    purchase_price: 45000000,
    depreciation_months: 36,
    monthly_depreciation: 1250000,
    accumulated_depreciation: 22500000,
    net_book_value: 22500000,
    department: 'Khối Vận Hành TMĐT',
    assigned_to: 'Vũ Quốc Anh',
    status: 'IN_USE',
    notes: 'Server hosting dữ liệu gian hàng Shopee & TikTok',
  },
  {
    id: 'ast_2',
    asset_code: 'TS-ECOM-002',
    name: 'Máy In Mã Vạch Chuyên Dụng Xprinter XP-420B',
    category: 'ECOM_MACHINERY',
    category_name: 'Máy Móc Đóng Bì Vận Đơn',
    purchase_date: '2025-03-10',
    purchase_price: 8500000,
    depreciation_months: 24,
    monthly_depreciation: 354166,
    accumulated_depreciation: 5666666,
    net_book_value: 2833334,
    department: 'Kho Vận TMĐT Bắc Ninh',
    assigned_to: 'Trần Văn Hoàng',
    status: 'IN_USE',
    notes: 'In tem vận đơn tự động đa sàn',
  },
  {
    id: 'ast_3',
    asset_code: 'TS-VEH-003',
    name: 'Xe Tải Giao Hàng Suzuki Carry Pro 810kg',
    category: 'VEHICLES',
    category_name: 'Phương Tiện Vận Tải',
    purchase_date: '2024-06-20',
    purchase_price: 320000000,
    depreciation_months: 60,
    monthly_depreciation: 5333333,
    accumulated_depreciation: 133333325,
    net_book_value: 186666675,
    department: 'Khối Kinh Doanh & Vận Hành',
    assigned_to: 'Nguyễn Văn Minh',
    status: 'IN_USE',
    notes: 'Vận chuyển hàng gian hàng Agency',
  },
  {
    id: 'ast_4',
    asset_code: 'TS-FUR-004',
    name: 'Bộ Bàn Ghế Giám Đốc Gỗ Tự Nhiên VIP',
    category: 'OFFICE_FURNITURE',
    category_name: 'Nội Thất Văn Phòng',
    purchase_date: '2024-01-10',
    purchase_price: 25000000,
    depreciation_months: 48,
    monthly_depreciation: 520833,
    accumulated_depreciation: 13020833,
    net_book_value: 11979167,
    department: 'Ban Giám Đốc',
    assigned_to: 'Nguyễn Tiến Vinh',
    status: 'IN_USE',
    notes: 'Bàn làm việc Giám đốc tại Leadvisors Tower',
  },
];

export const INITIAL_ENTERPRISE_PROJECTS: EnterpriseProject[] = [
  {
    id: 'prj_1',
    project_code: 'DA-2026-001',
    name: 'Setup Hệ Thống Gian Hàng Agency Mỹ Phẩm An An',
    client_name: 'Công Ty TNHH Mỹ Phẩm An An',
    department: 'Khối Kinh Doanh & TMĐT',
    manager_name: 'Đặng Tuấn Tú',
    start_date: '2026-07-01',
    end_date: '2026-08-31',
    budget: 180000000,
    actual_cost: 95000000,
    progress_pct: 65,
    status: 'IN_PROGRESS',
    description: 'Xây dựng chuẩn hóa 5 gian hàng Shopee, TikTok Shop, Lazada & Amazon cho thương hiệu An An.',
    tasks: [
      { id: 'tk_1', project_id: 'prj_1', title: 'Thiết kế Bộ nhận diện Banner & Đồ họa gian hàng', assignee_name: 'Vũ Quốc Anh', start_date: '2026-07-01', due_date: '2026-07-10', progress_pct: 100, status: 'DONE' },
      { id: 'tk_2', project_id: 'prj_1', title: 'Đăng tải 120 SKU Sản Phẩm & Chuẩn hóa SEO TMĐT', assignee_name: 'Lê Văn An', start_date: '2026-07-11', due_date: '2026-07-20', progress_pct: 100, status: 'DONE' },
      { id: 'tk_3', project_id: 'prj_1', title: 'Cấu hình Quảng cáo Shopee Ads & TikTok Shop Live', assignee_name: 'Phạm Thị Bình', start_date: '2026-07-21', due_date: '2026-08-10', progress_pct: 40, status: 'IN_PROGRESS' },
      { id: 'tk_4', project_id: 'prj_1', title: 'Bàn giao báo cáo nghiệm thu & Đào tạo vận hành', assignee_name: 'Đặng Tuấn Tú', start_date: '2026-08-11', due_date: '2026-08-31', progress_pct: 0, status: 'TODO' },
    ],
  },
  {
    id: 'prj_2',
    project_code: 'DA-2026-002',
    name: 'Chiến Dịch Campaign Mega Sale 11/11 Toàn Sàn',
    client_name: 'GGBBingo Agency Internal',
    department: 'Khối Vận Hành TMĐT',
    manager_name: 'Hoàng Kim Ngân',
    start_date: '2026-09-01',
    end_date: '2026-11-15',
    budget: 350000000,
    actual_cost: 45000000,
    progress_pct: 20,
    status: 'PLANNING',
    description: 'Chiến dịch bùng nổ doanh số Mega Sale 11/11 cho 30 gian hàng đối tác ủy quyền.',
    tasks: [
      { id: 'tk_5', project_id: 'prj_2', title: 'Đăng ký chương trình Flash Sale & Voucher sàn', assignee_name: 'Hoàng Kim Ngân', start_date: '2026-09-01', due_date: '2026-09-15', progress_pct: 80, status: 'IN_PROGRESS' },
      { id: 'tk_6', project_id: 'prj_2', title: 'Chuẩn bị kho vận & Nhân sự đóng gói tăng ca', assignee_name: 'Nguyễn Văn Minh', start_date: '2026-09-16', due_date: '2026-10-15', progress_pct: 0, status: 'TODO' },
    ],
  },
];

let assetsStore: FixedAsset[] = [...INITIAL_FIXED_ASSETS];
let projectsStore: EnterpriseProject[] = [...INITIAL_ENTERPRISE_PROJECTS];

export function getFixedAssets(): FixedAsset[] {
  return assetsStore;
}

export function addFixedAsset(asset: FixedAsset): FixedAsset[] {
  assetsStore = [asset, ...assetsStore];
  return assetsStore;
}

export function updateFixedAsset(updated: FixedAsset): FixedAsset[] {
  assetsStore = assetsStore.map(a => a.id === updated.id ? updated : a);
  return assetsStore;
}

export function deleteFixedAsset(id: string): FixedAsset[] {
  assetsStore = assetsStore.filter(a => a.id !== id);
  return assetsStore;
}

export function getEnterpriseProjects(): EnterpriseProject[] {
  return projectsStore;
}

export function addEnterpriseProject(project: EnterpriseProject): EnterpriseProject[] {
  projectsStore = [project, ...projectsStore];
  return projectsStore;
}

export function updateEnterpriseProject(updated: EnterpriseProject): EnterpriseProject[] {
  projectsStore = projectsStore.map(p => p.id === updated.id ? updated : p);
  return projectsStore;
}

export function deleteEnterpriseProject(id: string): EnterpriseProject[] {
  projectsStore = projectsStore.filter(p => p.id !== id);
  return projectsStore;
}
