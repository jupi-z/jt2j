import { renderRoute } from '@/routing/RouteSkeleton';
import { routeMetadata } from '@/routing/seo';

export async function generateMetadata({ params }: PageProps<'/[locale]/faq'>) {
  return routeMetadata((await params).locale, '/faq');
}

export default async function Page({ params }: PageProps<'/[locale]/faq'>) {
  return renderRoute((await params).locale, '/faq');
}
