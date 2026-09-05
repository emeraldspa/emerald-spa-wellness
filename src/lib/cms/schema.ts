/**
 * Field schemas for the Emerald Content Manager editors.
 *
 * Pure data, importable from both server pages and the client editor: each
 * collection lists the fields an editor sees, in order, with the input type
 * and the help line that keeps a non-technical editor out of trouble.
 */

export type FieldType = 'text' | 'textarea' | 'number' | 'boolean' | 'select';

export type FieldDef = {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
  help?: string;
  required?: boolean;
  /** Hidden on the card face, shown when the card is expanded. */
  long?: boolean;
};

export type CollectionSchema = {
  slug: string;
  label: string;
  description: string;
  /** Per-category editing (treatments) or one flat list. */
  perCategory: boolean;
  fields: FieldDef[];
  /** Field used as the card title in the editor list. */
  titleKey: string;
  /** Offers the compose-from-notes helper. */
  composer: boolean;
};

export const SCHEMAS: Record<string, CollectionSchema> = {
  promotions: {
    slug: 'promotions',
    label: 'Specials and Promotions',
    description:
      'Seasonal packages, group deals and limited offers. These appear in the promotions menu and the booking pages.',
    perCategory: false,
    composer: true,
    titleKey: 'name',
    fields: [
      { key: 'name', label: 'Package name', type: 'text', required: true, placeholder: 'Christmas Spa Package for Two' },
      { key: 'price', label: 'Price', type: 'text', placeholder: 'NAD 1,500', help: 'Shown exactly as typed. Currency first.' },
      { key: 'priceValue', label: 'Price number', type: 'number', help: 'Digits only, used for sorting. 1500, not NAD 1,500.' },
      { key: 'duration', label: 'Duration', type: 'text', placeholder: '2 hr, 30 min' },
      { key: 'description', label: 'Description', type: 'textarea', long: true, placeholder: 'What the package includes, who it is for, and one line on the feeling it leaves behind.' },
    ],
  },
  reviews: {
    slug: 'reviews',
    label: 'Guest Reviews',
    description:
      'The curated review spiral. Strongest first, one per card. Dates are not shown on the site.',
    perCategory: false,
    composer: false,
    titleKey: 'author',
    fields: [
      { key: 'author', label: 'Guest name', type: 'text', required: true },
      { key: 'initials', label: 'Initials', type: 'text', help: 'Shown on the card, e.g. DG.' },
      { key: 'rating', label: 'Rating', type: 'number', help: '1 to 5.' },
      { key: 'text', label: 'The review', type: 'textarea', long: true, required: true },
    ],
  },
  team: {
    slug: 'team',
    label: 'Team Members',
    description: 'Staff profiles on the team page: role, photo, rating and bio.',
    perCategory: false,
    composer: false,
    titleKey: 'name',
    fields: [
      { key: 'name', label: 'Full name', type: 'text', required: true },
      { key: 'role', label: 'Role', type: 'text', placeholder: 'Senior Therapist' },
      { key: 'slug', label: 'URL slug', type: 'text', help: 'lowercase-with-dashes, unique. Used for the photo lookup.' },
      { key: 'photo', label: 'Photo key', type: 'text', help: 'The image key in the media library, e.g. team-laurensia. Leave empty for the branded tile.' },
      { key: 'rating', label: 'Fresha rating', type: 'number' },
      { key: 'founder', label: 'Co-founder', type: 'boolean' },
      { key: 'bio', label: 'Bio', type: 'textarea', long: true },
    ],
  },
  products: {
    slug: 'products',
    label: 'Products',
    description: 'Professional skincare used in treatments. The site never shows a price here.',
    perCategory: false,
    composer: false,
    titleKey: 'name',
    fields: [
      { key: 'name', label: 'Product name', type: 'text', required: true },
      { key: 'brand', label: 'Brand', type: 'text' },
      { key: 'slug', label: 'URL slug', type: 'text', help: 'lowercase-with-dashes, unique.' },
      { key: 'image', label: 'Image path', type: 'text', placeholder: '/products/name.webp' },
      { key: 'use', label: 'One-line use', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea', long: true },
    ],
  },
  journal: {
    slug: 'journal',
    label: 'Journal Posts',
    description:
      'House articles that appear alongside the WordPress journal. Content accepts simple HTML: <p>, <h2>, <h3> and <strong>.',
    perCategory: false,
    composer: false,
    titleKey: 'title',
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'slug', label: 'URL slug', type: 'text', required: true, help: 'lowercase-with-dashes, unique across the journal.' },
      { key: 'excerpt', label: 'Excerpt', type: 'textarea', help: 'One or two sentences shown on the card.' },
      { key: 'date', label: 'Date', type: 'text', placeholder: '2026-09-05T09:00:00' },
      { key: 'image', label: 'Featured image path', type: 'text', placeholder: '/media/name-1600.jpg' },
      { key: 'imageAlt', label: 'Image alt text', type: 'text', help: 'What the photo actually shows, in a few plain words.' },
      { key: 'content', label: 'Article content (HTML)', type: 'textarea', long: true, help: 'Paragraphs between <p> and </p>. Section headings as <h2>.' },
    ],
  },
  announcements: {
    slug: 'announcements',
    label: 'Announcements',
    description:
      'Temporary site notices. Active notices show as a gentle card on the site; archived ones never appear. The hero is never moved or covered.',
    perCategory: false,
    composer: false,
    titleKey: 'title',
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'body', label: 'Message', type: 'textarea', long: true, required: true },
      { key: 'status', label: 'Status', type: 'select', options: ['active', 'archived'] },
      { key: 'startsOn', label: 'Show from (YYYY-MM-DD)', type: 'text', help: 'Leave empty to start immediately.' },
      { key: 'endsOn', label: 'Show until (YYYY-MM-DD)', type: 'text', help: 'Leave empty to run until archived.' },
      { key: 'linkText', label: 'Button label', type: 'text', placeholder: 'Book now' },
      { key: 'linkUrl', label: 'Button link', type: 'text', placeholder: '/book' },
    ],
  },
  faqs: {
    slug: 'faqs',
    label: 'FAQ',
    description: 'Questions and answers shown on the visit page.',
    perCategory: false,
    composer: false,
    titleKey: 'q',
    fields: [
      { key: 'q', label: 'Question', type: 'text', required: true },
      { key: 'a', label: 'Answer', type: 'textarea', long: true, required: true },
    ],
  },
};

/** Services use one schema per category; the editor passes the category. */
export const SERVICES_SCHEMA: CollectionSchema = {
  slug: 'services',
  label: 'Treatments and Prices',
  description: 'Every treatment menu across all categories: names, durations, prices and descriptions.',
  perCategory: true,
  composer: false,
  titleKey: 'name',
  fields: [
    { key: 'name', label: 'Treatment name', type: 'text', required: true },
    { key: 'duration', label: 'Duration', type: 'text', placeholder: '1 hr' },
    { key: 'price', label: 'Price', type: 'text', placeholder: 'NAD 400' },
    { key: 'priceValue', label: 'Price number', type: 'number', help: 'Digits only, used for sorting.' },
    { key: 'description', label: 'Description', type: 'textarea', long: true },
  ],
};
