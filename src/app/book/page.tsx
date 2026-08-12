import type { Metadata } from 'next';
import { ArrowUpRight, Clock, MapPin, MessageCircle, Phone } from 'lucide-react';
import { BookingFrame } from '@/components/BookingFrame';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { ClipReveal } from '@/components/motion';
import { LISTED_SERVICE_COUNT, WHATSAPP_URL, site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Book Now',
  description: `Book a treatment at Emerald Spa & Wellness Centre, Blackett Street No. 7, Windhoek West. Open seven days. Call ${site.phone} or reserve online.`,
  alternates: { canonical: '/book' },
};

/**
 * Booking route.
 *
 * The booking app is embedded directly in the page through a same-origin
 * proxy, so the visitor never leaves this domain and the provider is never
 * named. See `src/app/api/booking/[...path]/route.ts` for why the proxy is
 * required and PROOF.md for the end-to-end verification.
 */
export default function BookPage() {
  const openToday = site.hours.find((h) => h.day === 'Sunday');

  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="shell border-b border-ink/10 py-16 md:py-24">
          <p className="eyebrow text-emerald-600">Booking</p>
          <h1 className="display mt-4 max-w-4xl text-4xl text-balance sm:text-5xl md:text-6xl">
            <ClipReveal>Reserve your treatment.</ClipReveal>
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-ink/70 text-pretty">
            Choose from {LISTED_SERVICE_COUNT} treatments across {site.categories.length}{' '}
            categories. Pick your therapist and your time, and pay at the spa.
          </p>
        </section>

        <section className="shell py-16 md:py-20">
          <BookingFrame />
        </section>

        <section className="shell grid gap-12 border-t border-ink/10 py-16 md:grid-cols-12 md:py-20">

          <aside className="md:col-span-6">
            <h2 className="eyebrow text-emerald-600">Prefer to talk first</h2>
            <ul className="mt-4 space-y-4 text-ink/80">
              <li>
                <a
                  href={`tel:${site.phoneE164}`}
                  className="flex items-center gap-3 text-lg transition-colors hover:text-emerald-600"
                >
                  <Phone className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-lg transition-colors hover:text-emerald-600"
                >
                  <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                  Message on WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={site.address.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 transition-colors hover:text-emerald-600"
                >
                  <MapPin className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
                  <span>
                    {site.address.street}, {site.address.suite}
                    <br />
                    {site.address.suburb}, {site.address.city}
                  </span>
                </a>
              </li>
            </ul>

          </aside>

          <div className="md:col-span-6">
            <h2 className="eyebrow flex items-center gap-2 text-emerald-600">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              Opening hours
            </h2>
            <ul className="mt-4 divide-y divide-ink/10 border-t border-ink/10">
              {site.hours.map((h) => (
                <li key={h.day} className="flex justify-between gap-4 py-2.5 text-sm text-ink/80">
                  <span>{h.day}</span>
                  <span className="tabular-nums">{h.value}</span>
                </li>
              ))}
            </ul>
            {openToday ? (
              <p className="mt-4 text-sm text-ink/65">
                Sunday hours are shorter, {openToday.value}.
              </p>
            ) : null}

            <a
              href={site.address.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-emerald-600 hover:underline"
            >
              Get directions
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
