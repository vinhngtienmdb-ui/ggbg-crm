/**
 * Chống SSRF: kiểm tra URL/host trước khi hệ thống gọi ra ngoài.
 * Chỉ cho phép scheme http/https và chặn các host trỏ về mạng nội bộ/loopback.
 */

const BLOCKED_HOSTNAMES = new Set(['localhost', '0.0.0.0', '::1', '[::1]']);

/** Trả về true nếu hostname trỏ về mạng nội bộ / loopback / link-local. */
export function isBlockedHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');

  if (BLOCKED_HOSTNAMES.has(host)) return true;
  if (host.endsWith('.internal') || host.endsWith('.local')) return true;

  // IPv4 dạng số
  const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    const [a, b] = [Number(ipv4[1]), Number(ipv4[2])];
    if (a === 127) return true; // 127.0.0.0/8 loopback
    if (a === 10) return true; // 10.0.0.0/8
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
    if (a === 192 && b === 168) return true; // 192.168.0.0/16
    if (a === 169 && b === 254) return true; // 169.254.0.0/16 link-local
    if (a === 0) return true;
  }

  // IPv6 loopback / link-local / unique-local
  if (host === '::1' || host.startsWith('fe80:') || host.startsWith('fc') || host.startsWith('fd')) {
    return true;
  }

  return false;
}

/**
 * Xác thực một URL đầu ra. Trả về null nếu hợp lệ, hoặc chuỗi lý do lỗi nếu bị chặn.
 */
export function validateOutboundUrl(rawUrl: unknown): string | null {
  if (typeof rawUrl !== 'string' || rawUrl.length === 0 || rawUrl.length > 2000) {
    return 'URL không hợp lệ (chặn SSRF)';
  }
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return 'URL không hợp lệ (chặn SSRF)';
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return 'URL không hợp lệ (chặn SSRF)';
  }
  if (isBlockedHost(parsed.hostname)) {
    return 'URL không hợp lệ (chặn SSRF)';
  }
  return null;
}

/** Kiểm tra host thuần (không phải URL đầy đủ), vd host của SMTP server. */
export function validateOutboundHost(rawHost: unknown): string | null {
  if (typeof rawHost !== 'string' || rawHost.length === 0 || rawHost.length > 255) {
    return 'URL không hợp lệ (chặn SSRF)';
  }
  if (isBlockedHost(rawHost)) {
    return 'URL không hợp lệ (chặn SSRF)';
  }
  return null;
}
