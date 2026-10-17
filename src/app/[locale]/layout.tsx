import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { getDirection, routing } from '@/i18n/routing';
import { outfit, readexPro } from '../fonts';
import '../globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Canonical and hreflang URLs must be absolute. Vercel sets
// VERCEL_PROJECT_PRODUCTION_URL (domain only, no https://) on every deployment.
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3000',
  ),
};

export default async function LocaleLayout({
  children,
}: LayoutProps<'/[locale]'>) {
  const locale = await getLocale();
  const t = await getTranslations('Nav');

  return (
    <html
      lang={locale}
      dir={getDirection(locale)}
      className={`${outfit.variable} ${readexPro.variable}`}
    >
      <body>
        <NextIntlClientProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:inset-s-4 focus:top-4 focus:z-60 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-medium focus:text-brand focus:shadow-lg"
          >
            {t('skipToContent')}
          </a>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
