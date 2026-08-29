'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the digest only. Never render raw error detail to the visitor.
    console.error('Route error', error.digest);
  }, [error]);

  return (
    <main id="main" className="shell flex min-h-[70vh] flex-col justify-center py-24">
      <p className="eyebrow text-emerald-600">Something went wrong</p>
      <h1 className="display mt-4 max-w-3xl text-4xl text-balance sm:text-5xl">
        We could not load this page.
      </h1>
      <p className="mt-6 max-w-xl text-lg text-ink/70">
        Try again. If it keeps happening, call us on +264 85 607 7143 and we will book you in
        directly.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-emerald-600 px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-emerald-700"
        >
          Try again
        </button>
        <a
          href="tel:+264856077143"
          className="rounded-full border border-ink/20 px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-ink transition-colors hover:border-emerald-600 hover:text-emerald-600"
        >
          Call the spa
        </a>
      </div>
    </main>
  );
}
