'use client';

import { ArrowUpRight, Check } from 'lucide-react';
import { useMemo, useState } from 'react';
import { WHATSAPP_NUMBER, site } from '@/lib/site';

/**
 * WhatsApp enquiry builder.
 *
 * Three quick choices assemble one clear message, then a single tap opens
 * WhatsApp with that text already typed. No form is submitted anywhere and
 * nothing is stored: the selections only shape the `text` parameter on the
 * wa.me link, so the visitor goes straight into a real conversation.
 *
 * Every option below maps to a real category or a real opening time from the
 * venue record. Nothing here invents a service.
 */

const INTENTS = [
  { id: 'book', label: 'Book a treatment', line: 'I would like to book a treatment' },
  { id: 'ask', label: 'Ask about a service', line: 'I have a question about a service' },
  { id: 'gift', label: 'Something for two', line: 'I am looking to book for two people' },
  { id: 'other', label: 'Something else', line: 'I have an enquiry' },
] as const;

const WHEN = [
  { id: 'asap', label: 'As soon as possible', line: 'as soon as you have availability' },
  { id: 'week', label: 'This week', line: 'sometime this week' },
  { id: 'weekend', label: 'This weekend', line: 'this weekend' },
  { id: 'flexible', label: 'I am flexible', line: 'and I am flexible on timing' },
] as const;

type Intent = (typeof INTENTS)[number]['id'];
type When = (typeof WHEN)[number]['id'];

export function WhatsAppFlow({ categories }: { categories: string[] }) {
  const [intent, setIntent] = useState<Intent>('book');
  const [treatment, setTreatment] = useState<string>('');
  const [when, setWhen] = useState<When>('asap');

  const message = useMemo(() => {
    const i = INTENTS.find((x) => x.id === intent)!;
    const w = WHEN.find((x) => x.id === when)!;
    const subject = treatment ? `${i.line}: ${treatment}` : i.line;
    return `Hello ${site.legalName}. ${subject}, ${w.line}. Could you let me know what is available?`;
  }, [intent, treatment, when]);

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <fieldset>
          <legend className="eyebrow text-emerald-600">1. What do you need</legend>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {INTENTS.map((o) => (
              <Choice
                key={o.id}
                selected={intent === o.id}
                onClick={() => setIntent(o.id)}
                label={o.label}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-10">
          <legend className="eyebrow text-emerald-600">2. Which treatment, optional</legend>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <Choice selected={treatment === ''} onClick={() => setTreatment('')} label="Not sure yet" />
            {categories.map((c) => (
              <Choice
                key={c}
                selected={treatment === c}
                onClick={() => setTreatment(c)}
                label={c}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-10">
          <legend className="eyebrow text-emerald-600">3. When suits you</legend>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {WHEN.map((o) => (
              <Choice
                key={o.id}
                selected={when === o.id}
                onClick={() => setWhen(o.id)}
                label={o.label}
              />
            ))}
          </div>
        </fieldset>
      </div>

      <div className="lg:col-span-5">
        <div className="sticky top-8 border border-ink/15 bg-white/60 p-6">
          <p className="eyebrow text-emerald-600">Your message</p>
          <p
            className="mt-4 rounded-2xl rounded-bl-sm bg-[#DCF8C6] p-4 text-sm leading-relaxed text-ink/90"
            aria-live="polite"
          >
            {message}
          </p>

          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-4 text-sm font-semibold uppercase tracking-widest text-[#07211A] transition-transform hover:scale-[1.02]"
          >
            Open WhatsApp
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>

          <p className="mt-3 text-xs text-ink/65">
            Opens a chat with {site.phone}, with this message ready to send. Nothing is sent
            until you tap send in WhatsApp.
          </p>

          <ul className="mt-6 space-y-2 border-t border-ink/10 pt-5">
            {['No form to fill in', 'Reply during opening hours'].map((t) => (
              <li key={t} className="flex items-center gap-2 text-xs text-ink/70">
                <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Choice({
  selected,
  onClick,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`min-h-[44px] rounded-full border px-4 py-2.5 text-sm transition-colors ${
        selected
          ? 'border-emerald-600 bg-emerald-600 text-white'
          : 'border-ink/20 text-ink/80 hover:border-emerald-600 hover:text-emerald-600'
      }`}
    >
      {label}
    </button>
  );
}
