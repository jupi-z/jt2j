import { createHash } from 'node:crypto';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { buildSmokeChecks, parseSmokeConfig } from '../../scripts/smoke-public';
import {
  parseBackupManifest,
  verifyBackupManifest,
} from '../../scripts/backup-check';
import {
  parseRollbackPlan,
  verifyRollbackPlan,
} from '../../scripts/rollback-check';
import { verifyContactSmokeResponse } from '../../scripts/smoke-public';

describe('release gate scripts', () => {
  it('materializes revision-bound production artifacts before local checks', async () => {
    const workflow = await readFile(
      join(
        dirname(fileURLToPath(import.meta.url)),
        '../../.github/workflows/deploy-production.yml',
      ),
      'utf8',
    );

    expect(workflow).toContain('actions: read');
    expect(workflow).toContain('PRODUCTION_ARTIFACT_RUN_ID');
    expect(workflow).toContain('gh run download "$ARTIFACT_RUN_ID"');
    expect(workflow).toContain('jt2j-production-backup-database-${REVISION}');
    expect(workflow).toContain('jt2j-production-backup-media-${REVISION}');
    expect(workflow).toContain('jt2j-production-rollback-${REVISION}');
    expect(workflow).toContain('.database.path=$database_path');
    expect(workflow).toContain('.media.path=$media_path');
    expect(workflow).toContain('.artifact.path=$rollback_path');
    expect(workflow).toContain('BACKUP_EXPECTED_REVISION="$REVISION"');
    expect(workflow).toContain('ROLLBACK_EXPECTED_TARGET_REVISION="$REVISION"');
  });

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

  it('verifies backup artifacts instead of trusting a verified flag', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'jt2j-backup-'));
    const databasePath = join(directory, 'database.dump');
    const mediaPath = join(directory, 'media.tar');
    await writeFile(databasePath, 'database artifact');
    await writeFile(mediaPath, 'media artifact');
    const checksum = (value: string) =>
      `sha256:${createHash('sha256').update(value).digest('hex')}`;
    const manifest = parseBackupManifest(
      JSON.stringify({
        release: 'release-42',
        revision: 'abc1234',
        createdAt: '2026-10-29T12:00:00.000Z',
        database: {
          path: databasePath,
          checksum: checksum('database artifact'),
          release: 'release-42',
          revision: 'abc1234',
        },
        media: {
          path: mediaPath,
          checksum: checksum('media artifact'),
          release: 'release-42',
          revision: 'abc1234',
        },
      }),
    );

    await expect(
      verifyBackupManifest(manifest, {
        now: new Date('2026-10-29T12:05:00.000Z'),
        expectedRevision: 'abc1234',
      }),
    ).resolves.toEqual({ ok: true, dryRun: true });
  });

  it('verifies the rollback artifact and revision binding as a dry-run', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'jt2j-rollback-'));
    const artifactPath = join(directory, 'previous-release.tar');
    await writeFile(artifactPath, 'previous release artifact');
    const checksum = `sha256:${createHash('sha256').update('previous release artifact').digest('hex')}`;
    const plan = parseRollbackPlan(
      JSON.stringify({
        previousRelease: 'release-41',
        targetRelease: 'release-42',
        previousRevision: 'def5678',
        targetRevision: 'abc1234',
        artifact: {
          path: artifactPath,
          checksum,
          createdAt: '2026-10-29T12:00:00.000Z',
          release: 'release-41',
          revision: 'def5678',
        },
        healthPath: '/api/health',
        smokeCommand: 'pnpm smoke:public',
        migrationPolicy: 'forward-only-unless-approved',
      }),
    );

    await expect(
      verifyRollbackPlan(plan, {
        now: new Date('2026-10-29T12:05:00.000Z'),
        expectedTargetRevision: 'abc1234',
      }),
    ).resolves.toEqual({ ok: true, dryRun: true });
  });

  it('requires the exact contact smoke response contract', () => {
    expect(
      verifyContactSmokeResponse(202, { accepted: true, testMode: true }),
    ).toBe(true);
    expect(
      verifyContactSmokeResponse(200, { accepted: true, testMode: true }),
    ).toBe(false);
    expect(
      verifyContactSmokeResponse(202, { accepted: true, testMode: false }),
    ).toBe(false);
  });
});
