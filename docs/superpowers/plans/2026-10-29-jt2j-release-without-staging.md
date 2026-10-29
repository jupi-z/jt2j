# JT2J Release Without Staging Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (recommended) to implement this plan task-by-task.

**Goal:** Remove staging as a required environment from the JT2J production release design while preserving protected manual production deployment, backup/rollback verification, forward-only migrations, post-deploy smoke, and documented manual rollback.

**Architecture:** Keep the existing production workflow and dry-run artifact checkers, deleting only the staging-evidence gate and all staging prerequisites from the supported path. Retain the staging workflow as a clearly deprecated legacy artifact so existing references do not break, and align operational documentation, the release contract test, and Task 11 report with the decision that no staging environment is part of this delivery model.

**Tech Stack:** GitHub Actions YAML, Markdown runbooks/reports, Vitest contract tests, pnpm.

**Spec:** User request in this conversation; current release workflow, runbook, handover, incident response, QA checklist, README, Task 11 report, and release contract test.

## Global Constraints

- Production remains manually dispatched and protected by the `production` environment.
- Production must retain revision-bound backup and rollback-artifact materialization and dry-run verification.
- Production migrations remain forward-only; post-deploy public smoke remains required; rollback remains manual/provider-specific.
- No application source code changes are allowed.
- No production push or remote deployment is allowed.
- No supported release step may require `PRODUCTION_STAGING_EVIDENCE`, a staging environment, or staging smoke evidence.

## Review Focus

- Production workflow must not contain a staging evidence gate or staging secret reference; the contract test pins this.
- Backup and rollback artifact verification must remain before deployment; the existing materialization contract remains.
- Deprecated staging wording must not be presented as a mandatory release gate; docs/report assertions pin the supported model.
- Incident recovery must retain isolated verification without implying a staging environment; the incident-response text is reviewed by search and link checks.

### Task 1: Pin the no-staging release contract

**Files:**
- Modify: `tests/release/release-gates.test.ts`

- [x] Add assertions that production has no `PRODUCTION_STAGING_EVIDENCE`, no staging environment/evidence gate, and retains manual dispatch, protected production, artifact checks, forward-only migration, smoke, and manual rollback language.
- [x] Add assertions that the staging workflow is marked deprecated and the contract documents no staging environment in the delivery model.
- [x] Run the focused contract test and observe the expected failure against the current workflow/docs.

### Task 2: Update workflows and operational documentation

**Files:**
- Modify: `.github/workflows/deploy-production.yml`, `.github/workflows/deploy-staging.yml`
- Modify: `docs/operations/deployment.md`, `docs/operations/handover.md`, `docs/operations/incident-response.md`, `docs/qa/release-checklist.md`, `README.md`, `docs/content/content-approval-matrix.md`

- [x] Remove only the production staging-evidence step and staging-dependent secret requirements.
- [x] Mark the staging workflow deprecated without leaving it as a supported or mandatory release path.
- [x] Rewrite mandatory staging references as the supported production path plus isolated backup/rollback verification where applicable.
- [x] Run the focused contract test and verify it passes.

### Task 3: Align the report and verify the repository

**Files:**
- Modify: `task-11-report.md`

- [x] Add the decision and explain retaining the deprecated workflow; update current delivery claims and reservations.
- [x] Run focused/full tests, formatting, YAML/link checks, and inspect the final diff/Git state.
- [ ] Commit the validated changes without pushing.
