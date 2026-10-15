import { getTranslations } from 'next-intl/server';

// Temporary: Task 6 replaces this with the real home page.
export default async function HomePage() {
  const t = await getTranslations();
  return <h1>{t('Hero.title')}</h1>;
}
