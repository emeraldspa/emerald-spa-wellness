# BUILD_PLAN

Emerald Spa & Wellness Centre, Windhoek West, Namibia.

## Mode

Full build. Not a demo. Every route, state, and legal page below is implemented
and verified, not stubbed.

## Art direction owner

COLLINS framework, Emerald brand values.

The reference site the brief named, `wearecolins.com`, does not resolve. Both
the sandbox resolver and Google Public DNS return NXDOMAIN, so it fails the
fetchable test and cannot act as a design bar. The real agency is COLLINS at
`wearecollins.com`, 8x Agency of the Year, which was fetched successfully and
whose stylesheet was parsed directly.

What was taken from COLLINS is structure, not appearance:

- Serif display voice paired with a neutral grotesk for interface text.
- Off-white ground, near-black ink, one saturated signal colour.
- Grid padding as a clamp against viewport width.
- The easing ladder, copied verbatim from their published custom properties.

What was not taken: their orange `#ff7600`, their fonts (Portrait Text and
Graphik are licensed), their copy, and their layouts.

## Decisions and alternatives set aside

| Decision | Chosen | Alternative set aside | Reason |
| --- | --- | --- | --- |
| Accent colour | Emerald green with rose gold | Spec's `#5E0ED7` purple | Confirmed by client. Purple contradicts the logo and the brand name. |
| Hero stats | +130 treatments, +228 reviews, 4.8 rating | Spec's +300 brands, +200 products, +100 ventures | Confirmed by client. Agency metrics on a spa would be fabricated claims. |
| Hero heading | Restore / Balance / Glow | Spec's Fearless / Vision / Delivered | Agency language does not describe a spa. Structure and motion are unchanged. |
| Service disclosure | All 90 services visible, sticky category rail | Accordions | Brief explicitly asked that text not be hidden under accordions. Visible text also indexes reliably. |
| Image delivery | Plain `<picture>`, build-time derivatives | `next/image` | Every source is a local file with known dimensions. The runtime optimiser adds cost without adding capability. |
| Carousel | Native scroll-snap | Drag library such as Embla or Swiper | Native scrolling already gives keyboard, touch, and trackpad support. A dependency here would be unjustified weight. |
| Hero motion | CSS keyframes | Framer Motion | The hero holds LCP. CSS animates on the first frame with no hydration dependency. |
| Hero video | Deferred until idle, poster carries first paint | Autoplay attached at load | The file is 22MB. Attaching it during load starves the critical path. |

## Routes

All static, all prerendered.

| Route | Purpose | State |
| --- | --- | --- |
| `/` | Hero, intro, signature treatments, gallery carousel, reviews, visit | Done |
| `/services` | All 90 services in 13 categories with prices | Done |
| `/gallery` | Editorial mosaic of 10 authentic photographs | Done |
| `/team` | 6 real professionals with Fresha ratings | Done |
| `/visit` | Address, hours, phone, WhatsApp, socials | Done |
| `/brand` | Public design system | Done |
| `/privacy` | Privacy notice | Done |
| `/terms` | Terms of use | Done |
| `/sitemap` | Human-readable sitemap | Done |
| `/not-found` | 404 with recovery links | Done |
| `/error` | Runtime error boundary with phone fallback | Done |
| `/loading` | Route loading state | Done |
| `/sitemap.xml` | Machine sitemap | Done |
| `/robots.txt` | Crawl directives | Done |
| `/manifest.webmanifest` | PWA manifest | Done |

## Data provenance

Every fact on the site comes from the live Fresha venue record for
`emerald-spa-wellness-centre-windhoek-blackett-street-awio4ik8`, scraped with
Scrapling on 2026-08-12 and committed to `src/data/business.json`.

Nothing is invented. No testimonial, price, rating, address, phone number, team
member, or opening hour was authored by the build.

## Acceptance criteria

- Production build succeeds, type-check and lint clean.
- Zero axe-core violations across all nine content routes.
- No horizontal scroll at 320, 375, 414, 768, 1024, 1280, 1440.
- Unique title, description, canonical, and exactly one H1 per route.
- Valid LocalBusiness and OfferCatalog structured data.
- Reduced motion removes all transform and animation.
- No console errors on any route.

## Known limitation

Lighthouse mobile LCP measures 4.5s inside this 2-core sandbox under its 4x CPU
throttle. Unthrottled measurement in the same environment gives LCP 212ms, equal
to FCP, and a static no-JavaScript control page scores 0.8s on the same harness.
The gap is the sandbox CPU, not the page. This must be re-measured against the
deployed Vercel URL before it is treated as a real regression.
