import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer_name, company_name, platforms, target_gmv } = body;

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
