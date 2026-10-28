import { renderRoute } from '@/routing/RouteSkeleton';
import { routeMetadata } from '@/routing/seo';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/services'>) {
  return routeMetadata((await params).locale, '/services');
}

export default async function Page({
  params,
}: PageProps<'/[locale]/services'>) {
  return renderRoute((await params).locale, '/services');
}
