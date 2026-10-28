# JT2J production workspace

Next.js 16 App Router / React 19 / strict TypeScript workspace with a bilingual
public route skeleton, canonical content contracts, and shared visual shell.
CMS, approved page content, database, and deployment belong to later tasks.

## Local setup

Use Node.js 22.12.0 or later within 22.x, or Node.js 24.x, and pnpm 11.25.0
(pinned in `package.json`). Install that pnpm version with
`npm install --global pnpm@11.25.0` if needed.

```powershell
pnpm install --frozen-lockfile
Copy-Item .env.example .env.local
pnpm dev
```

Open <http://localhost:3000> (redirects to `/fr`). `/en` selects English.
`GET /api/health` returns HTTP 200 and
`{"status":"ok"}`. This is application liveness only; it does not check external
services. No external services or credentials are needed for the skeleton.

## Environment

| Variable   | Default                 | Purpose                                                                                        |
| ---------- | ----------------------- | ---------------------------------------------------------------------------------------------- |
| `SITE_URL` | `http://localhost:3000` | Server-side HTTP(S) base URL used for metadata; set the canonical HTTPS origin when deploying. |

`src/env.ts` validates configuration when Next.js loads its config and when the
application imports it. Invalid URLs stop startup/build and report field names
without printing values. Next.js loads `.env.local`; never commit real secrets.

## Commands

| Command             | Purpose                                                             |
| ------------------- | ------------------------------------------------------------------- |
| `pnpm dev`          | Start development server on port 3000.                              |
| `pnpm build`        | Build production application.                                       |
| `pnpm start`        | Serve an existing production build.                                 |
| `pnpm lint`         | ESLint with Next.js rules; warnings fail.                           |
| `pnpm typecheck`    | Generate Next.js route types and run strict TypeScript checks.      |
| `pnpm test`         | Run Vitest environment, content-contract, and shell DOM tests.      |
| `pnpm e2e`          | Run Chromium app smoke, locale routing, and SEO tests on port 3100. |
| `pnpm format:check` | Check formatting.                                                   |
| `pnpm format`       | Apply formatting.                                                   |

Before the first browser test, run `pnpm exec playwright install chromium`
(on Linux CI, use `pnpm exec playwright install --with-deps chromium`). Keep port
3100 free: tests intentionally do not reuse another application's server.

Verify a checkout with `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`,
and `pnpm e2e`. Installations use the committed lockfile; `pnpm-workspace.yaml`
explicitly permits the native resolver's installation script.

For tests against a production build, keep `SITE_URL` identical at build and test
time, run `pnpm build`, then `$env:PLAYWRIGHT_PRODUCTION='1'; pnpm e2e` in
PowerShell. Remove that session variable before running development tests.

## Public routing and SEO

- Both `/fr` and `/en` expose the home, `entreprise`, `poles`, `services`,
  `approche`, `faq`, and `contact` pages. Detail paths retain the canonical
  Task 2 division/service slugs in both languages.
- `src/i18n/config.ts` defines deterministic French default routing. `next-intl`
  loads separate dictionaries; server components pass translated props to the
  Task 3 shell. Language links preserve the current detail path.
- `src/routing/catalog.ts` reads only seed identities for architecture. Draft
  descriptions, claims, contact coordinates, and editorial notes are not public
  page content. All skeleton pages deliberately carry `noindex, follow`.
- Canonical/hreflang, Open Graph, Twitter, sitemap and robots URLs derive from
  the origin of `SITE_URL`. Set it to the real HTTPS origin **before building**.
  The sitemap currently lists the 38 skeleton URLs as an architecture inventory.
  Later public queries must filter approved published content and replace the
  skeleton indexing policy before release.
- Proxy matching is limited to `/`, `/fr/...`, and `/en/...`. Private endpoints,
  metadata files, and assets bypass locale negotiation. Robots excludes `/admin`,
  `/api` and `/_next/`; authentication remains a separate future task.
- The known route inventory uses `dynamicParams = false`. Unknown paths/slugs
  return a localized, server-rendered, noindex 404 through `global-not-found`.
  Next's experimental `globalNotFound` option is enabled for the locale root
  layout. It also avoids Next 16.4.3's blank HTML response when page-level
  `notFound()` is thrown (upstream issues #99793/#99287). Reassess this boundary
  when adding CMS-driven routes; the locale not-found component is retained.

## Layout

- `app/`: locale root layout/pages, SEO metadata routes, 404s, and `/api/health`.
- `src/`: shared TypeScript modules, imported with the `@/*` alias.
- `public/`: shared artwork and static assets.
- `tests/unit/`, `tests/content/`, `tests/ui/`, `tests/routing/`, `tests/e2e/`:
  Vitest and Playwright suites.
- `docs/reference/`: preserved prototype, excluded from production runtime.
- `docs/decisions/`: short architecture decisions.
- `docs/superpowers/`: approved design and implementation plan.

See `docs/decisions/0001-prototype-reference.md` for prototype usage boundaries.
