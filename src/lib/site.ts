import business from '@/data/business.json';
import images from '@/data/images.json';

export type ServiceVariant = {
  name: string;
  duration: string | null;
  price: string | null;
};

export type Service = {
  name: string;
  duration: string | null;
  price: string | null;
  priceValue: number | null;
  description: string | null;
  variants: ServiceVariant[];
};

export type ServiceCategory = {
  id: string;
  slug: string;
  name: string;
  items: Service[];
};

export type Review = {
  id: string;
  rating: number;
  text: string;
  author: string;
  initials: string;
  date: string;
  iso: string;
};

export type TeamMember = {
  name: string;
  role: string | null;
  rating: number | null;
  slug: string;
};

export type ImageAsset = {
  alt: string;
  width: number;
  height: number;
  src: string;
  webp: { w: number; p: string }[];
  avif: { w: number; p: string }[];
};

export const site = business as typeof business & {
  categories: ServiceCategory[];
  reviews: Review[];
  team: TeamMember[];
};

export const imageMap = images as Record<string, ImageAsset>;

export function getImage(slug: string): ImageAsset {
  const img = imageMap[slug];
  if (!img) {
    throw new Error(`Unknown image slug: ${slug}`);
  }
  return img;
}

/** Canonical origin. Overridden at build time on Vercel. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ??
  'https://emerald-spa-wellness.vercel.app';

export const WHATSAPP_URL = `https://wa.me/${site.phoneE164.replace('+', '')}`;

/** Gallery order is deliberate: arrival, treatment, water, garden, detail. */
export const GALLERY_SLUGS = [
  'reception',
  'treatment-room',
  'spa-retreat',
  'candlescape',
  'serenity-garden',
  'green-escape',
  'portfolio-1',
  'portfolio-2',
  'portfolio-3',
  'portfolio-4',
] as const;

export const NAV_LINKS = [
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/team', label: 'Team' },
  { href: '/visit', label: 'Visit' },
] as const;

export function formatNad(value: number): string {
  return `NAD ${value.toLocaleString('en-NA')}`;
}
