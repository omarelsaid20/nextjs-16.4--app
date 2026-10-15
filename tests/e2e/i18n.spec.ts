import { expect, test } from './fixtures';

test.describe('Arabic browser', () => {
  test.use({ locale: 'ar-SA' });

  test("'/' sends an Arabic browser to /ar", async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/ar$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });
});

test.describe('English browser', () => {
  test.use({ locale: 'en-US' });

  test("'/' sends an English browser to /en", async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  });

  test('NEXT_LOCALE cookie wins over Accept-Language', async ({
    page,
    context,
  }) => {
    await context.addCookies([
      { name: 'NEXT_LOCALE', value: 'ar', url: 'http://localhost:3000' },
    ]);
    await page.goto('/');
    await expect(page).toHaveURL(/\/ar$/);
  });
});

test('renders the localized hero title', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Training and Consulting for Sustainable Growth',
  );
  await page.goto('/ar');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'التدريب والاستشارات من أجل نمو مستدام',
  );
});
