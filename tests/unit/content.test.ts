import { expect, it } from 'vitest';
import { courses } from '@/content/courses';
import { partners } from '@/content/partners';
import { services } from '@/content/services';
import {
  authLinks,
  comingSoonSlugs,
  footerLinks,
  navItems,
} from '@/content/site';
import ar from '@/messages/ar.json';
import en from '@/messages/en.json';

const messages = [ar, en];
const internalHrefs = [
  ...navItems,
  ...authLinks,
  ...footerLinks,
  ...services,
].map((item) => item.href);

it('every nav, auth and footer link has a label in both locales', () => {
  for (const m of messages) {
    for (const { key } of [...navItems, ...authLinks])
      expect(m.Nav[key], key).toBeTruthy();
    for (const { key } of footerLinks)
      expect(m.Footer.links[key], key).toBeTruthy();
  }
});

it('every service, course and partner has its copy in both locales', () => {
  for (const m of messages) {
    for (const { id } of services) {
      expect(m.Services.items[id]?.title, id).toBeTruthy();
      expect(m.Services.items[id]?.description, id).toBeTruthy();
    }
    for (const { id } of courses) {
      expect(m.Courses.items[id]?.title, id).toBeTruthy();
      expect(m.Courses.items[id]?.category, id).toBeTruthy();
      expect(m.Courses.items[id]?.description, id).toBeTruthy();
    }
    for (const { id } of partners)
      expect(m.Partners.items[id]?.name, id).toBeTruthy();
  }
});

it('every coming-soon slug has a page name', () => {
  for (const m of messages)
    for (const slug of comingSoonSlugs)
      expect(m.ComingSoon.pages[slug], slug).toBeTruthy();
});

// Acceptance criterion 3 at the data level: no internal link points nowhere.
it('every internal href has a page', () => {
  const pages = new Set<string>([
    '/',
    '/contact',
    ...comingSoonSlugs.map((slug) => `/${slug}`),
  ]);
  for (const href of internalHrefs) expect(pages, href).toContain(href);
});

it('hrefs are locale-agnostic', () => {
  for (const href of internalHrefs)
    expect(href).not.toMatch(/^\/(ar|en)(\/|$)/);
});
