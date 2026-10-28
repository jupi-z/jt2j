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

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'translationIssues'],
  },
  access: contentAccess,
  versions: { drafts: true, maxPerDoc: 50 },
  hooks: {
    afterRead: [stripPrivateContent],
    beforeOperation: [captureCollectionApproval, protectDraftQueries],
    beforeChange: [collectionPublication('pages')],
  },
  fields: [
    {
      name: 'key',
      type: 'select',
      required: true,
      unique: true,
      options: [
        'HOME',
        'COMPANY',
        'EXPERTISE',
        'SERVICES',
        'APPROACH',
        'CONTACT',
        'FAQ',
      ],
    },
    ...editorialFields(),
    { name: 'values', type: 'array', fields: [text('value')] },
  ],
};
