import { expect, test } from '@playwright/test';

test('root route renders a document title', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/JT2J/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('health endpoint returns HTTP 200', async ({ request }) => {
  const response = await request.get('/api/health');
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ status: 'ok' });
});
