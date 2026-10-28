export type PublicationCheckKey =
  | 'translations'
  | 'seo'
  | 'legal'
  | 'mediaRights';

export type PublicationCheck = {
  key: PublicationCheckKey;
  label: string;
  complete: boolean;
  details: string;
};

export type PublicationChecklistOptions = {
  requireSEO?: boolean;
  requireLegal?: boolean;
};

type AnyRecord = Record<string, unknown>;

const locales = ['fr', 'en'] as const;

const localizedComplete = (value: unknown) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const record = value as AnyRecord;
  return locales.every(
    (locale) => typeof record[locale] === 'string' && record[locale].trim(),
  );
};

const translationComplete = (data: AnyRecord) => {
  const required = ['title', 'lead'];
  if (!required.every((field) => localizedComplete(data[field]))) return false;
  if (Array.isArray(data.sections)) {
    if (data.sections.some((value) => {
      const section = value && typeof value === 'object'
        ? (value as AnyRecord)
        : {};
      return !localizedComplete(section.title) || !localizedComplete(section.body);
    }))
      return false;
  }
  return true;
};

const seoComplete = (data: AnyRecord, required: boolean) => {
  const seo = data.meta ?? data.defaultSEO;
  if (!required && !seo) return true;
  const seoRecord = seo && typeof seo === 'object' ? (seo as AnyRecord) : {};
  return Boolean(
    localizedComplete(seoRecord.title) &&
      localizedComplete(seoRecord.description),
  );
};

const legalComplete = (data: AnyRecord, required: boolean) =>
  !required ||
  Array.isArray(data.claims) &&
  data.claims.some((value) => {
    const claim = value && typeof value === 'object' ? (value as AnyRecord) : {};
    return (
      claim.category === 'legal' &&
      claim.status === 'approved' &&
      typeof claim.approvedBy === 'string' &&
      claim.approvedBy.trim().length > 0 &&
      typeof claim.evidence === 'string' &&
      claim.evidence.trim().length > 0
    );
  });

const mediaRightsComplete = (data: AnyRecord) => {
  const media = data.heroMedia ?? data.logo;
  if (!media) return true;
  const mediaRecord =
    media && typeof media === 'object' ? (media as AnyRecord) : {};
  return (
    mediaRecord._status === 'published' &&
    mediaRecord.publicationApproved === true &&
    mediaRecord.rightsStatus === 'approved' &&
    typeof mediaRecord.rightsEvidence === 'string' &&
    mediaRecord.rightsEvidence.trim().length > 0
  );
};

export const getPublicationChecklist = (
  input: unknown,
  options: PublicationChecklistOptions = {},
): PublicationCheck[] => {
  const data = (input && typeof input === 'object' ? input : {}) as AnyRecord;
  const requireSEO = options.requireSEO ?? true;
  const requireLegal = options.requireLegal ?? true;
  return [
    {
      key: 'translations',
      label: 'Translations FR / EN',
      complete: translationComplete(data),
      details: 'Required localized editorial fields are complete in both locales.',
    },
    {
      key: 'seo',
      label: 'SEO metadata',
      complete: seoComplete(data, requireSEO),
      details: 'SEO title and description are complete in both locales.',
    },
    {
      key: 'legal',
      label: 'Legal approval',
      complete: legalComplete(data, requireLegal),
      details: 'A legal claim has an approved reviewer and evidence.',
    },
    {
      key: 'mediaRights',
      label: 'Media rights',
      complete: mediaRightsComplete(data),
      details: 'Referenced media is published and has approved rights evidence.',
    },
  ];
};

export const isPublicationReady = (
  input: unknown,
  options?: PublicationChecklistOptions,
) => getPublicationChecklist(input, options).every((item) => item.complete);
