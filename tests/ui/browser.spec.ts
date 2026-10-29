import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('desktop visual foundations, visible keyboard focus and skip target', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Aller au contenu' });
  await expect(skip).toBeFocused();
  expect(await skip.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe(
    'solid',
  );
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  const action = page.locator('main .btn').first();
  await action.focus();
  expect(await action.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe(
    'solid',
  );
  const footerLink = page.locator('footer a').first();
  await footerLink.focus();
  expect(
    await footerLink.evaluate((el) => getComputedStyle(el).outlineColor),
  ).toBe('rgb(204, 173, 114)');
  expect(
    await page
      .locator('body')
      .evaluate((el) => getComputedStyle(el).backgroundColor),
  ).toBe('rgb(245, 243, 236)');
  await expect(page.locator('.main-nav')).toBeVisible();
  await expect(page.locator('.menu-button')).toBeHidden();
  await expect(page.locator('.abstract-artwork image')).toHaveAttribute(
    'href',
    '/assets/abstract-home.svg',
  );
  expect(
    await page.locator('body').evaluate((el) => el.scrollWidth <= innerWidth),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath('desktop.png'),
    fullPage: true,
  });
});

test('mega navigation supports keyboard, outside pointer, and viewport changes', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const trigger = page.getByRole('button', { name: 'Pôles', exact: true });
  await trigger.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await expect(page.locator('.mega a').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await trigger.click();
  await page.locator('h1').click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await trigger.click();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.mega-toggle')).toHaveAttribute(
    'aria-expanded',
    'false',
  );
});

test('mobile dialog traps focus, closes with Escape, restores focus and unlocks scrolling', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const trigger = page.getByRole('button', { name: 'Ouvrir le menu' });
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Fermer le menu' }),
  ).toBeFocused();
  expect(
    await page.locator('html').evaluate((el) => getComputedStyle(el).overflowY),
  ).toBe('hidden');
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('Tab');
    expect(
      await dialog.evaluate((el) => el.contains(document.activeElement)),
    ).toBe(true);
  }
  await page.keyboard.press('Shift+Tab');
  expect(
    await dialog.evaluate((el) => el.contains(document.activeElement)),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath('mobile-menu.png'),
    fullPage: true,
  });
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(
    await page.locator('html').evaluate((el) => getComputedStyle(el).overflowY),
  ).not.toBe('hidden');
  expect(
    await page.locator('body').evaluate((el) => el.scrollWidth <= innerWidth),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath('mobile.png'),
    fullPage: true,
  });
});

test('mobile closes after navigation, close button, and desktop resize', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const trigger = page.getByRole('button', { name: 'Ouvrir le menu' });
  await trigger.click();
  await page
    .getByRole('dialog')
    .getByRole('link', { name: 'Entreprise', exact: true })
    .click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await trigger.click();
  await page.getByRole('button', { name: 'Fermer le menu' }).click();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.getByRole('dialog')).not.toBeVisible();
  expect(
    await page.locator('html').evaluate((el) => getComputedStyle(el).overflowY),
  ).not.toBe('hidden');
});

test('reduced motion removes transitions and smooth scrolling in computed styles', async ({
  page,
}) => {
  const icon = page.locator('.line-link .icon');
  expect(
    await icon.evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe('0.25s');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(
    await icon.evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe('0s');
  expect(await icon.evaluate((el) => getComputedStyle(el).animationName)).toBe(
    'none',
  );
  expect(
    await page
      .locator('html')
      .evaluate((el) => getComputedStyle(el).scrollBehavior),
  ).toBe('auto');
});

test('small mobile remains within viewport and all supplied footer links remain visible', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  expect(
    await page.locator('body').evaluate((el) => el.scrollWidth <= innerWidth),
  ).toBe(true);
  await expect(
    page
      .locator('footer')
      .getByRole('navigation', { name: 'Navigation', exact: true }),
  ).toBeVisible();
  await expect(
    page.locator('footer').getByRole('link', { name: 'English' }),
  ).toHaveAttribute('hreflang', 'en');
});

test('every original artwork variant is available in both palettes', async ({
  request,
}) => {
  for (const variant of [
    'home',
    'hygiene',
    'security',
    'logistics',
    'business',
    'travel',
    'commitment',
  ]) {
    for (const suffix of ['', '-light']) {
      const response = await request.get(
        `/assets/abstract-${variant}${suffix}.svg`,
      );
      expect(response.ok()).toBe(true);
      expect(await response.text()).toContain('viewBox="0 0 650 660"');
    }
  }
});
