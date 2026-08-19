import type { Metadata } from 'next';
import { FooterMinimal } from '@/components/FooterMinimal';
import { SiteHeader } from '@/components/SiteHeader';
import { WHATSAPP_URL, site , SITE_URL} from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Notice',
  description:
    'How Emerald Spa & Wellness Centre handles personal information collected through this website.',
  alternates: { canonical: '/privacy' },
  openGraph: { url: `${SITE_URL}/privacy` },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="shell border-b border-ink/10 py-16 md:py-24">
          <p className="eyebrow text-emerald-600">Legal</p>
          <h1 className="display mt-4 text-4xl sm:text-5xl md:text-6xl">Privacy Notice</h1>
        </section>

        <section className="shell max-w-3xl py-16 md:py-20">
          <div className="space-y-10 text-ink/80">
            <div>
              <h2 className="display text-2xl text-ink">What this site collects</h2>
              <p className="mt-3 leading-relaxed">
                This website does not run advertising trackers, does not set marketing
                cookies, and does not ask you to create an account. There is no contact form
                and no newsletter signup, so the site itself does not collect or store
                personal information about you.
              </p>
            </div>

            <div>
              <h2 className="display text-2xl text-ink">Booking through Fresha</h2>
              <p className="mt-3 leading-relaxed">
                Every booking link on this site sends you to Fresha, the booking platform we
                use. Once you are on Fresha, their privacy terms apply to the information you
                give them, including your name, contact details, and appointment history. We
                receive your booking details from Fresha so we can prepare for your visit.
              </p>
            </div>

            <div>
              <h2 className="display text-2xl text-ink">Contacting us directly</h2>
              <p className="mt-3 leading-relaxed">
                If you phone or message us on WhatsApp, we keep what you send so we can answer
                and manage your appointment. We do not sell it and we do not pass it to anyone
                who is not involved in delivering your treatment.
              </p>
            </div>

            <div>
              <h2 className="display text-2xl text-ink">Hosting and logs</h2>
              <p className="mt-3 leading-relaxed">
                The site is hosted on Vercel. Like most hosting providers, Vercel records
                standard technical request logs such as IP address and browser type for
                security and reliability. We do not use these logs to identify individuals.
              </p>
            </div>

            <div>
              <h2 className="display text-2xl text-ink">Your choices</h2>
              <p className="mt-3 leading-relaxed">
                You can ask us what information we hold about you, ask us to correct it, or ask
                us to delete it. Call{' '}
                <a href={`tel:${site.phoneE164}`} className="text-emerald-700 underline">
                  {site.phone}
                </a>{' '}
                or message us on{' '}
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 underline"
                >
                  WhatsApp
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="display text-2xl text-ink">Contact</h2>
              <address className="mt-3 not-italic leading-relaxed">
                {site.legalName}
                <br />
                {site.address.street}
                <br />
                {site.address.suburb}, {site.address.city}
                <br />
                {site.address.region}, Namibia
              </address>
            </div>
          </div>
        </section>
      </main>
      <FooterMinimal />
    </>
  );
}
