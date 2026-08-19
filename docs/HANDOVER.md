# Handover

Everything that is done, and the short list that needs you.

## What you need to do

Four things. Nothing else is outstanding.

### 1. Rotate the credentials you sent

They were pasted into a chat, so treat them as public. Everything below is
already built, so revoking costs nothing.

| Credential | Where to revoke |
| --- | --- |
| GitHub classic token `ghp_Kh3D...` | GitHub, Settings, Developer settings, Tokens |
| GitHub fine grained `github_pat_11CL...` | same place |
| Hostinger token `aczIihK...` | hPanel, API |
| Vercel token `vcp_8chR...` | Vercel, Account Settings, Tokens |
| WordPress password `TheGreat.07` | change it in WordPress |

The WordPress application password named **Emerald Website Sync** can stay. It
is separate from your login and can be revoked on its own from Users, Profile,
Application Passwords.

### 2. Accept the GitHub invitation

The repository is `emeraldspa/emerald-spa-wellness`, private, and it holds the
full history including all 354 media files.

Vercel is connected to the **tangison** GitHub account, but the repository was
created under **emeraldspa**. Vercel cannot see across accounts, which is why
automatic deploys are not on yet.

An admin invitation for `tangison` is already sent. Accept it here:

```
https://github.com/emeraldspa/emerald-spa-wellness/invitations
```

### 3. Connect the repository in Vercel

After accepting, in the Vercel dashboard: project `emerald-spa-wellness`,
Settings, Git, Connect, choose `emeraldspa/emerald-spa-wellness`, production
branch `main`.

From then on every push deploys itself and the manual deploy script is no
longer needed.

If Vercel still cannot see the repository, the alternative is to transfer it to
the tangison account: GitHub, repository Settings, General, Transfer ownership.
Either route works.

### 4. Point the domain

This is the one thing no token can do, and the reason is concrete:
`emeraldspacc.com` is registered at **PublicDomainRegistry**, not Hostinger.
Hostinger only answers DNS for it, and their API refuses any domain the account
does not hold the registration for. Their exact response is
`[DNS:4002] Customer does not own emeraldspacc.com`.

Both domains are already added to the Vercel project and verified. Only the
records are missing.

In the Hostinger DNS editor for `emeraldspacc.com`, remove the existing `@` and
`www` records that point at the parking IPs, then add:

| Type | Name | Value | TTL |
| --- | --- | --- | --- |
| A | `@` | `216.198.79.1` | 3600 |
| A | `@` | `64.29.17.1` | 3600 |
| CNAME | `www` | `d21fc9e3e9b7f6dd.vercel-dns-017.com.` | 3600 |

Leave the `admin` record alone. It points at WordPress.

Do not touch the MX records. Your three mailboxes depend on them, and pointing
the website has no effect on mail.

Check with `dig +short emeraldspacc.com` after an hour. The certificate is
issued automatically.

## What is already done

### Website

Live at `https://emerald-spa-wellness.vercel.app`. Twelve routes, all returning
200, zero accessibility violations, zero console errors.

### Repository

`emeraldspa/emerald-spa-wellness`, private, full history, all media committed.
The media had been silently lost twice because `public/media` matches a build
output name that the workspace snapshot discards. Being in Git ends that.

### WordPress, configured rather than described

At `admin.emeraldspacc.com`.

- An application password named Emerald Website Sync for machine writes.
- Custom Post Type UI and Advanced Custom Fields installed and active.
- A `promotion` post type registered and exposed over REST.
- One real promotion published, taken from the venue's own package data.
- The default Hello world post removed.

### Security fixes found by auditing the install

An audit written with Scrapling checked the install the way an outsider sees
it. It found five real problems. Four are fixed:

| Issue | Before | Now |
| --- | --- | --- |
| Back office indexable | Google could rank the admin domain | noindex, and search visibility off |
| Username disclosure | `?author=1` returned `/author/admin/` | redirects to the home page |
| Anonymous user listing | REST listed the account | 401 for anonymous callers |
| Version disclosure | WordPress 7.0.4 printed in the page | removed |

Two warnings remain and neither is a defect. `xmlrpc.php` answers 405 because
the file exists while the protocol is disabled, and the public domain shows the
parking page until step 4 above.

Content endpoints stay public, because the website reads them anonymously. That
was checked after the change rather than assumed.

### Headless, working end to end

The home page renders promotions from WordPress. Publish one there and it
appears on the site within fifteen minutes with no redeploy.

The fallback was tested rather than reasoned about: the site was built against a
deliberately dead WordPress host, the build succeeded, and the verified package
data rendered in place of the WordPress content. WordPress being empty, slow, or
down cannot take the website with it.

## Where to publish content

Log in at `admin.emeraldspacc.com/wp-admin`.

- **Promotions** in the left menu. Title, image, excerpt, body. The excerpt is
  what appears on the home page.
- **Posts** for a journal. Nothing reads these on the site yet; say the word and
  a journal page is a small piece of work.

Prices, address, hours and the treatment menu stay in code on purpose. They
already have a source of truth in the booking system and they feed the
structured data Google reads. Two editable copies of a price is how prices go
wrong.

## Back office portal (admin.emeraldspacc.com)

The subdomain front page is now a portal, not a bare stub. It shows the Emerald
logo, a slow slideshow of six real photographs, a short quote, and a restricted
system notice, with buttons to the public site and to staff sign in.

Where it lives in WordPress:

- Page "Emerald Portal", id 17, slug `portal`, set as the static front page.
- Template `hostinger-ai-theme//front-page`, overridden to render the page
  content with no theme header or footer.
- Media library ids 8 to 16 and 19 hold the brand and photo assets.
- The page source is also kept at `docs/admin-portal-page.html` in this repo so
  it can be restored if the WordPress copy is lost.

To change the quote or the notice, edit page 17 in the block editor. The markup
is a single HTML block, so edit it under the block's Edit as HTML view.

One manual step remains. Hostinger's edge cached the old front page for seven
days before this change. New requests are no longer cached, but copies already
held at the edge expire on their own. To clear them immediately: hPanel,
Websites, Dashboard, Clear cache; then, if the CDN is active, Performance, CDN,
Flush cache. Hosting username is `u202309731`.

### Verifying the portal yourself

`scripts/verify-portal.py` checks the live subdomain with Scrapling
(https://github.com/D4Vinci/Scrapling). Install and run:

    pip install "scrapling[fetchers]"
    scrapling install
    python3 scripts/verify-portal.py

It fetches the bare URL and a cache-busted URL with a real Chrome TLS
fingerprint, renders the page in Chromium to confirm the slideshow mounts, and
requests every photograph. Expect ORIGIN to pass on every line. BARE URL will
keep failing until the Hostinger edge cache is flushed, which is the one step
that needs hPanel access.
