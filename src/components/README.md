# Shared visual foundations

Import order is `tokens.css`, `typography.css`, then `globals.css` (already loaded
by the root layout). The fonts are the prototype's system Arial/Helvetica and
Georgia/Times stacks; no external font or invented brand asset is required.

The route/content layer resolves approved content, locale URLs and current-page
state, then passes plain serializable props to `Header` and `Footer`.
`NavigationLink.label` is the already localized display text; `href` is the full
destination. `LocaleLink.locale` derives from Task 2's typed locales. No content
records, routing helpers, contact details, legal links, or publication rules are
embedded in these components. Supply only approved links.

`Header` needs `home`, `links`, `locale`, `localeLinks` and translated `labels`.
Optional `mega`, `cta`, `brandLabel` and `theme` control the visual shell.
The consuming page must provide `<main id="main" tabIndex={-1}>`; when using
`mainId`, match that ID instead. The mobile dialog supplies modal semantics,
focus wrapping, Escape/close/navigation dismissal, focus restoration and scroll
locking; desktop resizing closes it. The mega navigation uses a disclosure
button with normal link tab order, Escape, outside-pointer and focus-leave
dismissal. No application-style menu roles or arrow-key-only navigation.

`Footer` renders supplied navigation groups, optional contact slot and language
switch, description/tagline and copyright; it adds no editorial content itself.
`Button` renders a native button by default (`type="button"`) or a real anchor
when `href` is supplied. Native disabled/submit behavior remains available.
`SectionHeading` accepts heading levels 1–3; choose the level from page context.

`AbstractArtwork` selects original prototype compositions under `public/assets/`.
Its default output is decorative. Supply `description` only for an approved
accessible description; the component then renders an SVG image with a unique
title ID. Official branding remains pending; the shared wordmark is the original
prototype's temporary typographic signature.

Run `pnpm test:ui` for DOM component tests and real Chromium keyboard, motion and
responsive tests. Install Chromium with `pnpm exec playwright install chromium`
if needed. The test-only fixture server binds `127.0.0.1:3101` and bundles real
components using esbuild; its copy and hash links are never public app routes.
Screenshots are written to ignored `test-results/`. The ordinary `pnpm test`
also includes the DOM tests. Browser tests are a separate explicit gate.
