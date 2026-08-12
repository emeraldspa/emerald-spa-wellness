import { ArrowUpRight, Facebook, Instagram, MapPin, MessageCircle, Phone, Star } from 'lucide-react';
import Link from 'next/link';
import { BOOKING_CTA, BOOKING_PATH, GOOGLE_REVIEW_URL, NAV_LINKS, WHATSAPP_URL, site } from '@/lib/site';

const LEGAL = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/brand', label: 'Brand' },
  { href: '/sitemap', label: 'Sitemap' },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 bg-emerald-900 text-ground">
      <div className="shell grid gap-12 py-16 md:grid-cols-4 md:py-20">
        <div className="md:col-span-2">
          {/*
            The real stacked lockup, sized as a featured element rather than a
            small icon. The cream wordmark variant is the correct one on this
            dark ground. AVIF and WebP with a PNG fallback, alpha preserved.
          */}
          <picture>
            <source
              type="image/avif"
              srcSet="/brand/lockup-stacked-dark-400.avif 400w, /brand/lockup-stacked-dark-800.avif 800w"
              sizes="(max-width: 768px) 240px, 320px"
            />
            <source
              type="image/webp"
              srcSet="/brand/lockup-stacked-dark-400.webp 400w, /brand/lockup-stacked-dark-800.webp 800w"
              sizes="(max-width: 768px) 240px, 320px"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/lockup-stacked-dark.png"
              alt={`${site.legalName} logo, a faceted emerald gemstone inside rose gold orbital rings`}
              width={800}
              height={614}
              loading="lazy"
              decoding="async"
              className="h-auto w-[240px] md:w-[320px]"
            />
          </picture>

          <p className="display mt-8 max-w-md text-3xl text-balance sm:text-4xl">
            Exhale, restore, and leave renewed.
          </p>

          <Link
            href={BOOKING_PATH}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ground px-6 py-3 text-xs font-semibold uppercase tracking-widest text-emerald-900 transition-colors hover:bg-gold-200"
          >
            {BOOKING_CTA}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div>
          <h2 className="eyebrow text-emerald-300">Visit</h2>
          <address className="mt-4 space-y-3 text-sm not-italic text-ground/85">
            <a
              href={site.address.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 hover:text-gold-200"
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                {site.address.street}, {site.address.suite}
                <br />
                {site.address.suburb}, {site.address.city}
              </span>
            </a>
            <a href={`tel:${site.phoneE164}`} className="flex items-center gap-2 hover:text-gold-200">
              <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
              {site.phone}
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-gold-200"
            >
              <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              WhatsApp
            </a>
          </address>

          <h2 className="eyebrow mt-8 text-emerald-300">Follow</h2>
          <ul className="mt-4 flex gap-3">
            <li>
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${site.legalName} on Instagram`}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ground/25 transition-colors hover:border-gold-200 hover:text-gold-200"
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
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ground/25 transition-colors hover:border-gold-200 hover:text-gold-200"
              >
                <Facebook className="h-4 w-4" aria-hidden="true" />
              </a>
            </li>
            <li>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Chat with ${site.legalName} on WhatsApp`}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ground/25 transition-colors hover:border-gold-200 hover:text-gold-200"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
              </a>
            </li>
          </ul>

          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm text-ground/85 transition-colors hover:text-gold-200"
          >
            <Star className="h-4 w-4 shrink-0 text-gold-300" aria-hidden="true" />
            Leave a Google review
          </a>
        </div>

        <div>
          <h2 className="eyebrow text-emerald-300">Hours</h2>
          <ul className="mt-4 space-y-1.5 text-sm text-ground/85">
            {site.hours.map((h) => (
              <li key={h.day} className="flex justify-between gap-4">
                <span>{h.day.slice(0, 3)}</span>
                <span className="tabular-nums">{h.value}</span>
              </li>
            ))}
          </ul>

          <h2 className="eyebrow mt-8 text-emerald-300">Explore</h2>
          {/* Book omitted: the primary button in the first column leads there. */}
          <ul className="mt-4 space-y-1.5 text-sm">
            {NAV_LINKS.filter((l) => l.href !== BOOKING_PATH).map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-ground/85 hover:text-gold-200">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-ground/15">
        {/*
          Extra right padding on the last row keeps the credit clear of the
          floating WhatsApp button, which is 56px wide plus its offset.
        */}
        <div className="shell flex flex-col gap-4 py-6 pb-24 text-xs text-ground/70 sm:flex-row sm:items-center sm:justify-between sm:pb-6 sm:pr-24">
          <p>
            &copy; {new Date().getFullYear()} {site.legalName}. Windhoek, Namibia.
          </p>
          <ul className="flex flex-wrap gap-5">
            {LEGAL.map((l) => (
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
