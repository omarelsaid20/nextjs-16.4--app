import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/shared/container';
import { Reveal } from '@/components/shared/reveal';
import { SectionHeading } from '@/components/shared/section-heading';
import { ServiceCard } from '@/components/shared/service-card';
import { services } from '@/content/services';

export async function ServicesSection() {
  const t = await getTranslations('Services');

  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="pt-10 pb-14"
    >
      <Container>
        <Reveal className="flex flex-col gap-8">
          <SectionHeading
            eyebrow={t('eyebrow')}
            title={t('title')}
            intro={t('intro')}
            titleId="services-title"
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {services.map(({ id, href, icon }) => (
              <ServiceCard
                key={id}
                id={id}
                href={href}
                icon={icon}
                title={t(`items.${id}.title`)}
                description={t(`items.${id}.description`)}
              />
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
