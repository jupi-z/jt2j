# JT2J release QA checklist

## Automated gates

- [x] `pnpm test` — exit 0; 19 files, 171 tests passed
- [x] `pnpm lint` — exit 0; ESLint completed with zero warnings
- [x] `pnpm typecheck` — exit 0; route type generation and `tsc --noEmit` completed
- [x] `pnpm build` — exit 0; 45 static pages generated and route optimization completed
- [ ] `pnpm audit --prod` — exit 1; one low `deepmerge` advisory across 6 paths, no patched version reported
- [ ] Full Playwright matrix — completed non-green: 253 scheduled, 180 passed, 73 failed in 6.1 minutes
- [ ] Desktop Playwright — two SEO tests timed out with `Request context disposed` under the full matrix
- [ ] Mobile Chromium Playwright — 71 failures attempted to launch missing `webkit-2370`; the current iPhone 13 descriptor binds this project to WebKit. WebKit is not an accepted project for this gate.
- [ ] Reduced-motion Playwright — included in the non-green full matrix; no standalone completion claim is made
- [ ] Narrow post-diagnosis mobile rerun — interrupted by the user after announcing 69 tests; no final count or exit code

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
- [x] Required mobile coverage uses Chromium/iPhone 13; WebKit is not required.
- [x] Search, division filter, FAQ, contact success/error, responsive, locale, and representative accessibility assertions expanded.
- [ ] Full post-fix `pnpm e2e`, `pnpm test`, `pnpm build`, and audit remain to be rerun; see the fix-round report for exact reservations.

## Final gate status — 2026-10-29

- The unit, lint, typecheck, and production build gates passed with the exact results above.
- The dependency audit and full Playwright matrix remain open. No release-green claim is made.
- The portable fixture launcher was used for Playwright. No WebKit test was intentionally run; the mobile project configuration defect must be corrected and rerun in a future QA-only change.
- The interrupted mobile rerun has no final result and must not be counted as passed.
