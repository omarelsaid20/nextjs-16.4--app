'use client';

import { Globe } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';

export function LocaleSwitcher() {
  const t = useTranslations('Nav.localeSwitch');
  const locale = useLocale();
  const pathname = usePathname();
  const other: Locale = locale === 'ar' ? 'en' : 'ar';

  return (
    <Link
      href={pathname}
      locale={other}
      hrefLang={other}
      className="inline-flex h-10 items-center gap-2 rounded-full bg-tint-100 px-3 text-sm font-medium text-brand transition-colors hover:bg-tint-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      {t('short')} <span className="sr-only">{t('label')}</span>
      <Globe aria-hidden className="size-4" />
    </Link>
  );
}
