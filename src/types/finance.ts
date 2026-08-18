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
  overdue_days?: number;
}

export interface CashFlowTransaction {
  id: string;
  code: string;
  date: string;
  type: 'INCOME' | 'EXPENSE';
  category: 'Hợp Đồng Dịch Vụ' | 'Chi Lương Nhân Sự' | 'Chi Marketing Ads' | 'Chi Server & SaaS' | 'Chi Tiền Điện Nước VP' | 'Khác';
  amount: number;
  account: 'Techcombank' | 'Vietcombank' | 'Quỹ Tiền Mặt';
  description: string;
  approval_status: 'APPROVED' | 'PENDING';
}

export interface DepartmentBudget {
  id: string;
  department_name: string;
  allocated_budget: number;
  spent_amount: number;
  remaining_amount: number;
  utilization_pct: number;
  status: 'SAFE' | 'WARNING' | 'OVER_BUDGET';
}

export interface FinancialSummary {
  total_gross_revenue: number;
  total_net_profit: number;
  avg_profit_margin: number;
  total_overdue_debt: number;
  contracts_count: number;
  net_cash_flow?: number;
}

export interface CreditLimitApprovalRequest {
  id: string;
  request_code: string;
  customer_id: string;
  customer_code: string;
  customer_name: string;
  company_name?: string;
  entity_type: 'ENTERPRISE' | 'HOUSEHOLD_BUSINESS' | 'INDIVIDUAL';
  current_limit: number;
  requested_limit: number;
  reason: string;
  status: 'PENDING_SALES_DIR' | 'PENDING_CHIEF_ACCOUNTANT' | 'PENDING_CEO' | 'APPROVED' | 'REJECTED';
  rejection_reason?: string;
  sales_director_approval?: { approver_name: string; approved_at: string; status: 'APPROVED' | 'REJECTED'; note?: string };
  chief_accountant_approval?: { approver_name: string; approved_at: string; status: 'APPROVED' | 'REJECTED'; note?: string };
  ceo_approval?: { approver_name: string; approved_at: string; status: 'APPROVED' | 'REJECTED'; note?: string };
  created_at: string;
  updated_at: string;
}

