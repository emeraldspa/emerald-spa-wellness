import type { Metadata } from 'next';
import { Clock, Phone } from 'lucide-react';
import { FooterMinimal } from '@/components/FooterMinimal';
import { SiteHeader } from '@/components/SiteHeader';
import { PageHero } from '@/components/PageHero';
import { WhatsAppFlow } from '@/components/WhatsAppFlow';
import { ClipReveal } from '@/components/motion';
import { site , SITE_URL, ogFor } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Book on WhatsApp',
  description: `Message Emerald Spa & Wellness Centre on WhatsApp. Pick what you need and open a chat with your message ready to send. Windhoek West, ${site.phone}.`,
  alternates: { canonical: '/whatsapp' },
  openGraph: ogFor('/whatsapp'),
};

export default function WhatsAppPage() {
  const categories = site.categories
    .filter((c) => !['refreshments', 'add-on-services', 'promotions'].includes(c.slug))
    .map((c) => c.name);

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long' });
  const todayHours = site.hours.find((h) => h.day === today);

  return (
    <>
      <SiteHeader />
      <main id="main">
        <PageHero
          slug="welcome-drink"
          eyebrow="WhatsApp"
          title="Message us and we reply."
          lede="Three taps builds your message. The last one opens WhatsApp with it already typed, so you go straight into a real conversation with the spa."
        />
        <div className="relative z-10 mx-auto -mt-8 flex max-w-3xl flex-wrap gap-x-8 gap-y-3 rounded-2xl bg-ground/90 px-5 py-4 text-sm text-ink/80 shadow-sm backdrop-blur sm:px-8 md:px-12">
            <a
              href={`tel:${site.phoneE164}`}
              className="flex items-center gap-2 transition-colors hover:text-emerald-600"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {site.phone}
            </a>
            {todayHours ? (
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" aria-hidden="true" />
                {todayHours.closed ? `Closed ${today}` : `Open today ${todayHours.value}`}
              </span>
            ) : null}
          </div>

        <section className="surface-clay border-t border-ink/10 py-16 md:py-20">
          <WhatsAppFlow categories={categories} />
        </section>
      </main>
      <FooterMinimal />
    </>
  );
}
