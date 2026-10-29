# JT2J deployment and release gates

This runbook describes the controlled path from a reviewed revision to staging and, only after staging approval, production. It does not claim that any environment has been deployed from this repository.

## Local verification

Install the locked dependencies with `pnpm install --frozen-lockfile`. Run the normal gates with `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm audit` and `pnpm build`.

The public smoke script is an HTTP verifier. It requires `SMOKE_BASE_URL` and checks `/api/health`, every public FR/EN route from the route catalog, `/robots.txt`, and `/sitemap.xml`. If `SMOKE_CONTACT_TOKEN` is provided, it also submits a synthetic contact request to the opt-in contact test mode. The server must have `CONTACT_SMOKE_MODE=enabled` and the matching `CONTACT_SMOKE_TOKEN`; this mode must never be enabled in production.

```powershell
$env:SMOKE_BASE_URL = 'http://localhost:3000'
pnpm smoke:public
```

`pnpm backup:check` validates a provider-produced manifest containing readable database and media artifact paths, SHA-256 checksums, matching release/revision bindings and a fresh `createdAt`. It recomputes both checksums and requires the files to exist and be non-empty; a `verified: true` field is not evidence. Set `BACKUP_EXPECTED_REVISION` in CI/release preflight. It is a dry-run verification only: it does not create, copy, restore or delete a backup.

`pnpm rollback:check` validates a plan naming distinct previous and target releases/revisions, a readable non-empty previous-release artifact, its SHA-256 checksum, matching binding and fresh evidence, plus a relative health path, smoke command and migration policy. Set `ROLLBACK_EXPECTED_TARGET_REVISION` in CI/release preflight. It is a dry-run verification only: it does not switch traffic, change symlinks, run migrations or restore data.

## Docker and local services

`docker-compose.yml` provides PostgreSQL and an optional app profile. All passwords and application secrets are required through environment substitution; no credential is stored in the compose file. Use a local, untracked `.env` derived from `.env.example`.

```powershell
docker compose up -d postgres
docker compose --profile app up --build
```

## CI gates

`.github/workflows/ci.yml` runs on pull requests and protected branch pushes, and is reusable by deployment workflows. It installs the lockfile, applies migrations twice to the disposable CI PostgreSQL service (the second run verifies there are no pending migrations), then runs the test suite, typecheck, lint, high-severity audit and production build, and retains build metadata as an artifact. This gate never targets production. CI database and application secrets are GitHub Actions secrets.

## Staging

The staging workflow is manually dispatched with an approved revision and targets the protected `staging` environment. It runs the reusable CI gate, installs the lockfile, builds locally, connects only with `STAGING_SSH_PRIVATE_KEY` and `STAGING_SSH_KNOWN_HOSTS`, runs `pnpm cms:migrate` before restart, and runs the public smoke verifier against `STAGING_BASE_URL`. The staging contact token is an environment secret and only enables the non-persisting test mode.

No staging deployment or smoke run is considered evidence until the workflow log is available and reviewed.

## Production

The production workflow is manually dispatched with a revision and targets the protected `production` environment. Its preflight gate requires provider-supplied backup-manifest JSON, rollback-plan JSON, staging evidence and `PRODUCTION_ARTIFACT_RUN_ID`. The workflow downloads three files from that GitHub Actions run before invoking the dry-run scripts: `jt2j-production-backup-database-<revision>` must contain `database.dump`, `jt2j-production-backup-media-<revision>` must contain `media.tar`, and `jt2j-production-rollback-<revision>` must contain `previous-release.tar`, each at the artifact root. It rewrites only the manifest paths to those runner-local files; the scripts still verify the declared checksums, freshness and release/revision bindings. A missing run ID, artifact, file or checksum match fails closed. Only after that gate and the environment approval can the deployment job run the controlled migration, restart and public smoke checks.

Production migrations are forward-only through `pnpm cms:migrate`; they are not silently rolled back. A migration failure stops the workflow, and the explicit failure gate records that no automatic rollback occurred. A real restore or rollback requires the provider-specific procedure, the exact snapshot/release identifiers, an incident or release record, and a fresh staging/isolated verification. Destructive production actions remain manual-dispatch and protected-environment steps because provider-specific credentials and procedures are not available in this repository.

## External gates and non-claims

This repository cannot verify GitHub environment protection, SSH host configuration, provider backup integrity, object-storage rights, DNS/TLS, mail delivery, a real database restore, traffic switching, or a production rollback. Those are explicit external gates. The commit containing this runbook therefore does not claim staging/production deployment, backup creation or restoration, or rollback execution.

## Required GitHub secrets and environment controls

Configure the CI secrets `CI_POSTGRES_PASSWORD`, `CI_PAYLOAD_SECRET` and `CI_CSRF_SECRET`. Configure protected `staging` and `production` environments with their respective SSH key, known-hosts, host, user, app directory, base URL, staging evidence, backup/rollback manifests and `PRODUCTION_ARTIFACT_RUN_ID`. Before a production dispatch, an authorized backup job must upload the three revision-named GitHub Actions artifacts listed above in the same repository and record its numeric run ID; the manifest checksums must be computed from those exact files and its release/revision fields must match the requested revision. No provider-specific storage credential is assumed here. If the provider cannot export the files into such a run, production remains blocked until a provider-specific download/materialization step is supplied and reviewed. Require reviewers on both environments, restrict deployment branches/tags, and keep production contact smoke mode disabled.
