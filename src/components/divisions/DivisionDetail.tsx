import type { Locale } from '../../i18n/config';
import type {
  PublicDivision,
  PublicService,
} from '../../queries/publicContent';
import {
  PageHero,
  PageBreadcrumbs,
  ContentSections,
  ContactCallout,
} from '../public/Sections';
import { ServiceCards } from '../services/ServiceCards';
import type { ArtworkVariant } from '../art/AbstractArtwork';
const variants: Record<string, ArtworkVariant> = {
  SEC: 'security',
  LOG: 'logistics',
  HYG: 'hygiene',
  BIZ: 'business',
  TRV: 'travel',
};
export function DivisionDetail({
  locale,
  division,
  services,
  breadcrumbs,
  contactLabel,
  contactHref,
}: {
  locale: Locale;
  division: PublicDivision;
  services: PublicService[];
  breadcrumbs: { home: string; divisions: string };
  contactLabel: string;
  contactHref: string;
}) {
  return (
    <>
      <PageBreadcrumbs
        locale={locale}
        title={division.title}
        parent={{ label: breadcrumbs.divisions, href: `/${locale}/poles` }}
      />
      <PageHero
        title={division.title}
        lead={division.lead}
        variant={variants[division.code]}
      />
      <section className="wrap section">
        <h2>{division.heading}</h2>
        <p>{division.summary}</p>
      </section>
      <ContentSections sections={division.sections} />
      {services.length > 0 && (
        <section className="wrap section">
          <h2>{locale === 'fr' ? 'Services associés' : 'Related services'}</h2>
          <ServiceCards locale={locale} services={services} />
        </section>
      )}
      <ContactCallout
        label={contactLabel}
        href={contactHref}
        title={division.bottom.title}
        body={division.bottom.body}
      />
    </>
  );
}
