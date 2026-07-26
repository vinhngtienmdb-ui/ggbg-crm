# Hướng dẫn cấu hình bảo mật & lưu trữ — làm 1 lần

Tài liệu gom **toàn bộ** việc cần bạn tự thực hiện (secret/biến môi trường) sau các đợt nâng cấp. Làm theo thứ tự.

---

## 1. Biến môi trường trên Vercel
Vào **Vercel → Project `ggbg-crm` → Settings → Environment Variables**, thêm cho cả *Production* và *Preview*:

| Biến | Bắt buộc | Giá trị / Cách lấy |
|---|---|---|
| `SESSION_SECRET` | ✅ | Chuỗi ngẫu nhiên ≥32 byte. Tạo: `openssl rand -hex 32`. **Bắt buộc** để ký phiên an toàn (hiện đang dùng fallback dev). |
| `SUPABASE_URL` | ✅ (bật DB) | `https://bgwffnasksdpiiuakjhw.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ (bật DB) | **Supabase Dashboard → Project Settings → API → `service_role` (secret)**. CHỈ đặt ở server env, KHÔNG public. |
| `NEXT_PUBLIC_SUPABASE_URL` | tùy chọn | Giống `SUPABASE_URL` (nếu cần client/realtime sau này). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | tùy chọn | Supabase → API → `anon`/publishable key (an toàn công khai). |
| `LEAD_INGEST_TOKEN` | tùy chọn | Chuỗi bí mật cho webhook nhận lead `/api/leads/ingest` (nếu dùng). |

> Khi CHƯA đặt `SUPABASE_*`, app vẫn chạy bình thường bằng dữ liệu mẫu (chế độ dual-mode). Đặt xong sẽ tự chuyển sang DB thật.

## 2. Nạp dữ liệu mẫu vào Supabase (sau khi đặt env)
Đăng nhập bằng tài khoản **SUPER_ADMIN** rồi gọi (idempotent — chạy lại được):
```bash
curl -X POST https://<preview-hoac-prod-url>/api/admin/seed \
  -H "Content-Type: application/json" \
  --cookie "ggbg_crm_session=<cookie sau khi đăng nhập>"
```
Kết quả trả breakdown số bản ghi cho 10 bảng: customers, leads, products, employees, finance, stores, kpis, performance, reviews, audit.

## 3. Đổi mật khẩu mặc định
- Tài khoản mẫu hiện dùng chung mật khẩu `GGBG@2026#` (đã **băm PBKDF2**, không lưu plaintext). Với hệ thống thật, đổi mật khẩu cho từng tài khoản (tạo user mới qua màn Quản lý tài khoản sẽ tự băm).

## 4. (Khuyến nghị bổ sung — chưa triển khai)
Các mục bảo mật nâng cao nên làm khi lên production thật:
- **2FA/MFA** cho đăng nhập.
- **Thu hồi phiên** tập trung (danh sách phiên bị vô hiệu hoá) khi đổi mật khẩu/khóa tài khoản.
- Rà soát **RLS policies** nếu sau này cho client truy cập trực tiếp Supabase (hiện client KHÔNG truy cập trực tiếp — mọi truy vấn qua API server có guard).
- Quét phụ thuộc định kỳ (`npm audit`).

---

## Đã có sẵn trong code (không cần bạn làm)
- Ký phiên **HMAC-SHA256** (chống giả mạo cookie), hash mật khẩu **PBKDF2**.
- **Guard** session + vai trò + chống CSRF cho toàn bộ API; middleware bảo vệ mọi route.
- Chống **SSRF** ở `system/test-*`; **security headers** (CSP/HSTS/X-Frame-Options...) qua `next.config.mjs`.
- **Rate-limit + khóa tạm** khi đăng nhập sai nhiều lần.
- **Che PII** (CCCD/MST/SĐT/số TK/lương) theo vai trò.
