import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { openTestCMS, approve, type TestCMS } from './helpers';
let cms: TestCMS;
beforeAll(async () => {
  cms = await openTestCMS('localization');
}, 120000);
afterAll(async () => {
  await cms?.payload.destroy();
});

describe('bilingual publication and relationships', () => {
  it('stores independent translations and resolves canonical division slugs to IDs', async () => {
    const service = await cms.payload.find({
      collection: 'services',
      locale: 'all',
      depth: 1,
    });
    expect(service.totalDocs).toBe(7);
    const first = service.docs.find((d) => d.order === 1)!;
    expect(first.title).toHaveProperty('fr');
    expect(first.title).toHaveProperty('en');
    expect(first.division).toMatchObject({ slug: 'hygiene-pest-control' });
  });

  it('reports missing English copy and refuses to publish with fallback translations', async () => {
    const id = cms.pages[0].id;
    await cms.payload.update({
      collection: 'pages',
      id,
      locale: 'en',
      draft: true,
      data: { title: '' },
    });
    const draft = await cms.payload.findByID({
      collection: 'pages',
      id,
      draft: true,
    });
    expect(JSON.stringify(draft.translationIssues)).toContain('title.en');
    await expect(approve(cms, 'pages', id)).rejects.toThrow(
      /translation|title|bilingual/i,
    );
  });

  it('requires evidence for all claims before publication', async () => {
    await expect(
      cms.payload.update({
        collection: 'pages',
        id: cms.pages[1].id,
        user: cms.users.publisher,
        overrideAccess: false,
        data: { _status: 'published', publicationApproved: true },
      }),
    ).rejects.toThrow(/approv|claim/i);
  });

  it('requires a published parent division and hides internal service instructions', async () => {
    const service = (
      await cms.payload.find({
        collection: 'services',
        sort: 'order',
        depth: 0,
      })
    ).docs[0];
    await expect(approve(cms, 'services', service.id)).rejects.toThrow(
      /division/i,
    );
    await approve(cms, 'divisions', service.division as number);
    await approve(cms, 'services', service.id);
    const published = await cms.payload.findByID({
      collection: 'services',
      id: service.id,
      overrideAccess: false,
    });
    expect(published).not.toHaveProperty('editorialNotes');
    await expect(
      cms.payload.update({
        collection: 'services',
        id: service.id,
        draft: true,
        data: { division: 2147483647 },
      }),
    ).rejects.toThrow();
  });

  it('invalidates earlier approval on a changed translation, even for a publisher', async () => {
    const id = cms.pages[2].id;
    await approve(cms, 'pages', id);
    const draft = await cms.payload.update({
      collection: 'pages',
      id,
      locale: 'en',
      draft: true,
      user: cms.users.publisher,
      overrideAccess: false,
      data: { lead: 'Changed English content' },
    });
    expect(draft.publicationApproved).toBe(false);
    expect(draft._status).toBe('draft');
    await expect(
      cms.payload.update({
        collection: 'pages',
        id,
        data: { _status: 'published' },
        overrideAccess: false,
        user: cms.users.publisher,
      }),
    ).rejects.toThrow();
  });

  it('enforces unique canonical slugs in PostgreSQL', async () => {
    await expect(
      cms.payload.create({
        collection: 'pages',
        draft: true,
        data: { slug: cms.pages[0].slug },
      }),
    ).rejects.toThrow();
  });

  it('withdraws a service from public reads when its parent division is unpublished', async () => {
    const service = (
      await cms.payload.find({
        collection: 'services',
        sort: 'order',
        depth: 0,
      })
    ).docs[0];
    await cms.payload.update({
      collection: 'divisions',
      id: service.division as number,
      user: cms.users.publisher,
      overrideAccess: false,
      data: { _status: 'draft' },
    });
    expect(
      (
        await cms.payload.find({
          collection: 'services',
          overrideAccess: false,
          where: { id: { equals: service.id } },
        })
      ).totalDocs,
    ).toBe(0);
  });
});
