/**
 * Phiên đăng nhập ký bằng HMAC-SHA256 (Web Crypto API).
 * Token = base64url(payload).base64url(HMAC(payload)). Chống giả mạo cookie.
 * Dùng được ở Edge middleware và Node API routes.
 *
 * ⚠️ Đặt biến môi trường SESSION_SECRET (chuỗi ngẫu nhiên đủ dài) ở production.
 */

export interface SessionPayload {
  id: string;
  username: string;
  email?: string;
  name?: string;
  role: string;
  role_name?: string;
  is_super_admin?: boolean;
  employee_code?: string;
  account_status?: string;
  permissions?: string[];
  login_at?: string;
  exp: number; // epoch seconds
  [key: string]: unknown;
}

export const SESSION_COOKIE = 'ggbg_crm_session';
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 giờ

function getSecret(): string {
  return (
    process.env.SESSION_SECRET ||
    // Fallback chỉ dùng cho môi trường dev; PHẢI ghi đè ở production.
    'ggbg-crm-dev-insecure-secret-please-set-SESSION_SECRET'
  );
}

const enc = new TextEncoder();

function b64urlEncode(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(str: string): Uint8Array {
  const pad = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4));
  const bin = atob(str.replace(/-/g, '+').replace(/_/g, '/') + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', enc.encode(getSecret()), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
    'verify',
  ]);
}

/** Ký payload thành token phiên (tự gắn exp nếu chưa có). */
export async function signSession(
  payload: Omit<SessionPayload, 'exp'> & { exp?: number },
  maxAgeSec: number = SESSION_MAX_AGE
): Promise<string> {
  const body: SessionPayload = {
    ...payload,
    exp: payload.exp ?? Math.floor(Date.now() / 1000) + maxAgeSec,
  } as SessionPayload;
  const dataB64 = b64urlEncode(enc.encode(JSON.stringify(body)));
  const key = await getKey();
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(dataB64));
  return `${dataB64}.${b64urlEncode(new Uint8Array(sig))}`;
}

/** Xác minh token, trả payload nếu hợp lệ & chưa hết hạn, ngược lại null. */
export async function verifySession(token?: string | null): Promise<SessionPayload | null> {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [dataB64, sigB64] = token.split('.');
  if (!dataB64 || !sigB64) return null;
  try {
    const key = await getKey();
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      b64urlDecode(sigB64) as BufferSource,
      enc.encode(dataB64)
    );
    if (!valid) return null;
    const payload = JSON.parse(new TextDecoder().decode(b64urlDecode(dataB64))) as SessionPayload;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
