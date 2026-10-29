import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';

const DEFAULT_MAX_AGE_MS = 24 * 60 * 60 * 1000;
type Artifact = {
  path: string;
  checksum: string;
  release: string;
  revision: string;
};
export type BackupManifest = {
  release: string;
  revision: string;
  createdAt: string;
  database: Artifact;
  media: Artifact;
};

function isSha256(value: string) {
  return /^sha256:[a-f0-9]{64}$/i.test(value);
}

function parseArtifact(value: unknown) {
  const artifact = value as Partial<Artifact> | undefined;
  if (
    !artifact ||
    typeof artifact.path !== 'string' ||
    !artifact.path ||
    typeof artifact.checksum !== 'string' ||
    !isSha256(artifact.checksum) ||
    typeof artifact.release !== 'string' ||
    !artifact.release ||
    typeof artifact.revision !== 'string' ||
    !artifact.revision
  )
    throw new Error(
      'Backup manifest must identify each artifact path, sha256 checksum, release and revision',
    );
  return artifact as Artifact;
}

export function parseBackupManifest(raw: string): BackupManifest {
  const value = JSON.parse(raw) as Partial<BackupManifest>;
  if (
    typeof value.release !== 'string' ||
    !value.release ||
    typeof value.revision !== 'string' ||
    !value.revision ||
    typeof value.createdAt !== 'string' ||
    Number.isNaN(Date.parse(value.createdAt))
  )
    throw new Error(
      'Backup manifest must identify a release, revision and valid createdAt',
    );
  const database = parseArtifact(value.database);
  const media = parseArtifact(value.media);
  for (const artifact of [database, media])
    if (
      artifact.release !== value.release ||
      artifact.revision !== value.revision
    )
      throw new Error(
        'Backup artifact release/revision does not match the manifest',
      );
  return {
    release: value.release,
    revision: value.revision,
    createdAt: value.createdAt,
    database,
    media,
  };
}

async function verifyArtifact(artifact: Artifact) {
  const info = await stat(artifact.path).catch(() => undefined);
  if (!info?.isFile() || info.size === 0)
    throw new Error(`Backup artifact is missing or empty: ${artifact.path}`);
  const digest = createHash('sha256')
    .update(await readFile(artifact.path))
    .digest('hex');
  if (
    digest.toLowerCase() !==
    artifact.checksum.slice('sha256:'.length).toLowerCase()
  )
    throw new Error(`Backup artifact checksum mismatch: ${artifact.path}`);
}

export async function verifyBackupManifest(
  manifest: BackupManifest,
  options: {
    now?: Date;
    maxAgeMs?: number;
    expectedRelease?: string;
    expectedRevision?: string;
  } = {},
) {
  const age =
    (options.now ?? new Date()).getTime() - Date.parse(manifest.createdAt);
  if (age < 0 || age > (options.maxAgeMs ?? DEFAULT_MAX_AGE_MS))
    throw new Error('Backup evidence is absent, future-dated or stale');
  if (options.expectedRelease && manifest.release !== options.expectedRelease)
    throw new Error('Backup release does not match the expected release');
  if (
    options.expectedRevision &&
    manifest.revision !== options.expectedRevision
  )
    throw new Error('Backup revision does not match the expected revision');
  await Promise.all([
    verifyArtifact(manifest.database),
    verifyArtifact(manifest.media),
  ]);
  return { ok: true, dryRun: true } as const;
}

async function run() {
  const path = process.env.BACKUP_MANIFEST;
  const expectedRevision = process.env.BACKUP_EXPECTED_REVISION;
  if (!path || !expectedRevision)
    throw new Error(
      'BACKUP_MANIFEST and BACKUP_EXPECTED_REVISION are required',
    );
  const manifest = parseBackupManifest(await readFile(path, 'utf8'));
  await verifyBackupManifest(manifest, { expectedRevision });
  console.log(
    `BACKUP_CHECK_OK dryRun=true release=${manifest.release} revision=${manifest.revision}`,
  );
}

if (process.argv[1] && /backup-check\.(ts|js)$/.test(process.argv[1]))
  await run();
