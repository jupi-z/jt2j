# Task 9 — Security, observability and operational safeguards

Date: 2026-10-28
Commit: final commit hash is returned in the task handoff.
Worktree: `D:\Mes Projets\Projets Web\JT2J\.worktrees\jt2j-production`

## Scope delivered

- Added `src/lib/security/headers.ts` and wired `next.config.ts` to emit CSP, HSTS in production, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Content-Type-Options` and COOP.
- Added signed double-submit CSRF primitives in `src/lib/security/csrf.ts`, a no-store `GET /api/csrf` token endpoint, and production CSRF enforcement for the public lead mutation. The contact form fetches the token before POST; local mode remains usable when no CSRF secret is configured.
- Added bounded JSON input reading (`16 KiB` default) and rate-limit policy sharing the lead default of 5 mutations per 15 minutes. The existing signed-cookie/trusted-proxy lead limiter remains the enforcement store; the shared policy is now explicit in `src/lib/security/rateLimit.ts`.
- Added structured JSON logging with recursive redaction of PII, credentials, tokens, cookies and authorization values in `src/lib/observability/logger.ts`.
- Added production environment checks for HTTPS `SITE_URL`, `DATABASE_URL`, distinct-length `PAYLOAD_SECRET` and `CSRF_SECRET`; Payload configuration invokes the check.
- Preserved and covered existing Payload admin-only role changes, published/approved draft isolation, private lead fields and server-side lead schema limits.
- Added operational runbooks: `docs/operations/security.md`, `backups.md`, and `incident-response.md`, including encrypted retention, restore rehearsal, incident containment and credential rotation.
- Added `tests/security/security.test.ts` and included it in Vitest.

## TDD evidence

Initial red run:

```text
pnpm test tests/security/security.test.ts
5 failed, 1 passed
```

The five failures were the intentionally absent headers, CSRF, generic limiter, logger and production-environment modules. The existing admin/draft/input boundary assertion passed.

Focused green run after implementation:

```text
pnpm test tests/security/security.test.ts
1 file passed, 7 tests passed
```

## Fresh validation evidence

- `pnpm lint`: passed, zero warnings.
- `pnpm typecheck`: passed (`next typegen` and `tsc --noEmit`).
- `pnpm test`: passed, **19 test files / 165 tests**.
- `pnpm exec playwright test tests/e2e/contact.spec.ts`: passed, **2 tests**.
- `pnpm build`: passed; Next generated 45 static pages and included `/api/csrf`, `/api/leads`, public routes, robots and sitemap.
- Targeted Prettier check: passed. `git diff --check`: passed.

## Dependency audit reserve

`pnpm audit --prod` was executed and returned exit code 1 with 7 transitive findings:

- `dompurify@3.4.15` through Payload S3/cloud-storage/Monaco: 1 critical, 1 high and 4 low advisories; patched versions are `>=3.4.17`.
- `esbuild@0.18.20` through `drizzle-kit`/`@esbuild-kit`: moderate advisory; patched versions are `>=0.25.0` and newer versions are already present elsewhere in the graph.
- `deepmerge@4.3.1` through Payload: low advisory; the audit reports no patched version.

No dependency override was committed because the attempted pnpm 11 override location was ignored and did not change the resolved graph. Remediation requires a reviewed Payload/dependency upgrade or a supported lockfile override, followed by a fresh audit and full validation.

## Explicit non-claims and reserves

- No real deployment, staging approval, production smoke check, backup execution or restore rehearsal was performed or validated by this task.
- The Payload test environment emitted its existing “No email adapter provided” warning; production transactional email configuration remains an operational prerequisite.
- CSP intentionally allows inline styles/scripts needed by the current Next/React rendering; any future third-party integration must be reviewed against the policy.
- The current default CSRF secret fallback is only for non-production local compatibility; production environment checks require `CSRF_SECRET`.
