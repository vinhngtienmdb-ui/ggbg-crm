import crypto from 'crypto';

/**
 * Pure Node.js RFC 6238 TOTP (Google Authenticator) Implementation
 */

const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function generateBase32Secret(length = 16): string {
  const bytes = crypto.randomBytes(length);
  let secret = '';
  for (let i = 0; i < bytes.length; i++) {
    secret += BASE32_CHARS[bytes[i] % 32];
  }
  return secret;
}

function base32ToBuffer(base32: string): Buffer {
  const cleanBase32 = base32.toUpperCase().replace(/[^A-Z2-7]/g, '');
  let bits = '';
  for (let i = 0; i < cleanBase32.length; i++) {
    const val = BASE32_CHARS.indexOf(cleanBase32[i]);
    bits += val.toString(2).padStart(5, '0');
  }

  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.substring(i, i + 8), 2));
  }
  return Buffer.from(bytes);
}

export function generateTOTPCode(secretBase32: string, timeStepWindow = 0): string {
  const key = base32ToBuffer(secretBase32);
  const timeStep = 30; // 30 seconds interval
  const time = Math.floor(Date.now() / 1000 / timeStep) + timeStepWindow;

  const buffer = Buffer.alloc(8);
  buffer.writeBigInt64BE(BigInt(time), 0);

  const hmac = crypto.createHmac('sha1', key);
  hmac.update(buffer);
  const digest = hmac.digest();

  const offset = digest[digest.length - 1] & 0xf;
  const codeInt =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  const otp = (codeInt % 1000000).toString().padStart(6, '0');
  return otp;
}

export function verifyTOTPCode(secretBase32: string, userCode: string): boolean {
  const cleanCode = (userCode || '').trim().replace(/\s+/g, '');
  if (cleanCode.length !== 6 || !/^\d{6}$/.test(cleanCode)) {
    return false;
  }

  // Allow a drift window of -1, 0, +1 (±30 seconds)
  for (let window = -1; window <= 1; window++) {
    const generated = generateTOTPCode(secretBase32, window);
    if (generated === cleanCode) {
      return true;
    }
  }
  return false;
}

export function getGoogleAuthQRUrl(label: string, secretBase32: string, issuer = 'GGBingo CRM'): string {
  const encodedLabel = encodeURIComponent(`${issuer}:${label}`);
  const encodedIssuer = encodeURIComponent(issuer);
  const otpauthUrl = `otpauth://totp/${encodedLabel}?secret=${secretBase32}&issuer=${encodedIssuer}`;

  // Use Google Chart API URL for reliable SVG rendering in browser img tags
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUrl)}`;
}
