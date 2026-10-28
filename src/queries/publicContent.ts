import { z } from 'zod';
import type { Locale } from '../i18n/config';

const text = z.string().trim().min(1);
const section = z.object({
  title: text,
  body: text,
  link: text.nullish().transform((value) => value ?? undefined),
  eyebrow: text.nullish().transform((value) => value ?? undefined),
});
const meta = z.object({ title: text, description: text });
const common = { slug: text, order: z.number(), title: text, lead: text };
const editorial = { ...common, sections: z.array(section), meta };
const pageSchema = z.object({
  ...editorial,
  key: z.enum([
    'HOME',
    'COMPANY',
    'EXPERTISE',
    'SERVICES',
    'APPROACH',
    'FAQ',
    'CONTACT',
  ]),
  values: z.array(text).optional(),
});
const divisionSchema = z.object({
  ...editorial,
  code: text,
  heading: text,
  summary: text,
  cta: text,
  bottom: z.object({ title: text, body: text }),
});
const serviceSchema = z.object({
  ...editorial,
  division: text,
  catalogue: text,
  heading: text,
  summary: text,
  eyebrow: text,
  cta: text,
});
const faqSchema = z.object({
  slug: text,
  order: z.number(),
  question: text,
  answer: text,
});
export type PublicPage = Omit<z.infer<typeof pageSchema>, 'order'> & {
  order?: number;
};
export type PublicDivision = z.infer<typeof divisionSchema>;
export type PublicService = z.infer<typeof serviceSchema>;
export type PublicFaq = z.infer<typeof faqSchema>;
export type PublicSection = z.infer<typeof section>;
export type PublicContentInput = {
  pages: Record<string, unknown>[];
  divisions: Record<string, unknown>[];
  services: Record<string, unknown>[];
  faq: Record<string, unknown>[];
};

function localize(value: unknown, locale: Locale): unknown {
  if (Array.isArray(value)) return value.map((item) => localize(item, locale));
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    if ('fr' in record || 'en' in record) return record[locale];
    return Object.fromEntries(
      Object.entries(record).map(([key, item]) => [
        key,
        localize(item, locale),
      ]),
    );
  }
  return value;
}

/** Explicit projections are the only objects allowed across the client boundary.
 * Missing translations fail closed, never substitute another language. */
export function createPublicContentQueries(input: PublicContentInput) {
  function read<T>(
    rows: Record<string, unknown>[],
    locale: Locale,
    schema: z.ZodType<T>,
  ): T[] {
    return rows
      .filter(
        (row) =>
          (row.status ?? row._status) === 'published' &&
          row.publicationApproved === true,
      )
      .map((row) => {
        const localized = localize(row, locale) as Record<string, unknown>;
        return schema.safeParse({
          ...localized,
          ...('question' in (schema as z.ZodObject<z.ZodRawShape>).shape
            ? { question: localized.title, answer: localized.lead }
            : {}),
          ...(Array.isArray(localized.values)
            ? {
                values: localized.values.map((v) =>
                  typeof v === 'object' && v ? v.value : v,
                ),
              }
            : {}),
        });
      })
      .flatMap((result) => (result.success ? [result.data] : []));
  }
  const getDivisions = (locale: Locale) =>
    read(input.divisions, locale, divisionSchema).sort(
      (a, b) => a.order - b.order,
    );
  return {
    getPages: (locale: Locale) =>
      read(input.pages, locale, pageSchema).sort((a, b) => a.order - b.order),
    getDivisions,
    getServices: (locale: Locale) => {
      const parents = new Set(getDivisions(locale).map((d) => d.slug));
      return read(input.services, locale, serviceSchema)
        .filter((s) => parents.has(s.division))
        .sort((a, b) => a.order - b.order);
    },
    getFaq: (locale: Locale) =>
      read(input.faq, locale, faqSchema).sort((a, b) => a.order - b.order),
  };
}
export type PublicContentQueries = ReturnType<
  typeof createPublicContentQueries
>;
