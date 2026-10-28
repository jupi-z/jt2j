import { renderRoute } from '@/routing/RouteSkeleton';
import { routeMetadata } from '@/routing/seo';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/contact'>) {
  return routeMetadata((await params).locale, '/contact');
}

export default async function Page({ params }: PageProps<'/[locale]/contact'>) {
  return renderRoute((await params).locale, '/contact');
}
