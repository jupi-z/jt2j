import { APIError, type CollectionConfig } from 'payload';
import { adminOnly, adminField, hasRole, roles } from '../access/roles';
import { requireAuthenticatedAdmin } from '../admin/hooks/requireRole';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: { maxLoginAttempts: 5, lockTime: 600000 },
  admin: { useAsTitle: 'email' },
  hooks: {
    beforeOperation: [
      ({ args, operation, req }) => {
        // Payload's first-register endpoint bypasses collection create access.
        if (
          operation === 'create' &&
          req.payloadAPI !== 'local' &&
          !hasRole(req.user, ['admin'])
        )
          throw new APIError(
            'User provisioning requires an administrator',
            403,
          );
        return args;
      },
    ],
  },
  access: {
    admin: requireAuthenticatedAdmin,
    create: adminOnly,
    delete: adminOnly,
    read: ({ req }) =>
      hasRole(req.user, ['admin']) ||
      (req.user ? { id: { equals: req.user.id } } : false),
    update: ({ req }) =>
      hasRole(req.user, ['admin']) ||
      (req.user ? { id: { equals: req.user.id } } : false),
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [...roles],
      saveToJWT: true,
      access: { create: adminField, update: adminField },
    },
  ],
};
