'use client';

import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

const EASE_REVEAL = [0.22, 1, 0.36, 1] as const;

/**
 * Motion system, per tangison-motion-master.
 *
 * Purpose: signal reading order on first paint and on scroll entry.
 * Hierarchy: headings clip-reveal, supporting content fades up, nothing else moves.
 * Timing: 0.55s to 0.9s, never longer. Stagger caps at 0.14s per item.
 * Reduced motion: every variant collapses to its resting state, no exceptions.
 * Cleanup: all entrances use `once: true` so nothing re-runs on scroll-back.
 */

export function ClipReveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  /*
    The observer must watch the clipping wrapper, not the moving child.
    The child starts translated 110% down, which places it fully outside the
    wrapper's overflow:hidden box, so observing the child yields an
    intersection ratio of 0 forever and the reveal never fires.
  */
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' });

  if (reduce) {
    return <span className={`reveal-clip ${className ?? ''}`}>{children}</span>;
  }

  return (
    <span ref={ref} className={`reveal-clip ${className ?? ''}`}>
      <motion.span
        className="block"
        initial={{ y: '110%' }}
        animate={inView ? { y: 0 } : { y: '110%' }}
        transition={{ duration: 0.7, delay, ease: EASE_REVEAL }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function FadeUp({
  children,
  delay = 0,
  className,
  as = 'div',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'li' | 'section' | 'article';
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];

  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.6, delay, ease: EASE_REVEAL }}
    >
      {children}
    </Tag>
  );
}

export const fadeDownVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: EASE_REVEAL },
  }),
};

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: EASE_REVEAL },
  }),
};

export { EASE_REVEAL };
