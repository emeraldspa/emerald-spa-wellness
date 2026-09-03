'use client';

import { Maximize2, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { imageMap } from '@/lib/site';
import { FadeUp } from '@/components/motion';

/**
 * Gallery grid with a lightbox.
 *
 * Each section opens with its feature photograph beside the section text,
 * then the remaining photographs run in a numbered grid below. Round 11
 * (client): every frame is a uniform 4:3, so the nine-by-sixteen phone
 * photographs no longer render taller than the viewport. Nothing is
 * deleted; the lightbox still opens the full uncropped photograph.
 *
 * Any photograph opens full size in the lightbox. Arrow keys move between
 * photographs, Escape closes, and the buttons are real buttons so the
 * lightbox is reachable from the keyboard alone. The lightbox mounts through
 * a portal onto the body: globals.css gives every body child its own stacking
 * context, so a lightbox trapped inside the page tree would paint underneath
 * the sticky nav and any popup that opens later.
 */

export type GallerySectionData = {
  id: string;
  eyebrow: string;
  title: string;
  lead: string;
  slugs: string[];
};

type Photo = {
  slug: string;
  alt: string;
  src: string;
  width: number;
  height: number;
  webp: { w: number; p: string }[];
  avif: { w: number; p: string }[];
  section: string;
};

function LightboxFrame({
  photos,
  index,
  onClose,
  onMove,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onMove: (next: number) => void;
}) {
  const photo = photos[index];
  const closeRef = useRef<HTMLButtonElement>(null);
  const total = photos.length;

  useEffect(() => {
    closeRef.current?.focus();
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onMove((index - 1 + total) % total);
      if (e.key === 'ArrowRight') onMove((index + 1) % total);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, total, onClose, onMove]);

  const avif = photo.avif.map((s) => `${s.p} ${s.w}w`).join(', ');
  const webp = photo.webp.map((s) => `${s.p} ${s.w}w`).join(', ');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photograph: ${photo.alt}`}
      className="fixed inset-0 z-[90] flex flex-col bg-[#04110C]/95 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Top bar: counter, section, close */}
      <div
        className="flex items-center justify-between gap-4 px-5 py-4 text-ground sm:px-8"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-ground/70">
          {photo.section}
          <span className="ml-3 tabular-nums text-ground/90">
            {index + 1} / {total}
          </span>
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close the photograph"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-ground/25 text-ground transition-colors hover:border-ground/60 hover:bg-ground/10"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {/* The photograph, uncropped, as large as the viewport allows */}
      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-20"
        onClick={(e) => e.stopPropagation()}
      >
        <picture className="flex h-full min-h-0 w-full items-center justify-center">
          {avif ? <source type="image/avif" srcSet={avif} /> : null}
          <source type="image/webp" srcSet={webp} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            className="h-auto max-h-full w-auto max-w-full rounded-lg object-contain shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)]"
            decoding="async"
          />
        </picture>

        {/* Prev / next */}
        <button
          type="button"
          onClick={() => onMove((index - 1 + total) % total)}
          aria-label="Previous photograph"
          className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-ground/25 bg-[#04110C]/60 text-ground transition-colors hover:border-ground/60 hover:bg-ground/15 sm:left-5"
        >
          <span aria-hidden="true" className="text-xl leading-none">
            &#8249;
          </span>
        </button>
        <button
          type="button"
          onClick={() => onMove((index + 1) % total)}
          aria-label="Next photograph"
          className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-ground/25 bg-[#04110C]/60 text-ground transition-colors hover:border-ground/60 hover:bg-ground/15 sm:right-5"
        >
          <span aria-hidden="true" className="text-xl leading-none">
            &#8250;
          </span>
        </button>
      </div>

      {/* Caption */}
      <p
        className="px-5 pb-5 text-center text-sm text-ground/80 text-pretty sm:px-8"
        onClick={(e) => e.stopPropagation()}
      >
        {photo.alt}
      </p>
    </div>
  );
}

export function GalleryGrid({ sections }: { sections: GallerySectionData[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const photos = useMemo<Photo[]>(() => {
    const list: Photo[] = [];
    for (const section of sections) {
      for (const slug of section.slugs) {
        const img = imageMap[slug];
        if (!img) continue;
        list.push({
          slug,
          alt: img.alt,
          src: img.src,
          width: img.width,
          height: img.height,
          webp: img.webp,
          avif: img.avif,
          section: section.eyebrow,
        });
      }
    }
    return list;
  }, [sections]);

  const slugToFlatIndex = useMemo(() => {
    const map = new Map<string, number>();
    photos.forEach((p, i) => map.set(p.slug, i));
    return map;
  }, [photos]);

  const close = useCallback(() => setOpenIndex(null), []);
  const move = useCallback((next: number) => setOpenIndex(next), []);

  return (
    <>
      {sections.map((section, si) => {
        const [featureSlug, ...restSlugs] = section.slugs;
        const feature = imageMap[featureSlug];
        const photoCount = section.slugs.length;

        return (
          <section
            key={section.id}
            id={section.id}
            className={`scroll-mt-24 py-14 md:py-20 ${si % 2 === 1 ? 'surface-panel' : ''} ${
              si > 0 ? 'border-t border-ink/10' : ''
            }`}
          >
            {/* Feature photograph beside the section text */}
            <div className="shell">
              <div className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
                <FadeUp className="md:col-span-7" as="div">
                  {feature ? (
                    <button
                      type="button"
                      onClick={() => {
                        const i = slugToFlatIndex.get(featureSlug);
                        if (i !== undefined) setOpenIndex(i);
                      }}
                      aria-label={`Open ${feature.alt} full size`}
                      className="group block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-ink/10 bg-emerald-900/5 text-left"
                    >
                      <picture>
                        {feature.avif.length ? (
                          <source
                            type="image/avif"
                            srcSet={feature.avif.map((s) => `${s.p} ${s.w}w`).join(', ')}
                            sizes="(max-width: 768px) 100vw, 58vw"
                          />
                        ) : null}
                        <source
                          type="image/webp"
                          srcSet={feature.webp.map((s) => `${s.p} ${s.w}w`).join(', ')}
                          sizes="(max-width: 768px) 100vw, 58vw"
                        />
                        {/*
                          Round 11 (client): frames are capped at 4:3 so no
                          photograph towers over the page. Portrait sources
                          fill the frame through object-cover; the lightbox
                          still shows the full, uncropped photograph.
                        */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={feature.src}
                          alt={feature.alt}
                          width={feature.width}
                          height={feature.height}
                          loading={si === 0 ? 'eager' : 'lazy'}
                          fetchPriority={si === 0 ? 'high' : 'auto'}
                          className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.015]"
                        />
                      </picture>
                      <span className="flex items-center justify-between gap-3 border-t border-ink/10 px-5 py-3 text-xs font-semibold uppercase tracking-widest text-ink/70">
                        {section.eyebrow}
                        <span className="inline-flex items-center gap-1.5 text-emerald-700 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                          <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
                          Open
                        </span>
                      </span>
                    </button>
                  ) : null}
                </FadeUp>

                <FadeUp delay={0.08} className="md:col-span-5" as="div">
                  <p className="eyebrow text-emerald-600">
                    {section.eyebrow}
                    <span className="ml-2 tabular-nums text-ink/70">{photoCount} photos</span>
                  </p>
                  <h2 className="display mt-4 text-3xl text-balance sm:text-4xl">
                    {section.title}
                  </h2>
                  <p className="mt-4 text-ink/70 text-pretty">{section.lead}</p>
                  <p className="mt-6 text-sm leading-relaxed text-ink/70">
                    Tap any photograph to see it full size. The viewer moves with
                    the arrow keys and closes with Escape.
                  </p>
                </FadeUp>
              </div>
            </div>

            {/* The rest of the section, numbered */}
            {restSlugs.length > 0 ? (
              <ul className="shell mt-10 grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {restSlugs.map((slug, i) => {
                  const img = imageMap[slug];
                  if (!img) return null;
                  const flat = slugToFlatIndex.get(slug);
                  return (
                    <FadeUp key={slug} delay={(i % 3) * 0.06} as="li">
                      <figure className="group">
                        <button
                          type="button"
                          onClick={() => {
                            if (flat !== undefined) setOpenIndex(flat);
                          }}
                          aria-label={`Open ${img.alt} full size`}
                          className="block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-ink/10 bg-emerald-900/5 text-left"
                        >
                          <picture>
                            {img.avif.length ? (
                              <source
                                type="image/avif"
                                srcSet={img.avif.map((s) => `${s.p} ${s.w}w`).join(', ')}
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              />
                            ) : null}
                            <source
                              type="image/webp"
                              srcSet={img.webp.map((s) => `${s.p} ${s.w}w`).join(', ')}
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                            {/* Round 11: uniform 4:3 frame, same cap as the
                                feature photograph. */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img.src}
                              alt=""
                              width={img.width}
                              height={img.height}
                              loading="lazy"
                              decoding="async"
                              className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.02]"
                            />
                          </picture>
                          <span
                            aria-hidden="true"
                            className="flex items-center justify-end gap-1.5 border-t border-ink/10 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-ink/70 transition-colors group-hover:text-emerald-700"
                          >
                            <Maximize2 className="h-3 w-3" />
                            {String(i + 2).padStart(2, '0')}
                          </span>
                        </button>
                        <figcaption className="mt-3 text-sm text-ink/65">{img.alt}</figcaption>
                      </figure>
                    </FadeUp>
                  );
                })}
              </ul>
            ) : null}
          </section>
        );
      })}

      {openIndex !== null && photos[openIndex]
        ? createPortal(
            <LightboxFrame
              photos={photos}
              index={openIndex}
              onClose={close}
              onMove={move}
            />,
            document.body,
          )
        : null}
    </>
  );
}
