import { test as base, expect, type Page } from '@playwright/test';

export const locales = ['fr', 'en'] as const;
export type Locale = (typeof locales)[number];

export const publicPaths = [
  '',
  '/entreprise',
  '/poles',
  '/services',
  '/approche',
  '/faq',
  '/contact',
  '/poles/security-biometrics',
  '/poles/logistics-tracking',
  '/poles/hygiene-pest-control',
  '/poles/business-marketing',
  '/poles/travel-escapes',
  '/services/pest-control',
  '/services/cleaning',
  '/services/travel-tourism',
  '/services/disinfection-sanitation',
  '/services/facility-management',
  '/services/transport-logistics',
  '/services/trading-supply',
] as const;

export const test = base.extend<{ openPublic: (locale: Locale, path?: string) => Promise<void> }>({
  openPublic: async ({ page }, fixture) => {
    await fixture(async (locale, path = '') => {
      await page.goto(`/${locale}${path}`);
    });
  },
});

export { expect };

export async function expectPublicShell(page: Page, locale: Locale) {
  await expect(page.locator('html')).toHaveAttribute('lang', locale);
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
}
