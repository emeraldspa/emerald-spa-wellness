import type { Metadata } from 'next';
import { Clock, Phone } from 'lucide-react';
import { FooterMinimal } from '@/components/FooterMinimal';
import { SiteHeader } from '@/components/SiteHeader';
import { WhatsAppFlow } from '@/components/WhatsAppFlow';
import { ClipReveal } from '@/components/motion';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Book on WhatsApp',
  description: `Message Emerald Spa & Wellness Centre on WhatsApp. Pick what you need and open a chat with your message ready to send. Windhoek West, ${site.phone}.`,
  alternates: { canonical: '/whatsapp' },
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
        <section className="shell border-b border-ink/10 py-16 md:py-24">
          <p className="eyebrow text-emerald-600">WhatsApp</p>
          <h1 className="display mt-4 max-w-4xl text-4xl text-balance sm:text-5xl md:text-6xl">
            <ClipReveal>Message us and we reply.</ClipReveal>
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-ink/70 text-pretty">
            Three taps builds your message. The last one opens WhatsApp with it already typed,
            so you go straight into a real conversation with the spa.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink/70">
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
        </section>

        <section className="shell py-16 md:py-20">
          <WhatsAppFlow categories={categories} />
        </section>
      </main>
      <FooterMinimal />
    </>
  );
}
