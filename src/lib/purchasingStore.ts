import { Supplier, PurchaseOrder } from '@/types';

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup_1',
    supplier_code: 'NCC-001',
    name: 'Công Ty TNHH Máy Tính & Server FPT Retail',
    tax_code: '0101234567',
    contact_person: 'Phạm Minh Đức',
    phone: '0903123456',
    email: 'ducpm@fpt-retail.com.vn',
    address: 'Số 261 Khánh Hội, Phường 5, Quận 4, TP. Hồ Chí Minh',
    rating: 'A',
    payable_balance: 120000000,
    category: 'Thiết Bị IT & Máy Tính',
    created_at: '2026-01-15',
  },
  {
    id: 'sup_2',
    supplier_code: 'NCC-002',
    name: 'Tổng Công Ty Vận Chuyển Viettel Post',
    tax_code: '0102839481',
    contact_person: 'Nguyễn Văn Hòa',
    phone: '0988776655',
    email: 'hoa.nguyen@viettelpost.com.vn',
    address: 'Tòa nhà Viettel, Ngõ 15 Duy Tân, Cầu Giấy, Hà Nội',
    rating: 'A',
    payable_balance: 45000000,
    category: 'Dịch Vụ Logistics & Kho Bãi',
    created_at: '2026-02-10',
  },
  {
    id: 'sup_3',
    supplier_code: 'NCC-003',
    name: 'Công Ty Cổ Phần Bao Bì & In Ấn An Bình',
    tax_code: '0309988112',
    contact_person: 'Lê Thị Thu',
    phone: '0912334455',
    email: 'thule@anbinhpackage.vn',
    address: 'Lô C2, KCN Tân Bình, Quận Tân Phú, TP. Hồ Chí Minh',
    rating: 'B',
    payable_balance: 18500000,
    category: 'Vật Tư In Ấn & Thùng Carton',
    created_at: '2026-03-20',
  },
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po_1',
    po_code: 'PO-2026-0701',
    supplier_id: 'sup_1',
    supplier_name: 'Công Ty TNHH Máy Tính & Server FPT Retail',
    order_date: '2026-07-25',
    expected_delivery_date: '2026-08-05',
    total_amount: 180000000,
    tax_amount: 18000000,
    grand_total: 198000000,
    payment_status: 'UNPAID',
    delivery_status: 'SHIPPED',
    approval_status: 'APPROVED',
    notes: 'Đơn mua 10 máy tính Dell XPS 15 cho nhân sự Khối Kinh doanh & TMĐT.',
    items: [
      { id: 'poi_1', item_name: 'Máy Tính Dell XPS 15 9530 i7 32GB', quantity: 10, unit_price: 18000000, total_amount: 180000000 },
    ],
  },
];

let suppliersStore: Supplier[] = [...INITIAL_SUPPLIERS];
let poStore: PurchaseOrder[] = [...INITIAL_PURCHASE_ORDERS];

export function getSuppliers(): Supplier[] {
  return suppliersStore;
}

export function addSupplier(sup: Supplier): Supplier[] {
  suppliersStore = [sup, ...suppliersStore];
  return suppliersStore;
}

export function getPurchaseOrders(): PurchaseOrder[] {
  return poStore;
}

export function addPurchaseOrder(po: PurchaseOrder): PurchaseOrder[] {
  poStore = [po, ...poStore];
  return poStore;
}

export function approvePurchaseOrder(poId: string): PurchaseOrder[] {
  poStore = poStore.map(p => p.id === poId ? { ...p, approval_status: 'APPROVED' as const } : p);
  return poStore;
}
