import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { StatusPage } from '@/components/shared/status-page';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata');
  return { title: t('notFound.title') };
}

export default async function NotFound() {
  const t = await getTranslations('NotFound');

  return (
    <StatusPage
      title={t('title')}
      body={t('body')}
      actions={
        <Link href="/" className={buttonVariants({ size: 'lg' })}>
          {t('home')}
        </Link>
      }
    />
  );
}
