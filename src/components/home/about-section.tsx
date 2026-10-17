import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import aboutImage from '@/assets/images/about.png';
import { Container } from '@/components/shared/container';
import { FeatureCard } from '@/components/shared/feature-card';
import { Reveal } from '@/components/shared/reveal';
import { SectionHeading } from '@/components/shared/section-heading';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

// Keys of About.features in the message files, in display order.
const features = ['tailored', 'impact', 'guidance'] as const;

// The Services section below owns the gap between the two.
export async function AboutSection() {
  const t = await getTranslations('About');

  return (
    <section id="about" aria-labelledby="about-title" className="pt-8">
      <Container>
        <Reveal className="flex flex-col gap-6">
          <SectionHeading
            eyebrow={t('eyebrow')}
            title={t('title')}
            titleId="about-title"
          />

          <div className="flex flex-col-reverse items-center gap-6 lg:flex-row">
            <div className="flex w-full flex-1 flex-col gap-4">
              <h3 className="text-2xl leading-snug font-semibold text-ink md:text-3xl lg:text-[2rem]">
                {t('subtitle')}
              </h3>
              <p className="text-base leading-relaxed md:text-xl">
                {t('body')}
              </p>
            </div>
            {/* about.png has its rounded corners built in (transparent). */}
            <Image
              src={aboutImage}
              alt={t('imageAlt')}
              placeholder="blur"
              sizes="413px"
              className="h-auto w-full max-w-103.25 shrink-0"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {features.map((key) => (
              <FeatureCard
                key={key}
                title={t(`features.${key}.title`)}
                description={t(`features.${key}.description`)}
              />
            ))}
          </div>

          <Link
            href="/about"
            className={cn(buttonVariants({ size: 'xl' }), 'mt-2 self-center')}
          >
            {t('cta')}
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
