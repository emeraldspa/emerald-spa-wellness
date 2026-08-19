import type { Metadata } from 'next';
import { Phone } from 'lucide-react';
import { FooterMinimal } from '@/components/FooterMinimal';
import { SiteHeader } from '@/components/SiteHeader';
import { VoucherForm } from '@/components/VoucherForm';
import { ClipReveal, FadeUp } from '@/components/motion';
import { EMAILS, site , SITE_URL} from '@/lib/site';

export const metadata: Metadata = {
  title: 'Gift Vouchers',
  description:
    'Buy a gift voucher for Emerald Spa & Wellness Centre in Windhoek. Choose a value, tell us the occasion, and we send the voucher number and expiry date back to you.',
  alternates: { canonical: '/vouchers' },
  openGraph: { url: `${SITE_URL}/vouchers` },
};

export default function VouchersPage() {
  return (
    <>
      <SiteHeader />
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
