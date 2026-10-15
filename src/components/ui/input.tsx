import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

// Shared by Input and Textarea. aria-invalid turns the border (and focus ring) red.
export const fieldClassName =
  'w-full rounded-lg border border-line bg-white px-4 text-ink transition-colors placeholder:text-muted focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/20 focus-visible:outline-none aria-invalid:border-error aria-invalid:ring-error/20';

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return <input className={cn(fieldClassName, 'h-12', className)} {...props} />;
}
