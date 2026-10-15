import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import { getDirection, routing } from '@/i18n/routing';
import { readexPro } from '../fonts';
import '../globals.css';

// Prerender /ar and /en at build time.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
}: LayoutProps<'/[locale]'>) {
  // i18n/request.ts has already validated the [locale] segment (unknown → 404).
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      dir={getDirection(locale)}
      className={readexPro.variable}
    >
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
