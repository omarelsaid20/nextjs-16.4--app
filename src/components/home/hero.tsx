import { getTranslations } from 'next-intl/server';
import heroImage from '@/assets/images/hero-home.png';
import { PageHero } from '@/components/shared/page-hero';
import { buttonVariants } from '@/components/ui/button';
import { companyProfileHref } from '@/content/site';

// The Company Profile is a static PDF in public/, so it is a plain <a>:
// next-intl's Link would prefix its path with /ar or /en.
export async function Hero() {
  const t = await getTranslations();

  return (
    <PageHero
      image={heroImage}
      imageAlt={t('Hero.imageAlt')}
      title={t('Hero.title')}
      subtitle={t('Hero.subtitle')}
      action={
        <a
          href={companyProfileHref}
          target="_blank"
          rel="noopener"
          className={buttonVariants({ variant: 'inverse', size: 'xl' })}
        >
          {t('Hero.cta')}{' '}
          <span className="sr-only">{t('Common.opensInNewTab')}</span>
        </a>
      }
    />
  );
}
