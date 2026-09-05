import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, verifyToken } from '@/lib/cms/session';
import {
  COLLECTIONS,
  CollectionSlug,
  readCollection,
  writeCollection,
} from '@/lib/cms/store';

/**
 * Read and save one content collection.
 *
 * GET  /api/cms/{collection}?category={slug}   -> items (session required)
 * PUT  /api/cms/{collection}                   -> commit the items array
 *      body: { items: [...], category?: string }
 *
 * A PUT commits straight to the repository, and the Vercel Git integration
 * deploys the commit, so a save is live within a couple of minutes. Every
 * route here is no-store: an admin must never read a cached list.
 */

export const dynamic = 'force-dynamic';

function isCollection(value: string): value is CollectionSlug {
  return Object.prototype.hasOwnProperty.call(COLLECTIONS, value);
}

function guard(req: NextRequest): NextResponse | null {
  if (!verifyToken(req.cookies.get(SESSION_COOKIE)?.value)) {
    return NextResponse.json({ ok: false, error: 'Not signed in.' }, { status: 401 });
  }
  return null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { collection: string } },
) {
  const denied = guard(req);
  if (denied) return denied;
  if (!isCollection(params.collection)) {
    return NextResponse.json({ ok: false, error: 'Unknown collection.' }, { status: 404 });
  }
  const category = req.nextUrl.searchParams.get('category') ?? undefined;
  try {
    const result = await readCollection(params.collection, category);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Read failed.' },
      { status },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { collection: string } },
) {
  const denied = guard(req);
  if (denied) return denied;
  if (!isCollection(params.collection)) {
    return NextResponse.json({ ok: false, error: 'Unknown collection.' }, { status: 404 });
  }

  let body: { items?: unknown; category?: unknown };
  try {
    body = (await req.json()) as { items?: unknown; category?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: 'Malformed JSON body.' }, { status: 400 });
  }

  if (!Array.isArray(body.items)) {
    return NextResponse.json({ ok: false, error: 'items must be an array.' }, { status: 400 });
  }
  const items = body.items as Record<string, unknown>[];
  if (items.length > 400 || JSON.stringify(items).length > 1_500_000) {
    return NextResponse.json({ ok: false, error: 'This edit is too large.' }, { status: 413 });
  }
  for (const item of items) {
    if (typeof item !== 'object' || item === null || Array.isArray(item)) {
      return NextResponse.json(
        { ok: false, error: 'Every item must be an object.' },
        { status: 400 },
      );
    }
  }

  const category = typeof body.category === 'string' ? body.category : undefined;
  try {
    const result = await writeCollection(params.collection, items, category);
    return NextResponse.json({
      ok: true,
      message: 'Saved. The site is being updated and will show this change within a few minutes.',
    });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Save failed.' },
      { status },
    );
  }
}
