'use client';

import { useCallback, useEffect, useState } from 'react';
import { MobileMenu } from '@/components/MobileMenu';

/** Listens for the hero's open-menu event and owns the overlay state. */
export function MenuHost({ eventName }: { eventName: string }) {
  const [open, setOpen] = useState(false);

  const broadcast = useCallback(
    (next: boolean) => {
      window.dispatchEvent(new CustomEvent(`${eventName}:state`, { detail: { open: next } }));
    },
    [eventName],
  );

  useEffect(() => {
    const handler = () => {
      setOpen(true);
      broadcast(true);
    };
    window.addEventListener(eventName, handler);
    return () => window.removeEventListener(eventName, handler);
  }, [eventName, broadcast]);

  const close = useCallback(() => {
    setOpen(false);
    broadcast(false);
  }, [broadcast]);

  return <MobileMenu open={open} onClose={close} />;
}
