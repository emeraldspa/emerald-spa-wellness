'use client';

import { useEffect, useState } from 'react';
import { MobileMenu } from '@/components/MobileMenu';

/** Listens for the hero's open-menu event and owns the overlay state. */
export function MenuHost({ eventName }: { eventName: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener(eventName, handler);
    return () => window.removeEventListener(eventName, handler);
  }, [eventName]);

  return <MobileMenu open={open} onClose={() => setOpen(false)} />;
}
