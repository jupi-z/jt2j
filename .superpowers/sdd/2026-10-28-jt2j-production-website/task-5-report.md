# Task 5 implementation report

Status: COMPLETE. Implemented directly in the assigned production worktree.
No subagents or reviewers were spawned. Commit message:
`feat: add payload content model and access control`.

## Delivered

- Payload 3.92.1, matching PostgreSQL/S3 adapters, generated TypeScript types,
  generated initial migration/snapshot/index, and explicit migration/type/seed
  scripts. PostgreSQL schema push is disabled. CMS startup requires a database
  URL and a private secret of at least 32 characters; public builds need neither.
- Collections: Users, Pages, Divisions, Services, FAQs, Media, Leads and
  LegalDocuments. Globals: SiteSettings and Navigation. Canonical slugs are
  unique, content is ordered, services reference division IDs, and navigation
  paths derive from Task 4's route catalogue. No public rendering/contact endpoint
  or admin/REST mounting was added.
- Task 2's bilingual field schemas and claims are consumed by publication hooks.
  Canonical `status` maps to Payload `_status`; `locales` maps to
  `supportedLocales`, avoiding a Payload/PostgreSQL internal relation collision.
  Page values are stored as localized array rows. Section row IDs preserve both
  languages through sequential locale writes.
- French default and independent English translations, with fallback disabled.
  Private `translationIssues` exposes missing fields in the CMS. Publishing
  requires a complete bilingual record and approval/evidence for every claim.
  Copy, relationship and metadata changes invalidate approval unless the
  publisher explicitly approves the changed record in that submitted write.
- Admin-only provisioning/role changes; editorial draft access for editor and
  translator; publisher/admin approval/publication; sales/admin lead management.
  Self-service role escalation is denied. Payload's first-user registration
  bypass is blocked even when it invokes create with overrideAccess enabled.
- Public reads require published status and approval. Draft-query requests cannot
  reveal a newer collection draft; global guards reject private drafts even with
  selective fields. Public output strips claims, approval diagnostics, internal
  service notes and rights evidence. Version reads are editorial-only.
- Public service reads additionally require a published/approved parent division,
  so later parent unpublication withdraws the service. Publication validates
  division existence, published parent/media relations, legal-category approval,
  and category-specific feature gates.
- Versions/drafts on every editorial collection/global, with bounded history.
  Direct global restore is deliberately blocked: Payload 3's native operation
  writes directly to the database without beforeChange publication hooks.
  Historical content must be reapplied through a normal validated draft update.
  Collection publication hooks continue to apply to restored collection versions.
- Media supports JPEG/PNG/WebP/PDF, 10 MiB upload limits, bilingual alt text,
  caption, attribution/source, rights approval/evidence, and draft/version access.
  Local files live outside public/ in ignored `.media/`. Optional private
  S3-compatible storage retains Payload's download proxy; schema fields remain
  stable with the S3 plugin disabled.
- Leads retain source page/locale, division/service, sales assignee, workflow
  status, private notes and consent/version/time. Public creation is denied; the
  dedicated contact endpoint remains Task 7.
- Insert-only seed imports static canonical data, resolves division slugs,
  creates navigation from the route catalogue, and runs in one DB transaction.
  First run creates 25 content records plus two globals. All remain draft,
  unapproved, with pending claims and disabled feature flags. No accounts, leads,
  media, legal documents, leadership or reference records are fabricated.
  Subsequent runs skip existing records/globals, preserving IDs, human edits,
  approvals and version counts. Failed writes roll back the entire import.
- README and `.env.example` document setup, commands, mappings, access expectations
  and the boundaries for later implementers.

## Verification executed

Windows PowerShell, Node v24.21.0, pnpm 11.25.0, disposable PostgreSQL 17.

1. Authored access/localization/seed tests before configuration implementation.
   The initial runnable baseline failed to collect all three suites because
   `src/payload/config` did not exist. Earlier setup attempts failed on the missing
   helper/native build permission and PostgreSQL 18 initialization; none were
   represented as passing tests.
2. Generated Payload types and the initial migration with the CLI. Only generated
   import type annotations and unused destructured arguments were adjusted for
   Node's TypeScript loader and the repository's zero-warning ESLint policy.
3. Final `pnpm test`: **64 passed across six files**, including **19 Task 5
   integration tests**. The unchanged existing 45 tests also passed. Full log:
   `test-results/task5-final-tests.log` (ignored local evidence).
4. Integration tests migrated four separate disposable databases with push off;
   rerunning migrations was a no-op. Verified migration down/up on the fourth
   database, then reseeded it successfully. Mid-seed duplicate-key failure left
   zero pages/divisions/accounts. The seed rerun preserved human edits and history.
5. Verified independent translations, missing English blocking publication,
   evidenced claims, parent publication/depublication, unique database slugs,
   editor/translator/sales restrictions, role escalation, public draft/version/
   global privacy, private-field removal, lead isolation/consent, real PNG upload
   rights gating, restricted legal/contact feature flags, unsafe global restore
   rejection and first-user HTTP registration rejection.
6. Final `pnpm lint`: passed, zero warnings.
7. Final `pnpm build`: passed, including TypeScript and the existing 38 public
   static routes. An earlier standalone typecheck/build found an interface/index
   signature mismatch for global data; normalization through the existing object
   helper fixed it. The final production build's TypeScript phase passed.
8. Task files were formatted with Prettier. A final one-line type normalization
   caused a line-wrap warning; formatting was rerun before committing.
9. The embedded PostgreSQL helper runs in a separate child process so its
   async-exit hooks cannot mask Vitest's failure exit code. A deliberately failing
   integration run was observed returning exit code 1 after this isolation.

## Resolved integration findings

- PostgreSQL 18 embedded Windows initialization crashed with
  `child process was terminated by exception 0xC0000005`. PostgreSQL 17.10's
  embedded package initializes and passes all integration tests here. Docker's
  Linux daemon was unavailable, so no production database or Docker state changed.
- Payload mutates a supplied request's locale in nested Local API calls. All-locale
  reads in publication hooks now copy the request while retaining transaction and
  actor context, preventing accidental writes under locale `all`.
- Global version snapshots can omit their ID, so global validation always loads
  the complete current draft rather than treating an absent ID as a new record.
- BeforeChange can contain inherited approval values. Explicit approval intent
  is captured before the operation to prevent accidental reuse on changed copy.
- Separate Payload cache keys isolate each test database; otherwise the singleton
  can silently reuse the first database even when passed a different config.
- Empty arrays can be reconstructed after field access filtering. A final public
  projection removes private properties rather than relying solely on field ACLs.

## Concerns and handoff

- No PostgreSQL/Payload verification blocker remains. Production deployment,
  human factual/translation approval and business/legal acceptance are not claimed.
- Admin/REST routes, authenticated admin UI and operational account provisioning
  belong to Task 8. Bootstrap must use trusted tooling; no credentials are seeded.
- Direct global version restore is intentionally unavailable; Task 8 should offer
  reapplication of an old version through a validated draft update.
- No live S3 upload/download test was performed. Configure a private bucket or a
  persistent local media volume before deployment; do not expose `.media/` as an
  unrestricted static directory. HTTP download behavior must be exercised when
  the Payload endpoints are mounted.
- No transactional email adapter is configured. Payload emits its standard
  warning and would log email until a later task supplies the production adapter.
- PostgreSQL 17's embedded distribution is a dev-only beta-tagged wrapper. The
  Windows binary postinstall permission is explicit; other CI platforms must
  authorize their corresponding native package build step.
- Public Local API callers must set `overrideAccess: false`; trusted internal
  seed/migration operations intentionally use server-side access bypass.
- Seed is insert-only: content refreshes/renamed identities need an explicit
  reviewed migration rather than an automatic destructive reconciliation.
- Public browser/E2E tests were not rerun because public routes were unchanged;
  the production build verifies compilation/prerendering, not mounted CMS HTTP,
  storage-provider operations, editor acceptance or a production release.

Primary references consulted: Payload's official access-control, Local API,
drafts, PostgreSQL and storage-adapter documentation, plus the installed 3.92.1
operation implementations for request mutation, first-user registration and
global version restoration.
