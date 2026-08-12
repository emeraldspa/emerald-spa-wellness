'use client';

import { AlertCircle, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { BOOKING_EMBED_PATH, site } from '@/lib/site';

/**
 * Embedded booking.
 *
 * The booking app runs inside this frame, served through our own origin, so
 * the address bar stays on this domain for the entire flow and the provider
 * is never named to the visitor.
 *
 * Two states matter beyond the happy path: a loading state while the app
 * boots, and a failure state if the upstream is unreachable. The failure
 * state offers phone and WhatsApp rather than a dead frame.
 */
export function BookingFrame() {
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading');
  const timeout = useRef<number | undefined>(undefined);

  useEffect(() => {
    // If the frame has not signalled load within 25s, treat it as failed.
    timeout.current = window.setTimeout(() => {
      setState((s) => (s === 'loading' ? 'failed' : s));
    }, 25000);
    return () => window.clearTimeout(timeout.current);
  }, []);

  return (
    <div className="relative min-h-[720px] overflow-hidden border border-ink/15 bg-white">
      {state === 'loading' ? (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-ground"
          role="status"
          aria-live="polite"
        >
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" aria-hidden="true" />
          <p className="eyebrow text-ink/65">Loading available times</p>
        </div>
      ) : null}

      {state === 'failed' ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-ground px-6 text-center">
          <AlertCircle className="h-7 w-7 text-emerald-700" aria-hidden="true" />
          <p className="max-w-sm text-ink/80">
            Online booking is not responding right now. Call or message us and we will book you
            in directly.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`tel:${site.phoneE164}`}
              className="rounded-full bg-emerald-600 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-emerald-700"
            >
              Call {site.phone}
            </a>
            <a
              href={`https://wa.me/${site.phoneE164.replace('+', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-ink/20 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-ink transition-colors hover:border-emerald-600 hover:text-emerald-600"
            >
              WhatsApp
            </a>
          </div>
        </div>
      ) : null}

      <iframe
        src={BOOKING_EMBED_PATH}
        title={`Book a treatment at ${site.legalName}`}
        className="h-[720px] w-full border-0 lg:h-[860px]"
        loading="lazy"
        onLoad={() => setState('ready')}
        onError={() => setState('failed')}
        allow="payment"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
