export const dynamic = 'force-dynamic';
import { renderRoute } from '@/routing/PublicRoute';
import { routeMetadata } from '@/routing/seo';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/entreprise'>) {
  return routeMetadata((await params).locale, '/entreprise');
}

export default async function Page({
  params,
}: PageProps<'/[locale]/entreprise'>) {
  return renderRoute((await params).locale, '/entreprise');
}
