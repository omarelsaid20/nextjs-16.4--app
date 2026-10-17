import type { Locale } from '@/i18n/routing';

// Structure only: hrefs, ids and keys. All visible text lives in src/messages.

export const comingSoonSlugs = [
  'about',
  'consultations',
  'training',
  'courses',
  'resources',
  'terms',
  'privacy',
  'login',
  'signup',
] as const;
export type ComingSoonSlug = (typeof comingSoonSlugs)[number];

export function isComingSoonSlug(value: string): value is ComingSoonSlug {
  return (comingSoonSlugs as readonly string[]).includes(value);
}

/** Locale-free paths; next-intl's Link adds the /ar or /en prefix. */
export type AppPathname = '/' | '/contact' | `/${ComingSoonSlug}`;

export type NavKey =
  | 'home'
  | 'about'
  | 'consultations'
  | 'training'
  | 'courses'
  | 'resources'
  | 'contact';

export const navItems: readonly { key: NavKey; href: AppPathname }[] = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'consultations', href: '/consultations' },
  { key: 'training', href: '/training' },
  { key: 'courses', href: '/courses' },
  { key: 'resources', href: '/resources' },
  { key: 'contact', href: '/contact' },
];

export const authLinks: readonly {
  key: 'login' | 'signup';
  href: AppPathname;
}[] = [
  { key: 'login', href: '/login' },
  { key: 'signup', href: '/signup' },
];

export type FooterLinkKey =
  | 'home'
  | 'courses'
  | 'about'
  | 'resources'
  | 'training'
  | 'consultations'
  | 'terms'
  | 'privacy'
  | 'contact';

export const footerLinks: readonly { key: FooterLinkKey; href: AppPathname }[] =
  [
    { key: 'home', href: '/' },
    { key: 'courses', href: '/courses' },
    { key: 'about', href: '/about' },
    { key: 'resources', href: '/resources' },
    { key: 'training', href: '/training' },
    { key: 'consultations', href: '/consultations' },
    { key: 'terms', href: '/terms' },
    { key: 'privacy', href: '/privacy' },
    { key: 'contact', href: '/contact' },
  ];

export const contactInfo = {
  phoneDisplay: '0558045586',
  phoneHref: 'tel:+966558045586',
  email: 'info@growthwave-sa.com',
} as const;

export type SocialId = 'linkedin' | 'instagram' | 'facebook' | 'x';

export const socialLinks: readonly { id: SocialId; href: string }[] = [
  { id: 'linkedin', href: 'https://linkedin.com/company/growthwavesa' },
  { id: 'instagram', href: 'https://instagram.com/growthwavesa' },
  { id: 'facebook', href: 'https://facebook.com/growthwavesa' },
  { id: 'x', href: 'https://x.com/growthwavesa' },
];

export const companyProfileHref = '/files/CompanyProfile.pdf';

/** Keyless Google Maps embed; `hl` shows the map in the page language. */
export function getMapEmbedSrc(locale: Locale): string {
  return `https://www.google.com/maps?q=Riyadh,+Saudi+Arabia&z=11&hl=${locale}&output=embed`;
}

export const mapExternalHref =
  'https://www.google.com/maps/search/?api=1&query=Riyadh%2C+Saudi+Arabia';
