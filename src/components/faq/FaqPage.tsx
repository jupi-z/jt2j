import type { Locale } from '../../i18n/config';
import type { PublicFaq } from '../../queries/publicContent';
import { PageHero, PageBreadcrumbs, ContactCallout } from '../public/Sections';
export function FaqPage({
  locale,
  title,
  lead,
  items,
  contactLabel,
  contactHref,
}: {
  locale: Locale;
  title: string;
  lead: string;
  items: PublicFaq[];
  contactLabel: string;
  contactHref: string;
}) {
  return (
    <>
      <PageBreadcrumbs locale={locale} title={title} />
      <PageHero title={title} lead={lead} variant="commitment" />
      <section className="wrap section public-faq" aria-label={title}>
        {items.map((item) => (
          <details key={item.slug}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </section>
      <ContactCallout label={contactLabel} href={contactHref} />
    </>
  );
}
