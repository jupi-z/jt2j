import { beforeAll, afterAll, describe, expect, it } from 'vitest';
import { openTestCMS, approve, type TestCMS } from './helpers';
import sharp from 'sharp';

let cms: TestCMS;
beforeAll(async () => {
  cms = await openTestCMS('access');
}, 120000);
afterAll(async () => {
  await cms?.payload.destroy();
});

describe('Payload public boundary and roles', () => {
  it('keeps every seeded document, global and version private', async () => {
    for (const collection of [
      'pages',
      'divisions',
      'services',
      'faqs',
      'media',
      'legal-documents',
    ] as const) {
      expect(
        (await cms.payload.find({ collection, overrideAccess: false }))
          .totalDocs,
      ).toBe(0);
    }
    await expect(
      cms.payload.findGlobal({ slug: 'site-settings', overrideAccess: false }),
    ).rejects.toThrow();
    await expect(
      cms.payload.findVersions({ collection: 'pages', overrideAccess: false }),
    ).rejects.toThrow();
    await expect(
      cms.payload.find({ collection: 'leads', overrideAccess: false }),
    ).rejects.toThrow();
    await expect(
      cms.payload.create({
        collection: 'users',
        overrideAccess: false,
        data: {
          email: 'intruder@example.test',
          password: 'never-a-real-password',
          role: 'admin',
        },
      }),
    ).rejects.toThrow();
  });

  it('allows editors and translators to edit drafts but rejects publishing and approval', async () => {
    const page = cms.pages[0];
    for (const role of ['editor', 'translator'] as const) {
      const user = cms.users[role];
      await cms.payload.update({
        collection: 'pages',
        id: page.id,
        draft: true,
        overrideAccess: false,
        user,
        data: { lead: `Draft by ${role}` },
      });
      await expect(
        cms.payload.update({
          collection: 'pages',
          id: page.id,
          overrideAccess: false,
          user,
          data: { _status: 'published', publicationApproved: true },
        }),
      ).rejects.toThrow();
    }
  });

  it('rejects sales content writes, self-promotion and public lead creation', async () => {
    await expect(
      cms.payload.update({
        collection: 'pages',
        id: cms.pages[0].id,
        draft: true,
        overrideAccess: false,
        user: cms.users.sales,
        data: { lead: 'tamper' },
      }),
    ).rejects.toThrow();
    await cms.payload.update({
      collection: 'users',
      id: cms.users.editor.id,
      overrideAccess: false,
      user: cms.users.editor,
      data: { role: 'admin', name: 'Editor' },
    });
    expect(
      (
        await cms.payload.findByID({
          collection: 'users',
          id: cms.users.editor.id,
        })
      ).role,
    ).toBe('editor');
    await expect(
      cms.payload.create({
        collection: 'leads',
        overrideAccess: false,
        data: {
          name: 'Public',
          email: 'test@example.test',
          message: 'Test',
          locale: 'fr',
          sourcePage: '/fr/contact',
          status: 'new',
          consent: {
            accepted: true,
            policyVersion: 'v1',
            recordedAt: new Date().toISOString(),
          },
        },
      }),
    ).rejects.toThrow();
  });

  it('publishes an approved bilingual page and strips claims and internal notes from public reads', async () => {
    const id = cms.pages[1].id;
    await approve(cms, 'pages', id);
    const publicDoc = await cms.payload.findByID({
      collection: 'pages',
      id,
      overrideAccess: false,
      locale: 'en',
    });
    expect(publicDoc.title).toBe(
      'JT2J Company, innovation for all your needs.',
    );
    expect(publicDoc).not.toHaveProperty('claims');
    expect(publicDoc).not.toHaveProperty('translationIssues');
    await cms.payload.update({
      collection: 'pages',
      id,
      draft: true,
      user: cms.users.editor,
      overrideAccess: false,
      data: { title: 'PRIVATE NEXT REVISION' },
    });
    const publicDraftQuery = await cms.payload.find({
      collection: 'pages',
      draft: true,
      overrideAccess: false,
      where: { id: { equals: id } },
    });
    expect(
      publicDraftQuery.docs.some(
        (doc) => doc.title === 'PRIVATE NEXT REVISION',
      ),
    ).toBe(false);
    expect(
      (
        await cms.payload.findByID({
          collection: 'pages',
          id,
          overrideAccess: false,
        })
      ).title,
    ).not.toBe('PRIVATE NEXT REVISION');
  });

  it('prevents selecting away publication guards on globals and rejects public draft reads', async () => {
    await approve(cms, 'site-settings');
    await cms.payload.updateGlobal({
      slug: 'site-settings',
      draft: true,
      user: cms.users.editor,
      overrideAccess: false,
      data: { tagline: 'PRIVATE GLOBAL REVISION' },
    });
    const published = await cms.payload.findGlobal({
      slug: 'site-settings',
      overrideAccess: false,
      select: { tagline: true },
    });
    expect(published.tagline).not.toBe('PRIVATE GLOBAL REVISION');
    await expect(
      cms.payload.findGlobal({
        slug: 'site-settings',
        draft: true,
        overrideAccess: false,
        select: { tagline: true },
      }),
    ).rejects.toThrow();
  });

  it('restricts lead records to sales/admin, with assignees and consent retained', async () => {
    const lead = await cms.payload.create({
      collection: 'leads',
      data: {
        name: 'Test request',
        email: 'test@example.test',
        message: 'Test only',
        locale: 'fr',
        sourcePage: '/fr/contact',
        status: 'new',
        consent: {
          accepted: true,
          policyVersion: 'test-policy-v1',
          recordedAt: new Date().toISOString(),
        },
        assignee: cms.users.sales.id,
      },
    });
    expect(
      (
        await cms.payload.findByID({
          collection: 'leads',
          id: lead.id,
          overrideAccess: false,
          user: cms.users.sales,
        })
      ).consent?.policyVersion,
    ).toBe('test-policy-v1');
    await expect(
      cms.payload.findByID({
        collection: 'leads',
        id: lead.id,
        overrideAccess: false,
        user: cms.users.editor,
      }),
    ).rejects.toThrow();
  });

  it('keeps uploaded files private until bilingual alt text and rights are approved', async () => {
    const data = await sharp({
      create: { width: 2, height: 2, channels: 3, background: '#ffffff' },
    })
      .png()
      .toBuffer();
    const media = await cms.payload.create({
      collection: 'media',
      locale: 'fr',
      draft: true,
      file: {
        data,
        name: 'jt2j-test-rights.png',
        mimetype: 'image/png',
        size: data.length,
      },
      data: {
        alt: 'Document de test',
        credit: 'Test fixture',
        source: 'Generated test bytes',
        rightsStatus: 'pending',
        claims: [
          { category: 'reference', source: 'Test fixture', status: 'pending' },
        ],
      },
    });
    await expect(
      cms.payload.findByID({
        collection: 'media',
        id: media.id,
        overrideAccess: false,
      }),
    ).rejects.toThrow();
    await expect(approve(cms, 'media', media.id)).rejects.toThrow(
      /bilingual|rights/i,
    );
    await cms.payload.update({
      collection: 'media',
      id: media.id,
      locale: 'en',
      draft: true,
      user: cms.users.publisher,
      overrideAccess: false,
      data: {
        alt: 'Test document',
        rightsStatus: 'approved',
        rightsEvidence: 'Test fixture owned by test suite',
      },
    });
    await approve(cms, 'media', media.id);
    const publicMedia = await cms.payload.findByID({
      collection: 'media',
      id: media.id,
      overrideAccess: false,
    });
    expect(publicMedia.alt).toBe('Document de test');
    expect(publicMedia).not.toHaveProperty('rightsEvidence');
    expect(publicMedia).not.toHaveProperty('claims');
  });

  it('blocks legal/contact features without an evidenced approval for that category', async () => {
    await expect(
      cms.payload.updateGlobal({
        slug: 'site-settings',
        draft: true,
        user: cms.users.publisher,
        overrideAccess: false,
        data: { features: { contactForm: true } },
      }),
    ).rejects.toThrow(/Feature contactForm/);
  });

  it('rejects direct global restores which bypass Payload publication hooks', async () => {
    const version = (
      await cms.payload.findGlobalVersions({ slug: 'site-settings' })
    ).docs.find((v) => v.version._status === 'published')!;
    await expect(
      cms.payload.restoreGlobalVersion({
        slug: 'site-settings',
        id: version.id,
        overrideAccess: false,
        user: cms.users.editor,
      }),
    ).rejects.toThrow(/validated draft/);
  });
});
