import { readFile } from 'node:fs/promises';

export type RollbackPlan = { previousRelease: string; targetRelease: string; healthPath: string; smokeCommand: string; migrationPolicy: string };

export function parseRollbackPlan(raw: string): RollbackPlan {
  const value = JSON.parse(raw) as Partial<RollbackPlan>;
  const fields: Array<keyof RollbackPlan> = ['previousRelease', 'targetRelease', 'healthPath', 'smokeCommand', 'migrationPolicy'];
  if (fields.some((field) => typeof value[field] !== 'string' || !value[field])) throw new Error('Rollback plan is incomplete');
  if (!value.healthPath!.startsWith('/')) throw new Error('Rollback healthPath must be relative');
  return value as RollbackPlan;
}

export function verifyRollbackPlan(plan: RollbackPlan) { return { ok: plan.previousRelease !== plan.targetRelease, dryRun: true } as const; }

async function run() {
  const path = process.env.ROLLBACK_PLAN;
  if (!path) throw new Error('ROLLBACK_PLAN is required');
  const plan = parseRollbackPlan(await readFile(path, 'utf8'));
  const result = verifyRollbackPlan(plan);
  if (!result.ok) throw new Error('Rollback plan must identify a distinct previous release');
  console.log(`ROLLBACK_CHECK_OK dryRun=true previous=${plan.previousRelease} target=${plan.targetRelease}`);
}

if (process.argv[1] && /rollback-check\.(ts|js)$/.test(process.argv[1])) await run();
