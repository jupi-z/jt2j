# Task 11 report — staging and release gates

Date: 2026-10-29
Worktree: `feat/jt2j-production`

## Delivered

- `scripts/smoke-public.ts` checks health, all catalogued public routes in `/fr` and `/en`, robots, sitemap and an opt-in non-persisting contact test request.
- `scripts/backup-check.ts` validates a provider manifest for database/media objects, checksums, release and verification timestamp. It is explicitly dry-run only.
- `scripts/rollback-check.ts` validates a previous/target release plan, health path, smoke command and migration policy. It is explicitly dry-run only.
- `Dockerfile` builds the Next standalone runtime; `docker-compose.yml` provides PostgreSQL and an optional app profile using required environment substitutions.
- `.github/workflows/ci.yml` runs locked install, tests, typecheck, lint, high-severity audit, build and artifact retention.
- `.github/workflows/deploy-staging.yml` is a manually dispatched, protected-environment workflow with controlled migration, restart and smoke gates.
- `.github/workflows/deploy-production.yml` requires CI, protected production approval, dry-run backup/rollback evidence and staging evidence before controlled migration, restart and smoke gates.
- `docs/operations/deployment.md` documents local usage, secret/environment requirements, migration policy and external reservations.

## Local evidence

| Gate | Result |
|---|---|
| `pnpm exec vitest run tests/release/release-gates.test.ts tests/leads/lead-route.test.ts` | PASS, 2 files / 23 tests |
| `pnpm test` | PASS, 20 files / 175 tests |
| `pnpm typecheck` | PASS |
| `pnpm lint` | PASS, zero warnings/errors |
| `pnpm audit --audit-level=high` | PASS at high threshold; 1 low transitive advisory remains |
| `pnpm build` | PASS; Next standalone output generated |
| `pnpm smoke:public` against local standalone server | PASS, 41 checks without contact mode |
| `pnpm smoke:public` with local opt-in contact mode | PASS, 42 checks including contact test mode |
| `pnpm backup:check` with temporary verified manifest | PASS, `dryRun=true` |
| `pnpm rollback:check` with temporary plan | PASS, `dryRun=true` |
| `docker compose config --quiet` with local-only environment values | PASS |

The three scripts also fail closed without their required configuration: missing `SMOKE_BASE_URL`, `BACKUP_MANIFEST` or `ROLLBACK_PLAN` each produced exit code 1.

Compose also fails closed when required environment variables are absent; no fallback credential is embedded in the file.

## Not executed / blocked by external environment

- No GitHub Actions run was dispatched or observed from this worktree.
- No staging or production deployment was performed.
- No GitHub environment protection, SSH host/key configuration, DNS/TLS, object storage, mail provider, provider backup, restore rehearsal, traffic switch or production rollback was verified.
- No real backup was created, restored or deleted; no real rollback was exercised.
- The remaining low audit advisory was not changed because no safe upstream resolution was available in this task.

The workflow files are release gates and deployment instructions, not evidence that the external gates have passed.
