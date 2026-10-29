import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/public',
  testMatch: 'browser.spec.ts',
  workers: 2,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:3100', trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm exec tsx tests/public/server.ts',
    url: 'http://127.0.0.1:3100',
    reuseExistingServer: false,
    timeout: 120000,
  },
});
