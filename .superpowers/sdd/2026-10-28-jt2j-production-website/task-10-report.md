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

## Fix round 2 — scoped review findings

Date: 2026-10-29

### Implemented

- Replaced the Windows-incompatible `spawn('pnpm.cmd', ...)` launcher with a portable direct Next CLI launch through `process.execPath`, `process.platform`, and explicit `shell: false`. The fixture environment remains set only by this launcher.
- Replaced the partial browser fixture catalog with the canonical bilingual seed projection: all 5 divisions, all 7 services, all published/approved, with approved legal evidence and complete SEO/copy fields. The public query publication guards remain active.
- Updated navigation tests to use locale-specific search terms and labels, clear search before division filtering, and assert exact visible result counts/cards.
- Updated FR and EN contact server-error tests to assert the exact localized alert text.

### Exact verification evidence observed

- Reproduction before the fix: `JT2J_E2E_FIXTURES=1 pnpm exec playwright test tests/e2e/navigation.spec.ts tests/e2e/contact.spec.ts --project=desktop-chromium` failed before the browser run with `Error: spawn EINVAL` at `scripts/e2e-server.mjs:4:15`.
- `pnpm typecheck`: passed; `next typegen` reported `Types generated successfully` and `tsc --noEmit` completed successfully.
- Post-fix targeted command: `JT2J_E2E_FIXTURES=1 pnpm exec playwright test tests/e2e/navigation.spec.ts tests/e2e/contact.spec.ts --project=desktop-chromium` — **50 passed (2.8m)**, exit code 0.
- Full command `JT2J_E2E_FIXTURES=1 pnpm e2e` was started, reached the Playwright web server startup, and was then intentionally interrupted by the user before completion. It has no final test count or exit status and is not claimed as passing; the lingering Node process was stopped.

### Remaining reservations

- Because the user requested immediate finalization after stopping the long E2E run, `pnpm lint`, `pnpm test`, `pnpm build`, dependency audit, and the complete mobile/reduced-motion E2E matrix were not rerun in this round. The targeted desktop Chromium evidence above is fresh; no status is inferred for the skipped gates.
- No deployment, public smoke, backup/restore rehearsal, rollback rehearsal, legal/editorial approval, or business acceptance was performed.

## Commit

Round 2 commit: `fix: complete jt2j task 10 QA review round 2`.

## Final gate verification — 2026-10-29

Scope: final QA gates and documentation only. No application behavior was changed.

### Executed gates

- `pnpm test`: exit 0 — 19 test files passed, 171 tests passed. The expected local Payload warning about no email adapter was emitted.
- `pnpm lint`: exit 0 — ESLint completed with `--max-warnings 0`.
- `pnpm typecheck`: exit 0 — Next route types generated successfully and `tsc --noEmit` completed.
- `pnpm build`: exit 0 — production build completed, 45 static pages generated, and route optimization completed.
- `pnpm audit --prod`: exit 1 — one low-severity `deepmerge` advisory was reported across 6 dependency paths; no patched version was reported.
- Full Playwright command: `JT2J_E2E_FIXTURES=1 pnpm exec playwright test --project=desktop-chromium --project=mobile-chromium --project=reduced-motion`.
  - Completed in 6.1 minutes with 253 tests scheduled, 180 passed, and 73 failed.
  - Two desktop SEO tests timed out while requesting the dev server and ended with `Request context disposed`.
  - The mobile project attempted to launch `C:\Users\MonarQue\AppData\Local\ms-playwright\webkit-2370\Playwright.exe`, which is absent. This is a QA configuration/environment defect: the `iPhone 13` descriptor currently binds the project to WebKit although the required project is named `mobile-chromium` and WebKit is out of scope.
  - The reduced-motion project ran as part of this command; no separate completion claim is made for the overall matrix because the command was non-green.

### Interrupted follow-up

After diagnosing the mobile project binding, a narrow rerun was started with `JT2J_E2E_FIXTURES=1 pnpm exec playwright test tests/e2e --project=mobile-chromium`. It announced 69 tests and produced passing output for early tests, but it was intentionally stopped at the user's request before a final summary and exit code. It is not reported as passed. The temporary configuration experiment was reverted; no Playwright configuration change is included in this documentation commit.

### Final reservations

- The final verification is not a release-green result: the dependency audit is open, the full Playwright matrix is non-green, and the post-diagnosis mobile rerun is incomplete.
- No WebKit test is claimed as run or required. The mobile project binding must be corrected in a future QA-only change and rerun before release.
- No deployment, public smoke, backup/restore rehearsal, rollback rehearsal, legal/editorial approval, or human business acceptance was performed.
