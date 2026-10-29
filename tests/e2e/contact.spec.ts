import { expect, test } from '@playwright/test';

test('contact form exposes approved fields and a safe confirmation flow', async ({ page }) => {
  await page.goto('/fr/contact');

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByLabel(/nom/i)).toBeVisible();
  await expect(page.getByLabel(/e-mail/i)).toBeVisible();
  await expect(page.getByLabel(/message/i)).toBeVisible();
  await expect(page.getByLabel(/consent/i)).toBeVisible();
  await expect(page.locator('input[name="website"]')).toHaveAttribute('aria-hidden', 'true');

  const html = await page.locator('body').innerHTML();
  expect(html).not.toMatch(/(?:resend|smtp|api[_-]?key|secret|password)/i);
});

for (const locale of ['fr', 'en'] as const) {
test(`${locale} contact form shows localized error and re-enables submit after a server failure`, async ({ page }) => {
  await page.route('**/api/leads', (route) => route.fulfill({
    status: 503,
    contentType: 'application/json',
    body: JSON.stringify({ error: { code: 'PERSISTENCE_UNAVAILABLE' } }),
  }));
  await page.goto(`/${locale}/contact`);
  await page.getByLabel(/nom|name/i).fill('Aline Kabeya');
  await page.getByLabel(/e-mail/i).fill('aline@example.test');
  await page.getByLabel(/message/i).fill('Nous souhaitons échanger sur vos services.');
  await page.getByLabel(/consent/i).check();

  const submit = page.getByRole('button', { name: /envoyer|send/i });
  await submit.click();

  await expect(page.locator('p[role="alert"]')).toHaveText(
    locale === 'fr'
      ? "Votre demande n'a pas pu être envoyée. Veuillez réessayer plus tard."
      : 'Your request could not be sent. Please try again later.',
  );
  await expect(submit).toBeEnabled();
});
}
