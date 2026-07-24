export interface ContractProfitLoss {
  id: string;
  contract_code: string;
  customer_name: string;
  company_name: string;
  ecom_platform: 'Shopee Mall' | 'TikTok Shop' | 'Lazada' | 'Amazon' | 'GGBingoVN';
  monthly_gmv: number;
  commission_rate_percent: number;
  gross_revenue: number;
  ops_cost: number;
  livestream_koc_cost: number;
  platform_tech_fee: number;
  net_profit: number;
  profit_margin_percent: number;
  contract_status: 'Active' | 'Pending_Renewal' | 'Closed';
}

export interface DebtInvoice {
  id: string;
  invoice_code: string;
  customer_name: string;
  contract_code: string;
  billing_period: string;
  amount_due: number;
  due_date: string;
  payment_status: 'PAID' | 'UNPAID' | 'OVERDUE';
  reminder_sent_count: number;
  last_reminder_at?: string;
}

export interface FinancialSummary {
  total_gross_revenue: number;
  total_net_profit: number;
  avg_profit_margin: number;
  total_overdue_debt: number;
  contracts_count: number;
}
