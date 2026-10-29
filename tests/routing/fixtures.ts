export const paths = [
  '',
  '/entreprise',
  '/poles',
  '/services',
  '/approche',
  '/faq',
  '/contact',
  '/poles/security-biometrics',
  '/poles/logistics-tracking',
  '/poles/hygiene-pest-control',
  '/poles/business-marketing',
  '/poles/travel-escapes',
  '/services/pest-control',
  '/services/cleaning',
  '/services/travel-tourism',
  '/services/disinfection-sanitation',
  '/services/facility-management',
  '/services/transport-logistics',
  '/services/trading-supply',
] as const;

export const siteOrigin = new URL(
  process.env.SITE_URL ?? 'http://localhost:3000',
).origin;
