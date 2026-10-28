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
