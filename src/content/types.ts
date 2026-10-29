import { z } from 'zod';

export const locales = ['fr', 'en'] as const;
const requiredText = z
  .string()
  .trim()
  .min(1, 'Required text must not be empty');
export const localizedTextSchema = z.strictObject({
  fr: requiredText,
  en: requiredText,
});
export type LocalizedText = z.infer<typeof localizedTextSchema>;

// Approval covers the entire bilingual record, including metadata. These records
// are editorial attestations, not automatic verification of factual accuracy.
export const claimSchema = z
  .strictObject({
    category: z.enum([
      'institutional',
      'capability',
      'contact',
      'leadership',
      'reference',
      'legal',
    ]),
    source: requiredText,
    status: z.enum(['pending', 'approved']),
    approvedBy: requiredText.optional(),
    evidence: requiredText.optional(),
  })
  .superRefine((claim, ctx) => {
    if (claim.status === 'approved' && (!claim.approvedBy || !claim.evidence)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Approved claims require a reviewer and evidence',
      });
    }
  });
export type ClaimSeed = z.infer<typeof claimSchema>;

const publication = {
  status: z.enum(['draft', 'published']),
  publicationApproved: z.boolean(),
  claims: z
    .array(claimSchema)
    .min(1, 'An explicit claim inventory is required'),
};
const slug = requiredText.regex(
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  'Use a canonical URL slug',
);
const sectionSchema = z.strictObject({
  title: localizedTextSchema,
  body: localizedTextSchema,
  link: localizedTextSchema.optional(),
  eyebrow: localizedTextSchema.optional(),
});
const common = {
  ...publication,
  slug,
  order: z.number().int().positive(),
  title: localizedTextSchema,
  lead: localizedTextSchema,
};
const editorialContent = {
  ...common,
  sections: z.array(sectionSchema),
  meta: z.strictObject({
    title: localizedTextSchema,
    description: localizedTextSchema,
  }),
};

export const pageSeedSchema = z.strictObject({
  ...editorialContent,
  key: z.enum([
    'HOME',
    'COMPANY',
    'EXPERTISE',
    'SERVICES',
    'APPROACH',
    'CONTACT',
    'FAQ',
  ]),
  values: z.array(localizedTextSchema).optional(),
});
export type PageSeed = z.infer<typeof pageSeedSchema>;

export const divisionSeedSchema = z.strictObject({
  ...editorialContent,
  code: requiredText,
  heading: localizedTextSchema,
  summary: localizedTextSchema,
  cta: localizedTextSchema,
  bottom: z.strictObject({
    title: localizedTextSchema,
    body: localizedTextSchema,
  }),
});
export type DivisionSeed = z.infer<typeof divisionSeedSchema>;

export const serviceSeedSchema = z.strictObject({
  ...editorialContent,
  // Stable canonical division slug; CMS seed code resolves this to a database ID.
  division: slug,
  catalogue: requiredText,
  heading: localizedTextSchema,
  summary: localizedTextSchema,
  eyebrow: localizedTextSchema,
  cta: localizedTextSchema,
  // Internal instructions must not be rendered as public content.
  editorialNotes: localizedTextSchema,
});
export type ServiceSeed = z.infer<typeof serviceSeedSchema>;

// FAQ title is the question; lead is the full answer, without duplicate fields.
export const faqSeedSchema = z.strictObject(common);
export type FaqSeed = z.infer<typeof faqSeedSchema>;

export const siteSettingsSeedSchema = z.strictObject({
  ...publication,
  name: localizedTextSchema,
  tagline: localizedTextSchema,
  description: localizedTextSchema,
  defaultLocale: z.literal('fr'),
  locales: z.tuple([z.literal('fr'), z.literal('en')]),
  email: z.email(),
  phone: requiredText.regex(/^\+[1-9]\d{7,14}$/),
  socialHandle: requiredText,
  features: z.strictObject({
    leadership: z.boolean(),
    references: z.boolean(),
    legal: z.boolean(),
    privacy: z.boolean(),
    cookies: z.boolean(),
    contactForm: z.boolean(),
  }),
});
export type SiteSettingsSeed = z.infer<typeof siteSettingsSeedSchema>;

export const contentSeedSchema = z.strictObject({
  pages: z.array(pageSeedSchema).length(7),
  divisions: z.array(divisionSeedSchema).length(5),
  services: z.array(serviceSeedSchema).length(7),
  faq: z.array(faqSeedSchema).min(1),
  siteSettings: siteSettingsSeedSchema,
});
export type ContentSeed = z.infer<typeof contentSeedSchema>;
