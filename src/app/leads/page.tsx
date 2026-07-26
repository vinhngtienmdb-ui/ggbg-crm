'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  Plus,
  Search,
  Upload,
  LayoutGrid,
  List,
  Eye,
  Edit3,
  Trash2,
  History,
  BarChart3,
  Zap,
} from 'lucide-react';
import { Customer, Lead } from '@/types';
import { INITIAL_CUSTOMERS } from '@/lib/customerStore';
import {
  INITIAL_LEADS,
  INITIAL_STAGE_LOGS,
  LEAD_SOURCES,
  LeadStageLog,
  SALES_REPS,
  nextLeadCode,
  normalisePhone,
} from '@/lib/leadStore';
import {
  PIPELINE_STAGES,
  fmtCompact,
  leadScoreChip,
  shortName,
  stageById,
} from '@/lib/uiFormat';
import { useToast } from '@/context/ToastContext';
import { useAudit } from '@/context/AuditContext';
import LeadFormModal, {
  EMPTY_LEAD_FORM,
  LeadFormMode,
  LeadFormValues,
  toLeadForm,
} from '@/components/leads/LeadFormModal';
import StageLogDrawer from '@/components/leads/StageLogDrawer';

const BulkLeadImportModal = dynamic(() => import('@/components/leads/BulkLeadImportModal'), { ssr: false });
const ChannelAnalyticsDrawer = dynamic(() => import('@/components/leads/ChannelAnalyticsDrawer'), { ssr: false });

/** Stage a lead lands in when it converts, and the one meaning "lost". */
const CONVERTED_STAGE = 'stage_6';
const RECYCLE_STAGE = 'stage_7';

function LeadsPageInner() {
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const { logAction } = useAudit();

  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [stageLogs, setStageLogs] = useState<LeadStageLog[]>(INITIAL_STAGE_LOGS);
  const existingCustomers = INITIAL_CUSTOMERS as Customer[];

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [repFilter, setRepFilter] = useState('ALL');

  const [logDrawerOpen, setLogDrawerOpen] = useState(false);
  const [logFilter, setLogFilter] = useState('ALL');
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [channelDrawerOpen, setChannelDrawerOpen] = useState(false);

  const [formMode, setFormMode] = useState<LeadFormMode | null>(null);
  const [formValues, setFormValues] = useState<LeadFormValues>(EMPTY_LEAD_FORM);
  const [formError, setFormError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [linkedCustomerId, setLinkedCustomerId] = useState<string>('');

  /* -------------------------------------------------- pre-fill from /customers */

  useEffect(() => {
    const pendingJson = localStorage.getItem('ggbg_pending_lead_customer');
    if (!pendingJson && searchParams.get('autoCreate') !== 'true') return;

    if (pendingJson) {
      try {
        const pending = JSON.parse(pendingJson);
        setFormValues({
          ...EMPTY_LEAD_FORM,
          entity_type: pending.entity_type ?? 'ENTERPRISE',
          full_name: pending.name ?? '',
          phone: pending.phone ?? '',
          email: pending.email ?? '',
          company_name: pending.company_name ?? '',
          tax_code: pending.tax_code ?? '',
          id_card_number: pending.id_card_number ?? '',
        });
        setLinkedCustomerId(pending.customer_id ?? '');
        setEditingId(null);
        setFormMode('create');
        showToast(`🎯 Đã lấy thông tin từ khách hàng [${pending.customer_code}] ${pending.name}`);
      } catch {
        /* malformed payload — ignore and fall through to a blank form */
      } finally {
        localStorage.removeItem('ggbg_pending_lead_customer');
      }
    }
  }, [searchParams, showToast]);

  /* ---------------------------------------------------------------- derived -- */

  const filteredLeads = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return leads.filter((l) => {
      if (sourceFilter !== 'ALL' && l.source_name !== sourceFilter) return false;
      if (repFilter !== 'ALL' && l.assigned_sale_name !== repFilter) return false;
      if (!term) return true;
      return (
        l.full_name.toLowerCase().includes(term) ||
        l.lead_code.toLowerCase().includes(term) ||
        l.phone.replace(/\s/g, '').includes(term.replace(/\s/g, '')) ||
        (l.company_name ?? '').toLowerCase().includes(term)
      );
    });
  }, [leads, searchTerm, sourceFilter, repFilter]);

  const columns = useMemo(
    () =>
      PIPELINE_STAGES.map((stage) => {
        const stageLeads = filteredLeads.filter((l) => l.stage_id === stage.id);
        return {
          ...stage,
          leads: stageLeads,
          sum: stageLeads.reduce((acc, l) => acc + l.estimated_budget, 0),
        };
      }),
    [filteredLeads],
  );

  const listRows = useMemo(
    () =>
      [...filteredLeads].sort(
        (a, b) => PIPELINE_STAGES.findIndex((s) => s.id === a.stage_id) - PIPELINE_STAGES.findIndex((s) => s.id === b.stage_id),
      ),
    [filteredLeads],
  );

  const pipelineSum = filteredLeads.reduce((acc, l) => acc + l.estimated_budget, 0);

  /* --------------------------------------------------------------- mutations -- */

  const moveLeadToStage = (leadId: string, targetStageId: string, note?: string) => {
    const lead = leads.find((l) => l.id === leadId);
    const target = PIPELINE_STAGES.find((s) => s.id === targetStageId);
    if (!lead || !target || lead.stage_id === targetStageId) return;

    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? {
              ...l,
              stage_id: target.id,
              stage_name: target.name,
              status:
                targetStageId === CONVERTED_STAGE
                  ? 'Converted'
                  : targetStageId === RECYCLE_STAGE
                    ? 'Lost'
                    : 'Contacted',
            }
          : l,
      ),
    );

    setStageLogs((prev) => [
      {
        id: `log_${Date.now()}`,
        lead_code: lead.lead_code,
        lead_name: lead.full_name,
        from_stage: lead.stage_name,
        to_stage: target.name,
        actor_name: 'Super Admin (Quản trị viên)',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        note: note ?? `Chuyển bước phễu sang ${target.name}`,
      },
      ...prev,
    ]);

    showToast(`▤ ${lead.full_name} → ${target.name}`);
    logAction({
      action_type: 'LEAD_STAGE_CHANGE',
      action_description: `Chuyển Lead ${lead.lead_code} từ [${lead.stage_name}] ➔ [${target.name}]`,
      resource_module: 'LEADS_PIPELINE',
    });
  };

  const openCreate = () => {
    setFormValues(EMPTY_LEAD_FORM);
    setLinkedCustomerId('');
    setEditingId(null);
    setFormError('');
    setFormMode('create');
  };

  const openLead = (lead: Lead, mode: Exclude<LeadFormMode, 'create'>) => {
    setFormValues(toLeadForm(lead));
    setEditingId(lead.id);
    setFormError('');
    setFormMode(mode);
  };

  const submitForm = () => {
    setFormError('');
    const digits = normalisePhone(formValues.phone);

    if (!formValues.full_name.trim() || digits.length < 9) {
      setFormError('Vui lòng nhập Họ tên và Số điện thoại hợp lệ.');
      return;
    }

    if (formMode === 'edit' && editingId) {
      const clash = leads.some((l) => l.id !== editingId && normalisePhone(l.phone) === digits);
      if (clash) {
        setFormError(`⚠ Số điện thoại [${formValues.phone}] đã thuộc về một lead khác.`);
        return;
      }

      setLeads((prev) =>
        prev.map((l) =>
          l.id === editingId
            ? {
                ...l,
                entity_type: formValues.entity_type,
                full_name: formValues.full_name.trim(),
                company_name: formValues.company_name.trim() || '—',
                phone: formValues.phone.trim(),
                email: formValues.email.trim(),
                tax_code: formValues.tax_code.trim(),
                id_card_number: formValues.id_card_number.trim(),
                source_name: formValues.source_name,
                estimated_budget: Number(formValues.estimated_budget) || 0,
                assigned_sale_name: formValues.assigned_sale_name,
              }
            : l,
        ),
      );
      showToast('✓ Đã lưu thay đổi lead');
      logAction({
        action_type: 'LEAD_UPDATE',
        action_description: `Cập nhật thông tin Lead ${formValues.full_name}`,
        resource_module: 'LEADS_PIPELINE',
      });
      setFormMode(null);
      return;
    }

    // Create — block duplicates against both the funnel and the customer book.
    const dupLead = leads.some((l) => normalisePhone(l.phone) === digits);
    const dupCustomer = existingCustomers.some((c) => normalisePhone(c.phone) === digits);
    if (dupLead || dupCustomer) {
      setFormError(
        `⚠ Số điện thoại [${formValues.phone}] đã tồn tại trong hệ thống ${dupLead ? 'Lead' : 'Khách hàng'} — đã chặn tạo trùng.`,
      );
      return;
    }

    const code = nextLeadCode(leads);
    const firstStage = PIPELINE_STAGES[0];
    const created: Lead = {
      id: `lead_${Date.now()}`,
      lead_code: code,
      customer_id: linkedCustomerId || undefined,
      full_name: formValues.full_name.trim(),
      entity_type: formValues.entity_type,
      phone: formValues.phone.trim(),
      email: formValues.email.trim() || `${code.toLowerCase()}@lead.vn`,
      company_name:
        formValues.company_name.trim() ||
        (formValues.entity_type === 'ENTERPRISE' ? 'Doanh Nghiệp Mới' : 'Cá Nhân Mới'),
      tax_code: formValues.tax_code.trim(),
      id_card_number: formValues.id_card_number.trim(),
      source_name: formValues.source_name,
      pipeline_id: 'AGENCY',
      stage_id: firstStage.id,
      stage_name: firstStage.name,
      assigned_sale_name: formValues.assigned_sale_name,
      estimated_budget: Number(formValues.estimated_budget) || 0,
      lead_score: Math.floor(75 + Math.random() * 20),
      status: 'New',
      kyc_status: 'PENDING',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setLeads((prev) => [created, ...prev]);
    setStageLogs((prev) => [
      {
        id: `log_${Date.now()}`,
        lead_code: code,
        lead_name: created.full_name,
        from_stage: 'Khởi tạo hệ thống',
        to_stage: firstStage.name,
        actor_name: 'Super Admin',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        note: 'Tiếp nhận Lead mới vào phễu',
      },
      ...prev,
    ]);

    showToast(`✓ Đã tạo lead mới ${code} vào cột "${firstStage.name}"`);
    logAction({
      action_type: 'LEAD_CREATE',
      action_description: `Tạo Lead mới ${code} — ${created.full_name}`,
      resource_module: 'LEADS_PIPELINE',
    });
    setFormMode(null);
    setLinkedCustomerId('');
  };

  const removeLead = (lead: Lead) => {
    setLeads((prev) => prev.filter((l) => l.id !== lead.id));
    showToast(`🗑 Đã xóa lead ${lead.lead_code} (${lead.full_name})`);
    logAction({
      action_type: 'LEAD_DELETE',
      action_description: `Xóa Lead ${lead.lead_code} — ${lead.full_name}`,
      resource_module: 'LEADS_PIPELINE',
      severity: 'WARNING',
    });
  };

  const handleBulkImport = (imported: Lead[]) => {
    setLeads((prev) => [...imported, ...prev]);
    setStageLogs((prev) => [
      ...imported.map((l) => ({
        id: `log_imp_${l.id}`,
        lead_code: l.lead_code,
        lead_name: l.full_name,
        from_stage: 'Import Bulk Excel',
        to_stage: PIPELINE_STAGES[0].name,
        actor_name: 'Super Admin',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        note: `Import từ file Excel hàng loạt. Gán cho ${l.assigned_sale_name}`,
      })),
      ...prev,
    ]);
    showToast(`🎉 Đã nhập ${imported.length} lead mới từ file Excel vào phễu`);
    logAction({
      action_type: 'LEAD_BULK_IMPORT',
      action_description: `Nhập hàng loạt ${imported.length} lead từ Excel/CSV`,
      resource_module: 'LEADS_PIPELINE',
    });
  };

  const triggerTestWebhook = async () => {
    try {
      const res = await fetch('/api/leads/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: 'Trần Bảo An (Landing Page)',
          phone: '0988666888',
          email: 'baoan.tran@beauty.vn',
          company_name: 'Thương Hiệu Mỹ Phẩm Bảo An',
          source_name: 'Website GGBingoVN',
          estimated_budget: 180000000,
          shop_link: 'shopee.vn/baoan_cosmetics',
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setLeads((prev) => [data.data as Lead, ...prev]);
        showToast(`⚡ Đã tiếp nhận Lead Webhook: ${(data.data as Lead).full_name}`);
      } else {
        showToast('⚠ Webhook không trả về lead hợp lệ.');
      }
    } catch {
      showToast('⚠ Không gọi được webhook /api/leads/ingest.');
    }
  };

  /* ----------------------------------------------------------------- render -- */

  return (
    <div className="flex h-full flex-col gap-3.5 animate-fadeUp">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="rounded-full border border-line bg-white px-3 py-[7px] text-[11.5px] font-bold text-ink-700">
          Tổng: <b className="dc-num text-ink-900">{filteredLeads.length}</b> lead
        </span>
        <span className="rounded-full border border-line bg-white px-3 py-[7px] text-[11.5px] font-bold text-ink-700">
          Giá trị phễu: <b className="dc-num text-brand-600">{fmtCompact(pipelineSum)}</b>
        </span>

        <div className="relative min-w-[180px] max-w-[260px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
          <input
            className="dc-input pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm lead, mã, SĐT…"
          />
        </div>

        <select
          className="dc-select w-auto py-[7px] text-[11.5px] font-semibold"
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
        >
          <option value="ALL">Tất cả nguồn</option>
          {LEAD_SOURCES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          className="dc-select w-auto py-[7px] text-[11.5px] font-semibold"
          value={repFilter}
          onChange={(e) => setRepFilter(e.target.value)}
        >
          <option value="ALL">Tất cả sale</option>
          {SALES_REPS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <div className="flex-1" />

        {/* View switcher */}
        <div className="flex overflow-hidden rounded-[9px] border border-line bg-white">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-[11.5px] font-extrabold transition-colors ${
              viewMode === 'kanban' ? 'bg-brand-600 text-white' : 'text-ink-700 hover:bg-brand-50'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" /> Kanban
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-[11.5px] font-extrabold transition-colors ${
              viewMode === 'list' ? 'bg-brand-600 text-white' : 'text-ink-700 hover:bg-brand-50'
            }`}
          >
            <List className="h-3.5 w-3.5" /> List
          </button>
        </div>

        <button onClick={() => setChannelDrawerOpen(true)} className="dc-btn-ghost" title="Thống kê hiệu quả kênh">
          <BarChart3 className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => {
            setLogFilter('ALL');
            setLogDrawerOpen(true);
          }}
          className="dc-btn-ghost"
          title="Nhật ký chuyển giai đoạn"
        >
          <History className="h-3.5 w-3.5" />
        </button>
        <button onClick={triggerTestWebhook} className="dc-btn-ghost" title="Bắn thử webhook nhận lead">
          <Zap className="h-3.5 w-3.5" />
        </button>
        <button onClick={() => setBulkImportOpen(true)} className="dc-btn-ghost">
          <Upload className="h-3.5 w-3.5" /> Nhập Excel/CSV
        </button>
        <button onClick={openCreate} className="dc-btn-primary">
          <Plus className="h-3.5 w-3.5" /> Thêm Lead
        </button>
      </div>

      {/* List view ------------------------------------------------------ */}
      {viewMode === 'list' && (
        <div className="dc-card overflow-x-auto">
          <table className="dc-table min-w-[900px]">
            <thead>
              <tr className="bg-surface-subtle">
                <th className="dc-th pl-3.5">Lead</th>
                <th className="dc-th">Giai đoạn</th>
                <th className="dc-th">Nguồn</th>
                <th className="dc-th">Sale phụ trách</th>
                <th className="dc-th text-center">Điểm</th>
                <th className="dc-th text-right">Ngân sách</th>
                <th className="dc-th pr-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {listRows.map((lead) => {
                const stage = stageById(lead.stage_id);
                const score = leadScoreChip(lead.lead_score);
                return (
                  <tr key={lead.id} className="dc-row">
                    <td className="dc-td pl-3.5">
                      <p className="font-bold text-ink-900">{lead.full_name}</p>
                      <p className="text-[10.5px] text-ink-500">
                        {lead.lead_code} · {lead.company_name}
                      </p>
                    </td>
                    <td className="dc-td">
                      <span className="dc-chip bg-line-soft text-ink-700">
                        <span className="h-[7px] w-[7px] rounded-full" style={{ background: stage.color }} />
                        {stage.name}
                      </span>
                    </td>
                    <td className="dc-td">
                      <span className="dc-tag bg-plum-bg text-plum-fg">{lead.source_name}</span>
                    </td>
                    <td className="dc-td text-ink-700">{lead.assigned_sale_name}</td>
                    <td className="dc-td text-center">
                      <span className="dc-tag" style={{ background: score.bg, color: score.fg }}>
                        {lead.lead_score}
                      </span>
                    </td>
                    <td className="dc-td dc-num text-right font-extrabold text-brand-600">
                      {fmtCompact(lead.estimated_budget)}
                    </td>
                    <td className="dc-td whitespace-nowrap pr-3.5 text-right">
                      <span className="inline-flex gap-1.5">
                        <button onClick={() => openLead(lead, 'view')} className="dc-btn-ghost dc-btn-xs">
                          <Eye className="h-3 w-3" /> Xem
                        </button>
                        <button onClick={() => openLead(lead, 'edit')} className="dc-btn-soft dc-btn-xs">
                          <Edit3 className="h-3 w-3" /> Sửa
                        </button>
                        <button
                          onClick={() => {
                            setLogFilter(lead.lead_code);
                            setLogDrawerOpen(true);
                          }}
                          className="dc-btn-ghost dc-btn-xs"
                          title="Nhật ký lead này"
                        >
                          <History className="h-3 w-3" />
                        </button>
                        <button onClick={() => removeLead(lead)} className="dc-btn-danger dc-btn-xs">
                          <Trash2 className="h-3 w-3" /> Xóa
                        </button>
                      </span>
                    </td>
                  </tr>
                );
              })}

              {listRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-[12.5px] text-ink-500">
                    Không có lead nào khớp bộ lọc hiện tại.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Kanban view ---------------------------------------------------- */}
      {viewMode === 'kanban' && (
        <div className="flex flex-1 items-start gap-3 overflow-x-auto pb-2">
          {columns.map((col) => (
            <div
              key={col.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const leadId = e.dataTransfer.getData('text/plain');
                if (leadId) moveLeadToStage(leadId, col.id);
              }}
              className="flex max-h-full w-[262px] shrink-0 flex-col rounded-xl bg-line-softer"
            >
              <div
                className="flex items-center gap-2 border-b-2 px-3 pb-2 pt-3"
                style={{ borderColor: col.color }}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: col.color }} />
                <span className="flex-1 text-[11.5px] font-extrabold text-ink-900">{col.name}</span>
                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-extrabold text-ink-700">
                  {col.leads.length}
                </span>
              </div>

              <p className="dc-num px-3 py-1.5 text-[10px] font-bold text-ink-500">{fmtCompact(col.sum)}</p>

              <div className="flex min-h-[60px] flex-1 flex-col gap-2 overflow-y-auto px-2 pb-2.5">
                {col.leads.map((lead) => {
                  const score = leadScoreChip(lead.lead_score);
                  return (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('text/plain', lead.id)}
                      onDoubleClick={() => openLead(lead, 'view')}
                      className="cursor-grab rounded-[10px] border border-line bg-white px-3 py-2.5 transition-shadow hover:border-line-strong hover:shadow-drag active:cursor-grabbing"
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <p className="text-xs font-extrabold text-ink-900">{lead.full_name}</p>
                        <span
                          className="dc-tag shrink-0"
                          style={{ background: score.bg, color: score.fg }}
                        >
                          {lead.lead_score}
                        </span>
                      </div>
                      <p className="mt-px text-[10.5px] text-ink-500">{lead.company_name}</p>
                      <p className="dc-num mt-[7px] text-xs font-extrabold text-brand-600">
                        {fmtCompact(lead.estimated_budget)}
                      </p>

                      <div className="mt-2 flex items-center justify-between gap-1.5">
                        <span className="dc-tag truncate bg-plum-bg text-plum-fg">{lead.source_name}</span>
                        <span className="truncate text-[9.5px] text-ink-400">
                          {shortName(lead.assigned_sale_name)}
                        </span>
                      </div>

                      <div className="mt-2 flex gap-1.5 border-t border-line-soft pt-2">
                        <button onClick={() => openLead(lead, 'view')} className="dc-btn-ghost dc-btn-xs flex-1">
                          <Eye className="h-3 w-3" /> Xem
                        </button>
                        <button onClick={() => openLead(lead, 'edit')} className="dc-btn-soft dc-btn-xs flex-1">
                          <Edit3 className="h-3 w-3" /> Sửa
                        </button>
                        <button onClick={() => removeLead(lead)} className="dc-btn-danger dc-btn-xs">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Overlays ------------------------------------------------------- */}
      {formMode && (
        <LeadFormModal
          mode={formMode}
          values={formValues}
          onChange={setFormValues}
          onClose={() => setFormMode(null)}
          onSubmit={submitForm}
          existingCustomers={formMode === 'create' ? existingCustomers : []}
          onPickCustomer={(c) => {
            setLinkedCustomerId(c.id);
            setFormValues((prev) => ({
              ...prev,
              entity_type: c.entity_type,
              full_name: c.name,
              phone: c.phone,
              email: c.email ?? '',
              company_name: c.company_name ?? '',
              tax_code: c.tax_code ?? '',
              id_card_number: c.id_card_number ?? '',
            }));
            setFormError('');
          }}
          error={formError}
          leadCount={leads.length}
        />
      )}

      {logDrawerOpen && (
        <StageLogDrawer
          logs={stageLogs}
          leads={leads}
          filter={logFilter}
          onFilterChange={setLogFilter}
          onClose={() => setLogDrawerOpen(false)}
        />
      )}

      <BulkLeadImportModal
        isOpen={bulkImportOpen}
        onClose={() => setBulkImportOpen(false)}
        onImportSuccess={handleBulkImport}
        existingPhones={leads.map((l) => normalisePhone(l.phone))}
      />

      <ChannelAnalyticsDrawer
        isOpen={channelDrawerOpen}
        onClose={() => setChannelDrawerOpen(false)}
        leads={leads}
        onTriggerTestWebhook={triggerTestWebhook}
      />
    </div>
  );
}

export default function LeadsPage() {
  // useSearchParams needs a Suspense boundary during static prerendering.
  return (
    <Suspense fallback={<div className="p-6 text-[12.5px] text-ink-500">Đang tải phễu bán hàng…</div>}>
      <LeadsPageInner />
    </Suspense>
  );
}
