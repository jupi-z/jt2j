# Task 10 Fix Round 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the Task 10 release-verification suite executable and complete without weakening public-content, interaction, locale, or accessibility assertions.

**Architecture:** Keep required CI on installed Chromium projects only. Add an explicitly opt-in `JT2J_E2E_FIXTURES=1` public-content provider with bilingual, publication-shaped fixture records so the real Next routes and UI render deterministic services and FAQ data without exposing authoring seeds. Extend the browser suite for mobile layout, filter/search, FAQ, contact success/error, and representative axe checks, while correcting the route contract for contact pages.

**Tech Stack:** Next.js 16, React 19, Payload-shaped content queries, Playwright, axe-core, Vitest, pnpm.

**Spec:** `.superpowers/sdd/2026-10-28-jt2j-production-website/task-10-brief.md`

## Global Constraints

- Required CI must use Chromium; unavailable WebKit must not be a required project.
- Do not expose draft content or weaken publication assertions.
- Do not hide failures with skips except for explicitly unavailable external dependencies, and document any such skip.
- Run and record `pnpm e2e`, unit tests, typecheck, lint, build, and audit as practical.

## Review Focus

- Server-rendered public fixtures must include bilingual service, division, FAQ, and SEO-shaped data.
- Mobile layout assertions must run in the required Chromium mobile project.
- Search, division filtering, FAQ disclosure, and contact success/error must exercise the real UI in both locales where applicable.
- Accessibility must cover representative home, services, FAQ, and contact routes.
- Contact route assertions must require forms on contact pages and forbid them on non-contact public pages.

### Task 1: Deterministic public QA fixture provider

**Files:**
- Create: `src/queries/e2ePublicContent.ts`
- Modify: `src/queries/loadPublicContent.ts`
- Test: `tests/e2e/fixtures.ts`

- [ ] Add a failing browser assertion proving `/fr/services` and `/en/faq` render fixture content when the E2E environment flag is enabled.
- [ ] Run the focused browser test and observe the empty-content failure.
- [ ] Add the opt-in fixture provider and web-server environment flag; keep normal local/CMS behavior unchanged.
- [ ] Rerun the focused test and verify service and FAQ content render in both locales.

### Task 2: Complete interaction, responsive, locale, and accessibility coverage

**Files:**
- Create: `tests/e2e/responsive.spec.ts`
- Modify: `tests/e2e/navigation.spec.ts`, `tests/e2e/contact-release.spec.ts`, `tests/e2e/contact.spec.ts`, `tests/e2e/accessibility.spec.ts`, `tests/e2e/locales.spec.ts`, `playwright.config.ts`

- [ ] Add failing assertions for division filtering, bilingual search/FAQ/contact success/error, mobile layout, and representative axe routes.
- [ ] Run the focused tests and confirm each failure is an assertion or missing coverage, not a skipped test.
- [ ] Implement only the needed test harness/app behavior; retain strong assertions and add no required WebKit project.
- [ ] Run the focused Chromium matrix and verify it passes.

### Task 3: Correct route contract and release evidence

**Files:**
- Modify: `tests/routing/locale-routes.spec.ts`, `.superpowers/sdd/2026-10-28-jt2j-production-website/task-10-report.md`, `docs/qa/release-checklist.md`

- [ ] Make the route assertion require a contact form only on `/contact` and forbid forms elsewhere.
- [ ] Run all requested gates as practical and record exact exit/status/counts plus unresolved reservations.
- [ ] Commit with `test: complete jt2j release verification suite` or a follow-up fix commit.
