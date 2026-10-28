import path from 'node:path';
import type { CollectionConfig } from 'payload';
import {
  contentAccess,
  protectDraftQueries,
  stripPrivateContent,
} from '../access/publishedOnly';
import { publicationFields, text } from './fields';
import {
  collectionPublication,
  captureCollectionApproval,
} from '../payload/publication';

export const Media: CollectionConfig = {
  slug: 'media',
  access: contentAccess,
  admin: { useAsTitle: 'alt' },
  versions: { drafts: true, maxPerDoc: 50 },
  // Deliberately outside public/: downloads must pass Payload's read access.
  upload: {
    staticDir: path.resolve(process.cwd(), '.media'),
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    filesRequiredOnCreate: true,
  },
  hooks: {
    afterRead: [stripPrivateContent],
    beforeOperation: [captureCollectionApproval, protectDraftQueries],
    beforeChange: [collectionPublication('media')],
  },
  fields: [
    text('alt'),
    text('caption', false),
    { name: 'credit', type: 'text', required: true },
    { name: 'source', type: 'text', required: true },
    {
      name: 'rightsStatus',
      type: 'select',
      defaultValue: 'pending',
      required: true,
      options: ['pending', 'approved'],
    },
    { name: 'rightsEvidence', type: 'textarea' },
    ...publicationFields(),
  ],
};
