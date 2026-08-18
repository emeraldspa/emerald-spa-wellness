'use client';

import { ArrowUpRight, Check, Mail } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import {
  EMAILS,
  VOUCHER_AMOUNTS,
  VOUCHER_OCCASIONS,
  WHATSAPP_NUMBER,
  formatNad,
  site,
} from '@/lib/site';

/**
 * Voucher order builder.
 *
 * This is an enquiry, not a checkout. No card is taken, nothing is stored and
 * nothing is submitted to a server: the selections compose a message that the
 * visitor sends themselves over WhatsApp, or by email if they prefer. Staff
 * confirm payment and then issue the voucher number and expiry by hand, which
 * is how the spa already runs vouchers.
 *
 * Recipient and sender names are optional. Asking for them up front makes the
 * message useful immediately, but an empty field must never block the send.
 */
export function VoucherForm({ compact = false }: { compact?: boolean }) {
  const [amount, setAmount] = useState<number | 'other'>(500);
  const [custom, setCustom] = useState('');
  const [occasion, setOccasion] = useState<string>(VOUCHER_OCCASIONS[0]);
  const [recipient, setRecipient] = useState('');
  const [sender, setSender] = useState('');

  const amountId = useId();
  const recipientId = useId();
  const senderId = useId();

  const value = amount === 'other' ? custom.trim() : String(amount);

  const message = useMemo(() => {
    const parts: string[] = [`Hello ${site.legalName}. I would like to buy a gift voucher.`];
    if (value) {
      const asNumber = Number(value);
      parts.push(
        `Value: ${Number.isFinite(asNumber) && asNumber > 0 ? formatNad(asNumber) : `NAD ${value}`}.`,
      );
    }
    parts.push(`Occasion: ${occasion}.`);
    if (recipient.trim()) parts.push(`For: ${recipient.trim()}.`);
    if (sender.trim()) parts.push(`From: ${sender.trim()}.`);
    parts.push('Please let me know how to pay and how I will receive the voucher.');
    return parts.join(' ');
  }, [value, occasion, recipient, sender]);

  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  const mailHref = `mailto:${EMAILS.bookings}?subject=${encodeURIComponent(
    'Gift voucher order',
  )}&body=${encodeURIComponent(message)}`;

  return (
    <div className={compact ? '' : 'grid gap-10 md:grid-cols-2'}>
      <div>
        <fieldset>
          <legend className="eyebrow text-emerald-700">1. Voucher value</legend>
          <div className="mt-4 flex flex-wrap gap-2">
            {VOUCHER_AMOUNTS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAmount(a)}
                aria-pressed={amount === a}
                className={`min-h-[44px] rounded-full border px-4 text-sm transition-colors ${
                  amount === a
                    ? 'border-emerald-700 bg-emerald-700 text-white'
                    : 'border-ink/20 text-ink/80 hover:border-emerald-600'
                }`}
              >
                {formatNad(a)}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setAmount('other')}
              aria-pressed={amount === 'other'}
              className={`min-h-[44px] rounded-full border px-4 text-sm transition-colors ${
                amount === 'other'
                  ? 'border-emerald-700 bg-emerald-700 text-white'
                  : 'border-ink/20 text-ink/80 hover:border-emerald-600'
              }`}
            >
              Other
            </button>
          </div>

          {amount === 'other' ? (
            <div className="mt-4">
              <label htmlFor={amountId} className="text-sm text-ink/70">
                Amount in Namibian dollars
              </label>
              <input
                id={amountId}
                type="number"
                min={1}
                inputMode="numeric"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder="750"
                className="mt-2 w-full border border-ink/20 bg-ground px-4 py-3 text-ink outline-none focus:border-emerald-600"
              />
            </div>
          ) : null}
        </fieldset>

        <fieldset className="mt-8">
          <legend className="eyebrow text-emerald-700">2. Occasion</legend>
          <div className="mt-4 flex flex-wrap gap-2">
            {VOUCHER_OCCASIONS.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => setOccasion(o)}
                aria-pressed={occasion === o}
                className={`min-h-[44px] rounded-full border px-4 text-sm transition-colors ${
                  occasion === o
                    ? 'border-emerald-700 bg-emerald-700 text-white'
                    : 'border-ink/20 text-ink/80 hover:border-emerald-600'
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-8">
          <legend className="eyebrow text-emerald-700">3. Names, optional</legend>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={recipientId} className="text-sm text-ink/70">
                Who is it for
              </label>
              <input
                id={recipientId}
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="mt-2 w-full border border-ink/20 bg-ground px-4 py-3 text-ink outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label htmlFor={senderId} className="text-sm text-ink/70">
                Who is it from
              </label>
              <input
                id={senderId}
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="mt-2 w-full border border-ink/20 bg-ground px-4 py-3 text-ink outline-none focus:border-emerald-600"
              />
            </div>
          </div>
        </fieldset>
      </div>

      <div className={compact ? 'mt-8' : ''}>
        <div className="border border-ink/15 bg-ground/70 p-6">
          <p className="eyebrow text-emerald-700">Your message</p>
          <p
            aria-live="polite"
            className="mt-4 rounded-2xl rounded-bl-sm bg-[#DCF8C6] p-4 text-sm leading-relaxed text-[#07211A]"
          >
            {message}
          </p>

          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-4 text-sm font-semibold uppercase tracking-widest text-[#07211A] transition-transform hover:scale-[1.02]"
          >
            Order on WhatsApp
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>

          <a
            href={mailHref}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-ink/20 px-6 py-4 text-sm font-semibold uppercase tracking-widest text-ink transition-colors hover:border-emerald-600 hover:text-emerald-700"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Order by email
          </a>

          <ul className="mt-6 space-y-2 border-t border-ink/10 pt-5 text-sm text-ink/70">
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
              Staff confirm payment, then send the voucher number and expiry date
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
              Redeemable against any treatment on the menu
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
              Nothing is charged on this page and nothing is stored
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
