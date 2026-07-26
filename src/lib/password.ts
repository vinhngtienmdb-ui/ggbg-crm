/**
 * Băm & xác minh mật khẩu bằng PBKDF2 (Web Crypto API).
 * Dùng được ở cả Edge runtime (middleware) lẫn Node runtime (API routes),
 * không cần thư viện native. Định dạng lưu: pbkdf2$sha256$<iter>$<saltHex>$<hashHex>
 */

const ITERATIONS = 120_000;
const KEYLEN = 32; // bytes
const SALTLEN = 16; // bytes

function toHex(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function fromHex(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
  return out;
}

async function deriveHex(password: string, salt: Uint8Array, iterations: number): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, [
    'deriveBits',
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations, hash: 'SHA-256' },
    keyMaterial,
    KEYLEN * 8
  );
  return toHex(bits);
}

/** Băm mật khẩu mới (salt ngẫu nhiên). */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALTLEN));
  const hashHex = await deriveHex(password, salt, ITERATIONS);
  return `pbkdf2$sha256$${ITERATIONS}$${toHex(salt)}$${hashHex}`;
}

/** So khớp mật khẩu với chuỗi đã băm (timing-safe). */
export async function verifyPassword(password: string, stored?: string): Promise<boolean> {
  if (!stored) return false;
  const parts = stored.split('$');
  if (parts.length !== 5 || parts[0] !== 'pbkdf2') return false;
  const iterations = parseInt(parts[2], 10);
  const salt = fromHex(parts[3]);
  const expected = parts[4];
  const actual = await deriveHex(password, salt, iterations);
  return timingSafeEqualHex(actual, expected);
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
