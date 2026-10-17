import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export function Label({ className, ...props }: ComponentProps<'label'>) {
  return (
    <label
      className={cn('text-base font-medium text-ink sm:text-lg', className)}
      {...props}
    />
  );
}
