import type { Access, PayloadRequest } from 'payload';
import {
  canPublish,
  hasRole,
  type Role,
  roles,
} from '../../access/roles';

type AdminActor = { id?: number | string; role?: string | null } | null | undefined;

export const canManageUsers = (user: AdminActor) => hasRole(user, ['admin']);
export const canPublishContent = (user: AdminActor) => canPublish(user);
export const canManageLeads = (user: AdminActor) =>
  hasRole(user, ['admin', 'sales']);
export const canTranslateContent = (user: AdminActor) =>
  hasRole(user, ['admin', 'editor', 'publisher', 'translator']);

export const requireRole = (...allowed: readonly Role[]): Access => ({ req }) =>
  hasRole(req.user, allowed);

/** Payload admin access: a valid session and one of the configured staff roles. */
export const requireAuthenticatedAdmin = ({ req }: { req: PayloadRequest }) =>
  Boolean(req.user?.id) && hasRole(req.user, roles);

export const requirePublisher = requireRole('admin', 'publisher');
export const requireLeadManager = requireRole('admin', 'sales');
