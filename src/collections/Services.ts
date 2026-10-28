import type { CollectionConfig } from 'payload';
import {
  contentAccess,
  protectDraftQueries,
  stripPrivateContent,
  publishedServiceOnly,
} from '../access/publishedOnly';
import { privateField } from '../access/roles';
import { editorialFields, text } from './fields';
import {
  collectionPublication,
  captureCollectionApproval,
} from '../payload/publication';

export const Services: CollectionConfig = {
  slug: 'services',
  admin: { useAsTitle: 'title' },
  access: { ...contentAccess, read: publishedServiceOnly },
  versions: { drafts: true, maxPerDoc: 50 },
  hooks: {
    afterRead: [stripPrivateContent],
    beforeOperation: [captureCollectionApproval, protectDraftQueries],
    beforeChange: [collectionPublication('services')],
  },
  fields: [
    ...editorialFields(),
    {
      name: 'division',
      type: 'relationship',
      relationTo: 'divisions',
      required: true,
      index: true,
    },
    { name: 'catalogue', type: 'text', required: true },
    text('heading'),
    text('summary'),
    text('eyebrow'),
    text('cta'),
    {
      name: 'editorialNotes',
      type: 'textarea',
      localized: true,
      access: { read: privateField },
    },
  ],
};
