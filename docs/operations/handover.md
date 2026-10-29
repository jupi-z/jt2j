# JT2J operational handover

## Handover status

This document is the operational handover package for the JT2J website. It
describes the controls implemented in this repository and the evidence still
required before a protected production launch. No staging environment is part
of this delivery model.

The following are **not claimed by this document**: a production deployment,
legal approval, editorial/content approval, business acceptance, real mail
delivery, a real backup restore, or a rollback rehearsal. Those items require
the named people, credentials, and environment evidence recorded in the launch
checklist.

## What is technically verified

- The repository defines authenticated admin users with the roles `admin`,
  `editor`, `publisher`, `translator`, and `sales`.
- Draft/public separation, localized publication checks, private lead fields,
  media rights fields, and published-only public reads are implemented and
  covered by the repository tests.
- Publication checks require complete FR/EN required copy, bilingual SEO when
  required, evidence-backed legal approval, and approved rights evidence for
  referenced media.
- The contact data model records locale, source page, consent, status,
  assignee, internal notes, and notification state. Lead access is limited to
  `sales` and `admin` users.
- CI runs locked installation, migrations twice, tests, typecheck, lint, a
  high-severity audit, and a production build. The recorded GitHub CI run
  `40909316877` passed those gates; this is repository/CI evidence, not a
  production health check.
- `pnpm smoke:public`, `pnpm backup:check`, and `pnpm rollback:check` exist.
  The latter two verify supplied, revision-bound artifacts in dry-run mode;
  they do not create backups, restore data, switch traffic, or roll back a
  release.
- The recorded fixture-backed QA evidence is 253/253 Playwright tests, 11/11
  reduced-motion tests, 20 Vitest files/181 tests, lint, typecheck, and build
  passing. The production audit still has one documented low-severity
  `deepmerge` advisory.

See [deployment.md](./deployment.md) and
[release-checklist.md](../qa/release-checklist.md) for the evidence boundary.

## Admin roles and responsibilities

| Role         | Repository capability                                           | Operational responsibility                                       |
| ------------ | --------------------------------------------------------------- | ---------------------------------------------------------------- |
| `admin`      | Provisions users, assigns roles, manages leads, and can publish | Owns access reviews, emergency access, and release authorization |
| `editor`     | Creates and edits editorial drafts                              | Prepares copy and metadata; cannot publish or approve claims     |
| `translator` | Edits localized draft content                                   | Maintains the approved FR/EN translation pair; cannot publish    |
| `publisher`  | Reviews publication checks and publishes approved content       | Confirms evidence is attached before publication                 |
| `sales`      | Reads/creates/updates leads and manages lead status             | Owns follow-up, assignment, and contact-request closure          |

Provision users through an administrator. Do not enable public self-registration.
Use individual accounts, least privilege, and an access review at onboarding,
after role changes, and when someone leaves.

## Publication workflow

1. An `editor` or `translator` creates or updates a draft in the private admin
   panel.
2. The author completes the French and English required fields. English is a
   maintained translation, not an automatic fallback.
3. The author attaches claim evidence, legal-review evidence where applicable,
   SEO fields, and media rights/credit evidence.
4. A `publisher` checks the [approval matrix](../content/content-approval-matrix.md)
   and the admin publication checklist.
5. The `publisher` records the human approval and publishes only after all
   required checks are complete.
6. The publisher verifies the public FR and EN route after release. Historical
   versions remain available to editorial users.

Changing approved copy invalidates the relevant approval. Do not restore a
global version directly; reapply historical content through a normal validated
draft update and repeat approval.

## Bilingual content handoff

French is the default locale. Every public record must have the required FR and
EN fields before publication. Keep slugs and route identity stable unless the
change has an explicit SEO decision. Never silently copy French into English,
publish a partial translation, or treat machine translation as editorial
approval.

The content owner supplies final copy; the translator confirms language quality;
the publisher confirms completeness; legal/leadership reviewers approve claims
that fall within their remit. These human decisions are not asserted by the
automated tests.

## Contact lead handling

The public form is validated server-side and records only the approved fields.
The receiving team must confirm the real destination address, privacy wording,
retention policy, and transactional provider before launch.

In the admin panel, use the following operational flow:

1. Review new leads and confirm the locale/source page.
2. Assign the lead to an authorized `sales` or `admin` user.
3. Move status from `new` to `assigned`, then `in-progress`, and finally
   `closed`; use `spam` only with an appropriate internal note.
4. Treat `pending` or `retry_pending` notification state as an operational
   exception. Do not duplicate the lead manually without checking the
   idempotency key and notification history.

The optional non-production smoke path uses an invalid test address and a
non-persisting test mode. It is not evidence of real mail delivery or customer
receipt, and it is not a staging release gate.

## Backup, restore, and rollback

Before production, the operator must obtain and record a provider-generated
database backup, media backup, release identifier, checksums, retention, and
storage location. The database and media set must match the revision being
released. The repository checker validates supplied artifacts but does not
perform the backup or restore.

For a restore rehearsal, use an isolated database/storage namespace, restore the
matching database and media, apply only approved migrations, verify FR/EN
published content, draft isolation, media references and lead privacy, then
record the evidence and destroy the rehearsal namespace according to policy.

For a release rollback, freeze writes, declare an incident/release record,
identify the previous release and matching data snapshot, use the
provider-specific traffic/release procedure, run health and FR/EN smoke checks,
and record the result. Migrations are forward-only in the workflow; a failed
migration does not trigger an automatic rollback. No restore or rollback
rehearsal has been performed for this handover.

Detailed provider-neutral procedures are in [backups.md](./backups.md) and
[deployment.md](./deployment.md).

## CI/CD usage

1. Open a pull request with the reviewed revision.
2. Require the reusable CI workflow to pass: frozen install, migrations twice,
   tests, typecheck, lint, high-severity audit, and build.
3. Record human content/legal approvals, verified backup artifacts, and the
   rollback plan before requesting production approval. Backup and rollback
   checks are isolated dry-run verification; they do not restore data or switch
   traffic.
4. Manually dispatch production for that exact revision in the protected
   environment. The workflow fails closed if required artifact evidence is
   absent, then runs forward-only migration and public smoke checks.

The current repository does not contain provider credentials or evidence that
the external production workflow has been run. The retained staging workflow
is deprecated and is not part of the delivery model.

## Secret rotation

Store secrets only in the host/GitHub environment secret manager. Keep
`PAYLOAD_SECRET` and `CSRF_SECRET` distinct. Rotate affected credentials
independently where possible: database, storage, mail provider, SSH/deploy
access, proxy identity, and administrator sessions.

For each rotation: create a new secret, update the dependent service through a
reviewed change, verify health and the authenticated workflow, verify the old
secret no longer works, revoke the old secret, and record owner/time/evidence.
Never paste secret values into tickets, logs, commits, or this handover.

## Incident response

Create an incident record with time, reporter, affected surface, release,
incident lead, and evidence links. Classify availability, unauthorized access,
data exposure, integrity, credential compromise, or public-mutation abuse.

Contain first: restrict access, disable compromised users, rotate exposed
credentials, rate-limit or temporarily disable an abused mutation, and preserve
logs/audit evidence without copying PII into chat or tickets. Recover using a
verified snapshot or release procedure in an isolated environment, then run
migrations, security checks, and smoke checks before traffic changes.

Close only after owners and timestamps exist for containment, recovery, impact
assessment, notification decisions, monitoring, root cause, and corrective
actions. Legal, privacy, contractual, and customer communications require the
responsible human approver.

## Launch checklist and sign-off record

The release is not launch-ready until every unchecked external gate in
[release-checklist.md](../qa/release-checklist.md) has evidence. Record:

| Decision                             | Owner                     | Evidence/link                            | Date | Status  |
| ------------------------------------ | ------------------------- | ---------------------------------------- | ---- | ------- |
| Legal identity and legal documents   | Human legal owner         | Approval record                          |      | Pending |
| FR/EN copy and claims                | Editorial owner           | Approved content/version IDs             |      | Pending |
| Brand assets and media rights        | Brand/legal owner         | Rights evidence                          |      | Pending |
| Contact routing and privacy wording  | Business/privacy owner    | Provider/test-path evidence              |      | Pending |
| Backup and restore rehearsal         | Operations/provider owner | Snapshot and rehearsal record            |      | Pending |
| Rollback rehearsal                   | Technical/provider owner  | Release/rollback record                  |      | Pending |
| Business acceptance                  | JT2J business owner       | Signed acceptance                        |      | Pending |
| Production deployment and monitoring | Release owner             | Protected workflow and monitoring record |      | Pending |
