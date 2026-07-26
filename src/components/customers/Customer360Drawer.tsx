'use client';

import React, { useState } from 'react';
import { X, Paperclip, FileText, Eye, EyeOff } from 'lucide-react';
import { ExtendedCustomer } from '@/lib/customerStore';
import {
  KYC_CHIP,
  TIER_CHIP,
  avatarColor,
  fmtCompact,
  fmtVnd,
  initials,
  maskLegalId,
  maskPhone,
} from '@/lib/uiFormat';

type DrawerTab = 'info' | 'kyc' | 'fin';

const TABS: { id: DrawerTab; label: string }[] = [
  { id: 'info', label: 'Tổng quan' },
  { id: 'kyc', label: 'KYC & Pháp lý' },
  { id: 'fin', label: 'Tài chính' },
];

interface Customer360DrawerProps {
  customer: ExtendedCustomer;
  /** Global mask switch; an individual record can still be revealed on demand. */
  maskEnabled: boolean;
  onClose: () => void;
  /** Called the first time this record's PII is revealed, so it can be audited. */
  onUnmask: (customer: ExtendedCustomer) => void;
  onOpenPdf: (fileName: string) => void;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2.5 text-xs">
      <span className="shrink-0 text-ink-500">{label}</span>
      <span className="text-right font-bold text-ink-900">{children}</span>
    </div>
  );
}

export default function Customer360Drawer({
  customer,
  maskEnabled,
  onClose,
  onUnmask,
  onOpenPdf,
}: Customer360DrawerProps) {
  const [tab, setTab] = useState<DrawerTab>('info');
  const [revealed, setRevealed] = useState(false);

  const hidden = maskEnabled && !revealed;
  const tier = TIER_CHIP[customer.tier];
  const kyc = KYC_CHIP[customer.kyc_status];
  const legalIdLabel = customer.entity_type === 'ENTERPRISE' ? 'Mã số thuế' : 'Số CCCD';
  const legalId = customer.tax_code || customer.id_card_number || '';
  const entityLabel = customer.entity_type === 'ENTERPRISE' ? 'Doanh nghiệp' : 'Cá nhân/HKD';

  const toggleReveal = () => {
    if (!revealed) onUnmask(customer);
    setRevealed((v) => !v);
  };

  const UnmaskButton = () => (
    <button
      onClick={toggleReveal}
      className="ml-2 inline-flex items-center gap-1 rounded-md border border-line bg-white px-2.5 py-[3px] text-[10px] font-extrabold text-brand-600 hover:border-brand-600"
    >
      {revealed ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
      {revealed ? 'Ẩn' : 'Xem full'}
    </button>
  );

  return (
    <>
      <div onClick={onClose} className="dc-scrim" />

      <aside
        role="dialog"
        aria-label={`Hồ sơ 360° ${customer.company_name || customer.name}`}
        className="fixed right-0 top-0 bottom-0 z-[91] flex w-[min(460px,94vw)] flex-col bg-white shadow-drawer animate-fadeUpFast"
      >
        {/* Head */}
        <div className="dc-modal-head-brand">
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-center gap-3">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[11px] text-[15px] font-extrabold text-white"
                style={{ background: avatarColor(customer.company_name || customer.name) }}
              >
                {initials(customer.company_name || customer.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[15px] font-extrabold text-brand-800">
                  {customer.company_name || customer.name}
                </p>
                <p className="text-[11px] text-ink-500">
                  {customer.customer_code} · {customer.name} · Sức khỏe {customer.health_score}/100
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Đóng"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-brand-100 bg-white text-brand-800 hover:bg-brand-50"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="dc-chip" style={{ background: tier.bg, color: tier.fg }}>
              {customer.tier}
            </span>
            <span className="dc-chip" style={{ background: kyc.bg, color: kyc.fg }}>
              KYC: {kyc.label}
            </span>
            <span className="dc-chip bg-brand-100 text-brand-800">{entityLabel}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-line">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 border-b-2 px-1.5 py-3 text-[11.5px] font-extrabold transition-colors ${
                tab === t.id ? 'border-brand-600 text-brand-600' : 'border-transparent text-ink-500'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-3.5 overflow-y-auto px-5 py-[18px]">
          {tab === 'info' && (
            <>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-[10px] border border-line-softer bg-surface-subtle p-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.6px] text-ink-400">
                    LTV Tổng chi tiêu
                  </p>
                  <p className="dc-num mt-1 text-base font-extrabold text-brand-600">
                    {fmtCompact(customer.ltv_total_spent)}
                  </p>
                </div>
                <div className="rounded-[10px] border border-line-softer bg-surface-subtle p-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.6px] text-ink-400">
                    GMV TB / tháng
                  </p>
                  <p className="dc-num mt-1 text-base font-extrabold text-ink-900">
                    {fmtCompact(customer.avg_monthly_gmv)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <Row label="Số điện thoại">
                  <span className="dc-num">{hidden ? maskPhone(customer.phone) : customer.phone}</span>
                  <UnmaskButton />
                </Row>
                <Row label="Email">{customer.email || '—'}</Row>
                <Row label="Địa chỉ">{customer.address || '—'}</Row>
                <Row label="Sale phụ trách">{customer.owner_name}</Row>
                <Row label="Ops phụ trách">{customer.ops_manager_name || '—'}</Row>
              </div>

              {customer.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {customer.tags.map((t) => (
                    <span key={t} className="rounded-full bg-plum-bg px-2.5 py-[3px] text-[10px] font-bold text-plum-fg">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'kyc' && (
            <>
              <div className="flex flex-col gap-2.5">
                <Row label={legalIdLabel}>
                  <span className="dc-num">{hidden ? maskLegalId(legalId) : legalId || '—'}</span>
                  <UnmaskButton />
                </Row>
                <Row label="Hợp đồng R2">
                  {customer.contract_r2_file ? (
                    <button
                      onClick={() => onOpenPdf(customer.contract_r2_file as string)}
                      className="inline-flex items-center gap-1 font-extrabold text-brand-600 hover:text-brand-800"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      {customer.contract_r2_file}
                    </button>
                  ) : (
                    '—'
                  )}
                </Row>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-[10.5px] font-extrabold uppercase tracking-[0.7px] text-ink-500">
                  Chứng từ KYC
                </p>

                {(customer.kyc_documents ?? []).length === 0 && (
                  <p className="rounded-[9px] border border-dashed border-line-muted px-3 py-6 text-center text-[11.5px] text-ink-500">
                    Chưa có chứng từ nào được tải lên.
                  </p>
                )}

                {(customer.kyc_documents ?? []).map((doc) => (
                  <div
                    key={doc.doc_id}
                    className="flex items-center gap-2.5 rounded-[9px] border border-line px-3 py-2.5"
                  >
                    <Paperclip className="h-4 w-4 shrink-0 text-ink-400" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11.5px] font-bold text-ink-900">{doc.doc_name}</p>
                      <p className="text-[10px] text-ink-500">
                        {doc.doc_type} · {doc.uploaded_at}
                      </p>
                    </div>
                    <span className="dc-chip bg-success-bg text-success-fg">{doc.status}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'fin' && (
            <div className="flex flex-col gap-2.5">
              <Row label="Ngân hàng">{customer.bank_name || '—'}</Row>
              <Row label="Số tài khoản">
                <span className="dc-num">{customer.bank_account || '—'}</span>
              </Row>
              <Row label="Hạn mức công nợ">
                <span className="dc-num text-brand-600">{fmtVnd(customer.credit_limit ?? 0)}</span>
              </Row>
              <Row label="Ghi chú">{customer.notes || '—'}</Row>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
