'use client';

import type { AppPathname, NavKey } from '@/content/site';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

export type NavLabels = Record<NavKey | 'mainNavigation', string>;

const variants = {
  // Sized so the Arabic labels fit beside the logo, pill and buttons at xl.
  // English is 16px because Outfit at 14px reads small.
  bar: {
    list: 'flex items-center',
    link: 'px-2 py-2 text-sm ltr:text-base',
  },
  panel: {
    list: 'flex flex-col items-center gap-1',
    link: 'block px-3 py-2.5 text-sm',
  },
} as const;

type NavLinksProps = {
  items: readonly { key: NavKey; href: AppPathname }[];
  labels: NavLabels;
  variant?: keyof typeof variants;
};

export function NavLinks({ items, labels, variant = 'bar' }: NavLinksProps) {
  const pathname = usePathname();
  const styles = variants[variant];

  return (
    <nav aria-label={labels.mainNavigation}>
      <ul className={styles.list}>
        {items.map(({ key, href }) => {
          const current = pathname === href;
          return (
            <li key={key}>
              <Link
                href={href}
                aria-current={current ? 'page' : undefined}
                className={cn(
                  'rounded-lg font-medium whitespace-nowrap transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-brand',
                  styles.link,
                  current ? 'text-brand' : 'text-body',
                )}
              >
                {labels[key]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
