# EVAL: wordpress-conversion-package

Formal eval for the full-WordPress conversion package (block theme `emerald`,
Emerald Admin Suite v2 mu-plugin, Emerald Back Office v1.2, Emerald Core,
blueprint v2). Defined BEFORE implementation per eval-driven development.
Graders are code-based (deterministic) wherever possible; the blueprint run is
the integration grader. PHP linting is unavailable in this environment
(no php binary), so the syntax grader falls back to `php -l` when present and
otherwise to a structural bracket/tag balance check plus the blueprint's PHP
runtime (which fatals on any syntax error) as the authoritative syntax grader.

## Capability Evals (code graders)

- [ ] CAP-1 theme-json-valid: `wordpress/theme/emerald/theme.json` parses; `version` is 3; palette slugs ink, ground, emerald, emerald-deep, rose-gold, cream, muted, hairline all present; fontFace entries reference radley + poppins files that exist on disk.
- [ ] CAP-2 php-syntax: every `.php` file under `wordpress/` passes `php -l` if php exists, else passes bracket/tag balance check, else must be covered by a clean blueprint run (BP-1).
- [ ] CAP-3 fresha-anchor: `EMERALD_FRESHA_URL` is defined exactly once in functions.php with the exact Fresha booking URL `https://www.fresha.com/book-now/emerald-spa-wellness-centre-qnp9ba1m/all-offer?share=true&pId=1477270`, and the Book Now anchors (header, hero, home-sections CTA, specials cards, popup, treatment menu) emit it through `esc_url()` with `target="_blank"` and `rel="noopener noreferrer"`.
- [ ] CAP-4 banking-parity: the footer contains Emerald Spa Gold Business, FNB, 64287404716, Maerua Mall, 282273, full-name reference note, wallet 081 607 7143, proof-of-payment via WhatsApp.
- [ ] CAP-5 youtube-music: track id `Q5u2Ddbvocc` present; music JS starts muted; mute control is at least 48x48 px on mobile (CSS check).
- [ ] CAP-6 specials-dropdown: a server-rendered specials dropdown (querying the `promotion` post type) is registered by the theme and referenced in the header part; JS supports click + keyboard (Enter/Escape) on the dropdown.
- [ ] CAP-7 popup-focus-trap: popup implementation traps focus and closes on Escape; dismissal persisted (localStorage/sessionStorage).
- [ ] CAP-8 staff-roles: bundled staff data carries `Laurensia Post` as `Spa Manager` and `Merie-Ann (Lulu)` as `Spa Therapist`.
- [ ] CAP-9 journals-absent: no journal menu link, journal CPT, or Journal Posts dashboard button anywhere in the new package; redirect plan for /journal present in docs.
- [ ] CAP-10 login-premium: Admin Suite v2 login CSS includes the emerald glow backdrop, glass card, brand lockup background, rounded inputs; a transient-based login throttle (5 attempts / 15 min) exists; generic login error retained.
- [ ] CAP-11 fonts-local: woff2 files for Radley 400 and Poppins 400/500/600 exist under the theme fonts directory and are referenced by theme.json fontFace.
- [ ] CAP-12 brand-tokens: theme CSS/JSON uses BRAND.md tokens (07211A, 087452, 0A5A45, F7F5F1, EAF6F1, C77B36 or F2C35E, D7E3DD); no paid-plugin or Wordfence references in the package.
- [ ] CAP-13 screenshot: `wordpress/theme/emerald/screenshot.png` exists at 1200x900.
- [ ] CAP-14 splash-retire: Back Office v1.2 front splash no longer renders when the home host is the public domain (auto-retire after cutover); logo constant no longer points at the Vercel-served URL.

## Regression Evals (vs headless baseline)

- [ ] REG-1 routes: every route in `src/app/sitemap.ts` has a WordPress mapping (page pattern, template, or documented 301) - pay, book-bulk, vouchers, specials, whatsapp, venues, services, gallery, team, visit, privacy, terms included.
- [ ] REG-2 whatsapp: a wa.me deep link (+264856077143 digits) is present for enquiries.
- [ ] REG-3 hours-parity: opening hours in the footer/visit pattern match the source data (Mon-Sat 9:00 AM - 6:00 PM, Sun 10:00 AM - 4:00 PM).
- [ ] REG-4 fresha-undisturbed: Book Now anchors keep target=_blank so the site is never disturbed by booking.

## Integration Evals (blueprint, code-graded run output)

- [ ] BP-1 blueprint-exit-0: Playground blueprint run exits 0.
- [ ] BP-2 theme-active: run reports THEME=Emerald active.
- [ ] BP-3 ase-active: admin-site-enhancements plugin active.
- [ ] BP-4 promo-query: a seeded promotion is returned by the theme's dropdown query path.
- [ ] BP-5 login-branding: login branding filter + CSS detectable via runPHP.
- [ ] BP-6 no-fatals: no PHP fatal/notice in the run log.

## Success Metrics

- Capability: pass@3 >= 0.90 target; every CAP must pass before ship (pass@1 preferred).
- Regression: pass^3 = 1.00 required (they are cheap deterministic checks).
- Integration: BP-1..BP-6 all pass in a single final run (pass^1 = 1.00).

## Status log

(append run history below)

- 14 Sep 2026 run: 19/24 PASS (10/14 CAP, 3/4 REG, 6/6 BP). Report: wordpress-conversion-package-report.md

- 14 Sep 2026 run: 24/24 PASS (14/14 CAP, 4/4 REG, 6/6 BP). Report: wordpress-conversion-package-report.md

- 14 Sep 2026 run: 23/24 PASS (13/14 CAP, 4/4 REG, 6/6 BP). Report: wordpress-conversion-package-report.md

- 14 Sep 2026 run: 23/24 PASS (13/14 CAP, 4/4 REG, 6/6 BP). Report: wordpress-conversion-package-report.md

- 14 Sep 2026 run: 24/24 PASS (14/14 CAP, 4/4 REG, 6/6 BP). Report: wordpress-conversion-package-report.md
