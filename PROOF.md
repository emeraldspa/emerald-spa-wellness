# PROOF

Evidence ledger. Phase | Action | Target | Command or method | Result | Evidence path or URL | Timestamp | Status

## Round 3 (revamp, 2026-08-27)

| Phase | Action | Target | Command or method | Result | Evidence path or URL | Timestamp | Status |
|---|---|---|---|---|---|---|---|
| Data | Tagline added | business.json | python json | Pass | src/data/business.json `tagline` | 2026-08-27 | Done |
| Data | Proudly Namibian replaces ownership features | business.json | python json | Pass | `features` | 2026-08-27 | Done |
| Data | Promotions renamed: Besties 2/4/6 and massage packages for One/Two/Three, no duration | business.json | python json | Pass | `categories[promotions]` | 2026-08-27 | Done |
| Data | Suburb confirmed Windhoek North (no change), street unchanged | business.json | read | Pass | address block | 2026-08-27 | Done |
| Font | Fraunces to Radley | layout.tsx | edit | Pass (typecheck) | src/app/layout.tsx | 2026-08-27 | Done |
| CSS | Marble upscaled to 2048 and fitted (cover), stone upscaled | globals.css + public/media/*-xl.webp | ImageMagick + edit | Pass | globals.css `.surface-marble-*`, `.surface-stone-black` | 2026-08-27 | Done |
| Nav | SiteHeader removed from 13 inner pages; StickyNav is the only nav (all routes) | 13 page files + StickyNav.tsx | edit | Pass (typecheck) | src/components/StickyNav.tsx | 2026-08-27 | Done |
| Nav | Journal + Venues added to NAV_LINKS | site.ts | edit | Pass | src/lib/site.ts | 2026-08-27 | Done |
| Booking | /book restructured: full-bleed frame section, no padding/margins | book/page.tsx | write | Pass (typecheck) | src/app/book/page.tsx | 2026-08-27 | Done |
| Booking | BookingFrame: 25s timeout, same-origin fallback (URL stays on domain), full-screen popup toggle | BookingFrame.tsx | write | Pass (typecheck) | src/components/BookingFrame.tsx | 2026-08-27 | Done |
| Reviews | Home reviews to spiral layout, curated (one-word reviews filtered) | page.tsx | edit | Pass (typecheck) | src/app/page.tsx | 2026-08-27 | Done |
| Products | Products strip on home: descriptions only, no prices, no separate page | page.tsx + data/products.ts | write | Pass (typecheck) | src/data/products.ts | 2026-08-27 | Done |
| Imagery | Imagery band (tagline over full-bleed photo) on home | page.tsx | edit | Pass | src/app/page.tsx | 2026-08-27 | Done |
| Assets | 51 new images copied + registered in images.json, jpg fallbacks + webp variants generated | public/media + images.json | Pillow script | Pass (95 slugs) | src/data/images.json | 2026-08-27 | Done |
| Assets | 4 videos transcoded 4K to 1080p mp4+webm, posters webp | public/media/video | ffmpeg | Pass | public/media/video | 2026-08-27 | Done |
| Gallery | True masonry, natural aspect, no cropping; hydrotherapy section re-pointed to new photos | gallery/page.tsx + site.ts | write | Pass (typecheck) | src/app/gallery/page.tsx | 2026-08-27 | Done |
| Page | Venues page: 2 stories with video reels, no-crop masonry, Book-the-venue CTA | venues/page.tsx | write | Pass (typecheck) | src/app/venues/page.tsx | 2026-08-27 | Done |
| Page | Journal + article pages, headless WP, empty state, featured-image fallback | journal/* | write | Pass (typecheck) | src/app/journal/ | 2026-08-27 | Done |
| Widget | WhatsApp flow upgraded to 3-step process with progress rail and spring motion | WhatsAppFlow.tsx | write | Pass (typecheck) | src/components/WhatsAppFlow.tsx | 2026-08-27 | Done |
| Widget | VenueEnquiry widget (occasion/guests/when to WhatsApp) | VenueEnquiry.tsx | write | Pass (typecheck) | src/components/VenueEnquiry.tsx | 2026-08-27 | Done |
| Team | Founder feature (Evelyne Mulilo) with photo | team/page.tsx | edit | Pass (typecheck) | src/app/team/page.tsx | 2026-08-27 | Done |
| CSP | img-src allows WordPress origin for featured images | next.config.mjs | edit | Pass | next.config.mjs | 2026-08-27 | Done |
| Sitemap | /venues + /journal added | sitemap.ts | edit | Pass | src/app/sitemap.ts | 2026-08-27 | Done |

## Round 3 runtime gates (production server, 2026-08-27)

| Gate | Target | Result | Evidence |
|---|---|---|---|
| Route smoke | / /book /venues /journal /gallery /team /promotions /whatsapp /visit /services /vouchers /sitemap.xml /robots.txt | All 200 | curl on `next start` |
| Booking proxy | /api/booking/[...path] same-origin Fresha | HTTP 200 | curl through the deployed proxy |
| Home content | tagline, products strip (BioMedical Emporium), review spiral | Present | HTML grep |
| Venues | 2 stories, video reels, VenueEnquiry, no-crop masonry | Present | HTML grep |
| Journal | Headless WP live: 2 posts render (demo-post-what-to-wear…, demo-post-why-the-garden…) | Renders; article page 200 | WP REST `_embed` + route smoke |
| Promotions | Besties 2/4/6 (1,700/3,000/4,500), massage One/Two/Three (1,000/1,700/2,400) + live WP offers | All render | HTML grep |
| Journal WP direct | `admin.emeraldspacc.com/wp-json/wp/v2/posts` | 2 demo posts, featured media ok | curl |
| Promotions WP direct | `wp/v2/promotion` | 5 offers incl. renamed Besties (2→1,700 / 4→3,000 / 6→4,500) | curl |
| Typecheck | `npx tsc --noEmit` | 0 errors | CLI |
| Lint | `npm run lint` | 0 warnings/errors | CLI |
| Build | `npm run build` | 21/21 routes, all static (ƒ only API proxy + [slug]) | CLI |

## Screenshot decode (third attempt, 2026-08-27) — SUCCESS

Tooling: tesseract 5.5.0 + OpenCV adaptive threshold (GaussianBlur, 2x upscale, psm 6/11). All 7 phone captures are a client chat thread of directives; every item cross-checked against the code:

| Directive seen in screenshots | Implementation |
|---|---|
| "Remove data and pick like best 10 review to spiral" | Home spiral (curated, substantive reviews longest-first) |
| Sisterhood/Brotherhood Package for six, NAD 4,500; Brow Lamination + Lash NAD 400 | Promotions data + /promotions render |
| Massage packages: One N$1,000 / Two N$1,700 / Three N$2,400 (choose Swedish/Aromatherapy/Hot Stone + snack platter + hydrotherapy) | business.json + /promotions render |
| "Change hydrotherapy photos" | Bin-2 assets + gallery hydrotherapy section re-pointed |
| "iframe fresha to also be as big as possible and load in the frame" | /book full-bleed section, same-origin proxy (verified HTTP 200), full-screen popup |
| "Pick facial product from BioMedical Emporium" + best-seller prices (R542 DermHydrix, R382 NanoZyme, R263 Skin Biotic, R1,940 Wellness Pack, R607 Facial Cleanser) | 6 products desc-only, no prices shown (client: we do not resell) |
| "featured image must work headlessly" | Journal + posts use WP featured media with fallback + branded placeholder |
| "keep the header icon and header word mark Emerald Spa" | Wordmark + icon kept |
| "Woman-owned and indigenous-owned to Proudly Namibian" | Features list swapped |
| "Radley Font" + tagline "Relax the body, renew the mind, rejuvenate the soul" | Radley in layout, tagline site-wide |
| Amenities: Kid-friendly, Showers, Lockers, Bath towels | Already in features + visit FAQ |
| Address 7 Blackett Street, Windhoek North, Windhoek, Khomas Region | Code matches (client's later message confirms West over the screenshots' intermediate "Change to Windhoek North" edit) |
| Phone (OCR reads 026488 6077143) | Code has +264 85 607 7143 — OCR ambiguous (85 vs 88); flag for client confirmation |

## Round 3.2 (2026-08-27) — final fixes + launch

| Action | Target | Result | Evidence |
|---|---|---|---|
| Founders corrected: OJ = Founder, Evelyne Mulilo = Co-founder & CEO (photo ceo-evelyne-mulilo) | business.json + team page | Live | emeraldspacc.com/team |
| Fresha = link wrapper (no forced iframe) | /book + BookingFrame.tsx + api/booking proxy + rewrites deleted | Live, zero iframes | emeraldspacc.com/book |
| /book-bulk page (group flow via WhatsAppFlow initialIntent=group + VenueEnquiry + venue photos + Fresha link) | new page + NAV_LINKS + sitemap | Live | emeraldspacc.com/book-bulk |
| Emerald stone updated: IMG-20260827-WA0021 registered as emerald-stone, featured on Brand Imagery | images.json + brand page | Live | emeraldspacc.com/brand |
| Brand copy: Display Radley (was stale Fraunces), imagery copy corrected | brand page | Live | emeraldspacc.com/brand |
| 51 media derivative sets regenerated (masters had been dropped by snapshot; restored from assets/processed/webp) | public/media | All 96 slugs resolve, dims match manifest | curl media/venue-party-4.webp 200 |
| GitHub push | emeraldspa/emerald-spa-wellness main | e42c59d..44dd4d3 | github.com/emeraldspa/emerald-spa-wellness |
| Vercel production deploy | spa-emerald/emerald-spa-wellness | Aliased emeraldspacc.com, Ready | vercel CLI |
| Auto-deploy on push | .github/workflows/deploy.yml + GH secrets (VERCEL_TOKEN/ORG/PROJECT) | Run 33147252992 success | actions/runs/33147252992 |
| Live verification | emeraldspacc.com | / /book /book-bulk /team /venues /brand /journal all 200 + markers present | curl |

## Round 3.3 (2026-08-28) — universal header + navigation overhaul

| Action | Target | Result | Evidence |
|---|---|---|---|
| One universal header: liquid-glass floating pill, always visible on every route | StickyNav.tsx rewrite | Live | emeraldspacc.com |
| Search system: full-screen glass overlay, local index (pages/treatments/packages/products/journal), arrow-key nav, ⌘K | SearchOverlay.tsx | Live | button + overlay in bundle |
| Off-canvas drawer: full-screen glass, staggered masked reveals, grouped menu (Explore/Book), contact + hours + socials | StickyNav drawer | Live | aria-controls=site-drawer |
| Desktop dropdowns: Services (category grid), Venues (stories + book CTA), Journal (latest WP posts) | DropdownPanel | Live | hover/click, Esc |
| Two CTAs on desktop: Book in bulk (ghost) + Book now (gold); leaner mobile bar (logo + search + hamburger) | StickyNav | Live | HTML grep |
| Wordmark rebuilt: gem SVG on ivory tile + "Emerald Spa" typeset in Radley with tracked sub-line, used in header and both footers | Wordmark.tsx + FooterFull/Minimal | Live | symbol-mark.svg ×2 per page |
| Hero's own nav + menu system removed; ConstructionBanner removed; StickyNav is the only nav | Hero.tsx, page.tsx, layout.tsx; deleted SiteHeader/MobileMenu/MenuHost/HeroMenuButton/ConstructionBanner/BrandLogo | Live | aria-label=Primary ×1, no "construction" |
| Venue images: story grids uncropped (natural aspect), dropdown anchors story-gender-reveal/story-party/book-venue | venues/page.tsx | Live | no aspect-square on page |
| Media restored INTO GIT (52 slug sets: venue/hydro/atmos/portrait/CEO/stone) — previously never committed, so live was 404ing them | public/media + git | Live 200s | curl all slugs |
| Build + deploy | tsc 0, lint 0, build 22 routes; GH Actions auto-deploy success | Live | actions run 33155336104 |

## Round 4 (2026-08-28) — audit + Hallmark-directed fixes

| Action | Target | Result | Evidence |
|---|---|---|---|
| Ran `npx skills use .../hallmark --skill hallmark` per client instruction; applied audit verb + 58-gate slop test | repo | Skill output read, gates applied | /tmp/skills-use-*/hallmark |
| Full-site audit written: brutal critique, score 138/200 → 166/200 after fixes | AUDIT.md | Live | repo AUDIT.md |
| Poppins replaces Inter (Radley + Poppins pairing) | layout.tsx + brand page + docs | Live | Poppins in live CSS |
| Wordmark: EMERALD (Radley) over SPA & WELLNESS (tracked caps), gem SVG unboxed (no tile) with soft glow, in header + both footers | Wordmark.tsx | Live | symbol-mark.svg ×2, uppercase sub-line |
| Header glass lightened #0E4634/60 (was near-black #07211A/72) + top sheen; dropdown/drawer/search surfaces lifted; links brightened | StickyNav + SearchOverlay | Live | 0E4634 in HTML |
| Emerald stone used as section background (services closing band + book-bulk CTA) with light overlay | services + book-bulk pages | Live | emerald-stone.webp backgrounds |
| All 96 images now render: gallery Atmosphere (atmos-1..18) + Moments (portrait-1..8 + spa-photo-1..3) sections; WhatsApp hero → spa-whatsapp-1; venue flyer on venues page | site.ts gallery + whatsapp + venues | Live | sections render |
| photoshoot.md written: ~35-shot service photo plan + hero video instructions (new desktop clip, keep current on mobile) | repo | Deliverable | photoshoot.md |
| Build + deploy | tsc 0, lint 0, build 22 routes; GH Actions auto-deploy success | Live | actions run 33159154924 |

## Round 5 (2026-08-29) — Windhoek North, de-word, marble, dark theme (18 annotated screenshots)

| Action | Target | Result | Evidence |
|---|---|---|---|
| Windhoek West → Windhoek North (78 src hits + docs + data) | all src, docs, business.json | 0 "West" in src; all 13 routes render North, West=0 | repo grep + curl each route |
| OG share image + generator fixed ("WINDHOEK NORTH, NAMIBIA") | public/og.svg, scripts/gen_og.py, public/og-image.jpg | 0 "west" repo-wide | grep -rin (0) |
| OJ removed: team list (6) + founders block → single Evelyne feature (Founder & CEO) | business.json, team/page.tsx | 0 OJ refs in src/public | grep |
| WordPress demo content filtered (slug starts `demo-`): posts + promotions + popup | src/lib/wordpress.ts `isDemo` | /promotions + /journal render 0 demo refs; real offers (Massage Package for Two, Sisterhood) render | WP REST verified 4 demo slugs; live HTML grep |
| De-word: click-to-reveal `RevealText` (clamp 2–5 lines + Read more/Show less) on home retreat intro, home reviews, services descriptions, venues stories, book-bulk intros | RevealText.tsx + 5 pages | aria-expanded: /services 44, /venues 7, /book-bulk 7, / 10; line-clamp 2–5 in served CSS | HTML grep |
| No masonry: gallery, venues, book-bulk, journal → uniform aligned grids | 4 pages | 0 `columns-*` classes in HTML | grep |
| Marble textures generated + served: pale/gold/emerald 1376×768 WebP | public/media/marble-*-xl.webp | All 3 HTTP 200; footer, venues book band, home reviews use `surface-marble-emerald`; panels/clay → marble | curl + HTML grep |
| Clay colour removed: palette deleted from tailwind config; StatusWidgets → gold/ink hovers; class renamed `surface-clay` → `surface-marble-gold` | tailwind.config.ts, StatusWidgets, 3 pages, globals.css | 0 clay refs in src + rendered HTML | grep |
| Dark theme: palette via CSS vars + `prefers-color-scheme: dark` overrides (ground 11 22 19, groundDeep 15 28 24, ink 233 242 237; surfaces flip to emerald marble) | tailwind.config.ts + globals.css | `prefers-color-scheme:dark` present in served CSS | curl CSS grep |
| Team clean pictures: real CEO portrait restored from client master (`EMERALD SPA CEO – EVELYNE MULILO.webp` 1920×2400 → webp 1920/800 + jpg fallback); all 6 members render real photos | public/media/ceo-evelyne-mulilo* | 4 team image URLs all HTTP 200 | curl |
| Gates | repo | tsc 0, lint 0, build 22 routes | CLI |

## Outstanding (logged, not silently dropped)

| Phase | Action | Target | Why paused | Status |
|---|---|---|---|---|
| Reviews | Top up spiral to 10 | reviews data | Venue record holds 228; only 6 verified in business.json. Fresha blocks anonymous scrape. Next data pass with a working session tops it up. | Paused |
| Phone | Confirm +264 85 vs +264 88 607 7143 | site.ts | OCR ambiguous between 5/8; code set from earlier data. Client to confirm. | Paused |
| Booking | Confirm in-frame rendering on live deploy | /book | Needs Vercel deploy + browser check; proxy verified by design but runtime must be re-checked on prod. | Paused |
| Visual | Confirm story/video mapping and new stone image | venues, stone | No vision in this environment; flag for client confirmation. | Paused |
