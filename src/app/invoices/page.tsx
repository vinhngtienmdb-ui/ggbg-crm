'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  Sparkles,
  Printer,
  Eye,
  Building2,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Receipt,
  X
} from 'lucide-react';
import { InvoiceVAT } from '@/types';
import { getInvoices, addInvoice } from '@/lib/invoiceStore';
import { formatCurrency, formatDate } from '@/lib/formatters';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceVAT[]>(() => getInvoices());
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInv, setSelectedInv] = useState<InvoiceVAT | null>(null);

  // New Invoice Form
  const [buyerName, setBuyerName] = useState('Công Ty TNHH Thương Mại An Thịnh');
  const [buyerTaxCode, setBuyerTaxCode] = useState('0318999888');
  const [buyerAddress, setBuyerAddress] = useState('Số 88 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh');
  const [subtotal, setSubtotal] = useState(80000000);
  const [taxRate, setTaxRate] = useState(10);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleIssueInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const taxAmt = subtotal * (taxRate / 100);
    const totalAmt = subtotal + taxAmt;
    const invNum = String(invoices.length + 103).padStart(8, '0');
    const mccqt = `MCCQT: 00C8F91A20260731${String(invoices.length + 103).padStart(5, '0')}`;

    const newInv: InvoiceVAT = {
      id: `inv_${Date.now()}`,
      invoice_number: invNum,
      invoice_symbol: 'C26TGG',
      tax_authority_code: mccqt,
      issue_date: new Date().toISOString().slice(0, 10),
      buyer_name: buyerName,
      buyer_tax_code: buyerTaxCode,
      buyer_address: buyerAddress,
      subtotal,
      tax_rate: taxRate,
      tax_amount: taxAmt,
      total_amount: totalAmt,
      status: 'ISSUED',
      created_at: new Date().toLocaleString('vi-VN'),
    };

    const updated = addInvoice(newInv);
    setInvoices([...updated]);
    setIsModalOpen(false);
    showToast(`🧾 Đã xuất Hóa Đơn Điện Tử VAT thành công! Số HĐ: ${invNum} (${mccqt})`);
  };

  const totalSalesSubtotal = invoices.reduce((acc, i) => acc + i.subtotal, 0);
  const totalTaxOutput = invoices.reduce((acc, i) => acc + i.tax_amount, 0);
  const totalGrandAmount = invoices.reduce((acc, i) => acc + i.total_amount, 0);

  const filteredInvoices = invoices.filter((i) => {
    const q = searchTerm.toLowerCase();
    return (
      !q ||
      i.invoice_number.includes(q) ||
      i.buyer_name.toLowerCase().includes(q) ||
      i.buyer_tax_code.includes(q) ||
      i.tax_authority_code.toLowerCase().includes(q)
    );
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
            <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
            <h1 className="text-xl font-bold text-slate-900">Quản Lý Hóa Đơn Điện Tử & Thuế (E-Invoices TT78)</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              Thông Tư 78/2021/TT-BTC
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Xuất Hóa đơn điện tử VAT có Mã Của Cơ Quan Thuế (MCCQT), quản lý sổ hóa đơn bán ra & báo cáo thuế GTGT.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" /> Xuất Hóa Đơn Điện Tử VAT
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-slate-500 uppercase text-[10.5px]">Doanh Thu Chưa Thuế</span>
          <p className="text-xl font-semibold text-slate-900">{formatCurrency(totalSalesSubtotal)}</p>
          <p className="text-slate-600 font-semibold text-[11px]">🧾 {invoices.length} Hóa đơn đã xuất</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-slate-500 uppercase text-[10.5px]">Thuế GTGT Đầu Ra (VAT Output)</span>
          <p className="text-xl font-semibold text-emerald-700">{formatCurrency(totalTaxOutput)}</p>
          <p className="text-emerald-600 font-semibold text-[11px]">🏛️ Thuế GTGT 10% nộp ngân sách</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-slate-500 uppercase text-[10.5px]">Tổng Giá Trị Thanh Toán Hóa Đơn</span>
          <p className="text-xl font-semibold text-blue-700">{formatCurrency(totalGrandAmount)}</p>
          <p className="text-blue-600 font-semibold text-[11px]">✅ Đã phát hành chính thức</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 text-xs font-bold">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm số hóa đơn, tên đơn vị mua, MST, mã CQT..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-xl"
            />
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10.5px]">
                <th className="p-3">Ký Hiệu & Số Hóa Đơn</th>
                <th className="p-3">Mã Của Cơ Quan Thuế (MCCQT)</th>
                <th className="p-3">Tên Đơn Vị Mua Hàng & MST</th>
                <th className="p-3 tabular-nums text-right">Tiền Chưa Thuế</th>
                <th className="p-3 tabular-nums text-right">Thuế VAT (10%)</th>
                <th className="p-3 tabular-nums text-right">Tổng Thanh Toán</th>
                <th className="p-3 text-center">Trạng Thái</th>
                <th className="p-3 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3">
                    <p className="tabular-nums font-semibold text-emerald-700 text-xs">
                      {inv.invoice_symbol} - #{inv.invoice_number}
                    </p>
                    <p className="text-[11px] text-slate-500 font-bold mt-0.5">📅 {formatDate(inv.issue_date)}</p>
                  </td>

                  <td className="p-3 tabular-nums text-[10.5px] text-slate-600 font-bold">
                    {inv.tax_authority_code}
                  </td>

                  <td className="p-3 max-w-xs">
                    <p className="font-bold text-slate-900 text-xs leading-snug line-clamp-1">{inv.buyer_name}</p>
                    <p className="text-[10.5px] text-purple-700 tabular-nums font-bold">MST: {inv.buyer_tax_code}</p>
                  </td>

                  <td className="p-3 text-right tabular-nums font-bold text-slate-700">
                    {formatCurrency(inv.subtotal)}
                  </td>

                  <td className="p-3 text-right tabular-nums font-bold text-emerald-700">
                    +{formatCurrency(inv.tax_amount)}
                  </td>

                  <td className="p-3 text-right tabular-nums font-semibold text-slate-900 text-xs">
                    {formatCurrency(inv.total_amount)}
                  </td>

                  <td className="p-3 text-center">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10.5px] border border-emerald-200">
                      ✅ Đã Phát Hành
                    </span>
                  </td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => setSelectedInv(inv)}
                      className="p-1.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all"
                      title="Xem & In Hóa Đơn Điện Tử"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL XUẤT HÓA ĐƠN ĐIỆN TỬ MỚI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden p-6 space-y-4 text-xs font-bold">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" /> Xuất Hóa Đơn Điện Tử VAT (Thông Tư 78)
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssueInvoice} className="space-y-3">
              <div>
                <label className="block text-slate-700 mb-1">Tên Đơn Vị Mua Hàng *</label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Mã Số Thuế Bên Mua *</label>
                  <input
                    type="text"
                    required
                    value={buyerTaxCode}
                    onChange={(e) => setBuyerTaxCode(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Thuế Suất VAT (%) *</label>
                  <select
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value={10}>10% (Thông thường)</option>
                    <option value={8}>8% (Nghị định 94 ưu đãi)</option>
                    <option value={0}>0% (Xuất khẩu)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Địa Chỉ Doanh Nghiệp Mua *</label>
                <input
                  type="text"
                  required
                  value={buyerAddress}
                  onChange={(e) => setBuyerAddress(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Tổng Tiền Hàng Chưa Thuế (VND) *</label>
                <input
                  type="number"
                  required
                  value={subtotal}
                  onChange={(e) => setSubtotal(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-xl tabular-nums text-purple-700 font-bold"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl space-y-1 tabular-nums text-[11px]">
                <p className="text-emerald-900 font-bold">Tiền hàng chưa thuế: {formatCurrency(subtotal)}</p>
                <p className="text-emerald-700">Tiền thuế GTGT VAT ({taxRate}%): {formatCurrency(subtotal * (taxRate / 100))}</p>
                <p className="text-emerald-950 font-semibold text-xs pt-1 border-t border-emerald-200">
                  TỔNG CỘNG TIỀN THANH TOÁN: {formatCurrency(subtotal * (1 + taxRate / 100))}
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-4 h-4" /> Ký Số & Phát Hành Hóa Đơn VAT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL XEM HÓA ĐƠN CHI TIẾT IN AN */}
      {selectedInv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden p-6 space-y-4 text-xs font-bold">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="tabular-nums text-emerald-700 text-xs font-semibold">{selectedInv.invoice_symbol} - #{selectedInv.invoice_number}</span>
                <h3 className="font-bold text-sm text-slate-900">Hóa Đơn Giá Trị Gia Tăng (VAT Invoice)</h3>
              </div>
              <button onClick={() => setSelectedInv(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border rounded-2xl bg-slate-50 space-y-3">
              <div className="text-center border-b pb-2">
                <h4 className="font-bold text-sm text-slate-900">CÔNG TY CỔ PHẦN GGBG CRM ENTERPRISE</h4>
                <p className="text-[11px] text-slate-500 font-normal">Mã số thuế: 0109887766 • Mẫu số: 1/001 - Ký hiệu: {selectedInv.invoice_symbol}</p>
                <p className="text-[11px] tabular-nums text-emerald-700 font-bold mt-1">{selectedInv.tax_authority_code}</p>
              </div>

              <div className="space-y-1 font-medium text-slate-800">
                <p>Đơn vị mua hàng: <strong className="text-slate-900">{selectedInv.buyer_name}</strong></p>
                <p>Mã số thuế: <strong className="text-purple-700 tabular-nums">{selectedInv.buyer_tax_code}</strong></p>
                <p>Địa chỉ: <span className="text-slate-600">{selectedInv.buyer_address}</span></p>
                <p>Ngày phát hành: <span className="tabular-nums font-bold">{formatDate(selectedInv.issue_date)}</span></p>
              </div>

              <div className="p-3 bg-white border rounded-xl space-y-1 tabular-nums text-right">
                <p className="text-slate-600">Cộng tiền hàng: {formatCurrency(selectedInv.subtotal)}</p>
                <p className="text-emerald-700">Thuế GTGT ({selectedInv.tax_rate}%): {formatCurrency(selectedInv.tax_amount)}</p>
                <p className="text-slate-900 font-semibold text-sm pt-1 border-t">TỔNG TIỀN: {formatCurrency(selectedInv.total_amount)}</p>
              </div>

              <div className="pt-2 text-center text-emerald-800 text-[11px]">
                ✅ Hóa đơn điện tử đã được ký số trực tuyến & xác thực Mã Của Cơ Quan Thuế
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> In Hóa Đơn VAT
              </button>
              <button
                onClick={() => setSelectedInv(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl"
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
