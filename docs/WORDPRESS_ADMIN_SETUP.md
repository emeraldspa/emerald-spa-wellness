# WordPress Back Office — Setup & Operations

Current state of `admin.emeraldspacc.com` after Round 23 (7 Sep 2026).
Secrets live with the client, never in this public repo.

## Accounts (role split)

| Account | Role | Purpose |
|---|---|---|
| `admin@emeraldspacc.com` | Administrator | Master back-office key |
| `tangi@tangison.com` | Editor | Content only — no plugins, themes, settings, users |
| `ai-agent` | Author | Machine account for REST gallery writes + MCP content actions, authenticated by a scoped application password |

Three users total. Application passwords authenticate the agent; revoking
one kills its access instantly.

## Plugin stack (all current, zero pending updates)

- **WPGraphQL** + **WPGraphQL for ACF** — headless query layer; ACF fields
  exposed to the frontend (bridge installed Round 23).
- **ACF** (free; Pro is a licence upgrade, drop-in) + **Custom Post Type UI**
  — structured content: Promotions, Treatments, Guest Reviews.
- **MCP Adapter** (official WordPress release v0.6.1) + **Enable Abilities
  for MCP** — AI-agent control plane. MCP endpoint: `/wp-json/mcp`.
  Abilities off by default; per-user activity log; agent binds to the
  `ai-agent` user. claude.ai OAuth custom connector available behind one
  toggle (Settings → WP Abilities → Connection).
- **Admin Site Enhancements** — minimalist editor experience. Known issue:
  its settings page returns HTTP 500 on this host (pre-existing, both
  9.1.0 and 9.1.1); modules still function; diagnosis = read Hostinger PHP
  error log. Do not delete the plugin.
- **LiteSpeed Cache** — Hostinger server cache.
- **Emerald Back Office / Emerald Hardening / Emerald Headless GraphQL** —
  branded login + dashboard widget; HSTS, no user enumeration, XML-RPC off;
  exposes the three CPTs to GraphQL.

## Theme

Exactly one: **Twenty Twenty-Five** (core-maintained, auto-updated). The
frontend is headless on Vercel, so theme risk to the public site is zero.

## Bot discouragement (backend host)

- WordPress "Discourage search engines" is ON.
- The host serves a **physical robots.txt**; it must be replaced with
  `User-agent: * / Disallow: /` via the Hostinger file manager (WP cannot
  override a static file).
- Recommended `.htaccess` addition: `Header set X-Robots-Tag "noindex, nofollow"`.

## Deployment chain

GitHub (`main`) → Vercel build → emeraldspacc.com. WordPress is the back
office only; visitors never see it. GraphQL queries happen server-side
with ISR revalidation; a GraphQL outage degrades gracefully to static
content, per the headless design rules.

## Operational cadence

- Plugin updates: Hostinger mu-plugin (`hostinger-auto-updates.php`) owns
  auto-updates; keep zero pending by updating before it acts.
- Before each plugin round: take an hPanel backup; test on staging.
- Rotate credentials when staff change; revoke agent passwords when flows
  are retired.

## Round 24 addendum (7 Sep 2026)

- `wordpress/mu-plugins/emerald-admin-suite.php` added to the repo: validated
  mu-plugin delivering the custom dashboard (single Emerald welcome widget,
  clean slate), bot discouragement (robots.txt, X-Robots-Tag on admin surfaces,
  XML-RPC off, REST user enumeration blocked, scanner-bot 403 on wp-login only),
  content-editor menu scope, and login branding. Install: copy to
  `wp-content/mu-plugins/`. Overlaps with Emerald Hardening are harmless
  (identical filters). Full HTTP-verified in WordPress Playground
  (WP 7.1 / PHP 8.3); evidence in the Round 24 playbook.
- Account provisioning code and the reproducible Playground blueprint live
  with the client (delivered alongside the playbook); they contain
  credentials and stay out of this public repository.

## Round 27 addendum (9 Sep 2026, afternoon)

- **Role swap (client order executed):** `tangi@tangison.com` is Administrator
  again (superadmin; a fresh password was set and delivered privately - the
  old TheGreat.07 password no longer logged in, so rotate after first login).
  The Emerald account `admin@emeraldspacc.com` is now **Editor** (content
  only). Site notification email (`admin_email`) is now
  `admin@emeraldspacc.com`, per the instruction that the Emerald address
  replaces the Tangison one.
- **Emerald Back Office v1.1.2** (deployed as the `emerald-backoffice`
  plugin; source copy in `wordpress/plugins/emerald-backoffice.php`):
  branded login (light lockup served from the public site), front splash
  (the back-office root renders one calm branded card with no theme header
  or footer), tags enabled on the promotion CPT (`post_tag` registered at
  init priority 99, after CPT UI), and a one-time activation hook that
  moved `admin_email` off the Tangison address.
- **Specials content:** the three running promotions were rewritten (copy,
  was-prices, includes lists, badge enum values, tags, featured 1200x630
  share images, media ids 125-133) and six holiday specials were created as
  drafts with full ACF data, tags and share images: Christmas Grace Package
  (1 Dec-5 Jan), New Year Renewal (27 Dec-31 Jan), Valentine's for Two
  (7-14 Feb), Mother's Day Pamper (1-9 May), Independence Retreat
  (15-22 Mar), Midweek Escape (evergreen). Drafts are invisible until an
  editor publishes them in season.
- **Banking:** branch code 282273 (Maerua Mall) confirmed by the client and
  added to the payment card.
- **Update state:** WPGraphQL patched to 2.22.3.
  **WPGraphQL for ACF 3.0.0 deliberately deferred** - breaking changes
  (explicit show_in_graphql opt-in). Upgrade in a tested round: hPanel
  backup, update, GraphiQL verification, public-site check. The ASE
  settings-page 500 remains a known pre-existing host issue.
- **Automation:** application password "Emerald Frontend Automation 2" on
  the Emerald account (editor scope). Revoke under Users -> Profile ->
  Application Passwords when this round's flows are retired.

## Round 28 addendum (9 Sep 2026) — The Emerald Website Handbook

- **The guidebook**: a 27 page PDF, `The Emerald Website Handbook`, teaching
  the spa team every screen they own (sign in, dashboard, promotions,
  treatments, reviews, media, profile) with numbered screenshots taken from
  this exact back office. No credentials inside.
- **Live now**: uploaded to the media library (attachment 146,
  `emerald-wordpress-guidebook.pdf`, 2026/09). The staff portal page
  (id 17, `Emerald Portal`) carries a third action, **Staff guidebook**,
  beside Visit the website and Staff sign in. It opens the PDF with
  `target="_blank"`, so the page the reader is on never moves.
- **Ready, pending deploy**: `wordpress/plugins/emerald-backoffice.php`
  v1.1.3 adds the same **Staff guidebook** action to the dashboard quick
  actions grid and a matching button on the front splash. The URL is
  resolved at runtime from the attachment slug, with the media path as a
  fallback. Upload the zip via Plugins, Add New, Upload, and choose
  **Replace current with uploaded**. Blocked on this round only because the
  superadmin password had been rotated as the handover advised; the editor
  account correctly sees no plugin screen.
- The handbook itself is a client deliverable and stays out of this public
  repository, like every other artifact that shows the back office.
