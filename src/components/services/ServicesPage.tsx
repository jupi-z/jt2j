import type { ComponentProps } from 'react';
import { ServiceCatalogue } from './ServiceCatalogue';
import { PageHero, PageBreadcrumbs, ContactCallout } from '../public/Sections';
export function ServicesPage({
  title,
  lead,
  contactLabel,
  contactHref,
  ...catalogue
}: ComponentProps<typeof ServiceCatalogue> & {
  title: string;
  lead: string;
  contactLabel: string;
  contactHref: string;
}) {
  return (
    <>
      <PageBreadcrumbs locale={catalogue.locale} title={title} />
      <PageHero title={title} lead={lead} variant="hygiene" />
      <section className="wrap section">
        <ServiceCatalogue {...catalogue} />
      </section>
      <ContactCallout label={contactLabel} href={contactHref} />
    </>
  );
}
