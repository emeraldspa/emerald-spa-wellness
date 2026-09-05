# CONTENT_PLAN

## Source of truth

`src/data/business.json`, extracted from the live Fresha venue record on
2026-08-12. Every price, name, rating, review, hour, and contact detail on the
site is read from that file at build time.

## Rules applied

- No invented metric, testimonial, price, credential, or claim.
- The spa's own description is used verbatim, not rewritten.
- Guest reviews are reproduced exactly as written, with the author name and
  date shown as Fresha records them.
- No em dashes.
- Prices are labelled as current Fresha listings, with a note that the price
  confirmed at booking is the one that applies.

## Per page

| Page | Question it answers | Primary CTA | Proof shown |
| --- | --- | --- | --- |
| Home | Is this place right for me | Book Your Escape | Rating, review count, service count, real photographs, three guest reviews |
| Services | What can I get and what does it cost | Book Your Escape | 90 services with prices and durations across 13 categories |
| Gallery | What does it actually look like | Header CTA | 6 room photographs plus 4 of the spa's own graphics, kept separate |
| Team | Who will treat me | Header CTA | 6 named professionals with individual ratings |
| Visit | Where is it and when is it open | Book Your Escape | Address with directions, phone, WhatsApp, 7 day hours, amenities |
| Brand | What is the design system | None | Sampled palette, type, motion rules |
| Privacy | What happens to my data | None | Honest description of a site with no tracking and no forms |
| Terms | What am I agreeing to | None | Pricing, cancellation, health disclosure, review provenance |

## Verification items

None outstanding. Every published fact traces to the Fresha record.

## Round 3 additions

- Tagline (client): "Relax the body, renew the mind, rejuvenate the soul".
- Ownership line: "Proudly Namibian" (replaces woman/indigenous owned wording).
- Promotions: Besties Package for 2/4/6 at N$1,700 / N$3,000 / N$4,500, no duration shown.
  Massage packages: choose your massage (Swedish/Aromatherapy/Hot Stone) plus snack platter and
  hydrotherapy for One / Two / Three at N$1,000 / N$1,700 / N$2,400, no duration shown.
- Products section lists the skincare used (BioMedical Emporium) with descriptions only, never a price.
- Venue stories use the client's own footage and photography only; no stock.

## Content Manager content types (Round 13)

Editable without code at /admin, each backed by a JSON file in the repository:

| Content type | File | Shown on |
|---|---|---|
| Specials and Promotions | src/data/business.json (categories.promotions.items) | /promotions, /book-bulk |
| Treatments and Prices | src/data/business.json (all 13 categories) | /services, booking pages |
| Guest Reviews | src/data/business.json (reviews) | home spiral |
| Team Members | src/data/business.json (team) | /team |
| Products | src/data/products.json | /brand, home |
| Journal Posts | src/data/cms/journal.json | /journal, sitemap |
| Announcements | src/data/cms/announcements.json | site-wide floating notice |
| FAQ | src/data/cms/faqs.json | /visit |

Writing rules for generated copy live in src/lib/cms/compose.ts and follow the
copywriting skill: clarity over cleverness, benefits over features, specific
over vague, customer language, honest over sensational, no AI-tell phrases,
no exclamation marks, and never a fact the notes did not contain.

## Round 14 update (2026-09-05)

The Content Manager layer and its data files (src/data/cms/*, products.json,
AnnouncementCard) were removed at the client's request. The content sources of
truth are again: src/data/business.json (services, prices, reviews, team),
src/data/products.ts (products), src/data/journal.ts (house stories) and the
live WordPress layer (journal posts), exactly as in Round 12. Announcements no
longer render anywhere.
