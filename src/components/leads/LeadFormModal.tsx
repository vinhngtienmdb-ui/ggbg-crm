'use client';

import React, { useState } from 'react';
import { X, Save, Building2, User, ShieldCheck } from 'lucide-react';
import { Customer, CustomerEntityType, Lead, LeadSource } from '@/types';
import { LEAD_SOURCES, SALES_REPS } from '@/lib/leadStore';
import VietnamAddressPicker, { VietnamAddressValue } from '@/components/common/VietnamAddressPicker';

export type LeadFormMode = 'create' | 'edit' | 'view';

export interface LeadFormValues {
  entity_type: CustomerEntityType;
  full_name: string;
  company_name: string;
  phone: string;
  email: string;
  tax_code: string;
  id_card_number: string;
  source_name: LeadSource;
  estimated_budget: string;
  assigned_sale_name: string;
  address: string;
}

export const EMPTY_LEAD_FORM: LeadFormValues = {
  entity_type: 'ENTERPRISE',
  full_name: '',
  company_name: '',
  phone: '',
  email: '',
  tax_code: '',
  id_card_number: '',
  source_name: 'Facebook Lead Ads',
  estimated_budget: '150000000',
  assigned_sale_name: SALES_REPS[0],
  address: '',
};

export function toLeadForm(lead: Lead): LeadFormValues {
  return {
    entity_type: lead.entity_type,
    full_name: lead.full_name,
    company_name: lead.company_name ?? '',
    phone: lead.phone,
    email: lead.email ?? '',
    tax_code: lead.tax_code ?? '',
    id_card_number: lead.id_card_number ?? '',
    source_name: lead.source_name,
    estimated_budget: String(lead.estimated_budget ?? 0),
    assigned_sale_name: lead.assigned_sale_name,
    address: '',
  };
}

interface LeadFormModalProps {
  mode: LeadFormMode;
  values: LeadFormValues;
  onChange: (next: LeadFormValues) => void;
  onClose: () => void;
  onSubmit: () => void;
  /** Non-empty only in create mode: pre-fill from an existing CRM customer. */
  existingCustomers?: Customer[];
  onPickCustomer?: (c: Customer) => void;
  error?: string;
  leadCount: number;
}

const TITLES: Record<LeadFormMode, string> = {
  create: '＋ Tạo Lead vào phễu',
  edit: '✎ Sửa thông tin Lead',
  view: '👁 Chi tiết Lead',
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="dc-label">{label}</label>
      {children}
    </div>
  );
}

export default function LeadFormModal({
  mode,
  values,
  onChange,
  onClose,
  onSubmit,
  existingCustomers = [],
  onPickCustomer,
  error,
  leadCount,
}: LeadFormModalProps) {
  const readOnly = mode === 'view';
  const isEnterprise = values.entity_type === 'ENTERPRISE';
  const [showCustomerPicker, setShowCustomerPicker] = useState(false);
  const [addressData, setAddressData] = useState<VietnamAddressValue>({
    provinceCode: '',
    provinceName: '',
    wardCode: '',
    wardName: '',
    detailAddress: '',
    fullAddress: values.address,
  });

  const set = <K extends keyof LeadFormValues>(key: K, value: LeadFormValues[K]) =>
    onChange({ ...values, [key]: value });

  return (
    <div onClick={onClose} className="dc-scrim flex items-center justify-center p-5">
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={TITLES[mode]}
        className="max-h-[88vh] w-[min(620px,96vw)] overflow-y-auto rounded-[14px] bg-white animate-fadeUpFast"
      >
        <div className="dc-modal-head sticky top-0 z-10 bg-white">
          <h2 className="text-sm font-extrabold text-ink-900">{TITLES[mode]}</h2>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-line-soft text-ink-700 hover:bg-line"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="flex flex-col gap-3 px-[22px] py-[18px]">
            {mode === 'create' && existingCustomers.length > 0 && (
              <div className="rounded-[10px] border border-line-softer bg-surface-subtle p-3">
                <button
                  type="button"
                  onClick={() => setShowCustomerPicker((v) => !v)}
                  className="dc-btn-soft w-full"
                >
                  🔎 Chọn từ khách hàng hiện hữu ({existingCustomers.length})
                </button>

                {showCustomerPicker && (
                  <div className="mt-2 flex max-h-[160px] flex-col gap-1 overflow-y-auto">
                    {existingCustomers.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          onPickCustomer?.(c);
                          setShowCustomerPicker(false);
                        }}
                        className="rounded-lg border border-line bg-white px-3 py-2 text-left text-[11.5px] hover:border-brand-600"
                      >
                        <span className="font-bold text-ink-900">{c.company_name || c.name}</span>
                        <span className="text-ink-500"> · {c.customer_code} · {c.phone}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Entity type */}
            <div>
              <label className="dc-label">LOẠI THỂ NHÂN</label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'ENTERPRISE' as const, label: 'Doanh nghiệp', Icon: Building2 },
                    { id: 'INDIVIDUAL' as const, label: 'Cá nhân / HKD', Icon: User },
                  ]
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={readOnly}
                    onClick={() => set('entity_type', opt.id)}
                    className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-[12px] font-bold transition-colors disabled:opacity-60 ${
                      values.entity_type === opt.id
                        ? 'border-brand-600 bg-brand-600 text-white'
                        : 'border-line bg-white text-ink-700 hover:border-line-strong'
                    }`}
                  >
                    <opt.Icon className="h-4 w-4" />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <Field label="HỌ TÊN LIÊN HỆ *">
              <input
                className="dc-input"
                value={values.full_name}
                disabled={readOnly}
                onChange={(e) => set('full_name', e.target.value)}
                placeholder="VD: Nguyễn Văn A"
              />
            </Field>

            <Field label="SHOP / CÔNG TY">
              <input
                className="dc-input"
                value={values.company_name}
                disabled={readOnly}
                onChange={(e) => set('company_name', e.target.value)}
                placeholder="VD: Shop Giày ABC"
              />
            </Field>

            <div className="grid gap-2.5 sm:grid-cols-2">
              <Field label="SỐ ĐIỆN THOẠI *">
                <input
                  className="dc-input dc-num"
                  value={values.phone}
                  disabled={readOnly}
                  onChange={(e) => set('phone', e.target.value)}
                  placeholder="09xx xxx xxx"
                />
              </Field>
              <Field label="NGÂN SÁCH (₫)">
                <input
                  className="dc-input dc-num"
                  inputMode="numeric"
                  value={values.estimated_budget}
                  disabled={readOnly}
                  onChange={(e) => set('estimated_budget', e.target.value)}
                  placeholder="150000000"
                />
              </Field>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              <Field label="EMAIL">
                <input
                  className="dc-input"
                  type="email"
                  value={values.email}
                  disabled={readOnly}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="email@shop.vn"
                />
              </Field>
              {isEnterprise ? (
                <Field label="MÃ SỐ THUẾ">
                  <input
                    className="dc-input dc-num"
                    value={values.tax_code}
                    disabled={readOnly}
                    onChange={(e) => set('tax_code', e.target.value)}
                  />
                </Field>
              ) : (
                <Field label="SỐ CCCD">
                  <input
                    className="dc-input dc-num"
                    value={values.id_card_number}
                    disabled={readOnly}
                    onChange={(e) => set('id_card_number', e.target.value)}
                  />
                </Field>
              )}
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              <Field label="NGUỒN LEAD">
                <select
                  className="dc-select"
                  value={values.source_name}
                  disabled={readOnly}
                  onChange={(e) => set('source_name', e.target.value as LeadSource)}
                >
                  {LEAD_SOURCES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                  {/* Keep the current value selectable even if it is a legacy source. */}
                  {!LEAD_SOURCES.includes(values.source_name) && (
                    <option value={values.source_name}>{values.source_name}</option>
                  )}
                </select>
              </Field>
              <Field label="SALE PHỤ TRÁCH">
                <select
                  className="dc-select"
                  value={values.assigned_sale_name}
                  disabled={readOnly}
                  onChange={(e) => set('assigned_sale_name', e.target.value)}
                >
                  {SALES_REPS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                  {!SALES_REPS.includes(values.assigned_sale_name) && (
                    <option value={values.assigned_sale_name}>{values.assigned_sale_name}</option>
                  )}
                </select>
              </Field>
            </div>

            {!readOnly && (
              <div className="rounded-[10px] border border-line-softer bg-surface-subtle p-3">
                <VietnamAddressPicker
                  value={addressData}
                  onChange={(next) => {
                    setAddressData(next);
                    set('address', next.fullAddress);
                  }}
                />
              </div>
            )}

            {error && (
              <p className="rounded-lg border border-danger-border bg-danger-bg px-3 py-2 text-[11.5px] font-semibold text-danger-fg">
                {error}
              </p>
            )}

            {mode === 'create' && (
              <p className="flex items-start gap-1.5 rounded-lg border border-line-softer bg-surface-subtle px-3 py-2 text-[10.5px] text-ink-500">
                <ShieldCheck className="mt-px h-3.5 w-3.5 shrink-0" />
                Hệ thống tự động kiểm tra trùng SĐT với {leadCount} lead hiện có trước khi tạo.
              </p>
            )}
          </div>

          <div className="dc-modal-foot sticky bottom-0 bg-white">
            <button type="button" onClick={onClose} className="dc-btn-ghost">
              {readOnly ? 'Đóng' : 'Hủy'}
            </button>
            {!readOnly && (
              <button type="submit" className="dc-btn-primary">
                <Save className="h-3.5 w-3.5" />
                {mode === 'edit' ? 'Lưu thay đổi' : 'Tạo Lead'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
