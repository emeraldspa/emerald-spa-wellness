/**
 * Products the spa uses in its treatments.
 *
 * These are professional skincare products used at the venue, not items the
 * spa resells, so the site shows what they are and what they do, never a
 * price. Guests who want to buy them are pointed to the manufacturer or to
 * the team in store.
 */
export type Product = {
  slug: string;
  name: string;
  brand: string;
  image: string;
  description: string;
  /** What the product is for, in one line. */
  use: string;
};

export const PRODUCTS: Product[] = [
  {
    slug: 'dermhydrix',
    name: 'Helix Series DermHydrix',
    brand: 'BioMedical Emporium',
    image: '/products/dermhydrix-50ml.webp',
    description:
      'A lightweight, non-comedogenic moisturiser that hydrates, nourishes and helps restore the skin natural moisture barrier without feeling heavy.',
    use: 'Daily hydration and barrier repair',
  },
  {
    slug: 'nanozyme',
    name: 'Helix Series NanoZyme',
    brand: 'BioMedical Emporium',
    image: '/products/nanozyme-15ml.webp',
    description:
      'A targeted treatment that helps visibly reduce blemishes while calming the skin and supporting a clearer-looking complexion.',
    use: 'Blemish control and calm',
  },
  {
    slug: 'skin-repair-serum',
    name: 'Skin Repair Serum',
    brand: 'BioMedical Emporium',
    image: '/products/skin-repair-serum-30-ml.webp',
    description:
      'A fast, effective skin calming agent for immediate healing and inflammation relief, supporting the skin own repair from within.',
    use: 'Calm and repair for sensitive skin',
  },
  {
    slug: 'facial-cleanser',
    name: 'Facial Cleanser',
    brand: 'BioMedical Emporium',
    image: '/products/facial-cleanser-100-ml.webp',
    description:
      'Deeply cleanses and gently removes impurities without disturbing the skin barrier, desensitises irritation and provides light exfoliation.',
    use: 'Daily cleanse, no stripping',
  },
  {
    slug: 'skin-biotic',
    name: 'Skin Biotic Supplement',
    brand: 'BioMedical Emporium',
    image: '/products/skin-biotic-supplement-84-g.webp',
    description:
      'A supplement that supports gut flora and balanced digestion, with skin-loving benefits that show up in how the skin looks and feels.',
    use: 'Skin health from within',
  },
  {
    slug: 'wellness-pack',
    name: 'Wellness Pack',
    brand: 'BioMedical Emporium',
    image: '/products/wellness-pack.webp',
    description:
      'A complete wellness pack combining weight management support, skin-loving probiotics and targeted stretch mark and cellulite therapy.',
    use: 'Total body confidence',
  },
] as const;
