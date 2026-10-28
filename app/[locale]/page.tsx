export const dynamic = 'force-dynamic';
import { renderRoute } from '@/routing/PublicRoute';
import { routeMetadata } from '@/routing/seo';

export async function generateMetadata({ params }: PageProps<'/[locale]'>) {
  return routeMetadata((await params).locale, '');
}

export default async function Page({ params }: PageProps<'/[locale]'>) {
  return renderRoute((await params).locale, '');
}
