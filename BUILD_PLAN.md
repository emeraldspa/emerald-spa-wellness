# BUILD_PLAN

Emerald Spa & Wellness Centre, Windhoek North, Namibia.

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
| `/book` | On-domain booking page, platform never named | Done |
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


## Round 2 decisions

| Decision | Chosen | Alternative set aside | Reason |
| --- | --- | --- | --- |
| Booking embed | Own-domain `/book` page that opens the provider in a new tab | Iframe embed of the provider widget | The provider sends `frame-ancestors 'self' https://*.fresha.com https://*.adyen.com`. A cross-origin iframe from this domain is refused by the browser. Verified in a real browser, not assumed. Their help centre documents a booking link and button, not an embeddable widget. |
| Platform naming | Never in marketing copy, retained in privacy and terms | Strip every mention | Naming the processor that receives booking data is a legal disclosure duty. Removing it from the privacy notice would make that notice inaccurate. |
| Service count | `LISTED_SERVICE_COUNT`, derived from the priced menu | The venue record's own total of 130 | Only 90 services return a name, duration, and price. Printing 130 next to a menu of 90 claims more than the page shows. |
| Booking benefits | Two verified facts only | Four benefit bullets | "Free to reschedule" and "instant confirmation" are not in the record. Only no-online-payment and choose-your-therapist are. |
| Footer logo | Real stacked lockup at 240 to 320px | Small icon beside the wordmark | Client asked for it featured large, not shrunk to an afterthought. |

## Still blocked

- Additional photography. The round 2 bundle carried logo assets only. Image
  density is unchanged and no filler was substituted.
- Google review link. Needs the real Place ID or review URL.

## Round 3 (revamp, 2026-08-27)

Client directives applied on top of Round 2. Full detail in PROOF.md and REVAMP_PLAN.md.

| Decision | Chosen | Why |
|---|---|---|
| Navigation | Hero nav (home) + StickyNav floating pill on every route only. Boxed SiteHeader removed from all inner pages | Client: only the hero and the sticky floating header |
| Booking | Full-bleed frame, no padding/margins, sized to viewport; same-origin fallback keeps URL on this domain; full-screen popup toggle | Client: iframe must take full width, stop over-relying on the external fallback |
| Suburb | Windhoek North, unchanged; street unchanged | Client correction |
| Products | Descriptions only, no prices, no separate page | Spa does not resell, it uses |
| Reviews | Curated spiral (strongest first), one-word reviews excluded | Client: pick best reviews to spiral |
| Marble | Textures upscaled to 2048px and fit with cover sizing, not tiled | Client: upscale it, then fit it |
| Font | Radley display (single weight) with Poppins UI | Client request |
| Pages | /venues (stories + reels + masonry + venue enquiry), /journal + /journal/[slug] (headless WP) | Client: venues, articles, blog |
| WhatsApp | Three-step guided flows with progress rail (WhatsAppFlow, VenueEnquiry) | Client: intuitive, process-like forms |

## Round 11 (2026-09-03)

| Decision | Chosen | Alternative set aside | Reason |
|---|---|---|---|
| Hero heading | Relax / Renew / Rejuvenate | Restore / Balance / Glow (round 1) | Client instruction: the words now echo the tagline's own verbs. Structure and motion unchanged. |
| Tagline casing | "Relax the body, Renew the mind, Rejuvenate the soul" | Sentence case | Client asked for capital Rs. Applied at the single source plus the footer and meta description. |
| Gallery frames | Uniform 4:3 (posters 4:5), object-cover | Natural proportions (round 8 rule) | Client: photos must not render too tall. The nine-by-sixteen sources made sections taller than the viewport. The lightbox keeps the full frame. |
| Hero fit | svh-aware heading clamp + landscape collapse (chip and toggle hidden under 500px height) | Scrollable hero | Client: the hero must never scroll at any resolution. The collapsed facts repeat in the status strip directly below. |

## Round 12 (2026-09-03)

| Decision | Chosen | Alternative set aside | Reason |
|---|---|---|---|
| Gallery captions | Short factual descriptions (avg 35 chars), no brand name in every line | Long SEO-style alts with full spa name | Client: descriptions must be "actual and minimalistic". The page context already says whose gallery it is; the caption only needs to say what is in the frame. Alt text stays descriptive enough for screen readers. |
| Placeholder alts | Replaced with per-image descriptions written from the actual frames | One shared caption per section | 51 images shared a single generic line; the gallery read as unlabeled. Each of the 95 records now describes its own photo. |
| Sideways photographs | Rotated 90 CW on disk (14 photos, 42 variants), dimensions re-synced | CSS rotate hacks | The files themselves were stored sideways; CSS would fight the 4:3 frames and the lightbox. Fixed at the asset layer once. |
| Section copy | Leads state only what the section shows ("Lounges and green light.") | Marketing phrasing ("Guests, close up.") | Same copywriting rule: honest over sensational; the section lead must match its photographs. |
| Hero copy | Unchanged (Relax / Renew / Rejuvenate) | Any rewording | Explicit client instruction this round. Verified by a no-diff check in the verify suite. |

## Round 13 (2026-09-05) — emerald-content-manager

| Decision | Chosen | Alternative set aside | Reason |
|---|---|---|---|
| CMS architecture | Git-backed: /admin edits commit JSON to the repository; Vercel's Git integration deploys the commit | Database (Supabase/Prisma) or WP headless | The site's content already lives in JSON read at build time; a commit is the same mechanism the team already trusts, costs nothing, gives full history and one-click undo. No new infrastructure to secure or pay for. |
| Writes | GitHub Contents API with sha-guarded commits, author Emerald Webmaster | Local fs writes on the server | Serverless filesystems are read-only; the repo is the source of truth. |
| Auth | Shared password + HMAC-signed 12h cookie | OAuth/GitHub login | One spa, one webmaster, one gatekeeper password the owner can change in the Vercel dashboard. No third-party identity dependency. |
| Announcements surface | Dismissible floating card, bottom-left | Top banner above the header | A banner pushes the hero past the viewport, breaking the Round 11 "hero never scrolls" rule. The card adds zero layout shift. |
| Compose from notes | Deterministic text engine applying the copywriting skill rules | Live LLM call | No API key to pay for or leak, works offline, and every suggestion is derived from facts the note actually contains. The owner edits the draft before saving either way. |
| Services editing | Per-category editor with a category rail | One 93-row grid | Matches how the menu is read and priced; keeps each save a small, reviewable diff. |
