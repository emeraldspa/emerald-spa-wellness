# Pointing emeraldspacc.com at the website

## Why this one step is manual

The Hostinger API token works and has full scope. It still cannot edit this
zone, and the reason is worth knowing: `emeraldspacc.com` is registered at
**PublicDomainRegistry**, not at Hostinger. Hostinger only answers DNS for it.
Their DNS API refuses any domain the account does not own as a registration,
which it reports as `[DNS:4002] Customer does not own emeraldspacc.com`.

Verified while setting this up:

- Hostinger portfolio lists the domain, so the token is not the problem.
- `GET` and `PUT` on the zone both return 403 with the same message.
- RDAP confirms the registrar is PDR Ltd and the domain is on
  `client transfer prohibited`.

So the records below have to be entered by hand, once.

## What is already done

Both domains are added to the Vercel project and Vercel has verified
ownership. The only thing missing is the DNS pointing at it.

## The records

In the Hostinger DNS editor for `emeraldspacc.com`.

**Delete** the existing records for `@` and `www` that point at the parking
IPs, then add:

| Type | Name | Value | TTL |
| --- | --- | --- | --- |
| A | `@` | `216.198.79.1` | 3600 |
| A | `@` | `64.29.17.1` | 3600 |
| CNAME | `www` | `d21fc9e3e9b7f6dd.vercel-dns-017.com.` | 3600 |

**Leave `admin` exactly as it is.** That record points at the WordPress back
office and must not change.

If the editor refuses two A records on `@`, use the single older value
`76.76.21.21` instead. Both are valid Vercel targets; the pair is preferred.

## Afterwards

DNS usually settles within an hour. To confirm:

```
dig +short emeraldspacc.com
dig +short www.emeraldspacc.com
```

The first should return the Vercel A records, the second the CNAME target.

Vercel issues the certificate automatically once the records resolve, so
HTTPS needs no action.

## Mail

`bookings@`, `info@` and `complaints@` are on this domain. Pointing `@` and
`www` at Vercel does not affect mail, because mail is routed by MX records,
which are separate. Do not delete the MX records while editing.
