import type { Metadata } from 'next';
import { FooterMinimal } from '@/components/FooterMinimal';
import { SiteHeader } from '@/components/SiteHeader';
import { site , SITE_URL} from '@/lib/site';

export const metadata: Metadata = {
  title: 'Brand',
  description:
    'The Emerald Spa & Wellness Centre design system: logo, colour, typography, motion, and image rules.',
  alternates: { canonical: '/brand' },
  openGraph: { url: `${SITE_URL}/brand` },
};

const EMERALD = [
  { name: 'Emerald 900', hex: '#063D2F', use: 'Deep ground, footer, inverted sections' },
  { name: 'Emerald 800', hex: '#063F31', use: 'Theme colour, dark surfaces' },
  { name: 'Emerald 700', hex: '#07503D', use: 'Price text, dense small type' },
  { name: 'Emerald 600', hex: '#0A5A45', use: 'Primary action, logo dot, links' },
  { name: 'Emerald 500', hex: '#087452', use: 'Focus ring, selection, accents' },
  { name: 'Emerald 300', hex: '#75E0BA', use: 'Eyebrow text on dark ground' },
];

const GOLD = [
  { name: 'Gold 200', hex: '#FFE18A', use: 'Hover state on dark ground' },
  { name: 'Gold 300', hex: '#F2C35E', use: 'Rating stars' },
  { name: 'Gold 500', hex: '#C77B36', use: 'Small metallic detail' },
  { name: 'Gold 700', hex: '#7B3D20', use: 'Deepest ring shadow in the mark' },
];

const NEUTRAL = [
  { name: 'Ground', hex: '#F7F5F1', use: 'Page background' },
  { name: 'Ink', hex: '#07211A', use: 'All body text' },
];

function Swatch({ hex, name, use }: { hex: string; name: string; use: string }) {
  return (
    <li className="border-t border-ink/15 pt-4">
      <div
        className="h-20 w-full"
        style={{ backgroundColor: hex }}
        aria-hidden="true"
      />
      <p className="mt-3 text-sm font-semibold text-ink">{name}</p>
      <p className="font-mono text-xs uppercase text-ink/65">{hex}</p>
      <p className="mt-1 text-xs text-ink/65">{use}</p>
    </li>
  );
}

export default function BrandPage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="shell border-b border-ink/10 py-16 md:py-24">
          <p className="eyebrow text-emerald-600">Design System</p>
          <h1 className="display mt-4 max-w-4xl text-4xl text-balance sm:text-5xl md:text-6xl">
            The Emerald brand.
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-ink/70 text-pretty">
            Every colour on this page is sampled directly from the supplied logo artwork. The
            layout framework follows the structural approach used by COLLINS: a serif display
            voice, a neutral grotesk for interface text, an off-white ground, and a single
            saturated signal colour.
          </p>
        </section>

        <section className="shell border-b border-ink/10 py-16">
          <h2 className="display text-3xl">The mark</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            <div className="flex items-center justify-center bg-ground p-8 ring-1 ring-ink/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/symbol-photoreal.png"
                alt="Emerald Spa symbol: faceted emerald gemstone inside rose gold orbital rings"
                width={400}
                height={293}
                loading="lazy"
                decoding="async"
                className="h-40 w-auto"
              />
            </div>
            <div className="flex items-center justify-center bg-emerald-900 p-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/lockup-stacked-dark.png"
                alt="Emerald Spa stacked lockup with cream wordmark, for dark backgrounds"
                width={800}
                height={614}
                loading="lazy"
                decoding="async"
                className="h-40 w-auto"
              />
            </div>
            <div className="flex items-center justify-center bg-ground p-8 ring-1 ring-ink/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/lockup-horizontal-light.png"
                alt="Emerald Spa horizontal lockup, for light backgrounds"
                width={640}
                height={154}
                loading="lazy"
                decoding="async"
                className="w-full"
              />
            </div>
          </div>
          <p className="mt-6 max-w-2xl text-sm text-ink/65">
            These are the client&apos;s real artwork, supplied as a logo package: a
            photoreal transparent PNG for featured placements and traced SVGs for small
            sizes. Never stretch the mark non-uniformly, never redraw it, and never
            recolour the gemstone. Keep clear space of at least half the symbol height
            on every side.
          </p>
        </section>

        <section className="shell border-b border-ink/10 py-16">
          <h2 className="display text-3xl">Colour</h2>
          <h3 className="eyebrow mt-8 text-emerald-600">Emerald, from the gemstone facets</h3>
          <ul className="mt-4 grid gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {EMERALD.map((c) => (
              <Swatch key={c.hex} {...c} />
            ))}
          </ul>

          <h3 className="eyebrow mt-12 text-emerald-600">Rose gold, from the orbital rings</h3>
          <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {GOLD.map((c) => (
              <Swatch key={c.hex} {...c} />
            ))}
          </ul>

          <h3 className="eyebrow mt-12 text-emerald-600">Ground and ink</h3>
          <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {NEUTRAL.map((c) => (
              <Swatch key={c.hex} {...c} />
            ))}
          </ul>
        </section>

        <section className="shell border-b border-ink/10 py-16">
          <h2 className="display text-3xl">Typography</h2>
          <div className="mt-8 grid gap-12 md:grid-cols-2">
            <div>
              <p className="eyebrow text-emerald-600">Display: Fraunces</p>
              <p className="display mt-4 text-5xl">Restore Balance Glow</p>
              <p className="mt-4 text-sm text-ink/65">
                Used for every heading. Line height 0.92, letter spacing minus 0.022em. The
                soft optical axis carries the warmth of the gemstone without decoration.
              </p>
            </div>
            <div>
              <p className="eyebrow text-emerald-600">Interface: Inter</p>
              <p className="mt-4 text-2xl">Massages, facials, hydrotherapy, nails</p>
              <p className="mt-4 text-sm text-ink/65">
                Used for body copy, navigation, prices, and all interface text. Eyebrow labels
                run uppercase at 0.6875rem with 0.18em tracking.
              </p>
            </div>
          </div>
        </section>

        <section className="shell border-b border-ink/10 py-16">
          <h2 className="display text-3xl">Motion</h2>
          <dl className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-sm font-semibold text-ink">Purpose</dt>
              <dd className="mt-2 text-sm text-ink/65">
                Motion signals reading order on first paint and on scroll entry. It never
                carries meaning on its own, so removing it costs nothing.
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-ink">Hierarchy</dt>
              <dd className="mt-2 text-sm text-ink/65">
                Headings clip-reveal from a masked wrapper. Supporting content fades up 28px.
                Images scale to 1.03 on hover. Nothing else moves.
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-ink">Timing</dt>
              <dd className="mt-2 text-sm text-ink/65">
                0.28s for interface response, 0.6s for entrances, 0.7s for heading reveals.
                Nothing exceeds 0.9s. Stagger caps at 0.14s per item.
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-ink">Easing</dt>
              <dd className="mt-2 font-mono text-xs text-ink/65">
                cubic-bezier(0.22, 1, 0.36, 1) for entrances
                <br />
                cubic-bezier(0.19, 1, 0.22, 1) for hover transforms
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-ink">Frequency gate</dt>
              <dd className="mt-2 text-sm text-ink/65">
                Every scroll entrance runs once and never replays on scroll-back. No autoplaying
                carousel, no looping decorative animation, no parallax.
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-ink">Reduced motion</dt>
              <dd className="mt-2 text-sm text-ink/65">
                Under prefers-reduced-motion every element renders in its final state with no
                transform, and the global CSS collapses all durations to near zero.
              </dd>
            </div>
          </dl>
        </section>

        <section className="shell py-16">
          <h2 className="display text-3xl">Imagery</h2>
          <p className="mt-6 max-w-2xl text-ink/70 text-pretty">
            Only real photographs of {site.legalName} appear on this site. They are honest
            captures of the actual rooms rather than staged stock photography, so the layout
            gives them room and lets typography carry the polish. Every image ships as AVIF and
            WebP with a JPEG fallback, at four widths, with dimensions declared to prevent
            layout shift.
          </p>
        </section>
      </main>
      <FooterMinimal />
    </>
  );
}
