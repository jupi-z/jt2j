import { describe, expect, it } from 'vitest';
import { divisions } from '../../src/content/seed/divisions';
import { services } from '../../src/content/seed/services';
import {
  contactDivisionOptions,
  contactServiceOptions,
  getContactPrefill,
} from '../../src/components/contact/contactOptions';

describe('JT2J contact taxonomy and Figma handoff', () => {
  it('uses exactly the canonical division and service slugs from the CMS seed', () => {
    expect(contactDivisionOptions.map((item) => item.slug)).toEqual(divisions.map((item) => item.slug));
    expect(contactServiceOptions.map((item) => item.slug)).toEqual(services.map((item) => item.slug));
    for (const item of contactServiceOptions) {
      expect(contactDivisionOptions.some((division) => division.slug === item.division)).toBe(true);
      expect(services.find((service) => service.slug === item.slug)?.division).toBe(item.division);
    }
  });

  it('provides both French and English labels for every public option', () => {
    for (const option of [...contactDivisionOptions, ...contactServiceOptions]) {
      expect(option.label.fr.trim()).not.toBe('');
      expect(option.label.en.trim()).not.toBe('');
    }
  });

  it('prefills a known division and service without exposing unvalidated URL values', () => {
    expect(getContactPrefill('?division=hygiene-pest-control&service=cleaning')).toEqual({
      division: 'hygiene-pest-control',
      service: 'cleaning',
    });
    expect(getContactPrefill('?service=transport-logistics')).toEqual({
      division: 'logistics-tracking',
      service: 'transport-logistics',
    });
    expect(getContactPrefill('?division=security-biometrics&service=cleaning')).toEqual({
      division: 'hygiene-pest-control',
      service: 'cleaning',
    });
    expect(getContactPrefill('?division=%3Cscript%3E&service=invalid-service')).toEqual({
      division: '',
      service: '',
    });
  });
});
