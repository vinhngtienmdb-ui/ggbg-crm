import { FixedAsset, EnterpriseProject } from '@/types';

export const INITIAL_FIXED_ASSETS: FixedAsset[] = [
  {
    id: 'ast_1',
    asset_code: 'TS-IT-001',
    name: 'Dàn Máy Chủ Server Dell PowerEdge R750',
    category: 'IT_EQUIPMENT',
    category_name: 'Thiết Bị CNTT & Server',
    purchase_date: '2025-01-15',
    purchase_price: 185000000,
    depreciation_months: 36,
    monthly_depreciation: 5138889,
    accumulated_depreciation: 97638891,
    net_book_value: 87361109,
    department: 'Khối Công Nghệ & Vận Hành',
    assigned_to: 'Vũ Nam Khánh',
    status: 'IN_USE',
    notes: 'Server chính vận hành hệ thống CRM và cổng kết nối API sàn TMĐT',
  },
  {
    id: 'ast_2',
    asset_code: 'TS-ECO-002',
    name: 'Máy In Nhiệt & Băng Chuyền Đóng Gói Tự Động Xprinter',
    category: 'ECOM_MACHINERY',
    category_name: 'Máy Móc Đóng Bì Vận Đơn',
    purchase_date: '2025-06-10',
    purchase_price: 65000000,
    depreciation_months: 24,
    monthly_depreciation: 2708333,
    accumulated_depreciation: 37916662,
    net_book_value: 27083338,
    department: 'Phòng Vận Hành Kho TMĐT',
    assigned_to: 'Đỗ Quốc Bảo',
    status: 'IN_USE',
    notes: 'Dây chuyền xử lý 10,000 đơn hàng/ngày',
  },
  {
    id: 'ast_3',
    asset_code: 'TS-OFF-003',
    name: 'Bộ Bàn Ghế Công Thái Học & Setup Studio Livestream',
    category: 'OFFICE_FURNITURE',
    category_name: 'Nội Thất Văn Phòng',
    purchase_date: '2025-09-01',
    purchase_price: 45000000,
    depreciation_months: 36,
    monthly_depreciation: 1250000,
    accumulated_depreciation: 13750000,
    net_book_value: 31250000,
    department: 'Phòng Media & Livestream',
    assigned_to: 'Trần Văn Hoàng',
    status: 'IN_USE',
    notes: 'Trang bị Studio Mega Live 4K',
  },
  {
    id: 'ast_4',
    asset_code: 'TS-VEH-004',
    name: 'Xe Bán Tải Ford Ranger Vận Chuyển Hàng Kho',
    category: 'VEHICLES',
    category_name: 'Phương Tiện Vận Tải',
    purchase_date: '2024-11-20',
    purchase_price: 680000000,
    depreciation_months: 72,
    monthly_depreciation: 9444444,
    accumulated_depreciation: 198333324,
    net_book_value: 481666676,
    department: 'Khối Logistics & Giao Vận',
    assigned_to: 'Phạm Minh Đức',
    status: 'IN_USE',
    notes: 'Xe trung chuyển hàng từ tổng kho về các điểm phân phối',
  },
];

export const INITIAL_ENTERPRISE_PROJECTS: EnterpriseProject[] = [
  {
    id: 'proj_1',
    project_code: 'PRJ-2026-001',
    name: 'Triển Khai Mega Live Đại Tiệc 8.8 Cho SunGroup',
    client_name: 'Trần Văn Hoàng (SunGroup)',
    department: 'Khối Kinh Doanh (Sales & BD)',
    manager_name: 'Phạm Minh Đức (CSO)',
    start_date: '2026-07-15',
    end_date: '2026-08-15',
    budget: 250000000,
    actual_cost: 185000000,
    progress_pct: 100,
    status: 'COMPLETED',
    description: 'Chiến dịch Mega Live đa sàn Shopee Mall kết hợp KOC độc quyền',
    tasks: [],
  },
  {
    id: 'proj_2',
    project_code: 'PRJ-2026-002',
    name: 'Tối Ưu Hóa Chi Phí Quảng Cáo TikTok Shop - Cocoon VN',
    client_name: 'Nguyễn Thị Lan (Cocoon VN)',
    department: 'Khối Vận Hành & CSKH',
    manager_name: 'Vũ Nam Khánh (Head of Ops)',
    start_date: '2026-08-01',
    end_date: '2026-09-01',
    budget: 150000000,
    actual_cost: 65000000,
    progress_pct: 65,
    status: 'IN_PROGRESS',
    description: 'Tái cấu trúc luồng Ads TikTok Shop và tối ưu ROAS > 4.5',
    tasks: [],
  },
  {
    id: 'proj_3',
    project_code: 'PRJ-2026-003',
    name: 'Xây Dựng Gian Hàng Toàn Cầu Amazon US - Elmich',
    client_name: 'Vũ Đức Thịnh (Elmich)',
    department: 'Phòng Kinh Doanh 1',
    manager_name: 'Đỗ Quốc Bảo (Trưởng Phòng KD)',
    start_date: '2026-08-10',
    end_date: '2026-10-30',
    budget: 450000000,
    actual_cost: 110000000,
    progress_pct: 30,
    status: 'IN_PROGRESS',
    description: 'Thiết lập kho FBA và chiến dịch ra mắt bộ sản phẩm gia dụng Elmich tại thị trường Mỹ',
    tasks: [],
  },
];

let assetsStore: FixedAsset[] = [...INITIAL_FIXED_ASSETS];
let projectsStore: EnterpriseProject[] = [...INITIAL_ENTERPRISE_PROJECTS];

export const ERP_UPDATED_EVENT = 'ggbg_erp_updated';

function notifyErpUpdate() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('ggbg_assets_data', JSON.stringify(assetsStore));
      localStorage.setItem('ggbg_projects_data', JSON.stringify(projectsStore));
    } catch (e) {
      console.error('Error saving ERP to localStorage:', e);
    }
    window.dispatchEvent(new Event(ERP_UPDATED_EVENT));
  }
}

if (typeof window !== 'undefined') {
  try {
    const savedAssets = localStorage.getItem('ggbg_assets_data');
    if (savedAssets) assetsStore = JSON.parse(savedAssets);
    const savedProjects = localStorage.getItem('ggbg_projects_data');
    if (savedProjects) projectsStore = JSON.parse(savedProjects);
  } catch (e) {
    console.error('Error loading ERP from localStorage:', e);
  }
}

export function getFixedAssets(): FixedAsset[] {
  return assetsStore;
}

export function addFixedAsset(asset: FixedAsset): FixedAsset[] {
  assetsStore = [asset, ...assetsStore];
  notifyErpUpdate();
  return assetsStore;
}

export function updateFixedAsset(updated: FixedAsset): FixedAsset[] {
  assetsStore = assetsStore.map((a) => (a.id === updated.id ? updated : a));
  notifyErpUpdate();
  return assetsStore;
}

export function deleteFixedAsset(id: string): FixedAsset[] {
  assetsStore = assetsStore.filter((a) => a.id !== id);
  notifyErpUpdate();
  return assetsStore;
}

export function getEnterpriseProjects(): EnterpriseProject[] {
  return projectsStore;
}

export function addEnterpriseProject(project: EnterpriseProject): EnterpriseProject[] {
  projectsStore = [project, ...projectsStore];
  notifyErpUpdate();
  return projectsStore;
}

export function updateEnterpriseProject(updated: EnterpriseProject): EnterpriseProject[] {
  projectsStore = projectsStore.map((p) => (p.id === updated.id ? updated : p));
  notifyErpUpdate();
  return projectsStore;
}

export function deleteEnterpriseProject(id: string): EnterpriseProject[] {
  projectsStore = projectsStore.filter((p) => p.id !== id);
  notifyErpUpdate();
  return projectsStore;
}
