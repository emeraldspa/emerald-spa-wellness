import { ArrowUpRight } from 'lucide-react';
import { GOOGLE_DIRECTIONS_URL, GOOGLE_MAPS_EMBED_URL, GOOGLE_MAPS_URL, site } from '@/lib/site';

/**
 * Google Maps embed.
 *
 * Uses the `cid` form, which is the only variant tested that renders the
 * business as a named pin with its own info card rather than a bare
 * coordinate marker. The cid is derived from the verified feature id, and the
 * short link the client supplied resolves to that same feature id.
 *
 * Lazy loaded because it sits below the fold and pulls in Google's map
 * bundle, which is heavier than everything else on the page combined.
 */
export function MapEmbed() {
  return (
    <div>
      <div className="overflow-hidden border border-ink/15 bg-emerald-900/5">
        <iframe
          src={GOOGLE_MAPS_EMBED_URL}
          title={`Map showing ${site.legalName}, ${site.address.street}, ${site.address.suburb}`}
          className="h-[380px] w-full border-0 md:h-[460px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        <a
          href={GOOGLE_DIRECTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-widest text-emerald-600 hover:underline"
        >
          Get directions
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
        <a
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-widest text-ink/65 hover:text-emerald-600"
        >
          Open in Google Maps
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
