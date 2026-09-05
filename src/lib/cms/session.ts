import crypto from 'crypto';

/**
 * Admin session for the Emerald Content Manager.
 *
 * A single shared password (ADMIN_PASSWORD) unlocks a signed, expiring
 * cookie. The cookie value is `${expiry}.${hmac}` where the HMAC is keyed by
 * ADMIN_SECRET, so a cookie cannot be forged without the server secret and
 * cannot outlive its twelve hour window. Every comparison is timing-safe.
 *
 * Both values come from environment variables set in the Vercel dashboard
 * and in .env.local for local development. Outside production a documented
 * pair of dev defaults keeps `next dev` usable without secrets on disk.
 */

export const SESSION_COOKIE = 'emerald_admin';
const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

function devFallbacks(): { password: string; secret: string } {
  return { password: 'emerald-dev-password', secret: 'emerald-dev-secret' };
}

/** True when the deployment carries the credentials the CMS needs. */
export function isConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SECRET);
}

function credentials(): { password: string; secret: string } {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SECRET;
  if (password && secret) return { password, secret };
  if (process.env.NODE_ENV !== 'production') return devFallbacks();
  throw new Error('ADMIN_PASSWORD and ADMIN_SECRET must be set in production');
}

function sign(secret: string, expiry: number): string {
  return crypto.createHmac('sha256', secret).update(`emerald-admin|${expiry}`).digest('hex');
}

/** Constant-time string equality over fixed-length hex digests. */
function safeEqual(a: string, b: string): boolean {
  const da = crypto.createHash('sha256').update(a).digest();
  const db = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(da, db);
}

/**
 * Fail closed without crashing: an unconfigured production deployment must
 * render the sign-in page, not a 500. Without credentials nothing ever
 * verifies, which is exactly the behaviour wanted.
 */
function credentialsSafe(): { password: string; secret: string } | null {
  try {
    return credentials();
  } catch {
    return null;
  }
}

export function verifyPassword(candidate: string): boolean {
  const creds = credentialsSafe();
  if (!creds) return false;
  if (typeof candidate !== 'string' || candidate.length === 0) return false;
  return safeEqual(candidate, creds.password);
}

/** Mint the cookie value for a fresh twelve hour session. */
export function issueToken(): { value: string; maxAgeSeconds: number } | null {
  const creds = credentialsSafe();
  if (!creds) return null;
  const expiry = Date.now() + TWELVE_HOURS_MS;
  return { value: `${expiry}.${sign(creds.secret, expiry)}`, maxAgeSeconds: TWELVE_HOURS_MS / 1000 };
}

/** True when the cookie is present, correctly signed, and unexpired. */
export function verifyToken(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  const creds = credentialsSafe();
  if (!creds) return false;
  const dot = cookieValue.indexOf('.');
  if (dot <= 0) return false;
  const expiry = Number(cookieValue.slice(0, dot));
  const signature = cookieValue.slice(dot + 1);
  if (!Number.isFinite(expiry) || expiry <= Date.now()) return false;
  const expected = sign(creds.secret, expiry);
  return signature.length === expected.length && safeEqual(signature, expected);
}
