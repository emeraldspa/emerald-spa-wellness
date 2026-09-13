# Emerald — full-WordPress block theme

One WordPress install on Hostinger serves the public site and wp-admin from
emeraldspacc.com. No Vercel, no WPGraphQL, no headless plumbing: edits in
wp-admin are live on the next page load.

## Install

1. Zip the `emerald/` folder (or upload it to `wp-content/themes/`).
2. Appearance → Themes → Activate **Emerald**.
3. Settings → Reading: **Your homepage displays: A static page** is NOT
   required — the theme's `front-page` template renders the home design
   automatically. Create an empty page titled "Home" only if you prefer to
   manage the homepage through the editor.
4. Create the pages with these exact slugs (the theme ships a template for
   each): `services`, `specials`, `team`, `visit`, `gallery`, `venues`,
   `vouchers`, `pay`, `book-bulk`, `whatsapp`, `privacy`, `terms`.
5. Settings → Permalinks: Post name. Save twice (flushes rewrites).
6. Site Identity: upload `lockup-stacked-dark.png` as the site logo, or skip
   — the header falls back to the site title wordmark.

## Plugins (free only, nothing else without sign-off)

| Plugin | Role |
| --- | --- |
| Advanced Custom Fields (free) | `price_nad`, `duration`, `starts_on`, `valid_until`, `show_as_popup` on Specials |
| Rank Math SEO (free) | meta, sitemap, robots, canonical, OG, LocalBusiness JSON-LD, redirects |
| LiteSpeed Cache | page cache, minify, WebP, lazy load (Hostinger is LiteSpeed) |
| Admin Site Enhancements (ASE, free) | admin/dashboard configuration per the client decision — replaces Wordfence's dashboard role |
| Redirection (free) | 301 map, including every /journal path |
| UpdraftPlus (free) | scheduled backups |
| Converter for Media (free) | WebP on upload |
| Emerald Core (bundled, `wordpress/plugins/`) | content types: promotion, treatment + category, testimonial, staff (registers a type only when absent) |
| Emerald Back Office (bundled, `wordpress/plugins/`) | dashboard quick actions, guidebook door, back-office splash (retires itself on the public host) |
| Emerald Admin Suite (bundled, `wordpress/mu-plugins/`) | premium login, login throttling, XML-RPC off, REST user enumeration off, security headers, bot discouragement, dashboard polish |

Wordfence is deliberately NOT part of the stack (client decision): its two
useful jobs are covered elsewhere — throttling and hardening live in the
Admin Suite mu-plugin, admin configuration lives in ASE.

## Content

- **Specials** (`wp-admin → Specials`): title, excerpt, featured image, and
  the ACF fields. Leave dates empty for "always on". Tick *show as popup*
  for the one special that may interrupt visitors (dismissed per day).
  The header dropdown, the specials page, the home section and the popup
  all read from this one list. Slugs starting with `demo-` never display.
- **Treatments**: the menu renders from the `treatment` type when populated
  (category term = section, `price_nad`/`duration` meta respected).
  Until then it renders the bundled parity snapshot of the 93-item menu.
- **Team**: renders the bundled snapshot (verified 10 Sep 2026: Laurensia
  Post = Spa Manager, Merie-Ann (Lulu) = Spa Therapist) until `staff`
  entries exist with photos.
- **Guest reviews**: `testimonial` posts first, bundled snapshot second.

## Design tokens (BRAND.md)

ink `#07211A` · ground `#F7F5F1` · emerald `#087452 / #0A5A45 / #063F31` ·
rose gold `#F2C35E / #C77B36` · cream `#EAF6F1` · mist `#C7E9DA` ·
muted `#4F6B62` · hairline `#D7E3DD`.
Display: Radley 400. Interface: Poppins 400/500/600 (self-hosted woff2,
preloaded). Motion: 0.28s response, 0.6s entrance, once-only reveals.

## Behaviour notes

- Book Now always opens Fresha in a new tab with `rel="noopener noreferrer"`
  — the site is never disturbed by booking.
- Hero reel: poster paints instantly; the 22.4s VP9/WebM attaches after
  window load and is skipped under reduced motion or Data Saver.
- Ambience: YouTube facade (Q5u2Ddbvocc). Nothing loads until the visitor
  opts in; playback starts muted with an always-visible 48px toggle.
- Popup: focus trap, Escape, once-per-day dismissal.
- Cards: fading gradient border, float-on-hover, complete CTAs.
