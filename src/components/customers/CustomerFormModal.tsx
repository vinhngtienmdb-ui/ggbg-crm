'use client';

import React, { useState } from 'react';
import { X, Save, Building2, User } from 'lucide-react';
import {
  CustomerEntityType,
  CustomerTier,
  CustomerType,
  EcomPlatform,
  LifecycleStage,
} from '@/types';
import { ExtendedCustomer, SALE_OWNERS } from '@/lib/customerStore';
import { PLATFORM_CHIP, LIFECYCLE_LABEL } from '@/lib/uiFormat';
import VietnamAddressPicker, { VietnamAddressValue } from '@/components/common/VietnamAddressPicker';

/** Everything the create/edit form collects, as strings ready for inputs. */
export interface CustomerFormValues {
  customer_code: string;
  entity_type: CustomerEntityType;
  name: string;
  company_name: string;
  tax_code: string;
  representative_name: string;
  id_card_number: string;
  id_card_issue_date: string;
  id_card_issue_place: string;
  phone: string;
  email: string;
  address: string;
  customer_type: CustomerType;
  tier: CustomerTier;
  lifecycle_stage: LifecycleStage;
  avg_monthly_gmv: string;
  owner_name: string;
  bank_account: string;
  bank_name: string;
  credit_limit: string;
  notes: string;
  ecom_platforms: EcomPlatform[];
}

export const EMPTY_CUSTOMER_FORM: CustomerFormValues = {
  customer_code: '',
  entity_type: 'ENTERPRISE',
  name: '',
  company_name: '',
  tax_code: '',
  representative_name: '',
  id_card_number: '',
  id_card_issue_date: '',
  id_card_issue_place: '',
  phone: '',
  email: '',
  address: '',
  customer_type: 'B2B_Agency_Service',
  tier: 'Standard',
  lifecycle_stage: 'Prospect',
  avg_monthly_gmv: '0',
  owner_name: SALE_OWNERS[0],
  bank_account: '',
  bank_name: '',
  credit_limit: '0',
  notes: '',
  ecom_platforms: ['Shopee', 'TikTokShop'],
};

/** Map an existing record back onto the form. */
export function toCustomerForm(c: ExtendedCustomer): CustomerFormValues {
  return {
    customer_code: c.customer_code,
    entity_type: c.entity_type,
    name: c.name,
    company_name: c.company_name ?? '',
    tax_code: c.tax_code ?? '',
    representative_name: c.representative_name ?? '',
    id_card_number: c.id_card_number ?? '',
    id_card_issue_date: c.id_card_issue_date ?? '',
    id_card_issue_place: c.id_card_issue_place ?? '',
    phone: c.phone,
    email: c.email ?? '',
    address: c.address ?? '',
    customer_type: c.customer_type,
    tier: c.tier,
    lifecycle_stage: c.lifecycle_stage,
    avg_monthly_gmv: String(c.avg_monthly_gmv ?? 0),
    owner_name: c.owner_name,
    bank_account: c.bank_account ?? '',
    bank_name: c.bank_name ?? '',
    credit_limit: String(c.credit_limit ?? 0),
    notes: c.notes ?? '',
    ecom_platforms: c.ecom_platforms,
  };
}

const ALL_PLATFORMS = Object.keys(PLATFORM_CHIP) as EcomPlatform[];
const TIERS: CustomerTier[] = ['Standard', 'Silver', 'Gold', 'VIP'];
const LIFECYCLES: LifecycleStage[] = ['Prospect', 'Regular', 'VIP', 'At-Risk', 'Churned'];

interface CustomerFormModalProps {
  mode: 'create' | 'edit';
  values: CustomerFormValues;
  onChange: (next: CustomerFormValues) => void;
  onClose: () => void;
  onSubmit: () => void;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="dc-label">{label}</label>
      {children}
    </div>
  );
}

export default function CustomerFormModal({
  mode,
  values,
  onChange,
  onClose,
  onSubmit,
}: CustomerFormModalProps) {
  const isEnterprise = values.entity_type === 'ENTERPRISE';
  const set = <K extends keyof CustomerFormValues>(key: K, value: CustomerFormValues[K]) =>
    onChange({ ...values, [key]: value });

  const [addressData, setAddressData] = useState<VietnamAddressValue>({
    provinceCode: '',
    provinceName: '',
    wardCode: '',
    wardName: '',
    detailAddress: values.address,
    fullAddress: values.address,
  });

  const togglePlatform = (p: EcomPlatform) => {
    const next = values.ecom_platforms.includes(p)
      ? values.ecom_platforms.filter((x) => x !== p)
      : [...values.ecom_platforms, p];
    set('ecom_platforms', next);
  };

  return (
    <div onClick={onClose} className="dc-scrim flex items-center justify-center p-5">
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={mode === 'edit' ? 'Sửa khách hàng' : 'Tạo khách hàng'}
        className="max-h-[88vh] w-[min(680px,96vw)] overflow-y-auto rounded-[14px] bg-white animate-fadeUpFast"
      >
        <div className="dc-modal-head sticky top-0 z-10 bg-white">
          <h2 className="text-sm font-extrabold text-ink-900">
            {mode === 'edit' ? '✎ Sửa thông tin Khách hàng' : '＋ Tạo Khách hàng mới'}
          </h2>
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
            {/* Entity type */}
            <div>
              <label className="dc-label">LOẠI KHÁCH HÀNG</label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'ENTERPRISE' as const, label: 'B2B Doanh nghiệp', Icon: Building2 },
                    { id: 'INDIVIDUAL' as const, label: 'B2C Cá nhân / HKD', Icon: User },
                  ]
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => set('entity_type', opt.id)}
                    className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-[12px] font-bold transition-colors ${
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

            <div className="grid gap-2.5 sm:grid-cols-2">
              <Field label="MÃ KHÁCH HÀNG">
                <input
                  className="dc-input"
                  value={values.customer_code}
                  onChange={(e) => set('customer_code', e.target.value)}
                  placeholder="KH-8806"
                  disabled={mode === 'edit'}
                />
              </Field>
              <Field label={isEnterprise ? 'TÊN CÔNG TY *' : 'TÊN HỘ KINH DOANH *'}>
                <input
                  className="dc-input"
                  value={values.company_name}
                  onChange={(e) => set('company_name', e.target.value)}
                  placeholder="VD: Công ty TNHH ABC"
                />
              </Field>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              <Field label="NGƯỜI ĐẠI DIỆN *">
                <input
                  className="dc-input"
                  value={values.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="VD: Nguyễn Văn A"
                />
              </Field>
              <Field label="SỐ ĐIỆN THOẠI *">
                <input
                  className="dc-input"
                  value={values.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  placeholder="09xx xxx xxx"
                />
              </Field>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              <Field label="EMAIL">
                <input
                  className="dc-input"
                  type="email"
                  value={values.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="email@congty.vn"
                />
              </Field>
              {isEnterprise ? (
                <Field label="MÃ SỐ THUẾ">
                  <input
                    className="dc-input dc-num"
                    value={values.tax_code}
                    onChange={(e) => set('tax_code', e.target.value)}
                    placeholder="0108928374"
                  />
                </Field>
              ) : (
                <Field label="SỐ CCCD">
                  <input
                    className="dc-input dc-num"
                    value={values.id_card_number}
                    onChange={(e) => set('id_card_number', e.target.value)}
                    placeholder="001198002345"
                  />
                </Field>
              )}
            </div>

            {!isEnterprise && (
              <div className="grid gap-2.5 sm:grid-cols-2">
                <Field label="NGÀY CẤP CCCD">
                  <input
                    className="dc-input"
                    type="date"
                    value={values.id_card_issue_date}
                    onChange={(e) => set('id_card_issue_date', e.target.value)}
                  />
                </Field>
                <Field label="NƠI CẤP">
                  <input
                    className="dc-input"
                    value={values.id_card_issue_place}
                    onChange={(e) => set('id_card_issue_place', e.target.value)}
                    placeholder="Cục Cảnh Sát QLHC về TTXH"
                  />
                </Field>
              </div>
            )}

            {/* Address */}
            <div className="rounded-[10px] border border-line-softer bg-surface-subtle p-3">
              <VietnamAddressPicker
                value={addressData}
                onChange={(next) => {
                  setAddressData(next);
                  set('address', next.fullAddress);
                }}
              />
              <div className="mt-2">
                <label className="dc-label">ĐỊA CHỈ ĐẦY ĐỦ</label>
                <input
                  className="dc-input"
                  value={values.address}
                  onChange={(e) => set('address', e.target.value)}
                  placeholder="Số nhà, đường, phường/xã, tỉnh/thành"
                />
              </div>
            </div>

            {/* Classification */}
            <div className="grid gap-2.5 sm:grid-cols-3">
              <Field label="HẠNG">
                <select className="dc-select" value={values.tier} onChange={(e) => set('tier', e.target.value as CustomerTier)}>
                  {TIERS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="VÒNG ĐỜI">
                <select
                  className="dc-select"
                  value={values.lifecycle_stage}
                  onChange={(e) => set('lifecycle_stage', e.target.value as LifecycleStage)}
                >
                  {LIFECYCLES.map((l) => (
                    <option key={l} value={l}>
                      {LIFECYCLE_LABEL[l] ?? l}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="LOẠI DỊCH VỤ">
                <select
                  className="dc-select"
                  value={values.customer_type}
                  onChange={(e) => set('customer_type', e.target.value as CustomerType)}
                >
                  <option value="B2B_Agency_Service">B2B Agency Service</option>
                  <option value="GGBingoVN_Merchant">GGBingoVN Merchant</option>
                </select>
              </Field>
            </div>

            <Field label="NHÂN VIÊN QUẢN LÝ">
              <select
                className="dc-select"
                value={values.owner_name}
                onChange={(e) => set('owner_name', e.target.value)}
              >
                {SALE_OWNERS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </Field>

            {/* Platforms */}
            <div>
              <label className="dc-label">SÀN TMĐT ĐANG VẬN HÀNH</label>
              <div className="flex flex-wrap gap-1.5">
                {ALL_PLATFORMS.map((p) => {
                  const active = values.ecom_platforms.includes(p);
                  const chipColor = PLATFORM_CHIP[p];
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePlatform(p)}
                      className={`rounded-md border px-2.5 py-1.5 text-[11px] font-extrabold transition-colors ${
                        active ? 'border-brand-600' : 'border-line opacity-60 hover:opacity-100'
                      }`}
                      style={active ? { background: chipColor.bg, color: chipColor.fg } : undefined}
                    >
                      {chipColor.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Finance */}
            <div className="grid gap-2.5 sm:grid-cols-2">
              <Field label="NGÂN HÀNG">
                <input
                  className="dc-input"
                  value={values.bank_name}
                  onChange={(e) => set('bank_name', e.target.value)}
                  placeholder="Techcombank - CN Cầu Giấy"
                />
              </Field>
              <Field label="SỐ TÀI KHOẢN">
                <input
                  className="dc-input dc-num"
                  value={values.bank_account}
                  onChange={(e) => set('bank_account', e.target.value)}
                  placeholder="1903888999001"
                />
              </Field>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              <Field label="GMV TRUNG BÌNH / THÁNG (₫)">
                <input
                  className="dc-input dc-num"
                  inputMode="numeric"
                  value={values.avg_monthly_gmv}
                  onChange={(e) => set('avg_monthly_gmv', e.target.value)}
                />
              </Field>
              <Field label="HẠN MỨC CÔNG NỢ (₫)">
                <input
                  className="dc-input dc-num"
                  inputMode="numeric"
                  value={values.credit_limit}
                  onChange={(e) => set('credit_limit', e.target.value)}
                />
              </Field>
            </div>

            <Field label="GHI CHÚ">
              <textarea
                className="dc-input min-h-[70px] resize-y"
                value={values.notes}
                onChange={(e) => set('notes', e.target.value)}
                placeholder="Ghi chú nội bộ về khách hàng…"
              />
            </Field>
          </div>

          <div className="dc-modal-foot sticky bottom-0 bg-white">
            <button type="button" onClick={onClose} className="dc-btn-ghost">
              Hủy
            </button>
            <button type="submit" className="dc-btn-primary">
              <Save className="h-3.5 w-3.5" />
              {mode === 'edit' ? 'Lưu thay đổi' : 'Tạo Khách hàng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
