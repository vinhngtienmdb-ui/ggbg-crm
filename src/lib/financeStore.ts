import { ContractProfitLoss, DebtInvoice, FinancialSummary } from '@/types/finance';

export const INITIAL_PL_DATA: ContractProfitLoss[] = [
  {
    id: 'pl_1',
    contract_code: 'HD-2026-001',
    customer_name: 'Trần Văn Hoàng',
    company_name: 'Tập Đoàn Bán Lẻ SunGroup',
    ecom_platform: 'Shopee Mall',
    monthly_gmv: 1250000000,
    commission_rate_percent: 12,
    gross_revenue: 150000000,
    ops_cost: 45000000,
    livestream_koc_cost: 35000000,
    platform_tech_fee: 15000000,
    net_profit: 55000000,
    profit_margin_percent: 36.7,
    contract_status: 'Active',
  },
  {
    id: 'pl_2',
    contract_code: 'HD-2026-002',
    customer_name: 'Nguyễn Thị Lan',
    company_name: 'Mỹ Phẩm Thiên Nhiên Cocoon VN',
    ecom_platform: 'TikTok Shop',
    monthly_gmv: 850000000,
    commission_rate_percent: 15,
    gross_revenue: 127500000,
    ops_cost: 38000000,
    livestream_koc_cost: 42000000,
    platform_tech_fee: 12000000,
    net_profit: 35500000,
    profit_margin_percent: 27.8,
    contract_status: 'Active',
  },
  {
    id: 'pl_3',
    contract_code: 'HD-2026-003',
    customer_name: 'Lê Hoàng Nam',
    company_name: 'Thời Trang Nam Biluxury',
    ecom_platform: 'Lazada',
    monthly_gmv: 620000000,
    commission_rate_percent: 10,
    gross_revenue: 62000000,
    ops_cost: 22000000,
    livestream_koc_cost: 15000000,
    platform_tech_fee: 6000000,
    net_profit: 19000000,
    profit_margin_percent: 30.6,
    contract_status: 'Active',
  },
  {
    id: 'pl_4',
    contract_code: 'HD-2026-004',
    customer_name: 'Vũ Đức Thịnh',
    company_name: 'Gia Dụng Thông Minh Elmich',
    ecom_platform: 'Amazon',
    monthly_gmv: 1800000000,
    commission_rate_percent: 8,
    gross_revenue: 144000000,
    ops_cost: 50000000,
    livestream_koc_cost: 25000000,
    platform_tech_fee: 20000000,
    net_profit: 49000000,
    profit_margin_percent: 34.0,
    contract_status: 'Pending_Renewal',
  },
  {
    id: 'pl_5',
    contract_code: 'HD-2026-005',
    customer_name: 'Đặng Kim Ngân',
    company_name: 'Thực Phẩm Dinh Dưỡng Nutifood',
    ecom_platform: 'Shopee Mall',
    monthly_gmv: 950000000,
    commission_rate_percent: 14,
    gross_revenue: 133000000,
    ops_cost: 40000000,
    livestream_koc_cost: 38000000,
    platform_tech_fee: 14000000,
    net_profit: 41000000,
    profit_margin_percent: 30.8,
    contract_status: 'Active',
  },
];

export const INITIAL_DEBT_INVOICES: DebtInvoice[] = [
  {
    id: 'debt_1',
    invoice_code: 'INV-2026-001',
    customer_name: 'Trần Văn Hoàng (SunGroup)',
    contract_code: 'HD-2026-001',
    billing_period: 'Tháng 07/2026',
    amount_due: 150000000,
    due_date: '2026-08-15',
    payment_status: 'PAID',
    reminder_sent_count: 0,
  },
  {
    id: 'debt_2',
    invoice_code: 'INV-2026-002',
    customer_name: 'Nguyễn Thị Lan (Cocoon VN)',
    contract_code: 'HD-2026-002',
    billing_period: 'Tháng 07/2026',
    amount_due: 127500000,
    due_date: '2026-08-10',
    payment_status: 'OVERDUE',
    overdue_days: 8,
    reminder_sent_count: 2,
    last_reminder_at: '2026-08-16 09:30',
  },
  {
    id: 'debt_3',
    invoice_code: 'INV-2026-003',
    customer_name: 'Lê Hoàng Nam (Biluxury)',
    contract_code: 'HD-2026-003',
    billing_period: 'Tháng 07/2026',
    amount_due: 62000000,
    due_date: '2026-08-25',
    payment_status: 'UNPAID',
    reminder_sent_count: 1,
    last_reminder_at: '2026-08-12 14:15',
  },
  {
    id: 'debt_4',
    invoice_code: 'INV-2026-004',
    customer_name: 'Vũ Đức Thịnh (Elmich)',
    contract_code: 'HD-2026-004',
    billing_period: 'Tháng 06/2026',
    amount_due: 144000000,
    due_date: '2026-07-20',
    payment_status: 'OVERDUE',
    overdue_days: 29,
    reminder_sent_count: 4,
    last_reminder_at: '2026-08-17 11:00',
  },
  {
    id: 'debt_5',
    invoice_code: 'INV-2026-005',
    customer_name: 'Đặng Kim Ngân (Nutifood)',
    contract_code: 'HD-2026-005',
    billing_period: 'Tháng 07/2026',
    amount_due: 133000000,
    due_date: '2026-08-30',
    payment_status: 'UNPAID',
    reminder_sent_count: 0,
  },
];

let plStoreList: ContractProfitLoss[] = [...INITIAL_PL_DATA];
let debtStoreList: DebtInvoice[] = [...INITIAL_DEBT_INVOICES];

export const FINANCE_UPDATED_EVENT = 'ggbg_finance_updated';

function notifyFinanceUpdate() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('ggbg_pl_data', JSON.stringify(plStoreList));
      localStorage.setItem('ggbg_debt_data', JSON.stringify(debtStoreList));
    } catch (e) {
      console.error('Error saving finance to localStorage:', e);
    }
    window.dispatchEvent(new Event(FINANCE_UPDATED_EVENT));
  }
}

if (typeof window !== 'undefined') {
  try {
    const savedPL = localStorage.getItem('ggbg_pl_data');
    if (savedPL) plStoreList = JSON.parse(savedPL);
    const savedDebt = localStorage.getItem('ggbg_debt_data');
    if (savedDebt) debtStoreList = JSON.parse(savedDebt);
  } catch (e) {
    console.error('Error loading finance from localStorage:', e);
  }
}

export function getPLStatements(): ContractProfitLoss[] {
  return plStoreList;
}

export function getDebtInvoices(): DebtInvoice[] {
  return debtStoreList;
}

export function updateDebtInvoice(id: string, fields: Partial<DebtInvoice>): DebtInvoice | undefined {
  const idx = debtStoreList.findIndex((d) => d.id === id);
  if (idx !== -1) {
    debtStoreList[idx] = { ...debtStoreList[idx], ...fields };
    notifyFinanceUpdate();
    return debtStoreList[idx];
  }
  return undefined;
}

export function getFinancialSummary(): FinancialSummary {
  const total_gross_revenue = plStoreList.reduce((sum, item) => sum + item.gross_revenue, 0);
  const total_net_profit = plStoreList.reduce((sum, item) => sum + item.net_profit, 0);
  const avg_profit_margin = total_gross_revenue > 0 ? Math.round((total_net_profit / total_gross_revenue) * 100 * 10) / 10 : 0;
  const total_overdue_debt = debtStoreList.filter((inv) => inv.payment_status === 'OVERDUE').reduce((sum, inv) => sum + inv.amount_due, 0);

  return {
    total_gross_revenue,
    total_net_profit,
    avg_profit_margin,
    total_overdue_debt,
    contracts_count: plStoreList.length,
  };
}
