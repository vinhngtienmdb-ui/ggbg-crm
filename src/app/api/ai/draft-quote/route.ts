import { NextResponse } from 'next/server';
import { guardApi } from '@/lib/apiGuard';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const session = await guardApi(request);
  if (session instanceof NextResponse) return session;
  try {
    const body = await request.json();
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return NextResponse.json({ success: false, message: 'Dữ liệu không hợp lệ' }, { status: 400 });
    }
    const { customer_name, company_name, platforms, target_gmv } = body;
    for (const v of [customer_name, company_name]) {
      if (v !== undefined && v !== null && (typeof v !== 'string' || v.length > 5000)) {
        return NextResponse.json({ success: false, message: 'Dữ liệu không hợp lệ' }, { status: 400 });
      }
    }
    if (target_gmv !== undefined && target_gmv !== null && typeof target_gmv !== 'number') {
      return NextResponse.json({ success: false, message: 'Dữ liệu không hợp lệ' }, { status: 400 });
    }
    if (platforms !== undefined && platforms !== null && !Array.isArray(platforms)) {
      return NextResponse.json({ success: false, message: 'Dữ liệu không hợp lệ' }, { status: 400 });
    }

    const quoteCode = `BG-AI-${Math.floor(1000 + Math.random() * 9000)}`;
    const estimatedCommissionRate = 4.5;
    const estimatedGmv = target_gmv || 500000000;
    const estimatedFee = (estimatedGmv * estimatedCommissionRate) / 100;

    const quoteDetails = {
      quote_code: quoteCode,
      customer_name: customer_name || 'Khách Hàng Mới',
      company_name: company_name || 'Công Ty Đối Tác',
      platforms: platforms || ['Shopee Mall', 'TikTok Shop'],
      estimated_monthly_gmv: estimatedGmv,
      commission_rate_percent: estimatedCommissionRate,
      estimated_monthly_fee: estimatedFee,
      services_included: [
        'Tối ưu SEO & Trang trí Gian hàng Chuẩn Mall',
        'Vận hành Livestream Studio 60 giờ/tháng',
        'Booking KOC/KOL Chốt đơn trực tiếp',
        'Xử lý Đơn hàng & CSKH Chat 24/7',
        'Báo cáo Doanh số & P&L Thời gian thực'
      ],
      created_at: new Date().toLocaleDateString('vi-VN'),
    };

    return NextResponse.json({
      success: true,
      data: quoteDetails,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Lỗi tạo bản nháp Báo giá AI' },
      { status: 500 }
    );
  }
}
