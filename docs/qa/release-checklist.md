# JT2J release QA checklist

## Automated gates

- [x] `pnpm lint`
- [x] `pnpm typecheck`
- [x] `pnpm test` — 19 files, 171 tests passed
- [x] Targeted Playwright desktop run — 8 tests passed
- [ ] Full `pnpm e2e` — not green: service search and FAQ scenarios have no rendered content in the local no-CMS environment
- [ ] Mobile Playwright project — not run in the time-bounded validation window
- [ ] `pnpm build` — interrupted before completion; no success claim
- [ ] Dependency audit — not run; no audit script is defined in `package.json`

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
