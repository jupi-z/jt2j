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
  it('uses a disposable password for the CI PostgreSQL service', async () => {
    const workflow = await readFile(
      join(
        dirname(fileURLToPath(import.meta.url)),
        '../../.github/workflows/ci.yml',
      ),
      'utf8',
    );

    expect(workflow).toContain(
      'POSTGRES_PASSWORD: jt2j-ci-disposable-password',
    );
    expect(workflow).toContain(
      'DATABASE_URL: postgresql://postgres:jt2j-ci-disposable-password@localhost:5432/jt2j_test',
    );
    expect(workflow).not.toContain('secrets.CI_POSTGRES_PASSWORD');
  });

  it('provides distinct disposable CMS secrets directly to the CI job', async () => {
    const workflow = await readFile(
      join(
        dirname(fileURLToPath(import.meta.url)),
        '../../.github/workflows/ci.yml',
      ),
      'utf8',
    );
    const payloadSecret = workflow.match(/PAYLOAD_SECRET:\s*([^\s]+)/)?.[1];
    const csrfSecret = workflow.match(/CSRF_SECRET:\s*([^\s]+)/)?.[1];

    expect(payloadSecret).toBeDefined();
    expect(csrfSecret).toBeDefined();
    expect(payloadSecret!.length).toBeGreaterThanOrEqual(32);
    expect(csrfSecret!.length).toBeGreaterThanOrEqual(32);
    expect(payloadSecret).not.toBe(csrfSecret);
    expect(payloadSecret).not.toContain('${{ secrets.');
    expect(csrfSecret).not.toContain('${{ secrets.');

    expect(
      await readFile(
        join(
          dirname(fileURLToPath(import.meta.url)),
          '../../.github/workflows/deploy-production.yml',
        ),
        'utf8',
      ),
    ).toContain('SMOKE_BASE_URL: ${{ secrets.PRODUCTION_BASE_URL }}');
  });

  it('pins CI to the Node patch required by the resolved test dependencies', async () => {
    const workflow = await readFile(
      join(
        dirname(fileURLToPath(import.meta.url)),
        '../../.github/workflows/ci.yml',
      ),
      'utf8',
    );

    expect(workflow).toContain('node-version: 24.15.0');
    expect(workflow).not.toContain('node-version: 22.13.0');
    expect(workflow).not.toContain('node-version: 22.12.0');
  });

  it('allows only the platform-specific embedded-postgres builds required by CI and local Windows', async () => {
    const workspace = await readFile(
      join(
        dirname(fileURLToPath(import.meta.url)),
        '../../pnpm-workspace.yaml',
      ),
      'utf8',
    );
    const embeddedPostgresBuilds = workspace
      .split('\n')
      .filter((line) => line.includes("'@embedded-postgres/"));

    expect(embeddedPostgresBuilds).toEqual([
      "  '@embedded-postgres/windows-x64': true",
      "  '@embedded-postgres/linux-x64': true",
    ]);
    expect(workspace).toContain("  '@parcel/watcher': false");
    expect(workspace).toContain("  '@swc/core': false");
  });

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

  it('keeps production independent from the deprecated staging environment', async () => {
    const productionWorkflow = await readFile(
      join(
        dirname(fileURLToPath(import.meta.url)),
        '../../.github/workflows/deploy-production.yml',
      ),
      'utf8',
    );
    const stagingWorkflow = await readFile(
      join(
        dirname(fileURLToPath(import.meta.url)),
        '../../.github/workflows/deploy-staging.yml',
      ),
      'utf8',
    );
    const deploymentDocs = await readFile(
      join(
        dirname(fileURLToPath(import.meta.url)),
        '../../docs/operations/deployment.md',
      ),
      'utf8',
    );

    expect(productionWorkflow).toContain('workflow_dispatch:');
    expect(productionWorkflow).toContain('environment: production');
    expect(productionWorkflow).toContain('Verify provider backup manifest');
    expect(productionWorkflow).toContain('Verify rollback plan');
    expect(productionWorkflow).toContain(
      'Forward-only production migration gate',
    );
    expect(productionWorkflow).toContain('Smoke production public surface');
    expect(productionWorkflow).toContain('manual rollback');
    expect(productionWorkflow).not.toContain('PRODUCTION_STAGING_EVIDENCE');
    expect(productionWorkflow).not.toMatch(/staging/i);

    expect(stagingWorkflow).toContain('DEPRECATED');
    expect(deploymentDocs).toContain(
      'No staging environment is part of this delivery model',
    );
    expect(deploymentDocs).toContain('not a supported release path');
    expect(deploymentDocs).not.toContain('requires staging evidence');
  });

  it('requires an explicit base URL and covers every public locale route', () => {
    const config = parseSmokeConfig({
      SMOKE_BASE_URL: 'https://isolated.example.test/',
      SMOKE_CONTACT_TOKEN: 'isolated-token',
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
