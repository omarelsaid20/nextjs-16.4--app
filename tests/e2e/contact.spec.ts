import type { Locator, Page } from '@playwright/test';
import { expect, test } from './fixtures';

async function boxOf(locator: Locator) {
  const box = await locator.boundingBox();
  if (!box) throw new Error('element is not rendered');
  return box;
}

const field = (page: Page, name: string) =>
  page.getByRole('textbox', { name, exact: true });
const contactForm = (page: Page) =>
  page.getByRole('form', { name: 'Send Us a Message' });
const sendButton = (page: Page) =>
  page.getByRole('button', { name: 'Send', exact: true });

const valid = {
  'Full Name': 'Omar Ahmed',
  'Email Address': 'omar@example.com',
  'Phone Number': '0558045586',
  Subject: 'Training inquiry',
  Message: 'I would like to know more about your programs.',
};

async function fillValid(page: Page) {
  for (const [name, value] of Object.entries(valid))
    await field(page, name).fill(value);
}

test('page content', async ({ page }) => {
  await page.goto('/en/contact');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Contact Us',
  );

  const info = page.getByRole('region', { name: 'Contact Information' });
  await expect(info.locator('a[href="tel:+966558045586"]')).toHaveText(
    '0558045586',
  );
  await expect(
    info.locator('a[href="mailto:info@growthwave-sa.com"]'),
  ).toHaveText('info@growthwave-sa.com');
  await expect(
    info.getByRole('link', { name: /opens in a new tab/ }),
  ).toHaveCount(4);

  const map = page.locator(
    'iframe[title="Growth Wave location in Riyadh on Google Maps"]',
  );
  await expect(map).toHaveAttribute('loading', 'lazy');
  await expect(map).toHaveAttribute('src', /output=embed/);
  await expect(map).toHaveAttribute('src', /hl=en/);
  await expect(
    page.getByRole('link', { name: 'Open in Google Maps' }),
  ).toHaveAttribute('target', '_blank');
});

test('map loads without console errors', async ({ page }) => {
  // The iframe is lazy, so scroll to it to let the console fixture see what
  // Google's page logs.
  await page.goto('/en/contact');
  const map = page.locator(
    'iframe[title="Growth Wave location in Riyadh on Google Maps"]',
  );
  await map.scrollIntoViewIfNeeded();
  const frame = await (await map.elementHandle())?.contentFrame();
  if (!frame) throw new Error('map iframe has no frame');
  await frame.waitForURL(/google\.com\/maps\/embed/);
  // Google builds its map controls last, in the same step as WebKit's
  // fullscreen permission check, so wait until the controls exist.
  await expect(
    frame.getByRole('button', { name: 'Map camera controls' }),
  ).toBeVisible({ timeout: 15_000 });
  // Let the map's own scripts settle.
  await page.waitForTimeout(500);
});

test('shows every required error on empty submit', async ({ page }) => {
  await page.goto('/en/contact');
  await sendButton(page).click();

  for (const text of [
    'Enter your full name.',
    'Enter your email address.',
    'Enter your phone number.',
    'Enter a subject.',
    'Enter your message.',
  ])
    await expect(page.getByText(text, { exact: true })).toBeVisible();
  const fullName = field(page, 'Full Name');
  await expect(fullName).toBeFocused();
  await expect(fullName).toHaveAttribute('aria-invalid', 'true');
});

test('validates phone on blur', async ({ page }) => {
  await page.goto('/en/contact');
  await field(page, 'Phone Number').fill('0158045586');
  await page.keyboard.press('Tab');

  await expect(
    page.getByText(
      'Enter a Saudi mobile number like 05XXXXXXXX or +9665XXXXXXXX.',
      { exact: true },
    ),
  ).toBeVisible();
});

test('submits a valid message', async ({ page }) => {
  await page.goto('/en/contact');
  await fillValid(page);
  await sendButton(page).click();

  await expect(
    page.getByRole('button', { name: 'Sending…', exact: true }),
  ).toBeDisabled();
  await expect(contactForm(page).getByRole('status')).toContainText(
    'Message sent',
  );
  for (const name of Object.keys(valid))
    await expect(field(page, name)).toHaveValue('');
});

test('double click sends once', async ({ page }) => {
  let posts = 0;
  page.on('request', (request) => {
    if (request.method() === 'POST' && request.url().endsWith('/api/contact'))
      posts += 1;
  });
  await page.goto('/en/contact');
  await fillValid(page);
  await sendButton(page).dblclick();

  await expect(contactForm(page).getByRole('status')).toContainText(
    'Message sent',
  );
  expect(posts).toBe(1);
});

test.describe('server error', () => {
  test.use({ allowedConsoleErrors: [/status of 500/] });

  test('keeps values and shows an error message on server error', async ({
    page,
  }) => {
    await page.route('**/api/contact', (route) =>
      route.fulfill({ status: 500, json: { ok: false } }),
    );
    await page.goto('/en/contact');
    await fillValid(page);
    await sendButton(page).click();

    await expect(contactForm(page).getByRole('alert')).toContainText(
      'Couldn’t send your message',
    );
    await expect(field(page, 'Full Name')).toHaveValue(valid['Full Name']);
  });
});

test.describe('server validation', () => {
  test.use({ allowedConsoleErrors: [/status of 422/] });

  test('maps server field errors onto fields', async ({ page }) => {
    await page.route('**/api/contact', (route) =>
      route.fulfill({
        status: 422,
        json: { ok: false, fieldErrors: { email: 'email.invalid' } },
      }),
    );
    await page.goto('/en/contact');
    await fillValid(page);
    await sendButton(page).click();

    await expect(
      page.getByText('Enter a valid email address, like name@company.com.', {
        exact: true,
      }),
    ).toBeVisible();
    const email = field(page, 'Email Address');
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await expect(email).toHaveAccessibleDescription(
      'Enter a valid email address, like name@company.com.',
    );
    for (const name of ['Full Name', 'Phone Number', 'Subject', 'Message'])
      await expect(field(page, name)).toHaveAttribute('aria-invalid', 'false');
    for (const [name, value] of Object.entries(valid))
      await expect(field(page, name)).toHaveValue(value);
  });
});

test('arabic form', async ({ page }) => {
  await page.goto('/ar/contact');
  await page.getByRole('button', { name: 'إرسال', exact: true }).click();

  await expect(
    page.getByText('أدخل اسمك الكامل.', { exact: true }),
  ).toBeVisible();
  await expect(field(page, 'البريد الإلكتروني')).toHaveAttribute('dir', 'ltr');
  await expect(
    page.locator('iframe[title="موقع جروث ويف في الرياض على خرائط جوجل"]'),
  ).toHaveAttribute('src', /hl=ar/);
});

test('arabic phone example keeps the plus sign in front', async ({ page }) => {
  await page.goto('/ar/contact');
  const phone = field(page, 'رقم الجوال');
  await phone.fill('123');
  await phone.blur();
  const error = page.getByText(/^أدخل رقم جوال سعودي/);
  await expect(error).toBeVisible();

  // Where the browser draws the + and the 9 after it in "+9665XXXXXXXX".
  // Without bidi isolation the RTL paragraph puts the + after the digits.
  const [plus, nine] = await error.evaluate((p) => {
    const text = p.firstChild as Text;
    const i = text.data.indexOf('+');
    return [i, i + 1].map((start) => {
      const range = document.createRange();
      range.setStart(text, start);
      range.setEnd(text, start + 1);
      const { left, right } = range.getBoundingClientRect();
      return { left, right };
    });
  });
  expect(plus.right).toBeLessThanOrEqual(nine.left + 1);
});

test('form comes before the info card on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/en/contact');

  const form = await boxOf(contactForm(page));
  const info = await boxOf(
    page.getByRole('region', { name: 'Contact Information' }),
  );
  expect(form.y).toBeLessThan(info.y);
});

test('links each error to its field', async ({ page }) => {
  await page.goto('/en/contact');
  await sendButton(page).click();

  for (const [name, error] of [
    ['Full Name', 'Enter your full name.'],
    ['Email Address', 'Enter your email address.'],
    ['Phone Number', 'Enter your phone number.'],
    ['Subject', 'Enter a subject.'],
  ])
    await expect(field(page, name)).toHaveAccessibleDescription(error);
  await expect(field(page, 'Message')).toHaveAccessibleDescription(
    /Enter your message\./,
  );
});

test('marks every field required without reading the asterisk', async ({
  page,
}) => {
  await page.goto('/en/contact');
  // field() matches the exact name, so an asterisk in the name fails it.
  for (const name of Object.keys(valid))
    await expect(field(page, name)).toHaveAttribute('aria-required', 'true');
});

test('counts message characters', async ({ page }) => {
  await page.goto('/en/contact');
  const counter = contactForm(page).getByText(/^\d+\/1000$/);
  await expect(counter).toHaveText('0/1000');

  await field(page, 'Message').fill('Hello there!');
  await expect(counter).toHaveText('12/1000');
  await expect(field(page, 'Message')).toHaveAccessibleDescription('12/1000');
});

test('gives contact inputs the right hints', async ({ page }) => {
  await page.goto('/en/contact');
  await expect(field(page, 'Full Name')).toHaveAttribute(
    'autocomplete',
    'name',
  );
  const email = field(page, 'Email Address');
  await expect(email).toHaveAttribute('autocomplete', 'email');
  await expect(email).toHaveAttribute('dir', 'ltr');
  const phone = field(page, 'Phone Number');
  await expect(phone).toHaveAttribute('autocomplete', 'tel');
  await expect(phone).toHaveAttribute('inputmode', 'tel');
  await expect(phone).toHaveAttribute('dir', 'ltr');
});

test('re-validates a touched field while typing', async ({ page }) => {
  await page.goto('/en/contact');
  const phone = field(page, 'Phone Number');
  await phone.fill('0158045586');
  await page.keyboard.press('Tab');
  const error = page.getByText(
    'Enter a Saudi mobile number like 05XXXXXXXX or +9665XXXXXXXX.',
    { exact: true },
  );
  await expect(error).toBeVisible();

  await phone.fill('0558045586');
  await expect(phone).toBeFocused();
  await expect(error).toBeHidden();
});

test('focuses the first invalid field on submit', async ({ page }) => {
  await page.goto('/en/contact');
  await fillValid(page);
  await field(page, 'Phone Number').fill('123');
  await sendButton(page).click();

  await expect(field(page, 'Phone Number')).toBeFocused();
  await expect(field(page, 'Full Name')).not.toHaveAttribute(
    'aria-invalid',
    'true',
  );
});

test('sends the phone normalized', async ({ page }) => {
  await page.goto('/en/contact');
  await fillValid(page);
  await field(page, 'Phone Number').fill('٠٥٥٨٠٤٥٥٨٦');
  const request = page.waitForRequest(
    (r) => r.method() === 'POST' && r.url().endsWith('/api/contact'),
  );
  await sendButton(page).click();

  expect((await request).postDataJSON().phone).toBe('0558045586');
  await expect(contactForm(page).getByRole('status')).toContainText(
    'Message sent',
  );
});

test.describe('after a success', () => {
  test.use({ allowedConsoleErrors: [/status of 500/] });

  test('a new submit clears the previous status', async ({ page }) => {
    await page.goto('/en/contact');
    const form = contactForm(page);
    await fillValid(page);
    await sendButton(page).click();
    await expect(form.getByRole('status')).toContainText('Message sent');
    await expect(form.locator('[aria-invalid="true"]')).toHaveCount(0);

    // A submit that fails in the browser's own validation clears it too.
    await sendButton(page).click();
    await expect(form.getByRole('status')).toHaveText('');

    await page.route('**/api/contact', (route) =>
      route.fulfill({ status: 500, json: { ok: false } }),
    );
    await fillValid(page);
    await sendButton(page).click();
    await expect(form.getByRole('alert')).toContainText(
      'Couldn’t send your message',
    );
    await expect(form.getByRole('status')).toHaveText('');
  });
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('send stays disabled until the form is interactive', async ({
    page,
  }) => {
    await page.goto('/en/contact');
    await expect(sendButton(page)).toBeDisabled();
  });
});
