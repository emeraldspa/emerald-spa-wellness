'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { MobileMenu } from '@/components/MobileMenu';
import { NAV_LINKS, site } from '@/lib/site';

/** Header for every route except the home hero, which renders its own nav. */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="border-b border-ink/10 bg-ground/90 backdrop-blur-sm">
        <nav
          className="shell flex items-center justify-between py-5"
          aria-label="Primary"
        >
          <Link href="/" className="flex items-center gap-3" aria-label="Emerald Spa and Wellness Centre, home">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-emerald-600">
              <span className="block h-[10px] w-[10px] rounded-full bg-emerald-600" />
            </span>
            <span className="hidden text-sm font-semibold uppercase tracking-widest sm:block">
              Emerald
            </span>
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`text-sm font-semibold uppercase tracking-widest transition-colors hover:text-emerald-600 ${
                      active ? 'text-emerald-600' : 'text-ink'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href={site.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full bg-emerald-600 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-emerald-700 sm:block"
            >
              Book Now
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex h-9 w-9 flex-col items-center justify-center gap-1 rounded-full bg-ink md:hidden"
              aria-label="Open menu"
            >
              <span className="h-0.5 w-4 bg-white" />
              <span className="h-0.5 w-4 bg-white" />
              <span className="h-0.5 w-4 bg-white" />
            </button>
          </div>
        </nav>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
