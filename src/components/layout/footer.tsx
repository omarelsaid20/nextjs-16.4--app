import { ChevronRight, Mail, MapPin, Phone } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/shared/container';
import { Logo } from '@/components/shared/logo';
import { SocialLinks } from '@/components/shared/social-links';
import { contactInfo, footerLinks } from '@/content/site';
import { Link } from '@/i18n/navigation';

const focusRing =
  'rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';
const link = `transition-colors hover:text-white ${focusRing}`;
// Quick links slide toward the reading direction on hover.
const quickLink = `inline-flex items-center gap-2 whitespace-nowrap transition duration-500 hover:text-white motion-safe:ltr:hover:translate-x-2 motion-safe:rtl:hover:-translate-x-2 ${focusRing}`;

export async function Footer() {
  const t = await getTranslations();

  return (
    <footer>
      <div className="bg-navy text-white/85">
        <Container
          width="bleed"
          className="grid gap-7.5 py-10 min-[501px]:py-15 min-[1150px]:grid-cols-[1fr_1fr_1.2fr] md:gap-15"
        >
          <div className="flex flex-col gap-5">
            <Link
              href="/"
              aria-label={t('Nav.logoLabel')}
              className={`w-fit text-white ${link}`}
            >
              <Logo title={t('Metadata.siteName')} className="h-12 w-auto" />
            </Link>
            <p className="max-w-sm leading-relaxed">{t('Footer.tagline')}</p>
            <SocialLinks variant="footer" />
          </div>

          <nav aria-labelledby="footer-quick-links">
            <h2
              id="footer-quick-links"
              className="mb-5 text-lg font-semibold text-white"
            >
              {t('Footer.quickLinks')}
            </h2>
            <ul className="grid gap-x-12.5 gap-y-4 min-[871px]:grid-cols-2">
              {footerLinks.map(({ key, href }) => (
                <li key={key}>
                  <Link href={href} className={quickLink}>
                    <ChevronRight
                      aria-hidden
                      className="size-4 shrink-0 rtl:-scale-x-100"
                    />
                    {t(`Footer.links.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="mb-5 text-lg font-semibold text-white">
              {t('Footer.contactTitle')}
            </h2>
            <ul className="flex flex-col gap-4">
              <li className="flex items-center gap-3">
                <MapPin aria-hidden className="size-5 shrink-0" />
                {t('Footer.location')}
              </li>
              <li className="flex items-center gap-3">
                <Phone aria-hidden className="size-5 shrink-0" />
                <a href={contactInfo.phoneHref} dir="ltr" className={link}>
                  {contactInfo.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail aria-hidden className="size-5 shrink-0" />
                <a
                  href={`mailto:${contactInfo.email}`}
                  dir="ltr"
                  className={`break-all ${link}`}
                >
                  {contactInfo.email}
                </a>
              </li>
            </ul>
          </div>
        </Container>
      </div>
      <div className="bg-white">
        <Container
          width="bleed"
          className="py-2 text-center font-medium text-brand min-[501px]:text-xl"
        >
          {t('Footer.rights', { year: new Date().getFullYear() })}
        </Container>
      </div>
    </footer>
  );
}
