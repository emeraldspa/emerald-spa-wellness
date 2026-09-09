import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, BadgeCheck, ReceiptText, Wallet } from 'lucide-react';
import { FooterMinimal } from '@/components/FooterMinimal';
import { PageHero } from '@/components/PageHero';
import { PayFlow, type PayOption } from '@/components/PayFlow';
import { ClipReveal, FadeUp } from '@/components/motion';
import { BOOKING_URL, site, ogFor } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Book & Pay',
  description:
    'Choose your treatment or package, pay straight away, send the proof of payment and receive your voucher. Emerald Spa & Wellness Centre, Windhoek North.',
  alternates: { canonical: '/pay' },
  ...ogFor('/pay'),
};

/**
 * Book-and-pay route.
 *
 * The client's flow, made visible: choose, pay straight away, send the proof
 * of payment, get the voucher. Prices come from the same menu the live
 * calendar uses, so the amount a guest pays here is the amount they would pay
 * at the desk.
 */
export default function PayPage() {
  const promotions = site.categories.find((c) => c.slug === 'promotions');

  const packages: PayOption[] = (promotions?.items ?? [])
    .filter((s) => (s.priceValue ?? 0) >= 1000)
    .map((s) => ({
      id: `p-${s.name}`,
      label: s.name,
      amount: s.priceValue as number,
      note: s.duration ?? undefined,
    }));

  const treatments = site.categories
    .filter((c) => !['promotions', 'refreshments'].includes(c.slug))
    .map((c) => ({
      category: c.name,
      items: c.items
        .filter((s) => s.priceValue !== null)
        .map((s, i) => ({
          // Two treatments can share a name (nails has two "Foot scrub &
          // pedicure" services at different prices), so the index keeps the
          // option ids unique and React's key warning honest.
          id: `t-${c.slug}-${i}-${s.name}`,
          label: s.name,
          amount: s.priceValue as number,
          note: s.duration ?? undefined,
        })),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <main id="main">
        <PageHero
          slug="spa-retreat"
          eyebrow="Book & Pay"
          title="Choose, pay, done."
          lede="Book your treatment or package and pay straight away. Send us the proof of payment and your voucher comes straight back, usually the same day."
        />

        {/* The four beats of the flow, so the guest knows the shape before
            they start. */}
        <section className="shell border-b border-ink/10 py-10 md:py-14">
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Wallet,
                title: 'Choose',
                body: 'A package, any treatment on the menu, or your own amount.',
              },
              {
                icon: ReceiptText,
                title: 'Pay straight away',
                body: 'The account details are right there: FNB, Maerua Mall. Pay from your banking app and use your full name as the reference.',
              },
              {
                icon: BadgeCheck,
                title: 'Send the proof',
                body: 'One tap opens WhatsApp with your reference already in the message.',
              },
              {
                icon: ArrowUpRight,
                title: 'Get the voucher',
                body: 'We verify the payment and send your voucher back in the same chat.',
              },
            ].map((s, i) => (
              <FadeUp key={s.title} delay={i * 0.06} as="li">
                <div className="flex h-full flex-col gap-3 rounded-2xl border border-ink/10 bg-ground p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <s.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
                    Step {i + 1}
                  </p>
                  <h2 className="display text-xl">{s.title}</h2>
                  <p className="text-sm leading-relaxed text-ink/65 text-pretty">{s.body}</p>
                </div>
              </FadeUp>
            ))}
          </ol>
        </section>

        <section className="shell py-14 md:py-20">
          <PayFlow packages={packages} treatments={treatments} />
        </section>

        <section className="surface-marble-pale border-t border-ink/10 py-14 md:py-20">
          <div className="shell grid gap-10 md:grid-cols-3">
            <div>
              <h2 className="display text-2xl sm:text-3xl">
                <ClipReveal>Questions, answered first.</ClipReveal>
              </h2>
            </div>
            <div className="md:col-span-2 space-y-8">
              <div className="border-t border-ink/15 pt-5">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
                  Can I pay by card instead?
                </h3>
                <p className="mt-2 text-ink/75 text-pretty">
                  Yes. Single treatments can be booked and paid on the{' '}
                  <a
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
                  >
                    live booking page
                  </a>
                  , which takes card payment at checkout. Packages and custom amounts run
                  through this page.
                </p>
              </div>
              <div className="border-t border-ink/15 pt-5">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
                  What if my plans change?
                </h3>
                <p className="mt-2 text-ink/75 text-pretty">
                  Rescheduling is free. Message the same chat your payment went through and
                  we move your appointment. Vouchers carry their own expiry date, printed
                  on the voucher itself.
                </p>
              </div>
              <div className="border-t border-ink/15 pt-5">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
                  Buying for someone else?
                </h3>
                <p className="mt-2 text-ink/75 text-pretty">
                  The voucher works as a gift. Choose the amount here, or see the occasions
                  on the{' '}
                  <Link
                    href="/vouchers"
                    className="font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
                  >
                    gift voucher page
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <FooterMinimal />
    </>
  );
}
