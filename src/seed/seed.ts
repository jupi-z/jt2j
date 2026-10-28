import { pathToFileURL } from 'node:url';
import {
  createLocalReq,
  initTransaction,
  commitTransaction,
  killTransaction,
  type Payload,
} from 'payload';
import {
  contentSeedSchema,
  type ContentSeed,
  type LocalizedText,
} from '../content/types';
import { pages } from '../content/seed/pages';
import { divisions } from '../content/seed/divisions';
import { services } from '../content/seed/services';
import { faq } from '../content/seed/faq';
import { siteSettings } from '../content/seed/site-settings';
import { pageRoutes } from '../routing/catalog';

const initialContent: ContentSeed = {
  pages,
  divisions,
  services,
  faq,
  siteSettings,
};
type RecordData = Record<string, unknown>;

/** Project canonical bilingual maps into one Payload locale. Reuse array IDs so
 * the second language updates the same rows instead of replacing the first. */
function inLocale(
  value: unknown,
  locale: 'fr' | 'en',
  previous?: unknown,
): unknown {
  if (Array.isArray(value))
    return value.map((row, i) => {
      const projected = inLocale(
        row,
        locale,
        Array.isArray(previous) ? previous[i] : undefined,
      );
      const id = Array.isArray(previous) ? previous[i]?.id : undefined;
      return id && projected && typeof projected === 'object'
        ? { ...projected, id }
        : projected;
    });
  if (value && typeof value === 'object') {
    if ('fr' in value && 'en' in value) return (value as LocalizedText)[locale];
    const old = (previous ?? {}) as RecordData;
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [
        key,
        inLocale(val, locale, old[key]),
      ]),
    );
  }
  return value;
}

/** Insert-only, explicit CLI pipeline. Existing records and globals (including
 * approved content and newer drafts) are never overwritten on rerun. One DB
 * transaction covers the whole graph; no users, leads or media are invented. */
export async function seed(
  payload: Payload,
  input: ContentSeed = initialContent,
) {
  const content = contentSeedSchema.parse(input);
  for (const records of [
    content.pages,
    content.divisions,
    content.services,
    content.faq,
  ]) {
    if (new Set(records.map((r) => r.slug)).size !== records.length)
      throw new Error('Seed has duplicate slugs');
  }
  const divisionSlugs = new Set(content.divisions.map((d) => d.slug));
  if (content.services.some((s) => !divisionSlugs.has(s.division)))
    throw new Error('Seed service refers to an unknown division');
  const req = await createLocalReq({}, payload);
  const ownsTransaction = await initTransaction(req);
  const result = { created: 0, skipped: 0 };
  try {
    const divisionIDs = new Map<string, number>();
    for (const [collection, records] of [
      ['divisions', content.divisions],
      ['pages', content.pages],
      ['services', content.services],
      ['faqs', content.faq],
    ] as const) {
      for (const record of records) {
        const existing = await payload.find({
          collection,
          where: { slug: { equals: record.slug } },
          limit: 1,
          depth: 0,
          overrideAccess: true,
          req,
        });
        let id = existing.docs[0]?.id;
        if (id) result.skipped++;
        else {
          const { status: _status, ...rest } = record;
          void _status;
          const data: RecordData = {
            ...rest,
            _status: 'draft',
            publicationApproved: false,
            claims: record.claims.map(({ category, source }) => ({
              category,
              source,
              status: 'pending',
            })),
          };
          if (collection === 'pages' && 'values' in record && record.values)
            data.values = record.values.map((value) => ({ value }));
          if (collection === 'services' && 'division' in record) {
            const division = divisionIDs.get(record.division);
            if (!division)
              throw new Error('Seed division could not be resolved');
            data.division = division;
          }
          const french = await payload.create({
            collection,
            locale: 'fr',
            draft: true,
            overrideAccess: true,
            data: inLocale(data, 'fr') as never,
            req,
          });
          id = french.id;
          // Persist both translations in the base draft as well as its version.
          await payload.update({
            collection,
            id,
            locale: 'en',
            draft: false,
            overrideAccess: true,
            data: inLocale(data, 'en', french) as never,
            req,
          });
          result.created++;
        }
        if (collection === 'divisions') divisionIDs.set(record.slug, id);
      }
    }
    const navigation = {
      items: content.pages.map((page) => ({
        label: page.title,
        path: pageRoutes.find((route) => route.message === `pages.${page.key}`)!
          .path,
      })),
      claims: [
        {
          category: 'institutional',
          source: 'Canonical Task 2 page identities and Task 4 route catalogue',
          status: 'pending',
        },
      ],
    };
    for (const [slug, record] of [
      ['site-settings', content.siteSettings],
      ['navigation', navigation],
    ] as const) {
      const existing = await payload.findGlobal({
        slug,
        draft: true,
        depth: 0,
        overrideAccess: true,
        req,
      });
      if (existing.createdAt || existing.updatedAt) {
        result.skipped++;
        continue;
      }
      const data = {
        ...record,
        status: undefined,
        _status: 'draft',
        publicationApproved: false,
        claims: record.claims.map(({ category, source }) => ({
          category,
          source,
          status: 'pending',
        })),
        ...(slug === 'site-settings'
          ? {
              locales: undefined,
              supportedLocales: content.siteSettings.locales,
              features: Object.fromEntries(
                Object.keys(content.siteSettings.features).map((key) => [
                  key,
                  false,
                ]),
              ),
            }
          : {}),
      };
      const french = await payload.updateGlobal({
        slug,
        locale: 'fr',
        draft: true,
        overrideAccess: true,
        data: inLocale(data, 'fr') as never,
        req,
      });
      await payload.updateGlobal({
        slug,
        locale: 'en',
        draft: false,
        overrideAccess: true,
        data: inLocale(data, 'en', french) as never,
        req,
      });
      result.created++;
    }
    if (ownsTransaction) await commitTransaction(req);
    return result;
  } catch (error) {
    if (ownsTransaction) await killTransaction(req);
    throw error;
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const { getPayload } = await import('payload');
  const { default: config } = await import('../../payload.config');
  const payload = await getPayload({ config });
  try {
    console.log(await seed(payload));
  } finally {
    await payload.destroy();
  }
}
