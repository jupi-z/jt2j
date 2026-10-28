# JT2J backup and restore runbook

## Required backup set

Back up PostgreSQL content, Payload versions, media/object storage and the deployment configuration metadata. Keep secrets in the secret manager, not in the backup archive. Encrypt backups in transit and at rest.

Recommended policy: daily database backups, point-in-time/WAL retention where the provider supports it, and daily media synchronization. Retain at least 14 daily, 8 weekly and 12 monthly copies, with one copy in a separate failure domain. Adjust retention to the approved business/legal policy before production.

## Verification

Every backup job must report size, timestamp, source revision and checksum. Alert on missing, unexpectedly small or failed archives. Perform a restore rehearsal at least monthly and before a production release: restore into an isolated database/storage namespace, apply migrations to the target revision, verify bilingual published content, draft isolation, media references and lead privacy, then destroy the rehearsal namespace according to the retention policy.

## Restore outline

1. Declare the incident and freeze content writes.
2. Select the latest known-good database and matching media snapshot; record the exact identifiers.
3. Restore into an isolated target and run integrity checks before switching traffic.
4. Reapply only approved migrations, verify the health endpoint and authenticated admin access, then switch the application using the documented reversible release mechanism.
5. Reconcile leads received after the snapshot from the transactional provider or approved queue without exposing their contents in logs.
6. Record evidence, gaps and follow-up actions.

No restore or production deployment is claimed by this task; the runbook is an operational procedure to execute with provider-specific commands.
