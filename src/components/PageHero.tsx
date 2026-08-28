import { Picture } from '@/components/Picture';
import { ClipReveal, FadeUp } from '@/components/motion';

/**
 * Image-band header for inner pages.
 *
 * Gives every page the same colour and texture the home hero has: a real
 * photograph of the venue under an emerald veil, light cream type, and the
 * same motion language (clip-reveal title, fade-up support). One authored
 * entrance per surface, reduced-motion safe via the shared motion system.
 */
export function PageHero({
  slug,
  eyebrow,
  title,
  lede,
  align = 'left',
}: {
  slug: string;
  eyebrow: string;
  title: string;
  lede?: string;
  align?: 'left' | 'center';
}) {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0">
        <Picture
          slug={slug}
          alt=""
          sizes="100vw"
          imgClassName="h-full w-full object-cover"
          priority
        />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-[#07211A]/45" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#07211A]/85 via-[#07211A]/25 to-[#07211A]/40"
      />

      <div
        className={`shell relative flex min-h-[38svh] flex-col justify-end pb-10 pt-28 md:min-h-[46svh] md:pb-14 ${
          align === 'center' ? 'items-center text-center' : ''
        }`}
      >
        <p className="eyebrow text-emerald-300">
          <FadeUp>{eyebrow}</FadeUp>
        </p>
        <h1 className="display mt-4 max-w-3xl text-4xl text-balance text-ground sm:text-5xl md:text-6xl">
          <ClipReveal>{title}</ClipReveal>
        </h1>
        {lede ? (
          <p
            className={`mt-6 max-w-2xl text-base leading-relaxed text-ground/85 sm:text-lg ${
              align === 'center' ? 'mx-auto' : ''
            }`}
          >
            <FadeUp delay={0.12}>{lede}</FadeUp>
          </p>
        ) : null}
      </div>
    </section>
  );
}
