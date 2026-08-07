'use client';

import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  CheckCircle2,
  Eye,
  Search,
  Building2,
  ShieldCheck,
  Calendar,
  Sparkles
} from 'lucide-react';
import dynamic from 'next/dynamic';

const OfficialContractPdfModal = dynamic(() => import('@/components/contracts/OfficialContractPdfModal'), { ssr: false });

interface ContractItem {
  id: string;
  contract_code: string;
  customer_name: string;
  company_name: string;
  ecom_platform: string;
  effective_date: string;
  expiry_date: string;
  status: 'ACTIVE' | 'PENDING_RENEWAL';
}

const CONTRACTS_LIST: ContractItem[] = [
  {
    id: 'cnt_001',
    contract_code: 'HD-2026-8801',
    customer_name: 'Trần Thanh Sơn',
    company_name: 'Công ty TNHH Vận Tải Hồng Lực',
    ecom_platform: 'Shopee Mall & TikTok Shop',
    effective_date: '2026-01-15',
    expiry_date: '2027-01-15',
    status: 'ACTIVE',
  },
  {
    id: 'cnt_002',
    contract_code: 'HD-2026-8802',
    customer_name: 'Nguyễn Thị Hoa',
    company_name: 'Hộ Kinh Doanh Thời Trang An An',
    ecom_platform: 'TikTok Shop Partner (TSP)',
    effective_date: '2026-02-10',
    expiry_date: '2027-02-10',
    status: 'ACTIVE',
  },
  {
    id: 'cnt_003',
    contract_code: 'HD-2026-8803',
    customer_name: 'Lê Hoàng Anh',
    company_name: 'Công ty CP Gia Dụng SmartHome',
    ecom_platform: 'Amazon Global Direct',
    effective_date: '2026-03-01',
    expiry_date: '2026-09-01',
    status: 'PENDING_RENEWAL',
  },
];

export default function ContractsPage() {
  const [contracts] = useState<ContractItem[]>(CONTRACTS_LIST);
  const [selectedContract, setSelectedContract] = useState<ContractItem | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContracts = contracts.filter((c) => {
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return (
        c.contract_code.toLowerCase().includes(term) ||
        c.company_name.toLowerCase().includes(term) ||
        c.customer_name.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const handleOpenPdf = (contract: ContractItem) => {
    setSelectedContract(contract);
    setIsPdfModalOpen(true);
  };

  return (
    <div className="space-y-5">
      {/* Header Hero */}
      <div className="gg-hero p-5 md:p-6 relative overflow-hidden">
        <div className="absolute -right-16 -top-20 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(46,92,230,0.12),transparent_70%)] pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-[10.5px] font-bold mb-2.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Official Contract PDF & Stamp Engine</span>
            </div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-blue-700">
              Quản Lý Hợp Đồng Dịch Vụ & Xuất File PDF Bản Quyền
            </h1>
            <p className="text-slate-500 text-xs mt-1 max-w-2xl leading-relaxed">
              Quản lý hợp đồng ủy quyền vận hành TMĐT chính thức có con dấu đỏ điện tử & Mã QR xác thực.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm mã hợp đồng, công ty..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-2xs space-y-4">
        <div className="overflow-x-auto touch-scroll sleek-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wide text-[10.5px]">
                <th className="p-3">Mã Hợp Đồng</th>
                <th className="p-3">Khách Hàng / Công Ty</th>
                <th className="p-3">Gói Sàn TMĐT</th>
                <th className="p-3">Ngày Hiệu Lực</th>
                <th className="p-3">Trạng Thái</th>
                <th className="p-3 text-right">Xem & Xuất PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredContracts.map((cnt) => (
                <tr key={cnt.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-3 tabular-nums font-bold text-blue-600">{cnt.contract_code}</td>
                  <td className="p-3">
                    <p className="font-bold text-slate-900">{cnt.company_name}</p>
                    <p className="text-[11px] text-slate-500 font-medium">Đại diện: {cnt.customer_name}</p>
                  </td>
                  <td className="p-3 font-semibold text-slate-700">{cnt.ecom_platform}</td>
                  <td className="p-3 tabular-nums text-slate-600">{cnt.effective_date} ➔ {cnt.expiry_date}</td>
                  <td className="p-3">
                    {cnt.status === 'ACTIVE' ? (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-bold text-[10px]">
                        ✓ Đang Hiệu Lực
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded font-bold text-[10px]">
                        ⏳ Đợi Gia Hạn
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {cnt.status === 'PENDING_RENEWAL' && (
                        <button
                          onClick={() => {
                            cnt.status = 'ACTIVE';
                            cnt.expiry_date = '2027-09-01';
                            alert(`📜 Đã sinh Phụ lục Gia hạn Hợp đồng thêm 12 tháng thành công cho ${cnt.company_name}!`);
                          }}
                          className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded text-[11px] inline-flex items-center gap-1 shadow-xs transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5" /> Phụ Lục Gia Hạn 1-Click
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenPdf(cnt)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-[11px] inline-flex items-center gap-1 shadow-xs transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Xem Hợp Đồng PDF
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PDF Modal */}
      {selectedContract && (
        <OfficialContractPdfModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          contractCode={selectedContract.contract_code}
          customerName={selectedContract.customer_name}
          companyName={selectedContract.company_name}
        />
      )}
    </div>
  );
}
