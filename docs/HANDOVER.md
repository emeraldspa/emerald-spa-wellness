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
