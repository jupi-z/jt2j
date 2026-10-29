import { describe, expect, it } from 'vitest';
import { Leads } from '../../src/collections/Leads';
import { Pages } from '../../src/collections/Pages';
import {
  canManageLeads,
  canManageUsers,
  canPublishContent,
  canTranslateContent,
  requireAuthenticatedAdmin,
  requireRole,
} from '../../src/admin/hooks/requireRole';

const requestFor = (role?: string) =>
  ({ user: role ? { id: 1, role } : null }) as never;

describe('editorial back office role policy', () => {
  it.each([
    ['admin', true, true, true, true],
    ['editor', false, false, false, true],
    ['publisher', false, true, false, true],
    ['translator', false, false, false, true],
    ['sales', false, false, true, false],
  ])(
    'maps %s to user, publish, lead and translation capabilities',
    (role, users, publish, leads, translate) => {
      expect(canManageUsers({ role })).toBe(users);
      expect(canPublishContent({ role })).toBe(publish);
      expect(canManageLeads({ role })).toBe(leads);
      expect(canTranslateContent({ role })).toBe(translate);
    },
  );

  it('requires an authenticated admin role for the Payload admin panel', () => {
    expect(requireAuthenticatedAdmin({ req: requestFor() })).toBe(false);
    expect(requireAuthenticatedAdmin({ req: requestFor('editor') })).toBe(true);
    expect(requireAuthenticatedAdmin({ req: requestFor('admin') })).toBe(true);
  });

  it('exposes reusable authenticated role guards', () => {
    const publisherOnly = requireRole('publisher', 'admin');
    expect(publisherOnly({ req: requestFor('translator') })).toBe(false);
    expect(publisherOnly({ req: requestFor('publisher') })).toBe(true);
  });

  it('keeps content and lead collection permissions separated by role', () => {
    const pageAccess = Pages.access as unknown as Record<
      string,
      (args: { req: unknown }) => unknown
    >;
    const leadAccess = Leads.access as unknown as Record<
      string,
      (args: { req: unknown }) => unknown
    >;

    expect(pageAccess.update({ req: requestFor('translator') })).toBe(true);
    expect(pageAccess.delete({ req: requestFor('translator') })).toBe(false);
    expect(leadAccess.read({ req: requestFor('sales') })).toBe(true);
    expect(leadAccess.read({ req: requestFor('editor') })).toBe(false);
    expect(leadAccess.update({ req: requestFor('admin') })).toBe(true);
  });
});
