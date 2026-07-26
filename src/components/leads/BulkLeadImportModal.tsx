'use client';

import React, { useState } from 'react';
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  X,
  FileCheck,
  Users,
  ShieldAlert,
  ArrowRight,
  Filter
} from 'lucide-react';
import { Lead, BulkImportRow, CustomerEntityType, LeadSource } from '@/types';

interface BulkLeadImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (newLeads: Lead[]) => void;
  existingPhones: string[];
}

const MOCK_CSV_SAMPLE_ROWS: any[] = [
  { full_name: 'Nguyễn Hồng Lực', phone: '0988999111', email: 'luc.nguyen@logistics.vn', company_name: 'Công ty Vận Tải Hồng Lực', source_name: 'Bulk Import Excel', estimated_budget: 250000000 },
  { full_name: 'Vũ Thanh Hằng', phone: '0912345678', email: 'hang.vu@cosmetics.com', company_name: 'Mỹ Phẩm Thanh Hằng', source_name: 'Bulk Import Excel', estimated_budget: 180000000 },
  { full_name: 'Đào Hoàng Quân', phone: '0977222333', email: 'quan.dao@tech.vn', company_name: 'Công Ty Công Nghệ Đào Quân', source_name: 'Bulk Import Excel', estimated_budget: 300000000 },
  { full_name: 'Phạm Minh Đức', phone: '0988123456', email: 'duc.pm@sunbeauty.vn', company_name: 'Công ty SunBeauty', source_name: 'Bulk Import Excel', estimated_budget: 150000000 }, // Duplicate phone demo
  { full_name: 'Trịnh Bích Ngọc', phone: '0933555777', email: 'ngoc.trinh@fashion.vn', company_name: 'Thời Trang Bích Ngọc', source_name: 'Bulk Import Excel', estimated_budget: 120000000 },
];

export default function BulkLeadImportModal({
  isOpen,
  onClose,
  onImportSuccess,
  existingPhones,
}: BulkLeadImportModalProps) {
  const [fileName, setFileName] = useState<string>('');
  const [isParsing, setIsParsing] = useState(false);
  const [previewRows, setPreviewRows] = useState<BulkImportRow[]>([]);
  const [skipDuplicates, setSkipDuplicates] = useState(true);

  if (!isOpen) return null;

  const handleDownloadTemplate = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Họ Và Tên,Số Điện Thoại,Email,Tên Công Ty/Shop,Nguồn Lead,Ngân Sách Dự Kiến (VNĐ)\n' +
      'Nguyễn Hồng Lực,0988999111,luc.nguyen@logistics.vn,Công ty Vận Tải Hồng Lực,Bulk Import Excel,250000000\n' +
      'Vũ Thanh Hằng,0912345678,hang.vu@cosmetics.com,Mỹ Phẩm Thanh Hằng,Bulk Import Excel,180000000\n' +
      'Đào Hoàng Quân,0977222333,quan.dao@tech.vn,Công Ty Công Nghệ Đào Quân,Bulk Import Excel,300000000\n';

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Lead_Import_Template_GGBingo.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSimulateFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsParsing(true);

    try {
      const res = await fetch('/api/leads/bulk-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rows: MOCK_CSV_SAMPLE_ROWS,
          existing_phones: existingPhones,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPreviewRows(data.validated_rows || []);
      }
    } catch {
      // fallback mock validation
    } finally {
      setIsParsing(false);
    }
  };

  const handleExecuteImport = () => {
    const rowsToImport = skipDuplicates ? previewRows.filter((r) => !r.is_duplicate) : previewRows;
    if (rowsToImport.length === 0) return;

    const salesList = [
      'Trần Văn Hoàng (Đội 1)',
      'Nguyễn Quốc Tuấn (Đội 2)',
      'Đỗ Thị Quyên (Đội 3)',
      'Phạm Minh Đức (Enterprise)',
    ];

    const newLeads: Lead[] = rowsToImport.map((row, idx) => {
      const assignedSale = salesList[idx % salesList.length];
      const leadScore = Math.floor(75 + Math.random() * 20);
      const newCode = `LD-IMP-${1050 + idx}`;

      return {
        id: `lead_imp_${Date.now()}_${idx}`,
        lead_code: newCode,
        full_name: row.full_name,
        entity_type: 'ENTERPRISE',
        phone: row.phone,
        email: row.email || `${newCode.toLowerCase()}@import.vn`,
        company_name: row.company_name || 'Doanh Nghiệp Import',
        source_name: 'Bulk Import Excel',
        pipeline_id: 'AGENCY',
        stage_id: 'stage_1',
        stage_name: '1. Tiếp Nhận Mới',
        assigned_sale_name: assignedSale,
        estimated_budget: row.estimated_budget || 150000000,
        lead_score: leadScore,
        status: 'New',
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };
    });

    onImportSuccess(newLeads);
    onClose();
  };

  const validRowsCount = previewRows.filter((r) => !r.is_duplicate).length;
  const duplicateRowsCount = previewRows.filter((r) => r.is_duplicate).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Nhập Lead Hàng Loạt Từ File Excel / CSV</h3>
              <p className="text-xs text-slate-500">
                Kiểm tra trùng lặp SĐT tự động & Phân bổ Lead xoay vòng cho Sales Exec
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          {/* Top Actions: Template Download & File Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <Download className="w-4 h-4 text-blue-600" /> Tải Mẫu File Chuẩn (Template CSV)
              </h4>
              <p className="text-[11px] text-slate-500">
                File mẫu bao gồm các cột chuẩn: Họ tên, SĐT, Email, Tên công ty, Ngân sách.
              </p>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" /> Tải File Lead_Import_Template.csv
              </button>
            </div>

            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2">
              <h4 className="font-bold text-xs text-blue-900 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-blue-600" /> Chọn File Excel / CSV Tải Lên
              </h4>
              <input
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={handleSimulateFileUpload}
                className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
              />
              {fileName && (
                <p className="text-[11px] font-mono text-blue-800 font-bold">
                  📁 File đã chọn: {fileName}
                </p>
              )}
            </div>
          </div>

          {/* Validation & Preview Section */}
          {isParsing ? (
            <div className="p-8 text-center space-y-2 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="font-bold text-xs text-slate-700">Đang kiểm tra trùng lặp SĐT & định dạng dữ liệu...</p>
            </div>
          ) : previewRows.length > 0 ? (
            <div className="space-y-4">
              {/* Validation Summary Bar */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4">
                  <span className="font-bold text-blue-300">Tổng số: {previewRows.length} Dòng</span>
                  <span className="font-bold text-emerald-400">✓ Hợp lệ: {validRowsCount}</span>
                  {duplicateRowsCount > 0 && (
                    <span className="font-bold text-red-400">⚠️ Trùng SĐT: {duplicateRowsCount}</span>
                  )}
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={skipDuplicates}
                    onChange={(e) => setSkipDuplicates(e.target.checked)}
                    className="w-4 h-4 accent-blue-500 rounded"
                  />
                  <span className="font-semibold text-[11px]">Bỏ qua các dòng bị trùng SĐT</span>
                </label>
              </div>

              {/* Preview Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                      <th className="p-3">Họ Và Tên</th>
                      <th className="p-3">Số Điện Thoại</th>
                      <th className="p-3">Công Ty / Email</th>
                      <th className="p-3">Ngân Sách</th>
                      <th className="p-3">Trạng Thái Validation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {previewRows.map((row) => (
                      <tr key={row.id} className={row.is_duplicate ? 'bg-red-50/60' : 'hover:bg-slate-50'}>
                        <td className="p-3 font-bold text-slate-900">{row.full_name}</td>
                        <td className="p-3 font-mono font-bold text-blue-700">{row.phone}</td>
                        <td className="p-3">
                          <p className="font-semibold text-slate-800">{row.company_name}</p>
                          <p className="text-slate-400 text-[10px]">{row.email}</p>
                        </td>
                        <td className="p-3 font-mono font-extrabold text-emerald-700">
                          {row.estimated_budget.toLocaleString('vi-VN')} ₫
                        </td>
                        <td className="p-3">
                          {row.is_duplicate ? (
                            <span className="px-2 py-0.5 bg-red-100 text-red-800 border border-red-200 rounded font-bold text-[10px] flex items-center gap-1 w-fit">
                              ⚠️ {row.duplicate_reason}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded font-bold text-[10px] flex items-center gap-1 w-fit">
                              ✓ Sẵn Sàng Import
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-all"
          >
            Hủy
          </button>

          <button
            type="button"
            disabled={previewRows.length === 0 || (skipDuplicates && validRowsCount === 0)}
            onClick={handleExecuteImport}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <FileCheck className="w-4 h-4" />
            Nhập {skipDuplicates ? validRowsCount : previewRows.length} Lead Vào Phễu Bán Hàng
          </button>
        </div>
      </div>
    </div>
  );
}
