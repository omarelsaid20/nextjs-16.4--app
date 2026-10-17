import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

// Shared by Input and Textarea.
export const fieldClassName =
  'w-full rounded-lg border border-line bg-white px-3 text-ink transition-colors placeholder:text-muted focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/20 focus-visible:outline-none aria-invalid:border-error aria-invalid:ring-error/20 sm:px-4';

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      className={cn(fieldClassName, 'h-12 sm:h-14', className)}
      {...props}
    />
  );
}
