# JT2J Faithful Prototype Port Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. This plan is executed natively in the current worktree because the user explicitly requested no sub-agents.

**Goal:** Rebuild the JT2J public frontend as a faithful multi-page production port of the validated prototype while preserving the existing secure content and lead infrastructure.

**Architecture:** Keep Next.js App Router, typed Payload queries, and the existing security/CI layer. Replace generic public compositions with prototype-shaped page-family components and a dedicated prototype-aligned stylesheet. Keep content values in typed seed/CMS records and keep composition decisions in React components.

**Tech Stack:** Next.js 16, React, TypeScript, Payload CMS, Postgres, Vitest, Playwright, CSS, pnpm, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-10-30-prototype-faithful-public-site-design.md`

## Global Constraints

- The original prototype is the canonical visual and editorial reference.
- Public content is published-only and bilingual.
- No staging environment is required.
- No unverified production, legal, editorial, mail, backup, or rollback claims.
- No sub-agents are used for this execution.

## Review Focus

- Exact prototype wording and hierarchy: route content snapshots must assert the approved headings and labels.
- Desktop/mobile composition: Playwright screenshots must cover the home, contact, and representative detail pages.
- Responsive forms: contact fields must not overlap or fall back to browser-default styling.
- Navigation parity: header, footer, language links, pole/service links, filters, FAQ disclosure, and contextual CTAs must work.
- Publication safety: unpublished or incomplete translations must not render publicly.

### Task 1: Capture the prototype contract

**Files:**
- Create: `tests/prototype-contract.spec.ts`
- Modify: `docs/reference/` only if a missing reference asset is discovered

- [ ] Write failing route/content contract tests for the 19 public route families and the prototype's exact key labels.
- [ ] Run the focused contract tests and confirm they fail against the current generic presentation.
- [ ] Use the tests as the implementation contract for the next tasks.
- [ ] Commit the contract tests.

### Task 2: Rebuild the shared shell and home composition

**Files:**
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/components/home/HomePage.tsx`
- Modify: `src/components/public/Sections.tsx`
- Modify: `src/styles/globals.css`
- Modify: `src/styles/tokens.css`

- [ ] Implement the prototype header labels, brand lockup, dark/light states, quote CTA, locale switch, and pole mega-menu.
- [ ] Implement the home hero, CTA pair, abstract-art caption, five-pole bottom rail, intro locations, division visual/rows, services section, commitment/value treatment, and gold CTA band.
- [ ] Implement the complete prototype footer with slogan, coordinates, social label, explorer links, prototype state marker, language switch, and return-to-top control.
- [ ] Run the focused contract tests and typecheck.
- [ ] Commit the shared shell and home port.

### Task 3: Rebuild page-family compositions

**Files:**
- Modify: `src/components/public/PublicRouteContent.tsx`
- Modify: `src/components/divisions/DivisionsPage.tsx`
- Modify: `src/components/divisions/DivisionDetail.tsx`
- Modify: `src/components/services/ServicesPage.tsx`
- Modify: `src/components/services/ServiceDetail.tsx`
- Modify: `src/components/faq/FaqPage.tsx`
- Create or modify: focused page-family components under `src/components/public/`

- [ ] Port the prototype's company, expertise, approach, FAQ, division-detail, service-catalogue, and service-detail structures.
- [ ] Preserve prototype-specific headings and supporting labels instead of rendering raw CMS section names as the visual hierarchy.
- [ ] Keep all contextual links and CTA query parameters intact.
- [ ] Run route/content tests and focused unit tests.
- [ ] Commit the page-family port.

### Task 4: Rebuild the contact interface and production behavior

**Files:**
- Modify: `src/components/contact/ContactForm.tsx`
- Modify: `src/components/contact/LeadConfirmation.tsx`
- Modify: `src/styles/globals.css`
- Test: existing lead/security tests plus new contact rendering tests

- [ ] Recreate the prototype contact layout, contact details, demo/status panel, field grid, labels, errors, consent, and review dialog styling.
- [ ] Preserve the existing CSRF, rate-limit, validation, honeypot, retry, and notification behavior.
- [ ] Add regression coverage proving the rendered contact controls are labelled, responsive, and not browser-default.
- [ ] Run focused tests and verify the contact flow in the browser.
- [ ] Commit the contact port.

### Task 5: Complete the private back office surface

**Files:**
- Modify: `src/payload/config.ts`
- Modify: `src/collections/Pages.ts`, `Divisions.ts`, `Services.ts`, `FAQs.ts`, `Media.ts`, `Leads.ts`
- Modify: `src/admin/**`
- Modify: route wiring under `app/`

- [ ] Make the private Payload admin surface reachable through its authenticated route.
- [ ] Verify role-based editorial access, bilingual completeness, publication approval, media immutability, and lead status workflow.
- [ ] Add a concise admin smoke test that confirms unauthenticated access is denied and authorized editorial capabilities are present.
- [ ] Commit the back-office completion.

### Task 6: Visual and functional verification

**Files:**
- Modify: `tests/**` only for evidence-driven regressions
- Create: `docs/qa/prototype-parity-report.md`

- [ ] Run route/content tests, Vitest, typecheck, lint, build, audit, and Playwright.
- [ ] Capture prototype and production screenshots at matched desktop/mobile viewports for every page family.
- [ ] Record remaining differences, if any, with exact route and selector evidence.
- [ ] Fix regressions through a new failing test before code changes.
- [ ] Commit the evidence report.

### Task 7: GitHub delivery

- [ ] Confirm clean worktree and commit history.
- [ ] Push the feature branch to GitHub.
- [ ] Wait for push and PR CI checks.
- [ ] Inspect the PR status and report exact evidence without merging automatically.
