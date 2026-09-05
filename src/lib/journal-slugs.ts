import cmsJournalData from '@/data/cms/journal.json';

/**
 * Journal slugs known to this build, alone, so the edge middleware can
 * import the list without pulling the full article bodies into the edge
 * bundle.
 *
 * The list is the house stories plus every slug written in the Content
 * Manager. journal.ts and cms/journal.json stay the sources of truth for
 * the stories themselves; the three lists are kept identical (a slug here
 * without a story there would 404 a real page, and a story without a slug
 * here would 404 its own article).
 */
const HOUSE_SLUGS = [
  'first-time-hydrotherapy-what-to-expect',
  'swedish-aromatherapy-hot-stone-choosing',
  'why-the-facial-ritual-stays-honest',
  'venue-hire-that-started-with-a-gender-reveal',
  'quiet-corner-of-windhoek-north',
  'the-case-for-the-group-spa-day',
] as const;

const CMS_SLUGS: string[] = (cmsJournalData as { slug?: string }[])
  .map((p) => (typeof p.slug === 'string' ? p.slug : ''))
  .filter((s) => s.length > 0);

export const HOUSE_JOURNAL_SLUGS: string[] = [...HOUSE_SLUGS, ...CMS_SLUGS];
