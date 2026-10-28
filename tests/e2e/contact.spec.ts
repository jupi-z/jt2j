import { expect, test } from '@playwright/test';

test('contact form exposes approved fields and a safe confirmation flow', async ({ page }) => {
  await page.goto('/fr/contact');

  await expect(page.getByRole('heading', { name: /contact/i }).first()).toBeVisible();
  await expect(page.getByLabel(/nom/i)).toBeVisible();
  await expect(page.getByLabel(/e-mail/i)).toBeVisible();
  await expect(page.getByLabel(/message/i)).toBeVisible();
  await expect(page.getByLabel(/consent/i)).toBeVisible();
  await expect(page.locator('input[name="website"]')).toHaveAttribute('aria-hidden', 'true');

  const html = await page.locator('body').innerHTML();
  expect(html).not.toMatch(/(?:resend|smtp|api[_-]?key|secret|password)/i);
});

test('contact form shows a visible error and re-enables submit after a network failure', async ({ page }) => {
  await page.route('**/api/leads', (route) => route.abort('failed'));
  await page.goto('/fr/contact');
  await page.getByLabel(/nom/i).fill('Aline Kabeya');
  await page.getByLabel(/e-mail/i).fill('aline@example.test');
  await page.getByLabel(/message/i).fill('Nous souhaitons échanger sur vos services.');
  await page.getByLabel(/consent/i).check();

  const submit = page.getByRole('button', { name: /envoyer/i });
  await submit.click();

  await expect(page.locator('p[role="alert"]')).toBeVisible();
  await expect(submit).toBeEnabled();
});
