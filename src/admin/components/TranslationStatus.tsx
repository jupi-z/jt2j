'use client';

import type { ReactNode } from 'react';

export type TranslationStatusValue = {
  complete: boolean;
  missing: string[];
};

export const getTranslationStatus = (value: unknown): TranslationStatusValue => {
  const record = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  const missing = ['fr', 'en'].filter(
    (locale) => typeof record[locale] !== 'string' || !record[locale].trim(),
  );
  return { complete: missing.length === 0, missing };
};

export function TranslationStatus({ value }: { value?: unknown }): ReactNode {
  const status = getTranslationStatus(value);
  return (
    <span data-translation-status={status.complete ? 'complete' : 'incomplete'}>
      {status.complete ? 'FR / EN complets' : `Traduction manquante: ${status.missing.join(', ')}`}
    </span>
  );
}
