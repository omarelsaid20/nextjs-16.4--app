'use client';

import { useTranslations } from 'next-intl';
import { StatusPage } from '@/components/shared/status-page';
import { Button } from '@/components/ui/button';

// Next requires error boundaries to be client components. `retry` replaced
// `reset` as the recommended prop in Next 16.3.
export default function ErrorPage({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const t = useTranslations('Error');

  return (
    <StatusPage
      title={t('title')}
      body={t('body')}
      actions={
        <Button size="lg" onClick={() => retry()}>
          {t('retry')}
        </Button>
      }
    />
  );
}
