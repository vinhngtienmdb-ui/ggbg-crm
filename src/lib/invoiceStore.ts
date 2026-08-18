import { InvoiceVAT } from '@/types';

export const INITIAL_INVOICES: InvoiceVAT[] = [
  {
    id: 'inv_1',
    invoice_number: '00000101',
    invoice_symbol: 'C26TGG',
    tax_authority_code: 'MCCQT: 00C8F91A2026073100101',
    issue_date: '2026-07-31',
    buyer_name: 'Tập Đoàn Bán Lẻ SunGroup',
    buyer_tax_code: '0102345678',
    buyer_address: 'Số 68 Lê Duẩn, Hoàn Kiếm, Hà Nội',
    subtotal: 150000000,
    tax_rate: 10,
    tax_amount: 15000000,
    total_amount: 165000000,
    status: 'ISSUED',
    created_at: '2026-07-31 10:00',
  },
  {
    id: 'inv_2',
    invoice_number: '00000102',
    invoice_symbol: 'C26TGG',
    tax_authority_code: 'MCCQT: 00C8F91A2026073100102',
    issue_date: '2026-07-31',
    buyer_name: 'Công Ty Mỹ Phẩm Thiên Nhiên Cocoon VN',
    buyer_tax_code: '0314567890',
    buyer_address: 'Số 124 Nguyễn Đình Chiểu, Quận 3, TP.HCM',
    subtotal: 127500000,
    tax_rate: 10,
    tax_amount: 12750000,
    total_amount: 140250000,
    status: 'ISSUED',
    created_at: '2026-07-31 11:30',
  },
  {
    id: 'inv_3',
    invoice_number: '00000103',
    invoice_symbol: 'C26TGG',
    tax_authority_code: 'MCCQT: 00C8F91A2026073100103',
    issue_date: '2026-07-31',
    buyer_name: 'Công Ty Cổ Phần Thời Trang Biluxury',
    buyer_tax_code: '0106789012',
    buyer_address: 'Số 35 Chùa Bộc, Đống Đa, Hà Nội',
    subtotal: 62000000,
    tax_rate: 10,
    tax_amount: 6200000,
    total_amount: 68200000,
    status: 'ISSUED',
    created_at: '2026-07-31 14:15',
  },
  {
    id: 'inv_4',
    invoice_number: '00000104',
    invoice_symbol: 'C26TGG',
    tax_authority_code: 'MCCQT: 00C8F91A2026073100104',
    issue_date: '2026-07-31',
    buyer_name: 'Công Ty TNHH Elmich Gia Dụng Châu Âu',
    buyer_tax_code: '0700567890',
    buyer_address: 'KCN Châu Sơn, Phủ Lý, Hà Nam',
    subtotal: 144000000,
    tax_rate: 10,
    tax_amount: 14400000,
    total_amount: 158400000,
    status: 'ISSUED',
    created_at: '2026-07-31 15:45',
  },
];

let invoiceStoreList: InvoiceVAT[] = [...INITIAL_INVOICES];

export const INVOICES_UPDATED_EVENT = 'ggbg_invoices_updated';

function notifyInvoicesUpdate() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('ggbg_invoices_data', JSON.stringify(invoiceStoreList));
    } catch (e) {
      console.error('Error saving invoices to localStorage:', e);
    }
    window.dispatchEvent(new Event(INVOICES_UPDATED_EVENT));
  }
}

if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('ggbg_invoices_data');
    if (saved) invoiceStoreList = JSON.parse(saved);
  } catch (e) {
    console.error('Error loading invoices from localStorage:', e);
  }
}

export function getInvoices(): InvoiceVAT[] {
  return invoiceStoreList;
}

export function addInvoice(inv: InvoiceVAT): InvoiceVAT[] {
  invoiceStoreList = [inv, ...invoiceStoreList];
  notifyInvoicesUpdate();
  return invoiceStoreList;
}

export function cancelInvoice(id: string): InvoiceVAT[] {
  invoiceStoreList = invoiceStoreList.map((i) => (i.id === id ? { ...i, status: 'CANCELLED' as const } : i));
  notifyInvoicesUpdate();
  return invoiceStoreList;
}
