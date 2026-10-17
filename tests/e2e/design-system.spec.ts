import { expect, test } from './fixtures';

test('uses Outfit for Latin text and Readex Pro for Arabic', async ({
  page,
}) => {
  await page.goto('/en');
  // next/font names each family plus a metric-matched fallback. Latin glyphs
  // come from Outfit; Arabic ones fall through to Readex Pro.
  const fontFamily = await page.evaluate(
    () => getComputedStyle(document.body).fontFamily,
  );
  expect(fontFamily).toContain('Outfit');
  expect(fontFamily).toContain('Readex Pro');
  expect(fontFamily.indexOf('Outfit')).toBeLessThan(
    fontFamily.indexOf('Readex Pro'),
  );
});

// The order of names is not enough: a fallback face with Arabic glyphs (next/font's
// Arial-based "Outfit Fallback") once drew all Arabic text. Ask Chrome which fonts
// actually draw the page title.
test('Chrome draws Arabic with Readex Pro and Latin with Outfit', async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'uses the Chrome DevTools protocol');
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('DOM.enable');
  await cdp.send('CSS.enable');
  async function fontsDrawing(selector: string) {
    await page.evaluate(() => document.fonts.ready);
    const { root } = await cdp.send('DOM.getDocument');
    const { nodeId } = await cdp.send('DOM.querySelector', {
      nodeId: root.nodeId,
      selector,
    });
    const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', {
      nodeId,
    });
    return fonts.map((font) => font.familyName);
  }

  await page.goto('/ar');
  const ar = await fontsDrawing('main h1');
  // Spaces may come from Outfit; every Arabic letter must come from Readex Pro.
  expect(
    ar.some((name) => name.startsWith('Readex Pro')),
    ar.join(),
  ).toBe(true);
  expect(
    ar.every((name) => /^(Outfit|Readex Pro)/.test(name)),
    ar.join(),
  ).toBe(true);

  await page.goto('/en');
  const en = await fontsDrawing('main h1');
  expect(
    en.every((name) => name.startsWith('Outfit')),
    en.join(),
  ).toBe(true);
});
