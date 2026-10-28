import { renderRoute } from '@/routing/RouteSkeleton';
import { routeMetadata } from '@/routing/seo';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/poles'>) {
  return routeMetadata((await params).locale, '/poles');
}

export default async function Page({ params }: PageProps<'/[locale]/poles'>) {
  return renderRoute((await params).locale, '/poles');
}
