# JT2J Production Website Design

**Date:** 2026-10-28  
**Status:** Proposed design; implementation requires user approval.  
**Source prototype:** `JT2J_Prestige_Prototype.html`

## Intent

Transform the current autonomous JT2J presentation prototype into a production-grade bilingual institutional website for JT2J Company, with real public URLs, indexable pages, a secure editorial back office, and a controlled contact-request workflow.

The website must preserve the prototype's visual direction: navy/cream/gold palette, editorial typography, abstract SVG compositions, concise institutional language, five business divisions, seven services, French and English content, and direct conversion paths to contact JT2J.

## Current state

The prototype is a single self-contained HTML file. It already provides:

- a home page, company page, divisions catalogue, service catalogue, approach page, FAQ and contact page;
- five divisions and seven services;
- French/English switching through hash fragments;
- local service search and filtering;
- client-side contact validation and a review dialog;
- a local editorial studio that edits in-memory content and exports JSON;
- decorative SVG illustrations and basic accessibility affordances.

It deliberately does not provide production routing, persistence, authentication, server-side form processing, approved legal content, public SEO, or deployment infrastructure.

## Goals

- Deliver real URLs under `/fr` and `/en`.
- Make public content server-rendered or statically generated and indexable.
- Keep the public site fast, responsive, accessible, and visually faithful to the prototype.
- Allow authorised JT2J staff to manage bilingual content without editing code.
- Support drafts, preview, approval, publication, version history, and rollback.
- Store and process contact requests securely.
- Make all claims, legal information, contact details, references, and media explicitly reviewable before publication.
- Provide reproducible tests, staging validation, backups, and a rollback path.

## Non-goals for version 1

- No ERP, invoicing, inventory, accounting, or full CRM.
- No customer account area.
- No online payment or booking engine.
- No public user registration.
- No automatic publication of unverified claims or reference logos.
- No unnecessary microservices or separate frontend/backend repositories.

## Chosen approach

Build one TypeScript monolith using Next.js App Router and Payload CMS in the same repository. Use PostgreSQL for persistent data and an object-storage-compatible media provider for images and documents.

Use Next.js route segments for locale-aware URLs and server-rendered public pages. Use Payload for the private admin panel, authentication, role-based access control, localized fields, draft/publish workflow, media, versions, and API access. Use a dedicated server-side lead endpoint backed by database persistence and transactional email.

This approach keeps the public site, CMS, authentication, and business workflow in one deployable unit while retaining clear boundaries in the codebase.

## Proposed content model

- `Users`: authenticated admin, editor, publisher, translator, and sales users.
- `Pages`: home, company, divisions index, services index, approach, FAQ, contact, and legal pages.
- `Divisions`: five JT2J business divisions, localized titles, slugs, descriptions, CTAs, status, and ordering.
- `Services`: seven services, localized titles, slugs, summaries, detailed sections, notes, division relation, status, and ordering.
- `FAQs`: localized question/answer pairs with ordering and publication status.
- `Media`: approved logos, photos, illustrations, documents, alt text, and rights/credit metadata.
- `Leads`: contact requests, source page, locale, selected division/service, status, assignee, internal notes, timestamps, and consent record.
- `SiteSettings`: contact coordinates, social links, default SEO, branding, locales, and operational settings.
- `LegalDocuments`: legal notice, privacy policy, cookie policy, publication status, effective date, and approval metadata.

## Editorial rules

- French is the default locale; English is a separately maintained translation.
- Missing translations must be visible in the back office and must not silently publish incomplete pages.
- Claims about leadership, references, capabilities, partnerships, and legal identity require explicit approval before publication.
- The public site never exposes admin controls, drafts, internal notes, or unpublished media.
- The initial back office is a content and lead-management tool, not an ERP.

## Quality and release requirements

- TypeScript strict mode and locked dependencies.
- Automated unit, integration, accessibility, and end-to-end tests.
- Public smoke checks for every production route in both locales.
- Keyboard and reduced-motion verification.
- Database and media backup before production releases.
- Staging approval before production deployment.
- A documented rollback procedure tested before launch.

## Open decisions to confirm before implementation

- Final official logo and brand assets.
- Final legal identity, addresses, publication manager, and hosting details.
- Final destination and SLA for contact requests.
- Whether sales users need assignment/status management in version 1.
- Production hosting and transactional email provider.
- Approved French and English copy, photos, testimonials, references, and rights.

