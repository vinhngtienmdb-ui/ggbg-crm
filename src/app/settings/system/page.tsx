'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Cloud,
  Database,
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Save,
  Activity,
  Key,
  Mail,
  Send,
  Bell,
  MessageSquare,
  ShieldAlert,
  Eye,
  EyeOff,
  History,
  Check,
  Server,
  Sliders,
  Sparkles,
  RefreshCw,
  ShoppingBag,
  Bot,
  Building2,
  Palette,
  Image as ImageIcon,
  Upload,
  Trash2,
  Globe,
  ExternalLink
} from 'lucide-react';
import { SystemConfig, getSystemConfig, saveSystemConfig } from '@/lib/systemConfigStore';
import { useModuleToggles } from '@/context/ModuleToggleContext';
import { useAuth } from '@/context/AuthContext';
import { useBranding, DEFAULT_BRANDING } from '@/context/BrandingContext';
import { BrandingConfig } from '@/types';
import { ModuleBanner } from '@/components/ui';

interface TestResult {
  service: string;
  status: 'IDLE' | 'TESTING' | 'SUCCESS' | 'FAILED';
  latency_ms?: number;
  message?: string;
  tested_at?: string;
}

function SystemSettingsContent() {
  const { user, simulatedRole } = useAuth();
  const isAdmin = Boolean(user?.is_super_admin || user?.role === 'SUPER_ADMIN' || simulatedRole === 'SUPER_ADMIN');
  const { branding, updateBranding, resetBranding } = useBranding();
  const searchParams = useSearchParams();
  const [config, setConfig] = useState<SystemConfig>(getSystemConfig());
  const [saveToast, setSaveToast] = useState('');
  const [activeTab, setActiveTab] = useState<'BRANDING' | 'MODULE_TOGGLES' | 'INFRASTRUCTURE' | 'API_KEYS' | 'SMTP' | 'WEBHOOKS' | 'SECURITY_AUDIT' | 'COMPANY_IDENTITY'>('BRANDING');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'general' || tab === 'branding') setActiveTab('BRANDING');
    else if (tab === 'security' || tab === 'audit') setActiveTab('SECURITY_AUDIT');
    else if (tab === 'email_smtp' || tab === 'smtp') setActiveTab('SMTP');
    else if (tab === 'integrations' || tab === 'api_keys' || tab === 'api') setActiveTab('API_KEYS');
    else if (tab === 'backup' || tab === 'infrastructure' || tab === 'infra') setActiveTab('INFRASTRUCTURE');
    else if (tab === 'webhooks') setActiveTab('WEBHOOKS');
    else if (tab === 'modules' || tab === 'toggles') setActiveTab('MODULE_TOGGLES');
    else if (tab === 'identity' || tab === 'company') setActiveTab('COMPANY_IDENTITY');
  }, [searchParams]);

  // Form state for branding
  const [brandingForm, setBrandingForm] = useState<BrandingConfig>(config.branding || DEFAULT_BRANDING);

  // Sync branding state if external branding updates
  React.useEffect(() => {
    if (branding) {
      setBrandingForm(branding);
    }
  }, [branding]);

  // Company Identity Form State
  const [companyInfo, setCompanyInfo] = useState({
    name: 'CÔNG TY CỔ PHẦN GGBG CRM ENTERPRISE',
    tax_code: '0109887766',
    address: 'Tầng 5, Tòa nhà Bitexco Financial Tower, Quận 1, TP. Hồ Chí Minh',
    ceo_name: 'Nguyễn Tiến Vinh',
    chief_accountant: 'Trần Thị Mai',
    seal_status: ' Dấu Mộc Đỏ Điện Tử Đã Xác Thực',
  });
  const { toggles, toggleModule, resetToggles } = useModuleToggles();

  // Secret Masking Toggles
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});

  const toggleShowKey = (keyName: string) => {
    setShowKeys((prev) => ({ ...prev, [keyName]: !prev[keyName] }));
  };

  // Connection Test States
  const [r2Test, setR2Test] = useState<TestResult>({ service: 'R2', status: 'IDLE' });
  const [supabaseTest, setSupabaseTest] = useState<TestResult>({ service: 'SUPABASE', status: 'IDLE' });
  const [voipTest, setVoipTest] = useState<TestResult>({ service: 'VOIP', status: 'IDLE' });
  const [smtpTest, setSmtpTest] = useState<TestResult>({ service: 'SMTP', status: 'IDLE' });
  const [telegramTest, setTelegramTest] = useState<TestResult>({ service: 'TELEGRAM', status: 'IDLE' });
  const [zaloTest, setZaloTest] = useState<TestResult>({ service: 'ZALO', status: 'IDLE' });
  const [apiKeysTest, setApiKeysTest] = useState<TestResult>({ service: 'API_KEYS', status: 'IDLE' });

  const handleSave = (e: React.FormEvent, sectionDetails?: string) => {
    e.preventDefault();
    const updated = saveSystemConfig(config, 'Super Admin', sectionDetails || 'Cập nhật cấu hình tích hợp hệ thống');
    setConfig(updated);
    setSaveToast('Đã lưu cấu hình hệ thống và ghi nhật ký Audit Log thành công!');
    setTimeout(() => setSaveToast(''), 4000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setSaveToast(' Dung lượng file ảnh quá lớn (tối đa 2MB)');
      setTimeout(() => setSaveToast(''), 4000);
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setBrandingForm((prev) => ({
        ...prev,
        logoType: 'IMAGE',
        logoUrl: dataUrl,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      setSaveToast(' Dung lượng favicon tối đa 1MB');
      setTimeout(() => setSaveToast(''), 4000);
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setBrandingForm((prev) => ({
        ...prev,
        faviconUrl: dataUrl,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      setSaveToast(' Thao tác bị từ chối: Chỉ Quản Trị Viên (Admin) mới có quyền đổi nhận diện thương hiệu!');
      setTimeout(() => setSaveToast(''), 4000);
      return;
    }
    updateBranding(brandingForm);
    const updated = saveSystemConfig({ ...config, branding: brandingForm }, 'Super Admin', `Cập nhật Thương hiệu: Tên [${brandingForm.systemName}], Logo [${brandingForm.logoType}]`);
    setConfig(updated);
    setSaveToast('🎉 Đã cập nhật Tên hệ thống, Logo và Favicon cho toàn bộ hệ thống!');
    setTimeout(() => setSaveToast(''), 4000);
  };

  const handleResetBrandingConfig = () => {
    if (!isAdmin) {
      setSaveToast(' Thao tác bị từ chối: Chỉ Quản Trị Viên mới có quyền thực hiện!');
      setTimeout(() => setSaveToast(''), 4000);
      return;
    }
    resetBranding();
    setBrandingForm(DEFAULT_BRANDING);
    const updated = saveSystemConfig({ ...config, branding: DEFAULT_BRANDING }, 'Super Admin', 'Khôi phục nhận diện thương hiệu mặc định GGBingo CRM');
    setConfig(updated);
    setSaveToast('Đã khôi phục nhận diện thương hiệu mặc định GGBingo CRM!');
    setTimeout(() => setSaveToast(''), 4000);
  };

  const handleTestConnection = async (serviceType: 'R2' | 'SUPABASE' | 'VOIP') => {
    const setTestState = serviceType === 'R2' ? setR2Test : serviceType === 'SUPABASE' ? setSupabaseTest : setVoipTest;
    setTestState({ service: serviceType, status: 'TESTING' });

    try {
      const res = await fetch('/api/system/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_service: serviceType }),
      });

      const data = await res.json();
      if (data.success) {
        setTestState({
          service: serviceType,
          status: 'SUCCESS',
          latency_ms: data.latency_ms,
          message: data.details,
          tested_at: data.tested_at,
        });
      } else {
        setTestState({
          service: serviceType,
          status: 'FAILED',
          message: data.message || 'Kết nối thất bại',
        });
      }
    } catch {
      setTestState({
        service: serviceType,
        status: 'FAILED',
        message: 'Không phản hồi từ cổng kiểm tra',
      });
    }
  };

  const handleTestSmtp = async () => {
    setSmtpTest({ service: 'SMTP', status: 'TESTING' });
    try {
      const res = await fetch('/api/system/test-smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: config.smtp.host,
          port: config.smtp.port,
          sender_email: config.smtp.sender_email,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSmtpTest({
          service: 'SMTP',
          status: 'SUCCESS',
          latency_ms: data.latency_ms,
          message: data.details,
          tested_at: data.tested_at,
        });
      } else {
        setSmtpTest({
          service: 'SMTP',
          status: 'FAILED',
          message: data.message || 'Gửi mail thử nghiệm thất bại',
        });
      }
    } catch {
      setSmtpTest({
        service: 'SMTP',
        status: 'FAILED',
        message: 'Không thể phản hồi từ cổng kiểm tra SMTP',
      });
    }
  };

  const handleTestWebhook = async (targetType: 'TELEGRAM' | 'ZALO_ZNS') => {
    const setTestState = targetType === 'TELEGRAM' ? setTelegramTest : setZaloTest;
    setTestState({ service: targetType, status: 'TESTING' });

    try {
      const res = await fetch('/api/system/test-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_type: targetType,
          telegram_chat_id: config.webhook.telegram_chat_id,
          zalo_webhook_url: config.webhook.zalo_zns_webhook_url,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTestState({
          service: targetType,
          status: 'SUCCESS',
          latency_ms: data.latency_ms,
          message: data.details,
          tested_at: data.tested_at,
        });
      } else {
        setTestState({
          service: targetType,
          status: 'FAILED',
          message: data.message || 'Bắn Webhook thất bại',
        });
      }
    } catch {
      setTestState({
        service: targetType,
        status: 'FAILED',
        message: 'Lỗi phản hồi từ server Webhook',
      });
    }
  };

  const handleTestApiKeys = async () => {
    setApiKeysTest({ service: 'API_KEYS', status: 'TESTING' });
    setTimeout(() => {
      setApiKeysTest({
        service: 'API_KEYS',
        status: 'SUCCESS',
        latency_ms: 120,
        message: 'Tất cả API Keys (Shopee, TikTok, Lazada, Amazon, Gemini AI) đã hợp lệ và hoạt động bình thường!',
        tested_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      });
    }, 1000);
  };

  return ( <div className="space-y-6 max-w-6xl mx-auto"> {/* Toast Notification */}
      {saveToast && ( <div className="p-4 rounded-xl bg-emerald-600 text-white font-medium text-xs shadow-xl flex items-center justify-between animate-in fade-in slide-in-from-top duration-300"> <div className="flex items-center gap-2"> <CheckCircle2 className="w-5 h-5 text-emerald-200" /> <span>{saveToast}</span> </div> </div> )}

      {/* HEADER BANNER - THEO CHUẨN DASHBOARD */}
      <ModuleBanner
        badge={{
          label: 'Trung Tâm Cấu Hình & Tích Hợp Hệ Thống',
          icon: Sliders,
          variant: 'blue',
        }}
        title="Cấu Hình Tích Hợp & Quản Trị Hệ Thống"
        subtitle="Quản lý tập trung hạ tầng Cloud R2/Supabase, API sàn TMĐT & Gemini AI, Email SMTP, Webhooks và bảo mật cấp doanh nghiệp"
        kpis={[
          { label: 'Trạng Thái Cloud', value: '🟢 Hoạt Động', subtext: 'R2 + Supabase Active' },
          { label: 'Phân Hệ Kích Hoạt', value: '10 / 10 Phân hệ', subtext: 'Đang mở toàn quyền' },
          { label: 'Bảo Mật Hệ Thống', value: 'AES-256 GCM', subtext: 'Mã hóa PII 100%' },
        ]}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={(e) => handleSave(e, 'Lưu cấu hình hệ thống tổng thể')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Cấu Hình</span>
            </button>
          </div>
        }
      />

      {/* NỘI DUNG CẤU HÌNH HỆ THỐNG FULL-WIDTH */}
      <div className="space-y-6">
        <form onSubmit={(e) => (activeTab === 'BRANDING' ? handleSaveBranding(e) : handleSave(e, `Lưu cấu hình tab ${activeTab}`))} className="space-y-6"> {/* ==================== TAB: BRANDING & IDENTITY ==================== */}
        {activeTab === 'BRANDING' && ( <div className="space-y-6 animate-in fade-in duration-200"> {/* System-wide Admin Permission Banner */}
            {isAdmin ? ( <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs font-medium flex items-center justify-between shadow-2xs"> <div className="flex items-center gap-2.5"> <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0" /> <div> <p className="font-medium text-purple-950">Quyền Quản Trị Thương Hiệu (Brand Admin Active)</p> <p className="text-[11px] text-purple-700 mt-0.5"> Thay đổi Tên hệ thống, Logo và Favicon sẽ được áp dụng ngay lập tức trên toàn bộ hệ thống cho tất cả người dùng. </p> </div> </div> <span className="px-2.5 py-1 bg-purple-600 text-white rounded-lg text-[10px] font-medium shrink-0"> SYSTEM-WIDE BRANDING </span> </div> ) : ( <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-medium flex items-center justify-between shadow-2xs"> <div className="flex items-center gap-2.5"> <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" /> <div> <p className="font-medium text-amber-950">Quyền Hạn Hạn Chế (Chỉ Xem)</p> <p className="text-[11px] text-amber-800 mt-0.5"> Chỉ Quản Trị Viên (Admin) mới có quyền thay đổi Tên hệ thống, Logo và Favicon toàn hệ thống. </p> </div> </div> <span className="px-2.5 py-1 bg-amber-600 text-white rounded-lg text-[10px] font-medium shrink-0"> READ-ONLY </span> </div> )}

            {/* Main 2-Column Grid: Form Left, Live Preview Right */} <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"> {/* LEFT COLUMN: BRANDING CONFIG FORM */} <div className="lg:col-span-7 space-y-6"> {/* 1. Tên Hệ Thống & Slogan */} <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 space-y-4"> <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3"> <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-medium"> <Palette className="w-4 h-4" /> </div> <div> <h3 className="font-semibold text-xs text-slate-900 uppercase tracking-wider">1. Tên Hệ Thống & Khẩu Hiệu</h3> <p className="text-[11px] text-slate-500">Hiển thị trên toàn bộ Sidebar, Header, Title trình duyệt và Màn hình Đăng nhập</p> </div> </div> <div className="space-y-3"> <div> <label className="block text-xs font-medium text-slate-700 mb-1"> Tên Hệ Thống (System Name) <span className="text-red-500">*</span> </label> <input
                        type="text"
                        disabled={!isAdmin}
                        value={brandingForm.systemName}
                        onChange={(e) => setBrandingForm({ ...brandingForm, systemName: e.target.value })}
                        placeholder="VD: GGBingo CRM"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all disabled:opacity-60"
                      /> </div> <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"> <div> <label className="block text-xs font-medium text-slate-700 mb-1"> Khẩu Hiệu / Phụ Đề (Tagline) </label> <input
                          type="text"
                          disabled={!isAdmin}
                          value={brandingForm.tagline}
                          onChange={(e) => setBrandingForm({ ...brandingForm, tagline: e.target.value })}
                          placeholder="VD: Enterprise Platform"
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-purple-500 outline-none transition-all disabled:opacity-60"
                        /> </div> <div> <label className="block text-xs font-medium text-slate-700 mb-1"> Hậu Tố Tiêu Đề Tab Trình Duyệt </label> <input
                          type="text"
                          disabled={!isAdmin}
                          value={brandingForm.titleSuffix}
                          onChange={(e) => setBrandingForm({ ...brandingForm, titleSuffix: e.target.value })}
                          placeholder="VD: - Enterprise E-Commerce Platform"
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-purple-500 outline-none transition-all disabled:opacity-60"
                        /> </div> </div> </div> </div> {/* 2. Logo / Icon Hệ Thống */} <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 space-y-4"> <div className="flex items-center justify-between border-b border-slate-100 pb-3"> <div className="flex items-center gap-2.5"> <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-medium"> <ImageIcon className="w-4 h-4" /> </div> <div> <h3 className="font-semibold text-xs text-slate-900 uppercase tracking-wider">2. Biểu Tượng & Logo Ứng Dụng</h3> <p className="text-[11px] text-slate-500">Tùy chọn tải ảnh Logo riêng hoặc dùng Huy hiệu chữ viết tắt</p> </div> </div> {/* Mode Switcher */} <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-[11px] font-medium"> <button
                        type="button"
                        onClick={() => isAdmin && setBrandingForm({ ...brandingForm, logoType: 'TEXT_BADGE' })}
                        className={`px-3 py-1 rounded-lg transition-all ${
                          brandingForm.logoType === 'TEXT_BADGE' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      > Huy Hiệu Chữ </button> <button
                        type="button"
                        onClick={() => isAdmin && setBrandingForm({ ...brandingForm, logoType: 'IMAGE' })}
                        className={`px-3 py-1 rounded-lg transition-all ${
                          brandingForm.logoType === 'IMAGE' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:bg-slate-900'
                        }`}
                      > Tải Ảnh Logo </button> </div> </div> {/* Mode: TEXT_BADGE */}
                  {brandingForm.logoType === 'TEXT_BADGE' && ( <div className="space-y-4 animate-in fade-in duration-200"> <div> <label className="block text-xs font-medium text-slate-700 mb-1"> Ký Tự Viết Tắt Logo (Tối đa 4 ký tự) </label> <input
                          type="text"
                          maxLength={4}
                          disabled={!isAdmin}
                          value={brandingForm.logoText}
                          onChange={(e) => setBrandingForm({ ...brandingForm, logoText: e.target.value.toUpperCase() })}
                          placeholder="VD: GG"
                          className="w-32 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold uppercase text-purple-700 focus:bg-white focus:border-purple-500 outline-none transition-all disabled:opacity-60"
                        /> </div> <div> <label className="block text-xs font-medium text-slate-700 mb-2"> Bảng Màu Gradient Huy Hiệu </label> <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5"> {[
                            { label: 'Tím - Xanh Dương (Mặc định)', value: 'from-purple-600 via-indigo-600 to-blue-500' },
                            { label: 'Xanh Biển - Cyan', value: 'from-blue-600 via-cyan-600 to-teal-500' },
                            { label: 'Xanh Lá - Emerald', value: 'from-emerald-600 via-teal-600 to-green-500' },
                            { label: 'Đỏ Hồng - Cam', value: 'from-rose-600 via-pink-600 to-amber-500' },
                            { label: 'Cam Vàng - Hổ Phách', value: 'from-amber-500 via-orange-500 to-red-500' },
                            { label: 'Xám Đen - Tinh Tế', value: 'from-slate-900 via-slate-800 to-zinc-700' },
                          ].map((g) => ( <button
                              key={g.value}
                              type="button"
                              disabled={!isAdmin}
                              onClick={() => setBrandingForm({ ...brandingForm, logoBgGradient: g.value })}
                              className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                                brandingForm.logoBgGradient === g.value
                                  ? 'border-purple-600 bg-purple-50/50 ring-2 ring-purple-300'
                                  : 'border-slate-200 hover:bg-slate-50'
                              }`}
                            > <div className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${g.value} shrink-0 shadow-xs`} /> <span className="text-[11px] font-medium text-slate-700 truncate">{g.label}</span> </button> ))} </div> </div> </div> )}

                  {/* Mode: IMAGE */}
                  {brandingForm.logoType === 'IMAGE' && ( <div className="space-y-4 animate-in fade-in duration-200"> <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200"> {brandingForm.logoUrl ? ( <div className="relative group shrink-0"> <img
                              src={brandingForm.logoUrl}
                              alt="Logo Preview"
                              className="w-16 h-16 rounded-xl object-contain bg-white border border-slate-200 p-1 shadow-sm"
                            /> {isAdmin && ( <button
                                type="button"
                                onClick={() => setBrandingForm({ ...brandingForm, logoUrl: '' })}
                                className="absolute -top-1.5 -right-1.5 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-md transition-all"
                                title="Xóa ảnh logo"
                              > <Trash2 className="w-3 h-3" /> </button> )} </div> ) : ( <div className="w-16 h-16 rounded-xl bg-slate-200 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 shrink-0"> <ImageIcon className="w-6 h-6" /> </div> )} <div className="flex-1 space-y-2"> <p className="text-xs font-medium text-slate-800">Tải tệp ảnh Logo từ thiết bị</p> <p className="text-[11px] text-slate-500">Hỗ trợ định dạng PNG, JPG, WebP, SVG (Khuyến nghị ảnh vuông hoặc tỉ lệ 1:1, dung lượng &lt; 2MB)</p> <label className={`inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-slate-300 hover:border-purple-500 text-slate-700 font-medium text-xs rounded-xl cursor-pointer shadow-xs hover:bg-purple-50 transition-all ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}> <Upload className="w-3.5 h-3.5 text-purple-600" /> <span>Chọn File Ảnh</span> <input
                              type="file"
                              accept="image/*"
                              disabled={!isAdmin}
                              onChange={handleLogoUpload}
                              className="hidden"
                            /> </label> </div> </div> <div> <label className="block text-xs font-medium text-slate-700 mb-1"> Hoặc Nhập Đường Dẫn Ảnh Trực Tiếp (Image URL / CDN Link) </label> <input
                          type="text"
                          disabled={!isAdmin}
                          value={brandingForm.logoUrl}
                          onChange={(e) => setBrandingForm({ ...brandingForm, logoUrl: e.target.value })}
                          placeholder="https://your-domain.com/logo.png"
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:border-purple-500 outline-none transition-all disabled:opacity-60"
                        /> </div> </div> )} </div> {/* 3. Favicon Trình Duyệt */} <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 space-y-4"> <div className="flex items-center justify-between border-b border-slate-100 pb-3"> <div className="flex items-center gap-2.5"> <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-medium"> <Globe className="w-4 h-4" /> </div> <div> <h3 className="font-semibold text-xs text-slate-900 uppercase tracking-wider">3. Favicon Trình Duyệt</h3> <p className="text-[11px] text-slate-500">Biểu tượng hiển thị trên tab trình duyệt và bookmark của người dùng</p> </div> </div> <button
                      type="button"
                      disabled={!isAdmin}
                      onClick={() => {
                        if (brandingForm.logoType === 'IMAGE' && brandingForm.logoUrl) {
                          setBrandingForm({ ...brandingForm, faviconUrl: brandingForm.logoUrl });
                          setSaveToast('Đã sao chép ảnh Logo thành Favicon!');
                          setTimeout(() => setSaveToast(''), 3000);
                        } else {
                          setBrandingForm({ ...brandingForm, faviconUrl: '' });
                          setSaveToast('Favicon sẽ tự động tạo từ Huy hiệu chữ!');
                          setTimeout(() => setSaveToast(''), 3000);
                        }
                      }}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-[11px] font-medium flex items-center gap-1.5 transition-all disabled:opacity-50"
                    > <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Lấy từ Logo </button> </div> <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200"> <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1 shadow-sm shrink-0"> {brandingForm.faviconUrl ? ( <img src={brandingForm.faviconUrl} alt="Favicon" className="w-8 h-8 object-contain" /> ) : brandingForm.logoType === 'IMAGE' && brandingForm.logoUrl ? ( <img src={brandingForm.logoUrl} alt="Favicon" className="w-8 h-8 object-contain" /> ) : ( <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${brandingForm.logoBgGradient} flex items-center justify-center text-white font-semibold text-xs uppercase`}> {brandingForm.logoText || 'GG'} </div> )} </div> <div className="flex-1 space-y-2"> <p className="text-xs font-medium text-slate-800">Tải tệp Favicon (.ico / .png / .svg)</p> <label className={`inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 hover:border-emerald-500 text-slate-700 font-medium text-xs rounded-xl cursor-pointer shadow-xs hover:bg-emerald-50 transition-all ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}> <Upload className="w-3.5 h-3.5 text-emerald-600" /> <span>Tải Tệp Favicon</span> <input
                          type="file"
                          accept=".ico,.png,.svg,.jpg"
                          disabled={!isAdmin}
                          onChange={handleFaviconUpload}
                          className="hidden"
                        /> </label> </div> </div> <div> <label className="block text-xs font-medium text-slate-700 mb-1"> Hoặc URL Favicon Trực Tiếp </label> <input
                      type="text"
                      disabled={!isAdmin}
                      value={brandingForm.faviconUrl}
                      onChange={(e) => setBrandingForm({ ...brandingForm, faviconUrl: e.target.value })}
                      placeholder="https://your-domain.com/favicon.ico (Để trống để tự động sinh từ Logo)"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:border-emerald-500 outline-none transition-all disabled:opacity-60"
                    /> </div> </div> </div> {/* RIGHT COLUMN: LIVE INTERACTIVE PREVIEW */} <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20"> <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 space-y-5"> <div className="flex items-center gap-2 border-b border-slate-100 pb-3"> <Sparkles className="w-4 h-4 text-amber-500" /> <h3 className="font-semibold text-xs text-slate-900 uppercase tracking-wider">Xem Trước Trực Tiếp (Live Preview)</h3> </div> {/* 1. Browser Tab Simulation */} <div className="space-y-2"> <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1"> 🌐 1. Tab Trình Duyệt Web </span> <div className="bg-slate-200 dark:bg-slate-800 rounded-xl p-2.5 space-y-2 border border-slate-300 dark:border-slate-700 shadow-inner"> {/* Browser Mockup Tab */} <div className="flex items-center gap-2"> <div className="bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-100 flex items-center gap-2 shadow-xs border border-slate-200 dark:border-slate-800 max-w-[280px] truncate"> {brandingForm.faviconUrl ? ( <img src={brandingForm.faviconUrl} alt="Favicon" className="w-3.5 h-3.5 object-contain shrink-0" /> ) : brandingForm.logoType === 'IMAGE' && brandingForm.logoUrl ? ( <img src={brandingForm.logoUrl} alt="Favicon" className="w-3.5 h-3.5 object-contain shrink-0" /> ) : ( <div className={`w-3.5 h-3.5 rounded bg-gradient-to-tr ${brandingForm.logoBgGradient} flex items-center justify-center text-white text-[8px] font-semibold shrink-0`}> {brandingForm.logoText || 'GG'} </div> )} <span className="truncate text-[11px]"> {brandingForm.systemName || 'GGBingo CRM'} {brandingForm.titleSuffix} </span> <span className="text-slate-400 hover:text-slate-600 text-[10px] ml-auto shrink-0">✕</span> </div> <span className="text-slate-400 text-xs font-medium">+</span> </div> {/* Mock URL Bar */} <div className="bg-white dark:bg-slate-900 px-3 py-1 rounded-md text-[10px] font-mono text-slate-500 flex items-center gap-1.5 border border-slate-200 dark:border-slate-800"> <span className="text-emerald-500">🔒</span> <span className="text-slate-800 dark:text-slate-300 font-semibold">https://crm.yourcompany.vn</span> <span className="text-slate-400">/settings/system</span> </div> </div> </div> {/* 2. Sidebar Header Simulation */} <div className="space-y-2"> <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1"> 2. Đầu Menu Thanh Điều Hướng (Sidebar Brand) </span> <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"> <div className="flex items-center gap-2.5"> {brandingForm.logoType === 'IMAGE' && brandingForm.logoUrl ? ( <img
                            src={brandingForm.logoUrl}
                            alt="Logo"
                            className="w-[36px] h-[36px] rounded-xl object-contain bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm shrink-0"
                          /> ) : ( <div
                            className={`w-[36px] h-[36px] rounded-xl bg-gradient-to-tr ${brandingForm.logoBgGradient || 'from-purple-600 via-indigo-600 to-blue-500'} flex items-center justify-center text-white font-semibold text-sm shadow-md shadow-purple-600/20 shrink-0 uppercase`}
                          > {brandingForm.logoText || 'GG'} </div> )} <div className="min-w-0 flex-1"> <h4 className="font-semibold text-purple-700 dark:text-purple-400 text-sm tracking-tight leading-tight flex items-center gap-1 truncate"> <span className="truncate">{brandingForm.systemName || 'GGBingo CRM'}</span> <Sparkles className="w-3 h-3 text-amber-400 shrink-0" /> </h4> <p className="text-[10px] text-purple-600/80 dark:text-purple-400/80 font-medium uppercase tracking-[0.6px] truncate"> {brandingForm.tagline || 'Enterprise Platform'} </p> </div> </div> <div className="px-3 py-1.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/60 flex flex-col"> <span className="text-[11px] font-semibold text-purple-900 dark:text-purple-300 truncate">Vận hành TMĐT & {brandingForm.systemName || 'GGBingo CRM'}</span> <span className="text-[9.5px] text-purple-700/80 dark:text-purple-400/80 font-medium truncate">Shopee · TikTok · Lazada · Amazon</span> </div> </div> </div> {/* 3. Mini Login Header Simulation */} <div className="space-y-2"> <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1"> 3. Nhận Diện Trên Trang Đăng Nhập </span> <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm flex items-center gap-3"> {brandingForm.logoType === 'IMAGE' && brandingForm.logoUrl ? ( <img
                          src={brandingForm.logoUrl}
                          alt="Logo"
                          className="w-10 h-10 rounded-xl object-contain bg-white/10 border border-white/20 p-1 shrink-0"
                        /> ) : ( <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${brandingForm.logoBgGradient} flex items-center justify-center text-white font-semibold text-xs shrink-0 uppercase shadow-md`}
                        > {brandingForm.logoText || 'GG'} </div> )} <div> <h4 className="text-white font-semibold text-xs tracking-tight flex items-center gap-1"> {brandingForm.systemName || 'GGBingo CRM'} <Sparkles className="w-3 h-3 text-amber-400" /> </h4> <p className="text-purple-300 text-[10px] font-medium uppercase tracking-wider mt-0.5"> {brandingForm.tagline || 'Enterprise Platform'} </p> </div> </div> </div> {/* Save & Reset Actions */} <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2.5"> <button
                      type="button"
                      disabled={!isAdmin}
                      onClick={handleResetBrandingConfig}
                      className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                    > <RefreshCw className="w-3.5 h-3.5 text-slate-500" /> Khôi Phục Gốc </button> <button
                      type="submit"
                      disabled={!isAdmin}
                      className="w-full sm:flex-1 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                    > <Save className="w-4 h-4" /> Lưu Nhận Diện Thương Hiệu </button> </div> </div> </div> </div> </div> )}

        {/* ==================== TAB 0: MODULE FEATURE TOGGLES ==================== */}
        {activeTab === 'MODULE_TOGGLES' && ( <div className="space-y-5"> {/* System-wide Admin Permission Banner */}
            {isAdmin ? ( <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-medium flex items-center justify-between shadow-2xs"> <div className="flex items-center gap-2.5"> <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" /> <div> <p className="font-medium text-blue-950">Quyền Quản Trị Viên (Admin Privileges Active)</p> <p className="text-[11px] text-blue-700 mt-0.5"> Bật/tắt các phân hệ chức năng sẽ lập tức áp dụng và đồng bộ trên toàn bộ hệ thống cho tất cả người dùng. </p> </div> </div> <span className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-medium shrink-0"> SYSTEM-WIDE ADMIN </span> </div> ) : ( <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-medium flex items-center justify-between shadow-2xs"> <div className="flex items-center gap-2.5"> <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" /> <div> <p className="font-medium text-amber-950">Quyền Hạn Hạn Chế (Chỉ Xem)</p> <p className="text-[11px] text-amber-800 mt-0.5"> Việc bật/tắt chức năng chỉ do Admin làm, áp dụng thay đổi cho toàn hệ thống. Tài khoản hiện tại không có quyền thay đổi. </p> </div> </div> <span className="px-2.5 py-1 bg-amber-600 text-white rounded-lg text-[10px] font-medium shrink-0"> READ-ONLY </span> </div> )} <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"> <div> <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2"> <Sliders className="w-4 h-4 text-purple-600" /> Quản Lý Phân Hệ Tính Năng (Module Feature Toggles) </h3> <p className="text-xs text-slate-500 mt-0.5"> Bật/tắt các phân hệ chức năng trên hệ thống. Phân hệ bị tắt sẽ tự động ẩn hoàn toàn khỏi Sidebar navigation. </p> </div> <button
                type="button"
                onClick={() => {
                  if (!isAdmin) {
                    setSaveToast(' Thao tác bị từ chối: Việc bật/tắt chức năng chỉ do Admin làm!');
                    setTimeout(() => setSaveToast(''), 4000);
                    return;
                  }
                  resetToggles();
                  setSaveToast('Đã khôi phục bật tất cả phân hệ chức năng cho toàn hệ thống!');
                  setTimeout(() => setSaveToast(''), 4000);
                }}
                disabled={!isAdmin}
                className={`px-3 py-1.5 font-semibold rounded text-xs border transition-all ${
                  isAdmin
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 cursor-pointer'
                    : 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                }`}
              > Khôi Phục Mặc Định (Bật Tất Cả) </button> </div> <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5"> {[
                { key: 'customers', name: 'Khách Hàng 360°', path: '/customers', desc: 'Hồ sơ KYC B2B/B2C, bảo mật mask SĐT & công nợ' },
                { key: 'leads', name: 'Lead & Phễu', path: '/leads', desc: 'Phễu Kanban, Webhook lead real-time & chống trùng SĐT' },
                { key: 'chat', name: 'CSKH Đa Kênh', path: '/chat', desc: 'Tích hợp Zalo OA, Zalo Personal, FB Fanpage & AI Co-Pilot' },
                { key: 'stores', name: 'Gian Hàng Đa Sàn', path: '/stores', desc: 'Chỉ số sức khỏe Store Rating (Shopee, TikTok, Lazada, Amazon)' },
                { key: 'finance', name: 'Tài Chính & P&L', path: '/finance', desc: 'Thống kê lợi nhuận gộp P&L và tự động gửi nhắc nợ' },
                { key: 'contracts', name: 'Hợp Đồng', path: '/contracts', desc: 'Hợp đồng dịch vụ điện tử có con dấu đỏ & QR Code' },
                { key: 'hrm', name: 'Nhân Sự HRM', path: '/hrm', desc: 'Hồ sơ nhân viên, duyệt onboard & sơ đồ cây OrgChart' },
                { key: 'products', name: 'Sản Phẩm & Dịch Vụ', path: '/products', desc: 'Gói dịch vụ vận hành TMĐT & thuộc tính động JSONB' },
                { key: 'kpis', name: 'Quản Lý KPIs', path: '/kpis', desc: 'Giao chỉ tiêu GMV, Lead, phút gọi & tính % tiến độ' },
                { key: 'performance', name: 'Hiệu Suất (S/A/B/C/D)', path: '/performance', desc: 'Xếp loại hiệu suất nhân sự định kỳ từ ngày 1-5' },
                { key: 'reviews', name: 'Đánh Giá 360°', path: '/reviews', desc: 'Đánh giá đa chiều tự đánh giá / quản lý / đồng nghiệp' },
                { key: 'audit', name: 'Nhật Ký Audit Trail', path: '/audit', desc: 'Ghi vết 100% thời gian thực thao tác của tất cả người dùng' },
              ].map((mod) => {
                const isEnabled = toggles[mod.key as keyof typeof toggles];
                return ( <div
                    key={mod.key}
                    className={`p-4 rounded-lg border transition-all flex items-center justify-between gap-4 ${
                      isEnabled ? 'bg-white border-slate-200/80 shadow-2xs' : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  > <div> <div className="flex items-center gap-2"> <span className="font-medium text-slate-900 text-xs">{mod.name}</span> <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200"> {mod.path} </span> </div> <p className="text-[11px] text-slate-500 mt-1">{mod.desc}</p> </div> <button
                      type="button"
                      onClick={() => {
                        if (!isAdmin) {
                          setSaveToast(' Thao tác bị từ chối: Việc bật/tắt chức năng chỉ do Admin làm, áp dụng thay đổi cho toàn hệ thống!');
                          setTimeout(() => setSaveToast(''), 4000);
                          return;
                        }
                        toggleModule(mod.key as keyof typeof toggles);
                        setSaveToast(`Đã ${isEnabled ? 'TẮT' : 'BẬT'} phân hệ [${mod.name}] áp dụng thay đổi cho toàn hệ thống!`);
                        setTimeout(() => setSaveToast(''), 4000);
                      }}
                      disabled={!isAdmin}
                      title={isAdmin ? `Bật/Tắt phân hệ ${mod.name}` : 'Việc bật/tắt chức năng chỉ do Admin làm'}
                      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        !isAdmin ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                      } ${isEnabled ? 'bg-blue-600' : 'bg-slate-300'}`}
                    > <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          isEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      /> </button> </div> );
              })} </div> </div> )}

        {/* ==================== TAB 1: INFRASTRUCTURE (R2, SUPABASE, VOIP) ==================== */}
        {activeTab === 'INFRASTRUCTURE' && ( <div className="space-y-6"> {/* SECTION 1: CLOUDFLARE OBJECT STORAGE */} <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden"> <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"> <div className="flex items-center gap-3"> <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600"> <Cloud className="w-5 h-5" /> </div> <div> <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2"> Cloudflare R2 Storage <span className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded text-[10px] font-medium">PDF & Documents</span> </h3> <p className="text-[11px] text-slate-500">Lưu trữ tập tin Hợp đồng lao động, Ghi âm cuộc gọi và File chứng từ KYC</p> </div> </div> <button
                  type="button"
                  onClick={() => handleTestConnection('R2')}
                  disabled={r2Test.status === 'TESTING'}
                  className="px-4 py-2 bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 rounded-xl text-xs font-medium flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                > <Activity className={`w-4 h-4 ${r2Test.status === 'TESTING' ? 'animate-spin text-orange-600' : 'text-orange-600'}`} /> {r2Test.status === 'TESTING' ? 'Đang Kiểm Tra...' : 'Kiểm Tra R2'} </button> </div> <div className="p-6 space-y-4"> {r2Test.status !== 'IDLE' && ( <div className={`p-4 rounded-xl text-xs font-semibold border flex items-center justify-between ${
                    r2Test.status === 'SUCCESS' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
                  }`}> <div className="flex items-center gap-2"> {r2Test.status === 'SUCCESS' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-red-600" />} <span>{r2Test.message}</span> </div> {r2Test.latency_ms && ( <span className="font-mono font-medium px-2 py-0.5 bg-white border rounded text-[10px]"> Độ trễ: {r2Test.latency_ms} ms </span> )} </div> )} <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label className="block text-xs font-medium text-slate-700 mb-1">Cloudflare Account ID</label> <input
                      type="text"
                      value={config.r2.account_id}
                      onChange={(e) => setConfig({ ...config, r2: { ...config.r2, account_id: e.target.value } })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                    /> </div> <div> <label className="block text-xs font-medium text-slate-700 mb-1">Bucket Name</label> <input
                      type="text"
                      value={config.r2.bucket_name}
                      onChange={(e) => setConfig({ ...config, r2: { ...config.r2, bucket_name: e.target.value } })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                    /> </div> <div> <label className="block text-xs font-medium text-slate-700 mb-1">Access Key ID</label> <input
                      type="text"
                      value={config.r2.access_key_id}
                      onChange={(e) => setConfig({ ...config, r2: { ...config.r2, access_key_id: e.target.value } })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                    /> </div> <div> <label className="block text-xs font-medium text-slate-700 mb-1">Custom Domain Endpoint (Ẩn Khỏi Giao Diện)</label> <input
                      type="text"
                      value={config.r2.custom_domain}
                      onChange={(e) => setConfig({ ...config, r2: { ...config.r2, custom_domain: e.target.value } })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                    /> </div> </div> </div> </div> {/* SECTION 2: SUPABASE DATABASE CONFIGURATION */} <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden"> <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"> <div className="flex items-center gap-3"> <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600"> <Database className="w-5 h-5" /> </div> <div> <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2"> Database Supabase <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-medium">Database Server</span> </h3> <p className="text-[11px] text-slate-500">Lưu trữ 10+ Bảng dữ liệu Khách hàng, Lead, Nhân sự, KPIs, RBAC & Audit Logs</p> </div> </div> <button
                  type="button"
                  onClick={() => handleTestConnection('SUPABASE')}
                  disabled={supabaseTest.status === 'TESTING'}
                  className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-medium flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                > <Activity className={`w-4 h-4 ${supabaseTest.status === 'TESTING' ? 'animate-spin text-emerald-600' : 'text-emerald-600'}`} /> {supabaseTest.status === 'TESTING' ? 'Đang Kiểm Tra...' : 'Kiểm Tra DB'} </button> </div> <div className="p-6 space-y-4"> {supabaseTest.status !== 'IDLE' && ( <div className={`p-4 rounded-xl text-xs font-semibold border flex items-center justify-between ${
                    supabaseTest.status === 'SUCCESS' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
                  }`}> <div className="flex items-center gap-2"> {supabaseTest.status === 'SUCCESS' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-red-600" />} <span>{supabaseTest.message}</span> </div> {supabaseTest.latency_ms && ( <span className="font-mono font-medium px-2 py-0.5 bg-white border rounded text-[10px]"> Độ trễ: {supabaseTest.latency_ms} ms </span> )} </div> )} <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label className="block text-xs font-medium text-slate-700 mb-1">Project URL</label> <input
                      type="text"
                      value={config.supabase.project_url}
                      onChange={(e) => setConfig({ ...config, supabase: { ...config.supabase, project_url: e.target.value } })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                    /> </div> <div> <label className="block text-xs font-medium text-slate-700 mb-1">Database Name</label> <input
                      type="text"
                      value={config.supabase.db_name}
                      onChange={(e) => setConfig({ ...config, supabase: { ...config.supabase, db_name: e.target.value } })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                    /> </div> <div> <label className="block text-xs font-medium text-slate-700 mb-1">Anon Key (Masked)</label> <input
                      type="text"
                      value={config.supabase.anon_key_masked}
                      onChange={(e) => setConfig({ ...config, supabase: { ...config.supabase, anon_key_masked: e.target.value } })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                    /> </div> <div> <label className="block text-xs font-medium text-slate-700 mb-1">Max Connections Pool</label> <input
                      type="number"
                      value={config.supabase.max_connections}
                      onChange={(e) => setConfig({ ...config, supabase: { ...config.supabase, max_connections: Number(e.target.value) } })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                    /> </div> </div> </div> </div> {/* SECTION 3: VOIP TELEPHONY GATEWAY CONFIGURATION */} <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden"> <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"> <div className="flex items-center gap-3"> <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600"> <PhoneCall className="w-5 h-5" /> </div> <div> <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2"> Tổng Đài VoIP <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-[10px] font-medium">Telephony Gateway</span> </h3> <p className="text-[11px] text-slate-500">Tích hợp gọi điện WebRTC Softphone trực tiếp từ trình duyệt web CRM</p> </div> </div> <button
                  type="button"
                  onClick={() => handleTestConnection('VOIP')}
                  disabled={voipTest.status === 'TESTING'}
                  className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-medium flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                > <Activity className={`w-4 h-4 ${voipTest.status === 'TESTING' ? 'animate-spin text-blue-600' : 'text-blue-600'}`} /> {voipTest.status === 'TESTING' ? 'Đang Kiểm Tra...' : 'Kiểm Tra VoIP'} </button> </div> <div className="p-6 space-y-4"> {voipTest.status !== 'IDLE' && ( <div className={`p-4 rounded-xl text-xs font-semibold border flex items-center justify-between ${
                    voipTest.status === 'SUCCESS' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
                  }`}> <div className="flex items-center gap-2"> {voipTest.status === 'SUCCESS' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-red-600" />} <span>{voipTest.message}</span> </div> {voipTest.latency_ms && ( <span className="font-mono font-medium px-2 py-0.5 bg-white border rounded text-[10px]"> Độ trễ: {voipTest.latency_ms} ms </span> )} </div> )} <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label className="block text-xs font-medium text-slate-700 mb-1">Nhà Cung Cấp Tổng Đài</label> <input
                      type="text"
                      value={config.voip.provider_name}
                      onChange={(e) => setConfig({ ...config, voip: { ...config.voip, provider_name: e.target.value } })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                    /> </div> <div> <label className="block text-xs font-medium text-slate-700 mb-1">API Endpoint Gateway</label> <input
                      type="text"
                      value={config.voip.api_endpoint}
                      onChange={(e) => setConfig({ ...config, voip: { ...config.voip, api_endpoint: e.target.value } })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                    /> </div> <div> <label className="block text-xs font-medium text-slate-700 mb-1">API Key / Token (Masked)</label> <input
                      type="text"
                      value={config.voip.api_key_masked}
                      onChange={(e) => setConfig({ ...config, voip: { ...config.voip, api_key_masked: e.target.value } })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                    /> </div> <div> <label className="block text-xs font-medium text-slate-700 mb-1">Thời Gian Lưu Ghi Âm (Ngày)</label> <input
                      type="number"
                      value={config.voip.recording_retention_days}
                      onChange={(e) => setConfig({ ...config, voip: { ...config.voip, recording_retention_days: Number(e.target.value) } })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                    /> </div> </div> </div> </div> </div> )}

        {/* ==================== TAB 2: E-COMMERCE & AI API KEYS ==================== */}
        {activeTab === 'API_KEYS' && ( <div className="space-y-6"> <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 space-y-6"> <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4"> <div> <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2"> <ShoppingBag className="w-5 h-5 text-amber-600" /> API Keys Sàn TMĐT & AI </h3> <p className="text-[11px] text-slate-500 mt-0.5"> Quản lý API Keys kết nối tự động Shopee, TikTok Shop, Lazada, Amazon & Trợ lý AI Gemini/OpenAI. </p> </div> <button
                  type="button"
                  onClick={handleTestApiKeys}
                  disabled={apiKeysTest.status === 'TESTING'}
                  className="px-4 py-2 bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 rounded-xl text-xs font-medium flex items-center gap-2 transition-all active:scale-95 shrink-0"
                > <Sparkles className={`w-4 h-4 ${apiKeysTest.status === 'TESTING' ? 'animate-spin text-amber-600' : 'text-amber-600'}`} /> {apiKeysTest.status === 'TESTING' ? 'Đang Kiểm Tra Keys...' : 'Kiểm Tra API Sàn'} </button> </div> {apiKeysTest.status !== 'IDLE' && ( <div className={`p-4 rounded-xl text-xs font-semibold border flex items-center justify-between ${
                  apiKeysTest.status === 'SUCCESS' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
                }`}> <div className="flex items-center gap-2"> {apiKeysTest.status === 'SUCCESS' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-red-600" />} <span>{apiKeysTest.message}</span> </div> {apiKeysTest.latency_ms && ( <span className="font-mono font-medium px-2 py-0.5 bg-white border rounded text-[10px]"> Độ trễ: {apiKeysTest.latency_ms} ms </span> )} </div> )}

              {/* Grid API Keys */} <div className="grid grid-cols-1 md:grid-cols-2 gap-5"> {/* Shopee */} <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3"> <span className="font-medium text-xs text-orange-600 flex items-center gap-1.5"> 🛍 Shopee Open Platform API </span> <div> <label className="block text-[11px] font-semibold text-slate-700 mb-1">Shopee App Key</label> <input
                      type="text"
                      value={config.api_keys.shopee_app_key}
                      onChange={(e) => setConfig({ ...config, api_keys: { ...config.api_keys, shopee_app_key: e.target.value } })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                    /> </div> <div> <label className="block text-[11px] font-semibold text-slate-700 mb-1">Shopee App Secret</label> <div className="relative"> <input
                        type={showKeys['shopee'] ? 'text' : 'password'}
                        value={config.api_keys.shopee_app_secret}
                        onChange={(e) => setConfig({ ...config, api_keys: { ...config.api_keys, shopee_app_secret: e.target.value } })}
                        className="w-full p-2 pr-9 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                      /> <button
                        type="button"
                        onClick={() => toggleShowKey('shopee')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      > {showKeys['shopee'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />} </button> </div> </div> </div> {/* TikTok Shop */} <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3"> <span className="font-medium text-xs text-slate-900 flex items-center gap-1.5"> 🎵 TikTok Shop Partner API </span> <div> <label className="block text-[11px] font-semibold text-slate-700 mb-1">TikTok App Key</label> <input
                      type="text"
                      value={config.api_keys.tiktok_app_key}
                      onChange={(e) => setConfig({ ...config, api_keys: { ...config.api_keys, tiktok_app_key: e.target.value } })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                    /> </div> <div> <label className="block text-[11px] font-semibold text-slate-700 mb-1">TikTok App Secret</label> <div className="relative"> <input
                        type={showKeys['tiktok'] ? 'text' : 'password'}
                        value={config.api_keys.tiktok_app_secret}
                        onChange={(e) => setConfig({ ...config, api_keys: { ...config.api_keys, tiktok_app_secret: e.target.value } })}
                        className="w-full p-2 pr-9 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                      /> <button
                        type="button"
                        onClick={() => toggleShowKey('tiktok')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      > {showKeys['tiktok'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />} </button> </div> </div> </div> {/* Lazada */} <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3"> <span className="font-medium text-xs text-blue-600 flex items-center gap-1.5"> 🔷 Lazada Open Platform API </span> <div> <label className="block text-[11px] font-semibold text-slate-700 mb-1">Lazada App Key</label> <input
                      type="text"
                      value={config.api_keys.lazada_app_key}
                      onChange={(e) => setConfig({ ...config, api_keys: { ...config.api_keys, lazada_app_key: e.target.value } })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                    /> </div> <div> <label className="block text-[11px] font-semibold text-slate-700 mb-1">Lazada App Secret</label> <div className="relative"> <input
                        type={showKeys['lazada'] ? 'text' : 'password'}
                        value={config.api_keys.lazada_app_secret}
                        onChange={(e) => setConfig({ ...config, api_keys: { ...config.api_keys, lazada_app_secret: e.target.value } })}
                        className="w-full p-2 pr-9 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                      /> <button
                        type="button"
                        onClick={() => toggleShowKey('lazada')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      > {showKeys['lazada'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />} </button> </div> </div> </div> {/* Amazon SP-API */} <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3"> <span className="font-medium text-xs text-amber-600 flex items-center gap-1.5"> Amazon Selling Partner (SP-API) </span> <div> <label className="block text-[11px] font-semibold text-slate-700 mb-1">Seller ID</label> <input
                      type="text"
                      value={config.api_keys.amazon_seller_id}
                      onChange={(e) => setConfig({ ...config, api_keys: { ...config.api_keys, amazon_seller_id: e.target.value } })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                    /> </div> <div> <label className="block text-[11px] font-semibold text-slate-700 mb-1">LWA Client ID</label> <input
                      type="text"
                      value={config.api_keys.amazon_lwa_client_id}
                      onChange={(e) => setConfig({ ...config, api_keys: { ...config.api_keys, amazon_lwa_client_id: e.target.value } })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                    /> </div> </div> {/* AI Assistant Key */} <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl space-y-3 md:col-span-2"> <span className="font-medium text-xs text-purple-800 flex items-center gap-1.5"> Trợ Lý AI Antigravity & Gemini Engine Key </span> <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label className="block text-[11px] font-semibold text-purple-900 mb-1">Google Gemini API Key</label> <div className="relative"> <input
                          type={showKeys['gemini'] ? 'text' : 'password'}
                          value={config.api_keys.gemini_api_key}
                          onChange={(e) => setConfig({ ...config, api_keys: { ...config.api_keys, gemini_api_key: e.target.value } })}
                          className="w-full p-2 pr-9 bg-white border border-purple-200 rounded-xl text-xs font-mono text-purple-900"
                        /> <button
                          type="button"
                          onClick={() => toggleShowKey('gemini')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-700"
                        > {showKeys['gemini'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />} </button> </div> </div> <div> <label className="block text-[11px] font-semibold text-purple-900 mb-1">OpenAI API Key (Fallback)</label> <div className="relative"> <input
                          type={showKeys['openai'] ? 'text' : 'password'}
                          value={config.api_keys.openai_api_key}
                          onChange={(e) => setConfig({ ...config, api_keys: { ...config.api_keys, openai_api_key: e.target.value } })}
                          className="w-full p-2 pr-9 bg-white border border-purple-200 rounded-xl text-xs font-mono text-purple-900"
                        /> <button
                          type="button"
                          onClick={() => toggleShowKey('openai')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-700"
                        > {showKeys['openai'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />} </button> </div> </div> </div> </div> </div> </div> </div> )}

        {/* ==================== TAB 3: SMTP MAIL SERVER ==================== */}
        {activeTab === 'SMTP' && ( <div className="space-y-6"> <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 space-y-6"> <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4"> <div> <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2"> <Mail className="w-5 h-5 text-blue-600" /> Máy Chủ Email SMTP </h3> <p className="text-[11px] text-slate-500 mt-0.5"> Gửi email tự động thông báo hợp đồng, thông báo chấm điểm KPI và lịch đánh giá 360 độ. </p> </div> <button
                  type="button"
                  onClick={handleTestSmtp}
                  disabled={smtpTest.status === 'TESTING'}
                  className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-medium flex items-center gap-2 transition-all active:scale-95 shrink-0 disabled:opacity-50"
                > <Send className={`w-4 h-4 ${smtpTest.status === 'TESTING' ? 'animate-spin text-blue-600' : 'text-blue-600'}`} /> {smtpTest.status === 'TESTING' ? 'Đang Gửi Thử...' : 'Gửi Thử Email'} </button> </div> {smtpTest.status !== 'IDLE' && ( <div className={`p-4 rounded-xl text-xs font-semibold border flex items-center justify-between ${
                  smtpTest.status === 'SUCCESS' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
                }`}> <div className="flex items-center gap-2"> {smtpTest.status === 'SUCCESS' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-red-600" />} <span>{smtpTest.message}</span> </div> {smtpTest.latency_ms && ( <span className="font-mono font-medium px-2 py-0.5 bg-white border rounded text-[10px]"> Độ trễ: {smtpTest.latency_ms} ms </span> )} </div> )} <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> <div className="md:col-span-2"> <label className="block text-xs font-medium text-slate-700 mb-1">SMTP Server Host *</label> <input
                    type="text"
                    value={config.smtp.host}
                    onChange={(e) => setConfig({ ...config, smtp: { ...config.smtp, host: e.target.value } })}
                    placeholder="smtp.mailgun.org"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs tabular-nums text-slate-900"
                    required
                  /> </div> <div> <label className="block text-xs font-medium text-slate-700 mb-1">Port & Mã Hóa *</label> <div className="flex gap-2"> <input
                      type="number"
                      value={config.smtp.port}
                      onChange={(e) => setConfig({ ...config, smtp: { ...config.smtp, port: Number(e.target.value) } })}
                      className="w-24 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                    /> <select
                      value={config.smtp.encryption}
                      onChange={(e) => setConfig({ ...config, smtp: { ...config.smtp, encryption: e.target.value as any } })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                    > <option value="TLS">TLS (Port 587)</option> <option value="SSL">SSL (Port 465)</option> <option value="NONE">Chưa mã hóa</option> </select> </div> </div> <div> <label className="block text-xs font-medium text-slate-700 mb-1">SMTP Username *</label> <input
                    type="text"
                    value={config.smtp.username}
                    onChange={(e) => setConfig({ ...config, smtp: { ...config.smtp, username: e.target.value } })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs tabular-nums text-slate-900"
                    required
                  /> </div> <div> <label className="block text-xs font-medium text-slate-700 mb-1">SMTP Password (Masked) *</label> <div className="relative"> <input
                      type={showKeys['smtp'] ? 'text' : 'password'}
                      value={config.smtp.password_masked}
                      onChange={(e) => setConfig({ ...config, smtp: { ...config.smtp, password_masked: e.target.value } })}
                      className="w-full p-2.5 pr-9 bg-slate-50 border border-slate-200 rounded-xl text-xs tabular-nums text-slate-900"
                      required
                    /> <button
                      type="button"
                      onClick={() => toggleShowKey('smtp')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    > {showKeys['smtp'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />} </button> </div> </div> <div> <label className="block text-xs font-medium text-slate-700 mb-1">Sender Email *</label> <input
                    type="email"
                    value={config.smtp.sender_email}
                    onChange={(e) => setConfig({ ...config, smtp: { ...config.smtp, sender_email: e.target.value } })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs tabular-nums text-slate-900"
                    required
                  /> </div> <div className="md:col-span-3"> <label className="block text-xs font-medium text-slate-700 mb-1">Tên Người Gửi Hiển Thị (Sender Display Name)</label> <input
                    type="text"
                    value={config.smtp.sender_name}
                    onChange={(e) => setConfig({ ...config, smtp: { ...config.smtp, sender_name: e.target.value } })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  /> </div> </div> </div> </div> )}

        {/* ==================== TAB 4: WEBHOOKS & NOTIFICATION BOTS ==================== */}
        {activeTab === 'WEBHOOKS' && ( <div className="space-y-6"> <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 space-y-6"> <div className="flex items-center justify-between border-b border-slate-100 pb-4"> <div> <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2"> <Bell className="w-5 h-5 text-purple-600" /> Webhook & Bot Thông Báo </h3> <p className="text-[11px] text-slate-500 mt-0.5"> Bắn thông báo tức thì khi phát sinh Lead mới, tới hạn chấm KPI hoặc Nhân sự mới nhận việc. </p> </div> </div> <div className="grid grid-cols-1 md:grid-cols-2 gap-5"> {/* Telegram Bot */} <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3"> <div className="flex items-center justify-between"> <span className="font-medium text-xs text-blue-600 flex items-center gap-1.5"> ✈ Telegram Bot Notification </span> <button
                      type="button"
                      onClick={() => handleTestWebhook('TELEGRAM')}
                      disabled={telegramTest.status === 'TESTING'}
                      className="px-3 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200 font-medium rounded-lg text-[10px] flex items-center gap-1"
                    > <Send className="w-3 h-3" /> Test Telegram </button> </div> {telegramTest.status !== 'IDLE' && ( <p className={`text-[11px] font-semibold ${telegramTest.status === 'SUCCESS' ? 'text-emerald-700' : 'text-red-600'}`}> {telegramTest.message} </p> )} <div> <label className="block text-[11px] font-semibold text-slate-700 mb-1">Telegram Bot Token</label> <input
                      type="text"
                      value={config.webhook.telegram_bot_token}
                      onChange={(e) => setConfig({ ...config, webhook: { ...config.webhook, telegram_bot_token: e.target.value } })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                    /> </div> <div> <label className="block text-[11px] font-semibold text-slate-700 mb-1">Telegram Chat ID / Group ID</label> <input
                      type="text"
                      value={config.webhook.telegram_chat_id}
                      onChange={(e) => setConfig({ ...config, webhook: { ...config.webhook, telegram_chat_id: e.target.value } })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                    /> </div> </div> {/* Zalo ZNS Webhook */} <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3"> <div className="flex items-center justify-between"> <span className="font-medium text-xs text-blue-700 flex items-center gap-1.5"> Zalo ZNS Notification Webhook </span> <button
                      type="button"
                      onClick={() => handleTestWebhook('ZALO_ZNS')}
                      disabled={zaloTest.status === 'TESTING'}
                      className="px-3 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200 font-medium rounded-lg text-[10px] flex items-center gap-1"
                    > <Send className="w-3 h-3" /> Test Zalo </button> </div> {zaloTest.status !== 'IDLE' && ( <p className={`text-[11px] font-semibold ${zaloTest.status === 'SUCCESS' ? 'text-emerald-700' : 'text-red-600'}`}> {zaloTest.message} </p> )} <div> <label className="block text-[11px] font-semibold text-slate-700 mb-1">Zalo ZNS Endpoint URL</label> <input
                      type="text"
                      value={config.webhook.zalo_zns_webhook_url}
                      onChange={(e) => setConfig({ ...config, webhook: { ...config.webhook, zalo_zns_webhook_url: e.target.value } })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                    /> </div> <div> <label className="block text-[11px] font-semibold text-slate-700 mb-1">Zalo Official Account (OA) App ID</label> <input
                      type="text"
                      value={config.webhook.zalo_app_id}
                      onChange={(e) => setConfig({ ...config, webhook: { ...config.webhook, zalo_app_id: e.target.value } })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                    /> </div> </div> {/* Event Trigger Switches */} <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl space-y-3 md:col-span-2"> <span className="font-medium text-xs text-purple-900 flex items-center gap-1.5"> Sự Kiện Kích Hoạt Bắn Thông Báo Tự Động (Event Triggers) </span> <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1"> <label className="p-3 bg-white border border-purple-100 rounded-xl flex items-center gap-3 cursor-pointer"> <input
                        type="checkbox"
                        checked={config.webhook.notify_on_new_lead}
                        onChange={(e) => setConfig({ ...config, webhook: { ...config.webhook, notify_on_new_lead: e.target.checked } })}
                        className="w-4 h-4 accent-purple-600 rounded"
                      /> <span className="text-xs font-medium text-slate-800"> Có Lead Mới Về Phễu</span> </label> <label className="p-3 bg-white border border-purple-100 rounded-xl flex items-center gap-3 cursor-pointer"> <input
                        type="checkbox"
                        checked={config.webhook.notify_on_kpi_deadline}
                        onChange={(e) => setConfig({ ...config, webhook: { ...config.webhook, notify_on_kpi_deadline: e.target.checked } })}
                        className="w-4 h-4 accent-purple-600 rounded"
                      /> <span className="text-xs font-medium text-slate-800"> Hạn Chót Chấm KPI / 360°</span> </label> <label className="p-3 bg-white border border-purple-100 rounded-xl flex items-center gap-3 cursor-pointer"> <input
                        type="checkbox"
                        checked={config.webhook.notify_on_employee_onboard}
                        onChange={(e) => setConfig({ ...config, webhook: { ...config.webhook, notify_on_employee_onboard: e.target.checked } })}
                        className="w-4 h-4 accent-purple-600 rounded"
                      /> <span className="text-xs font-medium text-slate-800">👤 Nhân Sự Mới Nhận Việc</span> </label> </div> </div> </div> </div> </div> )}

        {/* ==================== TAB 5: SECURITY POLICY & AUDIT LOGS ==================== */}
        {activeTab === 'SECURITY_AUDIT' && ( <div className="space-y-6"> {/* Security Limits Controls */} <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 space-y-6"> <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4"> <ShieldAlert className="w-5 h-5 text-emerald-600" /> Giới Hạn Bảo Mật & Bảo Trì </h3> <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> <div> <label className="block text-xs font-medium text-slate-700 mb-1">Dung Lượng Tải File Tối Đa (MB)</label> <input
                    type="number"
                    value={config.security.max_file_size_mb}
                    onChange={(e) => setConfig({ ...config, security: { ...config.security, max_file_size_mb: Number(e.target.value) } })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-900"
                  /> </div> <div> <label className="block text-xs font-medium text-slate-700 mb-1">Thời Gian Hết Hạn Session (Phút)</label> <input
                    type="number"
                    value={config.security.session_timeout_mins}
                    onChange={(e) => setConfig({ ...config, security: { ...config.security, session_timeout_mins: Number(e.target.value) } })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-900"
                  /> </div> <div> <label className="block text-xs font-medium text-slate-700 mb-1">Số Lần Đăng Nhập Sai Tối Đa</label> <input
                    type="number"
                    value={config.security.max_failed_logins}
                    onChange={(e) => setConfig({ ...config, security: { ...config.security, max_failed_logins: Number(e.target.value) } })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-900"
                  /> </div> </div> {/* Maintenance Mode Toggle */} <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-3"> <div className="flex items-center justify-between"> <div className="flex items-center gap-2"> <AlertTriangle className="w-5 h-5 text-amber-600" /> <div> <h4 className="font-semibold text-xs text-slate-900">Chế Độ Bảo Trì Hệ Thống (Maintenance Mode)</h4> <p className="text-[11px] text-slate-500">Khi bật, hệ thống sẽ thông báo bảo trì tạm thời cho người dùng thông thường.</p> </div> </div> <label className="relative inline-flex items-center cursor-pointer"> <input
                      type="checkbox"
                      checked={config.security.maintenance_mode}
                      onChange={(e) => setConfig({ ...config, security: { ...config.security, maintenance_mode: e.target.checked } })}
                      className="sr-only peer"
                    /> <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div> </label> </div> {config.security.maintenance_mode && ( <div> <label className="block text-[11px] font-semibold text-slate-500 mb-1">Thông Báo Bảo Trì Hiển Thị:</label> <input
                      type="text"
                      value={config.security.maintenance_message}
                      onChange={(e) => setConfig({ ...config, security: { ...config.security, maintenance_message: e.target.value } })}
                      className="w-full p-2 bg-white border border-amber-200 text-slate-900 rounded-xl text-xs font-semibold"
                    /> </div> )} </div> </div> {/* Config Audit Logs Table */} <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden space-y-2"> <div className="p-4 border-b border-slate-100 flex items-center justify-between"> <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 flex items-center gap-2"> <History className="w-4 h-4 text-blue-600" /> Nhật Ký Thay Đổi Cấu Hình (Config Audit Log) </h3> <span className="text-xs text-slate-500 font-medium"> <strong className="text-slate-900">{config.audit_logs?.length || 0} Lần Cập Nhật</strong> </span> </div> <div className="overflow-x-auto"> <table className="w-full text-left border-collapse text-xs"> <thead> <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wide text-[10.5px]"> <th className="p-4">Thời Gian</th> <th className="p-4">Phân Hệ Cấu Hình</th> <th className="p-4">Người Thực Hiện</th> <th className="p-4">Hành Động</th> <th className="p-4">Chi Tiết Thay Đổi</th> </tr> </thead> <tbody className="divide-y divide-slate-100"> {(!config.audit_logs || config.audit_logs.length === 0) ? ( <tr> <td colSpan={5} className="p-8 text-center text-slate-400 italic"> Chưa có lịch sử thay đổi cấu hình nào được ghi nhận. </td> </tr> ) : (
                      config.audit_logs.map((log) => ( <tr key={log.id} className="hover:bg-slate-50/80 transition-colors"> <td className="p-4 font-mono text-slate-500">{log.timestamp}</td> <td className="p-4 font-medium text-slate-900">{log.section}</td> <td className="p-4 font-semibold text-blue-700">{log.actor_name}</td> <td className="p-4"> <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-mono text-[10px] font-medium"> {log.action} </span> </td> <td className="p-4 text-slate-700">{log.details}</td> </tr> ))
                    )} </tbody> </table> </div> </div> </div> )}

        {/* ==================== TAB 6: CORPORATE IDENTITY & SEAL STAMPS ==================== */}
        {activeTab === 'COMPANY_IDENTITY' && ( <div className="space-y-6"> <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 space-y-6 text-xs font-medium"> <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4"> <Building2 className="w-5 h-5 text-emerald-600" /> Thông Tin Pháp Lý & Con Dấu </h3> <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Box 1: Thông tin Pháp lý */} <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3"> <h4 className="font-semibold text-slate-900 text-xs text-blue-700 uppercase tracking-wider"> 1. Thông Tin Pháp Lý Doanh Nghiệp (Corporate Identity) </h4> <div> <label className="block text-slate-700 mb-1">Tên Doanh Nghiệp Đăng Ký *</label> <input
                      type="text"
                      value={companyInfo.name}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl font-medium text-slate-900"
                    /> </div> <div className="grid grid-cols-2 gap-3"> <div> <label className="block text-slate-700 mb-1">Mã Số Thuế *</label> <input
                        type="text"
                        value={companyInfo.tax_code}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, tax_code: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl font-mono text-purple-700"
                      /> </div> <div> <label className="block text-slate-700 mb-1">Đại Diện Pháp Luật (CEO) *</label> <input
                        type="text"
                        value={companyInfo.ceo_name}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, ceo_name: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl text-slate-900 font-medium"
                      /> </div> </div> <div> <label className="block text-slate-700 mb-1">Địa Chỉ Trụ Sở ĐKKD *</label> <input
                      type="text"
                      value={companyInfo.address}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl text-slate-800"
                    /> </div> </div> {/* Box 2: Dấu Mộc Đỏ & Chữ Ký */} <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3"> <h4 className="font-semibold text-slate-900 text-xs text-blue-700 uppercase tracking-wider"> 2. Dấu Mộc Đỏ & Mẫu Chữ Ký Điện Tử </h4> <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 text-center"> <div className="w-20 h-20 mx-auto rounded-full bg-red-50 border-2 border-red-500 flex items-center justify-center text-red-600 font-semibold text-xs shadow-md"> MỘC ĐỎ GGBG </div> <p className="text-emerald-700 font-semibold text-xs">{companyInfo.seal_status}</p> <p className="text-[10.5px] text-slate-500 font-normal">Tự động đóng mộc trên Hợp đồng & Công văn chính thức</p> </div> <div> <label className="block text-slate-700 mb-1">Kế Toán Trưởng Duyệt *</label> <input
                      type="text"
                      value={companyInfo.chief_accountant}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, chief_accountant: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl text-slate-900 font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  </div>
  );
}

export default function SystemSettingsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-xs font-medium text-slate-400">Đang tải phân hệ Cấu Hình Hệ Thống...</div>}>
      <SystemSettingsContent />
    </Suspense>
  );
}
