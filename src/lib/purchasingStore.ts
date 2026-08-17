import { Supplier, PurchaseOrder } from '@/types';

export const INITIAL_SUPPLIERS: Supplier[] = [];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [];

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
