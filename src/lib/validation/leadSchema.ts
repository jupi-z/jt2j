import { z } from 'zod';

const optionalTrimmedText = (max: number) =>
  z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z.string().trim().max(max).optional(),
  );

const phoneSchema = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  z
    .string()
    .trim()
    .max(40)
    .refine((value) => value.replace(/\D/g, '').length >= 7 && value.replace(/\D/g, '').length <= 15, {
      message: 'Enter a valid phone number.',
    })
    .optional(),
);

export const leadRequestSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
    phone: phoneSchema,
    company: optionalTrimmedText(160),
    message: z.string().trim().min(10).max(5000),
    locale: z.enum(['fr', 'en']),
    sourcePage: z
      .string()
      .trim()
      .max(240)
      .regex(/^\/(?:fr|en)(?:\/[^\s?#]*)?(?:\?[^\s#]*)?(?:#[^\s]*)?$/, {
        message: 'Source page must be a relative JT2J page.',
      }),
    division: optionalTrimmedText(100),
    service: optionalTrimmedText(100),
    consent: z.literal(true),
    website: z.string().max(200).default(''),
  })
  .strict();

export type LeadRequest = z.infer<typeof leadRequestSchema>;
