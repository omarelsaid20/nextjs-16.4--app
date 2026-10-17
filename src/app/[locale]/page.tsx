import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { AboutSection } from '@/components/home/about-section';
import { CoursesSection } from '@/components/home/courses-section';
import { CtaSection } from '@/components/home/cta-section';
import { Hero } from '@/components/home/hero';
import { PartnersSection } from '@/components/home/partners-section';
import { ServicesSection } from '@/components/home/services-section';
import { localeAlternates } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations('Metadata');

  return {
    title: t('home.title'),
    description: t('home.description'),
    alternates: localeAlternates(locale, ''),
    openGraph: { siteName: t('siteName'), locale },
  };
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <ServicesSection />
      <CoursesSection />
      <PartnersSection />
      <CtaSection />
    </>
  );
}
