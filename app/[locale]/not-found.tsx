import { getLocale, getTranslations } from 'next-intl/server';
import { NotFoundContent } from '@/routing/NotFoundContent';
import { requireLocale } from '@/routing/seo';

export default async function NotFound() {
  const locale = requireLocale(await getLocale());
  const t = await getTranslations({ locale, namespace: 'notFound' });
  return (
    <NotFoundContent locale={locale} title={t('title')} home={t('home')} />
  );
}
