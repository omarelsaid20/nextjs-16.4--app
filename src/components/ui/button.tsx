import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

const variants = {
  default: 'bg-brand text-white hover:bg-brand-hover',
  outline: 'border border-brand text-brand hover:bg-tint-50',
  inverse: 'bg-white text-brand hover:bg-tint-100',
} as const;

const sizes = {
  default: 'h-10 px-5 text-sm',
  lg: 'h-12 px-7 text-base',
} as const;

export type ButtonVariantProps = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

// Shared by <Button> and by links styled as buttons:
// <Link className={buttonVariants({ variant: 'outline' })}>.
export function buttonVariants({
  variant = 'default',
  size = 'default',
}: ButtonVariantProps = {}): string {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:pointer-events-none disabled:opacity-60',
    variants[variant],
    sizes[size],
  );
}

export function Button({
  variant,
  size,
  className,
  type = 'button',
  ...props
}: ComponentProps<'button'> & ButtonVariantProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
