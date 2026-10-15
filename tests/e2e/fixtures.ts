import { test as base, expect } from '@playwright/test';

type Fixtures = { allowedConsoleErrors: RegExp[]; consoleErrors: string[] };

// Every spec imports `test` from here, so any browser console error or
// uncaught page error fails the test (acceptance criterion 5).
export const test = base.extend<Fixtures>({
  allowedConsoleErrors: [[], { option: true }],
  consoleErrors: [
    async ({ page, allowedConsoleErrors }, use) => {
      const errors: string[] = [];
      const record = (text: string) => {
        if (!allowedConsoleErrors.some((re) => re.test(text)))
          errors.push(text);
      };
      page.on('console', (m) => m.type() === 'error' && record(m.text()));
      page.on('pageerror', (e) => record(e.message));
      await use(errors);
      expect(errors, 'browser console errors').toEqual([]);
    },
    { auto: true },
  ],
});
export { expect };
