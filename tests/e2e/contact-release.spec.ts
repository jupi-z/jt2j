import { test, expect } from './fixtures';

for (const locale of ['fr', 'en'] as const) {
test(`${locale} contact form shows a confirmation after an accepted request`, async ({ page, openPublic }) => {
  await page.route('**/api/csrf', async (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ token: 'test-token' }) }),
  );
  await page.route('**/api/leads', async (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ confirmationId: 'JT2J-TEST-001' }) }),
  );
  await openPublic(locale, '/contact');
  await page.getByLabel(/nom|name/i).fill('Aline Kabeya');
  await page.getByLabel(/e-mail/i).fill('aline@example.test');
  await page.getByLabel(/message/i).fill('Nous souhaitons échanger sur vos services.');
  await page.getByLabel(/consent/i).check();
  await page.getByRole('button', { name: /envoyer|send/i }).click();
  await expect(page.getByRole('heading', { name: /demande reçue|request received/i })).toBeVisible();
  await expect(page.getByText('JT2J-TEST-001')).toBeVisible();
});
}
