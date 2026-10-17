import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/shared/container';
import { Reveal } from '@/components/shared/reveal';
import { SectionHeading } from '@/components/shared/section-heading';
import { type PartnerId, partners } from '@/content/partners';

// Heights follow each file's aspect ratio.
// next/image serves SVGs as they are, without optimizing them.
const logoWidths: Record<PartnerId, number> = { bsi: 76, nec: 200, tvtc: 405 };

export async function PartnersSection() {
  const t = await getTranslations('Partners');

  return (
    <section id="partners" aria-labelledby="partners-title" className="py-10">
      <Container>
        <Reveal className="flex flex-col gap-8">
          <SectionHeading
            eyebrow={t('eyebrow')}
            title={t('title')}
            intro={t('intro')}
            titleId="partners-title"
          />
          <ul className="flex flex-wrap items-center justify-center gap-6">
            {partners.map(({ id, logo }) => (
              <li
                key={id}
                className="flex h-30 max-w-full items-center justify-center rounded-full bg-tint-50 px-6 py-2.5 shadow-[0_0_0_4px_rgb(173_202_255/0.2)]"
              >
                <Image
                  src={logo}
                  alt={t(`items.${id}.name`)}
                  width={logoWidths[id]}
                  className="h-auto max-w-full"
                />
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
