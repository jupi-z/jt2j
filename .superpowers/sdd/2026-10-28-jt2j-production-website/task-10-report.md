# Task 10 report — JT2J release verification suite

Date: 2026-10-28
Scope: QA suite, Playwright configuration/fixtures, release checklist. No deployment performed.

## Delivered

- Added `tests/e2e/fixtures.ts` with locale/path inventory and shared public-shell assertions.
- Added `tests/e2e/navigation.spec.ts` for FR/EN route coverage, language switching, desktop/mobile navigation, search/filter, FAQ, 404, and anonymous admin access.
- Added `tests/e2e/locales.spec.ts` for landmarks, heading/label contracts, keyboard focus, and reduced motion.
- Added `tests/e2e/accessibility.spec.ts` with axe WCAG 2A/2AA checks, including contrast-sensitive rules, for FR and EN home pages.
- Added `tests/e2e/contact-release.spec.ts` for accepted contact-request confirmation; existing contact tests cover network error handling and safe field exposure.
- Extended `playwright.config.ts` with desktop, mobile, and reduced-motion projects plus failure artifacts.
- Added `docs/qa/release-checklist.md`.

## TDD evidence

The first E2E run was intentionally red. Initial failures included test-harness defects (missing `expect` import, promise assertion, overly specific accessible-name selector) and product/environment signals. The harness defects were corrected and the scenarios were rerun. The remaining search and FAQ failures are real: the local no-CMS path returns no approved content, so `/fr/services` has no searchbox and `/fr/faq` has no `details`. Draft seed content was not exposed to bypass the publication guard.

## Verification evidence

- `pnpm lint`: passed after fixture naming cleanup.
- `pnpm typecheck`: passed; Next route types generated successfully.
- `pnpm test`: passed — 19 test files, 171 tests.
- Targeted E2E command:
  `pnpm exec playwright test tests/e2e/locales.spec.ts tests/e2e/accessibility.spec.ts tests/e2e/contact.spec.ts tests/e2e/contact-release.spec.ts --project=desktop-chromium`
  Result: 8 passed in 38.6s.
- Earlier full desktop Task 10 run: 49 tests, 43 passed, 6 failed after harness corrections. Failures were the service search and FAQ scenarios plus the initial full-run instability around repeated dev-server navigation; no code fix was applied for the empty-content condition.

## Not completed / exact reservations

- `pnpm build` started `next build` and reached `Creating an optimized production build ...`; it was interrupted by the user before completion. There is no build exit status and it is not reported as passing.
- Full `pnpm e2e` was not rerun after the final harness cleanup because the user requested a time-bounded finish. Mobile and reduced-motion projects were not run as a complete matrix; reduced motion passed in the targeted desktop scenario.
- `pnpm audit` was not executed. `package.json` has no audit script; dependency audit remains a release gate to run in CI or via an approved command.
- Payload unit tests emit the local warning `No email adapter provided. Email will be written to console.` This is expected for the test environment and is not evidence of transactional delivery.
- No staging/production deployment, public smoke, backup/restore rehearsal, rollback rehearsal, credentials, legal approval, editorial approval, or human business acceptance was performed.

## Commit

The intended commit message is `test: complete jt2j release verification suite`.

## Fix round 1 — review findings

Date: 2026-10-29
Commit: follow-up QA fix commit `fix: complete jt2j task 10 QA review` (hash returned with the final worktree state).

### Implemented

- Added `src/queries/e2ePublicContent.ts`, an explicitly isolated browser fixture provider. It is enabled only by the Playwright launcher through `JT2J_E2E_FIXTURES=1`; normal local, staging, and production content loading remains CMS-backed or fail-closed. Fixture records are bilingual, published, publication-approved, SEO-shaped, and include approved legal evidence; the real Next routes, queries, and UI render them.
- Added `scripts/e2e-server.mjs` so the fixture environment is actually propagated on Windows and CI. Required browser projects remain Chromium desktop plus the iPhone 13 mobile device; no WebKit project is required or hidden behind a skip.
- Added `tests/e2e/responsive.spec.ts` for mobile-width service and contact layout checks.
- Expanded search and FAQ interaction coverage to FR and EN, including a real division select filter and result assertions.
- Expanded contact success and server-error coverage to FR and EN.
- Expanded axe checks to home, services, FAQ, and contact routes in both locales.
- Corrected `tests/routing/locale-routes.spec.ts`: contact pages require a form; non-contact public routes require no form.

### Exact verification evidence observed in this fix round

- `pnpm typecheck`: passed; `next typegen` and `tsc --noEmit` completed successfully.
- `pnpm lint`: passed; ESLint completed with `--max-warnings 0`.
- Targeted Playwright run was started with 111 tests on `--project=desktop-chromium`. It reached the browser suite and exposed two failures, both because the first fixture-environment implementation was not propagated: FR and EN service search timed out waiting for the searchbox. That implementation was then replaced by `scripts/e2e-server.mjs`.
- After that launcher change, the follow-up targeted Playwright command was intentionally interrupted at the user's request before producing a final exit status. The post-change green result is therefore not claimed.

### Explicit reservations

- Full `pnpm e2e` was not completed after the final launcher change; mobile Chromium and reduced-motion full-matrix results remain unverified in this fix round.
- `pnpm test`, `pnpm build`, and dependency audit were not rerun after the final fix because the user requested immediate finalization. The previous report's evidence/reservations remain in force: unit tests had passed at 19 files/171 tests, the build had been interrupted without an exit status, and audit had not been run.
- No test was skipped for WebKit or another unavailable external dependency. No deployment, public smoke, backup/restore rehearsal, rollback rehearsal, legal/editorial approval, or business acceptance was performed.
