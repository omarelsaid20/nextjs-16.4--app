import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'header' | 'footer' | 'nav';
  width?: keyof typeof widths;
};

const widths = {
  content: 'mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8',
  bleed: 'px-10 min-[501px]:px-20 min-[988px]:px-30',
} as const;

export function Container({
  children,
  className,
  as: Tag = 'div',
  width = 'content',
}: ContainerProps) {
  return (
    <Tag className={cn('w-full', widths[width], className)}>{children}</Tag>
  );
}
