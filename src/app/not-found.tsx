import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { NAV_LINKS } from '@/lib/site';

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="shell flex min-h-[60vh] flex-col justify-center py-24">
        <p className="eyebrow text-emerald-600">404</p>
        <h1 className="display mt-4 max-w-3xl text-4xl text-balance sm:text-5xl md:text-6xl">
          This page has drifted off.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-ink/70">
          The page you asked for does not exist. Everything else is one link away.
        </p>
        <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
          <li>
            <Link
              href="/"
              className="text-sm font-semibold uppercase tracking-widest text-emerald-600 hover:underline"
            >
              Home
            </Link>
          </li>
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-sm font-semibold uppercase tracking-widest text-emerald-600 hover:underline"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter />
    </>
  );
}
