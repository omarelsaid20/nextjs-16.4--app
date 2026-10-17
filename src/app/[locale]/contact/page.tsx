import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import heroImage from '@/assets/images/hero-contact.png';
import { ContactForm } from '@/components/contact/contact-form';
import { ContactInfo } from '@/components/contact/contact-info';
import { MapEmbed } from '@/components/contact/map-embed';
import { Container } from '@/components/shared/container';
import { PageHero } from '@/components/shared/page-hero';
import { localeAlternates } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations('Metadata');

  return {
    title: t('contact.title'),
    description: t('contact.description'),
    alternates: localeAlternates(locale, '/contact'),
    openGraph: { siteName: t('siteName'), locale },
  };
}

export default async function ContactPage() {
  const t = await getTranslations('Contact.hero');

  return (
    <>
      <PageHero
        image={heroImage}
        imageAlt={t('imageAlt')}
        title={t('title')}
        subtitle={t('subtitle')}
        size="compact"
      />
      <Container className="flex flex-col gap-8 py-8 sm:gap-16 sm:py-16">
        <div className="grid gap-8 rounded-card border border-brand p-5 shadow-card sm:p-8 md:p-12 lg:grid-cols-[11fr_9fr] lg:gap-12 xl:gap-24">
          <ContactForm />
          <ContactInfo className="lg:sticky lg:top-28 lg:order-first lg:self-start" />
        </div>
        <MapEmbed />
      </Container>
    </>
  );
}
