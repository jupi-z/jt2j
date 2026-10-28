import { describe, expect, it } from 'vitest';
import { leadRequestSchema } from '../../src/lib/validation/leadSchema';

const validRequest = {
  name: '  Aline Kabeya  ',
  email: 'ALINE@EXAMPLE.TEST',
  phone: '+243 812 345 678',
  company: 'JT2J Client',
  message: 'Nous souhaitons échanger sur vos services.',
  locale: 'fr',
  sourcePage: '/fr/contact?source=home',
  division: 'logistique-et-suivi',
  service: 'transport-logistics',
  consent: true,
  website: '',
};

describe('leadRequestSchema', () => {
  it('accepts approved lead fields and normalizes user input', () => {
    const result = leadRequestSchema.safeParse(validRequest);

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.name).toBe('Aline Kabeya');
    expect(result.data.email).toBe('aline@example.test');
    expect(result.data.phone).toBe('+243 812 345 678');
    expect(result.data.website).toBe('');
  });

  it('rejects missing required fields and unaccepted consent', () => {
    const result = leadRequestSchema.safeParse({
      ...validRequest,
      name: '',
      email: '',
      message: '',
      consent: false,
    });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.issues.map((issue) => issue.path.join('.'))).toEqual(
      expect.arrayContaining(['name', 'email', 'message', 'consent']),
    );
  });

  it('rejects malformed email, phone, locale and external source pages', () => {
    const result = leadRequestSchema.safeParse({
      ...validRequest,
      email: 'not-an-email',
      phone: 'call me maybe',
      locale: 'de',
      sourcePage: 'https://evil.example',
    });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.issues.map((issue) => issue.path.join('.'))).toEqual(
      expect.arrayContaining(['email', 'phone', 'locale', 'sourcePage']),
    );
  });

  it('rejects oversized content and preserves the honeypot as a non-public field', () => {
    const result = leadRequestSchema.safeParse({
      ...validRequest,
      message: 'x'.repeat(5001),
      website: 'https://bot.example',
    });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.issues.some((issue) => issue.path[0] === 'message')).toBe(
      true,
    );
  });
});
