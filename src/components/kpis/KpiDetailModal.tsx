'use client';

import React from 'react';
import { X, Target, Building2, User, Users, Calendar, Award, BarChart3, Clock, Layers, Sparkles, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { KPIAssignment } from '@/types';
import { formatNumberWithUnit, formatCurrency } from '@/lib/formatters';

interface KpiDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  kpi: KPIAssignment | null;
  onEdit?: (kpi: KPIAssignment) => void;
}

export default function KpiDetailModal({ isOpen, onClose, kpi, onEdit }: KpiDetailModalProps) {
  if (!isOpen || !kpi) return null;

  const target = kpi.target_value || 0;
  const actual = kpi.actual_value || 0;
  const progress = kpi.progress_percentage || 0;

  const formatVal = (val: number, unit: string) => {
    return formatNumberWithUnit(val, unit);
  };

  return ( <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"> <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200"> {/* Header */} <div className="bg-slate-900 text-white p-5 flex items-center justify-between"> <div className="flex items-center gap-3"> <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-medium text-white shadow-md"> <Target className="w-5 h-5" /> </div> <div> <span className="text-[10px] font-mono font-medium text-blue-400 uppercase tracking-wider block"> {kpi.kpi_code || 'KPI-ITEM'} </span> <h3 className="font-semibold text-sm text-white">{kpi.kpi_name}</h3> </div> </div> <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          > <X className="w-5 h-5" /> </button> </div> {/* Content */} <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto"> {/* Progress Card */} <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl shadow-lg space-y-3 border border-indigo-800/40"> <div className="flex items-center justify-between text-xs"> <span className="text-slate-300 font-medium flex items-center gap-1"> <BarChart3 className="w-4 h-4 text-blue-400" /> Tiến Độ Hoàn Thành Chỉ Tiêu </span> <span
                className={`px-3 py-1 rounded-xl text-xs font-mono font-semibold shadow-sm ${
                  progress >= 100
                    ? 'bg-emerald-500 text-slate-950'
                    : progress >= 80
                    ? 'bg-blue-500 text-white'
                    : progress >= 50
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-red-500 text-white'
                }`}
              > {progress}% </span> </div> {/* Progress Bar */} <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700"> <div
                className={`h-full rounded-full transition-all duration-500 ${
                  progress >= 100 ? 'bg-emerald-400' : progress >= 80 ? 'bg-blue-400' : 'bg-amber-400'
                }`}
                style={{ width: `${Math.min(100, progress)}%` }}
              /> </div> {/* Target vs Actual Numbers */} <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-800"> <div> <span className="text-slate-400 block font-medium">Chỉ Tiêu Mục Tiêu:</span> <span className="font-mono font-semibold text-blue-300 text-sm mt-0.5 block"> {formatVal(target, kpi.unit)} </span> </div> <div> <span className="text-slate-400 block font-medium">Thực Tế Đạt Được:</span> <span className="font-mono font-semibold text-emerald-300 text-sm mt-0.5 block"> {formatVal(actual, kpi.unit)} </span> </div> </div> </div> {/* Detailed Specifications Grid */} <div className="grid grid-cols-2 gap-4 text-xs"> <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1"> <span className="text-slate-500 font-medium block flex items-center gap-1"> <Layers className="w-3.5 h-3.5 text-blue-600" /> Cấp Phân Bổ: </span> <span className="font-semibold text-slate-900 block"> {kpi.assignee_type === 'Company'
                  ? '🌐 Toàn Công Ty'
                  : kpi.assignee_type === 'Department'
                  ? '🏢 Khối / Phòng Ban'
                  : kpi.assignee_type === 'Team'
                  ? '👥 Đội Nhóm'
                  : '👤 Cá Nhân'} </span> </div> <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1"> <span className="text-slate-500 font-medium block flex items-center gap-1"> <Building2 className="w-3.5 h-3.5 text-indigo-600" /> Đối Tượng Phụ Trách: </span> <span className="font-semibold text-slate-900 block truncate">{kpi.assignee_name}</span> </div> <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1"> <span className="text-slate-500 font-medium block flex items-center gap-1"> <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Kỳ Đánh Giá: </span> <span className="font-semibold text-slate-900 block">{kpi.period}</span> </div> <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1"> <span className="text-slate-500 font-medium block flex items-center gap-1"> <Award className="w-3.5 h-3.5 text-purple-600" /> Trọng Số Đánh Giá: </span> <span className="font-mono font-semibold text-slate-900 block">{kpi.weight || 100}%</span> </div> </div> {/* Notes */}
          {kpi.notes && ( <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-xl text-xs space-y-1"> <span className="font-medium text-blue-900 flex items-center gap-1"> <FileText className="w-3.5 h-3.5 text-blue-600" /> Ghi Chú Kế Hoạch: </span> <p className="text-slate-700 leading-relaxed">{kpi.notes}</p> </div> )}

          {/* Metadata Footer */} <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-100"> <span>Ngày tạo: {kpi.created_at || '2026-07-01'}</span> <span>Mã chỉ tiêu: {kpi.kpi_code || kpi.id}</span> </div> {/* Actions */} <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200"> <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-all"
            > Đóng </button> {onEdit && ( <button
                onClick={() => {
                  onClose();
                  onEdit(kpi);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-medium transition-all shadow-md active:scale-95"
              > Chỉnh Sửa Tiến Độ </button> )} </div> </div> </div> </div> );
}
