'use client';

import { ArrowUpRight, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { BOOKING_CTA, site } from '@/lib/site';

const STEPS = [
  'Pick your treatment from the full menu',
  'Choose a therapist and a time that suits you',
  'Confirm with your name and number, and pay at the spa',
];

/**
 * Booking launcher.
 *
 * Opens the secure booking system in a new tab, so this site stays open in
 * the original tab and the visitor never loses their place. The provider is
 * not named because the guest is booking with Emerald.
 *
 * An iframe was the original intent and was tested first. The provider
 * responds with a `frame-ancestors` policy that permits only its own origin,
 * so a cross-origin embed is refused by the browser before it renders.
 */
export function BookingLauncher() {
  const [opening, setOpening] = useState(false);

  return (
    <div className="border border-ink/15 bg-white/50 p-6 sm:p-10">
      <h2 className="display text-2xl sm:text-3xl">Three steps, about a minute.</h2>

      <ol className="mt-8 space-y-5">
        {STEPS.map((step, i) => (
          <li key={step} className="flex gap-4">
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <span className="pt-0.5 text-ink/80">{step}</span>
          </li>
        ))}
      </ol>

      <a
        href={site.bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          setOpening(true);
          window.setTimeout(() => setOpening(false), 2500);
        }}
        className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-emerald-700 sm:w-auto"
      >
        {opening ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Opening secure booking
          </>
        ) : (
          <>
            {BOOKING_CTA}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </a>

      <p className="mt-4 text-sm text-ink/65">
        Opens our secure booking system in a new tab. This page stays open behind it.
      </p>

      {/*
        Only two facts are verifiable from the venue record:
        `hasFreshaPayEnabled: false` means no online payment is taken, and
        `allowChoosePreferableEmployee: true` means the guest picks the
        therapist. Claims like "free to reschedule" or "instant confirmation"
        are not in the record, so they are not made.
      */}
      <ul className="mt-8 grid gap-2.5 border-t border-ink/10 pt-6 sm:grid-cols-2">
        {['Pay at the spa, not online', 'Choose your therapist'].map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm text-ink/70">
            <Check className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
