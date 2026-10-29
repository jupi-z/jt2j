import type { CollectionConfig } from 'payload';
import {
  contentAccess,
  protectDraftQueries,
  stripPrivateContent,
} from '../access/publishedOnly';
import { editorialFields, text } from './fields';
import {
  collectionPublication,
  captureCollectionApproval,
} from '../payload/publication';

export const Divisions: CollectionConfig = {
  slug: 'divisions',
  admin: { useAsTitle: 'title' },
  access: contentAccess,
  versions: { drafts: true, maxPerDoc: 50 },
  hooks: {
    afterRead: [stripPrivateContent],
    beforeOperation: [captureCollectionApproval, protectDraftQueries],
    beforeChange: [collectionPublication('divisions')],
  },
  fields: [
    ...editorialFields(),
    { name: 'code', type: 'text', required: true, unique: true },
    text('heading'),
    text('summary'),
    text('cta'),
    { name: 'bottom', type: 'group', fields: [text('title'), text('body')] },
  ],
};
