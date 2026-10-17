import type { Metadata } from 'next';
import type { Locale } from '@/i18n/routing';

export function localeAlternates(
  locale: Locale,
  path: '' | `/${string}`,
): NonNullable<Metadata['alternates']> {
  return {
    canonical: `/${locale}${path}`,
    languages: {
      ar: `/ar${path}`,
      en: `/en${path}`,
      'x-default': `/ar${path}`,
    },
  };
}
