'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Download,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  Paperclip,
  Target,
  ArrowRight,
  Headphones,
  Sliders,
} from 'lucide-react';
import { KycDocument, LifecycleStage } from '@/types';
import {
  ExtendedCustomer,
  INITIAL_CUSTOMERS,
  SALE_OWNERS,
  nextCustomerCode,
} from '@/lib/customerStore';
import {
  KYC_CHIP,
  LIFECYCLE_LABEL,
  PLATFORM_CHIP,
  TIER_CHIP,
  avatarColor,
  fmtCompact,
  healthColor,
  initials,
  maskPhone,
  shortName,
} from '@/lib/uiFormat';
import { useToast } from '@/context/ToastContext';
import { useAudit } from '@/context/AuditContext';
import Customer360Drawer from '@/components/customers/Customer360Drawer';
import CustomerFormModal, {
  CustomerFormValues,
  EMPTY_CUSTOMER_FORM,
  toCustomerForm,
} from '@/components/customers/CustomerFormModal';
import KycUploadModal from '@/components/customers/KycUploadModal';

const LIFECYCLE_FILTERS: (LifecycleStage | 'ALL')[] = ['ALL', 'VIP', 'Regular', 'Prospect', 'At-Risk'];
const BULK_LIFECYCLES: LifecycleStage[] = ['VIP', 'Regular', 'Prospect', 'At-Risk', 'Churned'];

export default function CustomersPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { logAction } = useAudit();

  const [customers, setCustomers] = useState<ExtendedCustomer[]>(INITIAL_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [lifecycleFilter, setLifecycleFilter] = useState<LifecycleStage | 'ALL'>('ALL');
  const [entityFilter, setEntityFilter] = useState<'ALL' | 'ENTERPRISE' | 'INDIVIDUAL'>('ALL');
  const [maskEnabled, setMaskEnabled] = useState(true);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkOwner, setBulkOwner] = useState(SALE_OWNERS[0]);
  const [bulkLifecycle, setBulkLifecycle] = useState<LifecycleStage>('VIP');

  const [drawerId, setDrawerId] = useState<string | null>(null);
  const [kycTargetId, setKycTargetId] = useState<string | null>(null);

  const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null);
  const [formValues, setFormValues] = useState<CustomerFormValues>(EMPTY_CUSTOMER_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);

  /* ---------------------------------------------------------------- data -- */

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return customers.filter((c) => {
      if (lifecycleFilter !== 'ALL' && c.lifecycle_stage !== lifecycleFilter) return false;
      if (entityFilter !== 'ALL' && c.entity_type !== entityFilter) return false;
      if (!term) return true;
      return (
        c.name.toLowerCase().includes(term) ||
        c.customer_code.toLowerCase().includes(term) ||
        c.phone.replace(/\s/g, '').includes(term.replace(/\s/g, '')) ||
        (c.tax_code ?? '').includes(term) ||
        (c.id_card_number ?? '').includes(term) ||
        (c.company_name ?? '').toLowerCase().includes(term)
      );
    });
  }, [customers, searchTerm, lifecycleFilter, entityFilter]);

  const allSelected = filtered.length > 0 && filtered.every((c) => selectedIds.includes(c.id));
  const drawerCustomer = customers.find((c) => c.id === drawerId) ?? null;
  const kycCustomer = customers.find((c) => c.id === kycTargetId) ?? null;

  /* ------------------------------------------------------------ handlers -- */

  const toggleSelectAll = () =>
    setSelectedIds(allSelected ? [] : filtered.map((c) => c.id));

  const toggleSelectOne = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const openCreate = () => {
    setFormValues({ ...EMPTY_CUSTOMER_FORM, customer_code: nextCustomerCode(customers), owner_name: bulkOwner });
    setEditingId(null);
    setFormMode('create');
  };

  const openEdit = (c: ExtendedCustomer) => {
    setFormValues(toCustomerForm(c));
    setEditingId(c.id);
    setFormMode('edit');
  };

  const submitForm = () => {
    if (!formValues.company_name.trim() || !formValues.name.trim() || !formValues.phone.trim()) {
      showToast('⚠ Vui lòng nhập Tên công ty, Người đại diện và Số điện thoại.');
      return;
    }

    if (formMode === 'edit' && editingId) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? {
                ...c,
                entity_type: formValues.entity_type,
                name: formValues.name.trim(),
                company_name: formValues.company_name.trim(),
                tax_code: formValues.tax_code.trim(),
                id_card_number: formValues.id_card_number.trim(),
                id_card_issue_date: formValues.id_card_issue_date.trim(),
                id_card_issue_place: formValues.id_card_issue_place.trim(),
                phone: formValues.phone.trim(),
                email: formValues.email.trim(),
                address: formValues.address.trim(),
                customer_type: formValues.customer_type,
                tier: formValues.tier,
                lifecycle_stage: formValues.lifecycle_stage,
                avg_monthly_gmv: Number(formValues.avg_monthly_gmv) || 0,
                owner_name: formValues.owner_name,
                ecom_platforms: formValues.ecom_platforms,
                bank_account: formValues.bank_account.trim(),
                bank_name: formValues.bank_name.trim(),
                credit_limit: Number(formValues.credit_limit) || 0,
                notes: formValues.notes.trim(),
              }
            : c,
        ),
      );
      showToast(`✓ Đã lưu thay đổi khách hàng ${formValues.customer_code}`);
      logAction({
        action_type: 'CUSTOMER_UPDATE',
        action_description: `Cập nhật hồ sơ khách hàng ${formValues.customer_code} — ${formValues.company_name}`,
        resource_module: 'CUSTOMERS_360',
      });
    } else {
      const code = formValues.customer_code.trim() || nextCustomerCode(customers);
      const created: ExtendedCustomer = {
        id: `c_${Date.now()}`,
        customer_code: code,
        name: formValues.name.trim(),
        entity_type: formValues.entity_type,
        company_name: formValues.company_name.trim(),
        tax_code: formValues.tax_code.trim(),
        representative_name: formValues.name.trim(),
        id_card_number: formValues.id_card_number.trim(),
        id_card_issue_date: formValues.id_card_issue_date.trim(),
        id_card_issue_place: formValues.id_card_issue_place.trim(),
        phone: formValues.phone.trim(),
        email: formValues.email.trim(),
        address: formValues.address.trim(),
        customer_type: formValues.customer_type,
        tier: formValues.tier,
        lifecycle_stage: formValues.lifecycle_stage,
        health_score: 60,
        ltv_total_spent: 0,
        ecom_platforms: formValues.ecom_platforms.length ? formValues.ecom_platforms : ['Shopee'],
        avg_monthly_gmv: Number(formValues.avg_monthly_gmv) || 0,
        owner_name: formValues.owner_name,
        kyc_status: 'PENDING',
        bank_account: formValues.bank_account.trim(),
        bank_name: formValues.bank_name.trim(),
        credit_limit: Number(formValues.credit_limit) || 0,
        notes: formValues.notes.trim() || 'Khách hàng mới tạo từ CRM',
        tags: ['Khách mới'],
        created_at: new Date().toISOString().substring(0, 10),
      };
      setCustomers((prev) => [created, ...prev]);
      showToast(`✓ Đã tạo khách hàng mới ${code}`);
      logAction({
        action_type: 'CUSTOMER_CREATE',
        action_description: `Tạo khách hàng mới ${code} — ${created.company_name}`,
        resource_module: 'CUSTOMERS_360',
      });
    }

    setFormMode(null);
    setEditingId(null);
  };

  const removeCustomer = (c: ExtendedCustomer) => {
    setCustomers((prev) => prev.filter((x) => x.id !== c.id));
    setSelectedIds((prev) => prev.filter((id) => id !== c.id));
    if (drawerId === c.id) setDrawerId(null);
    showToast(`🗑 Đã xóa khách hàng ${c.customer_code} (${c.company_name || c.name})`);
    logAction({
      action_type: 'CUSTOMER_DELETE',
      action_description: `Xóa khách hàng ${c.customer_code} — ${c.company_name || c.name}`,
      resource_module: 'CUSTOMERS_360',
      severity: 'WARNING',
    });
  };

  const applyBulkOwner = () => {
    if (selectedIds.length === 0) return;
    setCustomers((prev) =>
      prev.map((c) => (selectedIds.includes(c.id) ? { ...c, owner_name: bulkOwner } : c)),
    );
    showToast(`✓ Đã chuyển ${selectedIds.length} khách hàng sang NV quản lý: ${bulkOwner}`);
    logAction({
      action_type: 'CUSTOMER_REASSIGN',
      action_description: `Chuyển NV quản lý hàng loạt: ${selectedIds.length} khách hàng → ${bulkOwner}`,
      resource_module: 'CUSTOMERS_360',
      severity: 'WARNING',
    });
    setSelectedIds([]);
  };

  const applyBulkLifecycle = () => {
    if (selectedIds.length === 0) return;
    setCustomers((prev) =>
      prev.map((c) => (selectedIds.includes(c.id) ? { ...c, lifecycle_stage: bulkLifecycle } : c)),
    );
    showToast(
      `✓ Đã cập nhật vòng đời [${LIFECYCLE_LABEL[bulkLifecycle] ?? bulkLifecycle}] cho ${selectedIds.length} khách hàng`,
    );
    logAction({
      action_type: 'CUSTOMER_LIFECYCLE_UPDATE',
      action_description: `Cập nhật vòng đời ${bulkLifecycle} cho ${selectedIds.length} khách hàng`,
      resource_module: 'CUSTOMERS_360',
    });
    setSelectedIds([]);
  };

  const assignCskhTask = () => {
    if (selectedIds.length === 0) return;
    const label = `Giao Task CSKH Tái Chăm Sóc — ${new Date().toLocaleDateString('vi-VN')}`;
    setCustomers((prev) =>
      prev.map((c) => (selectedIds.includes(c.id) ? { ...c, cskh_task_assigned: label } : c)),
    );
    showToast(`✓ Đã giao task CSKH tái chăm sóc cho ${selectedIds.length} khách hàng`);
    logAction({
      action_type: 'CSKH_TASK_ASSIGN',
      action_description: `Giao task CSKH tái chăm sóc cho ${selectedIds.length} khách hàng`,
      resource_module: 'CUSTOMERS_360',
    });
    setSelectedIds([]);
  };

  const toggleMask = () => {
    const next = !maskEnabled;
    setMaskEnabled(next);
    logAction({
      action_type: 'MASK_UNMASK',
      action_description: next
        ? 'Bật mask dữ liệu nhạy cảm toàn cục (SĐT, MST, CCCD)'
        : 'Tắt mask dữ liệu nhạy cảm toàn cục (SĐT, MST, CCCD)',
      resource_module: 'CUSTOMERS_360',
      severity: next ? 'INFO' : 'WARNING',
    });
  };

  const handleUnmaskRecord = (c: ExtendedCustomer) => {
    logAction({
      action_type: 'MASK_UNMASK',
      action_description: `Gỡ mask SĐT/giấy tờ khách hàng ${c.customer_code} (${c.company_name || c.name})`,
      resource_module: 'CUSTOMERS_360',
      severity: 'WARNING',
    });
    showToast('🛡 Đã gỡ mask — thao tác được ghi vào Audit Log');
  };

  const exportCsv = () => {
    const target = selectedIds.length > 0 ? customers.filter((c) => selectedIds.includes(c.id)) : filtered;
    const header = 'Mã KH,Loại,Tên KH,Công ty,MST/CCCD,SĐT,Vòng đời,Health,LTV,NV quản lý';
    const body = target.map((c) =>
      [
        c.customer_code,
        c.entity_type === 'ENTERPRISE' ? 'Doanh nghiệp' : 'Cá nhân',
        `"${c.name}"`,
        `"${c.company_name ?? ''}"`,
        c.tax_code || c.id_card_number || '',
        c.phone,
        c.lifecycle_stage,
        `${c.health_score}%`,
        c.ltv_total_spent,
        `"${c.owner_name}"`,
      ].join(','),
    );

    const uri = encodeURI(`data:text/csv;charset=utf-8,${[header, ...body].join('\n')}`);
    const link = document.createElement('a');
    link.setAttribute('href', uri);
    link.setAttribute('download', `GGBingo_Customers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`⬇ Đã xuất ${target.length} khách hàng ra Excel`);
    logAction({
      action_type: 'EXPORT_EXCEL',
      action_description: `Xuất file Excel danh sách khách hàng (${target.length} bản ghi)`,
      resource_module: 'CUSTOMERS_360',
      severity: 'WARNING',
    });
  };

  const createLeadFrom = (c: ExtendedCustomer) => {
    localStorage.setItem(
      'ggbg_pending_lead_customer',
      JSON.stringify({
        customer_id: c.id,
        customer_code: c.customer_code,
        name: c.name,
        entity_type: c.entity_type,
        company_name: c.company_name,
        tax_code: c.tax_code,
        id_card_number: c.id_card_number,
        phone: c.phone,
        email: c.email,
      }),
    );
    router.push('/leads?autoCreate=true');
  };

  const saveKycDocs = (docs: KycDocument[]) => {
    if (!kycCustomer) return;
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === kycCustomer.id
          ? { ...c, kyc_status: 'VERIFIED', kyc_documents: [...(c.kyc_documents ?? []), ...docs] }
          : c,
      ),
    );
    showToast(`✓ Đã tải lên ${docs.length} chứng từ cho ${kycCustomer.company_name || kycCustomer.name}`);
    logAction({
      action_type: 'KYC_UPLOAD',
      action_description: `Tải lên ${docs.length} chứng từ KYC cho ${kycCustomer.customer_code}`,
      resource_module: 'CUSTOMERS_360',
    });
    setKycTargetId(null);
  };

  /* -------------------------------------------------------------- render -- */

  return (
    <div className="flex flex-col gap-3.5 animate-fadeUp">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative min-w-[200px] max-w-[340px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
          <input
            className="dc-input pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm tên, mã KH, công ty, SĐT…"
          />
        </div>

        {LIFECYCLE_FILTERS.map((v) => (
          <button
            key={v}
            onClick={() => setLifecycleFilter(v)}
            className={`rounded-full border px-3 py-[7px] text-[11.5px] font-bold transition-colors ${
              lifecycleFilter === v
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'border-line bg-white text-ink-700 hover:border-line-strong'
            }`}
          >
            {LIFECYCLE_LABEL[v] ?? v}
          </button>
        ))}

        <select
          className="dc-select w-auto py-[7px] text-[11.5px] font-semibold"
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value as typeof entityFilter)}
        >
          <option value="ALL">Tất cả thể nhân</option>
          <option value="ENTERPRISE">B2B Doanh nghiệp</option>
          <option value="INDIVIDUAL">B2C Cá nhân / HKD</option>
        </select>

        <div className="flex-1" />

        <button onClick={toggleMask} className="dc-btn-ghost">
          {maskEnabled ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          Mask SĐT: {maskEnabled ? 'BẬT' : 'TẮT'}
        </button>
        <button onClick={exportCsv} className="dc-btn-ghost">
          <Download className="h-3.5 w-3.5" /> Xuất Excel
        </button>
        <button onClick={openCreate} className="dc-btn-primary">
          <Plus className="h-3.5 w-3.5" /> Tạo Khách hàng
        </button>
      </div>

      {/* Bulk action bar */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center gap-2.5 rounded-[10px] border border-brand-200 bg-brand-50 px-3.5 py-2.5 animate-fadeUpFast">
          <span className="text-xs font-extrabold text-brand-800">
            ✓ Đã chọn {selectedIds.length} khách hàng
          </span>

          <div className="flex-1" />

          <span className="text-[11.5px] font-bold text-ink-700">Chuyển NV quản lý:</span>
          <select
            className="dc-select w-auto border-brand-200 py-[7px] text-[11.5px] font-semibold"
            value={bulkOwner}
            onChange={(e) => setBulkOwner(e.target.value)}
          >
            {SALE_OWNERS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <button onClick={applyBulkOwner} className="dc-btn-primary !py-2">
            <ArrowRight className="h-3.5 w-3.5" /> Chuyển quản lý
          </button>

          <select
            className="dc-select w-auto border-brand-200 py-[7px] text-[11.5px] font-semibold"
            value={bulkLifecycle}
            onChange={(e) => setBulkLifecycle(e.target.value as LifecycleStage)}
          >
            {BULK_LIFECYCLES.map((l) => (
              <option key={l} value={l}>
                {LIFECYCLE_LABEL[l] ?? l}
              </option>
            ))}
          </select>
          <button onClick={applyBulkLifecycle} className="dc-btn-soft">
            <Sliders className="h-3.5 w-3.5" /> Đổi vòng đời
          </button>

          <button onClick={assignCskhTask} className="dc-btn-success">
            <Headphones className="h-3.5 w-3.5" /> Giao task CSKH
          </button>
          <button onClick={() => setSelectedIds([])} className="dc-btn-ghost !border-brand-200 !text-brand-800">
            Bỏ chọn
          </button>
        </div>
      )}

      {/* Table */}
      <div className="dc-card overflow-x-auto">
        <table className="dc-table min-w-[1020px]">
          <thead>
            <tr className="bg-surface-subtle">
              <th className="dc-th w-[34px] pl-3.5 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  aria-label="Chọn tất cả"
                  className="h-[15px] w-[15px] cursor-pointer accent-brand-600"
                />
              </th>
              <th className="dc-th pl-3.5">Khách hàng</th>
              <th className="dc-th">Liên hệ</th>
              <th className="dc-th">Sàn TMĐT</th>
              <th className="dc-th">Hạng / KYC</th>
              <th className="dc-th">Sức khỏe</th>
              <th className="dc-th">NV quản lý</th>
              <th className="dc-th text-right">LTV</th>
              <th className="dc-th pr-3.5 text-right">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((c) => {
              const checked = selectedIds.includes(c.id);
              const tier = TIER_CHIP[c.tier];
              const kyc = KYC_CHIP[c.kyc_status];
              const health = healthColor(c.health_score);

              return (
                <tr
                  key={c.id}
                  onClick={() => setDrawerId(c.id)}
                  className={`dc-row cursor-pointer ${checked ? 'bg-brand-50' : ''}`}
                >
                  <td
                    className="dc-td pl-3.5 text-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelectOne(c.id);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSelectOne(c.id)}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Chọn ${c.customer_code}`}
                      className="h-[15px] w-[15px] cursor-pointer accent-brand-600"
                    />
                  </td>

                  <td className="dc-td pl-3.5">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] text-xs font-extrabold text-white"
                        style={{ background: avatarColor(c.company_name || c.name) }}
                      >
                        {initials(c.company_name || c.name)}
                      </span>
                      <div className="min-w-0">
                        <p className="font-bold text-ink-900">{c.company_name || c.name}</p>
                        <p className="text-[10.5px] text-ink-500">
                          {c.customer_code} · {c.name} ·{' '}
                          {c.entity_type === 'ENTERPRISE' ? 'Doanh nghiệp' : 'Cá nhân/HKD'}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="dc-td">
                    <p className="dc-num font-semibold text-ink-900">
                      {maskEnabled ? maskPhone(c.phone) : c.phone}
                    </p>
                    <p className="text-[10.5px] text-ink-500">{c.email || '—'}</p>
                  </td>

                  <td className="dc-td">
                    <div className="flex flex-wrap gap-1">
                      {c.ecom_platforms.map((p) => (
                        <span
                          key={p}
                          className="dc-tag"
                          style={{ background: PLATFORM_CHIP[p].bg, color: PLATFORM_CHIP[p].fg }}
                        >
                          {PLATFORM_CHIP[p].label}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="dc-td">
                    <div className="flex flex-wrap gap-1">
                      <span className="dc-chip" style={{ background: tier.bg, color: tier.fg }}>
                        {c.tier}
                      </span>
                      <span className="dc-chip" style={{ background: kyc.bg, color: kyc.fg }}>
                        {kyc.label}
                      </span>
                    </div>
                  </td>

                  <td className="dc-td min-w-[110px]">
                    <div className="flex items-center gap-[7px]">
                      <div className="dc-bar h-1.5 flex-1">
                        <span style={{ width: `${c.health_score}%`, background: health }} />
                      </div>
                      <span className="dc-num text-[11px] font-extrabold" style={{ color: health }}>
                        {c.health_score}
                      </span>
                    </div>
                  </td>

                  <td className="dc-td">
                    <div className="flex items-center gap-[7px]">
                      <span
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-extrabold text-white"
                        style={{ background: avatarColor(c.owner_name) }}
                      >
                        {initials(c.owner_name)}
                      </span>
                      <span className="text-[11px] font-semibold text-ink-900">{shortName(c.owner_name)}</span>
                    </div>
                  </td>

                  <td className="dc-td dc-num text-right font-extrabold text-ink-900">
                    {fmtCompact(c.ltv_total_spent)}
                  </td>

                  <td className="dc-td whitespace-nowrap pr-3.5 text-right">
                    <span className="inline-flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => setDrawerId(c.id)} className="dc-btn-ghost dc-btn-xs" title="Xem hồ sơ 360°">
                        <Eye className="h-3 w-3" /> Xem
                      </button>
                      <button onClick={() => openEdit(c)} className="dc-btn-soft dc-btn-xs" title="Sửa thông tin">
                        <Edit3 className="h-3 w-3" /> Sửa
                      </button>
                      <button
                        onClick={() => setKycTargetId(c.id)}
                        className="dc-btn-ghost dc-btn-xs"
                        title="Tải chứng từ KYC"
                      >
                        <Paperclip className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => createLeadFrom(c)}
                        className="dc-btn-ghost dc-btn-xs"
                        title="Tạo Lead từ khách hàng này"
                      >
                        <Target className="h-3 w-3" />
                      </button>
                      <button onClick={() => removeCustomer(c)} className="dc-btn-danger dc-btn-xs" title="Xóa">
                        <Trash2 className="h-3 w-3" /> Xóa
                      </button>
                    </span>
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-[12.5px] text-ink-500">
                  Không tìm thấy khách hàng nào khớp bộ lọc hiện tại.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Overlays */}
      {drawerCustomer && (
        <Customer360Drawer
          customer={drawerCustomer}
          maskEnabled={maskEnabled}
          onClose={() => setDrawerId(null)}
          onUnmask={handleUnmaskRecord}
          onOpenPdf={(file) => showToast(`📄 Đang mở PDF từ Cloudflare R2: ${file}`)}
        />
      )}

      {formMode && (
        <CustomerFormModal
          mode={formMode}
          values={formValues}
          onChange={setFormValues}
          onClose={() => setFormMode(null)}
          onSubmit={submitForm}
        />
      )}

      {kycCustomer && (
        <KycUploadModal
          customer={kycCustomer}
          onClose={() => setKycTargetId(null)}
          onSubmit={saveKycDocs}
          onError={showToast}
        />
      )}
    </div>
  );
}
