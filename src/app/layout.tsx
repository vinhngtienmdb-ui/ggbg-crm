import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ModuleToggleProvider } from '@/context/ModuleToggleContext';
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
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
        <ThemeProvider>
          <AuthProvider>
            <ModuleToggleProvider>
              <AppShell>{children}</AppShell>
            </ModuleToggleProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
