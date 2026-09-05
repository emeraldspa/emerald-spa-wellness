import { NextRequest, NextResponse } from 'next/server';
import {
  isConfigured,
  issueToken,
  SESSION_COOKIE,
  verifyPassword,
  verifyToken,
} from '@/lib/cms/session';

/**
 * Login and logout for the Emerald Content Manager.
 *
 * POST { password } sets the signed session cookie when the password
 * matches. DELETE clears it. GET reports whether the caller holds a valid
 * session so the admin shell can render its right state without guessing.
 */

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authed = verifyToken(req.cookies.get(SESSION_COOKIE)?.value);
  return NextResponse.json({ authed, configured: isConfigured() });
}

export async function POST(req: NextRequest) {
  if (!isConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'The Content Manager is not configured on this deployment yet. ADMIN_PASSWORD and ADMIN_SECRET must be set in the Vercel project settings first.',
      },
      { status: 503 },
    );
  }
  let password = '';
  try {
    const body = (await req.json()) as { password?: unknown };
    password = typeof body.password === 'string' ? body.password : '';
  } catch {
    return NextResponse.json({ ok: false, error: 'Malformed request.' }, { status: 400 });
  }

  if (!verifyPassword(password)) {
    // Small, constant delay so wrong guesses cost the same every time.
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ ok: false, error: 'That password is not right.' }, { status: 401 });
  }

  const issued = issueToken();
  if (!issued) {
    return NextResponse.json({ ok: false, error: 'The CMS is not configured.' }, { status: 503 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, issued.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: issued.maxAgeSeconds,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
  return res;
}
