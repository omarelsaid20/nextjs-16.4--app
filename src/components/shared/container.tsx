import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'header' | 'footer' | 'nav';
};

// The site's 1200px content column with responsive side padding.
export function Container({
  children,
  className,
  as: Tag = 'div',
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        'mx-auto w-full max-w-[1200px] px-4 md:px-6 lg:px-8',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
