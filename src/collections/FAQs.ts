import type { CollectionConfig } from 'payload';
import {
  contentAccess,
  protectDraftQueries,
  stripPrivateContent,
} from '../access/publishedOnly';
import { identityFields, publicationFields } from './fields';
import {
  collectionPublication,
  captureCollectionApproval,
} from '../payload/publication';

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'title',
    description: 'Title is the question; lead is the answer.',
  },
  access: contentAccess,
  versions: { drafts: true, maxPerDoc: 50 },
  hooks: {
    afterRead: [stripPrivateContent],
    beforeOperation: [captureCollectionApproval, protectDraftQueries],
    beforeChange: [collectionPublication('faqs')],
  },
  fields: [...identityFields(), ...publicationFields()],
};
