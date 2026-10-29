import { describe, expect, it } from 'vitest';
import {
  getPublicationChecklist,
  isPublicationReady,
} from '../../src/admin/hooks/publicationChecks';
import { LeadStatusSelect } from '../../src/admin/components/LeadStatusSelect';
import { TranslationStatus } from '../../src/admin/components/TranslationStatus';
import { PublicationChecklist } from '../../src/admin/components/PublicationChecklist';

const complete = {
  title: { fr: 'Titre', en: 'Title' },
  lead: { fr: 'Résumé', en: 'Summary' },
  meta: {
    title: { fr: 'SEO FR', en: 'SEO EN' },
    description: { fr: 'Description FR', en: 'Description EN' },
  },
  claims: [
    {
      category: 'legal',
      status: 'approved',
      source: 'approval-record',
      approvedBy: 'legal@example.test',
      evidence: 'legal-approval-1',
    },
  ],
  heroMedia: {
    _status: 'published',
    publicationApproved: true,
    rightsStatus: 'approved',
    rightsEvidence: 'rights-record-1',
  },
};

describe('publication checklist', () => {
  it('reports translation, SEO, legal and media checks separately', () => {
    const result = getPublicationChecklist(complete);
    expect(result.every((item) => item.complete)).toBe(true);
    expect(result.map((item) => item.key)).toEqual([
      'translations',
      'seo',
      'legal',
      'mediaRights',
    ]);
    expect(isPublicationReady(complete)).toBe(true);
  });

  it.each([
    ['translations', { title: { fr: 'Titre' } }],
    ['seo', { ...complete, meta: { title: { fr: 'SEO FR', en: 'SEO EN' } } }],
    ['legal', { ...complete, claims: [] }],
    [
      'mediaRights',
      {
        ...complete,
        heroMedia: { ...complete.heroMedia, rightsStatus: 'pending' },
      },
    ],
  ])('blocks publication when %s is incomplete', (key, data) => {
    const item = getPublicationChecklist(data).find((entry) => entry.key === key);
    expect(item?.complete).toBe(false);
    expect(isPublicationReady(data)).toBe(false);
  });

  it('keeps the admin field components available for Payload configuration', () => {
    expect(TranslationStatus).toBeTypeOf('function');
    expect(PublicationChecklist).toBeTypeOf('function');
    expect(LeadStatusSelect).toBeTypeOf('function');
  });
});
