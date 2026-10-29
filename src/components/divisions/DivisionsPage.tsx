import type { Locale } from '../../i18n/config';
import type { PublicDivision } from '../../queries/publicContent';
import { PageHero, PageBreadcrumbs, ContactCallout } from '../public/Sections';
import { DivisionCards } from './DivisionCards';
export function DivisionsPage({
  locale,
  title,
  lead,
  divisions,
  contactLabel,
  contactHref,
}: {
  locale: Locale;
  title: string;
  lead: string;
  divisions: PublicDivision[];
  contactLabel: string;
  contactHref: string;
}) {
  return (
    <>
      <PageBreadcrumbs locale={locale} title={title} />
      <PageHero title={title} lead={lead} />
      <section className="wrap section">
        <DivisionCards locale={locale} divisions={divisions} />
      </section>
      <ContactCallout label={contactLabel} href={contactHref} />
    </>
  );
}
