# Task 2 implementation report

Status: implemented; scoped to canonical content extraction, contracts, validation and tests. No subagents or reviewers were spawned. No application routes, rendering, CMS, database, external services or deployment were changed.

## Source and provenance

- The only extraction source is `docs/reference/JT2J_Prestige_Prototype.html`: its inert `application/json` block named `site-data` and the master brief embedded inside that block.
- The extractor parses JSON with `JSON.parse` and Zod. It never executes HTML, evaluates JavaScript, loads prototype rendering functions or reads the production runtime.
- Original and preserved HTML have the same SHA-256: `A2B3FE8655E41078E37C557CC682740ACB6462707888D4127688A5770053CA17`. Neither file was modified.
- Each seed includes a claim inventory with a pointer to its source and the embedded source document name. Pending source claims are preserved for editorial review rather than represented as approved facts.

## Files and interfaces

- `src/content/types.ts`: strict runtime schemas and inferred TypeScript contracts for `LocalizedText`, `PageSeed`, `DivisionSeed`, `ServiceSeed`, `FaqSeed`, `SiteSettingsSeed`, plus `ContentSeed` and claim metadata.
- `src/content/seed/pages.ts`: seven corporate pages, including translated sections, metadata and company values.
- `src/content/seed/divisions.ts`: five divisions, retaining prototype codes, slugs, order, titles, hero headings, leads, summaries, sections, CTAs and closing content.
- `src/content/seed/services.ts`: seven services, retaining titles, hero headings, leads, summaries, sections, metadata, CTAs and catalogue names. Each division relation uses its canonical slug rather than a database ID or array position.
- `src/content/seed/faq.ts`: six bilingual FAQ items. `title` means question and `lead` means full answer, avoiding duplicated fields.
- `src/content/seed/site-settings.ts`: localized brand and SEO copy, default French locale, FR/EN locales, contact coordinates and explicit feature flags. This additional seed module supplies the requested `SiteSettingsSeed` contract.
- `scripts/extract-prototype-content.ts`: offline extraction, deterministic module serialization, explicit `--write` regeneration and read-only `--check` drift verification.
- `scripts/validate-content.ts`: reusable `validateContent(unknown)` API returning issue paths/messages, plus a standalone CLI checking all canonical seeds.
- `tests/content/content-contract.test.ts`: contract, invalid-content, publication and extraction regression tests.
- `vitest.config.ts`: includes content tests in the normal workspace test suite, alongside existing unit tests.
- `tsconfig.json`: permits explicit `.ts` imports for authoring scripts run with Node's native TypeScript support.
- `.gitattributes`: pins generated seed modules to LF so deterministic byte checks also survive Windows Git checkouts with automatic CRLF conversion.

## Extraction decisions

1. Exactly five divisions: SEC, LOG, HYG, BIZ and TRV, in the reference order.
2. Exactly seven services, preserving the source relationships: four hygiene services, one travel service, one logistics service and one business/supply service. Security intentionally has no invented service.
3. Corporate page keys retain the reference identities. Canonical page slugs are `home`, `entreprise`, `poles`, `services`, `approche`, `contact` and `faq`. A later router can use the HOME key for the locale root; this task adds no URLs.
4. The FAQ introduction is empty in both source languages. Its canonical lead reuses its existing, separately translated FAQ meta description. This is the sole explicit content-field substitution; there is no French-to-English fallback or newly authored factual copy.
5. Optional section links/eyebrows are omitted only when both source language fields are blank or absent. A one-sided translation is rejected. Section, value and FAQ translation counts must match.
6. Service notes are retained under `editorialNotes`, separate from public copy. Some contain production restrictions, such as prohibiting invented tracking metrics or unsupported certifications. Future public queries must omit these internal fields.
7. Settings contact information comes from the embedded master brief's page-11 contact annex. No invented social URLs, addresses, legal identity, leadership profiles, reference logos or legal documents were added.
8. Presentation studio controls, demo labels, renderer functions and the full embedded instruction document are excluded from seed output.

## Publication and validation

- Every initial page, division, service, FAQ and settings record has `status: 'draft'`, `publicationApproved: false`, and a nonempty pending claim inventory.
- All six conditional features start disabled: leadership, references, legal, privacy, cookies and contact form.
- Validation rejects incorrect division/service counts, malformed/duplicate slugs, duplicate codes/page keys/order values, missing FR/EN fields, whitespace-only required text, missing required properties, unknown schema properties and invalid division relations.
- Required translated content includes nested section titles/bodies, metadata, values, CTAs, summaries, notes, questions and answers where those fields exist.
- Published content requires explicit publication approval. Approval cannot coexist with pending claims. An approved claim requires a nonempty reviewer and evidence record.
- Published services require a published parent division. Enabled conditional features require published, approved settings and evidenced approval in the relevant claim category.
- The validator permits pending claims in drafts so the unapproved reference can be safely seeded for editorial review.

## Verification evidence

Environment: Windows PowerShell, Node `v24.21.0`, pnpm `11.25.0`.

1. Wrote contract/extraction tests before implementation. `pnpm test tests/content/content-contract.test.ts` exited 1 because `src/content/seed/pages` did not exist. This is the expected missing-canonical-data baseline; no tests could collect until the seed modules existed.
2. Generated modules with `node scripts/extract-prototype-content.ts --write` successfully.
3. `pnpm test`: 35 tests passed across both test files, including the existing environment tests. Covers malformed input, missing translations, empty text, identities, relations, explicit flags, pending/evidenced claims, parent publication, inert extraction, source fidelity, deterministic regeneration and exact checked-in module bytes.
4. `node scripts/extract-prototype-content.ts --check`: passed; checked-in modules exactly match fresh deterministic extraction.
5. `node scripts/validate-content.ts`: passed; seven pages, five divisions, seven services and six FAQs remain valid drafts.
6. `pnpm lint`: passed with zero warnings.
7. `pnpm typecheck`: passed. An initial internal approval-helper parameter was too narrow for FAQ records; it was corrected to require only the shared publication properties, then the check passed.
8. `pnpm build`: passed; existing bootstrap routes built successfully.
9. Prettier check over `src/content`, `scripts`, `tests/content`, `vitest.config.ts` and `tsconfig.json`: passed.
10. `git diff --check`: passed. Windows LF-to-CRLF informational notices do not indicate source errors.

Browser/E2E, database/CMS integration, human translation review and deployment were not run: they are outside Task 2. The production build confirms compatibility with the current bootstrap, not delivery of future public pages.

## Commands for the next implementer

```powershell
pnpm test
node scripts/validate-content.ts
node scripts/extract-prototype-content.ts --check
```

Explicit regeneration, only when replacing the authoring snapshot is intended:

```powershell
node scripts/extract-prototype-content.ts --write
```

Regeneration resets the seed snapshot to source-derived drafts and pending approvals; it must not be used to overwrite later editorial approvals accidentally. Node 24 was verified; older supported Node 22 releases may require `--experimental-strip-types` for these native TypeScript CLI commands.

## Concerns and handoff boundaries

- JT2J must review factual scope, translations, contact coordinates and capability statements. Extraction is not legal/commercial verification, and the claim inventory records whole-record approval rather than using keyword heuristics to infer truth.
- The approval validator enforces explicit attestations and evidence fields; it cannot independently authenticate those attestations or establish authority. Later CMS access controls and publication hooks must call it and invalidate approval when copy changes.
- Future seed consumers should resolve division slugs to CMS IDs and import static seed modules/types, not the prototype or offline scripts. Future public queries must expose approved published fields only, excluding drafts, claims and editorial notes.
- No legal/leadership/reference content was invented to fill absent structured prototype records. Those modules and contact processing remain disabled.
- The task report is located in the ignored `.superpowers/sdd/` directory as requested and is explicitly staged for this task commit.

Commit message: `feat: define jt2j canonical content contracts`.
