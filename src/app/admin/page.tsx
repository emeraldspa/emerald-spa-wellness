import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { AdminLogin, AdminSignOut } from '@/components/admin/AdminLogin';
import { SESSION_COOKIE, verifyToken, isConfigured } from '@/lib/cms/session';
import { COLLECTIONS, CollectionSlug, readCollection, storeMode } from '@/lib/cms/store';

export const metadata: Metadata = {
  title: 'Content Manager',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

/**
 * The Content Manager dashboard: sign in, or see every collection with a
 * live count of what is inside it. Counts read through the same store the
 * editors use, so they are always what the editors will show.
 */
export default async function AdminPage() {
  const authed = verifyToken(cookies().get(SESSION_COOKIE)?.value);

  if (!authed) {
    const configured = isConfigured();
    return (
      <main className="min-h-screen bg-emerald-950">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-16">
          {configured ? (
            <AdminLogin />
          ) : (
            <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <p className="font-[family-name:var(--font-display)] text-2xl text-white">
                Content Manager
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                The Content Manager is not configured on this deployment yet. Three environment
                variables must be set in the Vercel project settings first:
              </p>
              <ul className="mt-4 space-y-2 text-sm text-white/60">
                <li className="rounded-lg bg-black/30 px-4 py-2 font-mono text-xs">ADMIN_PASSWORD</li>
                <li className="rounded-lg bg-black/30 px-4 py-2 font-mono text-xs">ADMIN_SECRET</li>
                <li className="rounded-lg bg-black/30 px-4 py-2 font-mono text-xs">CMS_GITHUB_TOKEN</li>
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-white/45">
                Once they are set, redeploy the project and this page becomes the sign-in screen.
                The public website is unaffected meanwhile.
              </p>
            </div>
          )}
        </div>
      </main>
    );
  }

  const slugs = Object.keys(COLLECTIONS) as CollectionSlug[];
  const counts = await Promise.all(
    slugs.map(async (slug) => {
      try {
        const { items } = await readCollection(slug);
        return [slug, items.length] as const;
      } catch {
        return [slug, -1] as const;
      }
    }),
  );
  const countMap = new Map(counts);

  return (
    <main className="min-h-screen bg-emerald-950">
      <div className="mx-auto max-w-4xl px-6 py-14">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-300/70">
              Emerald Spa &amp; Wellness Centre
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-white">
              Content Manager
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/55">
              Everything on this site that changes often lives here. Pick a collection, edit,
              save, and the site updates itself within a few minutes. No code, no developer,
              no way to break the layout.
            </p>
          </div>
          <AdminSignOut />
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {slugs.map((slug) => {
            const def = COLLECTIONS[slug];
            const count = countMap.get(slug) ?? 0;
            const href = slug === 'services' ? '/admin/services' : `/admin/${slug}`;
            return (
              <Link
                key={slug}
                href={href}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-emerald-400/40 hover:bg-emerald-500/5"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-medium text-white">{def.label}</h2>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/60">
                    {count >= 0 ? `${count} item${count === 1 ? '' : 's'}` : 'unavailable'}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{def.description}</p>
                <p className="mt-3 text-xs font-medium text-emerald-300/80 opacity-0 transition group-hover:opacity-100">
                  Open →
                </p>
              </Link>
            );
          })}
        </div>

        <p className="mt-8 text-xs leading-relaxed text-white/35">
          Storage mode: {storeMode() === 'github' ? 'GitHub (commits to main, deploys automatically)' : 'local files (development)'}.
          Every save is recorded in the repository history, so any change can be traced or
          undone by the webmaster.
        </p>
      </div>
    </main>
  );
}
