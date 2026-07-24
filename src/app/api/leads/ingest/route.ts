import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { full_name, phone, email, company_name, source_name, estimated_budget, shop_link } = body || {};

    if (!full_name || !phone) {
      return NextResponse.json(
        { success: false, message: 'Thiếu trường bắt buộc: full_name và phone' },
        { status: 400 }
      );
    }

    const cleanPhone = String(phone).replace(/\D/g, '');
    const newCode = `LD-WEB-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Calculate AI Score (0 - 100)
    const budgetNum = Number(estimated_budget) || 100000000;
    let leadScore = 75;
    if (budgetNum > 200000000) leadScore += 15;
    if (source_name && String(source_name).includes('Referral')) leadScore += 10;
    leadScore = Math.min(leadScore, 98);

    const ingestedLead = {
      id: `lead_ingest_${Date.now()}`,
      lead_code: newCode,
      full_name: String(full_name).trim(),
      phone: cleanPhone,
      email: email ? String(email).trim() : `${newCode.toLowerCase()}@lead.vn`,
      company_name: company_name ? String(company_name).trim() : 'Khách Hàng Đa Kênh',
      source_name: source_name || 'Universal Webhook',
      shop_link: shop_link || '',
      estimated_budget: budgetNum,
      lead_score: leadScore,
      stage_id: 'stage_1',
      stage_name: '1. Tiếp Nhận Mới',
      assigned_sale_name: 'Phân Bổ Tự Động (Round-Robin)',
      created_at: now,
    };

    return NextResponse.json({
      success: true,
      message: `Đã tiếp nhận thành công Lead [${newCode}] từ kênh ${source_name || 'Webhook API'}!`,
      data: ingestedLead,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Không thể xử lý Payload Webhook Ingestion' },
      { status: 500 }
    );
  }
}
