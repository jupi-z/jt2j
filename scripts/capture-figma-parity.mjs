#!/usr/bin/env node
/**
 * Capture the 38 localized JT2J routes at the two approved Figma widths.
 * Prerequisite: run the Next.js app locally and supply JT2J_QA_ORIGIN.
 * Generates evidence, NOT an automatic claim of pixel-perfect parity.
 */
import { chromium } from '@playwright/test';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const mapping = JSON.parse(await readFile(resolve(root, 'docs/figma/JT2J_Figma_NextJS_Mapping.json'), 'utf8'));
const origin = process.env.JT2J_QA_ORIGIN ?? 'http://127.0.0.1:3000';
const url = new URL(origin);
if (!['http:', 'https:'].includes(url.protocol)) throw Error('JT2J_QA_ORIGIN must be an HTTP(S) origin');
if (url.pathname !== '/' || url.search || url.hash) throw Error('JT2J_QA_ORIGIN must be a clean site origin');
const outputDir = resolve(root, 'test-results/figma-v2');
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const records = [];
try {
  for (const route of mapping.route_matrix) {
    for (const locale of ['fr', 'en']) {
      for (const [viewport, width] of [['mobile', 390], ['desktop', 1440]]) {
        const page = await browser.newPage({
          viewport: { width, height: 900 },
          deviceScaleFactor: 1,
          colorScheme: 'light',
          reducedMotion: 'reduce',
        });
        const errors = [];
        page.on('pageerror', (error) => errors.push(error.message));
        const target = new URL(route[locale].url, url);
        const filename = `${route.identity}-${locale}-${viewport}.png`;
        const record = {
          route: target.pathname,
          identity: route.identity,
          locale,
          width,
          figmaNodeId: route[locale][viewport],
          capture: filename,
          httpStatus: null,
          overflowPx: null,
          unpublishedPlaceholder: false,
          pageErrors: errors,
        };
        try {
          const response = await page.goto(target.href, { waitUntil: 'networkidle', timeout: 30_000 });
          await page.evaluate(() => document.fonts.ready);
          record.httpStatus = response?.status() ?? null;
          const measurements = await page.evaluate(() => ({
            width: window.innerWidth,
            documentWidth: Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth ?? 0),
            text: document.querySelector('main')?.textContent?.slice(0, 8000) ?? '',
          }));
          record.overflowPx = Math.max(0, measurements.documentWidth - measurements.width);
          record.unpublishedPlaceholder = /Publication à venir|Publication coming soon/i.test(measurements.text);
          await page.screenshot({ path: resolve(outputDir, filename), fullPage: true, animations: 'disabled' });
        } catch (error) {
          errors.push(error instanceof Error ? error.message : String(error));
        } finally {
          records.push(record);
          await page.close();
        }
      }
    }
  }
} finally {
  await browser.close();
}
const failed = records.filter((record) => record.pageErrors.length || record.httpStatus !== 200 || (record.overflowPx ?? 0) > 1 || record.unpublishedPlaceholder);
const report = {
  source: 'JT2J Figma V2 mapping',
  origin: url.origin,
  capturedAt: new Date().toISOString(),
  referenceWidths: [390, 1440],
  expected: 76,
  captured: records.length,
  blockedOrFailed: failed.length,
  records,
};
await writeFile(resolve(outputDir, 'report.json'), JSON.stringify(report, null, 2) + '\n');
console.log(`JT2J Figma V2: ${records.length}/76 route-width attempts; ${failed.length} blocked/failed. Output: test-results/figma-v2/`);
if (records.length !== 76 || failed.length > 0) process.exitCode = 1;
