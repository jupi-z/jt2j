# JT2J Faithful Prototype Public Site Design

## Intent

Transform the current Next.js public site into a faithful production implementation of the validated `JT2J_Prestige_Prototype.html`, preserving the approved French and English editorial content, page hierarchy, visual compositions, responsive behavior, and interaction patterns.

## Goals

- Reproduce the prototype's public routes in French and English.
- Preserve exact approved labels, headings, descriptions, CTA wording, service names, division names, values, coordinates, and footer content.
- Recreate page-specific compositions instead of using one generic page template.
- Keep the existing Payload, lead, security, accessibility, and CI foundations.
- Connect the validated contact interface to the existing secure lead workflow.
- Expose a private editorial back office for content, media, approvals, translations, leads, and SEO metadata.

## Non-goals

- Redesigning the brand or inventing new visual directions.
- Adding claims, services, prices, references, legal text, or operational capabilities absent from the prototype/source dossier.
- Turning the CMS into an unrestricted visual page builder.
- Introducing a staging environment; the release path is direct production with protected approvals, backups, rollback, and post-deploy smoke checks.

## Anti-goals

- Do not flatten the prototype into generic cards or generic hero sections.
- Do not paraphrase validated editorial text during the visual port.
- Do not publish draft or unapproved content.
- Do not claim production mail, backup restore, rollback, or business/legal acceptance without live evidence.

## Architecture

Use Next.js App Router and TypeScript for the public site. Keep Payload/Postgres as the editorial and lead system. Build dedicated presentation components for the home, company, expertise, services, approach, FAQ, contact, division detail, and service detail page families. The CMS provides typed content values; the presentation layer owns the approved composition and layout.

The prototype's embedded SVG compositions are retained as local assets. Public data remains published-only and bilingual. The back office is private and role-controlled; its publication checklist prevents incomplete translations or unapproved claims from becoming public.

## Approaches considered

1. Continue refining the current generic component layer. Rejected because it preserves the structural drift already identified and cannot reproduce the prototype's page-specific compositions cleanly.
2. Rebuild the public presentation layer faithfully while reusing the existing backend and security layer. Selected because it corrects the actual defect without discarding the production foundations already verified.
3. Serve the prototype HTML directly and progressively attach production APIs. Rejected because it would not provide real Next.js routes, server-side metadata, protected content, typed CMS integration, or maintainable production behavior.

## Constraints

- No sub-agents for this execution.
- No staging requirement.
- Existing repository branch and GitHub PR remain the review boundary.
- The original prototype file remains unchanged and is the visual/editorial reference.
- Every production claim must be backed by a fresh test or live evidence.

## Acceptance criteria

- All 19 public route families per locale render with the prototype's structure and content.
- Home, company, expertise, services, approach, FAQ, contact, division details, and service details match the reference at desktop and mobile viewports.
- Contact fields are styled, responsive, validated, and connected to the existing secure lead API.
- The private back office route is reachable only through authenticated Payload access and exposes the editorial/lead workflows documented for JT2J.
- Test, typecheck, lint, build, accessibility/route checks, and CI pass.
- GitHub contains the implementation commits and CI evidence; no changes are pushed to `main` automatically.
