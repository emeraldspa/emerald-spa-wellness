# WordPress Conversion Package - Web & Code Audit

Date: 14 September 2026 (13-14 Sep UTC session). Auditor: Emerald Webmaster.
Method: tangison-web-audit quality pass + separate complexity pass. The live Vercel
frontend is down (402), so runtime CWV/Lighthouse re-measurement is pending the
Hostinger deployment; every finding below is source-measured or live-probed.

## Evidence

| Signal | Scope/conditions | Result | Source |
|---|---|---|---|
| Front-page initial transfer | theme package, gzip | 232.2KB (budget 500KB) after fixes; was 896.7KB | audit script (gzip of css+js+fonts+LCP poster) |
| Hero poster | 1600w LCP image | 175KB WebP q48 + 55KB 800w mobile variant (was 396KB JPG) | Pillow re-encode, file sizes |
| WCAG contrast | 19 token pairs incl. dark sections | 19/19 pass (min 3.05:1 rose-gold-deep large-text; min body 4.46->n/a pair removed) | computed ratios |
| Live frontend | emeraldspacc.com, www, vercel.app | HTTP 402 x-vercel-error DEPLOYMENT_DISABLED (team soft block FAIR_USE_LIMITS_EXCEEDED since 11 Sep 17:23 UTC) | curl headers + Vercel API |
| WP backend | admin.emeraldspacc.com | wp-login 200 + hardened headers; REST TTFB 0.55s; users REST 404; XML-RPC blocked at server | curl probes |
| Promotion REST base | wp-json/wp/v2/promotion | 200 (rest_base is singular; earlier "promotions" 404 was a probe slug error, not a regression) | REST /types |
| PHP parse gate | 13 theme/plugin files | 13/13 clean (glayzzle/php-parser) | php_lint.cjs |
| Eval suite | 14 CAP + 4 REG + 6 BP | 24/24 PASS, pass@1 100%, SHIP IT (BP-6 = 34 runtime checks true in WP 6.x/PHP 8.3) | run_wp_evals.py |

### AI-generated-look verdict

**PASS.** The package reads art-directed, not templated: client's own Radley/Poppins
pairing (self-hosted, swap), one 11-token cascade palette from BRAND.md, dot-leader
menu rows, fading-border cards (the client-requested treatment), full-bleed hero with
a legibility scrim. The two gradient/backdrop-filter uses are functional (frosted
sticky header, modal scrim), not decoration. Zero slop phrases, zero em dashes,
zero uniform gray-on-color text (all pairs measured). Admin-side "glass mint"
accents (#75E0BA family) are scoped to wp-admin/login chrome by design.

## Findings (all fixed this session, re-verified)

### High
- **[Performance]** Initial transfer 896.7KB vs the 500KB budget. Hero poster 396KB
  (44%), both lockups and an unreferenced symbol double-counted into the load.
  Evidence: gzip inventory (measured). Fix: poster re-encoded to WebP q48 with a
  light smoothing pass (175KB) + 800w srcset variant (55KB); footer lockup right-sized
  1236px->600px (83->33KB); site-logo source quantized (230->51KB); dead
  symbol-photoreal.png (136KB) removed. Result: 232.2KB. **Verified: re-run PASS.**
- **[Accessibility]** No skip-to-content link and no `<main>` landmark on the front
  page (page templates had main without id). Evidence: source scan. Fix: `.em-skip-link`
  added as first header element (off-canvas, slides in on focus), `id="em-main"` added
  to all 19 template mains, front-page hero+sections wrapped in a main group.
  **Verified: re-run PASS.**

### Medium
- **[Functionality]** Ambience player could not resume: after pausing, the toggle set
  state "On" but never sent playVideo, leaving a silent player. Evidence: main.js read.
  Fix: resume path now posts playVideo when the facade exists. **Verified: code path
  reviewed; runtime BP-6 still 34/34.**
- **[Correctness]** Hours block highlighted "today" via `gmdate('l')` (UTC), wrong
  between 22:00-24:00 UTC for Africa/Windhoek. Fix: `wp_date('l')` (site timezone).
- **[Accessibility]** Specials dropdown used `role="menu"/menuitem` without arrow-key
  support (menu semantics it does not implement). Fix: disclosure pattern
  (aria-expanded + aria-controls + hidden panel).
- **[Performance]** `emerald_get_active_promotions()` ran its WP_Query up to three
  times per page (nav + cards + popup). Fix: per-request static cache.

### Low
- **[Theming]** `#FFF`/`#000`/`#999` raw hexes in main.css (mask-composite trick,
  print sheet) replaced with palette tokens; Fresha URL literal was repeated 5x,
  now one `EMERALD_FRESHA_URL` constant; one em dash in the backoffice splash title
  removed; Admin Suite logo-URL helper's dead branch cut (yagni).
- **[Docs]** CAP-3/REG-4 graders updated: they still expected the literal URL in
  patterns; they now assert the constant + target/rel invariant (grader bug, not code).

## Complexity audit (separate pass)

- delete symbol-photoreal.png from theme assets. Referenced nowhere; lives in repo
  history and Next.js public/. [wordpress/theme/emerald/assets/img/]
- yagni emerald_login_logo_url() file_exists branch. get_theme_file_uri already
  resolves the same path. [wordpress/mu-plugins/emerald-admin-suite.php]
- shrink Fresha URL literal x5 -> one define() + 6 constant reads.
  [functions.php, header.php, hero.php, home-sections.php, inc/blocks.php]
- shrink promotions WP_Query x3 per request -> static cache, 1 query.
  [wordpress/theme/emerald/functions.php]
- net: -366KB shipped assets, -4 duplicate literals, -2 queries per page. Lean otherwise.

## Positive findings

- Escaping discipline: 151 esc_* calls, zero raw echo-of-variable, zero superglobal
  reads, ABSPATH guard in all 9 PHP files.
- Fail-open content model: empty CPTs render the bundled parity snapshot; the site
  never errors when WordPress content is missing.
- Headless parity held: banking block, hours, staff roles, Fresha URL, WhatsApp
  deep links, YouTube id all graders-verified against the headless baseline.
- Premium admin stack (ASE + Admin Suite) with throttle, XML-RPC off, users REST
  hidden, scanner-bot 403s - all free plugins, matches the client decision.
- Live backend hardening confirmed by probe: users REST 404, XML-RPC blocked,
  noindex headers on login.

## Summary

Per-dimension: Performance PASS (232KB initial, deferred 2.4MB reel, lazy media) -
field CWV pending deploy. Accessibility PASS (static; screen-reader pass pending).
SEO PASS on package parity (titles/sitemap/301 docs); OG rewrite still queued from
the standing order. Security PASS (free-only stack, hardened backend, probes clean).
Theming PASS (single token source; admin chrome documented separately). Writing PASS
(zero em dashes, zero slop). Agentic browsing PASS-by-construction (semantic blocks,
real labels; WebMCP n/a).

## Recommended priority

1. Deploy with the Hostinger tokens (theme + 2 plugins + mu-plugin, plan §5) - the
   package is the fastest path off the 402.
2. Field-verify on the live host: Lighthouse mobile run on home + services, screen-
   reader spot pass, GA4 tag when the client supplies the measurement ID.
3. Standing queue after cutover: OG image/tag rewrite, guidebook + handover PDFs.

## Verification

Re-confirmed post-fix: audit script 0 FAIL / 31 PASS / 21 MEASURED; evals 24/24
(pass@1 100%); PHP parse 13/13. Still needs field/human validation: CWV on real
Hostinger hosting (LiteSpeed cache), cross-browser spot checks, screen-reader pass,
GA4. Unresolved by design: Vercel soft block auto-resets 5 Oct but the frontend is
being retired by this conversion.
