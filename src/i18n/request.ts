import * as rootParams from 'next/root-params';
import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { isLocale } from './config';

const dictionaries = {
  fr: () => import('./dictionaries/fr.json').then((module) => module.default),
  en: () => import('./dictionaries/en.json').then((module) => module.default),
};

export default getRequestConfig(async ({ locale }) => {
  const value = locale ?? (await rootParams.locale());
  if (!isLocale(value)) notFound();
  return {
    locale: value,
    messages: await dictionaries[value](),
    timeZone: 'Africa/Lubumbashi',
  };
});
