import Image, { type StaticImageData } from 'next/image';
import type { ReactNode } from 'react';
import { Container } from '@/components/shared/container';
import { cn } from '@/lib/utils';

const heights = {
  // svh keeps the wave in view on phones whose browser bars cover part of vh.
  full: 'h-svh min-h-160 pb-25',
  compact: 'h-[60svh] min-h-[493px]',
} as const;

type PageHeroProps = {
  image: StaticImageData;
  imageAlt: string;
  title: string;
  subtitle: string;
  action?: ReactNode;
  size?: keyof typeof heights;
};

// The hero photos come darkened, with the wave cut out of their bottom edge,
// so the white page behind them draws the wave. Not mirrored in RTL: that
// would mirror the people in them.
export function PageHero({
  image,
  imageAlt,
  title,
  subtitle,
  action,
  size = 'full',
}: PageHeroProps) {
  return (
    <Container
      as="section"
      width="bleed"
      className={cn(
        'relative isolate flex flex-col items-center justify-center gap-8 text-center text-white',
        heights[size],
      )}
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        preload
        placeholder="blur"
        // object-cover draws these ~1440px panoramas at least 1440px wide on
        // every screen, so always fetch the full-size file.
        sizes="1440px"
        className="-z-10 object-cover"
      />
      <div className="flex max-w-240 flex-col items-center gap-6">
        <h1 className="text-2xl leading-snug font-bold md:text-[2rem] xl:text-[2.5rem]">
          {title}
        </h1>
        <p className="text-base leading-relaxed font-medium md:text-xl xl:text-2xl">
          {subtitle}
        </p>
      </div>
      {action}
    </Container>
  );
}
