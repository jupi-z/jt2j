import type { Locale } from '../../i18n/config';
import type {
  PublicPage,
  PublicDivision,
  PublicService,
} from '../../queries/publicContent';
import { PageHero, ContentSections, ContactCallout } from '../public/Sections';
import { DivisionCards } from '../divisions/DivisionCards';
import { ServiceCards } from '../services/ServiceCards';
import { LinkArrow } from '../ui/LinkArrow';
export function HomePage({
  locale,
  page,
  divisions,
  services,
  labels,
  contactHref,
}: {
  locale: Locale;
  page: PublicPage;
  divisions: PublicDivision[];
  services: PublicService[];
  labels: {
    divisions: string;
    services: string;
    discover: string;
    contact: string;
  };
  contactHref: string;
}) {
  return (
    <>
      <PageHero title={page.title} lead={page.lead} />
      <section className="wrap section">
        <h2>{labels.divisions}</h2>
        <DivisionCards locale={locale} divisions={divisions} />
        <LinkArrow href={`/${locale}/poles`}>{labels.discover}</LinkArrow>
      </section>
      <section className="wrap section">
        <h2>{labels.services}</h2>
        <ServiceCards locale={locale} services={services} />
        <LinkArrow href={`/${locale}/services`}>{labels.discover}</LinkArrow>
      </section>
      <ContentSections sections={page.sections} />
      <section className="wrap actions">
        <LinkArrow href={`/${locale}/entreprise`}>
          {locale === 'fr' ? 'Notre entreprise' : 'Our company'}
        </LinkArrow>
        <LinkArrow href={`/${locale}/approche`}>
          {locale === 'fr' ? 'Notre approche' : 'Our approach'}
        </LinkArrow>
      </section>
      <ContactCallout label={labels.contact} href={contactHref} />
    </>
  );
}
