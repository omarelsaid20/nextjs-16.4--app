'use client';

import { useCallback, useRef, useState } from 'react';

// Becomes true the first time the element enters the viewport, then stops observing.
export function useInView<T extends Element>(
  options?: IntersectionObserverInit,
): { ref: (node: T | null) => void; inView: boolean } {
  const [inView, setInView] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  // Read when observing starts, so a new options object each render doesn't re-observe.
  const optionsRef = useRef(options);

  const ref = useCallback((node: T | null) => {
    observer.current?.disconnect();
    observer.current = null;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setInView(true);
        io.disconnect();
      }
    }, optionsRef.current);
    io.observe(node);
    observer.current = io;
  }, []);

  return { ref, inView };
}
