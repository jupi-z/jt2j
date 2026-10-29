import { locales, test, expect, expectPublicShell } from './fixtures';

test.describe('locale and accessibility contract', () => {
  for (const locale of locales) {
    test(`${locale} exposes landmarks, headings, labels, and keyboard focus`, async ({ page, openPublic }) => {
      await openPublic(locale, '/contact');
      await expectPublicShell(page, locale);
      expect(await page.getByRole('navigation').count()).toBeGreaterThan(0);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(page.getByLabel(/nom|name/i)).toBeVisible();
      await expect(page.getByLabel(/message/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /envoyer|send/i })).toBeVisible();
      await page.keyboard.press('Tab');
      await expect(page.locator(':focus')).toBeVisible();
    });
  }

  test('reduced motion disables site motion tokens', async ({ page, openPublic }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openPublic('fr');
    await expect.poll(() =>
      page.locator('body').evaluate((body) => ({
        media: matchMedia('(prefers-reduced-motion: reduce)').matches,
        transitions: [...body.querySelectorAll<HTMLElement>('*')].map(
          (element) => getComputedStyle(element).transitionDuration,
        ),
      })),
    ).toEqual(expect.objectContaining({ media: true }));
    const transitionDurations = await page.locator('body').evaluate((body) =>
      [...body.querySelectorAll<HTMLElement>('*')].map(
        (element) => getComputedStyle(element).transitionDuration,
      ),
    );
    expect(transitionDurations.every((duration) => duration === '0s')).toBe(true);
  });
});
