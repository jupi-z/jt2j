import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: {
    globalSetup: ['./tests/payload/setup.ts'],
    testTimeout: 30000,
    include: [
      'tests/unit/**/*.test.ts',
      'tests/content/**/*.test.ts',
      'tests/ui/**/*.spec.tsx',
      'tests/public/**/*.spec.tsx',
      'tests/payload/**/*.test.ts',
      'tests/leads/**/*.test.ts',
      'tests/admin/**/*.spec.ts',
      'tests/security/**/*.test.ts',
      'src/seed/**/*.test.ts',
    ],
    environment: 'node',
  },
});
