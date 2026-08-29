'use client';

import { Minus, Plus } from 'lucide-react';
import { useId, useState } from 'react';

/**
 * Frequently asked questions.
 *
 * An accordion is the right container here for one reason: this is secondary
 * detail a visitor consults rather than reads. Stacking eight answers in full
 * would push the booking action off the page for someone who only wanted to
 * know about parking.
 *
 * What is deliberately not in here: prices, the address, opening hours and the
 * phone number. Those are the facts a visitor must not miss, so they stay
 * visible on the page and in the footer. Nothing critical hides behind an
 * interaction, on any viewport.
 *
 * Native buttons with `aria-expanded` and a controlled region, so it works with
 * a keyboard and announces state correctly. One level, never nested.
 */
export type FaqItem = { q: string; a: string };

export function Faq({ items }: { items: readonly FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <ul className="border-t border-ink/15">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${base}-panel-${i}`;
        const buttonId = `${base}-button-${i}`;
        return (
          <li key={item.q} className="border-b border-ink/15">
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex min-h-[64px] w-full items-center justify-between gap-6 py-4 text-left transition-colors hover:text-emerald-800"
              >
                <span className="text-base font-medium text-ink sm:text-lg">{item.q}</span>
                <span
                  aria-hidden="true"
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    isOpen
                      ? 'border-emerald-700 bg-emerald-700 text-white'
                      : 'border-ink/20 text-ink/70'
                  }`}
                >
                  {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </span>
              </button>
            </h3>
            {/*
              Grid rows animate to auto height without measuring anything in
              JavaScript, and collapse to zero cleanly for reduced motion.
            */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="pb-5 pr-14"
            >
              <p className="max-w-2xl text-sm leading-relaxed text-ink/75 text-pretty sm:text-base">
                {item.a}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
