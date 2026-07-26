'use client';

import React, { useState } from 'react';
import { X, Plus, Trash2, Upload } from 'lucide-react';
import { KycDocument } from '@/types';
import { ExtendedCustomer } from '@/lib/customerStore';
export interface UploadRow {
  id: string;
  category: KycDocument['doc_type'];
  fileName: string;
}

const DOC_TYPES: { value: KycDocument['doc_type']; label: string }[] = [
  { value: 'GPKD', label: 'Giấy phép kinh doanh' },
  { value: 'CCCD_FRONT', label: 'CCCD — mặt trước' },
  { value: 'CCCD_BACK', label: 'CCCD — mặt sau' },
  { value: 'AUTHORIZATION_LETTER', label: 'Giấy ủy quyền' },
  { value: 'PASSPORT', label: 'Hộ chiếu' },
  { value: 'CONTRACT', label: 'Hợp đồng' },
];

interface KycUploadModalProps {
  customer: ExtendedCustomer;
  onClose: () => void;
  onSubmit: (docs: KycDocument[]) => void;
  onError: (message: string) => void;
}

export default function KycUploadModal({ customer, onClose, onSubmit, onError }: KycUploadModalProps) {
  const [rows, setRows] = useState<UploadRow[]>([{ id: 'row_1', category: 'GPKD', fileName: '' }]);

  const addRow = () =>
    setRows((prev) => [...prev, { id: `row_${Date.now()}`, category: 'GPKD', fileName: '' }]);

  const removeRow = (id: string) => setRows((prev) => (prev.length === 1 ? prev : prev.filter((r) => r.id !== id)));

  const patchRow = (id: string, patch: Partial<UploadRow>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = rows.filter((r) => r.fileName.trim().length > 0);
    if (valid.length === 0) {
      onError('⚠ Vui lòng nhập hoặc chọn ít nhất 1 tệp chứng từ.');
      return;
    }

    const docs: KycDocument[] = valid.map((r, idx) => ({
      doc_id: `doc_${Date.now()}_${idx}`,
      doc_type: r.category,
      doc_name: r.fileName.trim(),
      file_r2_path: `storage.ggbingo.vn/documents/${r.fileName.trim()}`,
      uploaded_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'VALID',
    }));

    onSubmit(docs);
  };

  return (
    <div onClick={onClose} className="dc-scrim flex items-center justify-center p-5">
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Tải chứng từ KYC"
        className="max-h-[88vh] w-[min(560px,96vw)] overflow-y-auto rounded-[14px] bg-white animate-fadeUpFast"
      >
        <div className="dc-modal-head">
          <div>
            <h2 className="text-sm font-extrabold text-ink-900">📎 Tải chứng từ KYC</h2>
            <p className="text-[11px] text-ink-500">
              {customer.customer_code} · {customer.company_name || customer.name}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-line-soft text-ink-700 hover:bg-line"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2.5 px-[22px] py-[18px]">
            {rows.map((row) => (
              <div key={row.id} className="flex items-end gap-2">
                <div className="w-[190px] shrink-0">
                  <label className="dc-label">LOẠI CHỨNG TỪ</label>
                  <select
                    className="dc-select"
                    value={row.category}
                    onChange={(e) => patchRow(row.id, { category: e.target.value as KycDocument['doc_type'] })}
                  >
                    {DOC_TYPES.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="min-w-0 flex-1">
                  <label className="dc-label">TÊN TỆP</label>
                  <input
                    className="dc-input"
                    value={row.fileName}
                    onChange={(e) => patchRow(row.id, { fileName: e.target.value })}
                    placeholder="VD: GPKD_CongTyABC.pdf"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeRow(row.id)}
                  disabled={rows.length === 1}
                  aria-label="Xóa dòng"
                  className="dc-btn-danger mb-px h-[38px] w-[38px] shrink-0 !px-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}

            <button type="button" onClick={addRow} className="dc-btn-soft self-start">
              <Plus className="h-3.5 w-3.5" /> Thêm dòng
            </button>

            <p className="rounded-lg border border-line-softer bg-surface-subtle px-3 py-2 text-[10.5px] text-ink-500">
              🛡 Tệp được lưu trên Cloudflare R2. Sau khi tải lên, trạng thái KYC của khách hàng chuyển sang
              <b> Đã xác minh</b>.
            </p>
          </div>

          <div className="dc-modal-foot">
            <button type="button" onClick={onClose} className="dc-btn-ghost">
              Hủy
            </button>
            <button type="submit" className="dc-btn-primary">
              <Upload className="h-3.5 w-3.5" /> Tải lên
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
