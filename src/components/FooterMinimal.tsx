import Link from 'next/link';
import { LEGAL_LINKS, site } from '@/lib/site';
import { Wordmark } from '@/components/Wordmark';

/**
 * Minimal footer.
 *
 * For pages that already carry the contact detail, or whose whole job is a
 * single task. Keeps only what every page owes: identity, copyright, legal
 * links, and the studio credit. See docs/FOOTER_STRATEGY.md.
 */
export function FooterMinimal() {
  return (
    <footer className="relative border-t border-white/15 text-ground">
      {/* Liquid-glass emerald layer, matching the header pill. */}
      <div aria-hidden="true" className="absolute inset-0 bg-[#0E4634]/92" />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: "url('/media/marble-emerald-xl.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Top glass sheen, exactly like the header. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent"
      />
      <div aria-hidden="true" className="rule-gold absolute inset-x-0 top-0 h-px opacity-60" />

      <div className="shell relative flex flex-col gap-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <Wordmark tone="dark" size="sm" />
          <p className="text-xs text-ground/70">
            &copy; {new Date().getFullYear()} {site.legalName}
          </p>
        </div>

        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-ground/70">
          {LEGAL_LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="hover:text-gold-200">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <a
          href="https://studio.tangison.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-ground/70 hover:text-gold-200"
        >
          Made by Tangison Studio
        </a>
      </div>
    </footer>
  );
}
