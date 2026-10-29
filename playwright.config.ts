import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: ['e2e/**/*.spec.ts', 'routing/**/*.spec.ts'],
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  // The fixture server runs Next in development mode. Serializing projects
  // prevents concurrent on-demand route compilation from starving request
  // contexts during the SEO HTTP checks.
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:3100',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 5'] } },
    {
      name: 'reduced-motion',
      use: { ...devices['Desktop Chrome'], reducedMotion: 'reduce' },
      testMatch: /e2e\/(accessibility|locales)\.spec\.ts/,
    },
  ],
  webServer: {
    command:
      process.env.PLAYWRIGHT_PRODUCTION === '1'
        ? 'pnpm start --hostname 127.0.0.1 --port 3100'
        : 'node scripts/e2e-server.mjs',
    url: 'http://127.0.0.1:3100',
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
