import { useTranslations } from 'next-intl';
import type { ComponentType, SVGProps } from 'react';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
} from '@/components/icons/brand-icons';
import { socialLinks, type SocialId } from '@/content/site';
import { cn } from '@/lib/utils';

const icons: Record<SocialId, ComponentType<SVGProps<SVGSVGElement>>> = {
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  x: XIcon,
};

const variants = {
  footer: {
    list: 'gap-3',
    link: 'size-10 bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white',
    icon: 'size-4',
  },
  card: {
    list: 'gap-2 sm:gap-4',
    link: 'size-10 border border-line bg-white text-brand hover:bg-tint-50 focus-visible:outline-brand sm:size-12',
    icon: 'size-5 sm:size-6',
  },
} as const;

export function SocialLinks({ variant }: { variant: keyof typeof variants }) {
  const t = useTranslations();
  const styles = variants[variant];

  return (
    <ul className={cn('flex flex-wrap items-center', styles.list)}>
      {socialLinks.map(({ id, href }) => {
        const Icon = icons[id];
        return (
          <li key={id}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'inline-flex items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2',
                styles.link,
              )}
            >
              <Icon className={styles.icon} />
              <span className="sr-only">
                {t(`Social.${id}`)} {t('Common.opensInNewTab')}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
