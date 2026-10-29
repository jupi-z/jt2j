// Generated from docs/reference/JT2J_Prestige_Prototype.html by scripts/extract-prototype-content.ts.
// Authoring snapshot only; all content awaits editorial approval.
import type { SiteSettingsSeed } from '../types';

export const siteSettings: SiteSettingsSeed = {
  status: 'draft',
  publicationApproved: false,
  claims: [
    {
      category: 'contact',
      source:
        'JT2J_SITE_WEB_MASTER_BLUEPRINT_FR_EN_V1 (1).md; docs/reference/JT2J_Prestige_Prototype.html#site-data/source/annex-23/contacts',
      status: 'pending',
    },
  ],
  name: {
    fr: 'JT2J Company',
    en: 'JT2J Company',
  },
  tagline: {
    fr: "L'innovation pour tous vos besoins.",
    en: 'Innovation for all your needs.',
  },
  description: {
    fr: "JT2J Company présente ses pôles d'activité et ses services à Lubumbashi et Kolwezi, en République démocratique du Congo.",
    en: 'JT2J Company presents its business divisions and services in Lubumbashi and Kolwezi, Democratic Republic of the Congo.',
  },
  defaultLocale: 'fr',
  locales: ['fr', 'en'],
  email: 'info@jt2j.com',
  phone: '+243974004510',
  socialHandle: '@jt2jcompany',
  features: {
    leadership: false,
    references: false,
    legal: false,
    privacy: false,
    cookies: false,
    contactForm: false,
  },
};
