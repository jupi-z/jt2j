export const dynamic = 'force-dynamic';
import { serviceRoutes } from '@/routing/catalog';
import { renderRoute } from '@/routing/PublicRoute';
import { routeMetadata } from '@/routing/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return serviceRoutes.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/services/[slug]'>) {
  const { locale, slug } = await params;
  return routeMetadata(locale, `/services/${slug}`);
}

export default async function Page({
  params,
}: PageProps<'/[locale]/services/[slug]'>) {
  const { locale, slug } = await params;
  return renderRoute(locale, `/services/${slug}`);
}
