import type { Locator } from '@playwright/test';
import { cannotTabToLinks, expect, tabKey, test } from './fixtures';

async function boxOf(locator: Locator) {
  const box = await locator.boundingBox();
  if (!box) throw new Error('element is not rendered');
  return box;
}

test('hero', async ({ page, browserName }) => {
  test.skip(
    cannotTabToLinks(browserName),
    'Windows WebKit cannot tab onto links',
  );
  await page.goto('/en');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Training and Consulting for Sustainable Growth',
  );

  const profile = page.getByRole('link', { name: 'Company Profile' });
  await expect(profile).toHaveAttribute('href', '/files/CompanyProfile.pdf');
  await expect(profile).toHaveAttribute('target', '_blank');
  await expect(profile).toHaveAttribute('rel', /noopener/);
  await expect(profile).toHaveAccessibleName(
    'Company Profile (opens in a new tab)',
  );
  // Reached by keyboard, the ring is white: brand blue barely shows on the photo.
  await profile.focus();
  await page.keyboard.press(`Shift+${tabKey(browserName)}`);
  await page.keyboard.press(tabKey(browserName));
  await expect(profile).toBeFocused();
  await expect(profile).toHaveCSS('outline-color', 'rgb(255, 255, 255)');

  await expect(
    page.getByRole('img', {
      name: 'Saudi professionals talking in a modern office',
    }),
  ).toBeVisible();
});

test('about section', async ({ page }) => {
  await page.goto('/en');
  const about = page.getByRole('region', { name: 'Why Growth Wave?' });

  for (const text of [
    'Learn More About Us',
    'Tailored Programs',
    'Measurable Impact',
    'Expert Guidance',
  ]) {
    await expect(about).toContainText(text);
  }
  await expect(
    about.getByRole('link', { name: 'Discover More' }),
  ).toHaveAttribute('href', '/en/about');
});

test('services section', async ({ page }) => {
  await page.goto('/en');
  const services = page.getByRole('region', {
    name: 'Solutions that empower people and strengthen organizations',
  });

  await expect(services.getByRole('link')).toHaveCount(3);
  for (const [title, href] of [
    ['Consulting', '/en/consultations'],
    ['Training', '/en/training'],
    ['eLearning', '/en/training'],
  ]) {
    await expect(services.getByRole('link', { name: title })).toHaveAttribute(
      'href',
      href,
    );
  }
});

test('arabic home', async ({ page }) => {
  await page.goto('/ar');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'التدريب والاستشارات من أجل نمو مستدام',
  );
  await expect(
    page.getByRole('region', { name: 'لماذا جروث ويف؟' }),
  ).toBeVisible();
});

test('metadata', async ({ page, baseURL }) => {
  await page.goto('/en');
  await expect(page).toHaveTitle(
    'Growth Wave | Training and Consulting for Sustainable Growth',
  );
  // Search engines need absolute canonical and hreflang URLs.
  const url = (path: string) => new URL(path, baseURL).href;
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    url('/en'),
  );
  await expect(
    page.locator('link[rel="alternate"][hreflang="ar"]'),
  ).toHaveAttribute('href', url('/ar'));
});

test('courses grid', async ({ page }) => {
  await page.goto('/en');
  const courses = page.getByRole('region', {
    name: 'Discover Our Training Courses',
  });
  const cards = courses.getByRole('article');

  await expect(cards).toHaveCount(6);
  await expect(cards.getByRole('heading', { level: 3 })).toHaveText([
    'ESG Risk Management',
    'Data Analysis for Business Decisions',
    'Effective Team Leadership',
    'Finance for Non-Financial Professionals',
    'Effective Communication Essentials',
    'Time Management and Productivity Skills',
  ]);
  for (const card of await cards.all()) {
    // An empty alt would drop the image from the img role entirely.
    await expect(card.getByRole('img')).toHaveAttribute('alt', /\S/);
    await expect(
      card.getByRole('link', { name: 'Course Overview' }),
    ).toHaveAttribute('href', '/en/courses');
  }
  await expect(
    courses.getByRole('link', { name: 'Discover more courses' }),
  ).toHaveAttribute('href', '/en/courses');
});

test('courses layout', async ({ page }) => {
  // Reveal's slide-in would offset the boxes mid-animation; reduced motion
  // shows every card at its final position.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/en');
  const cards = page
    .getByRole('region', { name: 'Discover Our Training Courses' })
    .getByRole('article');
  await expect(cards).toHaveCount(6);

  const [first, second, third] = await Promise.all(
    [0, 1, 2].map((i) => boxOf(cards.nth(i))),
  );
  expect(second.y).toBe(first.y);
  expect(third.y).toBe(first.y);

  await page.setViewportSize({ width: 375, height: 812 });
  const boxes = await Promise.all(
    [0, 1, 2, 3, 4, 5].map((i) => boxOf(cards.nth(i))),
  );
  for (let i = 1; i < boxes.length; i++) {
    const previous = boxes[i - 1];
    expect(boxes[i].y).toBeGreaterThan(previous.y + previous.height - 1);
  }
});

test('partners', async ({ page }) => {
  await page.goto('/en');
  const partners = page.getByRole('region', { name: 'Trust We Are Proud Of' });

  await expect(partners.getByRole('img')).toHaveCount(3);
  for (const name of [
    'BSI',
    'National eLearning Center',
    'Technical and Vocational Training Corporation',
  ]) {
    await expect(
      partners.getByRole('img', { name, exact: true }),
    ).toBeVisible();
  }
});

test('call to action', async ({ page }) => {
  await page.goto('/en');
  const cta = page.getByRole('region', {
    name: 'Contact us or become part of our team',
  });
  await expect(cta.getByRole('link', { name: 'Click Here' })).toHaveAttribute(
    'href',
    '/en/contact',
  );
});

test('course link chevron follows the reading direction', async ({ page }) => {
  // Mirrored when the x scale is negative, whether the CSS uses the `scale`
  // property (Tailwind v4's -scale-x-100) or a transform matrix.
  const isMirrored = (el: Element) => {
    const style = getComputedStyle(el);
    const scaleX = style.scale === 'none' ? 1 : parseFloat(style.scale);
    const matrixX =
      style.transform === 'none' ? 1 : new DOMMatrix(style.transform).a;
    return scaleX * matrixX < 0;
  };

  for (const { locale, name, mirrored } of [
    { locale: 'en', name: 'Course Overview', mirrored: false },
    { locale: 'ar', name: 'عرض الدورة', mirrored: true },
  ]) {
    await page.goto(`/${locale}`);
    const chevron = page
      .getByRole('article')
      .first()
      .getByRole('link', { name })
      .locator('svg');
    await expect(chevron).toHaveCount(1);
    expect(await chevron.evaluate(isMirrored)).toBe(mirrored);
  }
});

test('arabic partners and call to action', async ({ page }) => {
  await page.goto('/ar');
  const partners = page.getByRole('region', { name: 'ثقة نفخر بها' });
  for (const name of [
    'المؤسسة البريطانية للمعايير (BSI)',
    'المركز الوطني للتعليم الإلكتروني',
    'المؤسسة العامة للتدريب التقني والمهني',
  ]) {
    await expect(
      partners.getByRole('img', { name, exact: true }),
    ).toBeVisible();
  }

  const cta = page.getByRole('region', {
    name: 'تواصل معنا أو كن جزءًا من فريقنا',
  });
  await expect(cta.getByRole('link', { name: 'اضغط هنا' })).toHaveAttribute(
    'href',
    '/ar/contact',
  );
});
