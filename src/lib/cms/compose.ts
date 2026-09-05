/**
 * Compose from notes: the writing half of the Emerald Content Manager.
 *
 * The spa owner types what happened in plain language, the way they would
 * say it to a friend, and this module turns the notes into structured,
 * publishable promotion copy. It is deliberately a deterministic text
 * engine, not an AI call: it costs nothing, works offline, never invents a
 * fact, and every suggestion stays editable before saving.
 *
 * The writing rules come from the copywriting skill and its reference
 * sheets (copy-frameworks, natural-transitions):
 * - Clarity over cleverness: the reader should never decode a line.
 * - Benefits over features: say what the guest gets, not what the box does.
 * - Specificity: name the treatments, the price, the dates. Never "save big".
 * - Customer language: the guest books rest, not "wellness solutions".
 * - Honest over sensational: nothing appears in the copy that was not in
 *   the notes. No invented statistics, no exclamation marks, no AI-tell
 *   transitions ("In today's digital landscape..." and friends).
 * - The hero follows the Human Action Model in miniature: who it is for,
 *   what the visit feels like, and a clear path to book.
 */

export type ComposeInput = {
  notes: string;
  /** Known treatment names, used to spot what the package includes. */
  knownTreatments?: string[];
};

export type ComposeOutput = {
  name: string;
  alternates: string[];
  description: string;
  price: string | null;
  priceValue: number | null;
  duration: string | null;
  validFrom: string | null;
  validUntil: string | null;
  audience: string | null;
  cta: string;
  /** What the composer found, shown to the editor as confidence cues. */
  found: string[];
};

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
];

/** Phrases this engine must never emit: the AI-tell list. */
const BANNED_PHRASES = [
  'in today\'s', 'that being said', 'it\'s worth noting', 'delve into',
  'at its core', 'this begs the question', 'look no further', 'elevate your',
  'indulge in the ultimate', 'unparalleled', 'state-of-the-art', 'seamless experience',
];

function titleCase(s: string): string {
  return s.replace(/\b([a-z])/g, (m) => m.toUpperCase());
}

function matchPrice(notes: string): { price: string | null; priceValue: number | null } {
  const m = notes.match(/(?:N\$|NAD)\s*([0-9][0-9,]*(?:\.[0-9]{1,2})?)/i);
  if (!m) return { price: null, priceValue: null };
  const value = Number(m[1].replace(/,/g, ''));
  if (!Number.isFinite(value) || value <= 0) return { price: null, priceValue: null };
  const rounded = Math.round(value);
  return { price: `NAD ${rounded.toLocaleString('en-GB')}`, priceValue: rounded };
}

function matchDuration(notes: string): string | null {
  const hours = notes.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|hr)\b/i);
  if (hours) {
    const h = Number(hours[1]);
    const minutes = notes.match(/(\d{1,2})\s*(?:minutes?|mins?)\b/i);
    if (minutes) return `${h} hr, ${minutes[1]} min`;
    return `${h} hr`;
  }
  const mins = notes.match(/(\d{2,3})\s*(?:minutes?|mins?)\b/i);
  if (mins) return `${mins[1]} min`;
  return null;
}

/** "1-24 December", "1 to 24 December", "from 5 Dec until 24 Dec", "in December". */
function matchDates(notes: string): { validFrom: string | null; validUntil: string | null } {
  const now = new Date();
  const year = now.getUTCFullYear();
  const range = notes.match(
    /(\d{1,2})\s*(?:-|–|to|until|through|till)\s*(\d{1,2})\s+([A-Za-z]+)(?:\s+(\d{4}))?/i,
  );
  const single = notes.match(/(\d{1,2})\s+([A-Za-z]+)(?:\s+(\d{4}))?/i);
  const monthOnly = notes.match(/\b(?:in|during|for)\s+([A-Za-z]+)\b/i);
  const monthIndex = (word: string): number | null => {
    const idx = MONTHS.indexOf(word.toLowerCase().replace(/[^a-z]/g, ''));
    return idx >= 0 ? idx : null;
  };

  if (range) {
    const mi = monthIndex(range[3]);
    if (mi !== null) {
      const y = range[4] ? Number(range[4]) : year;
      const from = new Date(Date.UTC(y, mi, Number(range[1])));
      const until = new Date(Date.UTC(y, mi, Number(range[2])));
      return { validFrom: iso(from), validUntil: iso(until) };
    }
  }
  if (single) {
    const mi = monthIndex(single[2]);
    if (mi !== null) {
      const y = single[3] ? Number(single[3]) : year;
      const day = new Date(Date.UTC(y, mi, Number(single[1])));
      return { validFrom: iso(day), validUntil: null };
    }
  }
  if (monthOnly) {
    const mi = monthIndex(monthOnly[1]);
    if (mi !== null) {
      const y = year;
      const from = new Date(Date.UTC(y, mi, 1));
      const until = new Date(Date.UTC(y, mi + 1, 0));
      return { validFrom: iso(from), validUntil: iso(until) };
    }
  }
  return { validFrom: null, validUntil: null };
}

function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function matchAudience(notes: string): string | null {
  const table: [RegExp, string][] = [
    [/\bcouple[s]?\b|two people|2 people|partner|spouse/i, 'Couples'],
    [/\bfriends?\b|besties|sisters?\b/i, 'Friends'],
    [/\bgroup|team|colleagues|book in bulk|group booking/i, 'Groups'],
    [/\bfamily\b|mother|mom|mum|aunt/i, 'Family'],
    [/\bbride|bridal|bachelorette|hen\b/i, 'Bridal parties'],
    [/\bmen\b|gentlemen|\bhim\b/i, 'Men'],
    [/\bma\b/i, 'Moms'],
  ];
  for (const [re, label] of table) {
    if (re.test(notes)) return label;
  }
  return null;
}

function matchIncluded(notes: string, known: string[]): string[] {
  const found: string[] = [];
  const lower = notes.toLowerCase();
  for (const t of known) {
    const name = t.toLowerCase().trim();
    if (name.length < 4) continue;
    if (lower.includes(name)) found.push(t);
  }
  // Also catch the common shorthand guests type in notes.
  const shorthands: [RegExp, string][] = [
    [/\bswedish\b/i, 'Swedish massage'],
    [/\bdeep tissue\b/i, 'Deep tissue massage'],
    [/\bhot stone\b/i, 'Hot stone massage'],
    [/\bmini facial\b|\bfacial\b/i, 'Facial'],
    [/\bhydrotherapy\b|\bhydro\b/i, 'Hydrotherapy'],
    [/\bmanicure\b|\bmani\b/i, 'Manicure'],
    [/\bpedicure\b|\bpedi\b/i, 'Pedicure'],
    [/\bfoot scrub\b/i, 'Foot scrub'],
    [/\bback massage\b|\bback and neck\b|\bback & neck\b/i, 'Back and neck massage'],
    [/\bmicrodermabrasion\b/i, 'Microdermabrasion'],
    [/\beyelash\b|\blash ext/i, 'Lash extensions'],
  ];
  for (const [re, label] of shorthands) {
    if (re.test(notes) && !found.some((f) => f.toLowerCase().includes(label.toLowerCase()))) {
      found.push(label);
    }
  }
  return found.slice(0, 5);
}

function matchOccasion(notes: string): string | null {
  const table: [RegExp, string][] = [
    [/christmas|festive|xmas/i, 'Christmas'],
    [/valentine/i, 'Valentine'],
    [/mother'?s day|mom'?s day/i, 'Mother\u2019s Day'],
    [/anniversary/i, 'Anniversary'],
    [/birthday/i, 'Birthday'],
    [/bridal|bachelorette|hen'?s/i, 'Bridal'],
    [/new year/i, 'New Year'],
    [/pamper|spa day/i, 'Pamper Day'],
  ];
  for (const [re, label] of table) {
    if (re.test(notes)) return label;
  }
  return null;
}

function cleanSentence(s: string): string {
  let out = s.replace(/\s+/g, ' ').trim();
  out = out.replace(/[!.]+$/, '');
  for (const banned of BANNED_PHRASES) {
    if (out.toLowerCase().includes(banned)) out = out.replace(new RegExp(banned, 'i'), '');
  }
  return out.trim();
}

/**
 * Menu casing for prose: treatment names run lowercase through a sentence
 * except proper words a guest would notice getting flattened, like the
 * Swedish in Swedish massage.
 */
function menuCase(label: string): string {
  return label.toLowerCase().replace(/\bswedish\b/g, 'Swedish');
}

/**
 * Build the promotion copy. Every sentence is assembled only from facts the
 * notes actually contain; the composer would rather stay quiet than invent.
 */
export function compose(input: ComposeInput): ComposeOutput {
  const notes = (input.notes ?? '').trim();
  const found: string[] = [];
  const { price, priceValue } = matchPrice(notes);
  const duration = matchDuration(notes);
  const { validFrom, validUntil } = matchDates(notes);
  const audience = matchAudience(notes);
  const occasion = matchOccasion(notes);
  const included = matchIncluded(notes, input.knownTreatments ?? []);

  if (price) found.push(`price ${price}`);
  if (duration) found.push(`duration ${duration}`);
  if (validFrom) found.push(`starts ${validFrom}`);
  if (validUntil) found.push(`ends ${validUntil}`);
  if (audience) found.push(`for ${audience.toLowerCase()}`);
  if (occasion) found.push(`${occasion.toLowerCase()} theme`);
  if (included.length) found.push(`includes ${included.join(', ').toLowerCase()}`);

  /* Name. Formulas from the frameworks sheet, applied honestly:
     occasion or audience forward, treatments as the concrete anchor. */
  const anchor = included.length
    ? included.slice(0, 2).map((t) => t.replace(/ massage$/i, '')).join(' + ')
    : 'Spa Package';
  let name = occasion ? `${occasion} ${anchor}` : anchor;
  if (audience && audience !== 'Groups') name = `${name} for ${audience}`;
  name = titleCase(name.replace(/\bAnd\b/g, 'and'));

  const alternates: string[] = [];
  if (occasion && audience) {
    alternates.push(`${occasion} escape for ${audience.toLowerCase()}`);
  }
  if (included.length >= 2) {
    alternates.push(`The ${included[0].toLowerCase()} and ${included[1].toLowerCase()} hour`);
  }
  alternates.push(`${occasion ?? 'Signature'} retreat${audience ? ` for ${audience.toLowerCase()}` : ''}`);

  /* Description. Three beats: what it is (specific), who it suits and what
     the visit feels like (vision), and the plain fact of price and dates
     (path). No sentence does two jobs; no fact is repeated. */
  const parts: string[] = [];
  if (included.length) {
    parts.push(
      cleanSentence(
        `${name} brings together ${listWords(included.map((t) => `the ${menuCase(t)}`))} in one unhurried visit.`,
      ) + '.',
    );
  } else {
    parts.push(
      cleanSentence(`${name} is a single, unhurried visit planned around what you asked for.`) + '.',
    );
  }
  parts.push(
    cleanSentence(
      audience
        ? `It is planned for ${audience.toLowerCase()}, with time to settle in rather than rush between rooms.`
        : 'It is planned as one visit, with time to settle in rather than rush between rooms.',
    ) + '.',
  );
  parts.push(
    cleanSentence(
      'The idea is simple: relax the body, renew the mind, and leave with more than you came with.',
    ) + '.',
  );
  if (price && validUntil) {
    const untilHuman = humanDate(validUntil);
    parts.push(cleanSentence(`The package is ${price} and runs through ${untilHuman}.`) + '.');
  } else if (price) {
    parts.push(cleanSentence(`The package is ${price}.`) + '.');
  } else if (validUntil) {
    parts.push(cleanSentence(`It runs through ${humanDate(validUntil)}.`) + '.');
  }
  const description = parts.join(' ');

  const cta = `Book the ${name}`;

  return {
    name,
    alternates: alternates.slice(0, 3).map(titleCase),
    description,
    price,
    priceValue,
    duration,
    validFrom,
    validUntil,
    audience,
    cta,
    found,
  };
}

function listWords(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

function humanDate(isoDate: string): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', timeZone: 'UTC' });
}
