import { pages } from '@/content/seed/pages';
import { divisions } from '@/content/seed/divisions';
import { services } from '@/content/seed/services';

// Seed identities define the architecture. Never expose draft editorial fields.
export const pageRoutes = pages.map(({ key, slug }) => ({
  path: key === 'HOME' ? '' : `/${slug}`,
  message: `pages.${key}`,
}));
export const divisionRoutes = divisions.map(({ slug, code }) => ({
  slug,
  path: `/poles/${slug}`,
  message: `divisions.${code}`,
}));
export const serviceRoutes = services.map(({ slug }) => ({
  slug,
  path: `/services/${slug}`,
  message: `services.${slug}`,
}));
export const publicRoutes = [
  ...pageRoutes,
  ...divisionRoutes,
  ...serviceRoutes,
];

export function findRoute(path: string) {
  return publicRoutes.find((route) => route.path === path);
}
