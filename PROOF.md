# PROOF

Every material action taken during this build, with the evidence it produced.
Measured technical results are kept separate from design judgement.

Format: Phase | Action | Target | Command or method | Result | Evidence | Timestamp | Status

## Discovery

| Phase | Action | Target | Method | Result | Evidence | Timestamp | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Discovery | Verify GitHub token | api.github.com/user | curl | 200, user `tangison` | api response | 2026-08-12 03:02 | Pass |
| Discovery | Verify Vercel token | api.vercel.com/v2/user | curl | 200, `gemsweb-digital` | api response | 2026-08-12 03:02 | Pass |
| Discovery | Verify Tavily key | api.tavily.com/search | curl | 200 with results | api response | 2026-08-12 03:02 | Pass |
| Discovery | Resolve `wearecolins.com` | DNS A record | getent, dns.google | NXDOMAIN from both | Status 3, no answer | 2026-08-12 03:03 | Fail, unusable |
| Discovery | Find real agency | Tavily search | search | COLLINS at `wearecollins.com` | search result | 2026-08-12 06:29 | Pass |
| Discovery | Fetch reference site | wearecollins.com | Scrapling Fetcher | 200, 171254 bytes | `research/collins_home.html` | 2026-08-12 06:30 | Pass |
| Discovery | Extract design tokens | COLLINS stylesheet | regex parse | Fonts, colours, easing ladder, type scale | terminal output | 2026-08-12 06:30 | Pass |
| Discovery | Download filebin bundle | filebin.net/wkk08hqpnt1654s8 | curl with verification cookie | 2 zips, 23786 and 17707 bytes | `downloads/` | 2026-08-12 06:29 | Pass |
| Discovery | Extract logo package | emerald_spa_wellness_svg_package.zip | unzip | 6 SVGs, no embedded raster | `assets/*.svg` | 2026-08-12 06:29 | Pass |
| Discovery | Read Tangison agent pack | tangison-website-agent-pack.zip | unzip, read | Master prompt plus 4 skills | `downloads/agent_pack/` | 2026-08-12 06:29 | Pass |

## Content acquisition

| Phase | Action | Target | Method | Result | Evidence | Timestamp | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Content | Scrape venue record | Fresha venue page | Scrapling Fetcher | 200, 771881 bytes | `research/fresha_venue.html` | 2026-08-12 03:02 | Pass |
| Content | Extract `__NEXT_DATA__` | venue HTML | json parse | Full location object | `research/next_data.json` | 2026-08-12 03:03 | Pass |
| Content | Extract services | location.services | python | 90 services in 13 categories | `src/data/business.json` | 2026-08-12 03:04 | Pass |
| Content | Extract contact and hours | location | python | Phone, address, geo, 7 day hours | `src/data/business.json` | 2026-08-12 03:04 | Pass |
| Content | Extract rating | location.ratingV2 | python | 4.8 from 228 reviews | `src/data/business.json` | 2026-08-12 03:04 | Pass |
| Content | Extract team | employeeProfiles | python | 6 professionals with ratings | `src/data/business.json` | 2026-08-12 03:04 | Pass |
| Content | Extract socials | owner.onlineLinks | python | Verified Instagram and Facebook | `src/data/business.json` | 2026-08-12 03:04 | Pass |

## Media

| Phase | Action | Target | Method | Result | Evidence | Timestamp | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Media | Download venue photos | images.fresha.com | Scrapling | 6 at 1600x900 | `assets/original/` | 2026-08-12 06:31 | Pass |
| Media | Download portfolio | signed CDN URLs | Scrapling | 4 graphics, signature required | `assets/original/` | 2026-08-12 06:31 | Pass |
| Media | Download team avatars | cdn-partners-api | Scrapling | 6 at 340x340 | `assets/original/` | 2026-08-12 03:04 | Pass |
| Media | Download official logo | cdn-partners-api | Scrapling | 500x500 PNG with alpha | `public/emerald-logo-official.png` | 2026-08-12 06:31 | Pass |
| Media | Generate derivatives | 16 masters | Pillow with AVIF plugin | 98 files, 4.70 MB total | `public/media/` | 2026-08-12 06:32 | Pass |
| Media | Verify logo renders | symbol SVG | Playwright screenshot | Clean vector, no raster | `/tmp/logo_check.png` | 2026-08-12 03:06 | Pass |
| Media | Inspect photo quality | serenity-garden, treatment-room | visual read | Authentic, honest phone captures | inline inspection | 2026-08-12 06:32 | Pass |
| Media | Correct poster alt text | portfolio 1 to 4 | visual inspection | Were mislabelled as treatment photos, are promotional graphics | `src/data/images.json` | 2026-08-12 07:24 | Fixed |

## Build

| Phase | Action | Target | Method | Result | Evidence | Timestamp | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Build | Scaffold project | Next.js 14 | npm install | Installed, no vulnerabilities blocking | `package.json` | 2026-08-12 06:33 | Pass |
| Build | Sample brand palette | logo SVG | regex extract | 15 exact hexes, emerald and rose gold | `tailwind.config.ts` | 2026-08-12 06:34 | Pass |
| Build | Implement 15 routes | app router | tsx | All static, all prerendered | build output | 2026-08-12 06:41 | Pass |
| Build | Production build | next build | npm | Compiled, 15/15 static pages | terminal | 2026-08-12 07:20 | Pass |
| Build | Type check | tsc --noEmit | npx | Exit 0 | terminal | 2026-08-12 07:20 | Pass |
| Build | Lint | next lint | npx | No warnings or errors | terminal | 2026-08-12 07:20 | Pass |

## Debugging, root cause fixed and rechecked

| Phase | Action | Target | Method | Result | Evidence | Timestamp | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Debug | Missing poster 404 | `/media/reception-1200.jpg` | network capture | Root cause: JPEG fallback emitted only at largest width. Repointed to 1600 | network log clean | 2026-08-12 06:49 | Fixed |
| Debug | Section headings invisible | ClipReveal | computed style probe | Root cause: `whileInView` observed the child translated 110% outside its `overflow:hidden` parent, so ratio stayed 0. Switched observer to the wrapper | 0 of 9 headings failing after fix | 2026-08-12 06:52 | Fixed |
| Debug | Contrast failures | 150 nodes | axe-core | Root cause: ink opacities below 65 percent. Measured the threshold, raised all to `ink/65` | axe 0 violations | 2026-08-12 07:00 | Fixed |
| Debug | Invalid ARIA | rating stars | axe-core | `aria-label` not permitted on generic div. Added `role="img"` | axe clean | 2026-08-12 07:00 | Fixed |
| Debug | Carousel keyboard trap | scroll track | axe-core | Added `tabIndex=0`. First attempt added `role="group"` which orphaned the `li` children, reverted to native list role | axe 0 violations | 2026-08-12 07:03 | Fixed |
| Debug | Redundant alt | 10 images | Lighthouse | Captions duplicated alt verbatim. Marked captioned images decorative | Lighthouse a11y 100 | 2026-08-12 07:14 | Fixed |
| Debug | Mobile LCP 4.4s | hero | Lighthouse plus isolation test | Hypotheses tested: JS hydration, opacity fill, video weight. Unthrottled LCP measured 212ms and a static control scored 0.8s on the same harness, so the sandbox CPU was the cause. Confirmed on live infrastructure at 3.4s | `qa/lh-live-mobile.json` | 2026-08-12 07:22 | Resolved on deploy |

## Verification

| Phase | Action | Target | Method | Result | Evidence | Timestamp | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Verify | Route status | 10 routes, 2 viewports | Playwright | All 200, 404 returns 404 | terminal | 2026-08-12 06:47 | Pass |
| Verify | Console errors | all routes | Playwright listener | 0 errors local, 0 live | terminal | 2026-08-12 07:26 | Pass |
| Verify | Responsive widths | 320, 375, 414, 768, 1024, 1280, 1440 | Playwright | No horizontal scroll at any width | terminal | 2026-08-12 06:56 | Pass |
| Verify | Accessibility local | 9 routes | axe-core wcag2a/2aa/21a/21aa | 0 violations | terminal | 2026-08-12 07:05 | Pass |
| Verify | Accessibility live | 9 routes | axe-core | 0 violations | terminal | 2026-08-12 07:25 | Pass |
| Verify | Reduced motion | home | Playwright reduced-motion context | 0 hidden, 0 transformed, 0 animations running | `qa/home-reduced-motion.png` | 2026-08-12 07:07 | Pass |
| Verify | Keyboard order | home | Playwright Tab | Skip link first, then logo, nav, menu, CTA | terminal | 2026-08-12 07:07 | Pass |
| Verify | Hero contrast | 5 text regions over video | luminance sampling | Lowest ratio 7.46, all pass AA | terminal | 2026-08-12 06:55 | Pass |
| Verify | SEO metadata | 9 routes | curl parse | Unique title, description, canonical, exactly one H1 each | terminal | 2026-08-12 07:08 | Pass |
| Verify | Structured data | home and services | JSON parse | Valid DaySpa and OfferCatalog with 90 offers | terminal | 2026-08-12 07:08 | Pass |
| Verify | Secret scan | repository | git grep | No tokens committed | terminal | 2026-08-12 07:19 | Pass |

## Measured results

Local sandbox, 2 CPU cores, Lighthouse 12.8.2.

| Target | Performance | Accessibility | Best practices | SEO | LCP | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| Local desktop | 99 | 99 | 100 | 100 | 0.8s | 0 |
| Local mobile | 82 | 100 | 100 | 100 | 4.5s | 0 |
| Live desktop | 99 | 100 | 100 | 100 | 0.8s | 0 |
| Live mobile | 90 | 100 | 100 | 100 | 3.4s | 0 |

Live URL measured: `https://emerald-spa-wellness.vercel.app`

## Deployment

| Phase | Action | Target | Method | Result | Evidence | Timestamp | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Deploy | Preserve prior work | existing `main` | GitHub refs API | Branched to `backup-main-20260812-0351` before force push | branch list | 2026-08-12 07:19 | Pass |
| Deploy | Push source | tangison/emerald-spa-wellness | git push | HEAD `3cc32a6`, 147 files | GitHub API | 2026-08-12 07:19 | Pass |
| Deploy | Correct project config | Vercel project | PATCH v9 | Framework corrected from `vite` to `nextjs` | api response | 2026-08-12 07:20 | Pass |
| Deploy | Link Git integration | Vercel to GitHub | POST link | Blocked, requires OAuth Login Connection a token cannot create | api error | 2026-08-12 07:20 | Blocked, worked around |
| Deploy | Deploy source | Vercel Files API | upload plus v13 deployments | READY, aliased to production | `dpl_6mJLY88Eq6Ldhb27fCAxhHSZTRXj` | 2026-08-12 07:21 | Pass |
| Deploy | Verify TLS | live origin | curl -I | HTTP/2, HSTS preload, nosniff, SAMEORIGIN | headers | 2026-08-12 07:22 | Pass |
| Deploy | Verify routes | 13 live paths | curl | All expected codes including 404 | terminal | 2026-08-12 07:22 | Pass |
| Deploy | Verify caching | media asset | curl -I | `immutable`, one year, correct AVIF type | headers | 2026-08-12 07:23 | Pass |

## Open items

- Vercel Git integration is not connected. Deployments currently ship through
  the Files API. Connecting GitHub in the Vercel dashboard would enable
  automatic deploys on push. This needs an account owner, not a token.
- No custom domain is attached. The site runs on the `vercel.app` alias. No DNS
  records were created or modified.
- Live mobile LCP is 3.4s against a 2.5s goal. The dominant remaining factor is
  the 22MB hero video the brief specified. Re-encoding it to roughly 3MB at
  720p, or serving a WebM variant, is the single highest impact next change.
