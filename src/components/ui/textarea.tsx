import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import { fieldClassName } from './input';

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      className={cn(fieldClassName, 'min-h-38 py-3 sm:py-4', className)}
      {...props}
    />
  );
}
