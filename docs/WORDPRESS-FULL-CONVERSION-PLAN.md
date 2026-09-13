# Full-WordPress Conversion Plan

**Ref:** ESWC/OPS/2026/WP-CONV-01
**Date:** 14 September 2026
**Status:** Plan issued, awaiting client decision on the interim restore path
**Companion PDF:** `Full-WordPress-Conversion-Plan-Emerald-Spa.pdf` (client copy)

---

## 1. Executive Summary

On 11 September 2026 the public website went dark. Vercel applied an account level soft block
to the Emerald hosting team after the Hobby plan's monthly fair-use allowance for edge
requests was exceeded, and from that moment every visitor-facing URL returned HTTP 402 with
the message Deployment Paused. The WordPress content backend on Hostinger stayed healthy
throughout, and the Fresha booking service was never affected. The incident exposed a
structural weakness in how the site is built: the layer visitors see is the metered, fragile
layer, while the layer that holds the content is cheap and robust.

This plan converts emeraldspacc.com to a single full WordPress website served from the
existing Hostinger hosting. Vercel leaves the serving path entirely, the edge request
metering disappears with it, and the outstanding frontend work order (Specials dropdown,
popup, card styling, banking block, music widget) is folded into the rebuild rather than paid
for twice. The content already lives in WordPress, so the work is theme construction and
careful cutover, not data migration. Estimated build to cutover: five to seven working days,
with a rollback path kept open for two weeks.

## 2. Incident Diagnosis

Compiled 14 September 2026 from direct HTTP probes, a real browser session, and the Vercel
API using the webmaster token.

### 2.1 What actually happened

At 19:23 Central African Time on 11 September 2026, Vercel recorded a soft block against the
Emerald team (slug `emerald-8857`) with reason `FAIR_USE_LIMITS_EXCEEDED` and overage type
`edgeRequest`. The block is still present in the team object returned by the Vercel API. Every
deployment under the team was disabled: emeraldspacc.com, www.emeraldspacc.com, and all
vercel.app aliases return HTTP 402 with `x-vercel-error: DEPLOYMENT_DISABLED`; a real browser
load shows the page title "Deployment Paused". Screenshots: `download/site-down-evidence/`.

### 2.2 Is it Vercel rate limits? Yes, precisely

This is fair-use enforcement, not a payment failure and not a code failure. Billing status
reads active; the last deployment (dpl_HPNqqeDtAecGdiAgXiV4mwUHzXZZ) was healthy before the
block; the vercel.app alias breaks exactly like the custom domain, proving the block is
account wide. Vercel counts every edge-served request including bots, scanners, and asset
fetches; the Hobby allowance lasted roughly six days of the billing month.

### 2.3 What still works

- WordPress backend `admin.emeraldspacc.com`: HTTP 200 via Hostinger LiteSpeed cache,
  wp-login reachable, REST API responding.
- Fresha booking page (external): never down. Direct link:
  `https://www.fresha.com/book-now/emerald-spa-wellness-centre-qnp9ba1m/all-offer?share=true&pId=1477270`
- WhatsApp, email, banking: unaffected.
- The block lifts when the billing cycle resets on 5 October 2026 (team created 5 September).

## 3. Why Full WordPress

Headless (WordPress backend + Next.js frontend + Vercel serving) means two systems to keep
aligned, a build step between an edit and the live site, per-request billing that punishes
traffic and bots alike, and a developer dependency for every structural change. Full
WordPress collapses the stack to one system on hosting that is already paid, with no
per-request metering, immediate edits, and the free plugin ecosystem for SEO, caching,
security, and backups. Content migration is not needed: promotions with price/duration
fields, pages, media, users, and the Emerald Admin Suite hardening are already in place.

Honest trade-offs: shared hosting needs caching discipline (S10); the design must be rebuilt
as a block theme (S6); instant rollbacks and type-safe data access are lost; migration week
needs SEO care (S9). None are blockers.

## 4. Target Architecture

- One WordPress installation serves the public site and wp-admin from emeraldspacc.com.
- Cloudflare (free) in front of Hostinger: origin protection, bot fight mode, free edge
  caching. The same bot storm that exhausted the Vercel quota is absorbed here at zero cost.
- `admin.emeraldspacc.com` retired after cutover: 301 to `emeraldspacc.com/wp-admin`, removed
  at the next DNS review.
- Booking stays external (Fresha); WhatsApp deep links stay.
- Theme code lives in this repository under `wordpress/theme/`; Next.js code preserved as
  archive and design reference.
- DNS snapshot before any change; email untouched.

## 5. Hosting and Install Strategy

**Option A (recommended): promote the existing install.** The WordPress installation at
`admin.emeraldspacc.com` already holds everything. Steps: full backup; update `siteurl` and
`home` to `https://emeraldspacc.com`; search-replace URLs in content and meta; repoint the
domain's document root in Hostinger; re-save permalinks. Content migration effort: zero.

**Option B (fallback):** fresh install in the main docroot, content moved via native
export/import plus field mapping. Only if Hostinger blocks the docroot change.

## 6. Theme Strategy

Custom block theme `emerald` (FSE) replicating the current site one to one: palette and
typography from `BRAND.md` tokens (ink 07211A, emerald ramp, ground F7F5F1), hero video
section with poster and floating mute, section order, card treatments (fading borders,
float hover), footer banking block. `theme.json` carries palette/typography/spacing.
Template parts: header (nav + Specials dropdown + Book Now), footer, card, popup. Vanilla
JavaScript only: dropdown, popup focus trap + Escape, music widget, mute button. No page
builders, no jQuery, no paid items. Hero reel: 22.4s VP9/WebM self-hosted, poster frame,
initialised after window load, reduced-motion fallback. Music: YouTube Q5u2Ddbvocc via
facade, muted start, 48px mobile-visible mute target.

## 7. Feature Parity Checklist

| Feature | Today (headless) | Full WordPress implementation |
| --- | --- | --- |
| Navigation and Book Now | Next.js header; Fresha `target=_blank rel=noopener noreferrer` | Header template part; identical anchors and attributes |
| Specials dropdown | REST fetch every 15 min, fails open | Native dropdown from the promotion post type; no fetch failure mode |
| Promo popup | Next.js modal from ACF `showAsPopup` | Small plugin + block; focus trap and Escape carried over |
| Background music | React widget, Q5u2Ddbvocc, 48px mute | Footer-loaded vanilla widget, same track and target, muted start |
| Hero reel | 22.4s VP9/WebM + poster | Same asset in hero part + reduced-motion fallback |
| Staff | JSON data file | Staff post type / ACF repeater; Laurensia Post = Spa Manager, Merie-Ann (Lulu) = Spa Therapist |
| Banking block | Footer component | Footer part: Emerald Spa Gold Business, FNB 64287404716, branch 282273 Maerua Mall, EFT ref = full name, wallet 081 607 7143, proof via WhatsApp |
| WhatsApp enquiries | wa.me deep links | Same links on same buttons |
| Journals | Removed from frontend | Not ported; `/journal/*` 301 to Home |
| Card styling | Fading borders, floating, full CTAs | Theme CSS single source |
| SEO plumbing | Hand-rolled JSON-LD, canonical, OG, sitemap | Rank Math free (Section 9) |

## 8. Plugin Stack, Free Only

| Purpose | Plugin (free) | Role |
| --- | --- | --- |
| Fields | Advanced Custom Fields (free) | Price, duration, popup flag; already populated |
| SEO | Rank Math SEO (free) | Meta, sitemap, robots, canonical, OG/Twitter, LocalBusiness JSON-LD, redirects |
| Caching | LiteSpeed Cache | Origin page cache (Hostinger = LiteSpeed), minify, WebP, lazy load |
| Admin config | Admin Site Enhancements (ASE, free) | Admin dashboard and login-adjacent configuration (client decision, 14 Sep 2026: ASE instead of Wordfence) |
| Hardening + login security | Emerald Admin Suite (mu-plugin) | Premium login, login throttling (5 attempts / 15 min), XML-RPC off, REST enumeration off, security headers, bot discouragement, dashboard polish, editor scope |
| Backups | Hostinger snapshots + UpdraftPlus (free) | Daily restore points; manual backup before cutover |
| Redirects | Redirection (free) | 301 map incl. every /journal path |
| Images | Existing WebP pipeline + Converter for Media (free) | WebP uploads with fallbacks |
| Mail | WP Mail SMTP (free) or Hostinger mail | Admin notices only; no forms by design |
| Content types | Emerald Core (free, bundled) | promotion, treatment + category, testimonial, staff - registers a type only when absent |
| Back office | Emerald Back Office (free, bundled) | Quick actions, staff guidebook door, back-office splash (self-retires on the public host) |

Policy: free only, no page builders, nothing outside this table without sign-off.
Wordfence is deliberately excluded (client decision, 14 Sep 2026). Its two useful
jobs are covered without it: throttling and hardening live in the Emerald Admin
Suite mu-plugin, and dashboard configuration lives in ASE.

## 9. SEO Continuity

- **URL map:** permalinks mirror current routes (/, /treatments, /specials, /team, /contact);
  every differing path (incl. all /journal) gets a 301. Full URL inventory crawled before
  cutover; redirect table proven on staging. Route decisions: every public route keeps its
  own template (front-page, page-services, page-specials, page-team, page-visit, page-gallery,
  page-venues, page-vouchers, page-pay, page-book-bulk, page-whatsapp, page-sitemap,
  page-privacy, page-terms via the generic page template); /brand is a low-value internal
  page and is 301'd to the homepage in the Redirection table.
- **Structured data:** LocalBusiness JSON-LD (address, geo, phone, hours, sameAs), ported OG
  images, Rich Results test on staging before the switch.
- **Sitemap/robots:** Rank Math sitemap + robots; Emerald Admin Suite bot blocks replicated;
  sitemap resubmitted on cutover day; Search Console watched daily for two weeks.
- **Zero-downtime cutover:** staging build first; docroot switch in a maintenance window;
  TTL lowered to 300s the day before.

## 10. Performance Budget

| Metric | Target | How |
| --- | --- | --- |
| LCP | < 2.5s on 4G mobile | LiteSpeed page cache, poster-frame hero, lazy below fold |
| CLS | < 0.1 | Explicit media dimensions, no late banners, font-display swap |
| INP | < 200ms | Vanilla JS only, no framework hydration |
| Home weight | < 2 MB first view | WebP, deferred video, YouTube facade |

Layered caching: Cloudflare (static + bot filtering) -> LiteSpeed (full pages, purge on
edit). The Vercel outage was a request-volume problem; the same storm here is absorbed for
free and never reaches PHP.

## 11. Cutover Plan and Timeline

| Phase | Day | Work | Output |
| --- | --- | --- | --- |
| 0 | Day 0 | Client decision on interim restore (S13); staging ready | Decision recorded |
| 1 | Days 1-2 | Theme skeleton: palette, type, header, footer, hero | Visible staging build |
| 2 | Days 3-4 | Sections: treatments, Specials dropdown, team, popup, banking footer, music, Fresha CTAs | Feature-complete staging |
| 3 | Day 5 | QA: five-pass finishing audit, 375px checks, keyboard/focus, side-by-side vs current screenshots | QA report per Table row |
| 4 | Day 5 | SEO freeze: URL inventory, 301 table, Rank Math, Rich Results | Redirect map proven |
| 5 | Day 6 | Cutover window: backup, docroot switch, smoke tests, sitemap resubmit | Site live on full WordPress |
| 6 | Days 7-21 | GSC monitoring, fixes, decommission Vercel, admin subdomain 301 | Closure report |

Rollback: previous docroot + DNS snapshot kept 14 days; revert is one switch.

## 12. Risks and Mitigations

| Risk | Likelihood | Mitigation |
| --- | --- | --- |
| SEO dip | Medium | 301 map, sitemap resubmit, GSC watch, content parity |
| Design fidelity loss | Low | Side-by-side QA; BRAND.md tokens only |
| Shared hosting strain | Medium | LiteSpeed + Cloudflare + budget verified on staging |
| Plugin sprawl | Low | Fixed free-only list; no installs without sign-off |
| Bot storms return | High | Cloudflare bot fight + Wordfence throttle; absorbed free |
| Email/DNS breakage | Low | DNS snapshot; mail untouched; maintenance window |
| Data loss | Low | Full backup + Hostinger snapshot; 14-day rollback |

## 13. Immediate Decision Required

| Option | Effect | Cost | Assessment |
| --- | --- | --- | --- |
| 1. Upgrade Vercel to Pro now | Site restores today while the build proceeds; cancel after cutover | USD 20, one month | Recommended if the site must be live immediately |
| 2. Wait for free reset | Block lifts 5 Oct 2026 | Nothing | 21 days dark; not recommended |
| 3. Straight to conversion | Site restored on Hostinger in about a week; failure mode removed permanently | Hosting already paid | The permanent fix |

Recommendation: Option 1 now + Option 3. Meanwhile share the direct Fresha link on WhatsApp
status and socials: bookings never stopped, only the shopfront did.

## 14. Optimization Status of the Current Site

The September finishing audit scored the current build 90/100, launch ready, zero P0:
media right-sizing and WebP with srcset; hero reel as 22.4s VP9/WebM with poster and
mobile-visible 48px mute; JSON-LD, canonical, unique titles, OG tags; CSP/HSTS; robots and
sitemap; popup focus trap + Escape; no horizontal overflow at 375px; fail-open WordPress
reads with 15-minute revalidation. Outstanding: GA4 (needs client measurement ID), Safari and
Firefox spot checks, staff handbook PDF regeneration. Fair caveat: none of these could have
prevented this outage. Optimisation governs speed and quality; the outage was a quota and
architecture problem, which is exactly what this plan removes.
