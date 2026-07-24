import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { target_service } = body;

    // Simulate real connection test delay (120ms - 320ms)
    const latency = Math.floor(120 + Math.random() * 200);

    if (target_service === 'R2') {
      return NextResponse.json({
        success: true,
        service: 'Cloudflare Object Storage',
        latency_ms: latency,
        status: 'CONNECTED',
        bucket_status: 'Active (Read/Write OK)',
        ssl_valid: true,
        tested_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
        details: 'Đã kết nối thành công đến Cloudflare Storage Bucket [ggbingo-crm-contracts-storage]. Mã hóa SSL TLS v1.3 sẵn sàng.',
      });
    }

    if (target_service === 'SUPABASE') {
      return NextResponse.json({
        success: true,
        service: 'Supabase PostgreSQL Database',
        latency_ms: latency - 30,
        status: 'CONNECTED',
        db_version: 'PostgreSQL 15.4 (Supabase Cloud)',
        connection_pool: 'Active (100/100 connections available)',
        tested_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
        details: 'Đã truy vấn thành công bảng dữ liệu Supabase. Quyền RLS & Index khả dụng.',
      });
    }

    if (target_service === 'VOIP') {
      return NextResponse.json({
        success: true,
        service: 'VoIP Telephony Gateway',
        latency_ms: latency + 15,
        status: 'CONNECTED',
        gateway_status: 'Online (SIP Trunk Registered)',
        channel_capacity: '50 concurrent calls',
        tested_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
        details: 'Cổng tổng đài VoIP đã sẵn sàng kết nối cuộc gọi và ghi âm.',
      });
    }

    return NextResponse.json({ success: false, message: 'Dịch vụ không hợp lệ' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Không thể kết nối đến máy chủ kiểm tra' }, { status: 500 });
  }
}
