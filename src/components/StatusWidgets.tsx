'use client';

import { Clock, MapPin, Phone, Star } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { GOOGLE_DIRECTIONS_URL, GOOGLE_REVIEW_URL, site } from '@/lib/site';

/**
 * A single row of small live facts.
 *
 * Deliberately four items and no more. The brief asked for widgets without
 * making the page overwhelming, and the useful ones are the questions a
 * visitor actually has before they call: are you open, how do I get there,
 * what is the number, are you any good.
 *
 * Open or closed is computed in the visitor's own clock from the published
 * hours. It renders as unknown on the server and fills in after mount, because
 * a static page cannot know the reader's time and guessing would eventually
 * tell someone the spa is open when it is closed.
 */

const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

function parseTime(value: string): number | null {
  // Accepts "09:00" and "9:00 AM" style values from the venue record.
  const m = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!m) return null;
  let h = Number(m[1]);
  const min = Number(m[2]);
  const suffix = m[3]?.toUpperCase();
  if (suffix === 'PM' && h !== 12) h += 12;
  if (suffix === 'AM' && h === 12) h = 0;
  return h * 60 + min;
}

type Status = { open: boolean; label: string } | null;

function computeStatus(): Status {
  const now = new Date();
  const key = DAY_KEYS[now.getDay()];
  const today = site.hours.find((h) => h.day.toLowerCase() === key);
  if (!today || today.closed) return { open: false, label: 'Closed today' };

  // The venue record stores one string, for example "9:00 AM - 6:00 PM".
  const [from, to] = today.value.split('-').map((v) => v.trim());
  const opens = parseTime(from ?? '');
  const closes = parseTime(to ?? '');
  if (opens === null || closes === null) return null;

  const minutes = now.getHours() * 60 + now.getMinutes();
  if (minutes < opens) return { open: false, label: `Opens ${from}` };
  if (minutes >= closes) return { open: false, label: 'Closed for today' };
  return { open: true, label: `Open until ${to}` };
}

export function StatusWidgets() {
  const [status, setStatus] = useState<Status>(null);

  useEffect(() => {
    setStatus(computeStatus());
    // Re-check on the minute boundary so the badge does not go stale on a
    // page left open.
    const timer = window.setInterval(() => setStatus(computeStatus()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-sm bg-ink/10 md:grid-cols-4">
      <li className="flex items-center gap-3 bg-ground px-5 py-4">
        <span
          aria-hidden="true"
          className={`relative flex h-2.5 w-2.5 shrink-0 rounded-full ${
            status?.open ? 'bg-emerald-500' : 'bg-clay-400'
          }`}
        >
          {status?.open ? (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
          ) : null}
        </span>
        <span className="min-w-0">
          <span className="block text-[10px] font-semibold uppercase tracking-widest text-ink/65">
            Today
          </span>
          <span className="block truncate text-sm font-medium text-ink">
            {status ? status.label : 'Checking hours'}
          </span>
        </span>
      </li>

      <li className="bg-ground">
        <a
          href={GOOGLE_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-full items-center gap-3 px-5 py-4 transition-colors hover:bg-clay-50"
        >
          <Star className="h-4 w-4 shrink-0 text-gold-500" aria-hidden="true" />
          <span className="min-w-0">
            <span className="block text-[10px] font-semibold uppercase tracking-widest text-ink/65">
              Rated
            </span>
            <span className="block truncate text-sm font-medium text-ink">
              {site.rating} from {site.reviewCount}
            </span>
          </span>
        </a>
      </li>

      <li className="bg-ground">
        <a
          href={GOOGLE_DIRECTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-full items-center gap-3 px-5 py-4 transition-colors hover:bg-clay-50"
        >
          <MapPin className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
          <span className="min-w-0">
            <span className="block text-[10px] font-semibold uppercase tracking-widest text-ink/65">
              Find us
            </span>
            <span className="block truncate text-sm font-medium text-ink">
              {site.address.suburb}
            </span>
          </span>
        </a>
      </li>

      <li className="bg-ground">
        <a
          href={`tel:${site.phoneE164}`}
          className="flex h-full items-center gap-3 px-5 py-4 transition-colors hover:bg-clay-50"
        >
          <Phone className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
          <span className="min-w-0">
            <span className="block text-[10px] font-semibold uppercase tracking-widest text-ink/65">
              Call
            </span>
            <span className="block truncate text-sm font-medium text-ink">{site.phone}</span>
          </span>
        </a>
      </li>
    </ul>
  );
}
