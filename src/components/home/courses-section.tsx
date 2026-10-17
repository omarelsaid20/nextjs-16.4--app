import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/shared/container';
import { CourseCard } from '@/components/shared/course-card';
import { Reveal } from '@/components/shared/reveal';
import { SectionHeading } from '@/components/shared/section-heading';
import { buttonVariants } from '@/components/ui/button';
import { courses } from '@/content/courses';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

export async function CoursesSection() {
  const t = await getTranslations('Courses');

  return (
    <section
      id="courses"
      aria-labelledby="courses-title"
      className="bg-tint-100 py-8"
    >
      <Container>
        <Reveal className="flex flex-col gap-8">
          <SectionHeading
            eyebrow={t('eyebrow')}
            title={t('title')}
            intro={t('intro')}
            titleId="courses-title"
          />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {courses.map(({ id, image }) => (
              <CourseCard key={id} id={id} image={image} />
            ))}
          </div>
          <Link
            href="/courses"
            className={cn(buttonVariants({ size: 'xl' }), 'self-center')}
          >
            {t('more')}
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
