import { expect, test } from '@playwright/test';
import { JSDOM } from 'jsdom';
import { paths, siteOrigin } from './fixtures';

test('canonical URLs ignore tracking queries and forwarded hosts', async ({
  request,
}) => {
  const response = await request.get('/en/services/cleaning?utm_source=test', {
    headers: {
      'x-forwarded-host': 'untrusted.invalid',
      host: 'untrusted.invalid',
    },
  });
  expect(response.status()).toBe(200);
  const document = new JSDOM(await response.text()).window.document;
  expect(
    document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
  ).toBe(`${siteOrigin}/en/services/cleaning`);
  expect(
    document.querySelector('meta[property="og:url"]')?.getAttribute('content'),
  ).toBe(`${siteOrigin}/en/services/cleaning`);
});

for (const locale of ['fr', 'en']) {
  test(`${locale} routes have unique metadata, canonical, hreflang and social tags in HTML`, async ({
    request,
  }) => {
    const titles = new Set<string>();
    for (const path of paths) {
      const response = await request.get(`/${locale}${path}`);
      expect(response.status()).toBe(200);
      const document = new JSDOM(await response.text()).window.document;
      const canonical = `${siteOrigin}/${locale}${path}`;
      const meta = (selector: string) =>
        document.querySelector(selector)?.getAttribute('content');
      expect(document.title).toContain('JT2J');
      expect(titles.has(document.title)).toBe(false);
      titles.add(document.title);
      expect(meta('meta[name="description"]')?.length).toBeGreaterThan(20);
      expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(
        1,
      );
      expect(
        document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
      ).toBe(canonical);
      for (const lang of ['fr', 'en', 'x-default']) {
        expect(
          document
            .querySelector(`link[rel="alternate"][hreflang="${lang}"]`)
            ?.getAttribute('href'),
        ).toBe(`${siteOrigin}/${lang === 'x-default' ? 'fr' : lang}${path}`);
      }
      expect(meta('meta[property="og:url"]')).toBe(canonical);
      expect(meta('meta[property="og:locale"]')).toBe(
        locale === 'fr' ? 'fr_CD' : 'en_GB',
      );
      expect(meta('meta[property="og:image"]')).toMatch(/\/opengraph-image/);
      expect(meta('meta[name="twitter:card"]')).toBe('summary_large_image');
      // Architecture placeholders must not be indexed before approved content exists.
      expect(meta('meta[name="robots"]')).toContain('noindex');
    }
  });
}

test('sitemap contains exactly the bilingual route inventory and reciprocal alternates', async ({
  request,
}) => {
  const response = await request.get('/sitemap.xml');
  expect(response.status()).toBe(200);
  const document = new JSDOM(await response.text(), { contentType: 'text/xml' })
    .window.document;
  const urls = [...document.querySelectorAll('url')];
  expect(urls).toHaveLength(38);
  expect(
    new Set(urls.map((url) => url.querySelector('loc')?.textContent)).size,
  ).toBe(38);
  for (const locale of ['fr', 'en']) {
    for (const path of paths) {
      const url = urls.find(
        (url) =>
          url.querySelector('loc')?.textContent ===
          `${siteOrigin}/${locale}${path}`,
      );
      expect(url).toBeDefined();
      for (const lang of ['fr', 'en', 'x-default']) {
        expect(
          [
            ...url!.getElementsByTagNameNS(
              'http://www.w3.org/1999/xhtml',
              'link',
            ),
          ]
            .find((link) => link.getAttribute('hreflang') === lang)
            ?.getAttribute('href'),
        ).toBe(`${siteOrigin}/${lang === 'x-default' ? 'fr' : lang}${path}`);
      }
    }
  }
  expect(await response.text()).not.toMatch(
    /\/admin|\/api|\/legal|\/privacy|\/cookies/,
  );
});

test('robots excludes private endpoints and OG image returns a real 1200x630 PNG', async ({
  request,
}) => {
  const response = await request.get('/robots.txt');
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toContain('Disallow: /admin');
  expect(body).toContain('Disallow: /api');
  expect(body).toContain(`Sitemap: ${siteOrigin}/sitemap.xml`);
  const html = new JSDOM(await (await request.get('/en')).text()).window
    .document;
  const imageUrl = new URL(
    html.querySelector('meta[property="og:image"]')!.getAttribute('content')!,
  );
  const image = await request.get(imageUrl.pathname + imageUrl.search);
  expect(image.status()).toBe(200);
  expect(image.headers()['content-type']).toContain('image/png');
  const png = await image.body();
  expect(png.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
  expect(png.readUInt32BE(16)).toBe(1200);
  expect(png.readUInt32BE(20)).toBe(630);
});
