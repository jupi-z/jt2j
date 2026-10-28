import type { CollectionConfig } from 'payload';
import { adminOnly, sales } from '../access/roles';

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: { useAsTitle: 'name' },
  access: { create: sales, read: sales, update: sales, delete: adminOnly },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'company', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
    { name: 'sourcePage', type: 'text', required: true },
    { name: 'locale', type: 'select', required: true, options: ['fr', 'en'] },
    { name: 'division', type: 'relationship', relationTo: 'divisions' },
    { name: 'service', type: 'relationship', relationTo: 'services' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      required: true,
      options: ['new', 'assigned', 'in-progress', 'closed', 'spam'],
    },
    {
      name: 'assignee',
      type: 'relationship',
      relationTo: 'users',
      filterOptions: { role: { in: ['admin', 'sales'] } },
    },
    { name: 'internalNotes', type: 'textarea' },
    {
      name: 'consent',
      type: 'group',
      fields: [
        {
          name: 'accepted',
          type: 'checkbox',
          required: true,
          validate: (v: unknown) => v === true || 'Consent must be accepted',
        },
        { name: 'policyVersion', type: 'text', required: true },
        { name: 'recordedAt', type: 'date', required: true },
      ],
    },
  ],
};
