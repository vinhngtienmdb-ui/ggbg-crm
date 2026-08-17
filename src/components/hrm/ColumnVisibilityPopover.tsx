'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  SlidersHorizontal,
  RotateCcw,
  Eye,
  EyeOff,
  ShieldAlert,
  Briefcase,
  DollarSign,
  Building2,
  FileCheck2,
  X
} from 'lucide-react';

export interface ColumnDefinition {
  key: string;
  label: string;
  description?: string;
  category: 'OFFICIAL' | 'OPERATION' | 'SALARY' | 'LEGAL';
  required?: boolean;
  sensitive?: boolean;
}

export const ALL_HRM_COLUMNS: ColumnDefinition[] = [
  // 1. THÔNG TIN CÔNG VỤ (8 CỘT CHUẨN MẶC ĐỊNH)
  { key: 'employee_code', label: 'Mã NV', description: 'Mã định danh nhân sự', category: 'OFFICIAL', required: true },
  { key: 'full_name', label: 'Họ và Tên', description: 'Họ tên nhân viên', category: 'OFFICIAL', required: true },
  { key: 'gender', label: 'Giới Tính', description: 'Nam / Nữ / Khác', category: 'OFFICIAL' },
  { key: 'date_of_birth', label: 'Ngày Sinh', description: 'Định dạng DD/MM/YYYY', category: 'OFFICIAL' },
  { key: 'position', label: 'Chức Vụ', description: 'Trưởng phòng, Giám đốc, Nhân viên...', category: 'OFFICIAL' },
  { key: 'job_title', label: 'Chức Danh', description: 'Chức danh chuyên môn', category: 'OFFICIAL' },
  { key: 'work_phone', label: 'SĐT Công Việc', description: 'Hotline / Số máy công ty', category: 'OFFICIAL' },
  { key: 'work_email', label: 'Email Công Việc', description: 'Email doanh nghiệp', category: 'OFFICIAL' },

  // 2. TỔ CHỨC & VẬN HÀNH
  { key: 'department', label: 'Phòng Ban', description: 'Đơn vị phòng ban trực thuộc', category: 'OPERATION' },
  { key: 'team', label: 'Đội / Nhóm', description: 'Nhóm làm việc cụ thể', category: 'OPERATION' },
  { key: 'status', label: 'Trạng Thái', description: 'Chính thức, Thử việc, Đã nghỉ...', category: 'OPERATION' },
  { key: 'joined_date', label: 'Ngày Vào Làm', description: 'Thời điểm bắt đầu công tác', category: 'OPERATION' },

  // 3. LƯƠNG & ĐÃI NGỘ (THÔNG TIN BẢO MẬT PII)
  { key: 'salary_grade', label: 'Ngạch & Bậc Lương', description: 'Mức ngạch G1-G6 & Bậc lương', category: 'SALARY', sensitive: true },
  { key: 'base_salary', label: 'Lương P1 (Thực Nhận)', description: 'Mức lương cơ bản thỏa thuận', category: 'SALARY', sensitive: true },
  { key: 'bank_account', label: 'Tài Khoản Ngân Hàng', description: 'STK, Tên NH & Chủ tài khoản', category: 'SALARY', sensitive: true },
  { key: 'allowances', label: 'Phụ Cấp Hàng Tháng', description: 'Tổng tiền các khoản phụ cấp', category: 'SALARY', sensitive: true },

  // 4. BẢO HIỂM & PHÁP LÝ
  { key: 'bhxh_status', label: 'Trạng Thái BHXH', description: 'Đang tham gia, Tạm dừng...', category: 'LEGAL' },
  { key: 'contract_number', label: 'Số Hợp Đồng', description: 'Mã số HĐLĐ', category: 'LEGAL' },
];

export const DEFAULT_VISIBLE_COLUMNS = [
  'employee_code',
  'full_name',
  'gender',
  'date_of_birth',
  'position',
  'job_title',
  'work_phone',
  'work_email',
];

interface ColumnVisibilityPopoverProps {
  visibleKeys: string[];
  onChange: (newKeys: string[]) => void;
}

export default function ColumnVisibilityPopover({
  visibleKeys,
  onChange,
}: ColumnVisibilityPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleColumn = (key: string) => {
    const targetCol = ALL_HRM_COLUMNS.find((c) => c.key === key);
    if (targetCol?.required) return; // Cannot toggle required columns

    if (visibleKeys.includes(key)) {
      onChange(visibleKeys.filter((k) => k !== key));
    } else {
      onChange([...visibleKeys, key]);
    }
  };

  const handleResetToDefault = () => {
    onChange(DEFAULT_VISIBLE_COLUMNS);
  };

  const handleSelectAll = () => {
    onChange(ALL_HRM_COLUMNS.map((c) => c.key));
  };

  const handleHideSensitive = () => {
    onChange(visibleKeys.filter((k) => {
      const col = ALL_HRM_COLUMNS.find((c) => c.key === k);
      return !col?.sensitive;
    }));
  };

  const CATEGORY_MAP: Record<string, { label: string; icon: React.ReactNode }> = {
    OFFICIAL: { label: 'I. Thông Tin Công Vụ (8 Cột Chuẩn)', icon: <Briefcase className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> },
    OPERATION: { label: 'II. Tổ Chức & Vận Hành', icon: <Building2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> },
    SALARY: { label: 'III. Lương & Đãi Ngộ (Bảo Mật)', icon: <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> },
    LEGAL: { label: 'IV. Bảo Hiểm & Pháp Lý', icon: <FileCheck2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> },
  };

  const categories: ('OFFICIAL' | 'OPERATION' | 'SALARY' | 'LEGAL')[] = ['OFFICIAL', 'OPERATION', 'SALARY', 'LEGAL'];

  return (
    <div className="relative inline-block" ref={popoverRef}>
      {/* TRIGGER BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 border transition-all ${
          isOpen
            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 shadow-xs ring-2 ring-blue-500/20'
            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-xs'
        }`}
        title="Tùy biến hiển thị các cột trong bảng hồ sơ"
      >
        <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        <span>Tùy Chỉnh Cột</span>
        <span className="px-1.5 py-0.2 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded text-[10px] font-bold">
          {visibleKeys.length}/{ALL_HRM_COLUMNS.length}
        </span>
      </button>

      {/* POPOVER DROPDOWN */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Cấu Hình Cột Hiển Thị</span>
              </h4>
              <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                Bật/tắt các trường dữ liệu theo nhu cầu xem
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-slate-200/60 dark:hover:bg-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Preset Buttons */}
          <div className="p-2.5 bg-slate-100/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 flex-wrap text-[11px]">
            <button
              onClick={handleResetToDefault}
              className="px-2.5 py-1 bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 font-semibold rounded-md border border-slate-200 dark:border-slate-700 hover:border-blue-400 flex items-center gap-1 shadow-2xs transition-all active:scale-95"
            >
              <RotateCcw className="w-3 h-3 text-blue-600" />
              <span>Mặc Định (8 Cột)</span>
            </button>

            <button
              onClick={handleHideSensitive}
              className="px-2.5 py-1 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium rounded-md border border-slate-200 dark:border-slate-700 hover:border-slate-400 flex items-center gap-1 shadow-2xs transition-all active:scale-95"
            >
              <EyeOff className="w-3 h-3 text-amber-600" />
              <span>Ẩn Lương & PII</span>
            </button>

            <button
              onClick={handleSelectAll}
              className="px-2.5 py-1 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium rounded-md border border-slate-200 dark:border-slate-700 hover:border-slate-400 flex items-center gap-1 shadow-2xs transition-all active:scale-95"
            >
              <Eye className="w-3 h-3 text-purple-600" />
              <span>Hiện Tất Cả</span>
            </button>
          </div>

          {/* Scrollable Column List */}
          <div className="p-3 max-h-[380px] overflow-y-auto space-y-4 text-xs divide-y divide-slate-100 dark:divide-slate-800/80">
            {categories.map((catKey) => {
              const catCols = ALL_HRM_COLUMNS.filter((c) => c.category === catKey);
              if (catCols.length === 0) return null;

              return (
                <div key={catKey} className="pt-3 first:pt-0 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    {CATEGORY_MAP[catKey].icon}
                    <span>{CATEGORY_MAP[catKey].label}</span>
                  </div>

                  <div className="grid grid-cols-1 gap-1">
                    {catCols.map((col) => {
                      const isVisible = visibleKeys.includes(col.key);
                      return (
                        <label
                          key={col.key}
                          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                            isVisible
                              ? 'bg-blue-50/50 dark:bg-blue-950/30 text-slate-900 dark:text-slate-100'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-500 dark:text-slate-400'
                          } ${col.required ? 'opacity-80 cursor-not-allowed' : ''}`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <input
                              type="checkbox"
                              checked={isVisible}
                              disabled={col.required}
                              onChange={() => toggleColumn(col.key)}
                              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 cursor-pointer disabled:cursor-not-allowed"
                            />
                            <div className="min-w-0">
                              <span className="font-semibold text-xs block truncate">
                                {col.label}
                                {col.required && <span className="text-red-500 ml-0.5">*</span>}
                              </span>
                              {col.description && (
                                <span className="text-[10px] text-slate-400 block truncate">
                                  {col.description}
                                </span>
                              )}
                            </div>
                          </div>

                          {col.sensitive && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 text-[9.5px] font-medium shrink-0 flex items-center gap-0.5">
                              <ShieldAlert className="w-2.5 h-2.5" />
                              <span>Bảo mật</span>
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Đang hiển thị <strong className="text-slate-800 dark:text-slate-200">{visibleKeys.length}</strong> cột
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs shadow-xs transition-colors"
            >
              Áp Dụng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
