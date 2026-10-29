import type { Locale } from '../../i18n/config';
import type { PublicContentQueries } from '../../queries/publicContent';
import { HomePage } from '../home/HomePage';
import { ServicesPage } from '../services/ServicesPage';
import { ContactForm } from '../contact/ContactForm';
import { CompanyPage, ApproachPage, PrototypeFaqPage, PrototypeExpertisePage, PrototypeContactPage, PrototypeDivisionDetail, PrototypeServiceDetail } from './PrototypePages';
import {
  PageHero,
  PageBreadcrumbs,
  ContentSections,
  ContactCallout,
} from './Sections';
import fr from '../../i18n/dictionaries/fr.json';
import en from '../../i18n/dictionaries/en.json';

export function PublicRouteContent({
  locale,
  path,
  queries,
}: {
  locale: Locale;
  path: string;
  queries: PublicContentQueries;
}) {
  const dictionary = locale === 'fr' ? fr : en;
  const divisions = queries.getDivisions(locale);
  const services = queries.getServices(locale);
  const contactLabel = dictionary.pages.CONTACT;
  const contactHref = `/${locale}/contact`;
  const division = path.startsWith('/poles/')
    ? divisions.find((d) => path === `/poles/${d.slug}`)
    : undefined;
  const service = path.startsWith('/services/')
    ? services.find((s) => path === `/services/${s.slug}`)
    : undefined;
  if (division)
    return <PrototypeDivisionDetail locale={locale} division={division} services={services.filter((s) => s.division === division.slug)} contactHref={contactHref} />;
  if (service)
    return <PrototypeServiceDetail locale={locale} service={service} division={divisions.find((d) => d.slug === service.division)!} related={services.filter((s) => s.slug !== service.slug && s.division === service.division)} contactHref={contactHref} />;
  const page = queries
    .getPages(locale)
    .find((p) => path === (p.key === 'HOME' ? '' : `/${p.slug}`));
  if (!page)
    return (
      <>
        <PageHero
          title={
            path === '/contact'
              ? 'Contact'
              : locale === 'fr'
                ? 'Publication à venir'
                : 'Publication coming soon'
          }
          lead={dictionary.placeholder}
        />
        {path === '/contact' && (
          <section className="wrap section">
            <ContactForm locale={locale} sourcePage={`/${locale}/contact`} />
          </section>
        )}
        {path !== '/contact' && (
          <ContactCallout label={contactLabel} href={contactHref} />
        )}
      </>
    );
  const shared = {
    locale,
    title: page.title,
    lead: page.lead,
    contactLabel,
    contactHref,
  };
  if (path === '')
    return (
      <HomePage
        locale={locale}
        page={page}
        divisions={divisions}
        services={services}
        labels={{
          divisions: dictionary.pages.EXPERTISE,
          services: dictionary.pages.SERVICES,
          discover: locale === 'fr' ? 'Découvrir' : 'Explore',
          contact: contactLabel,
        }}
        contactHref={contactHref}
      />
    );
  if (path === '/entreprise')
    return <CompanyPage locale={locale} page={page} contactHref={contactHref} />;
  if (path === '/approche')
    return <ApproachPage locale={locale} page={page} contactHref={contactHref} />;
  if (path === '/poles')
    return <PrototypeExpertisePage locale={locale} page={page} divisions={divisions} contactHref={contactHref} />;
  if (path === '/services')
    return (
      <ServicesPage
        {...shared}
        services={services}
        divisions={divisions}
        labels={
          locale === 'fr'
            ? {
                search: 'Rechercher un service',
                all: 'Tous les pôles',
                empty: 'Aucun service trouvé',
              }
            : {
                search: 'Search services',
                all: 'All divisions',
                empty: 'No service found',
              }
        }
      />
    );
  if (path === '/faq')
    return <PrototypeFaqPage locale={locale} page={page} items={queries.getFaq(locale)} contactHref={`${contactHref}?source=faq`} />;
  if (path === '/contact')
    return <PrototypeContactPage locale={locale} page={page} />;
  return (
    <>
      <PageBreadcrumbs locale={locale} title={page.title} />
      <PageHero title={page.title} lead={page.lead} variant="commitment" />
      <ContentSections sections={page.sections} />
      {path === '/contact' && (
        <section className="wrap section">
          <ContactForm locale={locale} sourcePage={`/${locale}/contact`} />
        </section>
      )}
      {page.values && (
        <section className="wrap section">
          <h2>{locale === 'fr' ? 'Nos valeurs' : 'Our values'}</h2>
          <ul className="public-values">
            {page.values.map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </section>
      )}
      {path !== '/contact' && (
        <ContactCallout
          label={contactLabel}
          href={`${contactHref}?source=${page.slug}`}
        />
      )}
    </>
  );
}
