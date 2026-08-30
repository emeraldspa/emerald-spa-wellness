import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarCheck, MessageCircle, Phone } from 'lucide-react';
import { FooterMinimal } from '@/components/FooterMinimal';
import { BookingFrame } from '@/components/BookingFrame';
import { WHATSAPP_PATH, site, ogFor } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Book Now',
  description: `Book a treatment at Emerald Spa & Wellness Centre, 7 Blackett Street, Windhoek North. Pick a service, a professional and a time in the live calendar.`,
  alternates: { canonical: '/book' },
  openGraph: ogFor('/book'),
};

/**
 * Booking route. The live calendar is embedded in the page through the
 * same-origin proxy, as large as the viewport allows, and the flow runs
 * inside the frame for its entire length. Nothing on this page redirects
 * the guest away: phone and WhatsApp sit alongside the frame as quiet
 * alternatives, and the provider's own site is only offered if the frame
 * itself cannot load.
 */
export default function BookPage() {
  return (
    <>
      <main id="main">
        <section className="border-b border-ink/10 bg-emerald-50/50">
          <div className="shell flex flex-col gap-4 py-8 md:flex-row md:items-end md:justify-between md:py-10">
            <div>
              <p className="eyebrow text-emerald-700">Booking</p>
              <h1 className="display mt-2 text-3xl text-balance sm:text-4xl">
                Reserve your treatment.
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/70 text-pretty">
                The live calendar runs right here on the page. Pick a service, a
                professional and a time. Nothing is charged online and
                rescheduling is free.
              </p>
            </div>

            {/* Quiet alternatives to the frame. Not buttons that pull the
                guest out of the page, just two small text paths. */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 md:shrink-0">
              <a
                href={`tel:${site.phoneE164}`}
                className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-ink/75 transition-colors hover:text-emerald-700"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {site.phone}
              </a>
              <Link
                href={WHATSAPP_PATH}
                className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-ink/75 transition-colors hover:text-emerald-700"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                WhatsApp
              </Link>
            </div>
          </div>
        </section>

        {/*
          The frame is the page. Full-bleed edge to edge, every vertical pixel
          below the heading block: the calendar is the reason this route exists,
          so it gets the viewport and the alternatives stay in the bar above.
        */}
        <BookingFrame />

        <section className="shell py-10">
          <div className="flex items-start gap-3 rounded-xl border border-ink/10 bg-emerald-50/60 px-5 py-4 text-sm text-ink/70">
            <CalendarCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
            <span>
              Planning a group, a party or the venue?{' '}
              <Link
                href="/book-bulk"
                className="font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
              >
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
