/** Offline authoring tool only. Parses inert JSON; never executes or imports HTML. */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { format } from 'prettier';
import { z } from 'zod';
import {
  contentSeedSchema,
  type ContentSeed,
  type ClaimSeed,
} from '../src/content/types.ts';
import { validateContent } from './validate-content.ts';

const rawSection = z.object({
  title: z.string(),
  body: z.string(),
  link: z.string().optional(),
  eyebrow: z.string().optional(),
});
const rawCopy = z.object({
  h1: z.string(),
  lead: z.string(),
  meta: z.tuple([z.string(), z.string()]),
  sections: z.array(rawSection).optional(),
  values: z.array(z.string()).optional(),
  cta: z.string().optional(),
  short: z.string().optional(),
  eyebrow: z.string().optional(),
  note: z.string().optional(),
  bottom: z.object({ title: z.string(), body: z.string() }).optional(),
  items: z.array(z.tuple([z.string(), z.string()])).optional(),
});
const rawEntity = z.object({
  slug: z.string(),
  order: z.number(),
  title: z.object({ fr: z.string(), en: z.string() }),
  fr: rawCopy,
  en: rawCopy,
});
const rawSchema = z.object({
  sourceName: z.string(),
  source: z.string(),
  micro: z.record(z.string(), z.object({ fr: z.string(), en: z.string() })),
  divisions: z.array(rawEntity.extend({ code: z.string() })),
  services: z.array(
    rawEntity.extend({ division: z.string(), catalogue: z.string() }),
  ),
  pages: z.object({
    HOME: rawCopyPair(),
    COMPANY: rawCopyPair(),
    EXPERTISE: rawCopyPair(),
    SERVICES: rawCopyPair(),
    APPROACH: rawCopyPair(),
    CONTACT: rawCopyPair(),
    FAQ: rawCopyPair(),
  }),
});
function rawCopyPair() {
  return z.object({ fr: rawCopy, en: rawCopy });
}
type CopyPair = z.infer<ReturnType<typeof rawCopyPair>>;
const localized = (fr: unknown, en: unknown) => ({ fr, en });

function sections(pair: CopyPair) {
  const fr = pair.fr.sections ?? [];
  const en = pair.en.sections ?? [];
  if (fr.length !== en.length)
    throw new Error('Section translation counts differ');
  return fr.map((section, i) => ({
    title: localized(section.title, en[i].title),
    body: localized(section.body, en[i].body),
    // Omit optional fields only when BOTH translations are blank/absent.
    ...(section.link || en[i].link
      ? { link: localized(section.link, en[i].link) }
      : {}),
    ...(section.eyebrow || en[i].eyebrow
      ? { eyebrow: localized(section.eyebrow, en[i].eyebrow) }
      : {}),
  }));
}

function copy(pair: CopyPair) {
  return {
    title: localized(pair.fr.h1, pair.en.h1),
    lead: localized(pair.fr.lead, pair.en.lead),
    sections: sections(pair),
    meta: {
      title: localized(pair.fr.meta[0], pair.en.meta[0]),
      description: localized(pair.fr.meta[1], pair.en.meta[1]),
    },
  };
}

export function extractPrototypeContent(html: string): ContentSeed {
  const matches = [
    ...html.matchAll(
      /<script\b(?=[^>]*\bid=["']site-data["'])(?=[^>]*\btype=["']application\/json["'])[^>]*>([\s\S]*?)<\/script\s*>/gi,
    ),
  ];
  if (matches.length !== 1)
    throw new Error('Expected exactly one inert #site-data JSON block');
  const data = rawSchema.parse(JSON.parse(matches[0][1]));
  const publication = (category: ClaimSeed['category'], pointer: string) => ({
    status: 'draft' as const,
    publicationApproved: false,
    claims: [
      {
        category,
        source: `${data.sourceName}; docs/reference/JT2J_Prestige_Prototype.html#site-data/${pointer}`,
        status: 'pending' as const,
      },
    ],
  });
  const pageSlugs = {
    HOME: 'home',
    COMPANY: 'entreprise',
    EXPERTISE: 'poles',
    SERVICES: 'services',
    APPROACH: 'approche',
    CONTACT: 'contact',
    FAQ: 'faq',
  } as const;
  const pages = (Object.keys(pageSlugs) as (keyof typeof pageSlugs)[]).map(
    (key, i) => {
      const pair = data.pages[key];
      const content = copy(pair);
      // The reference deliberately leaves the FAQ introduction empty in BOTH
      // locales. Reuse its own translated SEO description, not invented copy.
      if (key === 'FAQ' && pair.fr.lead === '' && pair.en.lead === '')
        content.lead = content.meta.description;
      const frValues = pair.fr.values ?? [];
      const enValues = pair.en.values ?? [];
      if (frValues.length !== enValues.length)
        throw new Error('Value translation counts differ');
      return {
        key,
        slug: pageSlugs[key],
        order: i + 1,
        ...content,
        ...(frValues.length
          ? {
              values: frValues.map((value, n) => localized(value, enValues[n])),
            }
          : {}),
        ...publication(
          key === 'CONTACT' ? 'contact' : 'institutional',
          `pages/${key}`,
        ),
      };
    },
  );
  const divisions = data.divisions.map((division) => ({
    ...copy(division),
    code: division.code,
    slug: division.slug,
    order: division.order,
    title: division.title,
    heading: localized(division.fr.h1, division.en.h1),
    summary: localized(division.fr.short, division.en.short),
    cta: localized(division.fr.cta, division.en.cta),
    bottom: {
      title: localized(division.fr.bottom?.title, division.en.bottom?.title),
      body: localized(division.fr.bottom?.body, division.en.bottom?.body),
    },
    ...publication('capability', `divisions/${division.code}`),
  }));
  const services = data.services.map((service) => ({
    ...copy(service),
    slug: service.slug,
    order: service.order,
    title: service.title,
    division: data.divisions.find((d) => d.code === service.division)?.slug,
    catalogue: service.catalogue,
    heading: localized(service.fr.h1, service.en.h1),
    summary: localized(service.fr.short, service.en.short),
    cta: localized(service.fr.cta, service.en.cta),
    eyebrow: localized(service.fr.eyebrow, service.en.eyebrow),
    editorialNotes: localized(service.fr.note, service.en.note),
    ...publication('capability', `services/${service.slug}`),
  }));
  const frFaq = data.pages.FAQ.fr.items ?? [];
  const enFaq = data.pages.FAQ.en.items ?? [];
  if (frFaq.length !== enFaq.length)
    throw new Error('FAQ translation counts differ');
  const faq = frFaq.map(([question, answer], i) => ({
    slug: `faq-${i + 1}`,
    order: i + 1,
    title: localized(question, enFaq[i][0]),
    lead: localized(answer, enFaq[i][1]),
    ...publication('institutional', `pages/FAQ/items/${i}`),
  }));
  // Contact information lives in the embedded source, not in rendering code.
  const contacts =
    data.source.match(/\*\*P\. 11 \(contacts\)\*\* : ([^\n]+)/)?.[1] ?? '';
  const siteSettings = {
    name: data.micro['brand.name'],
    tagline: data.micro['brand.tagline'],
    description: data.micro['meta.siteDescription'],
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    email: contacts.match(/`([^`\s]+@[^`\s]+\.[^`\s]+)`/)?.[1],
    phone: contacts.match(/`(\+\d+)`/)?.[1],
    socialHandle: contacts.match(/`(@\w+)`/)?.[1],
    features: {
      leadership: false,
      references: false,
      legal: false,
      privacy: false,
      cookies: false,
      contactForm: false,
    },
    ...publication('contact', 'source/annex-23/contacts'),
  };
  const seeds = contentSeedSchema.parse({
    pages,
    divisions,
    services,
    faq,
    siteSettings,
  });
  const issues = validateContent(seeds);
  if (issues.length) throw new Error(JSON.stringify(issues));
  return seeds;
}

/** Stable output: no dates, machine paths or runtime state. */
export async function serializeSeeds(
  seeds: ContentSeed,
): Promise<Record<string, string>> {
  const modules: Record<string, string> = {};
  const entries = [
    ['pages', 'pages', 'PageSeed', seeds.pages],
    ['divisions', 'divisions', 'DivisionSeed', seeds.divisions],
    ['services', 'services', 'ServiceSeed', seeds.services],
    ['faq', 'faq', 'FaqSeed', seeds.faq],
    ['site-settings', 'siteSettings', 'SiteSettingsSeed', seeds.siteSettings],
  ] as const;
  for (const [file, name, type, value] of entries) {
    modules[`${file}.ts`] = await format(
      `// Generated from docs/reference/JT2J_Prestige_Prototype.html by scripts/extract-prototype-content.ts.\n// Authoring snapshot only; all content awaits editorial approval.\nimport type { ${type} } from '../types';\n\nexport const ${name}: ${type}${Array.isArray(value) ? '[]' : ''} = ${JSON.stringify(value, null, 2)};\n`,
      { parser: 'typescript', singleQuote: true, trailingComma: 'all' },
    );
  }
  return modules;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const args = process.argv.slice(2);
  if (args.length !== 1 || !['--check', '--write'].includes(args[0])) {
    throw new Error(
      'Usage: node scripts/extract-prototype-content.ts --check|--write',
    );
  }
  const html = await readFile(
    new URL('../docs/reference/JT2J_Prestige_Prototype.html', import.meta.url),
    'utf8',
  );
  const modules = await serializeSeeds(extractPrototypeContent(html));
  const directory = new URL('../src/content/seed/', import.meta.url);
  if (args[0] === '--write') await mkdir(directory, { recursive: true });
  for (const [file, source] of Object.entries(modules)) {
    const path = new URL(file, directory);
    if (args[0] === '--write') await writeFile(path, source, 'utf8');
    else if ((await readFile(path, 'utf8')) !== source)
      throw new Error(`Seed drift: ${file}`);
  }
  console.log(
    args[0] === '--write'
      ? 'Canonical seed modules written.'
      : 'Canonical seeds match the preserved prototype exactly.',
  );
}
