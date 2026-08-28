'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react';
import { useMemo, useState } from 'react';
import { WHATSAPP_NUMBER, site } from '@/lib/site';

/**
 * WhatsApp enquiry builder, process-shaped.
 *
 * Three quick steps (what, who, when) with a visible progress rail, a live
 * message preview, and a single tap that opens WhatsApp with the message
 * already typed. Nothing is submitted and nothing is stored: the selections
 * only shape the wa.me text parameter.
 */

const INTENTS = [
  { id: 'book', label: 'Book a treatment', line: 'I would like to book a treatment' },
  { id: 'ask', label: 'Ask about a service', line: 'I have a question about a service' },
  { id: 'gift', label: 'Something for two', line: 'I am looking to book for two people' },
  { id: 'group', label: 'A group or event', line: 'I would like to arrange a group visit or event' },
  { id: 'other', label: 'Something else', line: 'I have an enquiry' },
] as const;

const WHEN = [
  { id: 'asap', label: 'As soon as possible', line: 'as soon as you have availability' },
  { id: 'week', label: 'This week', line: 'sometime this week' },
  { id: 'weekend', label: 'This weekend', line: 'this weekend' },
  { id: 'flexible', label: 'I am flexible', line: 'and I am flexible on timing' },
] as const;

const GUESTS = [
  { id: 'two', label: '2 people', line: 'for two people' },
  { id: 'three', label: '3 people', line: 'for three people' },
  { id: 'four', label: '4 people', line: 'for four people' },
  { id: 'six', label: '6 people', line: 'for six people' },
  { id: 'eight', label: '8+ people', line: 'for a larger group' },
] as const;

type Intent = (typeof INTENTS)[number]['id'];
type When = (typeof WHEN)[number]['id'];
type Guests = (typeof GUESTS)[number]['id'];

const STEPS = ['What', 'Who', 'When'] as const;

export function WhatsAppFlow({
  categories,
  initialIntent = 'book',
}: {
  categories: string[];
  initialIntent?: Intent;
}) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState<number>(0);
  const [intent, setIntent] = useState<Intent>(initialIntent);
  const [treatment, setTreatment] = useState<string>('');
  const [guests, setGuests] = useState<Guests>('two');
  const [when, setWhen] = useState<When>('asap');

  const needsGuests = intent === 'gift' || intent === 'group';

  const message = useMemo(() => {
    const i = INTENTS.find((x) => x.id === intent)!;
    const w = WHEN.find((x) => x.id === when)!;
    let subject: string = i.line;
    if (needsGuests) {
      const g = GUESTS.find((x) => x.id === guests)!;
      subject = `${i.line}, ${g.line}`;
    } else if (treatment) {
      subject = `${i.line}: ${treatment}`;
    }
    return `Hello ${site.legalName}. ${subject}, ${w.line}. Could you let me know what is available?`;
  }, [intent, treatment, guests, when, needsGuests]);

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  const panelMotion = reduce
    ? { initial: false, animate: true }
    : {
        initial: { opacity: 0, x: 24 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -24 },
        transition: { type: 'spring' as const, stiffness: 260, damping: 26, mass: 0.8 },
      };

  const selectedStyle = {
    borderColor: '#087452',
    backgroundColor: '#087452',
    color: '#fff',
  };

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-7">
        {/* Progress rail */}
        <div className="flex items-center gap-3" aria-label="Enquiry steps">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                aria-current={step === i ? 'step' : undefined}
                className={`flex min-h-[36px] items-center gap-2 rounded-full px-3 text-[11px] font-semibold uppercase tracking-widest transition-colors ${
                  i === step
                    ? 'bg-emerald-600 text-white'
                    : i < step
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-ink/5 text-ink/45'
                }`}
              >
                <span className="tabular-nums">{i + 1}</span>
                {s}
              </button>
              {i < STEPS.length - 1 ? (
                <div
                  aria-hidden="true"
                  className={`h-px w-5 sm:w-8 ${i < step ? 'bg-emerald-500' : 'bg-ink/10'}`}
                />
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-8 min-h-[260px]">
          <AnimatePresence mode="wait" initial={false}>
            {step === 0 ? (
              <motion.div key="step0" {...panelMotion}>
                <p className="eyebrow text-emerald-600">What do you need</p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {INTENTS.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => {
                        setIntent(o.id);
                        setStep(1);
                      }}
                      style={intent === o.id ? selectedStyle : undefined}
                      className={`min-h-[44px] rounded-full border px-4 py-2.5 text-sm transition-all duration-200 ${
                        intent === o.id
                          ? ''
                          : 'border-ink/20 text-ink/80 hover:border-emerald-600 hover:text-emerald-600'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : null}

            {step === 1 ? (
              <motion.div key="step1" {...panelMotion}>
                <div className="flex items-center justify-between gap-4">
                  <p className="eyebrow text-emerald-600">
                    {needsGuests ? 'How many of you' : 'Which treatment, optional'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="flex min-h-[36px] items-center gap-1 text-xs font-semibold uppercase tracking-widest text-ink/55 transition-colors hover:text-emerald-600"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                    Back
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {needsGuests ? (
                    <>
                      {GUESTS.map((o) => (
                        <button
                          key={o.id}
                          type="button"
                          onClick={() => setGuests(o.id)}
                          style={guests === o.id ? selectedStyle : undefined}
                          className={`min-h-[44px] rounded-full border px-4 py-2.5 text-sm transition-all duration-200 ${
                            guests === o.id
                              ? ''
                              : 'border-ink/20 text-ink/80 hover:border-emerald-600 hover:text-emerald-600'
                          }`}
                        >
                          {o.label}
                        </button>
                      ))}
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setTreatment('')}
                        style={treatment === '' ? selectedStyle : undefined}
                        className={`min-h-[44px] rounded-full border px-4 py-2.5 text-sm transition-all duration-200 ${
                          treatment === ''
                            ? ''
                            : 'border-ink/20 text-ink/80 hover:border-emerald-600 hover:text-emerald-600'
                        }`}
                      >
                        Not sure yet
                      </button>
                      {categories.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setTreatment(c)}
                          style={treatment === c ? selectedStyle : undefined}
                          className={`min-h-[44px] rounded-full border px-4 py-2.5 text-sm transition-all duration-200 ${
                            treatment === c
                              ? ''
                              : 'border-ink/20 text-ink/80 hover:border-emerald-600 hover:text-emerald-600'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </>
                  )}
                </div>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="min-h-[44px] rounded-full bg-emerald-600 px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-emerald-700"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            ) : null}

            {step === 2 ? (
              <motion.div key="step2" {...panelMotion}>
                <div className="flex items-center justify-between gap-4">
                  <p className="eyebrow text-emerald-600">When suits you</p>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex min-h-[36px] items-center gap-1 text-xs font-semibold uppercase tracking-widest text-ink/55 transition-colors hover:text-emerald-600"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                    Back
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {WHEN.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setWhen(o.id)}
                      style={when === o.id ? selectedStyle : undefined}
                      className={`min-h-[44px] rounded-full border px-4 py-2.5 text-sm transition-all duration-200 ${
                        when === o.id
                          ? ''
                          : 'border-ink/20 text-ink/80 hover:border-emerald-600 hover:text-emerald-600'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="min-h-[44px] rounded-full border border-emerald-600 px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-emerald-700 transition-colors hover:bg-emerald-50"
                  >
                    Start over
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="sticky top-8 overflow-hidden rounded-2xl border border-ink/12 bg-white/70 p-6 shadow-[0_16px_48px_-20px_rgba(7,33,26,0.25)] backdrop-blur">
          <p className="eyebrow text-emerald-600">Your message</p>
          <div className="mt-4 rounded-2xl rounded-bl-sm bg-[#DCF8C6] p-4 text-sm leading-relaxed text-ink/90">
            <p aria-live="polite">{message}</p>
            <p className="mt-2 text-right text-[10px] text-ink/45">{site.phone}</p>
          </div>

          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-4 text-sm font-semibold uppercase tracking-widest text-[#07211A] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Open WhatsApp
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>

          <p className="mt-3 text-xs text-ink/60">
            Opens a chat with {site.phone} with this message ready. Nothing is sent until you tap
            send in WhatsApp.
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
