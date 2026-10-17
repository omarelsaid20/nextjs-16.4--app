import type { LucideIcon } from 'lucide-react';
import type { ServiceId } from '@/content/services';
import type { AppPathname } from '@/content/site';
import { Link } from '@/i18n/navigation';

type ServiceCardProps = {
  id: ServiceId;
  href: AppPathname;
  icon: LucideIcon;
  title: string;
  description: string;
};

// The link is named by the title alone; screen readers read the description
// after it.
export function ServiceCard({
  id,
  href,
  icon: Icon,
  title,
  description,
}: ServiceCardProps) {
  const titleId = `service-${id}-title`;
  const descriptionId = `service-${id}-description`;

  return (
    <Link
      href={href}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className="relative mx-auto flex min-h-75 w-full max-w-87.5 card-hover flex-col gap-4 rounded-[26px] border-2 border-brand px-4 pt-22.5 pb-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand md:pt-27.5 lg:pt-30"
    >
      <span
        aria-hidden="true"
        className="absolute inset-s-0 top-0 flex size-20 items-center justify-center rounded-3xl bg-brand text-white md:size-23.25"
      >
        <Icon className="size-10 md:size-12" />
      </span>
      <h3
        id={titleId}
        className="text-2xl leading-relaxed font-medium text-ink"
      >
        {title}
      </h3>
      <p id={descriptionId} className="text-base leading-relaxed md:text-xl">
        {description}
      </p>
    </Link>
  );
}
