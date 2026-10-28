import { getPayload } from 'payload';
import { inject } from 'vitest';
import { createPayloadConfig } from '../../src/payload/config';
import { seed } from '../../src/seed/seed';
import type { User } from '../../src/payload-types';

export async function openTestPayload(
  name: 'access' | 'localization' | 'seed' | 'rollback' | 'review' | 'public',
) {
  const payload = await getPayload({
    key: name,
    config: createPayloadConfig({
      DATABASE_URL: `${inject('postgresURL')}/jt2j_test_${name}`,
      PAYLOAD_SECRET: 'disposable-test-secret-at-least-32-characters',
    }),
  });
  await payload.db.migrate();
  await payload.db.migrate();
  return payload;
}

export async function openTestCMS(
  name: 'access' | 'localization' | 'seed' | 'review' | 'public',
) {
  const payload = await openTestPayload(name);
  await seed(payload);
  const users = {} as Record<
    'admin' | 'editor' | 'publisher' | 'translator' | 'sales',
    User
  >;
  for (const role of [
    'admin',
    'editor',
    'publisher',
    'translator',
    'sales',
  ] as const) {
    users[role] = await payload.create({
      collection: 'users',
      data: {
        email: `${role}@example.test`,
        password: 'disposable-password-12345',
        role,
      },
    });
  }
  return {
    payload,
    users,
    pages: (
      await payload.find({ collection: 'pages', sort: 'order', limit: 100 })
    ).docs,
  };
}
export type TestCMS = Awaited<ReturnType<typeof openTestCMS>>;

export async function approve(
  cms: TestCMS,
  collection: 'pages' | 'divisions' | 'services' | 'media' | 'site-settings',
  id?: number,
) {
  const doc =
    collection === 'site-settings'
      ? await cms.payload.findGlobal({ slug: 'site-settings', draft: true })
      : await cms.payload.findByID({
          collection,
          id: id!,
          draft: true,
          depth: 0,
        });
  const data = {
    _status: 'published' as const,
    publicationApproved: true,
    claims: (doc.claims ?? []).map((c) => ({
      ...c,
      status: 'approved' as const,
      approvedBy: 'Test publisher',
      evidence: 'Test-only editorial evidence',
    })),
  };
  if (collection === 'site-settings')
    return cms.payload.updateGlobal({
      slug: 'site-settings',
      data,
      overrideAccess: false,
      user: cms.users.publisher,
    });
  return cms.payload.update({
    collection,
    id: id!,
    data,
    overrideAccess: false,
    user: cms.users.publisher,
  });
}
