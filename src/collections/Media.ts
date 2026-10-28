import path from 'node:path';
import type { CollectionConfig } from 'payload';
import {
  contentAccess,
  protectDraftQueries,
  stripPrivateContent,
} from '../access/publishedOnly';
import { publicationFields, text } from './fields';
import { immutableMedia } from '../payload/immutableMedia';
import {
  collectionPublication,
  captureCollectionApproval,
} from '../payload/publication';

export const Media: CollectionConfig = {
  slug: 'media',
  access: { ...contentAccess, delete: () => false },
  disableDuplicate: true,
  admin: {
    useAsTitle: 'alt',
    description:
      'Files are immutable. Upload a new media record to replace an asset, then update its content relationship. Metadata remains editable.',
  },
  versions: { drafts: true, maxPerDoc: 50 },
  // Deliberately outside public/: downloads must pass Payload's read access.
  upload: {
    staticDir: path.resolve(process.cwd(), '.media'),
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    filesRequiredOnCreate: true,
  },
  hooks: {
    afterRead: [stripPrivateContent],
    beforeOperation: [
      immutableMedia,
      captureCollectionApproval,
      protectDraftQueries,
    ],
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
