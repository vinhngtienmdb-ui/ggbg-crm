import { InvoiceVAT } from '@/types';

export const INITIAL_INVOICES: InvoiceVAT[] = [
  {
    id: 'inv_1',
    invoice_number: '00000101',
    invoice_symbol: 'C26TGG',
    tax_authority_code: 'MCCQT: 00C8F91A2026072800101',
    issue_date: '2026-07-28',
    buyer_name: 'Công Ty TNHH Mỹ Phẩm An An',
    buyer_tax_code: '0315891023',
    buyer_address: 'Tầng 5, Tòa nhà Bitexco Financial Tower, Quận 1, TP. Hồ Chí Minh',
    subtotal: 150000000,
    tax_rate: 10,
    tax_amount: 15000000,
    total_amount: 165000000,
    status: 'ISSUED',
    created_at: '2026-07-28 10:30',
  },
  {
    id: 'inv_2',
    invoice_number: '00000102',
    invoice_symbol: 'C26TGG',
    tax_authority_code: 'MCCQT: 00C8F91A2026072900102',
    issue_date: '2026-07-29',
    buyer_name: 'Công Ty Cổ Phần Tập Đoàn Hồng Lực',
    buyer_tax_code: '0102938471',
    buyer_address: 'Số 18 Phạm Hùng, Phường Mỹ Đình 2, Quận Nam Từ Liêm, Hà Nội',
    subtotal: 45000000,
    tax_rate: 10,
    tax_amount: 4500000,
    total_amount: 49500000,
    status: 'ISSUED',
    created_at: '2026-07-29 15:45',
  },
];

let invoiceStoreList: InvoiceVAT[] = [...INITIAL_INVOICES];

export function getInvoices(): InvoiceVAT[] {
  return invoiceStoreList;
}

export function addInvoice(inv: InvoiceVAT): InvoiceVAT[] {
  invoiceStoreList = [inv, ...invoiceStoreList];
  return invoiceStoreList;
}
