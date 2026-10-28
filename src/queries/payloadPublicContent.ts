import type { Payload } from 'payload';
import {
  createPublicContentQueries,
  type PublicContentInput,
} from './publicContent';

/** Anonymous Local API reads: no request user, no draft/locale fallback, ACLs on.
 * The approval field is stripped by Payload's public afterRead hook; the query
 * itself enforces approval before projecting any data. Never load authoring seeds. */
export async function readPublicContent(payload: Payload) {
  const collections = ['pages', 'divisions', 'services', 'faqs'] as const;
  const results = await Promise.all(
    collections.map((collection) =>
      payload.find({
        collection,
        locale: 'all',
        fallbackLocale: false,
        draft: false,
        overrideAccess: false,
        user: null,
        depth: 0,
        pagination: false,
        sort: 'order',
        // Approval and parent-division gates come from the collection ACL.
        // Private approval fields cannot be queried by an anonymous caller.
        where: { _status: { equals: 'published' } },
      }),
    ),
  );
  const input: PublicContentInput = {
    pages: [],
    divisions: [],
    services: [],
    faq: [],
  };
  const divisionSlugs = new Map(results[1].docs.map((d) => [d.id, d.slug]));
  for (const [index, key] of (
    ['pages', 'divisions', 'services', 'faq'] as const
  ).entries()) {
    input[key] = results[index].docs.map((doc) => ({
      ...doc,
      publicationApproved: true,
      ...('division' in doc
        ? { division: divisionSlugs.get(doc.division as number) ?? '' }
        : {}),
    }));
  }
  return createPublicContentQueries(input);
}
