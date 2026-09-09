'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  Check,
  Copy,
  CreditCard,
  Mail,
  MessageCircle,
  ReceiptText,
} from 'lucide-react';
import { useEffect, useId, useMemo, useState } from 'react';
import {
  BOOKING_URL,
  EMAILS,
  PAY_REFERENCE_PREFIX,
  PAYMENT_ACCOUNT,
  WHATSAPP_NUMBER,
  formatNad,
  site,
} from '@/lib/site';

/**
 * Book-and-pay flow, in the client's own words: choose, pay straight away,
 * send the proof of payment, receive the voucher.
 *
 * Nothing is charged or stored on this page. The selections and a short
 * reference code compose WhatsApp messages (or an email) the guest sends
 * themselves, so payment stays between the guest and the spa, and the proof
 * of payment lands in the same chat the account details came from. Staff
 * verify the payment and reply with the voucher, which is how the spa already
 * runs vouchers.
 */

export type PayOption = {
  id: string;
  label: string;
  amount: number;
  note?: string;
};

type Step = 0 | 1 | 2 | 3;

const STEPS = ['Choose', 'Pay', 'Send proof', 'Voucher'] as const;

function makeReference(): string {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const bytes = new Uint8Array(4);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  }
  const code = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
  return `${PAY_REFERENCE_PREFIX}-${code}`;
}

export function PayFlow({
  packages,
  treatments,
}: {
  packages: PayOption[];
  treatments: { category: string; items: PayOption[] }[];
}) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState<Step>(0);
  const [selected, setSelected] = useState<PayOption | null>(null);
  // The reference is random, so it can only be minted on the client: minting
  // it during render made the server HTML and the hydrated tree disagree
  // (a live hydration warning, client-visible as a flash of a different code).
  const [reference, setReference] = useState('');
  useEffect(() => {
    setReference((current) => current || makeReference());
  }, []);
  const [customAmount, setCustomAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const [accountCopied, setAccountCopied] = useState(false);
  const treatmentId = useId();

  const customValue = Number(customAmount.replace(/[^0-9.]/g, ''));
  const customValid = Number.isFinite(customValue) && customValue >= 50;

  const amount = selected ? selected.amount : customValid ? customValue : null;

  const detailLine = selected
    ? `${selected.label}${selected.note ? ` (${selected.note})` : ''}`
    : customValid
      ? `a voucher of ${formatNad(customValue)}`
      : '';

  // Client brief (voice note, 6 Sep): the handoff text must say that the
  // proof of payment is coming and that the spot is held on the calendar,
  // while also pointing at the live booking page as the instant alternative.
  const payMessage = useMemo(() => {
    if (!detailLine || amount === null) return '';
    return [
      `Hello ${site.legalName}. I would like to book and pay straight away.`,
      `For: ${detailLine}.`,
      `Amount: ${formatNad(amount)}.`,
      `My reference: ${reference}.`,
      `I am paying by EFT into your ${PAYMENT_ACCOUNT.bank} account, or by mobile wallet to ${PAYMENT_ACCOUNT.walletNumber}. My full name is my payment reference, and I will send my proof of payment here straight after, so please hold my spot on the calendar while it is verified.`,
      `(I can also reserve instantly on your live booking page: ${BOOKING_URL}.)`,
    ].join(' ');
  }, [detailLine, amount, reference]);

  const proofMessage = useMemo(() => {
    if (!detailLine) return '';
    return [
      `Hello ${site.legalName}. Here is my proof of payment.`,
      `For: ${detailLine}.`,
      `My reference: ${reference}.`,
      'Please consider my spot reserved on the calendar while you verify it.',
      '(I will attach the confirmation from my banking app to this message.)',
    ].join(' ');
  }, [detailLine, reference]);

  const waPayHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(payMessage)}`;
  const waProofHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(proofMessage)}`;
  const mailProofHref = `mailto:${EMAILS.bookings}?subject=${encodeURIComponent(
    `Proof of payment, reference ${reference}`,
  )}&body=${encodeURIComponent(proofMessage)}`;

  const panelMotion = reduce
    ? { initial: false, animate: true }
    : {
        initial: { opacity: 0, x: 24 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -24 },
        transition: { type: 'spring' as const, stiffness: 260, damping: 26, mass: 0.8 },
      };

  async function copyReference() {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  const canProceed = amount !== null && amount > 0;

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-7">
        {/* Progress rail */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3" aria-label="Book and pay steps">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => i < step && setStep(i as Step)}
                aria-current={step === i ? 'step' : undefined}
                className={`flex min-h-[36px] items-center gap-2 rounded-full px-3 text-[11px] font-semibold uppercase tracking-widest transition-colors ${
                  i === step
                    ? 'bg-emerald-600 text-white'
                    : i < step
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-ink/5 text-ink/70'
                }`}
              >
                <span className="tabular-nums">{i + 1}</span>
                {s}
              </button>
              {i < STEPS.length - 1 ? (
                <div
                  aria-hidden="true"
                  className={`h-px w-4 sm:w-8 ${i < step ? 'bg-emerald-500' : 'bg-ink/10'}`}
                />
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-8 min-h-[320px]">
          <AnimatePresence mode="wait" initial={false}>
            {step === 0 ? (
              <motion.div key="choose" {...panelMotion}>
                <div className="flex items-center justify-between gap-4">
                  <p className="eyebrow text-emerald-600">What are you paying for</p>
                </div>

                <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-ink/70">
                  Packages
                </p>
                <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                  {packages.map((p) => {
                    const active = selected?.id === p.id;
                    return (
                      <li key={p.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelected(p);
                            setCustomAmount('');
                          }}
                          aria-pressed={active}
                          className={`flex min-h-[72px] w-full flex-col items-start gap-1 rounded-2xl border p-4 text-left transition-all duration-200 ${
                            active
                              ? 'border-emerald-600 bg-emerald-600 text-white shadow-[0_14px_30px_-16px_rgba(8,116,82,0.55)]'
                              : 'border-ink/15 bg-ground hover:border-emerald-500 hover:bg-emerald-50/50'
                          }`}
                        >
                          <span className="text-sm font-semibold leading-snug">{p.label}</span>
                          <span
                            className={`mt-1 text-sm font-semibold tabular-nums ${
                              active ? 'text-gold-200' : 'text-emerald-700'
                            }`}
                          >
                            {formatNad(p.amount)}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-ink/70">
                  A single treatment
                </p>
                <div className="mt-3">
                  <label htmlFor={treatmentId} className="sr-only">
                    Choose a treatment from the menu
                  </label>
                  <select
                    id={treatmentId}
                    value={selected && selected.id.startsWith('t-') ? selected.id : ''}
                    onChange={(e) => {
                      const id = e.target.value;
                      if (!id) return;
                      const found = treatments
                        .flatMap((g) => g.items)
                        .find((t) => t.id === id);
                      if (found) {
                        setSelected(found);
                        setCustomAmount('');
                      }
                    }}
                    className="min-h-[52px] w-full rounded-2xl border border-ink/15 bg-ground px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-emerald-600"
                  >
                    <option value="">Pick from the full menu, prices included</option>
                    {treatments.map((g) => (
                      <optgroup key={g.category} label={g.category}>
                        {g.items.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.label} - {formatNad(t.amount)}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-ink/70">
                  Voucher amount
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <div className="flex min-h-[52px] flex-1 items-center rounded-2xl border border-ink/15 bg-ground px-4 focus-within:border-emerald-600 sm:max-w-[260px]">
                    <span className="text-sm font-semibold text-ink/50">NAD</span>
                    <input
                      inputMode="decimal"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelected(null);
                      }}
                      placeholder="e.g. 500"
                      aria-label="Voucher amount in Namibian dollars"
                      className="ml-2 h-full w-full bg-transparent py-3 text-sm tabular-nums text-ink outline-none placeholder:text-ink/35"
                    />
                  </div>
                  {customAmount && !customValid ? (
                    <p className="text-xs text-ink/70">Minimum NAD 50.</p>
                  ) : null}
                </div>

                <button
                  type="button"
                  disabled={!canProceed}
                  onClick={() => canProceed && setStep(1)}
                  className="mt-8 inline-flex min-h-[52px] items-center gap-2 rounded-full bg-emerald-600 px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-ink/15 disabled:text-ink/40"
                >
                  Continue to payment
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </motion.div>
            ) : null}

            {step === 1 ? (
              <motion.div key="pay" {...panelMotion}>
                <div className="flex items-center justify-between gap-4">
                  <p className="eyebrow text-emerald-600">Pay straight away</p>
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="flex min-h-[36px] items-center gap-1 text-xs font-semibold uppercase tracking-widest text-ink/70 transition-colors hover:text-emerald-600"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                    Back
                  </button>
                </div>

                <div className="mt-5 rounded-2xl border border-ink/10 bg-emerald-50/60 p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-ink/70">
                    You are paying
                  </p>
                  <p className="mt-1 text-lg font-semibold text-ink">
                    {detailLine || 'Your selection'}
                  </p>
                  {amount !== null ? (
                    <p className="display mt-2 text-3xl text-emerald-800 tabular-nums">
                      {formatNad(amount)}
                    </p>
                  ) : null}

                  <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-ink/10 pt-4">
                    <span className="text-xs font-semibold uppercase tracking-widest text-ink/70">
                      Your reference
                    </span>
                    <code className="rounded-lg bg-ground px-3 py-1.5 text-sm font-semibold tracking-[0.18em] text-emerald-800">
                      {reference || 'EMR-····'}
                    </code>
                    <button
                      type="button"
                      onClick={copyReference}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-ink/15 px-4 text-xs font-semibold uppercase tracking-widest text-ink/70 transition-colors hover:border-emerald-600 hover:text-emerald-700"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                      ) : (
                        <Copy className="h-4 w-4" aria-hidden="true" />
                      )}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-ink/70">
                    Use this reference on your payment so we can match it to you the moment
                    your proof arrives.
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  <a
                    href={waPayHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[64px] items-center justify-between gap-4 rounded-2xl bg-emerald-600 px-5 py-4 text-white transition-colors hover:bg-emerald-700"
                  >
                    <span className="flex items-center gap-3">
                      <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                      <span>
                        <span className="block text-sm font-semibold">
                          Tell us you have paid, on WhatsApp
                        </span>
                        <span className="block text-xs text-white/75">
                          Opens WhatsApp with your booking and reference already typed
                        </span>
                      </span>
                    </span>
                    <ArrowUpRight className="h-5 w-5 shrink-0" aria-hidden="true" />
                  </a>

                  {/* The account card (client published the details 7 Sep):
                      pay without waiting for a reply, with a copy button for
                      the account number. */}
                  <div className="rounded-2xl border border-ink/15 p-5">
                    <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                      <CreditCard className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                      Bank transfer (EFT)
                    </p>
                    <dl className="mt-3 space-y-1.5 text-sm text-ink/75">
                      <div className="flex justify-between gap-4">
                        <dt className="text-ink/70">Bank</dt>
                        <dd className="font-medium">
                          {PAYMENT_ACCOUNT.bank}, {PAYMENT_ACCOUNT.branch} branch ({PAYMENT_ACCOUNT.branchCode})
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-ink/70">Account name</dt>
                        <dd className="text-right font-medium">{PAYMENT_ACCOUNT.accountName}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-ink/70">Account type</dt>
                        <dd className="font-medium">{PAYMENT_ACCOUNT.accountType}</dd>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <dt className="shrink-0 text-ink/70">Account number</dt>
                        <dd className="flex items-center gap-2 font-medium tabular-nums">
                          {PAYMENT_ACCOUNT.accountNumber}
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(PAYMENT_ACCOUNT.accountNumber);
                                setAccountCopied(true);
                                window.setTimeout(() => setAccountCopied(false), 1800);
                              } catch {
                                /* clipboard refused; the number is printed beside it */
                              }
                            }}
                            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-ink/15 px-3 text-[11px] font-semibold uppercase tracking-widest text-ink/70 transition-colors hover:border-emerald-600 hover:text-emerald-700"
                          >
                            {accountCopied ? (
                              <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                            )}
                            {accountCopied ? 'Copied' : 'Copy'}
                          </button>
                        </dd>
                      </div>
                    </dl>
                    <p className="mt-3 border-t border-ink/10 pt-3 text-xs leading-relaxed text-ink/70">
                      {PAYMENT_ACCOUNT.referenceNote} Then send your proof of payment on
                      WhatsApp so we can match it to your booking.
                    </p>
                    <p className="mt-3 rounded-xl bg-emerald-50/70 px-4 py-3 text-xs leading-relaxed text-ink/75">
                      <span className="font-semibold text-emerald-800">Mobile wallet:</span>{' '}
                      {PAYMENT_ACCOUNT.walletNote}
                    </p>
                  </div>

                  <p className="flex items-start gap-3 text-sm leading-relaxed text-ink/65">
                    <CreditCard
                      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700"
                      aria-hidden="true"
                    />
                    <span>
                      Booking a single treatment? The live booking page can also take your
                      reservation with card payment at checkout:{' '}
                      <a
                        href={BOOKING_URL}
                        className="font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
                      >
                        open the booking page
                      </a>
                      .
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="mt-8 inline-flex min-h-[52px] items-center gap-2 rounded-full border border-ink/20 px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-ink/70 transition-colors hover:border-emerald-600 hover:text-emerald-700"
                >
                  I have paid, next
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </motion.div>
            ) : null}

            {step === 2 ? (
              <motion.div key="proof" {...panelMotion}>
                <div className="flex items-center justify-between gap-4">
                  <p className="eyebrow text-emerald-600">Send the proof of payment</p>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex min-h-[36px] items-center gap-1 text-xs font-semibold uppercase tracking-widest text-ink/70 transition-colors hover:text-emerald-600"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                    Back
                  </button>
                </div>

                <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink/70 text-pretty">
                  Attach the confirmation from your banking app, a screenshot or the PDF,
                  in the same chat the account details came from. Your reference{' '}
                  <code className="rounded bg-emerald-50 px-1.5 py-0.5 text-xs font-semibold tracking-[0.15em] text-emerald-800">
                    {reference || 'EMR-····'}
                  </code>{' '}
                  is already in the message.
                </p>

                <div className="mt-5 rounded-2xl border border-ink/10 bg-ground px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
                    What we check
                  </p>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink/70">
                    <li className="flex gap-2.5">
                      <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-600" />
                      The amount matches what you chose, to the dollar.
                    </li>
                    <li className="flex gap-2.5">
                      <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-600" />
                      Your reference appears on the payment, so nothing is matched by guesswork.
                    </li>
                    <li className="flex gap-2.5">
                      <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-600" />
                      The moment both line up, your voucher is generated and sent back to you.
                    </li>
                  </ul>
                </div>

                <div className="mt-6 space-y-4">
                  <a
                    href={waProofHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[64px] items-center justify-between gap-4 rounded-2xl bg-emerald-600 px-5 py-4 text-white transition-colors hover:bg-emerald-700"
                  >
                    <span className="flex items-center gap-3">
                      <ReceiptText className="h-5 w-5 shrink-0" aria-hidden="true" />
                      <span>
                        <span className="block text-sm font-semibold">
                          Send proof on WhatsApp
                        </span>
                        <span className="block text-xs text-white/75">
                          Then attach your payment confirmation in the chat
                        </span>
                      </span>
                    </span>
                    <ArrowUpRight className="h-5 w-5 shrink-0" aria-hidden="true" />
                  </a>

                  <a
                    href={mailProofHref}
                    className="flex min-h-[56px] items-center justify-between gap-4 rounded-2xl border border-ink/15 px-5 py-4 text-ink/80 transition-colors hover:border-emerald-600 hover:text-emerald-700"
                  >
                    <span className="flex items-center gap-3">
                      <Mail className="h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
                      <span className="text-sm font-semibold">
                        Or email it to {EMAILS.bookings}
                      </span>
                    </span>
                    <ArrowUpRight className="h-5 w-5 shrink-0" aria-hidden="true" />
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="mt-8 inline-flex min-h-[52px] items-center gap-2 rounded-full border border-ink/20 px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-ink/70 transition-colors hover:border-emerald-600 hover:text-emerald-700"
                >
                  Proof sent, next
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </motion.div>
            ) : null}

            {step === 3 ? (
              <motion.div key="voucher" {...panelMotion}>
                <p className="eyebrow text-emerald-600">Your voucher</p>
                <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6">
                  <p className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                    <BadgeCheck className="h-5 w-5" aria-hidden="true" />
                    We verify, you receive your voucher
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink/70 text-pretty">
                    The moment your payment matches your reference{' '}
                    <code className="rounded bg-ground px-1.5 py-0.5 text-xs font-semibold tracking-[0.15em] text-emerald-800">
                      {reference}
                    </code>
                    , we generate your voucher and send it straight back to you: the voucher
                    number, what it covers and its expiry. Bookings are then confirmed and
                    rescheduling stays free.
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink/70 text-pretty">
                    Most vouchers go out the same day during opening hours. If anything on
                    the payment needs a second look, we message you in the same chat first.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(null);
                    setCustomAmount('');
                    setStep(0);
                  }}
                  className="mt-8 inline-flex min-h-[52px] items-center gap-2 rounded-full border border-ink/15 px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-ink/70 transition-colors hover:border-emerald-600 hover:text-emerald-700"
                >
                  Pay for something else
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* Live summary rail */}
      <aside className="lg:col-span-5">
        <div className="sticky top-24 rounded-3xl border border-ink/10 surface-marble-pale p-6 md:p-8">
          <p className="eyebrow text-emerald-700">Your request</p>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-widest text-ink/70">
                Paying for
              </dt>
              <dd className="mt-1 font-semibold text-ink">
                {detailLine || 'Nothing chosen yet'}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-widest text-ink/70">
                Amount
              </dt>
              <dd className="mt-1 font-semibold tabular-nums text-ink">
                {amount !== null ? formatNad(amount) : '-'}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-widest text-ink/70">
                Reference
              </dt>
              <dd className="mt-1">
                <code className="rounded-lg bg-ground px-2.5 py-1 text-sm font-semibold tracking-[0.15em] text-emerald-800 shadow-sm">
                  {reference}
                </code>
              </dd>
            </div>
          </dl>
          <p className="mt-6 border-t border-ink/10 pt-5 text-xs leading-relaxed text-ink/70">
            Nothing is charged on this page. Payment happens between you and the spa, and
            the voucher is issued once your proof of payment is confirmed. Prefer to talk
            first? Call {site.phone}.
          </p>
        </div>
      </aside>
    </div>
  );
}
