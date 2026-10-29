# JT2J security operations

## Runtime baseline

- Run only behind HTTPS. `SITE_URL` must use `https://` in production.
- Keep `/admin`, Payload APIs, media storage, database connections and mail credentials private. Public content is limited to approved published records; drafts and internal lead fields are not public data.
- `next.config.ts` emits CSP, HSTS (production only), `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Content-Type-Options` and COOP. Review CSP whenever a new third-party origin is introduced; do not add wildcard origins.
- Public POST mutations use server-side Zod limits, a 16 KiB JSON body limit, a signed double-submit CSRF token and the same five-per-15-minute rate-limit policy used by contact leads. Trusted proxy identity is allowed only when the proxy strips and replaces the configured header.
- Logs are structured and redact credentials, tokens, cookies, authorization values, and contact PII. Never log request bodies, headers, environment values or full provider errors.

## Secrets and production checks

Set `DATABASE_URL`, `PAYLOAD_SECRET`, `CSRF_SECRET`, `SITE_URL`, mail settings and private storage settings through the host secret manager. `PAYLOAD_SECRET` and `CSRF_SECRET` must be different random values of at least 32 characters. Do not commit `.env` files, credentials, tokens, database dumps or media exports.

Before approving a release, run the repository security tests, dependency audit, lint, typecheck and build. This is a local/repository checklist; it is not evidence that a real deployment is healthy.

## Access review

Review admin users and roles monthly and after staff changes. Admin provisions accounts and roles; editors/translators cannot publish or approve claims; sales can handle leads but cannot edit content. Disable departed accounts before rotating shared credentials.
