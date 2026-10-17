'use client';

import type { ReactNode } from 'react';
import { useInView } from '@/hooks/use-in-view';
import { cn } from '@/lib/utils';

const delays = {
  0: '',
  100: 'motion-safe:delay-100',
  200: 'motion-safe:delay-200',
  300: 'motion-safe:delay-300',
} as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: keyof typeof delays;
};

// Content starts hidden only under motion-safe, so reduced motion shows it at
// once. globals.css also shows it when JavaScript is off.
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>({
    rootMargin: '0px 0px -10% 0px',
  });

  return (
    <div
      ref={ref}
      data-reveal
      className={cn(
        'motion-safe:transition motion-safe:duration-600 motion-safe:ease-out',
        !inView && 'motion-safe:translate-y-6 motion-safe:opacity-0',
        delays[delay],
        className,
      )}
    >
      {children}
    </div>
  );
}
