import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminEditor } from '@/components/admin/AdminEditor';
import { SESSION_COOKIE, verifyToken } from '@/lib/cms/session';
import { readCollection, CollectionSlug } from '@/lib/cms/store';
import { SCHEMAS, SERVICES_SCHEMA } from '@/lib/cms/schema';

export const metadata: Metadata = {
  title: 'Edit content',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

/**
 * One collection's editor. The schema is resolved on the server, the items
 * are read through the store, and the whole thing renders as a password-
 * gated page. Treatments arrive per category; the editor switches with its
 * own category rail.
 */
export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: { collection: string };
  searchParams?: { category?: string };
}) {
  if (params.collection !== 'services' && !(params.collection in SCHEMAS)) notFound();

  const authed = verifyToken(cookies().get(SESSION_COOKIE)?.value);
  if (!authed) {
    return (
      <main className="min-h-screen bg-emerald-950">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-16">
          <AdminLogin />
        </div>
      </main>
    );
  }

  const slug = params.collection as CollectionSlug | 'services';
  const schema = slug === 'services' ? SERVICES_SCHEMA : SCHEMAS[slug];
  const category = searchParams?.category;

  let items: Record<string, unknown>[] = [];
  let categories: { slug: string; name: string; count: number }[] | undefined;
  let activeCategory: string | undefined;
  let loadError: string | null = null;
  try {
    const result = await readCollection(slug, category);
    items = result.items;
    categories = result.categories;
    activeCategory = result.activeCategory;
  } catch (error) {
    loadError = error instanceof Error ? error.message : 'Could not load this collection.';
  }

  if (loadError) {
    return (
      <main className="min-h-screen bg-emerald-950">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-white">
            {schema.label}
          </h1>
          <p className="mt-4 rounded-xl bg-rose-500/15 px-4 py-3 text-sm text-rose-200">
            {loadError}
          </p>
        </div>
      </main>
    );
  }

  // Known treatment names feed the compose-from-notes helper: it matches
  // what the owner typed against the real menu so packages name real
  // treatments, not paraphrases.
  let knownTreatments: string[] = [];
  if (schema.composer) {
    try {
      const all = await readCollection('services');
      knownTreatments = all.items.map((i) => String(i.name ?? '')).filter(Boolean);
    } catch {
      knownTreatments = [];
    }
  }

  return (
    <main className="min-h-screen bg-emerald-950">
      <div className="mx-auto max-w-4xl px-6 py-14">
        <AdminEditor
          schema={schema}
          initialItems={items}
          categories={categories}
          initialCategory={activeCategory}
          knownTreatments={knownTreatments}
        />
      </div>
    </main>
  );
}
