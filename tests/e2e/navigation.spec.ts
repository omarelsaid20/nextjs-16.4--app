import { expect, test } from './fixtures';

test('coming soon pages are localized', async ({ page }) => {
  await page.goto('/en/about');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'About Us — coming soon',
  );
  const main = page.getByRole('main');
  await expect(
    main.getByRole('link', { name: 'Back to home', exact: true }),
  ).toHaveAttribute('href', '/en');
  await expect(
    main.getByRole('link', { name: 'Contact us', exact: true }),
  ).toHaveAttribute('href', '/en/contact');

  await page.goto('/ar/training');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'التدريب — قريبًا',
  );
});

test.describe('not found', () => {
  test.use({ allowedConsoleErrors: [/status of 404/] });

  test('unknown pages return a localized 404', async ({ page }) => {
    for (const [path, title, pageTitle] of [
      ['/en/does-not-exist', 'Page not found', 'Page not found | Growth Wave'],
      ['/en/about/team', 'Page not found', 'Page not found | Growth Wave'],
      ['/ar/xyz', 'الصفحة غير موجودة', 'الصفحة غير موجودة | جروث ويف'],
    ]) {
      const res = await page.goto(path);
      expect(res?.status(), path).toBe(404);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
      await expect(page).toHaveTitle(pageTitle);
    }
  });
});

test('every internal link resolves', async ({ page, request }) => {
  // Five page loads, then about 30 requests: allow three times the timeout.
  test.slow();
  const hrefs = new Set<string>();
  for (const path of [
    '/ar',
    '/en',
    '/ar/contact',
    '/en/contact',
    '/en/about',
  ]) {
    await page.goto(path);
    for (const href of await page
      .locator('a[href^="/"]')
      .evaluateAll((links) => links.map((a) => a.getAttribute('href') ?? '')))
      hrefs.add(href);
  }

  expect(hrefs).toContain('/files/CompanyProfile.pdf');
  for (const href of hrefs) {
    const res = await request.get(href);
    expect(res.status(), href).toBeLessThan(400);
  }
});
