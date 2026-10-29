# JT2J release QA checklist

## Automated gates

- [x] `pnpm test` — exit 0; 19 files, 171 tests passed
- [x] `pnpm lint` — exit 0; ESLint completed with zero warnings
- [x] `pnpm typecheck` — exit 0; route type generation and `tsc --noEmit` completed
- [x] `pnpm build` — exit 0; 45 static pages generated and route optimization completed
- [ ] `pnpm audit --prod` — exit 1; one low `deepmerge` advisory across 6 paths, no patched version reported
- [x] Full fixture-backed Playwright matrix — `$env:JT2J_E2E_FIXTURES='1'; pnpm e2e`; exit 0; 253/253 passed in 8.6 minutes with one worker across desktop Chromium, mobile Chromium, and reduced-motion; no WebKit launched
- [x] Desktop Chromium Playwright — included in the full matrix; all scheduled tests passed
- [x] Mobile Chromium Playwright — `JT2J_E2E_FIXTURES=1 pnpm exec playwright test tests/e2e --project=mobile-chromium`; 69 tests passed in 3.1 minutes; Pixel 5 Chromium descriptor used, no WebKit launched
- [x] Reduced-motion Playwright — `$env:JT2J_E2E_FIXTURES='1'; pnpm exec playwright test tests/e2e --project=reduced-motion`; exit 0; 11/11 passed in 47.1 seconds
- [x] Targeted post-correction mobile rerun — 69 passed in 3.1 minutes, exit 0
- [x] Fresh short validation — `pnpm exec playwright test --list` exit 0 (253 tests / 9 files); targeted mobile navigation exit 0 (1 passed); targeted SEO exit 0 (5 passed)

## Coverage included in Task 10

- FR and EN public route inventory, locale document language, language switch, desktop and mobile navigation assertions.
- Services search/filter contract, FAQ disclosure contract, 404 behavior, and anonymous `/admin` protection.
- Contact form success, network error, field labels, honeypot non-exposure, and safe response content.
- Landmarks, single page heading, keyboard focus, axe WCAG 2A/2AA including contrast, and reduced-motion behavior.

## Release reservations

- Local runs without `DATABASE_URL` and `PAYLOAD_SECRET` intentionally fail closed to empty published content. Do not expose draft seed content just to make the search/FAQ checks pass.
- Contact success is browser-mocked; transactional email delivery, persistence, rate limiting, and admin receipt require a configured disposable integration environment.
- No staging or production deployment, backup, rollback, legal approval, content approval, or business acceptance was performed by Task 10.
- The Next.js development server reports its expected React `eval()` warning. This is not production evidence.

## Fix round 1 status

- [x] Isolated bilingual published-shaped browser fixtures and explicit fixture server launcher added.
- [x] Required mobile coverage uses Chromium/Pixel 5; WebKit is not required.
- [x] Search, division filter, FAQ, contact success/error, responsive, locale, and representative accessibility assertions expanded.
- [ ] Full post-fix `pnpm e2e`, `pnpm test`, `pnpm build`, and audit remain to be rerun; see the fix-round report for exact reservations.

## Final gate status — 2026-10-29

- The unit, lint, typecheck, and production build gates passed with the exact results above.
- The dependency audit and full Playwright matrix remain open. No release-green claim is made.
- The portable fixture launcher was used for Playwright. The mobile project now uses Pixel 5 Chromium; no WebKit test was intentionally run.
- The post-correction full matrix was interrupted and has no final result; only the targeted mobile result is counted as passed.
- The two historical SEO timeouts are documented as a concurrent `next dev` on-demand compilation/readiness issue. SEO assertions were preserved unchanged; all five SEO tests were observed passing under the serial harness before the full run was stopped.

## Short validation — 2026-10-29

- The fixture launcher was inspected: `scripts/e2e-server.mjs` starts Next through Node with `shell: false`, binds port 3100, and injects `JT2J_E2E_FIXTURES=1`.
- `playwright.config.ts` currently binds `mobile-chromium` to `devices['Pixel 5']`; no iPhone 13/WebKit project is configured.
- Fresh targeted results: mobile navigation 1 passed in 10.3 seconds; SEO 5 passed in 36.6 seconds. These are scoped checks only and do not claim full E2E completion.
- At that earlier short-validation point, the audit, reduced-motion standalone run, and complete post-fix Playwright matrix remained open; they are resolved or updated by the final continuation verification below. No release-green claim is made solely from the short validation.

## Final continuation verification — 2026-10-29

- Full fixture-backed matrix: `$env:JT2J_E2E_FIXTURES='1'; pnpm e2e` — exit 0; 253/253 passed in 8.6 minutes using one worker across desktop Chromium, mobile Chromium, and reduced-motion. No WebKit project was launched.
- Standalone reduced motion: `$env:JT2J_E2E_FIXTURES='1'; pnpm exec playwright test tests/e2e --project=reduced-motion` — exit 0; 11/11 passed in 47.1 seconds.
- `pnpm test` — exit 0; 20 files, 177 tests passed in 64.38 seconds.
- `pnpm lint` — exit 0; ESLint completed with zero warnings.
- `pnpm typecheck` — exit 0; route type generation and `tsc --noEmit` completed.
- `pnpm build` — exit 0; 45/45 static pages generated and route optimization completed.
- `pnpm audit --prod` — exit 1; one low-severity `deepmerge` advisory across 6 paths, no patched version reported. This remains the open automated release reservation.
- The full E2E result is fixture-backed and does not replace CMS/database, email delivery, deployment, backup/rollback, legal/editorial, or human business-acceptance evidence.
