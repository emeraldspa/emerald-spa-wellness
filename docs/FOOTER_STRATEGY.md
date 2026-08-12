# Footer strategy

Two footers, chosen by what the page is for. The rule is about repetition and
intent, not about page importance.

## The problem

One 192-line footer carrying the logo, address, phone, WhatsApp, socials, a
Google review link, seven rows of opening hours, a nav list, four legal links
and a credit was rendering on every route. On pages whose entire job is to show
that same information, the footer repeated the page. On the booking page it
competed with the task.

## FooterFull

The complete marketing footer: featured logo lockup, tagline, booking CTA,
address, phone, WhatsApp, social row, Google review link, opening hours, and
the explore list.

Use it where the page is a destination and the visitor may still be deciding.
The footer is their next step.

| Route | Why |
| --- | --- |
| `/` | Entry point. Most visitors land here first and need every path onward. |
| `/services` | Long page. By the time they reach the end they need the address, hours, and a way to book. |
| `/gallery` | Browsing surface with no contact detail of its own. |
| `/team` | Same. Ends without a next step otherwise. |

## FooterMinimal

One line: mark, copyright, legal links, credit. Nothing that duplicates the
page above it.

Use it where the page already carries the contact information, or where the
page is a single task and a large footer is noise.

| Route | Why |
| --- | --- |
| `/visit` | The page is the address, the map, the hours, and the phone number. A full footer would print all of it twice on one screen. |
| `/book` | Single task. The booking frame owns the page and the contact fallbacks sit directly beneath it. |
| `/whatsapp` | Single task, one action. |
| `/privacy` | Reference reading. No decision to support. |
| `/terms` | Same. |
| `/sitemap` | Already a complete list of links. A footer nav underneath is literal duplication. |
| `/brand` | Internal reference surface. |
| `404` | Recovery links are the content. Keep the exit obvious. |

## Rules

- Every page keeps the legal links, the copyright, and the studio credit. Those
  are obligations, not decoration.
- A page never renders a link to itself in the footer nav.
- If a section of the footer repeats the primary content of the page it sits
  on, that page gets the minimal footer.
