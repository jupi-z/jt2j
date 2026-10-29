import { readFile } from 'node:fs/promises';

export type BackupManifest = { release: string; createdAt: string; database: { object: string; checksum: string }; media: { object: string; checksum: string }; verified: boolean };

export function parseBackupManifest(raw: string): BackupManifest {
  const value = JSON.parse(raw) as Partial<BackupManifest>;
  if (typeof value.release !== 'string' || typeof value.createdAt !== 'string' || !value.database?.object || !value.database.checksum || !value.media?.object || !value.media.checksum || value.verified !== true) throw new Error('Backup manifest must identify verified database and media objects');
  if (Number.isNaN(Date.parse(value.createdAt))) throw new Error('Backup createdAt is invalid');
  return value as BackupManifest;
}

export function verifyBackupManifest(manifest: BackupManifest) { return { ok: manifest.verified, dryRun: true } as const; }

async function run() {
  const path = process.env.BACKUP_MANIFEST;
  if (!path) throw new Error('BACKUP_MANIFEST is required');
  const manifest = parseBackupManifest(await readFile(path, 'utf8'));
  console.log(`BACKUP_CHECK_OK dryRun=true release=${manifest.release} database=${manifest.database.object} media=${manifest.media.object}`);
}

if (process.argv[1] && /backup-check\.(ts|js)$/.test(process.argv[1])) await run();
