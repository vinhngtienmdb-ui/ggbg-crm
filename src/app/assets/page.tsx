'use client';

import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingDown,
  Building2,
  Calendar,
  Sparkles,
  CheckCircle2,
  Trash2,
  Edit,
  Eye,
  FileSpreadsheet,
  Save,
  X,
  PieChart
} from 'lucide-react';
import { FixedAsset, AssetCategory, AssetStatus } from '@/types';
import {
  getFixedAssets,
  addFixedAsset,
  updateFixedAsset,
  deleteFixedAsset
} from '@/lib/erpStore';

export default function FixedAssetsPage() {
  const [assets, setAssets] = useState<FixedAsset[]>(() => getFixedAssets());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<FixedAsset | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const [newAsset, setNewAsset] = useState({
    name: '',
    category: 'IT_EQUIPMENT' as AssetCategory,
    purchase_date: '2026-07-01',
    purchase_price: 15000000,
    depreciation_months: 36,
    department: 'Khối Kinh Doanh & TMĐT',
    assigned_to: 'Trần Văn Hoàng',
    notes: '',
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(newAsset.purchase_price);
    const months = Number(newAsset.depreciation_months);
    const monthlyDep = Math.round(price / months);

    const categoryNames: Record<AssetCategory, string> = {
      IT_EQUIPMENT: 'Thiết Bị CNTT & Server',
      OFFICE_FURNITURE: 'Nội Thất Văn Phòng',
      VEHICLES: 'Phương Tiện Vận Tải',
      ECOM_MACHINERY: 'Máy Móc Đóng Bì Vận Đơn',
      REAL_ESTATE: 'Bất Động Sản & Văn Phòng',
    };

    const asset: FixedAsset = {
      id: `ast_${Date.now()}`,
      asset_code: `TS-${newAsset.category.slice(0, 3)}-${String(assets.length + 1).padStart(3, '0')}`,
      name: newAsset.name,
      category: newAsset.category,
      category_name: categoryNames[newAsset.category],
      purchase_date: newAsset.purchase_date,
      purchase_price: price,
      depreciation_months: months,
      monthly_depreciation: monthlyDep,
      accumulated_depreciation: monthlyDep, // 1st month
      net_book_value: price - monthlyDep,
      department: newAsset.department,
      assigned_to: newAsset.assigned_to,
      status: 'IN_USE',
      notes: newAsset.notes,
    };

    const updated = addFixedAsset(asset);
    setAssets([...updated]);
    setIsCreateOpen(false);
    showToast(`✅ Đã nhập sổ Tài sản cố định thành công: ${asset.name}`);
  };

  const handleDelete = (id: string) => {
    const updated = deleteFixedAsset(id);
    setAssets([...updated]);
    showToast('🗑️ Đã thanh lý / xóa tài sản khỏi sổ cái');
  };

  const filteredAssets = assets.filter((a) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = !q || a.name.toLowerCase().includes(q) || a.asset_code.toLowerCase().includes(q) || a.department.toLowerCase().includes(q);
    const matchesCat = selectedCategory === 'ALL' || a.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const totalValue = assets.reduce((sum, a) => sum + a.purchase_price, 0);
  const totalMonthlyDep = assets.reduce((sum, a) => sum + a.monthly_depreciation, 0);
  const totalNetBookValue = assets.reduce((sum, a) => sum + a.net_book_value, 0);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-blue-500/40 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <Sparkles className="w-4 h-4 text-blue-400" />
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900">Quản Lý Tài Sản Cố Định & Khấu Hao Enterprise (EAM)</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              Module ERP Tài Sản
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Sổ cái theo dõi nguyên giá tài sản cố định, tự động trích khấu hao hàng tháng & phân bổ chi phí theo phòng ban.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" /> Khai Báo Tài Sản Mới
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-bold">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-slate-500 uppercase text-[10.5px]">Tổng Nguyên Giá Tài Sản</span>
          <p className="text-xl font-semibold text-slate-900">{totalValue.toLocaleString('vi-VN')} ₫</p>
          <p className="text-blue-600 font-semibold text-[11px]">📦 {assets.length} Tài sản đang quản lý</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-slate-500 uppercase text-[10.5px]">Giá Trị Còn Lại (Net Book Value)</span>
          <p className="text-xl font-semibold text-emerald-700">{totalNetBookValue.toLocaleString('vi-VN')} ₫</p>
          <p className="text-emerald-600 font-semibold text-[11px]">🟢 Giá trị tài sản thực tế</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-slate-500 uppercase text-[10.5px]">Khấu Hao Hàng Tháng (Monthly Dep)</span>
          <p className="text-xl font-semibold text-purple-700">{totalMonthlyDep.toLocaleString('vi-VN')} ₫</p>
          <p className="text-purple-600 font-semibold text-[11px]">📉 Hạch toán thẳng Sổ cái chi phí</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-slate-500 uppercase text-[10.5px]">Trạng Thái Sử Dụng</span>
          <p className="text-xl font-semibold text-blue-700">100% Đang Sử Dụng</p>
          <p className="text-slate-500 font-semibold text-[11px]">🛡️ Phân bổ đúng phòng ban</p>
        </div>
      </div>

      {/* Equipment Maintenance Schedule & Warranty Alerts */}
      <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs font-bold">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-amber-900 text-sm">🛠️ Lịch Bảo Trì Thiết Bị Định Kỳ & Bảo Hành 2026</h4>
            <p className="text-amber-700 font-medium text-[11.5px] mt-0.5">
              • Máy chủ Server Dell T340: <strong>Bảo trì định kỳ ngày 15/08/2026</strong> | • Xe Tải Suzuki Carry: <strong>Bảo dưỡng định kỳ 20.000km ngày 25/08/2026</strong>
            </p>
          </div>
        </div>

        <button
          onClick={() => showToast('🔔 Đã đặt lịch nhắc bảo trì thiết bị tự động cho Phòng Vận Hành')}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md shrink-0 transition-all active:scale-95"
        >
          🔔 Đặt Lịch Nhắc Bảo Trì
        </button>
      </div>

      {/* Main Assets Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 text-xs font-bold">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm mã, tên tài sản, phòng ban..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-xl"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-slate-50 border rounded-xl font-semibold"
            >
              <option value="ALL">Tất cả loại tài sản</option>
              <option value="IT_EQUIPMENT">Thiết Bị CNTT & Server</option>
              <option value="ECOM_MACHINERY">Máy Móc Đóng Bì TMĐT</option>
              <option value="VEHICLES">Phương Tiện Vận Tải</option>
              <option value="OFFICE_FURNITURE">Nội Thất Văn Phòng</option>
            </select>
          </div>

          <span className="text-slate-500">
            Hiển thị <strong className="text-slate-900">{filteredAssets.length}</strong> tài sản cố định
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10.5px]">
                <th className="p-3">Mã & Tên Tài Sản Cố Định</th>
                <th className="p-3">Phân Loại Tài Sản</th>
                <th className="p-3 font-mono">Nguyên Giá (VND)</th>
                <th className="p-3 font-mono text-center">Khấu Hao/Tháng</th>
                <th className="p-3 font-mono text-center">Giá Trị Còn Lại</th>
                <th className="p-3">Phòng Ban & Người Quản Lý</th>
                <th className="p-3 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredAssets.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3">
                    <p className="font-bold text-slate-900 text-sm">{a.name}</p>
                    <p className="font-mono text-blue-700 text-[11px]">{a.asset_code} • Mua ngày {a.purchase_date}</p>
                  </td>

                  <td className="p-3">
                    <span className="px-2.5 py-1 bg-purple-50 text-purple-800 rounded-full font-bold border border-purple-200 text-[10.5px]">
                      {a.category_name}
                    </span>
                  </td>

                  <td className="p-3 font-mono font-semibold text-slate-900">
                    {a.purchase_price.toLocaleString('vi-VN')} ₫
                  </td>

                  <td className="p-3 text-center font-mono font-bold text-purple-700">
                    {a.monthly_depreciation.toLocaleString('vi-VN')} ₫/tháng
                  </td>

                  <td className="p-3 text-center font-mono font-semibold text-emerald-700">
                    {a.net_book_value.toLocaleString('vi-VN')} ₫
                  </td>

                  <td className="p-3">
                    <p className="font-bold text-slate-800">{a.department}</p>
                    <p className="text-[11px] text-slate-500">👤 {a.assigned_to}</p>
                  </td>

                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedAsset(a);
                          setIsScheduleOpen(true);
                        }}
                        className="p-1.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all"
                        title="Bảng Lịch Khấu Hao"
                      >
                        <PieChart className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(a.id)}
                        className="p-1.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                        title="Xóa / Thanh Lý"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL KHAI BÁO TÀI SẢN MỚI */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden p-6 space-y-4 text-xs font-bold">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" /> Khai Báo Tài Sản Cố Định Mới (ERP Asset Intake)
              </h3>
              <button onClick={() => setIsCreateOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-700 mb-1">Tên Tên Tài Sản Cố Định *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Máy tính Server Dell PowerEdge..."
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Phân Loại Tài Sản *</label>
                  <select
                    value={newAsset.category}
                    onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value as AssetCategory })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="IT_EQUIPMENT">Thiết Bị CNTT & Server</option>
                    <option value="ECOM_MACHINERY">Máy Móc Đóng Bì TMĐT</option>
                    <option value="VEHICLES">Phương Tiện Vận Tải</option>
                    <option value="OFFICE_FURNITURE">Nội Thất Văn Phòng</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Ngày Mua / Ghi Nhận Sổ *</label>
                  <input
                    type="date"
                    required
                    value={newAsset.purchase_date}
                    onChange={(e) => setNewAsset({ ...newAsset, purchase_date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Nguyên Giá Tài Sản (VND) *</label>
                  <input
                    type="number"
                    step={1000000}
                    required
                    value={newAsset.purchase_price}
                    onChange={(e) => setNewAsset({ ...newAsset, purchase_price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl font-mono text-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Thời Gian Khấu Hao (Tháng) *</label>
                  <input
                    type="number"
                    required
                    value={newAsset.depreciation_months}
                    onChange={(e) => setNewAsset({ ...newAsset, depreciation_months: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl font-mono text-purple-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Bộ Phận Quản Lý *</label>
                  <select
                    value={newAsset.department}
                    onChange={(e) => setNewAsset({ ...newAsset, department: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="Khối Kinh Doanh & TMĐT">Khối Kinh Doanh & TMĐT</option>
                    <option value="Phòng Vận Hành TMĐT">Phòng Vận Hành TMĐT</option>
                    <option value="Kho Vận TMĐT Bắc Ninh">Kho Vận TMĐT Bắc Ninh</option>
                    <option value="Ban Giám Đốc">Ban Giám Đốc</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Người Chịu Trách Nhiệm *</label>
                  <input
                    type="text"
                    required
                    value={newAsset.assigned_to}
                    onChange={(e) => setNewAsset({ ...newAsset, assigned_to: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30"
                >
                  Khai Báo Sổ Tài Sản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL LỊCH KHẤU HAO CHI TIẾT */}
      {isScheduleOpen && selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden p-6 space-y-4 text-xs font-medium">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-sm text-slate-900">Lịch Trích Khấu Hao: {selectedAsset.name}</h3>
              </div>
              <button onClick={() => setIsScheduleOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl space-y-1">
              <p className="text-purple-900 font-bold">Nguyên giá: {selectedAsset.purchase_price.toLocaleString('vi-VN')} ₫</p>
              <p className="text-purple-700">Khấu hao mỗi tháng: <strong>{selectedAsset.monthly_depreciation.toLocaleString('vi-VN')} ₫/tháng</strong> (Thời gian: {selectedAsset.depreciation_months} tháng)</p>
            </div>

            <div className="max-h-60 overflow-y-auto border rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b font-bold">
                    <th className="p-2">Kỳ Khấu Hao</th>
                    <th className="p-2 text-right">Số Tiền Khấu Hao</th>
                    <th className="p-2 text-right">Giá Trị Còn Lại</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-mono">
                  {Array.from({ length: Math.min(12, selectedAsset.depreciation_months) }).map((_, i) => {
                    const monthVal = selectedAsset.monthly_depreciation;
                    const remVal = Math.max(0, selectedAsset.purchase_price - monthVal * (i + 1));
                    return (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-2">Tháng {i + 1} / 2026</td>
                        <td className="p-2 text-right text-purple-700 font-bold">-{monthVal.toLocaleString('vi-VN')} ₫</td>
                        <td className="p-2 text-right font-bold text-slate-900">{remVal.toLocaleString('vi-VN')} ₫</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                onClick={() => setIsScheduleOpen(false)}
                className="px-5 py-2 bg-slate-900 text-white font-bold rounded-xl"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
