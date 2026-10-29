# Task 4 implementation report

Status: COMPLETE. Implemented directly in the assigned production worktree.
No subagents or reviewers were spawned. Commit message:
`feat: add bilingual public route architecture`.

## Delivered

- `next-intl` 4.14.9 configuration, Next.js plugin, server request configuration,
  and independent French/English dictionaries. Locale types derive from Task 2.
- `/` redirects deterministically to `/fr`; `/fr` and `/en` each expose home,
  entreprise, poles, services, approche, faq, contact, five canonical division
  slugs, and seven canonical service slugs: **38 public URLs**.
- Typed asynchronous route params and `generateStaticParams` for locales and
  detail slugs. Production build prerenders all 38 URLs as static HTML.
- Locale root layout owns the document language and Task 3 styles. The shared
  server-rendered skeleton supplies translated serializable props to Task 3's
  Header/Footer, current navigation, detail-preserving language switches,
  index-to-detail links, and a focusable skip-link target.
- The route catalogue consumes only Task 2 page keys/slugs and division codes/
  slugs. Draft leads, descriptions, capabilities, claims, contact coordinates,
  and editorial notes are not rendered. Body and metadata use neutral dictionary
  copy. No CMS queries, contact processing, or full business content was added.
- Unique route titles/descriptions, absolute canonical URLs, reciprocal FR/EN
  and x-default hreflang, Open Graph locale/URL/image, and Twitter large cards.
  Every URL derives from the configured `SITE_URL` origin; tracking queries and
  forwarded hosts cannot change canonical/social URLs.
- Sitemap lists all 38 architectural routes with reciprocal language links.
  Robots permits crawling while excluding `/admin`, `/api`, and `/_next/`.
  Skeleton metadata deliberately remains `noindex, follow` pending approval.
- Root OG-image convention generates a real 1200x630 PNG using the shared visual
  palette and neutral JT2J wordmark; no external fonts/assets or generated brand
  claim were added.
- Root/localized not-found components and a localized full-document global 404
  with noindex, no canonical, and an appropriate locale home link. Unknown locales,
  slugs, paths, assets, and the not-yet-implemented admin route return HTTP 404.
- Proxy matcher handles only `/` and the two public locale prefixes. Private
  endpoints, assets, robots, sitemap, and image requests bypass negotiation.
- Routing/SEO tests are included in ordinary `pnpm e2e`; the same configuration
  supports production testing through `PLAYWRIGHT_PRODUCTION=1`. README documents
  setup, build-time origin configuration, route ownership, and future integration.

## Verification executed

Environment: Windows PowerShell, Node v24.21.0, pnpm 11.25.0, Chromium.

1. Tests were authored first. Initial focused routing/SEO run stopped after two
   expected failures: `/fr` returned 404 instead of 200, because routes did not
   exist. The remaining initial tests were not claimed as executed.
2. `pnpm install --frozen-lockfile`: passed after recording explicit false build
   permissions for optional `@parcel/watcher` and `@swc/core` dependencies added
   by next-intl. Existing esbuild/resolver permissions remain in place.
3. Final `pnpm test`: **45 passed**, covering environment, canonical contracts,
   and shared shell DOM behavior.
4. Final `pnpm lint`: passed, zero ESLint warnings. `pnpm typecheck`: passed.
5. Final build with `SITE_URL=https://jt2j.example`: passed; **38 public routes
   statically prerendered**, plus metadata endpoints and dynamic global 404.
6. Final production `pnpm e2e --workers 2`, with the same SITE_URL and
   `PLAYWRIGHT_PRODUCTION=1`: **54 passed** (52 routing/SEO + 2 existing smoke
   tests). Covers every named and dynamic route in both languages; HTTP/document
   language; shared shell; translated detail switching; active navigation;
   skip-link focus; localized HTTP 404 responses; private/asset bypass; unique
   metadata; canonical/hreflang/social tags in actual HTML; forwarded-host/query
   resistance; all sitemap entries; robots; and actual OG PNG dimensions.
7. `pnpm exec playwright test --config playwright.ui.config.ts`: **7 passed**,
   including responsive shell, keyboard/focus, mobile menu, and reduced motion.
8. Inspected all **38 generated public HTML documents**: correct FR/EN document
   language, custom-origin canonical URLs, and no localhost social-image URL.
   The framework's separate `_global-error.html` artifact was excluded from the
   public-document inventory.
9. Targeted Prettier check over all task code/config/tests/README: passed.
   `git diff --check`: passed. Git's CRLF notices are informational.

## Resolved integration failures

- Initial typecheck/build encountered stale `.next/dev/types/validator.ts`
  references to removed bootstrap `app/page.js` and `app/layout.js` (TS2307 and
  TS2344). The generated cache was moved to `.next/task4-old-dev-cache`, outside
  the generated type include paths, then build/typecheck passed. Moving it first
  under test-results still matched the project's TypeScript glob, so that location
  was corrected. No compiler source-check suppression was introduced.
- An initial production run passed the valid-route/SEO checks but failed the
  localized 404 HTML assertions: `Expected: "fr" / Received: ""` (likewise en).
  HTTP status was 404, but Next.js rendered `<html id="__next_error__">` and put
  the actual error UI only in the RSC payload. The same behavior is documented
  upstream at https://github.com/vercel/next.js/issues/99793 and
  https://github.com/vercel/next.js/issues/99287.
- Known locale/detail params now use `dynamicParams = false`; unknown paths are
  handled by experimental `global-not-found` at routing level. Its request header
  locale is limited to fr/en. This yields actual localized HTML and HTTP 404,
  while preserving static public pages. All six 404 checks and the final complete
  suite passed. A header-reading root not-found experiment made public pages
  dynamic and was removed; request-time headers are confined to the global 404.

## Concerns and handoff

- No task blocker remains. No deployment, CMS integration, factual approval,
  human translation acceptance, or production-readiness sign-off is claimed.
- All pages are intentionally skeletons and noindex. Before public release,
  replace catalogue-only routing/sitemap consumers with approved public content,
  revise the indexing policy, and build with the real HTTPS SITE_URL.
- `experimental.globalNotFound` is enabled because locale roots and the observed
  upstream page-level notFound bug require a robust document-level fallback.
  Revisit the closed param inventory and 404 strategy when adding CMS routes or
  upgrading Next.js. Localized segment not-found components remain available,
  but CMS query-time notFound calls must be retested against the framework bug.
- Next.js emits this nonfatal build warning twice while resolving root file-based
  image metadata before the nested locale metadata is applied:
  `metadataBase property in metadata export is not set for resolving social open graph or twitter images, using "http://localhost:3000".`
  Actual public HTML, image URLs, canonical links, sitemap and hreflang were
  verified against https://jt2j.example. This warning is recorded, not presented
  as a warning-free build. Playwright also emits the environment's existing
  NO_COLOR/FORCE_COLOR notice.
- Browser verification used Chromium only. No CI result or external service
  availability is inferred from these local checks.
- The requested report directory is ignored; this report is explicitly staged
  with the task commit.
