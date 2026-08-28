import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, CalendarCheck, MessageCircle, Phone } from 'lucide-react';
import { FooterMinimal } from '@/components/FooterMinimal';
import { LISTED_SERVICE_COUNT, WHATSAPP_PATH, site, SITE_URL, ogFor } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Book Now',
  description: `Book a treatment at Emerald Spa & Wellness Centre, 7 Blackett Street, Windhoek West. ${LISTED_SERVICE_COUNT} treatments, open seven days.`,
  alternates: { canonical: '/book' },
  openGraph: ogFor('/book'),
};

/**
 * Booking route, deliberately minimal.
 *
 * Booking happens on the provider's own page. This page is a link wrapper:
 * one clear path to the online calendar, and two human paths alongside it.
 * Nothing here tries to embed, proxy or simulate the booking flow, so the
 * guest always lands in a booking experience that works.
 */
export default function BookPage() {
  return (
    <>
      <main id="main">
        <section className="shell flex flex-col items-start py-16 md:py-24">
          <p className="eyebrow text-emerald-700">Booking</p>
          <h1 className="display mt-4 max-w-3xl text-4xl text-balance sm:text-5xl">
            Reserve your treatment.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/70 text-pretty">
            Pick a service, a professional and a time in the spa&rsquo;s online calendar.
            Nothing is charged online and rescheduling is free.
          </p>

          {/* The one path that matters: the online calendar. */}
          <a
            href={site.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-10 inline-flex min-h-[60px] w-full max-w-xl items-center justify-between gap-4 rounded-2xl bg-emerald-700 px-7 py-5 text-left text-white shadow-[0_24px_60px_-24px_rgba(7,33,26,0.55)] transition-all duration-300 hover:bg-emerald-600 hover:shadow-[0_28px_70px_-22px_rgba(7,33,26,0.6)]"
          >
            <span>
              <span className="block text-sm font-semibold uppercase tracking-widest text-emerald-200">
                Book online
              </span>
              <span className="mt-1 block text-xl font-medium">
                Open the spa&rsquo;s calendar
              </span>
            </span>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-1">
              <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
            </span>
          </a>
          <p className="mt-3 text-sm text-ink/55">
            Opens in a new tab. The calendar is run by the spa&rsquo;s booking provider.
          </p>

          {/* Human paths. */}
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={`tel:${site.phoneE164}`}
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-emerald-600 hover:text-emerald-600"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {site.phone}
            </a>
            <Link
              href={WHATSAPP_PATH}
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Book on WhatsApp
            </Link>
          </div>

          <div className="mt-14 flex items-center gap-3 rounded-xl border border-ink/10 bg-emerald-50/60 px-5 py-4 text-sm text-ink/70">
            <CalendarCheck className="h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
            <span>
              Planning a group, a party or the venue?{' '}
              <Link href="/book-bulk" className="font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-800">
                Book in bulk
              </Link>{' '}
              and we will arrange it with you directly.
            </span>
          </div>
        </section>
      </main>
      <FooterMinimal />
    </>
  );
}
