import { expect, test } from './fixtures';

test('uses Readex Pro', async ({ page }) => {
  await page.goto('/en');
  // next/font names the family 'Readex Pro' plus a metric-matched fallback.
  const fontFamily = await page.evaluate(
    () => getComputedStyle(document.body).fontFamily,
  );
  expect(fontFamily).toContain('Readex Pro');
});
