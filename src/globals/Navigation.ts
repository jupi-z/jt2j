import type { GlobalConfig } from 'payload';
import { editorial } from '../access/roles';
import {
  globalPublishedOnly,
  protectGlobalRead,
  stripPrivateContent,
} from '../access/publishedOnly';
import { publicationFields, text } from '../collections/fields';
import {
  globalPublication,
  captureGlobalApproval,
} from '../payload/publication';
import { publicRoutes } from '../routing/catalog';

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  access: {
    read: globalPublishedOnly('navigation'),
    update: editorial,
    readVersions: editorial,
  },
  versions: { drafts: true, max: 50 },
  forceSelect: { _status: true, publicationApproved: true },
  hooks: {
    afterRead: [stripPrivateContent],
    beforeOperation: [captureGlobalApproval],
    beforeRead: [protectGlobalRead],
    beforeChange: [globalPublication('navigation')],
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        text('label'),
        {
          name: 'path',
          type: 'text',
          validate: (value: unknown) =>
            publicRoutes.some((route) => route.path === value) ||
            'Choose a canonical public route (without locale)',
        },
      ],
    },
    ...publicationFields(),
  ],
};
