import products from './products.json';

/**
 * Products the spa uses in its treatments.
 *
 * These are professional skincare products used at the venue, not items the
 * spa resells, so the site shows what they are and what they do, never a
 * price. The records live in products.json so the Content Manager can edit
 * them; this module keeps the typed surface the pages import.
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

export const PRODUCTS: Product[] = products as Product[];
