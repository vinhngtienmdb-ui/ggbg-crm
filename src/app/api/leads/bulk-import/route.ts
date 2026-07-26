import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { rows, existing_phones } = body || {};

    if (!Array.isArray(rows)) {
      return NextResponse.json(
        { success: false, message: 'Dữ liệu rows phải là một mảng danh sách Lead' },
        { status: 400 }
      );
    }

    const existingPhoneSet = new Set<string>((existing_phones || []).map((p: string) => String(p).replace(/\D/g, '')));
    const processedPhoneSet = new Set<string>();

    let duplicateCount = 0;
    let validCount = 0;

    const validatedRows = rows.map((row: any, idx: number) => {
      const cleanPhone = String(row.phone || '').replace(/\D/g, '');
      let isDuplicate = false;
      let duplicateReason = '';

      if (!cleanPhone || cleanPhone.length < 9) {
        isDuplicate = true;
        duplicateReason = 'Số điện thoại không hợp lệ';
      } else if (existingPhoneSet.has(cleanPhone)) {
        isDuplicate = true;
        duplicateReason = 'SĐT đã tồn tại trên CRM';
      } else if (processedPhoneSet.has(cleanPhone)) {
        isDuplicate = true;
        duplicateReason = 'SĐT bị trùng lặp trong chính file import';
      }

      if (isDuplicate) {
        duplicateCount++;
      } else {
        validCount++;
        processedPhoneSet.add(cleanPhone);
      }

      return {
        id: `import_row_${idx + 1}`,
        full_name: String(row.full_name || 'Khách Hàng Import').trim(),
        phone: cleanPhone,
        email: row.email || '',
        company_name: row.company_name || 'Doanh Nghiệp Import',
        source_name: row.source_name || 'Bulk Import Excel',
        estimated_budget: Number(row.estimated_budget) || 100000000,
        entity_type: row.entity_type || 'ENTERPRISE',
        is_duplicate: isDuplicate,
        duplicate_reason: duplicateReason,
      };
    });

    return NextResponse.json({
      success: true,
      total_rows: rows.length,
      valid_count: validCount,
      duplicate_count: duplicateCount,
      validated_rows: validatedRows,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Lỗi khi xử lý kiểm tra file import' },
      { status: 500 }
    );
  }
}
