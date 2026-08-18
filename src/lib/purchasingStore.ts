import { Supplier, PurchaseOrder } from '@/types';

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup_1',
    supplier_code: 'NCC-001',
    name: 'Công Ty TNHH In Ấn & Bao Bì Tân Phát',
    tax_code: '0108899776',
    contact_person: 'Nguyễn Văn Đạt',
    phone: '0988 123 456',
    email: 'dat.nv@tanphatpack.vn',
    address: 'KCN Nam Thăng Long, Bắc Từ Liêm, Hà Nội',
    category: 'Vật Liệu Đóng Gói & Hộp Bì',
    rating: 'A',
    payable_balance: 35000000,
    created_at: '2025-05-10',
  },
  {
    id: 'sup_2',
    supplier_code: 'NCC-002',
    name: 'Công Ty Cổ Phần Công Nghệ Cloud Server VN',
    tax_code: '0315566778',
    contact_person: 'Trần Minh Tuấn',
    phone: '0909 234 567',
    email: 'tuan.tm@cloudvn.io',
    address: 'Tòa nhà FPT, Cầu Giấy, Hà Nội',
    category: 'Hạ Tầng Server & SaaS',
    rating: 'A',
    payable_balance: 0,
    created_at: '2025-06-20',
  },
  {
    id: 'sup_3',
    supplier_code: 'NCC-003',
    name: 'Công Ty TNHH Media & KOC Booking StarLight',
    tax_code: '0316789012',
    contact_person: 'Lê Hoàng Yến',
    phone: '0938 789 012',
    email: 'yen.lh@starlightkoc.vn',
    address: 'Số 45 Lê Duẩn, Bến Nghé, Quận 1, TP.HCM',
    category: 'Dịch Vụ Livestream & KOC',
    rating: 'B',
    payable_balance: 42500000,
    created_at: '2025-08-15',
  },
  {
    id: 'sup_4',
    supplier_code: 'NCC-004',
    name: 'Công Ty Văn Phòng Phẩm Hồng Hà',
    tax_code: '0100100200',
    contact_person: 'Phạm Thị Lan',
    phone: '0912 345 678',
    email: 'lan.pt@vpphongha.vn',
    address: 'Số 25 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội',
    category: 'Văn Phòng Phẩm & Thiết Bị VP',
    rating: 'A',
    payable_balance: 8500000,
    created_at: '2025-11-01',
  },
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po_1',
    po_code: 'PO-2026-0701',
    supplier_id: 'sup_1',
    supplier_name: 'Công Ty TNHH In Ấn & Bao Bì Tân Phát',
    order_date: '2026-07-20',
    expected_delivery_date: '2026-07-25',
    total_amount: 35000000,
    tax_amount: 3500000,
    grand_total: 38500000,
    payment_status: 'PAID',
    delivery_status: 'DELIVERED',
    approval_status: 'APPROVED',
    items: [
      {
        id: 'poi_1',
        item_name: 'Thùng Carton 3 lớp in logo GGBingo',
        quantity: 5000,
        unit_price: 7000,
        total_amount: 35000000,
      },
    ],
    notes: 'In 5000 hộp carton 3 lớp in logo GGBingo phục vụ đóng gói Shopee Mall',
  },
  {
    id: 'po_2',
    po_code: 'PO-2026-0702',
    supplier_id: 'sup_3',
    supplier_name: 'Công Ty TNHH Media & KOC Booking StarLight',
    order_date: '2026-07-22',
    expected_delivery_date: '2026-07-28',
    total_amount: 85000000,
    tax_amount: 8500000,
    grand_total: 93500000,
    payment_status: 'PARTIAL',
    delivery_status: 'DELIVERED',
    approval_status: 'APPROVED',
    items: [
      {
        id: 'poi_2',
        item_name: 'Gói Booking KOC Livestream Mega Sale 8.8',
        quantity: 4,
        unit_price: 21250000,
        total_amount: 85000000,
      },
    ],
    notes: 'Booking 4 phiên Mega Live TikTok Shop chiến dịch Mega Sale 8.8',
  },
  {
    id: 'po_3',
    po_code: 'PO-2026-0801',
    supplier_id: 'sup_2',
    supplier_name: 'Công Ty Cổ Phần Công Nghệ Cloud Server VN',
    order_date: '2026-08-01',
    expected_delivery_date: '2026-08-01',
    total_amount: 25000000,
    tax_amount: 2500000,
    grand_total: 27500000,
    payment_status: 'PAID',
    delivery_status: 'DELIVERED',
    approval_status: 'APPROVED',
    items: [
      {
        id: 'poi_3',
        item_name: 'Thuê Dedicated Server GPU Tháng 8',
        quantity: 1,
        unit_price: 25000000,
        total_amount: 25000000,
      },
    ],
    notes: 'Gia hạn gói Cloud Server GPU phục vụ phân tích dữ liệu GMV đa sàn',
  },
  {
    id: 'po_4',
    po_code: 'PO-2026-0802',
    supplier_id: 'sup_4',
    supplier_name: 'Công Ty Văn Phòng Phẩm Hồng Hà',
    order_date: '2026-08-10',
    expected_delivery_date: '2026-08-15',
    total_amount: 8500000,
    tax_amount: 850000,
    grand_total: 9350000,
    payment_status: 'UNPAID',
    delivery_status: 'PENDING',
    approval_status: 'PENDING',
    items: [
      {
        id: 'poi_4',
        item_name: 'Giấy in hóa đơn và cuộn decal vận đơn nhiệt',
        quantity: 120,
        unit_price: 70833,
        total_amount: 8500000,
      },
    ],
    notes: 'Mua sắm bổ sung giấy in hóa đơn, mực in nhiệt vận đơn và VPP tháng 8',
  },
];

let suppliersStore: Supplier[] = [...INITIAL_SUPPLIERS];
let poStore: PurchaseOrder[] = [...INITIAL_PURCHASE_ORDERS];

export const PURCHASING_UPDATED_EVENT = 'ggbg_purchasing_updated';

function notifyPurchasingUpdate() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('ggbg_suppliers_data', JSON.stringify(suppliersStore));
      localStorage.setItem('ggbg_po_data', JSON.stringify(poStore));
    } catch (e) {
      console.error('Error saving purchasing to localStorage:', e);
    }
    window.dispatchEvent(new Event(PURCHASING_UPDATED_EVENT));
  }
}

if (typeof window !== 'undefined') {
  try {
    const savedSup = localStorage.getItem('ggbg_suppliers_data');
    if (savedSup) suppliersStore = JSON.parse(savedSup);
    const savedPo = localStorage.getItem('ggbg_po_data');
    if (savedPo) poStore = JSON.parse(savedPo);
  } catch (e) {
    console.error('Error loading purchasing from localStorage:', e);
  }
}

export function getSuppliers(): Supplier[] {
  return suppliersStore;
}

export function addSupplier(sup: Supplier): Supplier[] {
  suppliersStore = [sup, ...suppliersStore];
  notifyPurchasingUpdate();
  return suppliersStore;
}

export function updateSupplier(id: string, fields: Partial<Supplier>): Supplier[] {
  suppliersStore = suppliersStore.map((s) => (s.id === id ? { ...s, ...fields } : s));
  notifyPurchasingUpdate();
  return suppliersStore;
}

export function deleteSupplier(id: string): Supplier[] {
  suppliersStore = suppliersStore.filter((s) => s.id !== id);
  notifyPurchasingUpdate();
  return suppliersStore;
}

export function getPurchaseOrders(): PurchaseOrder[] {
  return poStore;
}

export function addPurchaseOrder(po: PurchaseOrder): PurchaseOrder[] {
  poStore = [po, ...poStore];
  notifyPurchasingUpdate();
  return poStore;
}

export function approvePurchaseOrder(poId: string): PurchaseOrder[] {
  poStore = poStore.map((p) => (p.id === poId ? { ...p, approval_status: 'APPROVED' as const } : p));
  notifyPurchasingUpdate();
  return poStore;
}

export function deletePurchaseOrder(id: string): PurchaseOrder[] {
  poStore = poStore.filter((p) => p.id !== id);
  notifyPurchasingUpdate();
  return poStore;
}
