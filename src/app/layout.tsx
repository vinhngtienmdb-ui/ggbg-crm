import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'GGBingo CRM - Enterprise E-Commerce Platform',
  description: 'Hệ thống CRM quản lý khách hàng, lead, dịch vụ vận hành gian hàng TMĐT và nền tảng GGBingoVN',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="bg-slate-50 text-slate-900 overflow-hidden font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
