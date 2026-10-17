import type { Locator, Page } from '@playwright/test';
import { cannotTabToLinks, expect, tabKey, test } from './fixtures';

function hrefsOf(links: Locator) {
  return links.evaluateAll((els) => els.map((el) => el.getAttribute('href')));
}

async function boxOf(locator: Locator) {
  const box = await locator.boundingBox();
  if (!box) throw new Error('element is not rendered');
  return box;
}

test.describe('desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('shows 7 nav links in order with locale-prefixed hrefs', async ({
    page,
  }) => {
    await page.goto('/en');
    const links = page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link');
    await expect(links).toHaveText([
      'Home',
      'About Us',
      'Consultations',
      'Training',
      'Training Areas',
      'Resources',
      'Contact',
    ]);
    expect(await hrefsOf(links)).toEqual([
      '/en',
      '/en/about',
      '/en/consultations',
      '/en/training',
      '/en/courses',
      '/en/resources',
      '/en/contact',
    ]);
  });

  test('Login and Sign Up link to their pages', async ({ page }) => {
    await page.goto('/en');
    await expect(
      page.getByRole('link', { name: 'Login', exact: true }),
    ).toHaveAttribute('href', '/en/login');
    await expect(
      page.getByRole('link', { name: 'Sign Up', exact: true }),
    ).toHaveAttribute('href', '/en/signup');
  });

  test('marks the current page', async ({ page }) => {
    await page.goto('/ar/contact');
    const current = page
      .getByRole('navigation', { name: 'التنقل الرئيسي' })
      .getByRole('link', { name: 'تواصل معنا' });
    await expect(current).toHaveAttribute('aria-current', 'page');
    await expect(current).toHaveCSS('color', 'rgb(0, 71, 171)');
  });

  test('language pill keeps the page', async ({ page }) => {
    await page.goto('/ar/contact');
    // Visible "EN" plus a screen-reader hint: the name starts with the visible
    // text (WCAG 2.5.3 Label in Name).
    const pill = page.getByRole('link', {
      name: 'EN التبديل إلى الإنجليزية',
      exact: true,
    });
    await expect(pill).toHaveAttribute('href', '/en/contact');
    await pill.click();
    // Switching locale swaps the root layout, so Next loads the whole page;
    // under a full parallel run the dev server can take over 5 s to serve it.
    await expect(page).toHaveURL(/\/en\/contact$/, { timeout: 15_000 });
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  });

  test('header gets a shadow after scrolling', async ({ page }) => {
    await page.goto('/en');
    // Make sure the page can scroll, whatever its content height. A separate
    // <style> tag, not body.style, so React's hydration never sees a changed
    // attribute on <body>.
    await page.addStyleTag({ content: 'body { min-height: 3000px; }' });
    await page.mouse.wheel(0, 400);
    await expect(page.getByRole('banner')).toHaveAttribute(
      'data-scrolled',
      'true',
    );
  });

  test('footer links, contact and socials', async ({ page }) => {
    await page.goto('/en');
    const footer = page.getByRole('contentinfo');

    const quickLinks = footer
      .getByRole('navigation', { name: 'Quick Links' })
      .getByRole('link');
    await expect(quickLinks).toHaveCount(9);
    expect(await hrefsOf(quickLinks)).toEqual([
      '/en',
      '/en/courses',
      '/en/about',
      '/en/resources',
      '/en/training',
      '/en/consultations',
      '/en/terms',
      '/en/privacy',
      '/en/contact',
    ]);

    const phone = footer.locator('a[href="tel:+966558045586"]');
    await expect(phone).toHaveText('0558045586');
    await expect(phone).toHaveAttribute('dir', 'ltr');
    await expect(
      footer.locator('a[href="mailto:info@growthwave-sa.com"]'),
    ).toHaveCount(1);

    const socials = footer.getByRole('link', { name: /^Growth Wave on / });
    await expect(socials).toHaveCount(4);
    for (const social of await socials.all()) {
      await expect(social).toHaveAttribute('target', '_blank');
      await expect(social).toHaveAttribute('rel', /noopener/);
    }

    await expect(footer).toContainText(String(new Date().getFullYear()));
  });

  test('footer quick links slide toward the reading direction on hover', async ({
    page,
  }) => {
    const cases = [
      { locale: 'en', label: 'Training Areas', shift: 8 },
      { locale: 'ar', label: 'مجالات التدريب', shift: -8 },
    ];
    for (const { locale, label, shift } of cases) {
      await page.goto(`/${locale}`);
      const link = page
        .getByRole('contentinfo')
        .getByRole('link', { name: label, exact: true });
      const before = await boxOf(link);
      await link.hover();
      await expect
        .poll(async () => Math.round((await boxOf(link)).x - before.x))
        .toBe(shift);
    }
  });
});

// 1280px is the narrowest width with the full desktop row, so the tightest fit.
test.describe('desktop at 1280px', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('header fits one row with the live site sizes', async ({ page }) => {
    const cases = [
      { locale: 'ar', navSize: '14px', auth: ['تسجيل دخول', 'إنشاء حساب'] },
      { locale: 'en', navSize: '16px', auth: ['Login', 'Sign Up'] },
    ];
    for (const { locale, navSize, auth } of cases) {
      await page.goto(`/${locale}`);
      const header = page.getByRole('banner');

      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - innerWidth,
        ),
      ).toBe(0);
      expect(
        await page
          .locator('header > div')
          .evaluate((row) => row.scrollWidth - row.clientWidth),
      ).toBe(0);

      expect(Math.round((await boxOf(header.getByRole('img'))).height)).toBe(
        45,
      );
      for (const name of auth) {
        const button = await boxOf(
          header.getByRole('link', { name, exact: true }),
        );
        expect(Math.round(button.height), name).toBe(38);
        expect(button.width, name).toBeGreaterThanOrEqual(80);
      }

      await expect(
        header.getByRole('navigation').getByRole('link').first(),
      ).toHaveCSS('font-size', navSize);
    }
  });
});

test.describe('mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  async function menuPanel(page: Page, toggle: Locator) {
    const id = await toggle.getAttribute('aria-controls');
    return page.locator(`[id="${id}"]`);
  }

  test('menu drops down under the header and closes with Escape', async ({
    page,
    browserName,
  }) => {
    test.skip(
      cannotTabToLinks(browserName),
      'Windows WebKit cannot tab onto links',
    );
    await page.goto('/ar');
    const toggle = page.getByRole('button', { name: 'القائمة', exact: true });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    const panel = await menuPanel(page, toggle);
    await expect(panel).toBeVisible();

    // Full width, directly under the header.
    const header = await boxOf(page.getByRole('banner'));
    const box = await boxOf(panel);
    expect(Math.abs(box.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(box.width - 375)).toBeLessThanOrEqual(1);
    expect(Math.abs(box.y - (header.y + header.height))).toBeLessThanOrEqual(1);
    // 7 nav links plus Login and Sign Up.
    await expect(panel.getByRole('link')).toHaveCount(9);

    await page.keyboard.press(tabKey(browserName));
    await expect(panel.getByRole('link', { name: 'الرئيسية' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('menu link navigates and closes', async ({ page }) => {
    await page.goto('/en');
    const toggle = page.getByRole('button', { name: 'Menu', exact: true });
    await toggle.click();
    const panel = await menuPanel(page, toggle);
    await panel.getByRole('link', { name: 'Contact', exact: true }).click();
    await expect(page).toHaveURL(/\/en\/contact$/);
    await expect(panel).toBeHidden();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('menu closes on an outside tap and on the toggle', async ({ page }) => {
    await page.goto('/en');
    const toggle = page.getByRole('button', { name: 'Menu', exact: true });
    const panel = await menuPanel(page, toggle);
    await toggle.click();
    await expect(panel).toBeVisible();
    // The copyright line is outside the panel and is not a link.
    await page.getByText('All rights reserved').click();
    await expect(panel).toBeHidden();

    await toggle.click();
    await expect(panel).toBeVisible();
    await toggle.click();
    await expect(panel).toBeHidden();
  });

  // Below xl the ☰ menu also serves laptop windows, where people use a keyboard.
  test.describe('at 1024px', () => {
    test.use({ viewport: { width: 1024, height: 768 } });

    test('menu closes when keyboard focus leaves it', async ({
      page,
      browserName,
    }) => {
      test.skip(
        cannotTabToLinks(browserName),
        'Windows WebKit cannot tab onto links',
      );
      await page.goto('/en');
      const toggle = page.getByRole('button', { name: 'Menu', exact: true });
      const panel = await menuPanel(page, toggle);
      await toggle.click();
      await expect(panel).toBeVisible();

      // Sign Up is the panel's last link. The next Tab leaves the menu, and an
      // open panel would cover whatever takes focus next (the hero button).
      const lastLink = panel.getByRole('link', {
        name: 'Sign Up',
        exact: true,
      });
      await lastLink.focus();
      await page.keyboard.press(tabKey(browserName));
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(panel).toBeHidden();
    });
  });
});
