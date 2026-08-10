import { ContractProfitLoss, DebtInvoice, FinancialSummary } from '@/types/finance';

export const INITIAL_PL_DATA: ContractProfitLoss[] = [];

export const INITIAL_DEBT_INVOICES: DebtInvoice[] = [];

export function getFinancialSummary(): FinancialSummary {
  const total_gross_revenue = INITIAL_PL_DATA.reduce((sum, item) => sum + item.gross_revenue, 0);
  const total_net_profit = INITIAL_PL_DATA.reduce((sum, item) => sum + item.net_profit, 0);
  const avg_profit_margin = Math.round((total_net_profit / total_gross_revenue) * 100 * 10) / 10;
  const total_overdue_debt = INITIAL_DEBT_INVOICES.filter((inv) => inv.payment_status === 'OVERDUE').reduce((sum, inv) => sum + inv.amount_due, 0);

  return {
    total_gross_revenue,
    total_net_profit,
    avg_profit_margin,
    total_overdue_debt,
    contracts_count: INITIAL_PL_DATA.length,
  };
}
