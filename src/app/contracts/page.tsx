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
  Sparkles,
  X
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

const INITIAL_CONTRACTS: ContractItem[] = [];

export default function ContractsPage() {
  const [contracts, setContracts] = useState<ContractItem[]>(INITIAL_CONTRACTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContract, setSelectedContract] = useState<ContractItem | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

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
      {/* Toast Notification */}
      {toastMsg && (
        <div className="p-4 rounded-xl bg-emerald-600 text-white font-medium text-xs shadow-sm flex items-center justify-between animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="p-1 hover:bg-emerald-700 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header - Clean White with Colorful Highlights */} <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"> <div className="flex items-center gap-3"> <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400"> <FileText className="w-5 h-5" /> </div> <div> <div className="flex items-center gap-2"> <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100"> Quản Lý Hợp Đồng </h1> <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 text-[11px] font-medium border border-blue-200 dark:border-blue-800"> {contracts.length} Hợp đồng </span> </div> <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5"> Quản lý hợp đồng dịch vụ vận hành TMĐT, con dấu điện tử & mã QR xác thực </p> </div> </div> </div> {/* Filter Bar */} <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"> <div className="relative w-full sm:w-80"> <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /> <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm mã hợp đồng, công ty..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          /> </div> </div> {/* Contracts Table */} <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"> <div className="overflow-x-auto touch-scroll sleek-scrollbar"> <table className="w-full text-left border-collapse text-xs"> <thead> <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider text-[10px]"> <th className="p-3">Mã Hợp Đồng</th> <th className="p-3">Khách Hàng / Công Ty</th> <th className="p-3">Gói Sàn TMĐT</th> <th className="p-3">Ngày Hiệu Lực</th> <th className="p-3">Trạng Thái</th> <th className="p-3 text-right">Thao Tác</th> </tr> </thead> <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium"> {filteredContracts.map((cnt) => ( <tr key={cnt.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"> <td className="p-3 font-mono font-semibold text-blue-600 dark:text-blue-400">{cnt.contract_code}</td> <td className="p-3"> <p className="font-semibold text-slate-900 dark:text-slate-100">{cnt.company_name}</p> <p className="text-[11px] text-slate-500">Đại diện: {cnt.customer_name}</p> </td> <td className="p-3 text-slate-700 dark:text-slate-300">{cnt.ecom_platform}</td> <td className="p-3 font-mono text-slate-600 dark:text-slate-400">{cnt.effective_date} ➔ {cnt.expiry_date}</td> <td className="p-3"> {cnt.status === 'ACTIVE' ? ( <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-md font-medium text-[11px]"> Đang Hiệu Lực </span> ) : ( <span className="px-2 py-0.5 bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-md font-medium text-[11px]"> Đợi Gia Hạn </span> )} </td> <td className="p-3 text-right"> <div className="flex items-center justify-end gap-2"> {cnt.status === 'PENDING_RENEWAL' && ( <button
                          onClick={() => {
                            cnt.status = 'ACTIVE';
                            cnt.expiry_date = '2027-09-01';
                            setContracts([...contracts]);
                            showToast(`📜 Đã sinh Phụ lục Gia hạn Hợp đồng thêm 12 tháng thành công cho ${cnt.company_name}!`);
                          }}
                          className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded text-[11px] inline-flex items-center gap-1 shadow-xs transition-colors"
                        > <Sparkles className="w-3.5 h-3.5" /> Phụ Lục Gia Hạn 1-Click </button> )} <button
                        onClick={() => handleOpenPdf(cnt)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-[11px] inline-flex items-center gap-1 shadow-xs transition-colors"
                      > <Eye className="w-3.5 h-3.5" /> Xem Hợp Đồng </button> </div> </td> </tr> ))} </tbody> </table> </div> </div> {/* PDF Modal */}
      {selectedContract && ( <OfficialContractPdfModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          contractCode={selectedContract.contract_code}
          customerName={selectedContract.customer_name}
          companyName={selectedContract.company_name}
        /> )} </div> );
}
