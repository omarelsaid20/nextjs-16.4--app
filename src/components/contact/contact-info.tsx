import { Mail, MapPin, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SocialLinks } from '@/components/shared/social-links';
import { contactInfo } from '@/content/site';
import { cn } from '@/lib/utils';

const link =
  'rounded-sm transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand';

export function ContactInfo({ className }: { className?: string }) {
  const t = useTranslations('Contact.info');

  return (
    <section
      aria-labelledby="contact-info-title"
      className={cn(
        'flex flex-col gap-5 rounded-card border border-brand p-5 text-ink shadow-card sm:p-8 md:gap-8 xl:p-12',
        className,
      )}
    >
      <h2 id="contact-info-title" className="text-xl font-medium md:text-2xl">
        {t('title')}
      </h2>
      <div className="flex flex-col gap-6 text-base font-light sm:text-lg md:text-xl">
        <p>{t('body')}</p>
        {/* Icons are decorative; the sr-only label names each row. */}
        <ul className="flex flex-col gap-6">
          <li className="flex items-center gap-2">
            <MapPin
              aria-hidden
              className="size-5 shrink-0 text-brand sm:size-6"
            />
            <span className="sr-only">{`${t('locationLabel')}: `}</span>
            {t('location')}
          </li>
          <li className="flex items-center gap-2">
            <Phone
              aria-hidden
              className="size-5 shrink-0 text-brand sm:size-6"
            />
            <span className="sr-only">{`${t('phoneLabel')}: `}</span>
            <a href={contactInfo.phoneHref} dir="ltr" className={link}>
              {contactInfo.phoneDisplay}
            </a>
          </li>
          <li className="flex items-center gap-2">
            <Mail
              aria-hidden
              className="size-5 shrink-0 text-brand sm:size-6"
            />
            <span className="sr-only">{`${t('emailLabel')}: `}</span>
            <a
              href={`mailto:${contactInfo.email}`}
              dir="ltr"
              className={cn('break-all', link)}
            >
              {contactInfo.email}
            </a>
          </li>
        </ul>
      </div>
      <div className="flex flex-col gap-4 md:gap-6">
        <p className="text-xl font-medium md:text-2xl">{t('followUs')}</p>
        <SocialLinks variant="card" />
      </div>
    </section>
  );
}
