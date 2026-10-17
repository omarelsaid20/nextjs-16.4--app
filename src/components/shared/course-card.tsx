import { ChevronRight } from 'lucide-react';
import Image, { type StaticImageData } from 'next/image';
import { getTranslations } from 'next-intl/server';
import { buttonVariants } from '@/components/ui/button';
import type { CourseId } from '@/content/courses';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

type CourseCardProps = {
  id: CourseId;
  image: StaticImageData;
};

// The link is pinned to the bottom so the buttons line up across a row.
export async function CourseCard({ id, image }: CourseCardProps) {
  const t = await getTranslations('Courses');
  const titleId = `course-${id}-title`;

  return (
    <article
      aria-labelledby={titleId}
      className="mx-auto flex w-full max-w-94.5 card-hover flex-col overflow-hidden rounded-4xl border border-brand bg-white"
    >
      <Image
        src={image}
        alt={t('imageAlt')}
        placeholder="blur"
        sizes="378px"
        className="h-auto w-full"
      />
      <div className="flex flex-1 flex-col gap-7 p-6">
        <div className="flex flex-col gap-4">
          <h3 id={titleId} className="text-2xl font-medium text-ink">
            {t(`items.${id}.title`)}
          </h3>
          <p className="text-xl">{t(`items.${id}.category`)}</p>
          <p className="text-base leading-relaxed md:text-xl">
            {t(`items.${id}.description`)}
          </p>
        </div>
        <Link
          href="/courses"
          className={cn(
            buttonVariants({ variant: 'outlineSwap', size: 'pill' }),
            'mt-auto',
          )}
        >
          {t('cta')}
          <ChevronRight
            aria-hidden="true"
            className="size-6 rtl:-scale-x-100"
          />
        </Link>
      </div>
    </article>
  );
}
