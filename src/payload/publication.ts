import {
  APIError,
  type CollectionBeforeChangeHook,
  type GlobalBeforeChangeHook,
  type CollectionBeforeOperationHook,
  type GlobalBeforeOperationHook,
  type Field,
  type PayloadRequest,
} from 'payload';
import { z } from 'zod';
import {
  pageSeedSchema,
  divisionSeedSchema,
  serviceSeedSchema,
  faqSeedSchema,
  siteSettingsSeedSchema,
  localizedTextSchema,
  claimSchema,
} from '../content/types';
import { canPublish } from '../access/roles';
import { publicRoutes } from '../routing/catalog';

type RecordData = Record<string, unknown>;
type ContentKind =
  'pages' | 'divisions' | 'services' | 'faqs' | 'media' | 'legal-documents';
type GlobalKind = 'site-settings' | 'navigation';
const explicitApproval = new WeakMap<PayloadRequest, boolean>();
export const captureCollectionApproval: CollectionBeforeOperationHook = ({
  args,
  operation,
  req,
}) => {
  if ((operation === 'create' || operation === 'update') && 'data' in args)
    explicitApproval.set(req, object(args.data).publicationApproved === true);
  return args;
};
export const captureGlobalApproval: GlobalBeforeOperationHook = (hook) => {
  const { args, req } = hook;
  // Payload 3 restores globals directly in the DB, skipping beforeChange.
  // Reapply historical content through an ordinary validated draft update.
  if ('operation' in hook && hook.operation === 'restoreVersion')
    throw new APIError(
      'Reapply global versions through a validated draft update',
      403,
    );
  if (args && 'data' in args)
    explicitApproval.set(req, object(args.data).publicationApproved === true);
  return args;
};
const publication = {
  status: z.enum(['draft', 'published']),
  publicationApproved: z.boolean(),
  claims: z.array(claimSchema).min(1),
};
const schemas = {
  pages: pageSeedSchema,
  divisions: divisionSeedSchema,
  services: serviceSeedSchema,
  faqs: faqSeedSchema,
  'site-settings': siteSettingsSeedSchema.extend({
    defaultSEO: z
      .object({
        title: localizedTextSchema.optional(),
        description: localizedTextSchema.optional(),
      })
      .optional(),
    socialLinks: z
      .array(
        z.object({
          label: localizedTextSchema,
          url: z.url({ protocol: /^https?$/ }),
        }),
      )
      .optional(),
  }),
  'legal-documents': pageSeedSchema.omit({ key: true, values: true }).extend({
    kind: z.enum(['legal-notice', 'privacy-policy', 'cookie-policy']),
    effectiveDate: z.string().min(1),
  }),
  media: z.object({
    ...publication,
    alt: localizedTextSchema,
    credit: z.string().trim().min(1),
    source: z.string().trim().min(1),
    rightsStatus: z.literal('approved'),
    rightsEvidence: z.string().trim().min(1),
  }),
  navigation: z.object({
    ...publication,
    items: z
      .array(
        z.object({
          label: localizedTextSchema,
          path: z
            .string()
            .refine(
              (path) => publicRoutes.some((route) => route.path === path),
              'Unknown public route',
            ),
        }),
      )
      .min(1),
  }),
};

function object(value: unknown): RecordData {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as RecordData)
    : {};
}

/** Merge a locale-scoped Payload write with the untranslated stored fields. Array
 * row IDs preserve the other language when editors update an existing section. */
function mergeFields(
  fields: Field[],
  previous: RecordData,
  patch: RecordData,
  locale: string,
): RecordData {
  const result = { ...previous, ...patch };
  for (const field of fields) {
    if (!('name' in field) || !field.name || !(field.name in patch)) continue;
    const name = field.name;
    if ('localized' in field && field.localized) {
      result[name] =
        locale === 'all'
          ? patch[name]
          : { ...object(previous[name]), [locale]: patch[name] };
    } else if (field.type === 'group') {
      result[name] = mergeFields(
        field.fields,
        object(previous[name]),
        object(patch[name]),
        locale,
      );
    } else if (field.type === 'array' && Array.isArray(patch[name])) {
      const oldRows = Array.isArray(previous[name])
        ? (previous[name] as RecordData[])
        : [];
      result[name] = (patch[name] as RecordData[]).map((row) =>
        mergeFields(
          field.fields,
          oldRows.find((old) => row.id && old.id === row.id) ?? {},
          row,
          locale,
        ),
      );
    }
  }
  return result;
}

function clean(value: unknown): unknown {
  if (value === null || value === undefined) return undefined;
  if (Array.isArray(value)) return value.map(clean);
  if (typeof value === 'object') {
    const entries = Object.entries(value)
      .filter(([key]) => key !== 'id')
      .map(([key, val]) => [key, clean(val)] as const)
      .filter(([, val]) => val !== undefined);
    return entries.length ? Object.fromEntries(entries) : undefined;
  }
  return value;
}

function canonical(kind: keyof typeof schemas, doc: RecordData): RecordData {
  const result: RecordData = {};
  for (const name of Object.keys(schemas[kind].shape)) result[name] = doc[name];
  result.status = doc._status ?? 'draft';
  if (kind === 'site-settings') result.locales = doc.supportedLocales;
  if (kind === 'pages' && Array.isArray(doc.values))
    result.values = doc.values.map((row) => object(row).value);
  // Canonical service relationships use slugs; existence and parent publication
  // are checked against the database separately, without fallback translations.
  if (kind === 'services')
    result.division = doc.division ? 'resolved-division' : undefined;
  return object(clean(result));
}

async function enforce(
  kind: ContentKind | GlobalKind,
  fields: Field[],
  data: RecordData,
  previous: RecordData,
  req: PayloadRequest,
): Promise<RecordData> {
  const locale = String(req.locale || 'fr');
  const merged = mergeFields(fields, previous, data, locale);
  const next = canonical(kind, merged);
  const before = canonical(kind, previous);
  const publisher = canPublish(req.user);
  const priorClaims = JSON.stringify(before.claims);
  if (
    !publisher &&
    (data._status === 'published' ||
      (data.publicationApproved === true && !previous.publicationApproved) ||
      (JSON.stringify(next.claims) !== priorClaims &&
        Array.isArray(next.claims) &&
        next.claims.some((c) => object(c).status === 'approved')))
  ) {
    throw new APIError(
      'Only a publisher or administrator may approve or publish content',
      403,
    );
  }
  const editable = (record: RecordData) =>
    clean(
      Object.fromEntries(
        fields
          .filter(
            (field) =>
              'name' in field &&
              ![
                '_status',
                'publicationApproved',
                'translationIssues',
                'createdAt',
                'updatedAt',
              ].includes(field.name),
          )
          .map((field) => {
            const name = 'name' in field ? field.name : '';
            return [name, record[name]];
          }),
      ),
    );
  const changed =
    Object.keys(previous).length > 0 &&
    JSON.stringify(editable(previous)) !== JSON.stringify(editable(merged));
  // A publisher must explicitly attest again in the write that changes copy.
  if (changed && !(publisher && explicitApproval.get(req))) {
    data.publicationApproved = false;
    data._status = 'draft';
    data.claims = (Array.isArray(merged.claims) ? merged.claims : []).map(
      (c) => ({
        ...object(c),
        status: 'pending',
        approvedBy: null,
        evidence: null,
      }),
    );
    next.publicationApproved = false;
    next.status = 'draft';
    next.claims = clean(data.claims);
  }
  const check = schemas[kind].safeParse(next);
  data.translationIssues = check.success
    ? []
    : check.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }));
  const claims = z.array(claimSchema).min(1).safeParse(next.claims);
  if (
    next.publicationApproved === true &&
    (!claims.success || claims.data.some((c) => c.status !== 'approved'))
  )
    throw new APIError(
      'Every claim requires explicit approval, reviewer and evidence',
      400,
    );
  const publishing = next.status === 'published';
  if (publishing) {
    if (next.publicationApproved !== true)
      throw new APIError('Publication requires explicit approval', 400);
    if (!check.success)
      throw new APIError(
        `Complete bilingual content required: ${check.error.issues.map((i) => i.path.join('.')).join(', ')}`,
        400,
      );
    if (
      kind === 'legal-documents' &&
      !claims.data?.some(
        (c) => c.category === 'legal' && c.status === 'approved',
      )
    )
      throw new APIError('Legal publication requires legal approval', 400);
  }
  if (kind === 'services' && merged.division) {
    const division = await req.payload.findByID({
      collection: 'divisions',
      id: merged.division as number,
      depth: 0,
      overrideAccess: true,
      req,
    });
    if (
      publishing &&
      (division._status !== 'published' || !division.publicationApproved)
    )
      throw new APIError(
        'Publish the parent division before publishing a service',
        400,
      );
  }
  for (const name of ['heroMedia', 'logo']) {
    if (publishing && merged[name]) {
      const media = await req.payload.findByID({
        collection: 'media',
        id: merged[name] as number,
        depth: 0,
        overrideAccess: true,
        req,
      });
      if (
        media._status !== 'published' ||
        !media.publicationApproved ||
        media.rightsStatus !== 'approved'
      )
        throw new APIError(
          'Referenced media must be published with approved rights',
          400,
        );
    }
  }
  if (kind === 'site-settings' && publishing) {
    for (const [feature, enabled] of Object.entries(object(merged.features))) {
      if (!enabled) continue;
      const category =
        feature === 'references'
          ? 'reference'
          : ['privacy', 'cookies', 'contactForm'].includes(feature)
            ? 'legal'
            : feature;
      if (
        !claims.success ||
        !claims.data.some(
          (c) => c.category === category && c.status === 'approved',
        )
      )
        throw new APIError(
          `Feature ${feature} requires evidenced ${category} approval before publication`,
          400,
        );
    }
  }
  return data;
}

export function collectionPublication(
  kind: ContentKind,
): CollectionBeforeChangeHook {
  return async ({ collection, data, originalDoc, req }) => {
    const previous = originalDoc?.id
      ? await req.payload.findByID({
          collection: kind,
          id: originalDoc.id,
          locale: 'all',
          fallbackLocale: false,
          depth: 0,
          draft: true,
          overrideAccess: true,
          req: { ...req },
        })
      : {};
    return enforce(kind, collection.fields, data, previous, req);
  };
}
export function globalPublication(kind: GlobalKind): GlobalBeforeChangeHook {
  return async ({ global, data, req }) => {
    // Global version snapshots need not contain an id, including the first draft.
    const previous = await req.payload.findGlobal({
      slug: kind,
      locale: 'all',
      fallbackLocale: false,
      depth: 0,
      draft: true,
      overrideAccess: true,
      req: { ...req },
    });
    return enforce(kind, global.fields, data, object(previous), req);
  };
}
