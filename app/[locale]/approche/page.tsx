export const dynamic = 'force-dynamic';
import { renderRoute } from '@/routing/PublicRoute';
import { routeMetadata } from '@/routing/seo';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/approche'>) {
  return routeMetadata((await params).locale, '/approche');
}

export default async function Page({
  params,
}: PageProps<'/[locale]/approche'>) {
  return renderRoute((await params).locale, '/approche');
}
