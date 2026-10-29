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

| Gate                                                                                      | Result                                                    |
| ----------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `pnpm exec vitest run tests/release/release-gates.test.ts tests/leads/lead-route.test.ts` | PASS, 2 files / 23 tests                                  |
| `pnpm test`                                                                               | PASS, 20 files / 175 tests                                |
| `pnpm typecheck`                                                                          | PASS                                                      |
| `pnpm lint`                                                                               | PASS, zero warnings/errors                                |
| `pnpm audit --audit-level=high`                                                           | PASS at high threshold; 1 low transitive advisory remains |
| `pnpm build`                                                                              | PASS; Next standalone output generated                    |
| `pnpm smoke:public` against local standalone server                                       | PASS, 41 checks without contact mode                      |
| `pnpm smoke:public` with local opt-in contact mode                                        | PASS, 42 checks including contact test mode               |
| `pnpm backup:check` with temporary verified manifest                                      | PASS, `dryRun=true`                                       |
| `pnpm rollback:check` with temporary plan                                                 | PASS, `dryRun=true`                                       |
| `docker compose config --quiet` with local-only environment values                        | PASS                                                      |

The three scripts also fail closed without their required configuration: missing `SMOKE_BASE_URL`, `BACKUP_MANIFEST` or `ROLLBACK_PLAN` each produced exit code 1.

Compose also fails closed when required environment variables are absent; no fallback credential is embedded in the file.

## Not executed / blocked by external environment

- No GitHub Actions run was dispatched or observed from this worktree.
- No staging or production deployment was performed.
- No GitHub environment protection, SSH host/key configuration, DNS/TLS, object storage, mail provider, provider backup, restore rehearsal, traffic switch or production rollback was verified.
- No real backup was created, restored or deleted; no real rollback was exercised.
- The remaining low audit advisory was not changed because no safe upstream resolution was available in this task.

The workflow files are release gates and deployment instructions, not evidence that the external gates have passed.

## Fix round 1/5 — review findings

Base: `c1c38c1`

### Changes

- `scripts/backup-check.ts` now requires real database/media file artifacts, recomputes SHA-256 checksums, rejects missing/empty or stale evidence, and binds each artifact to the manifest release/revision. The CLI also requires `BACKUP_EXPECTED_REVISION`; a JSON `verified` flag is not used.
- `scripts/rollback-check.ts` now requires a real previous-release artifact, recomputes its SHA-256 checksum, rejects missing/empty or stale evidence, and binds the artifact and target to the declared revisions. The CLI requires `ROLLBACK_EXPECTED_TARGET_REVISION`.
- `scripts/smoke-public.ts` now accepts the contact smoke request only for HTTP `202` with JSON `{ accepted: true, testMode: true }`.
- CI applies migrations twice against its disposable PostgreSQL service, providing an idempotent migration verification gate without targeting production.
- `docker-compose.yml` builds the app database URL with the `postgres` service hostname.
- Staging and production workflows now name forward-only migration and post-deploy smoke gates explicitly, and record failure as requiring a manual/provider-specific rollback decision. No automatic rollback is claimed or performed.
- `docs/operations/deployment.md` documents the artifact schema, freshness/integrity checks, disposable CI migration gate, and the remaining provider-specific manual gates.

### Fix-round commands and outputs

| Command                                                    | Result                                                                                                 |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `pnpm exec vitest run tests/release/release-gates.test.ts` | PASS — 1 file / 4 tests                                                                                |
| `pnpm test`                                                | PASS — 20 files / 176 tests; Payload emitted existing no-email-adapter warnings                        |
| `pnpm lint`                                                | PASS — zero errors/warnings                                                                            |
| `pnpm typecheck`                                           | PASS — Next route type generation and `tsc --noEmit`                                                   |
| `pnpm build`                                               | PASS — Next production build, 45 static pages generated                                                |
| `pnpm exec prettier --check <changed files>`               | PASS — all changed files formatted                                                                     |
| `git diff --check`                                         | PASS                                                                                                   |
| `docker compose config --quiet` with local-only values     | PASS                                                                                                   |
| `actionlint`                                               | DEFERRED — executable unavailable in this environment (`actionlint unavailable: executable not found`) |

No GitHub Actions run, staging deployment, production deployment, backup creation/restore, or rollback was executed. These remain external/manual gates and no production state was changed.

## Fix round 2/5 — end-to-end artifact materialization

Finding addressed: the production preflight previously received only manifest/plan JSON, while the referenced files were absent from the clean GitHub runner. It now requires `PRODUCTION_ARTIFACT_RUN_ID`, downloads three revision-named artifacts from that GitHub Actions run, requires the exact non-empty files `database.dump`, `media.tar` and `previous-release.tar`, rewrites only the manifest paths to those local files, and then runs the existing checksum/freshness/release/revision checks. Missing inputs, download failures or missing files fail closed. No provider credential or production action was added.

Manual prerequisite: an authorized backup job must upload `jt2j-production-backup-database-<revision>`, `jt2j-production-backup-media-<revision>` and `jt2j-production-rollback-<revision>` in the same repository, with the exact file names documented in `docs/operations/deployment.md`; the operator must store that run's numeric ID as `PRODUCTION_ARTIFACT_RUN_ID` and provide manifests whose checksums and release/revision bindings describe those exact files. If the provider cannot export artifacts into such a run, the production workflow remains blocked pending a reviewed provider-specific materialization step.

### Commands and output

| Command | Result |
| --- | --- |
| `pnpm exec vitest run tests/release/release-gates.test.ts` | PASS — 1 file / 5 tests; includes the workflow materialization contract |
| `pnpm test` | PASS — 20 files / 177 tests; existing Payload no-email-adapter warnings only |
| `pnpm typecheck` | PASS — route types generated and `tsc --noEmit` completed with code 0 |
| `pnpm lint` | PASS — zero errors/warnings |
| `pnpm build` | PASS — Next production build; 45 static pages generated |
| `pnpm exec prettier --check .github/workflows/deploy-production.yml docs/operations/deployment.md tests/release/release-gates.test.ts` | PASS — all changed files formatted |
| `git diff --check` | PASS |

No GitHub Actions run was dispatched or observed. Staging, production deployment, real artifact export, restore rehearsal, rollback rehearsal and all provider/external gates remain deferred; no production state changed.
