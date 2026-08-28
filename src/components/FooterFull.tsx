import { ArrowUpRight, Facebook, Instagram, MapPin, MessageCircle, Phone } from 'lucide-react';
import Link from 'next/link';
import {
  BOOKING_CTA,
  BOOKING_PATH,
  LEGAL_LINKS,
  NAV_LINKS,
  WHATSAPP_PATH,
  site,
} from '@/lib/site';

/**
 * A deliberately short footer.
 *
 * One lockup, one line of contact, one row of links, one credit line. The
 * full menu, the hours and the gallery all live on their own pages; the
 * footer only has to answer "where, how do I book, and who made this".
 */
export function FooterFull() {
  return (
    <footer className="surface-stone-black relative border-t border-ink/10 text-ground">
      <div aria-hidden="true" className="absolute inset-0 bg-[#0A1310]/85" />
      <div aria-hidden="true" className="rule-gold absolute inset-x-0 top-0 h-px" />

      <div className="shell relative py-12 md:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Brand + tagline */}
          <div className="max-w-sm">
            <picture>
              <source
                type="image/avif"
                srcSet="/brand/lockup-stacked-dark-400.avif 400w, /brand/lockup-stacked-dark-800.avif 800w"
                sizes="160px"
              />
              <source
                type="image/webp"
                srcSet="/brand/lockup-stacked-dark-400.webp 400w, /brand/lockup-stacked-dark-800.webp 800w"
                sizes="160px"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/lockup-stacked-dark.png"
                alt={`${site.legalName} logo, a faceted emerald gemstone inside rose gold orbital rings`}
                width={400}
                height={307}
                loading="lazy"
                decoding="async"
                className="h-auto w-40"
              />
            </picture>
            <p className="mt-5 text-sm leading-relaxed text-ground/75">
              Quiet luxury in the heart of Windhoek West.
            </p>
          </div>

          {/* Contact, one line each */}
          <div className="space-y-2.5 text-sm text-ground/85">
            <a
              href={site.address.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 hover:text-gold-200"
            >
              <MapPin className="h-4 w-4 shrink-0 text-gold-300" aria-hidden="true" />
              {site.address.street}, {site.address.suburb}, {site.address.city}
            </a>
            <a href={`tel:${site.phoneE164}`} className="flex items-center gap-2.5 hover:text-gold-200">
              <Phone className="h-4 w-4 shrink-0 text-gold-300" aria-hidden="true" />
              {site.phone}
            </a>
            <Link href={WHATSAPP_PATH} className="flex items-center gap-2.5 hover:text-gold-200">
              <MessageCircle className="h-4 w-4 shrink-0 text-gold-300" aria-hidden="true" />
              Book on WhatsApp
            </Link>
            <Link
              href={BOOKING_PATH}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-ground px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-emerald-900 transition-colors hover:bg-gold-200"
            >
              {BOOKING_CTA}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {/* Short link rows */}
          <div className="flex flex-col gap-8">
            <nav aria-label="Footer">
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {NAV_LINKS.filter((l) => l.href !== BOOKING_PATH).map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-ground/80 hover:text-gold-200">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <ul className="flex gap-3">
              <li>
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${site.legalName} on Instagram`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-ground/25 transition-colors hover:border-gold-200 hover:text-gold-200"
                >
                  <Instagram className="h-4 w-4" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href={site.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${site.legalName} on Facebook`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-ground/25 transition-colors hover:border-gold-200 hover:text-gold-200"
                >
                  <Facebook className="h-4 w-4" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="relative border-t border-ground/15">
        <div className="shell flex flex-col gap-3 py-5 pb-24 text-xs text-ground/60 sm:flex-row sm:items-center sm:justify-between sm:pb-6 sm:pr-24">
          <p>
            &copy; {new Date().getFullYear()} {site.legalName}. Windhoek, Namibia.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
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
            className="hover:text-gold-200"
          >
            Made by Tangison Studio
          </a>
        </div>
      </div>
    </footer>
  );
}
