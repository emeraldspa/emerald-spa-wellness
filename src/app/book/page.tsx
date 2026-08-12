import type { Metadata } from 'next';
import Link from 'next/link';
import { MessageCircle, Phone } from 'lucide-react';
import { BookingFrame } from '@/components/BookingFrame';
import { FooterMinimal } from '@/components/FooterMinimal';
import { SiteHeader } from '@/components/SiteHeader';
import { LISTED_SERVICE_COUNT, WHATSAPP_PATH, site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Book Now',
  description: `Book a treatment at Emerald Spa & Wellness Centre, Blackett Street No. 7, Windhoek West. ${LISTED_SERVICE_COUNT} treatments, open seven days.`,
  alternates: { canonical: '/book' },
};

/**
 * Booking route, deliberately minimal.
 *
 * The booking app is heavy on its own, so this page adds as little as
 * possible around it: no gallery, no hours table, no marketing footer, no
 * floating widgets. A short header, the frame, and two fallbacks underneath.
 * Everything the visitor needs to complete the task, nothing competing for
 * the same attention or the same bandwidth.
 */
export default function BookPage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="shell pt-10 md:pt-14">
          <p className="eyebrow text-emerald-600">Booking</p>
          <h1 className="display mt-3 text-3xl sm:text-4xl">Reserve your treatment.</h1>
        </section>

        <section className="shell pb-10 pt-6 md:pb-14">
          <BookingFrame />

          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-ink/70">
            <span>Prefer to talk first</span>
            <a
              href={`tel:${site.phoneE164}`}
              className="flex items-center gap-2 font-medium text-ink transition-colors hover:text-emerald-600"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {site.phone}
            </a>
            <Link
              href={WHATSAPP_PATH}
              className="flex items-center gap-2 font-medium text-ink transition-colors hover:text-emerald-600"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Book on WhatsApp
            </Link>
          </div>
        </section>
      </main>
      <FooterMinimal />
    </>
  );
}
