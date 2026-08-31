/**
 * House journal slugs, alone, so the edge middleware can import the list
 * without pulling the full article bodies into the edge bundle.
 *
 * journal.ts is the source of truth for the stories themselves; the two lists
 * are kept identical (a slug here without a story there would 404 a real
 * page, and a story without a slug here would 404 its own article).
 */
export const HOUSE_JOURNAL_SLUGS = [
  'first-time-hydrotherapy-what-to-expect',
  'swedish-aromatherapy-hot-stone-choosing',
  'why-the-facial-ritual-stays-honest',
  'venue-hire-that-started-with-a-gender-reveal',
  'quiet-corner-of-windhoek-north',
  'the-case-for-the-group-spa-day',
] as const;
