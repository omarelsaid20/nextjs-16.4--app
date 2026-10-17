import { cannotTabToLinks, expect, tabKey, test } from './fixtures';

const paths = ['/ar', '/en', '/ar/contact', '/en/contact', '/en/about'];

// One test per page, so the 15 page loads spread across workers.
for (const path of paths) {
  test(`no horizontal overflow on ${path}`, async ({ page }) => {
    for (const width of [375, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      // clientWidth leaves out a classic scrollbar, which innerWidth includes.
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow, `${path} at ${width}px`).toBe(0);
    }
  });
}

test('exactly one h1 per page', async ({ page }) => {
  for (const path of paths) {
    await page.goto(path);
    await expect(page.locator('h1'), path).toHaveCount(1);
  }
});

test('every image has alt text', async ({ page }) => {
  for (const path of paths) {
    await page.goto(path);
    await expect(page.locator('img:not([alt])'), path).toHaveCount(0);
    // Every image on these pages carries content, so none may be silent.
    await expect(page.locator('img[alt=""]'), path).toHaveCount(0);
  }
});

test('hero photo is fetched at full size on phones', async ({ page }) => {
  // object-cover fills a tall screen by height, drawing the wide hero photo
  // far wider than the viewport, so a viewport-sized file looks blurry.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/en');
  const hero = page.locator('main img').first();
  await expect(hero).toHaveJSProperty('complete', true);
  const width = await hero.evaluate(async (img: HTMLImageElement) => {
    const file = await (await fetch(img.currentSrc)).blob();
    return (await createImageBitmap(file)).width;
  });
  // hero-home.png is 1436px wide; anything less is a phone-sized copy.
  expect(width).toBeGreaterThanOrEqual(1436);
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('respects reduced motion', async ({ page }) => {
    await page.goto('/en');
    // Far below the fold, so it has not scrolled into view yet.
    await expect(page.locator('#courses [data-reveal]')).toHaveCSS(
      'opacity',
      '1',
    );
  });
});

test('keyboard: skip link', async ({ page, browserName }) => {
  test.skip(
    cannotTabToLinks(browserName),
    'Windows WebKit cannot tab onto links',
  );
  await page.goto('/en');
  await page.keyboard.press(tabKey(browserName));
  const skip = page.getByRole('link', { name: 'Skip to main content' });
  await expect(skip).toBeFocused();

  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main-content$/);
  await expect(page.locator('#main-content')).toBeInViewport();
});
