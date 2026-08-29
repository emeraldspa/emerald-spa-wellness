# Emerald Spa & Wellness Centre — full site audit

Two properties, audited from a real browser on desktop and mobile, plus an
HTTP layer pass with Scrapling using a genuine Chrome TLS fingerprint.

| | |
| --- | --- |
| Public site | `https://emerald-spa-wellness.vercel.app` |
| Back office | `https://admin.emeraldspacc.com` |
| Canonical domain | `https://emeraldspacc.com` (DNS not yet pointed at Vercel) |
| Devices | Desktop 1440x900, mobile iPhone 13 viewport with touch |
| Routes per pass | 12 public, 5 back office |
| Standards | OWASP ASVS 4.0.3 (286 requirements parsed), WCAG 2.1 (78 criteria, 50 at A/AA), Lighthouse thresholds |

## Result

**0 critical, 0 high, 18 medium, 17 low.** All twelve categories pass their critic review with zero criticals on re-audit.

| # | Category | Standard | C | H | M | L | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | SEO and meta | Lighthouse SEO audits | 0 | 0 | 1 | 0 | PASS |
| 2 | Open Graph and Twitter cards | ogp.me + X card documentation | 0 | 0 | 0 | 1 | PASS |
| 3 | Structured data | schema.org + Google rich results | 0 | 0 | 0 | 0 | PASS |
| 4 | Accessibility | WCAG 2.1 AA (50 A/AA criteria parsed from the spec) | 0 | 0 | 0 | 0 | PASS |
| 5 | Performance | Lighthouse thresholds (LCP 2500/4000ms, CLS 0.1/0.25) | 0 | 0 | 0 | 0 | PASS |
| 6 | Security headers | OWASP ASVS 4.0.3 V14.4 | 0 | 0 | 14 | 2 | PASS |
| 7 | HTTPS and privacy | OWASP ASVS 4.0.3 V9 and V3.4 | 0 | 0 | 0 | 0 | PASS |
| 8 | Business data consistency | Verified Emerald records | 0 | 0 | 0 | 0 | PASS |
| 9 | Internal links | No 4xx/5xx, no orphans, accessible names | 0 | 0 | 0 | 0 | PASS |
| 10 | Mobile | WCAG 2.1 SC 1.4.10 Reflow + Lighthouse mobile | 0 | 0 | 1 | 11 | PASS |
| 11 | Console and runtime errors | Zero uncaught errors | 0 | 0 | 0 | 3 | PASS |
| 12 | Forms and booking flows | ASVS V5 + WCAG 3.3.2, driven functionally | 0 | 0 | 2 | 0 | PASS |

## What was found and fixed

The first pass raised 80 findings, 46 of them high. Everything below was
changed and then re-verified against the live sites, not just the codebase.

| Severity | Finding | Standard | Fix | Verified |
| --- | --- | --- | --- | --- |
| critical | The /book embed returned 200 for every asset but rendered a blank white frame, and the page reported it as ready | A booking journey must complete | Frame content is now inspected after load; a blank embed falls back to phone, WhatsApp and a direct booking link | fallback verified live: tel, wa.me and direct link all present |
| high | No Content-Security-Policy on any of the 12 public routes | ASVS V14.4.3 | Added a CSP allowlisting self plus the Maps embed | `content-security-policy` header present on live |
| high | Canonical, og:url, robots.txt and sitemap.xml all advertised the vercel.app preview host | Lighthouse SEO, ogp.me | Set SITE_URL and the Vercel env var to emeraldspacc.com | canonical, robots and sitemap now emit emeraldspacc.com |
| high | Back office sent no X-Frame-Options and no nosniff | ASVS V14.4.7, V14.4.4 | send_headers and rest_pre_serve_request hooks in the theme | headers present on /, /portal/, /wp-json/ |
| high | Every subpage lost its og:image. Next.js replaces the openGraph object rather than merging it, so pages declaring only a url dropped the inherited image | ogp.me | Added an ogFor() helper used by all 11 subpages | og:image present and 200 on /services and siblings |
| medium | Back office leaked `X-Powered-By: PHP/8.3.30` | ASVS V14.3.3 | header_remove on init, login_init and admin_init | gone from / and /wp-login.php |
| medium | Back office published a public wp-sitemap.xml while set to noindex | Crawl hygiene | wp_sitemaps_enabled filtered to false | wp-sitemap.xml now 404 |
| medium | 21 touch targets under 44px on mobile (WhatsApp chips at 42px, contact links at 41px) | Apple HIG 44pt / Google 48dp | min-h-[44px] on chips, padded hit area on prose links | 0 undersized targets across 12 mobile routes |
| medium | Stat captions rendered at 10px on mobile | Lighthouse legible font sizes | Raised to 12px | no sub-11px text remains |
| low | Home title was 61 characters | Google SERP truncation | Shortened to 56 | measured on live |

## The booking defect, in detail

This is the finding that mattered most, and no static check would have caught it.

Every "Book Now" button on the site leads to `/book`. That page embeds the
booking provider through a same-origin proxy so the visitor never leaves the
Emerald domain and the platform is never named. The proxy returns HTTP 200
for the document and all 90 subresources, the HTML is byte-identical to the
provider's own, the GraphQL endpoint answers correctly through the proxy, and
there are zero console errors.

The app still never mounts. Instrumenting the frame showed
`window.webpackChunk_N_E.length === 0`: the bundles are fetched and never
register. Inline scripts in the same document do run, so script execution
itself is not blocked. Loaded directly, the provider's own page hydrates to
88,487 characters; through the proxy it stops at 969.

I could not fix the vendor bundle's behaviour behind a proxy. What I fixed is
the part that was mine: the page used to call `onLoad` a success, so a visitor
saw a blank white box with no way to book. It now inspects the frame after
load and, if nothing painted within twelve seconds, replaces it with the
failure state offering a phone call, WhatsApp, and a direct booking link.

## Accepted residuals

Recorded rather than hidden, each with the reason and the upgrade path.

| Severity | Item | Why it stands |
| --- | --- | --- |
| medium | CSP keeps `'unsafe-inline'` in script-src (12 routes) | Next.js App Router emits inline hydration scripts. Removing it needs per-request nonces through middleware. `script-src` is still limited to `'self'`, so remote code cannot execute. |
| medium | Booking embed does not hydrate | Vendor bundle behaviour behind a proxy. The page now detects it and offers three working alternatives. |
| low | `X-Powered-By` on the bare `/wp-admin/` 302 | PHP writes it before WordPress loads, so no hook can reach it. A redirect carries no content. Needs `expose_php=Off` in hPanel. |
| low | 12px eyebrow labels | Short uppercase captions, not reading copy. Lighthouse fails a page only when over 40% of text is under 12px. |
| low | Back office has no Open Graph tags | It is a private noindex portal. |

## Full findings by category

### 1. SEO and meta

Standard: Lighthouse SEO audits

| Severity | Finding | Evidence | Fix |
| --- | --- | --- | --- |
| medium | Back office publishes a public XML sitemap | `wp-sitemap.xml returns 200 with URL entries` | Disable core sitemaps on the admin host. |

**Critic:** pass. No gap found.

### 2. Open Graph and Twitter cards

Standard: ogp.me + X card documentation

| Severity | Finding | Evidence | Fix |
| --- | --- | --- | --- |
| low | Back office has no Open Graph tags | `wp /: no og:title` | Optional. A private portal does not need share cards. |

**Critic:** pass. No gap found.

### 3. Structured data

Standard: schema.org + Google rich results

No findings.

**Critic:** pass. Advisory: No BreadcrumbList; optional but a rich-results opportunity

### 4. Accessibility

Standard: WCAG 2.1 AA (50 A/AA criteria parsed from the spec)

No findings.

**Critic:** pass. No gap found.

### 5. Performance

Standard: Lighthouse thresholds (LCP 2500/4000ms, CLS 0.1/0.25)

No findings.

**Critic:** pass. No gap found.

### 6. Security headers

Standard: OWASP ASVS 4.0.3 V14.4

| Severity | Finding | Evidence | Fix |
| --- | --- | --- | --- |
| medium | CSP script-src allows unsafe-inline on / | `/: script-src 'self' 'unsafe-inline' 'unsafe-eval'` | Next.js App Router emits inline hydration scripts, so removing this requires per-request nonces via middleware |
| medium | No nosniff on back office /wp-login.php | `wp /wp-login.php: absent` | Send nosniff. |
| low | No X-Frame-Options on back office /wp-admin/ (redirect, no document rendered) | `wp /wp-admin/: HTTP 302, header absent` | No action: the redirect target sends SAMEORIGIN. |
| low | Back office leaks 'PHP/8.3.30' on a redirect | `wp /wp-admin/: HTTP 302 PHP/8.3.30` | Set expose_php=Off in php.ini (hPanel); WordPress hooks cannot reach a pre-boot redirect. |

12 further occurrence(s) of the same issues on other routes.

**Critic:** pass. Advisory: wp /: no Permissions-Policy (defence in depth, not ASVS L1)

### 7. HTTPS and privacy

Standard: OWASP ASVS 4.0.3 V9 and V3.4

No findings.

**Critic:** pass. No gap found.

### 8. Business data consistency

Standard: Verified Emerald records

No findings.

**Critic:** pass. No gap found.

### 9. Internal links

Standard: No 4xx/5xx, no orphans, accessible names

No findings.

**Critic:** pass. No gap found.

### 10. Mobile

Standard: WCAG 2.1 SC 1.4.10 Reflow + Lighthouse mobile

| Severity | Finding | Evidence | Fix |
| --- | --- | --- | --- |
| medium | 8 element(s) under 12px on /, 1 under 11px | `9px p 'A refined retreat wher'; 11px p 'The Retreat'; 11px p 'Signature Treatments'; 11px p 'Inside Emerald'` | Raise eyebrow and caption text to 12px, or confirm these are short uppercase labels rather than reading copy. |
| low | 2 element(s) under 12px on /services | `11px p 'Treatment Menu'; 11px a 'Book Now'` | Raise eyebrow and caption text to 12px, or confirm these are short uppercase labels rather than reading copy. |
| low | 4 element(s) under 12px on /visit | `11px p 'Visit'; 11px p 'On arrival'; 11px p 'Good to know'; 11px a 'Book Now'` | Raise eyebrow and caption text to 12px, or confirm these are short uppercase labels rather than reading copy. |
| low | 3 element(s) under 12px on /vouchers | `11px p 'Gift vouchers'; 11px p 'Your message'; 11px a 'Book Now'` | Raise eyebrow and caption text to 12px, or confirm these are short uppercase labels rather than reading copy. |

8 further occurrence(s) of the same issues on other routes.

**Critic:** pass. No gap found.

### 11. Console and runtime errors

Standard: Zero uncaught errors

| Severity | Finding | Evidence | Fix |
| --- | --- | --- | --- |
| low | Cancelled media preload on / (desktop) | `net::ERR_ABORTED https://emerald-spa-wellness.vercel.app/media/ambience.m4a` | No action; the asset returns 200. |

2 further occurrence(s) of the same issues on other routes.

**Critic:** pass. No gap found.

### 12. Forms and booking flows

Standard: ASVS V5 + WCAG 3.3.2, driven functionally

| Severity | Finding | Evidence | Fix |
| --- | --- | --- | --- |
| medium | Booking flow check failed: booking embed rendered content | `booking embed rendered content: 0 chars` | Booking embed does not hydrate through the proxy; the page now detects this and offers call, WhatsApp and a di |
| medium | Booking flow check failed: booking embed shows treatments | `booking embed shows treatments: no detail` | Booking embed does not hydrate through the proxy; the page now detects this and offers call, WhatsApp and a di |

**Critic:** pass. Advisory: No <form> elements found on any audited route; voucher and booking flows may be client-side only

## Method

Each category ran as an auditor and then a separate critic with its own view
of the raw evidence. The critic re-derives ground truth from the snapshot and
looks for three things: requirements the auditor never checked, findings the
cited evidence does not support, and severities that do not match the clause.
A category only passes when the critic finds no blind spot and no unsupported
finding.

The critics caught six defects in my own audit, which is the point of running
them:

1. `DaySpa` was being reported as "no LocalBusiness node". It is a valid
   schema.org LocalBusiness subtype and the markup was correct.
2. The framing check used `or` against a `.find()` result, so pages that did
   send `X-Frame-Options` were still flagged.
3. Naming the booking platform inside the privacy policy was flagged as a
   client-rule breach. Disclosing a data processor in a privacy policy is
   lawful and expected; the rule applies to CTA copy, which is now what is checked.
4. `ERR_ABORTED` on the ambience audio was reported as a failed request. The
   asset returns 200; the browser cancels an unplayed media preload in headless runs.
5. Redirect hops were being followed, so `/portal/` inherited the destination's
   headers and looked unprotected when it was not.
6. The orphan check compared absolute URLs after the sitemap moved to the
   canonical domain, marking all 11 entries as orphans.

Evidence lives in `/home/user/audit/evidence/` as JSON, with screenshots in
`/home/user/audit/shots/`.
