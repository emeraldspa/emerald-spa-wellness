'use client';

import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { site } from '@/lib/site';

const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Today's operating hours, computed in the visitor's own clock.
 *
 * The site is a static export, so the server cannot know which day the reader
 * is seeing. We fill in the day after mount: on a Monday this reads
 * "Today · Monday · 9:00 AM - 6:00 PM", and it is always correct for whoever
 * is looking at the page.
 */
export function TodayHours() {
  const [dayIndex, setDayIndex] = useState<number | null>(null);

  useEffect(() => {
    setDayIndex(new Date().getDay());
  }, []);

  const today = dayIndex !== null ? site.hours.find((h) => h.day.toLowerCase() === DAY_KEYS[dayIndex]) : null;

  return (
    <div className="mt-8 inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full border border-ink/10 bg-ground px-5 py-2.5 text-sm shadow-[0_2px_10px_rgba(7,33,26,0.06)]">
      <Clock className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
      <span className="font-medium text-ink">
        {dayIndex !== null ? `Today · ${DAY_NAMES[dayIndex]}` : 'Hours today'}
      </span>
      <span aria-hidden="true" className="text-ink/25">
        ·
      </span>
      <span className="tabular-nums text-ink/70">
        {today ? (today.closed ? 'Closed' : today.value) : '—'}
      </span>
    </div>
  );
}
