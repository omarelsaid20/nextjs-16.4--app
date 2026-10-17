'use client';

import { useSyncExternalStore, type ReactNode } from 'react';

function subscribe(onScroll: () => void) {
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}

const isScrolled = () => window.scrollY > 8;

// The server render assumes the page is at the top, so hydration never
// mismatches.
export function HeaderShell({ children }: { children: ReactNode }) {
  const scrolled = useSyncExternalStore(subscribe, isScrolled, () => false);

  return (
    <header
      data-scrolled={scrolled || undefined}
      className="sticky top-0 z-50 bg-white transition-shadow data-scrolled:shadow-md"
    >
      {children}
    </header>
  );
}
