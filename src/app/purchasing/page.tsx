'use client';

import React, { useState } from 'react';
import {
  ShoppingCart,
  Plus,
  Search,
  Filter,
  Sparkles,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
  CheckCircle2,
  AlertCircle,
  Truck,
  DollarSign,
  Star,
  Users,
  Eye,
  Trash2,
  X
} from 'lucide-react';
import { Supplier, PurchaseOrder } from '@/types';
import {
  getSuppliers,
  addSupplier,
  getPurchaseOrders,
  addPurchaseOrder,
  approvePurchaseOrder
} from '@/lib/purchasingStore';
import { formatCurrency, formatDate } from '@/lib/formatters';

export default function PurchasingPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => getSuppliers());
  const [orders, setOrders] = useState<PurchaseOrder[]>(() => getPurchaseOrders());
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'SUPPLIERS'>('ORDERS');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modals
  const [isPoModalOpen, setIsPoModalOpen] = useState(false);
  const [isSupModalOpen, setIsSupModalOpen] = useState(false);
  const [selectedPo, setSelectedPo] = useState<PurchaseOrder | null>(null);

  // New PO State
  const [newPoSupplierId, setNewPoSupplierId] = useState(suppliers[0]?.id || '');
  const [newItemName, setNewItemName] = useState('Bao bì Thùng Carton 3 lớp in Logo GGBG');
  const [newItemQty, setNewItemQty] = useState(5000);
  const [newItemPrice, setNewItemPrice] = useState(12000);
  const [newPoNotes, setNewPoNotes] = useState('');

  // New Supplier State
  const [newSupName, setNewSupName] = useState('');
  const [newSupTax, setNewSupTax] = useState('');
  const [newSupContact, setNewSupContact] = useState('');
  const [newSupPhone, setNewSupPhone] = useState('');
  const [newSupCategory, setNewSupCategory] = useState('Vật Tư In Ấn & Thùng Carton');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleCreatePo = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find((s) => s.id === newPoSupplierId) || suppliers[0];
    const subtotal = newItemQty * newItemPrice;
    const tax = subtotal * 0.1;
    const grand = subtotal + tax;
    const poCode = `PO-2026-${String(orders.length + 702).padStart(4, '0')}`;

    const newPo: PurchaseOrder = {
      id: `po_${Date.now()}`,
      po_code: poCode,
      supplier_id: sup.id,
      supplier_name: sup.name,
      order_date: new Date().toISOString().slice(0, 10),
      expected_delivery_date: '2026-08-15',
      total_amount: subtotal,
      tax_amount: tax,
      grand_total: grand,
      payment_status: 'UNPAID',
      delivery_status: 'PENDING',
      approval_status: 'APPROVED',
      notes: newPoNotes,
      items: [
        {
          id: `poi_${Date.now()}`,
          item_name: newItemName,
          quantity: newItemQty,
          unit_price: newItemPrice,
          total_amount: subtotal,
        },
      ],
    };

    const updated = addPurchaseOrder(newPo);
    setOrders([...updated]);
    setIsPoModalOpen(false);
    showToast(`✅ Đã khởi tạo thành công Đơn Đặt Hàng Mua mới: Mã số ${poCode}`);
  };

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupName) return;

    const supCode = `NCC-${String(suppliers.length + 1).padStart(3, '0')}`;
    const newSup: Supplier = {
      id: `sup_${Date.now()}`,
      supplier_code: supCode,
      name: newSupName,
      tax_code: newSupTax || '0109988776',
      contact_person: newSupContact || 'Nguyễn Văn A',
      phone: newSupPhone || '0901234567',
      email: 'contact@supplier.vn',
      address: 'KCN Tân Bình, TP. Hồ Chí Minh',
      rating: 'A',
      payable_balance: 0,
      category: newSupCategory,
      created_at: new Date().toISOString().slice(0, 10),
    };

    const updated = addSupplier(newSup);
    setSuppliers([...updated]);
    setIsSupModalOpen(false);
    setNewSupName('');
    showToast(`🏭 Đã thêm Hồ sơ Nhà Cung Cấp mới thành công: ${newSup.name}`);
  };

  const totalPayable = suppliers.reduce((acc, s) => acc + s.payable_balance, 0);
  const totalPoValue = orders.reduce((acc, p) => acc + p.grand_total, 0);

  const filteredOrders = orders.filter((o) => {
    const q = searchTerm.toLowerCase();
    return !q || o.po_code.toLowerCase().includes(q) || o.supplier_name.toLowerCase().includes(q);
  });

  const filteredSuppliers = suppliers.filter((s) => {
    const q = searchTerm.toLowerCase();
    return !q || s.name.toLowerCase().includes(q) || s.supplier_code.toLowerCase().includes(q) || s.tax_code.includes(q);
  });

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
            <ShoppingCart className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900">Quản Lý Mua Hàng & Nhà Cung Cấp (Procurement PO)</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
              Module ERP Mua Hàng
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý đơn đặt hàng mua (PO), danh mục Nhà cung cấp, theo dõi tiến độ giao hàng & công nợ phải trả NCC (TK 331).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSupModalOpen(true)}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Building2 className="w-4 h-4 text-slate-600" /> Thêm Nhà Cung Cấp
          </button>

          <button
            onClick={() => setIsPoModalOpen(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" /> Lập Đơn Mua Hàng PO
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-slate-500 uppercase text-[10.5px]">Tổng Giá Trị Đơn Mua PO</span>
          <p className="text-xl font-semibold text-indigo-700">{formatCurrency(totalPoValue)}</p>
          <p className="text-indigo-600 font-semibold text-[11px]">🛒 {orders.length} Đơn mua hàng đã lập</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-slate-500 uppercase text-[10.5px]">Công Nợ Phải Trả NCC (TK 331)</span>
          <p className="text-xl font-semibold text-red-600">{formatCurrency(totalPayable)}</p>
          <p className="text-red-500 font-semibold text-[11px]">💳 Nợ phải trả nhà cung cấp</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-slate-500 uppercase text-[10.5px]">Số Lượng Nhà Cung Cấp</span>
          <p className="text-xl font-semibold text-emerald-700">{suppliers.length} Đối Tác NCC</p>
          <p className="text-emerald-600 font-semibold text-[11px]">⭐ Xếp hạng uy tín Rating A/B</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 text-xs font-bold">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('ORDERS')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'ORDERS' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShoppingCart className="w-4 h-4" /> 🛒 1. Sổ Đơn Đặt Hàng Mua PO ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('SUPPLIERS')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'SUPPLIERS' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4" /> 🏭 2. Danh Mục Nhà Cung Cấp ({suppliers.length})
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm mã PO, nhà cung cấp, mã số thuế..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-xl"
            />
          </div>
        </div>

        {/* TAB 1: PURCHASE ORDERS */}
        {activeTab === 'ORDERS' && (
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10.5px]">
                  <th className="p-3">Mã & Ngày Đơn Mua PO</th>
                  <th className="p-3">Tên Nhà Cung Cấp</th>
                  <th className="p-3">Hạng Mục Hàng Mua</th>
                  <th className="p-3 text-right">Tổng Tiền Thanh Toán</th>
                  <th className="p-3 text-center">Giao Hàng</th>
                  <th className="p-3 text-center">Thanh Toán</th>
                  <th className="p-3 text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <p className="font-mono font-semibold text-indigo-700 text-xs">{po.po_code}</p>
                      <p className="text-[11px] text-slate-500 font-bold mt-0.5">📅 {formatDate(po.order_date)}</p>
                    </td>

                    <td className="p-3 max-w-xs">
                      <p className="font-bold text-slate-900 text-xs leading-snug line-clamp-1">{po.supplier_name}</p>
                      <p className="text-[10.5px] text-slate-500 font-normal">Giao hàng dự kiến: {formatDate(po.expected_delivery_date)}</p>
                    </td>

                    <td className="p-3">
                      {po.items.map((it) => (
                        <div key={it.id} className="text-slate-800 font-bold">
                          • {it.item_name} <span className="font-mono text-purple-700">({it.quantity} cái)</span>
                        </div>
                      ))}
                    </td>

                    <td className="p-3 text-right font-mono font-semibold text-slate-900 text-xs">
                      {formatCurrency(po.grand_total)}
                    </td>

                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[10.5px] ${
                        po.delivery_status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
                        po.delivery_status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {po.delivery_status === 'DELIVERED' ? '✅ Đã Nhập Kho' : po.delivery_status === 'SHIPPED' ? '🚚 Đang Vận Chuyển' : '⏳ Chờ Giao'}
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[10.5px] ${
                        po.payment_status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {po.payment_status === 'PAID' ? '✅ Đã Thanh Toán' : '🔴 Chưa Thanh Toán'}
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() => {
                          setSelectedPo(po);
                        }}
                        className="p-1.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all"
                        title="Xem Đơn Mua PO"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: SUPPLIERS LIST */}
        {activeTab === 'SUPPLIERS' && (
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10.5px]">
                  <th className="p-3">Mã & Tên Nhà Cung Cấp</th>
                  <th className="p-3">Mã Số Thuế</th>
                  <th className="p-3">Người Liên Hệ & SĐT</th>
                  <th className="p-3">Nhóm Vật Tư Provider</th>
                  <th className="p-3 text-center">Xếp Hạng Uy Tín</th>
                  <th className="p-3 text-right">Dư Nợ Phải Trả (TK 331)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredSuppliers.map((sup) => (
                  <tr key={sup.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <p className="font-bold text-slate-900 text-xs">{sup.name}</p>
                      <p className="font-mono text-purple-700 text-[11px] font-bold">Mã số: {sup.supplier_code}</p>
                    </td>

                    <td className="p-3 font-mono font-bold text-slate-700">{sup.tax_code}</td>

                    <td className="p-3">
                      <p className="font-bold text-slate-800">👤 {sup.contact_person}</p>
                      <p className="text-[11px] text-slate-500 font-mono">📞 {sup.phone}</p>
                    </td>

                    <td className="p-3">
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-full text-[10.5px]">
                        {sup.category}
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full font-semibold text-[11px] ${
                        sup.rating === 'A' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800'
                      }`}>
                        ⭐ Rating {sup.rating}
                      </span>
                    </td>

                    <td className="p-3 text-right font-mono font-semibold text-red-600 text-xs">
                      {formatCurrency(sup.payable_balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL KHỞI TẠO ĐƠN MUA HÀNG PO MỚI */}
      {isPoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden p-6 space-y-4 text-xs font-bold">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-indigo-600" /> Lập Đơn Đặt Hàng Mua Hàng PO Mới
              </h3>
              <button onClick={() => setIsPoModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePo} className="space-y-3">
              <div>
                <label className="block text-slate-700 mb-1">Chọn Nhà Cung Cấp *</label>
                <select
                  value={newPoSupplierId}
                  onChange={(e) => setNewPoSupplierId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.supplier_code} - {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Tên Hạng Mục Mua Hàng *</label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Số Lượng Mua *</label>
                  <input
                    type="number"
                    required
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Đơn Giá Mua (VND) *</label>
                  <input
                    type="number"
                    required
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-xl font-mono text-purple-700 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Ghi Chú Đơn Mua</label>
                <input
                  type="text"
                  value={newPoNotes}
                  onChange={(e) => setNewPoNotes(e.target.value)}
                  placeholder="Nhập điều khoản giao hàng..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="p-3 bg-indigo-50 rounded-xl space-y-1 font-mono text-[11px]">
                <p className="text-indigo-900 font-bold">Thành tiền trước thuế: {formatCurrency(newItemQty * newItemPrice)}</p>
                <p className="text-indigo-700">Thuế GTGT VAT (10%): {formatCurrency(newItemQty * newItemPrice * 0.1)}</p>
                <p className="text-indigo-950 font-semibold text-xs pt-1 border-t border-indigo-200">
                  TỔNG THANH TOÁN: {formatCurrency(newItemQty * newItemPrice * 1.1)}
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsPoModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
                >
                  <ShoppingCart className="w-4 h-4" /> Khởi Tạo Đơn Mua PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL THÊM NHÀ CUNG CẤP MỚI */}
      {isSupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden p-6 space-y-4 text-xs font-bold">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" /> Thêm Hồ Sơ Nhà Cung Cấp Mới
              </h3>
              <button onClick={() => setIsSupModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSupplier} className="space-y-3">
              <div>
                <label className="block text-slate-700 mb-1">Tên Nhà Cung Cấp *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Công ty Cổ phần Thiết Bị Văn Phòng Việt..."
                  value={newSupName}
                  onChange={(e) => setNewSupName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Mã Số Thuế *</label>
                  <input
                    type="text"
                    required
                    placeholder="0101234567"
                    value={newSupTax}
                    onChange={(e) => setNewSupTax(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Nhóm Vật Tư Supplier *</label>
                  <select
                    value={newSupCategory}
                    onChange={(e) => setNewSupCategory(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="Vật Tư In Ấn & Thùng Carton">Vật Tư In Ấn & Thùng Carton</option>
                    <option value="Thiết Bị IT & Máy Tính">Thiết Bị IT & Máy Tính</option>
                    <option value="Dịch Vụ Logistics & Kho Bãi">Dịch Vụ Logistics & Kho Bãi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Người Liên Hệ *</label>
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={newSupContact}
                    onChange={(e) => setNewSupContact(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Số Điện Thoại *</label>
                  <input
                    type="text"
                    placeholder="0901234567"
                    value={newSupPhone}
                    onChange={(e) => setNewSupPhone(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsSupModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
                >
                  <Building2 className="w-4 h-4" /> Lưu Hồ Sơ Nhà Cung Cấp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
