import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

// Focus rings are white on photos, where brand blue would barely show.
const variants = {
  default:
    'bg-brand text-white hover:bg-brand-hover focus-visible:outline-brand',
  outline:
    'border border-brand text-brand hover:bg-tint-50 focus-visible:outline-brand',
  inverse:
    'bg-white text-brand duration-300 hover:bg-brand hover:text-white focus-visible:outline-white',
  outlineSwap:
    'border border-brand bg-white/77 text-brand duration-300 hover:bg-brand hover:text-white focus-visible:outline-brand',
  solidSwap:
    'border border-brand bg-brand text-white duration-300 hover:bg-white/77 hover:text-brand focus-visible:outline-brand',
} as const;

// Each size sets its own radius, because cn() can't override one radius class
// with another.
const sizes = {
  default: 'h-10 rounded-lg px-5 text-sm',
  lg: 'h-12 rounded-lg px-7 text-base',
  sm: 'h-9.5 min-w-20 rounded-lg px-2 text-sm',
  xl: 'h-14 w-full max-w-62 rounded-[10px] px-4 text-base sm:text-lg md:text-xl',
  pill: 'h-14 w-full rounded-full px-4 text-base sm:text-lg md:text-xl',
  block: 'h-12 w-full rounded-lg px-4 text-base sm:h-14 sm:text-xl',
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
    'inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-60',
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
