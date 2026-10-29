import AxeBuilder from '@axe-core/playwright';
import { locales, test, expect } from './fixtures';

for (const locale of locales) {
  for (const path of ['', '/services', '/faq', '/contact']) {
  test(`${locale}${path || '/'} has no axe violations including contrast`, async ({ page }) => {
    await page.goto(`/${locale}${path}`);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
  }
}
