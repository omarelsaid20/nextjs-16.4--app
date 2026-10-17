import { test as base, expect } from '@playwright/test';

type Fixtures = { allowedConsoleErrors: RegExp[]; consoleErrors: string[] };

// Every spec imports `test` from here, so any browser console error or
// uncaught page error fails the test.
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

// macOS WebKit tabs onto links only with Option+Tab. Windows WebKit can't tab
// onto links at all, so those tests skip there; Linux CI runs them everywhere.
export const tabKey = (browserName: string) =>
  browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab';
export const cannotTabToLinks = (browserName: string) =>
  browserName === 'webkit' && process.platform === 'win32';
