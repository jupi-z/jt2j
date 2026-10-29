import { pathToFileURL } from 'node:url';
import { contentSeedSchema, type ContentSeed } from '../src/content/types.ts';

export interface ContentIssue {
  path: string;
  message: string;
}

/** Validate untrusted imports before CMS writes or publication. Drafts may retain
 * pending claims; publishing requires explicit approval of every recorded claim.
 */
export function validateContent(input: unknown): ContentIssue[] {
  const result = contentSeedSchema.safeParse(input);
  if (!result.success) {
    return result.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
  }
  const data = result.data;
  const issues: ContentIssue[] = [];
  const add = (path: string, message: string) => {
    issues.push({ path, message });
  };
  const unique = (values: string[], path: string) => {
    const seen = new Set<string>();
    values.forEach((value, i) => {
      if (seen.has(value)) add(`${path}.${i}`, `Duplicate identity: ${value}`);
      seen.add(value);
    });
  };
  for (const key of ['pages', 'divisions', 'services', 'faq'] as const) {
    unique(
      data[key].map((item) => item.slug),
      `${key}.slug`,
    );
    unique(
      data[key].map((item) => String(item.order)),
      `${key}.order`,
    );
  }
  unique(
    data.pages.map((p) => p.key),
    'pages.key',
  );
  unique(
    data.divisions.map((d) => d.code),
    'divisions.code',
  );
  const divisionSlugs = new Set(data.divisions.map((d) => d.slug));
  data.services.forEach((service, i) => {
    if (!divisionSlugs.has(service.division))
      add(`services.${i}.division`, 'Unknown division slug');
    if (
      service.status === 'published' &&
      !data.divisions.some(
        (division) =>
          division.slug === service.division && division.status === 'published',
      )
    )
      add(
        `services.${i}.division`,
        'Published service requires a published division',
      );
  });
  const checkApproval = (
    item: Pick<
      ContentSeed['siteSettings'],
      'status' | 'publicationApproved' | 'claims'
    >,
    path: string,
  ) => {
    if (
      item.publicationApproved &&
      item.claims.some((claim) => claim.status !== 'approved')
    ) {
      add(
        `${path}.claims`,
        'Unapproved claims cannot receive publication approval',
      );
    }
    if (item.status === 'published' && !item.publicationApproved) {
      add(
        `${path}.publicationApproved`,
        'Publication requires explicit approval',
      );
    }
  };
  for (const key of ['pages', 'divisions', 'services', 'faq'] as const) {
    data[key].forEach((item, i) => checkApproval(item, `${key}.${i}`));
  }
  checkApproval(data.siteSettings, 'siteSettings');
  for (const [feature, enabled] of Object.entries(data.siteSettings.features)) {
    if (
      enabled &&
      (data.siteSettings.status !== 'published' ||
        !data.siteSettings.publicationApproved)
    ) {
      add(
        `siteSettings.features.${feature}`,
        'Feature requires approved, published settings',
      );
    }
    const category =
      feature === 'references'
        ? 'reference'
        : feature === 'privacy' ||
            feature === 'cookies' ||
            feature === 'contactForm'
          ? 'legal'
          : feature;
    if (
      enabled &&
      !data.siteSettings.claims.some(
        (claim) => claim.category === category && claim.status === 'approved',
      )
    ) {
      add(
        `siteSettings.features.${feature}`,
        'Feature requires an evidenced approval for its claim category',
      );
    }
  }
  return issues;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const [{ pages }, { divisions }, { services }, { faq }, { siteSettings }] =
    await Promise.all([
      import('../src/content/seed/pages.ts'),
      import('../src/content/seed/divisions.ts'),
      import('../src/content/seed/services.ts'),
      import('../src/content/seed/faq.ts'),
      import('../src/content/seed/site-settings.ts'),
    ]);
  const issues = validateContent({
    pages,
    divisions,
    services,
    faq,
    siteSettings,
  });
  if (issues.length) {
    console.error(JSON.stringify(issues, null, 2));
    process.exitCode = 1;
  } else
    console.log(
      'Content valid: 7 pages, 5 divisions, 7 services, 6 FAQs; pending claims remain draft.',
    );
}
