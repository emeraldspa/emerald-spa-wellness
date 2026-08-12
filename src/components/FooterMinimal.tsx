import Link from 'next/link';
import { LEGAL_LINKS, site } from '@/lib/site';

/**
 * Minimal footer.
 *
 * For pages that already carry the contact detail, or whose whole job is a
 * single task. Keeps only what every page owes: identity, copyright, legal
 * links, and the studio credit. See docs/FOOTER_STRATEGY.md.
 */
export function FooterMinimal() {
  return (
    <footer className="border-t border-ink/10 bg-ground">
      <div className="shell flex flex-col gap-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/symbol-photoreal.png"
            alt=""
            width={400}
            height={293}
            loading="lazy"
            decoding="async"
            className="h-8 w-auto"
          />
          <p className="text-xs text-ink/65">
            &copy; {new Date().getFullYear()} {site.legalName}
          </p>
        </div>

        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink/65">
          {LEGAL_LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="hover:text-emerald-600">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <a
          href="https://studio.tangison.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-ink/65 hover:text-emerald-600"
        >
          Made by Tangison Studio
        </a>
      </div>
    </footer>
  );
}
