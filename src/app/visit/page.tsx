import type { Metadata } from 'next';
import { ArrowUpRight, Facebook, Instagram, MapPin, MessageCircle, Phone } from 'lucide-react';
import { Picture } from '@/components/Picture';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { ClipReveal, FadeUp } from '@/components/motion';
import { WHATSAPP_URL, site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Visit and Contact',
  description: `Emerald Spa & Wellness Centre is at ${site.address.street} ${site.address.suite}, ${site.address.suburb}, Windhoek. Open seven days. Call ${site.phone} or book online.`,
  alternates: { canonical: '/visit' },
};

export default function VisitPage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="shell border-b border-ink/10 py-16 md:py-24">
          <p className="eyebrow text-emerald-600">Visit</p>
          <h1 className="display mt-4 max-w-4xl text-4xl text-balance sm:text-5xl md:text-6xl">
            <ClipReveal>Find us in Windhoek West.</ClipReveal>
          </h1>
        </section>

        <section className="shell grid gap-12 py-16 md:grid-cols-12 md:py-20">
          <div className="md:col-span-5">
            <h2 className="eyebrow text-emerald-600">Address</h2>
            <address className="mt-4 space-y-4 text-lg not-italic text-ink/80">
              <a
                href={site.address.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 transition-colors hover:text-emerald-600"
              >
                <MapPin className="mt-1.5 h-5 w-5 shrink-0" aria-hidden="true" />
                <span>
                  {site.address.street}, {site.address.suite}
                  <br />
                  {site.address.suburb}
                  <br />
                  {site.address.city}, {site.address.region}
                </span>
              </a>
              <a
                href={`tel:${site.phoneE164}`}
                className="flex items-center gap-3 transition-colors hover:text-emerald-600"
              >
                <Phone className="h-5 w-5 shrink-0" aria-hidden="true" />
                {site.phone}
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 transition-colors hover:text-emerald-600"
              >
                <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                Message on WhatsApp
              </a>
            </address>

            <h2 className="eyebrow mt-12 text-emerald-600">Opening Hours</h2>
            <ul className="mt-4 divide-y divide-ink/10 border-t border-ink/10">
              {site.hours.map((h) => (
                <li key={h.day} className="flex justify-between gap-4 py-3 text-ink/80">
                  <span>{h.day}</span>
                  <span className="tabular-nums">{h.value}</span>
                </li>
              ))}
            </ul>

            <h2 className="eyebrow mt-12 text-emerald-600">Follow</h2>
            <div className="mt-4 flex gap-3">
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Emerald Spa on Instagram"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 transition-colors hover:border-emerald-600 hover:text-emerald-600"
              >
                <Instagram className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Emerald Spa on Facebook"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 transition-colors hover:border-emerald-600 hover:text-emerald-600"
              >
                <Facebook className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>

            <a
              href={site.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-12 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-emerald-700"
            >
              Book Your Escape
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div className="md:col-span-7">
            <FadeUp>
              <div className="overflow-hidden">
                <Picture
                  slug="reception"
                  sizes="(max-width: 768px) 100vw, 58vw"
                  imgClassName="w-full object-cover"
                />
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3">
                {site.features.map((f) => (
                  <li key={f} className="text-sm text-ink/65">
                    {f}
                  </li>
                ))}
              </ul>
            </FadeUp>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
