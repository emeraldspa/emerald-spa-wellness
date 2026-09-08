import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, CreditCard, Phone } from 'lucide-react';
import { FooterMinimal } from '@/components/FooterMinimal';
import { VoucherForm } from '@/components/VoucherForm';
import { ClipReveal, FadeUp } from '@/components/motion';
import { EMAILS, PAYMENT_ACCOUNT, PAY_PATH, site , SITE_URL, ogFor } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Gift Vouchers',
  description:
    'Buy a gift voucher for Emerald Spa & Wellness Centre in Windhoek. Choose a value, tell us the occasion, and we send the voucher number and expiry date back to you.',
  alternates: { canonical: '/vouchers' },
  ...ogFor('/vouchers'),
};

export default function VouchersPage() {
  return (
    <>
            <main id="main">
        {/* Marble panel so the voucher page has a surface of its own. */}
        <section className="surface-marble-emerald relative">
          <div aria-hidden="true" className="absolute inset-0 bg-emerald-900/55" />
          <div className="shell relative py-20 text-ground md:py-28">
            <p className="eyebrow text-emerald-100">Gift vouchers</p>
            <h1 className="display mt-4 max-w-3xl text-4xl text-balance sm:text-5xl md:text-6xl">
              <ClipReveal>Give someone an afternoon off.</ClipReveal>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ground/85 text-pretty">
              A voucher can be spent on anything on the menu, from a thirty minute massage to a
              package for two. Choose a value below and we take it from there.
            </p>
          </div>
        </section>

        <section className="shell py-16 md:py-24">
          <FadeUp>
            <VoucherForm />
          </FadeUp>

          {/* The account card (client published the details 7 Sep): a guest
              who wants to pay immediately can do it without waiting for a
              reply. The same card appears on the pay flow. */}
          <FadeUp delay={0.05}>
            <div className="mt-8 grid gap-6 rounded-2xl border border-ink/15 bg-ground p-6 sm:grid-cols-2 sm:p-8">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <CreditCard className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                  Paying by bank transfer (EFT)
                </p>
                <dl className="mt-4 space-y-1.5 text-sm text-ink/75">
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink/70">Bank</dt>
                    <dd className="text-right font-medium">
                      {PAYMENT_ACCOUNT.bank}, {PAYMENT_ACCOUNT.branch} branch
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
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink/70">Account number</dt>
                    <dd className="font-medium tabular-nums">{PAYMENT_ACCOUNT.accountNumber}</dd>
                  </div>
                </dl>
                <p className="mt-3 text-xs leading-relaxed text-ink/70">
                  {PAYMENT_ACCOUNT.referenceNote}
                </p>
              </div>
              <div className="flex flex-col justify-between gap-4 border-t border-ink/10 pt-5 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                <p className="rounded-xl bg-emerald-50/70 px-4 py-3 text-xs leading-relaxed text-ink/75">
                  <span className="font-semibold text-emerald-800">Mobile wallet:</span>{' '}
                  {PAYMENT_ACCOUNT.walletNote}
                </p>
                <p className="text-xs leading-relaxed text-ink/70">
                  Send your proof of payment in the same WhatsApp conversation where you
                  ordered the voucher, and staff confirm and issue the voucher number.
                </p>
                <Link
                  href={PAY_PATH}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 self-start rounded-full border border-emerald-700/40 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-emerald-800 transition-colors hover:border-emerald-700 hover:bg-emerald-50"
                >
                  Book &amp; pay now
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </FadeUp>

          {/* The faster sibling of the enquiry: pay now, send proof, get the
              voucher. Some guests want the whole thing done in one sitting. */}
          <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-ink/75">
              <span className="font-semibold text-ink">In a hurry?</span> Choose the
              amount, pay straight away and send the proof of payment: your voucher comes
              back the same day, with its number and expiry date.
            </p>
            <Link
              href={PAY_PATH}
              className="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-emerald-700 sm:ml-6"
            >
              Pay &amp; get the voucher
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="surface-marble-pale border-t border-ink/10 py-16 md:py-20">
          <div className="shell grid gap-10 md:grid-cols-3">
            <div>
              <h2 className="display text-2xl">How it works</h2>
            </div>
            <ol className="md:col-span-2 space-y-6">
              <li className="border-t border-ink/15 pt-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
                  Step one
                </p>
                <p className="mt-2 text-ink/75 text-pretty">
                  Choose the value and occasion above, then send the message on WhatsApp or by
                  email. Nothing is charged on this page.
                </p>
              </li>
              <li className="border-t border-ink/15 pt-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
                  Step two
                </p>
                <p className="mt-2 text-ink/75 text-pretty">
                  A member of staff confirms the amount with you and arranges payment.
                </p>
              </li>
              <li className="border-t border-ink/15 pt-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
                  Step three
                </p>
                <p className="mt-2 text-ink/75 text-pretty">
                  You receive the voucher number and its expiry date, ready to pass on. The
                  recipient books the treatment they want.
                </p>
              </li>
            </ol>
          </div>
        </section>

        <section className="shell py-16 md:py-20">
          <h2 className="display text-2xl sm:text-3xl">Prefer to speak to someone?</h2>
          <div className="contact-list mt-6 flex flex-wrap gap-x-8 gap-y-3">
            <a
              href={`tel:${site.phone.replace(/\s/g, '')}`}
              className="flex items-center gap-2 text-ink/80 transition-colors hover:text-emerald-700"
            >
              <Phone className="h-4 w-4 text-emerald-700" aria-hidden="true" />
              {site.phone}
            </a>
            <a
              href={`mailto:${EMAILS.bookings}`}
              className="text-ink/80 transition-colors hover:text-emerald-700"
            >
              {EMAILS.bookings}
            </a>
          </div>
        </section>
      </main>
      <FooterMinimal />
    </>
  );
}
