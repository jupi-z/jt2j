import type { Field } from 'payload';
import { privateField } from '../access/roles';
import { TranslationStatus } from '../admin/components/TranslationStatus';
import { PublicationChecklist } from '../admin/components/PublicationChecklist';

export const text = (name: string, required = true): Field => ({
  name,
  type: 'text',
  localized: true,
  required,
  admin: { components: { afterInput: TranslationStatus as never } },
});
export const publicationFields = (): Field[] => [
  {
    name: 'publicationApproved',
    type: 'checkbox',
    defaultValue: false,
    access: { read: privateField },
    admin: {
      description:
        'Only a publisher or administrator may approve the complete bilingual record.',
      components: { afterInput: PublicationChecklist as never },
    },
  },
  {
    name: 'claims',
    type: 'array',
    access: { read: privateField },
    fields: [
      {
        name: 'category',
        type: 'select',
        required: true,
        options: [
          'institutional',
          'capability',
          'contact',
          'leadership',
          'reference',
          'legal',
        ],
      },
      { name: 'source', type: 'textarea', required: true },
      {
        name: 'status',
        type: 'select',
        required: true,
        defaultValue: 'pending',
        options: ['pending', 'approved'],
      },
      { name: 'approvedBy', type: 'text' },
      { name: 'evidence', type: 'textarea' },
    ],
  },
  {
    name: 'translationIssues',
    type: 'json',
    access: { read: privateField, create: () => false, update: () => false },
    admin: {
      readOnly: true,
      description:
        'Missing bilingual fields; publication remains blocked until resolved.',
    },
  },
];
export const identityFields = (): Field[] => [
  {
    name: 'slug',
    type: 'text',
    required: true,
    unique: true,
    index: true,
    validate: (value: unknown) =>
      (typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) ||
      'Use a canonical URL slug',
  },
  { name: 'order', type: 'number', required: true, min: 1, defaultValue: 1 },
  text('title'),
  text('lead'),
];
export const editorialFields = (): Field[] => [
  ...identityFields(),
  {
    name: 'sections',
    type: 'array',
    fields: [
      text('title'),
      { name: 'body', type: 'textarea', localized: true, required: true },
      text('link', false),
      text('eyebrow', false),
    ],
  },
  { name: 'meta', type: 'group', fields: [text('title'), text('description')] },
  { name: 'heroMedia', type: 'upload', relationTo: 'media' },
  ...publicationFields(),
];
