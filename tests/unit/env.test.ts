import { describe, expect, it } from 'vitest';
import { parseEnv } from '../../src/env';

describe('environment validation', () => {
  it('provides a local URL when no environment is configured', () => {
    expect(parseEnv({}).SITE_URL).toBe('http://localhost:3000');
  });

  it('accepts an explicit HTTPS site URL', () => {
    expect(parseEnv({ SITE_URL: 'https://example.com' }).SITE_URL).toBe(
      'https://example.com',
    );
  });

  it.each(['not-a-url', 'ftp://example.com', ''])(
    'rejects invalid site URL %j',
    (SITE_URL) => {
      expect(() => parseEnv({ SITE_URL })).toThrow();
    },
  );
});
