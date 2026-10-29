import { publicPaths, locales, test, expect, expectPublicShell } from './fixtures';

test.describe('public navigation', () => {
  for (const locale of locales) {
    for (const path of publicPaths) {
      test(`${locale}${path || '/'} is a public route`, async ({ page }) => {
        const response = await page.goto(`/${locale}${path}`);
        expect(response?.status(), `${locale}${path} response`).toBe(200);
        await expectPublicShell(page, locale);
      });
    }
  }

  test('switches from French to the equivalent English page', async ({ page, openPublic }) => {
    await openPublic('fr', '/services');
    await page.getByRole('link', { name: /Anglais|English/ }).first().click();
    await expect(page).toHaveURL(/\/en\/services$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('desktop navigation reaches the services page', async ({ page, openPublic }) => {
    await openPublic('fr');
    await page.getByRole('navigation', { name: /navigation/i }).first().getByRole('link', { name: /services/i }).click();
    await expect(page).toHaveURL(/\/fr\/services$/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('mobile navigation opens, traps focus, and closes with Escape', async ({ page, openPublic }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openPublic('fr');
    const menu = page.getByRole('button', { name: /ouvrir le menu|open menu/i });
    await menu.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('button', { name: /fermer|close/i })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(menu).toBeFocused();
  });

  for (const locale of locales) {
    test(`${locale} service search and division filter update the result status`, async ({ page, openPublic }) => {
      await openPublic(locale, '/services');
      const search = page.getByRole('searchbox', {
        name: locale === 'fr' ? 'Rechercher un service' : 'Search services',
      });
      const serviceTerm = locale === 'fr' ? 'nettoyage' : 'cleaning';
      const serviceLink = locale === 'fr' ? /nettoyage/i : /cleaning/i;
      const travelLink = locale === 'fr' ? /voyage/i : /travel/i;
      const foundStatus = locale === 'fr' ? /1 services trouvés/i : /1 services found/i;
      const emptyStatus = locale === 'fr' ? /aucun service trouvé/i : /no service found/i;

      await search.fill(serviceTerm);
      await expect(page.getByRole('status')).toHaveText(foundStatus);
      await expect(page.getByRole('link', { name: serviceLink }).first()).toBeVisible();

      await search.fill('');
      await expect(page.getByRole('status')).toHaveText(
        locale === 'fr' ? /7 services trouvés/i : /7 services found/i,
      );
      const division = page.getByRole('search').getByRole('combobox');
      await division.selectOption('travel-escapes');
      await expect(page.getByRole('status')).toHaveText(foundStatus);
      await expect(page.getByRole('link', { name: travelLink }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: serviceLink })).toHaveCount(0);

      await search.fill(locale === 'fr' ? 'terme inexistant' : 'no such service');
      await expect(page.getByRole('status')).toHaveText(emptyStatus);
      await expect(page.locator('[data-service-card]')).toHaveCount(0);
    });
  }

  for (const locale of locales) {
  test(`${locale} FAQ disclosure opens and exposes its answer`, async ({ page, openPublic }) => {
    await openPublic(locale, '/faq');
    const item = page.locator('details').first();
    await expect(item).not.toHaveAttribute('open');
    await item.locator('summary').click();
    await expect(item).toHaveAttribute('open', '');
    await expect(item.locator('p')).toBeVisible();
  });
  }

  test('unknown locale route returns the localized 404 page', async ({ page }) => {
    const response = await page.goto('/fr/route-inconnue');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: /accueil|home/i })).toBeVisible();
  });

  test('admin is not accessible to an anonymous visitor', async ({ page }) => {
    const response = await page.goto('/admin');
    expect(response?.status()).not.toBe(200);
    await expect(page.locator('body')).not.toContainText(/dashboard|collections|leads/i);
  });
});
