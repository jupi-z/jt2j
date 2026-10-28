# JT2J Production Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and launch a production-grade bilingual JT2J institutional website from the existing prototype, including public pages, secure content management, contact-request processing, automated verification, and a reversible deployment process.

**Architecture:** One Next.js App Router application in TypeScript with Payload CMS embedded in the same repository. Public pages use locale-aware routes and server rendering/static generation; Payload provides the private admin panel, localized content, media, authentication, drafts, publication, versions, and APIs. PostgreSQL stores content and leads; object storage holds media; a transactional email provider handles notifications.

**Tech Stack:** Next.js 16.x, React 19.x, TypeScript strict, Payload CMS 3.x, PostgreSQL, `next-intl`, Zod, Vitest, Playwright, axe-core, ESLint, Prettier, pnpm, Docker-compatible local services.

**Spec:** `docs/superpowers/specs/2026-10-28-jt2j-production-design.md`

## Global Constraints

- Preserve the prototype's navy/cream/gold visual language, editorial typography, abstract SVG compositions, and bilingual FR/EN content structure.
- French is the default locale; English is a maintained translation, not an automatic machine fallback for publication.
- No unverified legal, leadership, partnership, testimonial, capability, or reference claims may be published.
- `/admin` is private, authenticated, excluded from public navigation, and excluded from indexing.
- Contact requests must be validated server-side, rate-limited, persisted only according to the approved data policy, and sent through a transactional provider.
- No production secrets, tokens, credentials, or private customer data may be committed.
- Every implementation task ends with a focused test run and a small commit.
- No production deployment occurs before staging approval, backup verification, and rollback verification.

## Review Focus

- A missing English translation must be detected before publication rather than silently replacing approved content.
- A malformed, abusive, or repeated contact request must not create uncontrolled database or email activity.
- A non-admin user must not read drafts, publish content, view sensitive lead data, or access media outside their role.
- A page, sitemap, metadata entry, and canonical URL must remain correct for both locales and dynamic slugs.
- A release or migration failure must leave a recoverable database, media set, and previous application version.

### Task 1: Repository bootstrap and reference preservation

**Files:**
- Create: `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `next.config.ts`, `eslint.config.*`, `.prettierrc.*`, `.env.example`.
- Create: `src/`, `app/`, `public/`, `tests/`, `docs/decisions/`.
- Add reference: `docs/reference/JT2J_Prestige_Prototype.html` from the supplied prototype.
- Create: `README.md` with local setup, environment variables, and commands.

**Interfaces:**
- Produces a reproducible Next.js/TypeScript workspace with `dev`, `build`, `lint`, `typecheck`, `test`, and `e2e` scripts.

- [ ] **Step 1: Write the bootstrap smoke test** asserting that the root route can render a document title and that the health endpoint returns HTTP 200.
- [ ] **Step 2: Run the smoke test** and confirm it fails because the application does not exist yet.
- [ ] **Step 3: Scaffold the Next.js application** with strict TypeScript, pnpm, path aliases, and environment validation without adding business features.
- [ ] **Step 4: Copy the prototype into `docs/reference/`** and add a short decision note identifying it as visual/content reference only, not production runtime code.
- [ ] **Step 5: Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`** and confirm all pass.
- [ ] **Step 6: Commit** `chore: bootstrap jt2j production workspace`.

### Task 2: Content extraction and canonical data contract

**Files:**
- Create: `src/content/types.ts`.
- Create: `src/content/seed/pages.ts`, `src/content/seed/divisions.ts`, `src/content/seed/services.ts`, `src/content/seed/faq.ts`.
- Create: `scripts/extract-prototype-content.ts` and `scripts/validate-content.ts`.
- Test: `tests/content/content-contract.test.ts`.

**Interfaces:**
- Produces typed `LocalizedText`, `PageSeed`, `DivisionSeed`, `ServiceSeed`, `FaqSeed`, and `SiteSettingsSeed` contracts used by Payload seed scripts and public queries.

- [ ] **Step 1: Write failing contract tests** for exactly five divisions, seven services, FR/EN title and lead fields, unique slugs, valid division relations, and explicit publication flags.
- [ ] **Step 2: Run the contract tests** and confirm they fail because canonical seed data is absent.
- [ ] **Step 3: Extract the prototype's content** into typed seed modules without copying runtime rendering functions or temporary demo labels.
- [ ] **Step 4: Add validation** for missing translations, duplicate slugs, invalid relations, empty required fields, and unapproved claims.
- [ ] **Step 5: Run the contract and extraction tests** and confirm the seed dataset is deterministic.
- [ ] **Step 6: Commit** `feat: define jt2j canonical content contracts`.

### Task 3: Design system and visual foundations

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/globals.css`, `src/styles/typography.css`.
- Create: `src/components/ui/Button.tsx`, `LinkArrow.tsx`, `Eyebrow.tsx`, `SectionHeading.tsx`, `Breadcrumbs.tsx`.
- Create: `src/components/layout/Header.tsx`, `Footer.tsx`, `MobileNavigation.tsx`.
- Create: `src/components/art/AbstractArtwork.tsx` and approved asset placeholders under `public/assets/`.
- Test: `tests/ui/layout.spec.tsx`.

**Interfaces:**
- Produces shared layout components accepting typed locale-aware links and content props; artwork components remain decorative with `aria-hidden="true"` unless an approved accessible description is supplied.

- [ ] **Step 1: Write component tests** for focus-visible states, button/link semantics, skip link presence, locale switch labels, and footer navigation.
- [ ] **Step 2: Run the component tests** and confirm they fail.
- [ ] **Step 3: Port the prototype's visual tokens** into focused CSS files and implement the shared shell without page-specific content.
- [ ] **Step 4:** Implement responsive header, mega-navigation, mobile menu, footer, reduced-motion behavior, and accessible focus handling.
- [ ] **Step 5: Run component tests and a visual local check** at desktop and mobile viewport sizes.
- [ ] **Step 6: Commit** `feat: add jt2j design system and site shell`.

### Task 4: Locale routing, SEO, and public route skeleton

**Files:**
- Create: `app/[locale]/layout.tsx`, `app/[locale]/page.tsx`.
- Create: `app/[locale]/entreprise/page.tsx`, `poles/page.tsx`, `services/page.tsx`, `approche/page.tsx`, `faq/page.tsx`, `contact/page.tsx`.
- Create: `app/[locale]/poles/[slug]/page.tsx`, `services/[slug]/page.tsx`.
- Create: `src/i18n/config.ts`, `src/i18n/request.ts`, `src/i18n/dictionaries/fr.json`, `en.json`.
- Create: `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`, `app/not-found.tsx`.
- Test: `tests/routing/locale-routes.spec.ts`, `tests/routing/seo.spec.ts`.

**Interfaces:**
- Produces public routes `/fr/...` and `/en/...`, locale-aware navigation, canonical URLs, hreflang links, per-route metadata, sitemap entries, and a production-safe robots policy.

- [ ] **Step 1: Write failing route tests** for home, company, divisions, five division slugs, services, seven service slugs, FAQ, contact, 404, and both locales.
- [ ] **Step 2: Run the route tests** and confirm missing routes/metadata failures.
- [ ] **Step 3: Implement locale configuration and route skeletons** using server components and typed route params.
- [ ] **Step 4:** Implement `generateStaticParams`, `generateMetadata`, canonical links, hreflang, sitemap, robots, and OG image conventions.
- [ ] **Step 5: Run route, metadata, and build tests** and inspect generated HTML for both locales.
- [ ] **Step 6: Commit** `feat: add bilingual public route architecture`.

### Task 5: Payload collections, database, media, and seed pipeline

**Files:**
- Create: `payload.config.ts`.
- Create: `src/collections/Users.ts`, `Pages.ts`, `Divisions.ts`, `Services.ts`, `FAQs.ts`, `Media.ts`, `Leads.ts`, `LegalDocuments.ts`.
- Create: `src/globals/SiteSettings.ts`, `Navigation.ts`.
- Create: `src/access/roles.ts`, `src/access/publishedOnly.ts`.
- Create: `src/seed/seed.ts`, `src/seed/seed.test.ts`.
- Create: database migration files generated by Payload.
- Test: `tests/payload/access-control.test.ts`, `tests/payload/localization.test.ts`.

**Interfaces:**
- Produces Payload collections with localized fields, unique slugs, status, ordering, relationships, media rights metadata, role-based access, and seedable canonical data.

- [ ] **Step 1: Write failing access and localization tests** for public published reads, draft restrictions, role permissions, missing translation detection, and division/service relationships.
- [ ] **Step 2: Run the tests** and confirm no collections or access rules exist.
- [ ] **Step 3: Implement Payload configuration and PostgreSQL adapter** with localized content fields and explicit public/admin access rules.
- [ ] **Step 4: Add versions/drafts and seed the extracted content** while keeping legal, leadership, and reference claims unpublished until approved.
- [ ] **Step 5: Run migration, seed, access, and localization tests** against a disposable test database.
- [ ] **Step 6: Commit** `feat: add payload content model and access control`.

### Task 6: Public pages and interactive content experiences

**Files:**
- Create: `src/queries/publicContent.ts`.
- Create: `src/components/home/*`, `src/components/divisions/*`, `src/components/services/*`, `src/components/faq/*`.
- Modify: all public `app/[locale]/**/page.tsx` files.
- Test: `tests/public/home.spec.tsx`, `divisions.spec.tsx`, `services.spec.tsx`, `faq.spec.tsx`.

**Interfaces:**
- Consumes the published-only content queries and shared layout components.
- Produces public pages matching the prototype's information architecture without exposing draft or internal fields.

- [ ] **Step 1: Write failing rendering tests** for the five divisions, seven services, service filtering/search, FAQ disclosure behavior, breadcrumbs, and contextual contact links.
- [ ] **Step 2: Run the tests** and confirm pages are still skeletons.
- [ ] **Step 3: Implement server-rendered public sections** and isolate search/filter behavior in small client components only where interaction requires it.
- [ ] **Step 4:** Preserve the visual hierarchy and replace temporary assets only with approved media.
- [ ] **Step 5:** Run public route tests, accessibility checks, and production build.
- [ ] **Step 6: Commit** `feat: implement jt2j public pages`.

### Task 7: Contact request workflow

**Files:**
- Create: `src/lib/validation/leadSchema.ts`.
- Create: `app/api/leads/route.ts`.
- Create: `src/lib/email/sendLeadNotification.ts`.
- Create: `src/components/contact/ContactForm.tsx`, `LeadConfirmation.tsx`.
- Modify: `src/collections/Leads.ts`.
- Test: `tests/leads/lead-schema.test.ts`, `tests/leads/lead-route.test.ts`, `tests/e2e/contact.spec.ts`.

**Interfaces:**
- `POST /api/leads` accepts the typed lead payload and returns a safe confirmation identifier without returning internal data.
- The client form submits only approved fields and never exposes provider credentials.

- [ ] **Step 1: Write failing tests** for required fields, email/phone validation, consent, honeypot, rate limiting, duplicate handling, locale/source capture, and transactional notification failure.
- [ ] **Step 2: Run the tests** and confirm the endpoint is absent.
- [ ] **Step 3:** Implement Zod validation, server-side persistence, rate limiting, anti-spam controls, and structured error responses.
- [ ] **Step 4:** Implement transactional notification and safe user confirmation; keep a fallback operational alert path documented but do not silently fall back to `mailto:` in production.
- [ ] **Step 5:** Run unit, integration, and browser tests with a local mail sink.
- [ ] **Step 6: Commit** `feat: add secure contact request workflow`.

### Task 8: Private editorial back office

**Files:**
- Modify: `payload.config.ts` and collection configs.
- Create: `src/admin/components/TranslationStatus.tsx`, `PublicationChecklist.tsx`, `LeadStatusSelect.tsx`.
- Create: `src/admin/hooks/requireRole.ts`, `src/admin/hooks/publicationChecks.ts`.
- Test: `tests/admin/roles.spec.ts`, `tests/admin/publication-checklist.spec.ts`.

**Interfaces:**
- Admin users can manage content and leads according to role; public visitors cannot reach drafts or internal fields.
- Publishing is blocked when required localized fields, SEO fields, legal approvals, or media rights metadata are incomplete.

- [ ] **Step 1: Write failing role and publication tests** for admin/editor/publisher/translator/sales capabilities and blocked publication states.
- [ ] **Step 2: Run the tests** and confirm the admin has no custom guardrails.
- [ ] **Step 3:** Configure authenticated admin access, role-based permissions, localized editing, media rights fields, and lead management views.
- [ ] **Step 4:** Add translation completeness and publication checklist components.
- [ ] **Step 5:** Run role tests, manual admin walkthrough, and draft/preview/publish/rollback tests.
- [ ] **Step 6: Commit** `feat: add jt2j editorial back office workflow`.

### Task 9: Security, observability, and operational safeguards

**Files:**
- Create: `src/lib/security/rateLimit.ts`, `csrf.ts`, `headers.ts`.
- Create: `src/lib/observability/logger.ts`.
- Modify: `next.config.ts`, middleware/proxy configuration, Payload access rules, and deployment configuration.
- Create: `docs/operations/security.md`, `docs/operations/backups.md`, `docs/operations/incident-response.md`.
- Test: `tests/security/headers.test.ts`, `tests/security/access.test.ts`.

**Interfaces:**
- Produces secure headers, non-leaking error handling, structured logs without sensitive values, rate-limited public mutations, and documented backup/restore procedures.

- [ ] **Step 1: Write failing security tests** for headers, admin protection, draft isolation, secret non-exposure, input limits, and sensitive-log redaction.
- [ ] **Step 2: Run the tests** and confirm the protections are absent or incomplete.
- [ ] **Step 3:** Implement security headers, validation limits, access rules, rate limiting, redacted logging, and production environment checks.
- [ ] **Step 4:** Document backup retention, restore steps, incident response, and credential rotation.
- [ ] **Step 5:** Run security tests and dependency audit.
- [ ] **Step 6: Commit** `feat: harden jt2j production operations`.

### Task 10: Complete quality assurance and accessibility verification

**Files:**
- Create: `tests/e2e/navigation.spec.ts`, `responsive.spec.ts`, `accessibility.spec.ts`, `locales.spec.ts`.
- Create: `playwright.config.ts` and test fixtures.
- Create: `docs/qa/release-checklist.md`.

**Interfaces:**
- Produces a repeatable QA suite covering public routes, both locales, desktop/mobile layouts, keyboard navigation, reduced motion, form states, admin access, and 404 behavior.

- [ ] **Step 1: Write failing end-to-end tests** for all public routes, language switching, navigation, search/filter, FAQ, contact success/error, and unauthorized admin access.
- [ ] **Step 2: Run the suite** and record the initial failures by category.
- [ ] **Step 3: Add responsive fixtures and accessibility assertions** for landmarks, headings, labels, focus order, dialogs, contrast-sensitive states, and reduced-motion CSS.
- [ ] **Step 4:** Fix only implementation defects uncovered by the suite; do not weaken assertions to make the build green.
- [ ] **Step 5:** Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm e2e`, `pnpm build`, and dependency audit.
- [ ] **Step 6: Commit** `test: complete jt2j release verification suite`.

### Task 11: Staging deployment and release gates

**Files:**
- Create: `Dockerfile`, `docker-compose.yml` for local services if needed, deployment configuration, and CI workflow files.
- Create: `.github/workflows/ci.yml`, `.github/workflows/deploy-staging.yml`, `.github/workflows/deploy-production.yml`.
- Create: `scripts/smoke-public.ts`, `scripts/backup-check.ts`, `scripts/rollback-check.ts`.
- Create: `docs/operations/deployment.md`.

**Interfaces:**
- Produces CI gates, staging deployment, public route smoke checks, database/media backup checks, and a documented rollback command/process.

- [ ] **Step 1: Write failing CI/smoke scripts** for build, migrations, health, all locale routes, robots, sitemap, and contact test mode.
- [ ] **Step 2: Run them locally** and confirm they fail without deployment configuration.
- [ ] **Step 3:** Configure CI with locked dependencies, test database, build, test, and artifact retention.
- [ ] **Step 4:** Deploy staging and run smoke checks against the deployed URL.
- [ ] **Step 5:** Execute a restore rehearsal and rollback rehearsal; capture exact evidence.
- [ ] **Step 6: Commit** `ci: add jt2j staging and release gates`.

### Task 12: Production launch and handoff

**Files:**
- Modify: `docs/operations/deployment.md`, `docs/qa/release-checklist.md`, `README.md`.
- Create: `docs/operations/handover.md`, `docs/content/editorial-guide.md`, `docs/content/content-approval-matrix.md`.

- [ ] **Step 1: Collect final approvals** for legal identity, contact routing, translations, brand assets, media rights, and publication claims.
- [ ] **Step 2: Run final production gates**: clean CI, staging smoke green, backup verified, rollback verified, admin roles verified, and human business acceptance recorded separately from technical checks.
- [ ] **Step 3:** Deploy production using the approved release procedure.
- [ ] **Step 4:** Run public smoke checks in FR and EN, submit a non-sensitive test lead through the mail sink or approved test path, and verify admin receipt/status handling.
- [ ] **Step 5:** Monitor the first release window and record any follow-up work without calling the release complete until all gates are evidenced.
- [ ] **Step 6: Commit** `docs: finalize jt2j launch and handoff documentation`.

## Definition of done

- The website is reachable on real locale-aware URLs and indexable pages expose correct metadata.
- All approved content is editable from the private admin panel without code changes.
- Drafts, translations, publication, versions, and roles behave as specified.
- Contact requests are validated, persisted according to policy, notified, and visible to authorised staff.
- CI, accessibility, end-to-end, build, smoke, backup, and rollback checks have all been executed successfully.
- Production legal and business approvals are documented separately from technical verification.
- The prototype remains available as a reference artifact; no prototype-only studio or demo claim is exposed publicly.

