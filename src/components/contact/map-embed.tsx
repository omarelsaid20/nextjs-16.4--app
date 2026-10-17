import { ExternalLink } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { getMapEmbedSrc, mapExternalHref } from '@/content/site';

export function MapEmbed() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <section aria-labelledby="map-title" className="flex flex-col gap-6">
      <h2 id="map-title" className="text-xl font-medium text-ink md:text-2xl">
        {t('Contact.map.title')}
      </h2>
      <div className="overflow-hidden rounded-card border border-brand shadow-card">
        <iframe
          src={getMapEmbedSrc(locale)}
          title={t('Contact.map.iframeTitle')}
          // As in Google's own embed code: the map's fullscreen button checks
          // this permission, and WebKit throws when it is missing.
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="aspect-4/3 w-full md:aspect-video"
        />
      </div>
      <a
        href={mapExternalHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 self-start rounded-sm font-medium text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        {t('Contact.map.open')}{' '}
        <span className="sr-only">{t('Common.opensInNewTab')}</span>
        <ExternalLink aria-hidden className="size-4 rtl:-scale-x-100" />
      </a>
    </section>
  );
}
