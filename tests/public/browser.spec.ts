import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { paths } from '../routing/fixtures';
for (const locale of ['fr', 'en']) {
  test(`${locale} all 19 published routes render on the server without internal data`, async ({
    request,
  }) => {
    for (const path of paths) {
      const response = await request.get(`/${locale}${path}`);
      expect(response.status(), path).toBe(200);
      const html = await response.text();
      expect(html).not.toContain('Publication coming soon');
      expect(html).not.toContain('Publication à venir');
      expect(html).not.toMatch(
        /editorialNotes|publicationApproved|translationIssues|Test fixture|Disposable browser fixture/,
      );
      expect(html).toContain(locale === 'fr' ? 'lang="fr"' : 'lang="en"');
    }
  });
  test(`${locale} catalogue combines search and division, resets and announces empty results`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/services`);
    await expect(page.locator('[data-service-card]')).toHaveCount(7);
    const search = page.getByRole('searchbox');
    await search.fill(locale === 'fr' ? 'NETTOYAGE' : 'CLEANING');
    await expect(page.locator('[data-service-card]')).toHaveCount(1);
    await page.getByRole('combobox').selectOption('travel-escapes');
    await expect(page.locator('[data-service-card]')).toHaveCount(0);
    await expect(page.getByRole('status')).toHaveText(
      locale === 'fr' ? 'Aucun service trouvé' : 'No service found',
    );
    await search.fill('');
    await expect(page.locator('[data-service-card]')).toHaveCount(1);
    await page.getByRole('combobox').selectOption('');
    await expect(page.locator('[data-service-card]')).toHaveCount(7);
    await search.fill(locale === 'fr' ? 'DESINFECTION' : 'disinfection');
    await expect(page.locator('[data-service-card]')).toHaveCount(1);
  });
  test(`${locale} FAQ keyboard disclosure and contextual detail navigation`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/faq`);
    const summary = page.locator('summary').first();
    await expect(page.locator('details[open]')).toHaveCount(0);
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('details[open]')).toHaveCount(1);
    await page.keyboard.press('Space');
    await expect(page.locator('details[open]')).toHaveCount(0);
    await page.goto(`/${locale}/poles/hygiene-pest-control`);
    await expect(page.locator('main [data-service-card]')).toHaveCount(4);
    await page
      .locator(`main a[href="/${locale}/services/cleaning"]`)
      .first()
      .click();
    await expect(
      page.locator('main .breadcrumb [aria-current="page"]'),
    ).toBeVisible();
    await page.locator('main .public-contact a').click();
    await expect(page).toHaveURL(
      new RegExp(
        `/${locale}/contact\\?service=cleaning&division=hygiene-pest-control$`,
      ),
    );
  });
  test(`${locale} accessibility across public page families`, async ({
    page,
  }) => {
    for (const path of [
      '',
      '/entreprise',
      '/poles',
      '/poles/hygiene-pest-control',
      '/services',
      '/services/cleaning',
      '/approche',
      '/faq',
      '/contact',
    ]) {
      await page.goto(`/${locale}${path}`);
      const result = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect(result.violations, path).toEqual([]);
    }
  });
}
test('responsive page families, visible focus and computed reduced motion', async ({
  page,
}, info) => {
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      '',
      '/poles',
      '/services',
      '/faq',
      '/services/cleaning',
    ]) {
      await page.goto(`/fr${path}`);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${width} ${path}`,
      ).toBe(true);
    }
    await page.screenshot({
      path: info.outputPath(`service-${width}.png`),
      fullPage: true,
    });
  }
  await page.goto('/fr/services');
  await page.getByRole('searchbox').focus();
  expect(
    await page
      .getByRole('searchbox')
      .evaluate((el) => getComputedStyle(el).outlineStyle),
  ).toBe('solid');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(
    await page
      .locator('html')
      .evaluate((el) => getComputedStyle(el).scrollBehavior),
  ).toBe('auto');
  expect(
    await page
      .locator('main .line-link .icon')
      .first()
      .evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe('0s');
});
