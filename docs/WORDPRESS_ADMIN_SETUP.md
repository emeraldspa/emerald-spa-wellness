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
