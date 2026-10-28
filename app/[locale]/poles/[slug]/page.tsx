import { divisionRoutes } from '@/routing/catalog';
import { renderRoute } from '@/routing/RouteSkeleton';
import { routeMetadata } from '@/routing/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return divisionRoutes.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/poles/[slug]'>) {
  const { locale, slug } = await params;
  return routeMetadata(locale, `/poles/${slug}`);
}

export default async function Page({
  params,
}: PageProps<'/[locale]/poles/[slug]'>) {
  const { locale, slug } = await params;
  return renderRoute(locale, `/poles/${slug}`);
}
