'use client';

import { Menu } from 'lucide-react';
import { useEffect, useId, useRef, useState, type MouseEvent } from 'react';
import { buttonVariants } from '@/components/ui/button';
import type { AppPathname, NavKey } from '@/content/site';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { NavLinks, type NavLabels } from './nav-links';

type AuthKey = 'login' | 'signup';

type MobileNavProps = {
  items: readonly { key: NavKey; href: AppPathname }[];
  auth: readonly { key: AuthKey; href: AppPathname }[];
  labels: NavLabels & Record<AuthKey | 'menuTitle', string>;
};

export function MobileNav({ items, auth, labels }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onFocusIn(event: FocusEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      if (rootRef.current?.contains(document.activeElement)) {
        toggleRef.current?.focus();
      }
      setOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  function closeOnLinkClick(event: MouseEvent<HTMLDivElement>) {
    if ((event.target as Element).closest('a')) setOpen(false);
  }

  return (
    <div ref={rootRef} className="xl:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-label={labels.menuTitle}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-10 items-center justify-center rounded-lg text-brand transition-colors hover:bg-tint-50 focus-visible:outline-2 focus-visible:outline-brand"
      >
        <Menu aria-hidden className="size-7" />
      </button>

      <div
        id={panelId}
        hidden={!open}
        onClick={closeOnLinkClick}
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-5rem)] overflow-y-auto bg-tint-50 px-5 pt-2 pb-5 shadow-[0_4px_30px_rgb(53_141_255/0.4)]"
      >
        <NavLinks items={items} labels={labels} variant="panel" />
        <div className="mt-2 flex flex-col gap-4">
          {auth.map(({ key, href }) => (
            <Link
              key={key}
              href={href}
              className={cn(
                buttonVariants({
                  variant: key === 'login' ? 'outline' : 'default',
                }),
                'w-full',
                key === 'login' && 'bg-white/80',
              )}
            >
              {labels[key]}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
