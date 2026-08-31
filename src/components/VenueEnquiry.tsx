'use client';

import { ArrowUpRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { WHATSAPP_NUMBER, site } from '@/lib/site';

/**
 * Venue hire enquiry, one compact flow.
 *
 * Occasion, guests, timing: three taps assemble a ready-to-send WhatsApp
 * message. The team replies with availability, pricing and a date. Nothing
 * is submitted to the site; the message is composed and opened in WhatsApp.
 */

const OCCASIONS = [
  { id: 'reveal', label: 'Baby gender reveal', line: 'a baby gender reveal' },
  { id: 'party', label: 'Birthday party', line: 'a birthday party' },
  { id: 'corporate', label: 'Corporate event', line: 'a corporate event' },
  { id: 'family', label: 'Family gathering', line: 'a family gathering' },
  { id: 'other', label: 'Something else', line: 'a private event' },
] as const;

const SIZES = [
  { id: 's', label: 'Up to 20 guests', line: 'up to 20 guests' },
  { id: 'm', label: '20 to 40 guests', line: 'between 20 and 40 guests' },
  { id: 'l', label: '40 to 80 guests', line: 'between 40 and 80 guests' },
  { id: 'xl', label: '80+ guests', line: 'more than 80 guests' },
] as const;

const WHEN = [
  { id: 'month', label: 'This month', line: 'this month' },
  { id: 'next', label: 'Next month', line: 'next month' },
  { id: 'flex', label: 'Flexible', line: 'and we are flexible on the date' },
] as const;

type Occasion = (typeof OCCASIONS)[number]['id'];
type Size = (typeof SIZES)[number]['id'];
type When = (typeof WHEN)[number]['id'];

export function VenueEnquiry({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const [occasion, setOccasion] = useState<Occasion>('reveal');
  const [size, setSize] = useState<Size>('m');
  const [when, setWhen] = useState<When>('flex');

  const message = useMemo(() => {
    const o = OCCASIONS.find((x) => x.id === occasion)!;
    const s = SIZES.find((x) => x.id === size)!;
    const w = WHEN.find((x) => x.id === when)!;
    return `Hello ${site.legalName}. I would like to book the venue for ${o.line} with ${s.line}, ${w.line}. Could you share availability and pricing?`;
  }, [occasion, size, when]);

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  // 'dark' sits on the emerald marble section of /venues; 'light' sits on the
  // cream panel of /book-bulk. Chip and card colours must follow the ground
  // or the unselected options turn invisible (client-reported, Round 9).
  const eyebrow = tone === 'dark' ? 'text-emerald-300' : 'text-emerald-600';
  const card =
    tone === 'dark'
      ? 'rounded-2xl border border-ground/15 bg-ground/[0.06] p-6 backdrop-blur'
      : 'rounded-2xl border border-ink/12 bg-white/70 p-6 backdrop-blur';
  const note = tone === 'dark' ? 'text-ground/60' : 'text-ink/60';

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <div className="space-y-8">
          <fieldset>
            <legend className={`eyebrow ${eyebrow}`}>1 · What is the occasion</legend>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {OCCASIONS.map((o) => (
                <Chip key={o.id} active={occasion === o.id} tone={tone} onClick={() => setOccasion(o.id)}>
                  {o.label}
                </Chip>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className={`eyebrow ${eyebrow}`}>2 · How many guests</legend>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {SIZES.map((o) => (
                <Chip key={o.id} active={size === o.id} tone={tone} onClick={() => setSize(o.id)}>
                  {o.label}
                </Chip>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className={`eyebrow ${eyebrow}`}>3 · When are you thinking</legend>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {WHEN.map((o) => (
                <Chip key={o.id} active={when === o.id} tone={tone} onClick={() => setWhen(o.id)}>
                  {o.label}
                </Chip>
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      <div>
        <div className={card}>
          <p className={`eyebrow ${eyebrow}`}>Your message</p>
          <p
            className="mt-4 rounded-2xl rounded-bl-sm bg-[#DCF8C6] p-4 text-sm leading-relaxed text-[#07211A]"
            aria-live="polite"
          >
            {message}
          </p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gold-300 px-6 py-4 text-sm font-semibold uppercase tracking-widest text-[#0A1310] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Ask about the venue
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <p className={`mt-3 text-xs ${note}`}>
            Opens WhatsApp with this message ready to send to {site.phone}. The team replies with
            availability and pricing.
          </p>
        </div>
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  tone = 'dark',
  children,
}: {
  active: boolean;
  onClick: () => void;
  tone?: 'dark' | 'light';
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-[44px] rounded-full border px-4 py-2.5 text-sm transition-all duration-200 ${
        active
          ? 'border-emerald-400 bg-emerald-500 text-white'
          : tone === 'dark'
            ? 'border-ground/25 text-ground/85 hover:border-gold-300 hover:text-gold-200'
            : 'border-ink/20 text-ink/80 hover:border-emerald-600 hover:text-emerald-600'
      }`}
    >
      {children}
    </button>
  );
}
