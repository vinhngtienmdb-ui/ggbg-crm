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
    const { message_text, customer_name, channel } = body;
    for (const v of [message_text, customer_name, channel]) {
      if (v !== undefined && v !== null && (typeof v !== 'string' || v.length > 5000)) {
        return NextResponse.json({ success: false, message: 'Dữ liệu không hợp lệ' }, { status: 400 });
      }
    }

    const lower = (message_text || '').toLowerCase();

    let intent = 'CONSULTATION';
    let buyer_readiness = 'MEDIUM';
    let suggested_reply = `Dạ chào anh/chị ${customer_name || ''}, GGBingo CRM hân hạnh tư vấn giải pháp vận hành gian hàng TMĐT cho bên mình ạ.`;

    if (lower.includes('báo giá') || lower.includes('chi phí') || lower.includes('giá bao nhiêu') || lower.includes('gói')) {
      intent = 'PRICING_INQUIRY';
      buyer_readiness = 'HIGH';
      suggested_reply = `Chào anh/chị ${customer_name || ''}, gói Dịch vụ Vận hành Trọn gói bên em hiện có mức hoa hồng linh hoạt từ 3% - 5% trên GMV sàn. Em xin phép gửi Bảng Báo Giá chi tiết và Bản Kế hoạch Doanh số dự kiến cho bên mình tham khảo nhé ạ!`;
    } else if (lower.includes('hợp đồng') || lower.includes('ký') || lower.includes('điều khoản')) {
      intent = 'CONTRACT_NEGOTIATION';
      buyer_readiness = 'VERY_HIGH';
      suggested_reply = `Dạ hợp đồng ủy quyền vận hành gian hàng bên em hỗ trợ ký điện tử 100% và tuân thủ đầy đủ pháp lý. Em có thể soạn sẵn bản thảo hợp đồng gửi anh/chị duyệt ngay ạ!`;
    } else if (lower.includes('shopee') || lower.includes('tiktok') || lower.includes('lazada') || lower.includes('amazon')) {
      intent = 'PLATFORM_SERVICE';
      buyer_readiness = 'HIGH';
      suggested_reply = `GGBingo bên em đang là Đối tác Bạch Kim (TikTok TSP & Shopee Mall Enabler). Đội ngũ Ops bên em cam kết tăng trưởng GMV tối thiểu 25% trong 30 ngày đầu vận hành ạ.`;
    }

    return NextResponse.json({
      success: true,
      data: {
        intent,
        buyer_readiness,
        suggested_reply,
        analyzed_at: new Date().toLocaleTimeString('vi-VN'),
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Lỗi xử lý phân tích AI Co-Pilot' },
      { status: 500 }
    );
  }
}
