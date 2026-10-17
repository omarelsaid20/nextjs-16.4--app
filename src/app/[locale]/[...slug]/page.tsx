import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { StatusPage } from '@/components/shared/status-page';
import { buttonVariants } from '@/components/ui/button';
import { comingSoonSlugs, isComingSoonSlug } from '@/content/site';
import { Link } from '@/i18n/navigation';

export function generateStaticParams() {
  return comingSoonSlugs.map((slug) => ({ slug: [slug] }));
}

function comingSoonSlug(slug: string[]) {
  return slug.length === 1 && isComingSoonSlug(slug[0]) ? slug[0] : undefined;
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/[...slug]'>): Promise<Metadata> {
  const page = comingSoonSlug((await params).slug);
  if (!page) notFound();
  const t = await getTranslations();

  return {
    title: t('Metadata.comingSoon.title', {
      page: t(`ComingSoon.pages.${page}`),
    }),
  };
}

// Every nav and footer link without a real page yet lands here, so no link is
// broken; anything else is a localized 404.
export default async function ComingSoonPage({
  params,
}: PageProps<'/[locale]/[...slug]'>) {
  const page = comingSoonSlug((await params).slug);
  if (!page) notFound();
  const t = await getTranslations('ComingSoon');

  return (
    <StatusPage
      title={t('title', { page: t(`pages.${page}`) })}
      body={t('body')}
      actions={
        <>
          <Link href="/" className={buttonVariants({ size: 'lg' })}>
            {t('home')}
          </Link>
          <Link
            href="/contact"
            className={buttonVariants({ variant: 'outline', size: 'lg' })}
          >
            {t('contact')}
          </Link>
        </>
      }
    />
  );
}
