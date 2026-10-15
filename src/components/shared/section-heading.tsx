import { cn } from '@/lib/utils';

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  intro?: string;
  /** Sections point aria-labelledby at this id. */
  titleId: string;
  align?: 'center' | 'start';
  titleAs?: 'h1' | 'h2';
};

// Eyebrow with a brand bar on its inline-start side, then the section title.
export function SectionHeading({
  eyebrow,
  title,
  intro,
  titleId,
  align = 'center',
  titleAs: Title = 'h2',
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex max-w-3xl flex-col gap-3',
        align === 'center' ? 'mx-auto items-center text-center' : 'items-start',
      )}
    >
      <p className="border-s-4 border-brand ps-3 text-lg leading-tight font-medium text-brand md:text-xl">
        {eyebrow}
      </p>
      <Title
        id={titleId}
        className="text-2xl leading-snug font-semibold text-ink md:text-3xl lg:text-[2rem]"
      >
        {title}
      </Title>
      {intro && (
        <p className="text-base leading-relaxed text-body md:text-lg">
          {intro}
        </p>
      )}
    </div>
  );
}
