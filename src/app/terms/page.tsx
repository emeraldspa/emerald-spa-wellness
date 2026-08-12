import type { Metadata } from 'next';
import { FooterMinimal } from '@/components/FooterMinimal';
import { SiteHeader } from '@/components/SiteHeader';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description:
    'Terms covering the use of the Emerald Spa & Wellness Centre website, including pricing and booking.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="shell border-b border-ink/10 py-16 md:py-24">
          <p className="eyebrow text-emerald-600">Legal</p>
          <h1 className="display mt-4 text-4xl sm:text-5xl md:text-6xl">Terms of Use</h1>
        </section>

        <section className="shell max-w-3xl py-16 md:py-20">
          <div className="space-y-10 text-ink/80">
            <div>
              <h2 className="display text-2xl text-ink">About this website</h2>
              <p className="mt-3 leading-relaxed">
                This site describes the treatments offered by {site.legalName} at{' '}
                {site.address.street} {site.address.suite}, {site.address.suburb}, Windhoek.
                It is provided for information and for booking.
              </p>
            </div>

            <div>
              <h2 className="display text-2xl text-ink">Prices and treatments</h2>
              <p className="mt-3 leading-relaxed">
                Prices shown are the listings published on our online booking system at the
                time this site was built. Prices, durations, and availability can change. The price
                confirmed at the time of booking is the price that applies.
              </p>
            </div>

            <div>
              <h2 className="display text-2xl text-ink">Bookings and cancellations</h2>
              <p className="mt-3 leading-relaxed">
                Bookings are handled by Fresha, and the cancellation and rescheduling terms
                shown during checkout apply to your appointment. If you need to change a
                booking, contact us on {site.phone} as early as you can.
              </p>
            </div>

            <div>
              <h2 className="display text-2xl text-ink">Health and suitability</h2>
              <p className="mt-3 leading-relaxed">
                Nothing on this site is medical advice. Some treatments are not suitable during
                pregnancy or with certain skin and health conditions. Tell your therapist about
                any condition, allergy, medication, or injury before your treatment begins so we
                can adapt or recommend an alternative.
              </p>
            </div>

            <div>
              <h2 className="display text-2xl text-ink">Reviews shown on this site</h2>
              <p className="mt-3 leading-relaxed">
                Guest reviews and the overall rating shown on this site are taken from our
                verified booking record and are reproduced as written by the guest. We do not
                edit them.
              </p>
            </div>

            <div>
              <h2 className="display text-2xl text-ink">Content ownership</h2>
              <p className="mt-3 leading-relaxed">
                The Emerald name, logo, photographs, and written content on this site belong to{' '}
                {site.legalName}. Do not reuse them commercially without written permission.
              </p>
            </div>

            <div>
              <h2 className="display text-2xl text-ink">Governing law</h2>
              <p className="mt-3 leading-relaxed">
                These terms are governed by the laws of the Republic of Namibia.
              </p>
            </div>
          </div>
        </section>
      </main>
      <FooterMinimal />
    </>
  );
}
