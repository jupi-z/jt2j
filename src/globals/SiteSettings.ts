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

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: globalPublishedOnly('site-settings'),
    update: editorial,
    readVersions: editorial,
  },
  versions: { drafts: true, max: 50 },
  forceSelect: { _status: true, publicationApproved: true },
  hooks: {
    afterRead: [stripPrivateContent],
    beforeOperation: [captureGlobalApproval],
    beforeRead: [protectGlobalRead],
    beforeChange: [globalPublication('site-settings')],
  },
  fields: [
    text('name'),
    text('tagline'),
    text('description'),
    {
      name: 'defaultLocale',
      type: 'select',
      required: true,
      defaultValue: 'fr',
      options: ['fr'],
    },
    {
      name: 'supportedLocales',
      type: 'select',
      hasMany: true,
      required: true,
      options: ['fr', 'en'],
      defaultValue: ['fr', 'en'],
    },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'socialHandle', type: 'text', required: true },
    {
      name: 'features',
      type: 'group',
      fields: [
        'leadership',
        'references',
        'legal',
        'privacy',
        'cookies',
        'contactForm',
      ].map((name) => ({ name, type: 'checkbox', defaultValue: false })),
    },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    {
      name: 'defaultSEO',
      type: 'group',
      fields: [text('title', false), text('description', false)],
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [text('label'), { name: 'url', type: 'text', required: true }],
    },
    ...publicationFields(),
  ],
};
