'use client';

import { AlertCircle, Loader2, RotateCw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { BOOKING_EMBED_PATH, BOOKING_FALLBACK_URL, site } from '@/lib/site';

/**
 * Embedded booking.
 *
 * The booking app runs inside this frame, served through our own origin, so
 * the address bar stays on this domain for the entire flow and the provider
 * is never named to the visitor.
 *
 * Three states matter: a loading state while the app boots, a ready state
 * once the app has actually painted content, and a failure state if the
 * upstream is unreachable or the app never mounts. The failure state offers
 * the phone, a direct booking link and WhatsApp rather than a dead frame.
 */
export function BookingFrame() {
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [attempt, setAttempt] = useState(0);
  const timeout = useRef<number | undefined>(undefined);

  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // If the frame has not signalled load within 15s, treat it as failed.
    // Short enough that a stalled widget hands the guest to the fallbacks
    // quickly instead of leaving a blank box on screen.
    timeout.current = window.setTimeout(() => {
      setState((s) => (s === 'loading' ? 'failed' : s));
    }, 15000);
    return () => window.clearTimeout(timeout.current);
  }, [state, attempt]);

  const retry = () => {
    setState('loading');
    setAttempt((a) => a + 1);
  };

  /*
    A load event is not proof the booking app rendered.

    The provider's bundle can return every file with a 200 and still never
    mount, which leaves a frame that has fired `load` around an empty
    document. Treating that as success shows the visitor a blank white box
    with no way forward, so the frame is inspected after it loads: it is only
    "ready" once it has actually painted content. The frame is same-origin
    through the proxy, so reading its body is permitted.
  */
  function verifyRendered() {
    const check = (n: number) => {
      const doc = frameRef.current?.contentDocument;
      const painted = (doc?.body?.innerText?.trim().length ?? 0) > 40;
      if (painted) {
        setState('ready');
        return;
      }
      if (n >= 12) {
        setState('failed');
        return;
      }
      window.setTimeout(() => check(n + 1), 1000);
    };
    check(0);
  }

  return (
    <div
      className={`relative overflow-hidden border border-ink/15 ${
        state === 'failed' ? 'min-h-0 bg-ground' : 'min-h-[720px] bg-white'
      }`}
    >
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
        <div className="flex flex-col items-center justify-center gap-4 bg-ground px-6 py-16 text-center">
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
              href={BOOKING_FALLBACK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-ink/20 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-ink transition-colors hover:border-emerald-600 hover:text-emerald-600"
            >
              Book online
            </a>
            <a
              href={`https://wa.me/${site.phoneE164.replace('+', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-ink/20 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-ink transition-colors hover:border-emerald-600 hover:text-emerald-600"
            >
              WhatsApp
            </a>
            <button
              type="button"
              onClick={retry}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-600 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-emerald-700 transition-colors hover:bg-emerald-50"
            >
              <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
              Try again
            </button>
          </div>
        </div>
      ) : null}

      {/*
        The booking app lays out its own full-height document, so the frame is
        sized to the viewport rather than a fixed pixel height. A short frame
        forces a scrollbar inside a scrollbar, which is the usual reason
        embedded booking feels broken.
      */}
      {state === 'failed' ? null : (
        <iframe
          key={attempt}
          ref={frameRef}
          src={BOOKING_EMBED_PATH}
          title={`Book a treatment at ${site.legalName}`}
          className="h-[min(1100px,calc(100vh-6rem))] min-h-[640px] w-full border-0"
          loading="lazy"
          onLoad={verifyRendered}
          onError={() => setState('failed')}
          allow="payment"
          referrerPolicy="no-referrer"
        />
      )}
    </div>
  );
}
