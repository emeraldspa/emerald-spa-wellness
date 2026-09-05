import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

/**
 * Content store for the Emerald Content Manager.
 *
 * Every collection is a JSON file in the repository. Saving a collection
 * commits that file to GitHub, and the existing Vercel Git integration picks
 * the commit up and deploys it, which is how an edit reaches the live site
 * within a couple of minutes without anybody touching code.
 *
 * Two transports, one contract:
 * - With CMS_GITHUB_TOKEN set (production) the store talks to the GitHub
 *   Contents API on the main branch. Reads fetch the current blob and its
 *   sha; writes carry that sha so a stale editor cannot silently overwrite
 *   somebody else's change: a racing write answers 409 and the editor is
 *   told to reload.
 * - Without a token (local development) the same functions read and write
 *   the files on disk, so `next dev` behaves identically.
 */

const REPO_OWNER = 'emeraldspa';
const REPO_NAME = 'emerald-spa-wellness';
const BRANCH = 'main';
const COMMIT_AUTHOR = { name: 'Emerald Webmaster', email: 'Webmaster@emeraldspacc.com' };

export type CmsError = Error & { status?: number };

function token(): string | null {
  return process.env.CMS_GITHUB_TOKEN || null;
}

/* ------------------------------------------------------------------ */
/* Transports                                                          */
/* ------------------------------------------------------------------ */

async function githubRead(filePath: string): Promise<{ raw: string; sha: string }> {
  const res = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}?ref=${BRANCH}`,
    {
      headers: {
        Authorization: `Bearer ${token()}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      cache: 'no-store',
    },
  );
  if (!res.ok) {
    const err: CmsError = new Error(`GitHub read failed for ${filePath} (HTTP ${res.status})`);
    err.status = res.status === 404 ? 404 : 502;
    throw err;
  }
  const body = (await res.json()) as { sha?: string; content?: string; encoding?: string };
  if (body.encoding !== 'base64' || typeof body.content !== 'string' || !body.sha) {
    const err: CmsError = new Error(`Unexpected GitHub payload for ${filePath}`);
    err.status = 502;
    throw err;
  }
  return { raw: Buffer.from(body.content, 'base64').toString('utf8'), sha: body.sha };
}

async function githubWrite(
  filePath: string,
  nextRaw: string,
  sha: string,
  message: string,
): Promise<void> {
  const res = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token()}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        message,
        content: Buffer.from(nextRaw, 'utf8').toString('base64'),
        sha,
        branch: BRANCH,
        author: COMMIT_AUTHOR,
      }),
      cache: 'no-store',
    },
  );
  if (!res.ok) {
    const err: CmsError = new Error(
      res.status === 409
        ? 'This file changed while you were editing. Reload the editor and apply your edit again.'
        : `GitHub write failed for ${filePath} (HTTP ${res.status})`,
    );
    err.status = res.status === 409 ? 409 : 502;
    throw err;
  }
}

function localPath(filePath: string): string {
  return path.join(process.cwd(), filePath);
}

function localRead(filePath: string): string {
  return fs.readFileSync(localPath(filePath), 'utf8');
}

function localWrite(filePath: string, nextRaw: string): void {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'Writing is unavailable without CMS_GITHUB_TOKEN in production. Set the token in the Vercel project settings.',
    );
  }
  fs.writeFileSync(localPath(filePath), nextRaw, 'utf8');
}

/* ------------------------------------------------------------------ */
/* Collections                                                         */
/* ------------------------------------------------------------------ */

export type CollectionSlug =
  | 'promotions'
  | 'services'
  | 'reviews'
  | 'team'
  | 'products'
  | 'journal'
  | 'announcements'
  | 'faqs';

type CollectionDef = {
  label: string;
  description: string;
  /** business-root patches one top-level array inside business.json. */
  kind: 'business-root' | 'business-category' | 'file';
  /** For business-root kinds: the JSON key. For file kinds: the file path. */
  target?: string | null;
  filePath?: string;
  idKey: string;
  titleKey: string;
};

export const COLLECTIONS: Record<CollectionSlug, CollectionDef> = {
  promotions: {
    label: 'Specials and Promotions',
    description:
      'Seasonal packages, group deals and limited offers. These appear in the promotions menu and the booking pages.',
    kind: 'business-category',
    target: 'promotions',
    idKey: 'name',
    titleKey: 'name',
  },
  services: {
    label: 'Treatments and Prices',
    description:
      'Every treatment menu across all categories: names, durations, prices and descriptions.',
    kind: 'business-category',
    target: null,
    idKey: 'name',
    titleKey: 'name',
  },
  reviews: {
    label: 'Guest Reviews',
    description: 'The curated review spiral. Name, rating and the words of the guest.',
    kind: 'business-root',
    target: 'reviews',
    idKey: 'id',
    titleKey: 'author',
  },
  team: {
    label: 'Team Members',
    description: 'Staff profiles shown on the team page: role, photo, rating and bio.',
    kind: 'business-root',
    target: 'team',
    idKey: 'slug',
    titleKey: 'name',
  },
  products: {
    label: 'Products',
    description: 'Professional skincare used in treatments: what each product is and what it does.',
    kind: 'file',
    filePath: 'src/data/products.json',
    idKey: 'slug',
    titleKey: 'name',
  },
  journal: {
    label: 'Journal Posts',
    description:
      'House articles that appear alongside the WordPress journal. Content accepts simple HTML paragraphs.',
    kind: 'file',
    filePath: 'src/data/cms/journal.json',
    idKey: 'slug',
    titleKey: 'title',
  },
  announcements: {
    label: 'Announcements',
    description:
      'Temporary site notices. Active notices show as a gentle card on the site; archived ones never appear.',
    kind: 'file',
    filePath: 'src/data/cms/announcements.json',
    idKey: 'id',
    titleKey: 'title',
  },
  faqs: {
    label: 'FAQ',
    description: 'Questions and answers shown on the visit page.',
    kind: 'file',
    filePath: 'src/data/cms/faqs.json',
    idKey: 'q',
    titleKey: 'q',
  },
};

const BUSINESS_JSON = 'src/data/business.json';

export type CategorySummary = { slug: string; name: string; count: number };

export type ReadResult = {
  items: Record<string, unknown>[];
  sha: string;
  categories?: CategorySummary[];
  activeCategory?: string;
};

type BusinessCategory = { slug?: string; name?: string; items?: Record<string, unknown>[] };

/**
 * Pull the editable array out of the parsed business record. File-kind
 * collections never reach here: readCollection returns their whole file.
 */
function readItemsFor(def: CollectionDef, business: Record<string, unknown>, category?: string): {
  items: Record<string, unknown>[];
  categories?: CategorySummary[];
  activeCategory?: string;
} {
  if (def.kind === 'business-root') {
    const arr = business[def.target ?? ''];
    return { items: Array.isArray(arr) ? (arr as Record<string, unknown>[]) : [] };
  }
  // business-category: services passes no target and picks its category via
  // the request; promotions is pinned to its own category.
  const cats = (business.categories as BusinessCategory[]) ?? [];
  const summaries: CategorySummary[] = cats.map((c) => ({
    slug: c.slug ?? '',
    name: c.name ?? c.slug ?? '',
    count: Array.isArray(c.items) ? c.items.length : 0,
  }));
  const fallback = def.target ?? cats[0]?.slug ?? 'promotions';
  const active = category && cats.some((c) => c.slug === category) ? category : fallback;
  const cat = cats.find((c) => c.slug === active);
  return {
    items: Array.isArray(cat?.items) ? (cat?.items as Record<string, unknown>[]) : [],
    categories: summaries,
    activeCategory: active,
  };
}

async function readCollectionFile(filePath: string): Promise<{ raw: string; sha: string }> {
  if (token()) return githubRead(filePath);
  if (process.env.NODE_ENV === 'production') {
    // Serverless filesystems carry bundled code, not the repository tree.
    // Without the token there is no honest way to serve the tree here.
    const err: CmsError = new Error(
      'The Content Manager storage is not configured on this deployment. Add CMS_GITHUB_TOKEN in the Vercel project settings; the public site is unaffected.',
    );
    err.status = 503;
    throw err;
  }
  return { raw: localRead(filePath), sha: 'local' };
}

export async function readCollection(
  slug: CollectionSlug,
  category?: string,
): Promise<ReadResult> {
  const def = COLLECTIONS[slug];
  if (def.kind === 'file' && def.filePath) {
    const { raw, sha } = await readCollectionFile(def.filePath);
    const parsed = JSON.parse(raw);
    return { items: Array.isArray(parsed) ? parsed : [], sha };
  }
  const { raw, sha } = await readCollectionFile(BUSINESS_JSON);
  const business = JSON.parse(raw) as Record<string, unknown>;
  const { items, categories, activeCategory } = readItemsFor(def, business, category);
  return { items, sha, categories, activeCategory };
}

/**
 * Keep a service-style record's variants mirror in step with its own fields.
 * The site renders variant chips from this array, so a new item without one
 * would render an empty booking row.
 */
function syncVariants(item: Record<string, unknown>): Record<string, unknown> {
  const variants = item.variants;
  if (Array.isArray(variants) && variants.length > 0) return item;
  return {
    ...item,
    variants: [
      {
        name: item.name ?? '',
        duration: item.duration ?? null,
        price: item.price ?? null,
      },
    ],
  };
}

export async function writeCollection(
  slug: CollectionSlug,
  items: Record<string, unknown>[],
  category?: string,
): Promise<{ committed: string }> {
  const def = COLLECTIONS[slug];
  const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
  const message = `CMS: update ${def.label.toLowerCase()}${category ? ` (${category})` : ''}, ${stamp} UTC`;

  if (def.kind === 'file' && def.filePath) {
    const { raw, sha } = await readCollectionFile(def.filePath);
    const next = JSON.stringify(items, null, 2) + '\n';
    if (next === raw) return { committed: 'no-change' };
    if (token()) await githubWrite(def.filePath, next, sha, message);
    else localWrite(def.filePath, next);
    return { committed: sha };
  }

  const { raw, sha } = await readCollectionFile(BUSINESS_JSON);
  const business = JSON.parse(raw) as Record<string, unknown>;

  if (def.kind === 'business-root') {
    business[def.target ?? ''] = items;
  } else {
    const cats = (business.categories as BusinessCategory[]) ?? [];
    const active = category && cats.some((c) => c.slug === category) ? category : 'promotions';
    const cat = cats.find((c) => c.slug === active);
    if (!cat) {
      const err: CmsError = new Error(`Unknown category: ${active}`);
      err.status = 400;
      throw err;
    }
    cat.items = slug === 'promotions' ? items : items.map(syncVariants);
  }

  const next = JSON.stringify(business, null, 2) + '\n';
  if (next === raw) return { committed: 'no-change' };
  if (token()) await githubWrite(BUSINESS_JSON, next, sha, message);
  else localWrite(BUSINESS_JSON, next);
  return { committed: sha };
}

/** Cheap existence check used by the session bootstrap. */
export function storeMode(): 'github' | 'local' {
  return token() ? 'github' : 'local';
}
