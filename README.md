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

## CMS model and seed (Task 5)

Payload 3.92.1 uses PostgreSQL, with schema push disabled. Load the private
environment variables from `.env.example` into your shell before CMS commands;
these commands never run automatically during a public build:

```powershell
pnpm cms:types
pnpm cms:migrate
pnpm cms:seed
pnpm test:payload
```

The migration is generated by Payload and includes its down migration. The seed
inserts seven pages, five divisions, seven services, six FAQs and two globals in
one transaction. Existing identities, translations, approvals, versions and human
edits are skipped. All new records remain draft, all claims pending and all
features disabled. No accounts, leads, legal documents or media are seeded.
Seed division slugs become database relationships; navigation uses the Task 4
route catalogue. Canonical `status` maps to Payload `_status`; canonical `locales`
maps to `supportedLocales` to avoid a PostgreSQL localization relation collision.

Administrators provision accounts and manage roles. Editors and translators edit
drafts; publishers and administrators approve/publish evidenced bilingual records.
Only sales and administrators can manage leads. Anonymous reads require both
published status and publication approval, including on globals and relationships.
Public Local API consumers **must pass `overrideAccess: false`**. Claims, internal
instructions, approval diagnostics and rights evidence are removed from public
responses. Copy changes invalidate approval unless a publisher explicitly attests
again in that write. Missing translations appear in `translationIssues` and block
publication; locale fallback is disabled. Direct global version restoration is
blocked because Payload 3 bypasses publication hooks there: reapply historical
content through a normal validated draft update. Version history remains readable
to editorial users. First-user HTTP self-registration is blocked; provision the
first administrator through trusted server-side tooling when adding Task 8.

Local uploads live in `.media/`, outside `public/`, and require a persistent volume.
S3-compatible storage is available with `MEDIA_STORAGE=s3`, the listed S3 variables
and a **private bucket**; keep Payload's access-controlled download proxy enabled.
The S3 plugin adds the same schema fields even when disabled. JPEG, PNG, WebP and
PDF uploads are limited to 10 MiB; publication requires bilingual alt text and
approved rights/evidence. No live S3 integration is asserted by the tests.

Media binaries are immutable for every role, including trusted Local API callers.
Upload a new media record to replace a file (including draft files), then switch
the referencing content's media relationship through its normal draft/approval
workflow. Server-generated UUID filenames prevent caller-selected overwrite keys.
In-place replacement, deletion, image reprocessing, duplication and direct media
version restoration are rejected before Payload can mutate storage. Editorial
metadata can still be updated; historical binaries remain available. Automated
file garbage collection is intentionally unavailable.

Optional social-link labels and default SEO fields must be bilingual when used.
Private settings drafts may retain enabled feature flags while copy is reviewed;
publication still requires every enabled feature's evidenced category approval.

The tests start PostgreSQL 17 in a separate temporary process on loopback, migrate
five isolated databases, and stop/remove the disposable cluster afterward. The
Windows binary postinstall permission is explicit in `pnpm-workspace.yaml`.
PostgreSQL 18's embedded Windows binary failed initialization on this machine.
Payload is not mounted in Next yet: admin/REST routes belong to Task 8; public
rendering and the contact endpoint belong to Tasks 6 and 7. Email adapter setup is
also deferred; Payload currently emits its standard missing-adapter warning.
