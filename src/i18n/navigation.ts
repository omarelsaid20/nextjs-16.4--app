import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Locale-aware wrappers: `<Link href="/contact">` renders /ar/contact or /en/contact.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
