import { describe, expect, it } from 'vitest';
import { adminOnly } from '../../src/access/roles';
import { publishedOnly } from '../../src/access/publishedOnly';
import { leadRequestSchema } from '../../src/lib/validation/leadSchema';

async function loadSecurityModule<T>(name: string): Promise<T | null> {
  try {
    return (await import(name)) as T;
  } catch {
    return null;
  }
}

describe('production security safeguards', () => {
  it('defines browser-hardening headers including CSP, HSTS, framing, referrer and permissions policy', async () => {
    const security = await loadSecurityModule<
      typeof import('../../src/lib/security/headers')
    >('../../src/lib/security/headers');
    expect(security).not.toBeNull();
    const headers = security!.securityHeaders({ production: true });
    expect(headers['content-security-policy']).toContain("default-src 'self'");
    expect(headers['strict-transport-security']).toContain('max-age=');
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['permissions-policy']).toContain('camera=()');
  });

  it('requires a valid signed CSRF token for a mutation', async () => {
    const security = await loadSecurityModule<
      typeof import('../../src/lib/security/csrf')
    >('../../src/lib/security/csrf');
    expect(security).not.toBeNull();
    const token = security!.createCsrfToken('a'.repeat(32), 'nonce-1');
    const request = new Request('https://example.test/api/leads', {
      method: 'POST',
      headers: {
        [security!.csrfHeaderName]: token,
        cookie: `${security!.csrfCookieName}=${token}`,
      },
    });
    expect(security!.validateCsrfRequest(request, 'a'.repeat(32))).toBe(true);
    expect(
      security!.validateCsrfRequest(
        new Request(request, {
          headers: { [security!.csrfHeaderName]: 'bad' },
        }),
        'a'.repeat(32),
      ),
    ).toBe(false);
  });

  it('limits repeated public mutations with a bounded rate limiter', async () => {
    const security = await loadSecurityModule<
      typeof import('../../src/lib/security/rateLimit')
    >('../../src/lib/security/rateLimit');
    expect(security).not.toBeNull();
    const limiter = security!.createMemoryRateLimiter({
      max: 2,
      windowMs: 1_000,
    });
    expect(limiter.consume('lead:client', 0)).toBe(false);
    expect(limiter.consume('lead:client', 1)).toBe(false);
    expect(limiter.consume('lead:client', 2)).toBe(true);
    expect(limiter.consume('lead:client', 1_001)).toBe(false);
  });

  it('rejects oversized JSON bodies before public mutation parsing', async () => {
    const security = await loadSecurityModule<
      typeof import('../../src/lib/security/inputLimits')
    >('../../src/lib/security/inputLimits');
    expect(security).not.toBeNull();
    const request = new Request('https://example.test/api/leads', {
      method: 'POST',
      body: JSON.stringify({ message: 'x'.repeat(100) }),
    });
    await expect(security!.readJsonWithLimit(request, 32)).rejects.toThrow(
      'REQUEST_BODY_TOO_LARGE',
    );
  });

  it('redacts PII, credentials and tokens from structured logs', async () => {
    const security = await loadSecurityModule<
      typeof import('../../src/lib/observability/logger')
    >('../../src/lib/observability/logger');
    expect(security).not.toBeNull();
    const output: string[] = [];
    const logger = security!.createLogger((line) => output.push(line));
    logger.info('lead.received', {
      email: 'aline@example.test',
      phone: '+243812345678',
      password: 'secret-password',
      token: 'bearer-token',
      nested: { message: 'private lead message' },
    });
    expect(output).toHaveLength(1);
    expect(output[0]).not.toContain('aline@example.test');
    expect(output[0]).not.toContain('secret-password');
    expect(output[0]).not.toContain('bearer-token');
    expect(output[0]).toContain('[REDACTED]');
  });

  it('rejects unsafe production environment configuration without exposing values', async () => {
    const security = await loadSecurityModule<
      typeof import('../../src/lib/security/environment')
    >('../../src/lib/security/environment');
    expect(security).not.toBeNull();
    expect(() =>
      security!.assertProductionEnvironment({
        NODE_ENV: 'production',
        SITE_URL: 'http://bad.test',
      }),
    ).toThrow(/SITE_URL|environment/i);
    expect(() =>
      security!.assertProductionEnvironment({
        NODE_ENV: 'production',
        SITE_URL: 'http://bad.test',
        PAYLOAD_SECRET: 'dont-log-this',
      }),
    ).not.toThrowError(/dont-log-this/);
  });

  it('keeps existing admin, draft and input-limit boundaries explicit', () => {
    expect(adminOnly({ req: { user: null } } as never)).toBe(false);
    expect(adminOnly({ req: { user: { role: 'editor' } } } as never)).toBe(
      false,
    );
    expect(adminOnly({ req: { user: { role: 'admin' } } } as never)).toBe(true);
    expect(publishedOnly({ req: { user: null } } as never)).toEqual({
      _status: { equals: 'published' },
      publicationApproved: { equals: true },
    });
    expect(leadRequestSchema.safeParse({ name: 'x'.repeat(121) }).success).toBe(
      false,
    );
  });
});
