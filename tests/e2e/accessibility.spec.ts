import AxeBuilder from '@axe-core/playwright';
import { locales, test, expect } from './fixtures';

for (const locale of locales) {
  test(`${locale} home has no axe violations including contrast`, async ({ page }) => {
    await page.goto(`/${locale}`);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
}
