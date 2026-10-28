import type { CollectionConfig } from 'payload';
import {
  contentAccess,
  protectDraftQueries,
  stripPrivateContent,
} from '../access/publishedOnly';
import { editorialFields } from './fields';
import {
  collectionPublication,
  captureCollectionApproval,
} from '../payload/publication';

export const LegalDocuments: CollectionConfig = {
  slug: 'legal-documents',
  access: contentAccess,
  admin: { useAsTitle: 'title' },
  versions: { drafts: true, maxPerDoc: 50 },
  hooks: {
    afterRead: [stripPrivateContent],
    beforeOperation: [captureCollectionApproval, protectDraftQueries],
    beforeChange: [collectionPublication('legal-documents')],
  },
  fields: [
    ...editorialFields(),
    {
      name: 'kind',
      type: 'select',
      unique: true,
      required: true,
      options: ['legal-notice', 'privacy-policy', 'cookie-policy'],
    },
    { name: 'effectiveDate', type: 'date', required: true },
  ],
};
