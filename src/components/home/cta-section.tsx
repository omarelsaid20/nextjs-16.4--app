import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import ctaImage from '@/assets/images/cta.png';
import { Container } from '@/components/shared/container';
import { Reveal } from '@/components/shared/reveal';
import { SectionHeading } from '@/components/shared/section-heading';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

export async function CtaSection() {
  const t = await getTranslations('Cta');

  return (
    <section id="cta" aria-labelledby="cta-title" className="bg-tint-100 py-10">
      <Container>
        <Reveal className="flex flex-col-reverse items-center gap-8 lg:flex-row lg:justify-between lg:gap-12">
          <div className="flex w-full max-w-[634px] flex-col gap-8">
            <SectionHeading
              eyebrow={t('eyebrow')}
              title={t('title')}
              intro={t('body')}
              titleId="cta-title"
              align="start"
            />
            <Link
              href="/contact"
              className={cn(buttonVariants({ size: 'xl' }), 'self-start')}
            >
              {t('button')}
            </Link>
          </div>
          {/* cta.png has its rounded shape built in (transparent corners). */}
          <Image
            src={ctaImage}
            alt={t('imageAlt')}
            placeholder="blur"
            sizes="413px"
            className="h-auto w-full max-w-[413px] shrink-0"
          />
        </Reveal>
      </Container>
    </section>
  );
}
