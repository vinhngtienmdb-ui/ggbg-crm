import { ContractProfitLoss, DebtInvoice, FinancialSummary } from '@/types/finance';

export const INITIAL_PL_DATA: ContractProfitLoss[] = [
  {
    id: 'pl_001',
    contract_code: 'HD-2026-8801',
    customer_name: 'Trần Thanh Sơn',
    company_name: 'Công ty TNHH Vận Tải Hồng Lực',
    ecom_platform: 'Shopee Mall',
    monthly_gmv: 850000000,
    commission_rate_percent: 4.5,
    gross_revenue: 38250000,
    ops_cost: 12000000,
    livestream_koc_cost: 8000000,
    platform_tech_fee: 2500000,
    net_profit: 15750000,
    profit_margin_percent: 41.2,
    contract_status: 'Active',
  },
  {
    id: 'pl_002',
    contract_code: 'HD-2026-8802',
    customer_name: 'Nguyễn Thị Hoa',
    company_name: 'Hộ Kinh Doanh Thời Trang An An',
    ecom_platform: 'TikTok Shop',
    monthly_gmv: 450000000,
    commission_rate_percent: 5.0,
    gross_revenue: 22500000,
    ops_cost: 6500000,
    livestream_koc_cost: 5000000,
    platform_tech_fee: 1500000,
    net_profit: 9500000,
    profit_margin_percent: 42.2,
    contract_status: 'Active',
  },
  {
    id: 'pl_003',
    contract_code: 'HD-2026-8803',
    customer_name: 'Lê Hoàng Anh',
    company_name: 'Công ty CP Gia Dụng SmartHome',
    ecom_platform: 'Amazon',
    monthly_gmv: 1200000000,
    commission_rate_percent: 3.5,
    gross_revenue: 42000000,
    ops_cost: 16000000,
    livestream_koc_cost: 10000000,
    platform_tech_fee: 3000000,
    net_profit: 13000000,
    profit_margin_percent: 30.9,
    contract_status: 'Active',
  },
];

export const INITIAL_DEBT_INVOICES: DebtInvoice[] = [
  {
    id: 'inv_001',
    invoice_code: 'INV-2026-07-01',
    customer_name: 'Công ty TNHH Vận Tải Hồng Lực',
    contract_code: 'HD-2026-8801',
    billing_period: 'Tháng 07/2026',
    amount_due: 38250000,
    due_date: '2026-07-30',
    payment_status: 'PAID',
    reminder_sent_count: 0,
  },
  {
    id: 'inv_002',
    invoice_code: 'INV-2026-07-02',
    customer_name: 'Hộ Kinh Doanh Thời Trang An An',
    contract_code: 'HD-2026-8802',
    billing_period: 'Tháng 07/2026',
    amount_due: 22500000,
    due_date: '2026-07-25',
    payment_status: 'UNPAID',
    reminder_sent_count: 1,
    last_reminder_at: '2026-07-22 10:30',
  },
  {
    id: 'inv_003',
    invoice_code: 'INV-2026-06-03',
    customer_name: 'Công ty CP Gia Dụng SmartHome',
    contract_code: 'HD-2026-8803',
    billing_period: 'Tháng 06/2026',
    amount_due: 42000000,
    due_date: '2026-07-15',
    payment_status: 'OVERDUE',
    reminder_sent_count: 3,
    last_reminder_at: '2026-07-20 14:15',
  },
];

export interface ContractChartRow {
  name: string;
  fullName: string;
  revenue: number;
  cost: number;
  profit: number;
}

export interface DebtStructureRow {
  key: 'ON_TIME' | 'DUE_SOON' | 'OVERDUE';
  name: string;
  value: number;
  count: number;
}

export interface TopContractRow {
  name: string;
  fullName: string;
  profit: number;
  margin: number;
}

export interface FinanceDashboardData {
  total_revenue: number;
  total_cost: number;
  gross_profit: number;
  profit_margin: number;
  total_receivable: number;
  overdue_count: number;
  contractChart: ContractChartRow[];
  debtStructure: DebtStructureRow[];
  topContracts: TopContractRow[];
  overdueAlerts: DebtInvoice[];
}

/**
 * Tổng hợp dữ liệu cho Dashboard Tài Chính từ P&L + công nợ hiện có.
 * - Chi phí mỗi hợp đồng = ops + livestream/KOC + phí sàn/tech.
 * - Công nợ phải thu = các hóa đơn chưa PAID (UNPAID + OVERDUE).
 * - Cơ cấu công nợ: PAID → đúng hạn, UNPAID → sắp đến hạn, OVERDUE → quá hạn.
 */
export function getFinanceDashboardData(
  pl: ContractProfitLoss[] = INITIAL_PL_DATA,
  debts: DebtInvoice[] = INITIAL_DEBT_INVOICES
): FinanceDashboardData {
  const contractCost = (item: ContractProfitLoss) =>
    item.ops_cost + item.livestream_koc_cost + item.platform_tech_fee;

  const total_revenue = pl.reduce((s, i) => s + i.gross_revenue, 0);
  const total_cost = pl.reduce((s, i) => s + contractCost(i), 0);
  const gross_profit = pl.reduce((s, i) => s + i.net_profit, 0);
  const profit_margin = total_revenue
    ? Math.round((gross_profit / total_revenue) * 100 * 10) / 10
    : 0;

  const total_receivable = debts
    .filter((d) => d.payment_status !== 'PAID')
    .reduce((s, d) => s + d.amount_due, 0);
  const overdue_count = debts.filter((d) => d.payment_status === 'OVERDUE').length;

  const shortName = (item: ContractProfitLoss) => item.contract_code.replace('HD-', '');

  const contractChart: ContractChartRow[] = pl.map((item) => ({
    name: shortName(item),
    fullName: item.company_name,
    revenue: item.gross_revenue,
    cost: contractCost(item),
    profit: item.net_profit,
  }));

  const bucket = (key: DebtStructureRow['key'], name: string, status: DebtInvoice['payment_status']): DebtStructureRow => {
    const rows = debts.filter((d) => d.payment_status === status);
    return { key, name, value: rows.reduce((s, d) => s + d.amount_due, 0), count: rows.length };
  };
  const debtStructure: DebtStructureRow[] = [
    bucket('ON_TIME', 'Đúng hạn (đã thu)', 'PAID'),
    bucket('DUE_SOON', 'Sắp đến hạn', 'UNPAID'),
    bucket('OVERDUE', 'Quá hạn', 'OVERDUE'),
  ].filter((r) => r.value > 0);

  const topContracts: TopContractRow[] = [...pl]
    .sort((a, b) => b.net_profit - a.net_profit)
    .map((item) => ({
      name: shortName(item),
      fullName: item.company_name,
      profit: item.net_profit,
      margin: item.profit_margin_percent,
    }));

  const overdueAlerts = debts
    .filter((d) => d.payment_status === 'OVERDUE' || d.payment_status === 'UNPAID')
    .sort((a, b) => {
      if (a.payment_status !== b.payment_status) return a.payment_status === 'OVERDUE' ? -1 : 1;
      return a.due_date.localeCompare(b.due_date);
    });

  return {
    total_revenue,
    total_cost,
    gross_profit,
    profit_margin,
    total_receivable,
    overdue_count,
    contractChart,
    debtStructure,
    topContracts,
    overdueAlerts,
  };
}

export function getFinancialSummary(
  pl: ContractProfitLoss[] = INITIAL_PL_DATA,
  debts: DebtInvoice[] = INITIAL_DEBT_INVOICES
): FinancialSummary {
  const total_gross_revenue = pl.reduce((sum, item) => sum + item.gross_revenue, 0);
  const total_net_profit = pl.reduce((sum, item) => sum + item.net_profit, 0);
  const avg_profit_margin = total_gross_revenue
    ? Math.round((total_net_profit / total_gross_revenue) * 100 * 10) / 10
    : 0;
  const total_overdue_debt = debts.filter((inv) => inv.payment_status === 'OVERDUE').reduce((sum, inv) => sum + inv.amount_due, 0);

  return {
    total_gross_revenue,
    total_net_profit,
    avg_profit_margin,
    total_overdue_debt,
    contracts_count: pl.length,
  };
}
