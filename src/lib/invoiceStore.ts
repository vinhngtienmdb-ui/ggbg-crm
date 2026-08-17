import { InvoiceVAT } from '@/types';

export const INITIAL_INVOICES: InvoiceVAT[] = [];

let invoiceStoreList: InvoiceVAT[] = [...INITIAL_INVOICES];

export function getInvoices(): InvoiceVAT[] {
  return invoiceStoreList;
}

export function addInvoice(inv: InvoiceVAT): InvoiceVAT[] {
  invoiceStoreList = [inv, ...invoiceStoreList];
  return invoiceStoreList;
}
