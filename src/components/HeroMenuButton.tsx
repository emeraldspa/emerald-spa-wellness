'use client';

/**
 * Small client island so the hero itself can stay a server component.
 * Dispatches a window event the page-level menu state listens for.
 */
export function HeroMenuButton({ targetId }: { targetId: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(targetId))}
      className="hero-down flex h-11 w-11 flex-col items-center justify-center gap-1 rounded-full bg-ink"
      style={{ animationDelay: '0.5s' }}
      aria-label="Open menu"
    >
      <span className="h-0.5 w-4 bg-white" />
      <span className="h-0.5 w-4 bg-white" />
      <span className="h-0.5 w-4 bg-white" />
    </button>
  );
}
