import type { Access, FieldAccess } from 'payload';

export const roles = [
  'admin',
  'editor',
  'publisher',
  'translator',
  'sales',
] as const;
export type Role = (typeof roles)[number];
type Actor = { role?: string | null } | null | undefined;
export const hasRole = (user: Actor, allowed: readonly Role[]) =>
  !!user?.role && allowed.includes(user.role as Role);
export const isEditorial = (user: Actor) =>
  hasRole(user, ['admin', 'editor', 'publisher', 'translator']);
export const canPublish = (user: Actor) =>
  hasRole(user, ['admin', 'publisher']);
export const adminOnly: Access = ({ req }) => hasRole(req.user, ['admin']);
export const editorial: Access = ({ req }) => isEditorial(req.user);
export const publishers: Access = ({ req }) => canPublish(req.user);
export const sales: Access = ({ req }) => hasRole(req.user, ['admin', 'sales']);
export const privateField: FieldAccess = ({ req }) => isEditorial(req.user);
export const publisherField: FieldAccess = ({ req }) => canPublish(req.user);
export const adminField: FieldAccess = ({ req }) =>
  hasRole(req.user, ['admin']);
