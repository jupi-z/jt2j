import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  openTestCMS,
  openTestPayload,
  type TestCMS,
} from '../../tests/payload/helpers';
import { seed } from './seed';
import { pages } from '../content/seed/pages';
import { divisions } from '../content/seed/divisions';
import { services } from '../content/seed/services';
import { faq } from '../content/seed/faq';
import { siteSettings } from '../content/seed/site-settings';
import { createLocalReq, registerFirstUserOperation } from 'payload';
let cms: TestCMS;
beforeAll(async () => {
  cms = await openTestCMS('seed');
}, 120000);
afterAll(async () => {
  await cms?.payload.destroy();
});

describe('deterministic, non-destructive seed', () => {
  it('creates 25 draft records without inventing legal records, media or accounts', async () => {
    expect(cms.pages).toHaveLength(7);
    for (const collection of [
      'pages',
      'divisions',
      'services',
      'faqs',
    ] as const) {
      const records = await cms.payload.find({ collection, limit: 100 });
      expect(
        records.docs.every(
          (d) => d._status === 'draft' && !d.publicationApproved,
        ),
      ).toBe(true);
    }
    expect(
      (await cms.payload.find({ collection: 'legal-documents' })).totalDocs,
    ).toBe(0);
    expect(
      (await cms.payload.findGlobal({ slug: 'navigation', draft: true })).items,
    ).toHaveLength(7);
  });

  it('preserves IDs, versions and human edits on a second run', async () => {
    const id = cms.pages[0].id;
    await cms.payload.update({
      collection: 'pages',
      id,
      draft: true,
      data: { title: 'Human editorial revision' },
    });
    const before = await cms.payload.findVersions({
      collection: 'pages',
      where: { parent: { equals: id } },
    });
    const result = await seed(cms.payload);
    expect(result.created).toBe(0);
    expect(result.skipped).toBe(27);
    expect(
      (await cms.payload.findByID({ collection: 'pages', id, draft: true }))
        .title,
    ).toBe('Human editorial revision');
    expect(
      (
        await cms.payload.findVersions({
          collection: 'pages',
          where: { parent: { equals: id } },
        })
      ).totalDocs,
    ).toBe(before.totalDocs);
  });

  it('rolls back every prior write on a mid-seed database failure and supports migration down/up', async () => {
    const payload = await openTestPayload('rollback');
    try {
      const broken = structuredClone({
        pages,
        divisions,
        services,
        faq,
        siteSettings,
      });
      broken.pages[1].key = broken.pages[0].key;
      await expect(seed(payload, broken)).rejects.toThrow();
      expect((await payload.find({ collection: 'divisions' })).totalDocs).toBe(
        0,
      );
      expect((await payload.find({ collection: 'pages' })).totalDocs).toBe(0);
      expect((await payload.find({ collection: 'users' })).totalDocs).toBe(0);
      await payload.db.migrateDown();
      await payload.db.migrate();
      expect((await seed(payload)).created).toBe(27);
      const req = await createLocalReq(
        { req: { payloadAPI: 'REST' } },
        payload,
      );
      await expect(
        registerFirstUserOperation({
          collection: payload.collections.users,
          req,
          data: {
            email: 'unauthorized@example.test',
            password: 'disposable-password-12345',
            role: 'admin',
          },
        }),
      ).rejects.toThrow(/administrator/);
      expect((await payload.find({ collection: 'users' })).totalDocs).toBe(0);
    } finally {
      await payload.destroy();
    }
  }, 120000);
});
