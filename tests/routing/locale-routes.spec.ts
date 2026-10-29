import { expect, test } from '@playwright/test';
import { JSDOM } from 'jsdom';
import { paths } from './fixtures';

for (const locale of ['fr', 'en']) {
  for (const path of paths) {
    test(`${locale}${path || '/'} serves a localized server-rendered skeleton`, async ({
      request,
    }) => {
      const response = await request.get(`/${locale}${path}`);
      expect(response.status()).toBe(200);
      const document = new JSDOM(await response.text()).window.document;
      expect(document.documentElement.lang).toBe(locale);
      expect(document.querySelectorAll('main#main h1')).toHaveLength(1);
      expect(document.querySelector('header')).not.toBeNull();
      expect(document.querySelector('footer')).not.toBeNull();
      const form = document.querySelector('form');
      if (path === '/contact') expect(form).not.toBeNull();
      else expect(form).toBeNull();
      for (const link of document.querySelectorAll(
        'header a[href], footer a[href]',
      )) {
        const href = link.getAttribute('href')!;
        expect(href === '#main' || /^\/(fr|en)(\/|$)/.test(href)).toBe(true);
        expect(href).not.toMatch(/admin|legal|privacy|cookies/);
      }
    });
  }

  test(`${locale} language switch preserves detail path and current navigation`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/services/cleaning`);
    const other = locale === 'fr' ? 'en' : 'fr';
    const switcher = page.locator(
      `header .header-locale a[hreflang="${other}"]`,
    );
    await expect(switcher).toHaveAttribute(
      'href',
      `/${other}/services/cleaning`,
    );
    await switcher.click();
    await expect(page).toHaveURL(new RegExp(`/${other}/services/cleaning$`));
    await expect(page.locator('html')).toHaveAttribute('lang', other);
    await expect(
      page.locator('header .main-nav a[aria-current="page"]'),
    ).toHaveAttribute('href', `/${other}/services`);
    await page.locator('.skip-link').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('main#main')).toBeFocused();
  });

  for (const path of ['/absent', '/poles/absent', '/services/absent']) {
    test(`${locale}${path} returns a localized noindex 404`, async ({
      request,
    }) => {
      const response = await request.get(`/${locale}${path}`);
      expect(response.status()).toBe(404);
      const document = new JSDOM(await response.text()).window.document;
      expect(document.documentElement.lang).toBe(locale);
      expect(document.querySelector('h1')?.textContent).toMatch(
        locale === 'fr' ? /introuvable/i : /not found/i,
      );
      expect(
        document.querySelector('meta[name="robots"]')?.getAttribute('content'),
      ).toContain('noindex');
      expect(document.querySelector('link[rel="canonical"]')).toBeNull();
    });
  }
}

test('French is the deterministic default and private/asset paths bypass locale routing', async ({
  request,
}) => {
  const response = await request.get('/', {
    maxRedirects: 0,
    headers: { 'accept-language': 'en' },
  });
  expect([307, 308]).toContain(response.status());
  expect(
    new URL(response.headers().location, 'http://127.0.0.1:3100').pathname,
  ).toBe('/fr');
  expect((await request.get('/api/health')).status()).toBe(200);
  for (const path of ['/de', '/de/contact', '/admin', '/unknown.txt']) {
    expect((await request.get(path, { maxRedirects: 0 })).status()).toBe(404);
  }
});
