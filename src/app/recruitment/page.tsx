'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RecruitmentPage() {
  const router = useRouter();

  useEffect(() => {
    // Sáp nhập module Tuyển Dụng vào Module Quản Lý Nhân Sự thống nhất
    router.replace('/hrm?tab=recruitment');
  }, [router]);

  return ( <div className="p-12 text-center text-xs font-semibold text-slate-500"> Đang chuyển hướng đến phân hệ Tuyển Dụng trong Module Quản Lý Nhân Sự Hợp Nhất... </div> );
}
