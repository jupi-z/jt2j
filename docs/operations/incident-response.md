# JT2J incident response

## Triage

Create an incident record with start time, reporter, affected surface, current release, evidence links and incident lead. Preserve logs and provider audit events without copying PII into chat or tickets. Classify availability, unauthorized access, data exposure, integrity, credential compromise or abuse of public mutations.

## Containment

For suspected credential exposure, revoke and rotate the affected credential immediately: Payload secret, CSRF secret, database password, storage access key, mail provider key, proxy secret or administrator sessions. Disable compromised users and force re-authentication. If abuse is active, rate-limit or temporarily disable the affected mutation while keeping a safe response; document the decision and expected customer impact.

For suspected data exposure, restrict admin/API access, preserve relevant audit evidence, identify the smallest affected record set and involve the responsible legal/privacy contact. Do not delete evidence or silently rewrite logs.

## Recovery and rotation

Generate new random credentials in the secret manager, update the dependent service, deploy through the reviewed release path, verify health and authenticated workflows, then revoke the old credential. Rotate database, storage and mail credentials independently when possible. After rotation, check that old credentials fail and that logs contain no secret values.

Restore from the last verified backup only after recording the target snapshot and integrity checks. Re-run security, migration and smoke checks in staging or an isolated environment before traffic changes.

## Closure

Close only after containment, recovery, credential rotation, impact assessment, notification decisions and monitoring have owners and timestamps. Record root cause, timeline, evidence, missed detection, corrective actions and the next backup/restore rehearsal. Technical checks do not replace legal, contractual or human incident decisions.
