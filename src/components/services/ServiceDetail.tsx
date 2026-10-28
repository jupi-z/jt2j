import type { Locale } from '../../i18n/config';
import type {
  PublicService,
  PublicDivision,
} from '../../queries/publicContent';
import {
  PageHero,
  PageBreadcrumbs,
  ContentSections,
  ContactCallout,
} from '../public/Sections';
import { LinkArrow } from '../ui/LinkArrow';
export function ServiceDetail({
  locale,
  service,
  division,
  related,
}: {
  locale: Locale;
  service: PublicService;
  division: PublicDivision;
  related: PublicService[];
}) {
  return (
    <>
      <PageBreadcrumbs
        locale={locale}
        title={service.title}
        parent={{
          label: locale === 'fr' ? 'Services' : 'Services',
          href: `/${locale}/services`,
        }}
      />
      <PageHero
        title={service.title}
        lead={service.lead}
        variant="commitment"
      />
      <section className="wrap section">
        <p className="eyebrow">{service.eyebrow}</p>
        <h2>{service.heading}</h2>
        <p>{service.summary}</p>
        <LinkArrow href={`/${locale}/poles/${division.slug}`}>
          {division.title}
        </LinkArrow>
      </section>
      <ContentSections sections={service.sections} />
      {related.length > 0 && (
        <section className="wrap section">
          <h2>{locale === 'fr' ? 'À découvrir aussi' : 'Explore also'}</h2>
          <ul>
            {related.map((item) => (
              <li key={item.slug}>
                <LinkArrow href={`/${locale}/services/${item.slug}`}>
                  {item.title}
                </LinkArrow>
              </li>
            ))}
          </ul>
        </section>
      )}
      <ContactCallout
        label={service.cta}
        href={`/${locale}/contact?service=${encodeURIComponent(service.slug)}&division=${encodeURIComponent(division.slug)}`}
      />
    </>
  );
}
