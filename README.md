# Emerald Spa & Wellness Centre

Production website for Emerald Spa & Wellness Centre, Blackett Street No. 7,
Windhoek West, Windhoek, Khomas Region, Namibia.

## Stack

Next.js 14 App Router, React 18, TypeScript, Tailwind CSS 3, Framer Motion for
scroll entrances, Lucide React for icons. All routes are static.

## Content

Every fact on the site is sourced from the venue's live Fresha record and is
committed to `src/data/business.json`. Nothing is invented. See `BUILD_PLAN.md`
for provenance and the full decision log.

## Local development

```bash
npm install
npm run dev
```

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Deployment

Vercel. Set `NEXT_PUBLIC_SITE_URL` to the production origin so canonicals,
sitemap, robots, and structured data emit absolute URLs.

Made by Tangison Studio.
