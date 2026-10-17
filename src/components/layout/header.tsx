import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/shared/container';
import { Logo } from '@/components/shared/logo';
import { buttonVariants } from '@/components/ui/button';
import { authLinks, navItems } from '@/content/site';
import { Link } from '@/i18n/navigation';
import { HeaderShell } from './header-shell';
import { LocaleSwitcher } from './locale-switcher';
import { MobileNav } from './mobile-nav';
import { NavLinks } from './nav-links';

// The Arabic labels don't fit one row at lg, so the full row starts at xl and
// the menu button covers smaller screens.
export async function Header() {
  const t = await getTranslations();
  const navLabels = {
    mainNavigation: t('Nav.mainNavigation'),
    home: t('Nav.home'),
    about: t('Nav.about'),
    consultations: t('Nav.consultations'),
    training: t('Nav.training'),
    courses: t('Nav.courses'),
    resources: t('Nav.resources'),
    contact: t('Nav.contact'),
  };
  const authLabels = { login: t('Nav.login'), signup: t('Nav.signup') };

  return (
    <HeaderShell>
      <Container
        width="bleed"
        className="flex h-16 items-center gap-3 sm:h-22.25 xl:gap-4"
      >
        <MobileNav
          items={navItems}
          auth={authLinks}
          labels={{
            ...navLabels,
            ...authLabels,
            menuTitle: t('Nav.menuTitle'),
          }}
        />
        <Link
          href="/"
          aria-label={t('Nav.logoLabel')}
          className="shrink-0 rounded-sm text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        >
          <Logo
            title={t('Metadata.siteName')}
            className="h-9 w-auto xl:h-11.25"
          />
        </Link>
        <div className="hidden xl:block">
          <NavLinks items={navItems} labels={navLabels} />
        </div>
        <div className="ms-auto flex items-center gap-4">
          <LocaleSwitcher />
          <div className="hidden items-center gap-2 xl:flex">
            {authLinks.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                className={buttonVariants({
                  variant: key === 'login' ? 'outlineSwap' : 'solidSwap',
                  size: 'sm',
                })}
              >
                {authLabels[key]}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </HeaderShell>
  );
}
