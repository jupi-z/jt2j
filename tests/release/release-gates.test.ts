import { describe, expect, it } from 'vitest';
import {
  buildSmokeChecks,
  parseSmokeConfig,
} from '../../scripts/smoke-public';
import {
  parseBackupManifest,
  verifyBackupManifest,
} from '../../scripts/backup-check';
import {
  parseRollbackPlan,
  verifyRollbackPlan,
} from '../../scripts/rollback-check';

describe('release gate scripts', () => {
  it('requires an explicit base URL and covers every public locale route', () => {
    const config = parseSmokeConfig({
      SMOKE_BASE_URL: 'https://staging.example.test/',
      SMOKE_CONTACT_TOKEN: 'staging-token',
    });
    const checks = buildSmokeChecks(config);

    expect(checks.some((check) => check.path === '/api/health')).toBe(true);
    expect(checks.some((check) => check.path === '/fr')).toBe(true);
    expect(checks.some((check) => check.path === '/en')).toBe(true);
    expect(checks.some((check) => check.path === '/fr/contact')).toBe(true);
    expect(checks.some((check) => check.path === '/en/contact')).toBe(true);
    expect(checks.some((check) => check.path === '/robots.txt')).toBe(true);
    expect(checks.some((check) => check.path === '/sitemap.xml')).toBe(true);
  });

  it('accepts only verified backup manifests and never performs a backup', () => {
    const manifest = parseBackupManifest(JSON.stringify({
      release: 'abc1234',
      createdAt: '2026-10-29T12:00:00.000Z',
      database: { object: 'db-1', checksum: 'sha256:db' },
      media: { object: 'media-1', checksum: 'sha256:media' },
      verified: true,
    }));

    expect(verifyBackupManifest(manifest)).toEqual({ ok: true, dryRun: true });
  });

  it('accepts a rollback plan only as a dry-run verification', () => {
    const plan = parseRollbackPlan(JSON.stringify({
      previousRelease: 'release-41',
      targetRelease: 'release-42',
      healthPath: '/api/health',
      smokeCommand: 'pnpm smoke:public',
      migrationPolicy: 'forward-only-unless-approved',
    }));

    expect(verifyRollbackPlan(plan)).toEqual({ ok: true, dryRun: true });
  });
});
