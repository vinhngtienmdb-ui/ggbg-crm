/**
 * Lớp dữ liệu Tài Chính — CHẾ ĐỘ KÉP (dual-mode), CHỈ DÙNG Ở SERVER.
 *
 *  - Khi có biến môi trường Supabase (isSupabaseEnabled): đọc/ghi bảng
 *    `finance_transactions` (id, type, category, amount numeric, txn_date date,
 *    data jsonb). Cột `type` = 'PL' | 'DEBT' để phân tách hai loại bản ghi:
 *      • 'PL'   → báo cáo lợi nhuận gộp từng hợp đồng (ContractProfitLoss).
 *      • 'DEBT' → hoá đơn công nợ & nhắc nợ (DebtInvoice).
 *    Cột `data` (jsonb) lưu TOÀN BỘ object gốc để giữ đúng shape khi đọc lại.
 *  - Khi CHƯA bật: thao tác trên mảng in-memory khởi tạo từ dữ liệu mẫu.
 *
 * Mọi lỗi Supabase được bắt gọn và fallback về in-memory để không làm sập app.
 *
 * ⚠️ KHÔNG import file này vào client component (dùng service role, chỉ server).
 * Theo đúng KHUÔN MẪU của customersRepo.ts.
 */
import { isSupabaseEnabled, getSupabaseAdmin } from './supabaseServer';
import { ContractProfitLoss, DebtInvoice } from '@/types/finance';
import { INITIAL_PL_DATA, INITIAL_DEBT_INVOICES } from './financeStore';

type FinanceType = 'PL' | 'DEBT';
type FinanceRecord = ContractProfitLoss | DebtInvoice;

// Store in-memory (fallback) — tách riêng hai loại bản ghi.
let memoryPl: ContractProfitLoss[] = INITIAL_PL_DATA.map((x) => ({ ...x }));
let memoryDebt: DebtInvoice[] = INITIAL_DEBT_INVOICES.map((x) => ({ ...x }));

/** Nhận diện bản ghi công nợ (DebtInvoice) dựa trên các trường đặc trưng. */
function isDebt(obj: any): boolean {
  return Boolean(
    obj && (obj.invoice_code !== undefined || obj.payment_status !== undefined || obj.amount_due !== undefined)
  );
}

/** Ghép row DB (jsonb `data` + id) về đúng shape gốc. */
function rowToFinance(row: any): FinanceRecord {
  const data = (row?.data ?? {}) as Partial<FinanceRecord>;
  return { ...(data as FinanceRecord), id: row.id };
}

/** Map object -> hàng ghi vào bảng (cột truy vấn + data jsonb). */
function financeToRow(obj: FinanceRecord) {
  const o: any = obj;
  const debt = isDebt(o);
  return {
    id: o.id,
    type: (debt ? 'DEBT' : 'PL') as FinanceType,
    category: debt ? (o.payment_status ?? null) : (o.ecom_platform ?? null),
    amount: debt
      ? typeof o.amount_due === 'number'
        ? o.amount_due
        : null
      : typeof o.net_profit === 'number'
        ? o.net_profit
        : null,
    txn_date: debt ? (o.due_date ?? null) : null,
    data: o,
  };
}

/** Đọc toàn bộ dữ liệu tài chính, tách thành P&L và công nợ. */
export async function listFinance(): Promise<{ plStatements: ContractProfitLoss[]; debtInvoices: DebtInvoice[] }> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('finance_transactions')
          .select('id, type, data')
          .order('id', { ascending: true });
        if (error) throw error;
        if (Array.isArray(data)) {
          const plStatements: ContractProfitLoss[] = [];
          const debtInvoices: DebtInvoice[] = [];
          for (const row of data) {
            const obj = rowToFinance(row);
            if (row.type === 'DEBT') debtInvoices.push(obj as DebtInvoice);
            else plStatements.push(obj as ContractProfitLoss);
          }
          return { plStatements, debtInvoices };
        }
      } catch (err) {
        console.error('[financeRepo.listFinance] Supabase error, fallback in-memory:', err);
      }
    }
  }
  return {
    plStatements: memoryPl.map((x) => ({ ...x })),
    debtInvoices: memoryDebt.map((x) => ({ ...x })),
  };
}

/** Tạo mới một bản ghi tài chính (PL hoặc DEBT). */
export async function createFinance(obj: FinanceRecord): Promise<FinanceRecord> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('finance_transactions')
          .insert(financeToRow(obj))
          .select('id, type, data')
          .single();
        if (error) throw error;
        if (data) return rowToFinance(data);
      } catch (err) {
        console.error('[financeRepo.createFinance] Supabase error, fallback in-memory:', err);
      }
    }
  }
  if (isDebt(obj)) memoryDebt = [obj as DebtInvoice, ...memoryDebt];
  else memoryPl = [obj as ContractProfitLoss, ...memoryPl];
  return obj;
}

/** Cập nhật một phần bản ghi tài chính theo id. */
export async function updateFinance(
  id: string,
  patch: Partial<FinanceRecord>
): Promise<FinanceRecord | null> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data: existing, error: readErr } = await supabase
          .from('finance_transactions')
          .select('id, type, data')
          .eq('id', id)
          .single();
        if (readErr) throw readErr;
        const merged = { ...rowToFinance(existing), ...patch, id } as FinanceRecord;
        const { data, error } = await supabase
          .from('finance_transactions')
          .update(financeToRow(merged))
          .eq('id', id)
          .select('id, type, data')
          .single();
        if (error) throw error;
        if (data) return rowToFinance(data);
      } catch (err) {
        console.error('[financeRepo.updateFinance] Supabase error, fallback in-memory:', err);
      }
    }
  }
  let updated: FinanceRecord | null = null;
  memoryDebt = memoryDebt.map((d) => {
    if (d.id === id) {
      updated = { ...d, ...patch, id } as DebtInvoice;
      return updated as DebtInvoice;
    }
    return d;
  });
  if (!updated) {
    memoryPl = memoryPl.map((p) => {
      if (p.id === id) {
        updated = { ...p, ...patch, id } as ContractProfitLoss;
        return updated as ContractProfitLoss;
      }
      return p;
    });
  }
  return updated;
}

/**
 * Nạp dữ liệu mẫu (UPSERT toàn bộ INITIAL P&L + công nợ, idempotent).
 * Trả về số bản ghi đã nạp. Khi chưa bật Supabase: reset store in-memory.
 */
export async function seedFinance(): Promise<number> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const rows = [
          ...INITIAL_PL_DATA.map((x) => financeToRow(x)),
          ...INITIAL_DEBT_INVOICES.map((x) => financeToRow(x)),
        ];
        const { error } = await supabase.from('finance_transactions').upsert(rows, { onConflict: 'id' });
        if (error) throw error;
        return rows.length;
      } catch (err) {
        console.error('[financeRepo.seedFinance] Supabase error, fallback in-memory:', err);
      }
    }
  }
  memoryPl = INITIAL_PL_DATA.map((x) => ({ ...x }));
  memoryDebt = INITIAL_DEBT_INVOICES.map((x) => ({ ...x }));
  return memoryPl.length + memoryDebt.length;
}
