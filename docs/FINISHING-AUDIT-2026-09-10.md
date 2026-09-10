# Website Finishing Audit: Emerald Spa & Wellness Centre

**URL:** https://emeraldspacc.com
**Date:** 2026-09-10
**Profile:** Full Website (all 5 passes)
**Auditor:** Emerald Webmaster + Claude (website-finishing-director)
**Commit audited:** 90a9ff3 (Round 30), live on production during the audit
**Evidence:** 9 screenshots in `download/audit-screenshots/`

---

## Score Summary

| Pass | Name | Score | Max | Status |
|------|------|-------|-----|--------|
| 1 | First Impression | 15/15 | 15 | PASS |
| 2 | Technical Foundation | 24/25 | 25 | SOLID |
| 3 | UX Completeness | 23/25 | 25 | COMPLETE |
| 4 | Content & Brand | 19/20 | 20 | POLISHED |
| 5 | Cross-Device & Launch | 9/15 | 15 | ALMOST |
| **TOTAL** | | **90/100** | **100** | |

---

## Verdict

**LAUNCH READY** (85 to 100). No unresolved P0 issues. The site is live on the
client's own domain, the deploy pipeline is green, and the two questions the
client asked this round both check out with live evidence.

---

## Client Questions Answered With Evidence

**1. Does Book Now open another Fresha page without disturbing the site?**
Yes. Every Book Now on the site is `target="_blank" rel="noopener noreferrer"`.
Verified by clicking the live nav button in a real browser: tab 1 stayed on
`https://emeraldspacc.com/` untouched, tab 2 opened the Fresha checkout
("Make an appointment at Emerald Spa & Wellness Centre"). Screenshots
03 and 04 record both tabs.

**2. Is the frontend talking to the backend; is WordPress perfectly working?**
Yes. `GET admin.emeraldspacc.com/wp-json/wp/v2/promotion` returns 3 published
specials (IDs 51, 52, 53). The homepage RSC payload carries them with their
ACF fields (`priceNad`, `duration`) straight into the nav dropdown and the
packages section; the dropdown screenshot (05) shows Sisterhood and
Brotherhood NAD 4,500, (S)quad NAD 3,000, Massage for Two NAD 1,700, all
served from WordPress at render time with a 15 minute revalidate window and a
fail-open contract (WP down = page still renders).

---

## Pass Details

### Pass 1: First Impression (15/15)
- WHAT 3/3: spa in Windhoek North, unmistakable in the first second.
- WHO 3/3: "Quiet luxury in the heart of Windhoek North" names the audience.
- WHY 3/3: Relax Renew Rejuvenate plus 93 treatments, 244 reviews, 4.9 rating.
- CTA 3/3: Book Now visible above the fold in hero and nav, action-specific.
- FEEL 3/3: emerald, gold, calm serif display; matches the Warm+Calm quadrant.

### Pass 2: Technical Foundation (24/25)
- Performance 9/10: FCP 296 ms and DCL 151 ms on the mobile viewport; hero
  video attaches after load and is `preload="none"`; media ships as WebP with
  full srcset. Deduction: a full Lighthouse run was not part of this pass.
- SEO 8/8: canonical on every route, unique titles and descriptions (spot
  checked on 6 routes), sitemap.xml 200, robots.txt 200, JSON-LD present,
  100 percent image alt coverage.
- Security and links 7/7: HTTPS enforced (308), CSP, HSTS 2y, X-Frame-Options,
  X-Content-Type-Options, Referrer-Policy, Permissions-Policy all present;
  all 12 probed routes 200; source maps 403 in production.
- Fixed during this audit: the booking comment in `src/lib/site.ts` still
  described the retired same-tab rule; it now states the new-tab rule.

### Pass 3: UX Completeness (23/25)
- States 7/8: loading, error and not-found routes exist; the popup manages
  focus and Escape; copy buttons confirm. Deduction: WP specials revalidate
  in place with no skeleton (server-rendered, so rarely visible).
- Forms 6/6: the only "form" is the venue enquiry chip composer that opens
  WhatsApp with a fully composed message; group sizes are exactly 10, 15,
  20 and 30; no double submit possible; privacy link in the footer.
- Animation 6/6: `once: true` everywhere, `prefers-reduced-motion` honoured
  in CSS and in the scroll-to-top behaviour.
- Mobile 4/5: no horizontal overflow at 375 px, 48 px touch targets, 16 px
  body text, floating widgets clear of content. Deduction: tablet 768 px was
  not screenshotted this pass.

### Pass 4: Content & Brand (19/20)
- No placeholder text, zero em dashes, no AI-smoothing markers, exactly one
  H1 per page, alt text descriptive everywhere.
- Staff update shipped in Round 30: Laurensia Post is Spa Manager with the
  client's new portrait (5 WebP renditions), Merie-Ann (Lulu) is Spa
  Therapist, bios and alt text rewritten to match.
- Deduction: the staff handbook PDF in the media library predates the role
  swap and may still list the old titles; the binary cannot be text-checked
  from here, so it is flagged for the next WordPress round.

### Pass 5: Cross-Device & Launch (9/15)
- Browsers 2/5: Chrome desktop and mobile verified in a real browser;
  Safari and Firefox could not be exercised from this Linux session.
- Devices 3/4: 375 px and 1440 px screenshots clean; tablet not captured.
- Launch 4/6: OG image 200 (121 KB JPEG), styled 404, favicon set complete
  (32, 180, 192, 512, SVG), manifest valid. Missing: no analytics tag is
  installed (the client's GA4 measurement ID is needed; none was invented),
  and Google Search Console / WhatsApp preview rendering were not verifiable
  from this session.

---

## Issues

### P0: none.

### P1

| # | Pass | Issue | Fix |
|---|------|-------|-----|
| 1 | 5 | No analytics installed | Add GA4 with the client's own measurement ID (ask Mr Oj for the property, or create one and hand him the tag) |
| 2 | 4 | Staff handbook PDF may list pre-swap roles | Regenerate the handbook PDF in the next WordPress round |

### P2

| # | Pass | Issue | Fix |
|---|------|-------|-----|
| 1 | 5 | Tablet 768 px screenshot not captured this pass | Capture in the next audit cycle |
| 2 | 5 | Search Console status unverified | Client confirms or submits the sitemap |
| 3 | 3 | WP special revalidation has no skeleton state | Cosmetic only; optional shimmer |

---

## Strengths

- The WordPress to frontend pipe is real, typed and fail-open; an editor
  publishing a special with a price and duration sees it in the nav dropdown
  within 15 minutes without a redeploy.
- Booking is honest: one URL constant, every CTA identical, new tab verified.
- The media pipeline (WebP variants, srcset, poster frames, preload none,
  lazy video attach) keeps the heavy assets out of the critical path.
- Copy is finished: no placeholders, consistent voice, zero em dashes.

## Recommendations

1. Add GA4 analytics as soon as the client supplies the measurement ID.
2. Refresh the staff handbook PDF for the new management structure.
3. Capture Safari and tablet evidence in the next audit cycle.
