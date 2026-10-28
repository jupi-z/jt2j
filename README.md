# JT2J production workspace

Task 1 establishes the Next.js 16 App Router / React 19 / strict TypeScript
workspace. The root route is a bootstrap placeholder; business pages, locale
routing, CMS, database, and deployment belong to later tasks.

## Local setup

Use Node.js 22.12.0 or later within 22.x, or Node.js 24.x, and pnpm 11.25.0
(pinned in `package.json`). Install that pnpm version with
`npm install --global pnpm@11.25.0` if needed.

```powershell
pnpm install --frozen-lockfile
Copy-Item .env.example .env.local
pnpm dev
```

Open <http://localhost:3000>. `GET /api/health` returns HTTP 200 and
`{"status":"ok"}`. This is application liveness only; it does not check external
services. No external services or credentials are needed for this bootstrap.

## Environment

| Variable   | Default                 | Purpose                                                                                        |
| ---------- | ----------------------- | ---------------------------------------------------------------------------------------------- |
| `SITE_URL` | `http://localhost:3000` | Server-side HTTP(S) base URL used for metadata; set the canonical HTTPS origin when deploying. |

`src/env.ts` validates configuration when Next.js loads its config and when the
application imports it. Invalid URLs stop startup/build and report field names
without printing values. Next.js loads `.env.local`; never commit real secrets.

## Commands

| Command             | Purpose                                                                                  |
| ------------------- | ---------------------------------------------------------------------------------------- |
| `pnpm dev`          | Start development server on port 3000.                                                   |
| `pnpm build`        | Build production application.                                                            |
| `pnpm start`        | Serve an existing production build.                                                      |
| `pnpm lint`         | ESLint with Next.js rules; warnings fail.                                                |
| `pnpm typecheck`    | Generate Next.js route types and run strict TypeScript checks.                           |
| `pnpm test`         | Run Vitest unit tests (environment validation).                                          |
| `pnpm e2e`          | Run Chromium smoke tests against an automatically managed local dev server on port 3100. |
| `pnpm format:check` | Check formatting.                                                                        |
| `pnpm format`       | Apply formatting.                                                                        |

Before the first browser test, run `pnpm exec playwright install chromium`
(on Linux CI, use `pnpm exec playwright install --with-deps chromium`). Keep port
3100 free: tests intentionally do not reuse another application's server.

Verify a checkout with `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`,
and `pnpm e2e`. Installations use the committed lockfile; `pnpm-workspace.yaml`
explicitly permits the native resolver's installation script.

## Layout

- `app/`: root layout/page and `/api/health` route.
- `src/`: shared TypeScript modules, imported with the `@/*` alias.
- `public/`: static assets (empty at bootstrap).
- `tests/unit/`, `tests/e2e/`: Vitest and Playwright suites.
- `docs/reference/`: preserved prototype, excluded from production runtime.
- `docs/decisions/`: short architecture decisions.
- `docs/superpowers/`: approved design and implementation plan.

See `docs/decisions/0001-prototype-reference.md` for prototype usage boundaries.
