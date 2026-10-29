import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';

const DEFAULT_MAX_AGE_MS = 24 * 60 * 60 * 1000;
type RollbackArtifact = {
  path: string;
  checksum: string;
  createdAt: string;
  release: string;
  revision: string;
};
export type RollbackPlan = {
  previousRelease: string;
  targetRelease: string;
  previousRevision: string;
  targetRevision: string;
  artifact: RollbackArtifact;
  healthPath: string;
  smokeCommand: string;
  migrationPolicy: string;
};

function isSha256(value: string) {
  return /^sha256:[a-f0-9]{64}$/i.test(value);
}

export function parseRollbackPlan(raw: string): RollbackPlan {
  const value = JSON.parse(raw) as Partial<RollbackPlan>;
  const fields: Array<keyof RollbackPlan> = [
    'previousRelease',
    'targetRelease',
    'previousRevision',
    'targetRevision',
    'healthPath',
    'smokeCommand',
    'migrationPolicy',
  ];
  if (fields.some((field) => typeof value[field] !== 'string' || !value[field]))
    throw new Error('Rollback plan is incomplete');
  if (!value.healthPath!.startsWith('/'))
    throw new Error('Rollback healthPath must be relative');
  const artifact = value.artifact as Partial<RollbackArtifact> | undefined;
  if (
    !artifact ||
    typeof artifact.path !== 'string' ||
    !artifact.path ||
    typeof artifact.checksum !== 'string' ||
    !isSha256(artifact.checksum) ||
    typeof artifact.createdAt !== 'string' ||
    Number.isNaN(Date.parse(artifact.createdAt)) ||
    typeof artifact.release !== 'string' ||
    typeof artifact.revision !== 'string'
  )
    throw new Error('Rollback plan must identify a valid artifact');
  if (
    artifact.release !== value.previousRelease ||
    artifact.revision !== value.previousRevision
  )
    throw new Error(
      'Rollback artifact release/revision does not match the previous release',
    );
  if (
    value.previousRelease === value.targetRelease ||
    value.previousRevision === value.targetRevision
  )
    throw new Error(
      'Rollback plan must identify distinct previous and target releases',
    );
  return {
    previousRelease: value.previousRelease!,
    targetRelease: value.targetRelease!,
    previousRevision: value.previousRevision!,
    targetRevision: value.targetRevision!,
    artifact: artifact as RollbackArtifact,
    healthPath: value.healthPath!,
    smokeCommand: value.smokeCommand!,
    migrationPolicy: value.migrationPolicy!,
  };
}

export async function verifyRollbackPlan(
  plan: RollbackPlan,
  options: {
    now?: Date;
    maxAgeMs?: number;
    expectedTargetRevision?: string;
  } = {},
) {
  const age =
    (options.now ?? new Date()).getTime() - Date.parse(plan.artifact.createdAt);
  if (age < 0 || age > (options.maxAgeMs ?? DEFAULT_MAX_AGE_MS))
    throw new Error('Rollback evidence is absent, future-dated or stale');
  if (
    options.expectedTargetRevision &&
    plan.targetRevision !== options.expectedTargetRevision
  )
    throw new Error(
      'Rollback target revision does not match the expected revision',
    );
  const info = await stat(plan.artifact.path).catch(() => undefined);
  if (!info?.isFile() || info.size === 0)
    throw new Error(
      `Rollback artifact is missing or empty: ${plan.artifact.path}`,
    );
  const digest = createHash('sha256')
    .update(await readFile(plan.artifact.path))
    .digest('hex');
  if (
    digest.toLowerCase() !==
    plan.artifact.checksum.slice('sha256:'.length).toLowerCase()
  )
    throw new Error('Rollback artifact checksum mismatch');
  return { ok: true, dryRun: true } as const;
}

async function run() {
  const path = process.env.ROLLBACK_PLAN;
  const expectedTargetRevision = process.env.ROLLBACK_EXPECTED_TARGET_REVISION;
  if (!path || !expectedTargetRevision)
    throw new Error(
      'ROLLBACK_PLAN and ROLLBACK_EXPECTED_TARGET_REVISION are required',
    );
  const plan = parseRollbackPlan(await readFile(path, 'utf8'));
  await verifyRollbackPlan(plan, { expectedTargetRevision });
  console.log(
    `ROLLBACK_CHECK_OK dryRun=true previous=${plan.previousRelease} target=${plan.targetRelease} targetRevision=${plan.targetRevision}`,
  );
}

if (process.argv[1] && /rollback-check\.(ts|js)$/.test(process.argv[1]))
  await run();
