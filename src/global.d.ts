import type { routing } from '@/i18n/routing';
import type en from '@/messages/en.json';

// Types every locale and message key, so a typo in t('...') fails the typecheck.
declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof en;
  }
}
