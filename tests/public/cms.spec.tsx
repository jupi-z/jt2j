// @vitest-environment node
import { afterAll, beforeAll, expect, it } from 'vitest';
import { openTestCMS, approve, type TestCMS } from '../payload/helpers';
import { readPublicContent } from '../../src/queries/payloadPublicContent';
let cms: TestCMS;
beforeAll(async () => {
  cms = await openTestCMS('public');
}, 60000);
afterAll(async () => {
  await cms?.payload.destroy();
});
it('reads anonymous published versions, resolves relations and strips all private data', async () => {
  let queries = await readPublicContent(cms.payload);
  expect(queries.getPages('fr')).toEqual([]);
  expect(queries.getDivisions('en')).toEqual([]);
  const division = (
    await cms.payload.find({
      collection: 'divisions',
      where: { slug: { equals: 'hygiene-pest-control' } },
    })
  ).docs[0];
  const service = (
    await cms.payload.find({
      collection: 'services',
      where: { slug: { equals: 'cleaning' } },
    })
  ).docs[0];
  await approve(cms, 'divisions', division.id);
  await approve(cms, 'services', service.id);
  await approve(cms, 'pages', cms.pages[0].id);
  queries = await readPublicContent(cms.payload);
  expect(
    queries.getServices('en').map((s) => [s.slug, s.title, s.division]),
  ).toEqual([['cleaning', 'Cleaning Services', 'hygiene-pest-control']]);
  expect(queries.getPages('en')[0].title).toBe(
    'Different needs. A connected range of services.',
  );
  expect(JSON.stringify(queries.getServices('en'))).not.toMatch(
    /editorialNotes|claims|publicationApproved|translationIssues|createdAt/,
  );
  await cms.payload.update({
    collection: 'services',
    id: service.id,
    draft: true,
    locale: 'en',
    data: { title: 'PRIVATE NEW DRAFT' },
  });
  queries = await readPublicContent(cms.payload);
  expect(queries.getServices('en')[0].title).toBe('Cleaning Services');
});
