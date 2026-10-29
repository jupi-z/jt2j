import { locales, test, expect } from './fixtures';

for (const locale of locales) {
  test(`${locale} services remains usable at mobile width`, async ({ page, openPublic }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openPublic(locale, '/services');
    await expect(page.locator('main')).toBeVisible();
    await expect(page.getByRole('searchbox', { name: /rechercher un service|search services/i })).toBeVisible();
    const viewport = await page.locator('main').evaluate((element) => ({
      scrollWidth: element.scrollWidth,
      clientWidth: element.clientWidth,
    }));
    expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth + 1);
  });

  test(`${locale} contact form stays within the mobile viewport`, async ({ page, openPublic }) => {
    await openPublic(locale, '/contact');
    const form = page.locator('form');
    await expect(form).toBeVisible();
    const box = await form.boundingBox();
    const viewport = page.viewportSize();
    expect(box).not.toBeNull();
    expect(viewport).not.toBeNull();
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport!.width + 1);
  });
}
