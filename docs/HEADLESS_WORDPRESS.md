# Headless WordPress for Emerald

Written for the Emerald build. Nothing here is connected yet: this is the plan,
the reasoning, and the exact steps for when you are ready.

## What is actually there today

Checked on 18 August 2026 against the live host.

| Fact | Value |
| --- | --- |
| WordPress URL | `https://admin.emeraldspacc.com` |
| Site title | Emerald Admin |
| WordPress version | 7.0.4 |
| Theme | Twenty Twenty Five |
| REST API | Open and responding at `/wp-json/` |
| Posts | 1 |
| Pages | 0 |
| Media items | 0 |
| Host | Hostinger, PHP 8.3.30 |
| Nameservers | `ns1.dns-parking.com`, `ns2.dns-parking.com` |

So the install is real and reachable, but empty. That is the ideal moment to
decide what it should own, because nothing has to be migrated.

## What headless means here, in plain terms

Right now every word on the website lives in the code. Changing a price means
changing a file and redeploying. Headless splits that in two:

- **WordPress becomes the place where content is typed.** Your staff log in,
  write a blog post, upload a photograph, set a promotion, and press publish.
- **This Next.js site stays the thing visitors see.** It asks WordPress for the
  content, then renders it in the design we have built.

Visitors never see `admin.emeraldspacc.com`. It is a back office. The public
address stays the fast, styled site.

The important part: WordPress being slow or ugly does not matter, because
nobody browses it. You only ever see the editor.

## What WordPress should own, and what it should not

Based on what you asked for.

### Good candidates

| Content | Why WordPress suits it |
| --- | --- |
| Blog and journal posts | Changes often, benefits from an editor, no structure risk |
| Team members | Staff change; a name, role, and photograph is a simple record |
| Gallery additions | Uploading a photograph is the single most common request |
| Promotions | Time limited, and you want to change them without calling anyone |
| Announcements | Short lived notices, holiday hours, closures |

### Keep in the code, at least for now

| Content | Why |
| --- | --- |
| The 90 service prices | They already come from the booking system, which is the source of truth. Two editable copies of a price is how prices go wrong. |
| Addresses, phone, hours | These feed structured data for Google. A typo here costs search visibility. |
| Legal pages | Rarely change, and should change deliberately. |

This split is the honest recommendation. Putting everything into WordPress on
day one sounds tidy and usually creates two conflicting versions of the truth.

## Promotions as popups, and dedicated pages

You asked whether promotions could be both. They can, and the mechanism is the
same one the voucher popup already uses.

The model that works:

- Each promotion in WordPress has a title, an image, body text, a start and end
  date, and one checkbox: **show as popup**.
- The site fetches promotions. Any promotion whose dates include today and has
  the checkbox ticked becomes the popup, using the same restrained rules as the
  voucher popup: appears after a delay, once, dismissible, remembered.
- Every promotion, popup or not, also gets its own page at `/offers/the-slug`,
  so it can be linked from Instagram or WhatsApp.

That gives you one place to type, two places it appears, and an automatic
expiry so an old offer cannot linger.

## Other things worth putting in WordPress

Beyond what you listed, these are worth considering because they change often
and are cheap to model:

- **Opening hours exceptions.** Public holidays, early closures. A single
  editable notice beats editing code every December.
- **Staff spotlights.** A short profile tied to a team member, used on the team
  page and reusable in a post.
- **Frequently asked questions.** These accumulate naturally from WhatsApp
  messages and are ideal for search traffic.
- **Testimonials you collect yourself.** Only ones you actually receive. The
  site already shows verified booking reviews, so these would be additional and
  must be clearly attributed.

## About Scrapling

You linked `github.com/D4Vinci/Scrapling` and asked for the best way. Here is
the straight answer.

Scrapling is a scraping framework. Scraping means reading a website's rendered
HTML from the outside and guessing at the structure, usually because you have
no other way in. It is genuinely good at that, and it is the right tool when you
do **not** control the source. It is what would be reached for against a site
that offers no API and no cooperation.

That is not this situation. You own the WordPress install, and WordPress ships a
proper JSON API. Fetching `/wp-json/wp/v2/posts` returns clean structured data:
title, content, date, featured image, categories, all typed and stable.

Scraping your own WordPress would mean:

- Parsing HTML that changes whenever the theme changes.
- Losing the structured fields and having to infer them back from markup.
- Running a browser to render pages that already have a machine readable form.
- Breaking silently the first time an editor changes a layout.

The API cannot break in those ways, because it is a contract rather than a
side effect of a theme.

So: keep Scrapling in mind for reading sources you do not control. For
`admin.emeraldspacc.com`, use the REST API. That is not a smaller tool, it is
the correct one.

## The recommended shape, when you connect it

1. **Install two plugins** on WordPress: Advanced Custom Fields, to add the
   structured fields promotions and team members need, and a plugin that exposes
   those fields to the REST API. Both are standard and free.
2. **Create the content types.** Promotions, team members, and posts. Keep the
   fields few and obvious: a promotion is a title, image, body, start date, end
   date, and the popup checkbox.
3. **Fetch on the server, not in the browser.** The Next.js pages request
   WordPress while rendering, so visitors never wait on WordPress and its
   address never appears in their network tab.
4. **Cache and revalidate.** Fetch with a revalidation window, for example one
   hour, so the site serves instantly and still picks up edits without a
   redeploy. A publish can also trigger an immediate rebuild through a webhook
   if you want changes live within seconds.
5. **Always keep a fallback.** If WordPress is down, slow, or empty, the page
   must render the existing content rather than an error. This is the single
   most important rule, and it is why the current build stays fully static until
   the content actually exists.
6. **Lock the back office down.** Strong admin passwords, two factor if
   possible, and `admin.emeraldspacc.com` marked as noindex so it never competes
   with the real site in search results.

## Why nothing is wired up yet

Two honest reasons.

First, WordPress currently has one post and no pages or media. Connecting the
site to an empty source would either show empty sections or force placeholder
content, and placeholders have a way of going live.

Second, once a page depends on WordPress, that page's reliability becomes
Hostinger's uptime as well as Vercel's. That trade is worth making for a blog.
It is not worth making for your address and opening hours.

The moment there is real content in WordPress, the fetch layer described above
is a small, contained piece of work.

## Domain recommendation

Separate from headless, but related, because both touch DNS.

`emeraldspacc.com` currently shows the Hostinger default page. `www` and the
root both resolve to Hostinger. The WordPress install sits on the `admin`
subdomain.

The recommendation is to point the main domain at this site and leave `admin`
where it is:

| Host | Type | Points to | Purpose |
| --- | --- | --- | --- |
| `@` | A | Vercel's IP | The public website |
| `www` | CNAME | Vercel's target | Redirects to the main site |
| `admin` | unchanged | Hostinger | The WordPress back office |

Why this order matters: the domain is where your Google listing, your business
cards, and your Instagram bio all point. Every day it shows a default page is a
day that traffic lands nowhere. The WordPress connection can happen later
without touching the main domain again, because `admin` is a separate record.

Exact values should be read from the Vercel dashboard at the time you add the
domain, because Vercel issues the specific IP and CNAME target per project.
Do not copy IPs from a tutorial.
